"use client";

import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import {
  MeshReflectorMaterial,
  OrbitControls,
  Html,
} from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { Model as NeoModel } from "./NeoModel";
import ArchitectModel from "./ArchitectModel";
import InteractiveTerminal from "./InteractiveTerminal";

// ─── Constants ────────────────────────────────────────────────────────────────

// Indices of monitors that will be replaced with real interactive HTML
// Choosing some front-row central monitors for easiest discovery
const INTERACTIVE_IDS = [0, 1, 2, 42, 84, 126]; 

// ─── Helpers ──────────────────────────────────────────────────────────────────

function createRoundedPlaneGeo(width: number, height: number, radius: number) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x, y + radius);
  shape.lineTo(x, y + height - radius);
  shape.quadraticCurveTo(x, y + height, x + radius, y + height);
  shape.lineTo(x + width - radius, y + height);
  shape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
  shape.lineTo(x + width, y + radius);
  shape.quadraticCurveTo(x + width, y, x + width - radius, y);
  shape.lineTo(x + radius, y);
  shape.quadraticCurveTo(x, y, x, y + radius);
  const geo = new THREE.ShapeGeometry(shape);

  // Fix default ShapeGeometry UV mapping so it spans exactly [0.0, 1.0] across the bounding box
  const uvs = geo.attributes.uv;
  for (let i = 0; i < uvs.count; i++) {
    const vx = uvs.getX(i);
    const vy = uvs.getY(i);
    uvs.setXY(i, (vx - x) / width, (vy - y) / height);
  }
  uvs.needsUpdate = true;

  return geo;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface MonitorPosition {
  x: number;
  y: number;
  z: number;
  angle: number;
  lookAtY: number;
}

interface ActiveScreen {
  instanceId: number;
  worldPosition: THREE.Vector3;
  lookAtPosition: THREE.Vector3;
  videoSrc: string;
}

interface ArchitectSceneProps {
  /** Called when the door is clicked — navigate to your portfolio/resume URL */
  onDoorClick: () => void;
  /**
   * Pool of video sources to cycle across monitors.
   * Monitors are assigned via: videos[instanceId % videos.length]
   * Drop in your Focusee .mp4 paths here, e.g. ["/agents/agent-1.mp4", ...]
   */
  videoPaths?: string[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const RADIUS = 14;
// Increased packing density since cases are now narrower
const ITEMS_PER_ROW = 85;
const ROWS = 20;
const COUNT_LIMIT = 1200;
// Sphere centred at the camera [0, SPHERE_Y, 0] — every monitor is exactly RADIUS away
// so they all appear the same physical size regardless of latitude
const SPHERE_Y = 1.6;
const PHI_START = -5;  // exactly calibrated so the CRT casings perfectly kiss the Y=0 floor
const PHI_END = 55;

// ─── EASY-TWEAK POSITIONING CONTROLS ──────────────────────────────────────────
// Change these offsets to visually re-arrange the characters and camera!
// The door is at roughly Z = -19.6
export const ARCHITECT_CONFIG = {
  // Camera sits at the center of the monitor dome
  cameraHome: new THREE.Vector3(0, 1.6, 0),
  cameraLookAtHome: new THREE.Vector3(0, 1.6, -2), // looking straight ahead with a deep enough focal point to not snap FOV
  cameraLerpSpeed: 0.05,

  // Neo on the LEFT side, angled slightly right toward Architect
  // [X (left/right), Y (up/down), Z (forward/back)]
  neoPosition: [-4.85, 0, -8] as [number, number, number],
  neoRotation: [0, Math.PI / 2, 0] as [number, number, number], // slight turn right

  // Architect on the RIGHT side, angled slightly left toward Neo
  architectPosition: [4.85, 0, -8] as [number, number, number],
  architectRotation: [0, -Math.PI / 2, 0] as [number, number, number], // slight turn left
};



// ─── Utility: build monitor positions ─────────────────────────────────────────

function buildPositions(): MonitorPosition[] {
  const pos: MonitorPosition[] = [];

  for (let r = 0; r < ROWS; r++) {
    // Map each row to a latitude angle on a hemisphere
    const phi = (PHI_START + (r / (ROWS - 1)) * (PHI_END - PHI_START)) * (Math.PI / 180);

    // Physically drop any rows that extend mathematically far above the camera's locked vertical axis restrictions
    // 27 degrees off the horizon tightly crops out the roof screens directly above the max locked vision angle
    if (phi > 27 * (Math.PI / 180)) break;

    const rowRadius = RADIUS * Math.cos(phi);
    const rowY = SPHERE_Y + RADIUS * Math.sin(phi);
    // Force identical columns so the screens perfectly align vertically top-to-bottom
    const rowItems = ITEMS_PER_ROW;

    for (let i = 0; i < rowItems; i++) {
      const angle = (i / rowItems) * 2 * Math.PI - Math.PI;

      // Mathematically CULL screens that are out of bounds of the locked camera to save memory!
      // The camera only ever pans +/- 40 degrees from front (-Z), which combined with the camera's FOV means
      // screens past ~100 degrees (1.8 radians) are universally invisible in production mode.
      const isVisible = angle > -1.8 && angle < 1.8;

      const x = Math.sin(angle) * rowRadius;
      const y = rowY;
      const z = -Math.cos(angle) * rowRadius;

      // Cut exactly around the new taller door
      const isDoorGap = Math.abs(x) < 1.25 && y < 4.8 && z < 0;

      if (isVisible && !isDoorGap && pos.length < COUNT_LIMIT) {
        pos.push({
          x,
          y,
          z,
          angle,
          lookAtY: 1.6, // all monitors face viewer's eye level
        });
      }
    }
  }

  return pos;
}

interface CameraRigProps {
  targetPos: THREE.Vector3 | null;
  targetLookAt: THREE.Vector3 | null;
  onArrived: () => void;
  orbitRef: React.MutableRefObject<OrbitControlsImpl | null>;
  isDoorApproach: boolean;
}

function CameraRig({ targetPos, targetLookAt, onArrived, orbitRef, isDoorApproach }: CameraRigProps) {
  const { camera } = useThree();
  const arrived = useRef(false);

  useEffect(() => { arrived.current = false; }, [targetPos]);

  useFrame(() => {
    if (!targetPos || !targetLookAt || !orbitRef.current) return;

    const currentSpeed = isDoorApproach ? 0.01 : ARCHITECT_CONFIG.cameraLerpSpeed;

    // Lerp position
    camera.position.lerp(targetPos, currentSpeed);

    // Lerp OrbitControls target (which dictates where camera looks)
    orbitRef.current.target.lerp(targetLookAt, currentSpeed);
    orbitRef.current.update();

    const posDist = camera.position.distanceTo(targetPos);
    const lookDist = orbitRef.current.target.distanceTo(targetLookAt);

    if (posDist < 0.05 && lookDist < 0.05 && !arrived.current) {
      arrived.current = true;
      camera.position.copy(targetPos);
      orbitRef.current.target.copy(targetLookAt);
      orbitRef.current.update();
      onArrived();
    }
  });

  return null;
}

// ─── Monitor wall (cases) ─────────────────────────────────────────────────────

interface CRTWallProps {
  positions: MonitorPosition[];
  onMonitorClick: (instanceId: number, worldPos: THREE.Vector3, lookAtPos: THREE.Vector3) => void;
}

function CRTWall({ positions, onMonitorClick }: CRTWallProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Build rounded box geometry for premium bevel look
  // RoundedBox is not InstancedMesh-friendly directly, so we extract its geometry
  const caseGeo = useMemo(() => {
    // Manually create a rounded box via BufferGeometry subdivision trick
    // Width shrunk to 1.04 to mimic a 4:3 CRT casing
    const geo = new THREE.BoxGeometry(1.04, 0.78, 1.18, 2, 2, 2);
    return geo;
  }, []);

  const caseMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1c1c1c",
        roughness: 0.55,
        metalness: 0.35,
        envMapIntensity: 0.8,
      }),
    []
  );

  // Set matrices once on mount — never in useFrame
  useEffect(() => {
    if (!meshRef.current) return;
    positions.forEach((p, i) => {
      dummy.position.set(p.x, p.y, p.z);
      dummy.lookAt(0, p.lookAtY, 0);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.computeBoundingSphere();
  }, [positions, dummy]);

  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      const id = event.instanceId;
      if (id == null) return;
      const p = positions[id];
      // Compute world position in front of that monitor
      const angle = p.angle;
      const camOffset = 2.5; // fly slightly closer to the screen
      const worldPos = new THREE.Vector3(
        p.x - Math.sin(angle) * camOffset,
        p.y,
        p.z + Math.cos(angle) * camOffset
      );
      const lookAtPos = new THREE.Vector3(p.x, p.y, p.z);
      onMonitorClick(id, worldPos, lookAtPos);
    },
    [positions, onMonitorClick]
  );

  // Hover glow uses a rounded plane (matching the screen curvature) instead of a flat box
  const hitGeo = useMemo(() => createRoundedPlaneGeo(0.92, 0.70, 0.09), []);
  const hitMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#ffffff",
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  const hitMeshRef = useRef<THREE.InstancedMesh>(null);
  const color = useMemo(() => new THREE.Color(), []);

  // Update hover glow color per instance
  useFrame(() => {
    if (!hitMeshRef.current) return;
    for (let i = 0; i < positions.length; i++) {
      // Additive blending: Black is invisible. Glow brightly if hovered.
      const hoverStr = i === hoveredId ? 0.35 : 0;
      color.setRGB(hoverStr * 0.5, hoverStr, hoverStr * 0.5); // neon green glow
      hitMeshRef.current.setColorAt(i, color);
    }
    if (hitMeshRef.current.instanceColor) {
      hitMeshRef.current.instanceColor.needsUpdate = true;
    }
  });

  // Set matrices for hit geometry
  useEffect(() => {
    if (!hitMeshRef.current) return;
    positions.forEach((p, i) => {
      dummy.position.set(p.x, p.y, p.z);
      dummy.lookAt(0, p.lookAtY, 0);
      dummy.translateZ(0.605); // sit just in front of the bezel, flush with screen plane
      dummy.updateMatrix();
      hitMeshRef.current!.setMatrixAt(i, dummy.matrix);
      hitMeshRef.current!.setColorAt(i, new THREE.Color(0x000000));
    });
    hitMeshRef.current.instanceMatrix.needsUpdate = true;
    if (hitMeshRef.current.instanceColor) {
      hitMeshRef.current.instanceColor.needsUpdate = true;
    }
    hitMeshRef.current.computeBoundingSphere();
  }, [positions, dummy]);

  return (
    <>
      <instancedMesh
        ref={meshRef}
        args={[caseGeo, caseMat, positions.length]}
        castShadow
        receiveShadow
        frustumCulled={false}
      />

      {/* Hit-test and hover glow mesh */}
      <instancedMesh
        ref={hitMeshRef}
        args={[hitGeo, hitMat, positions.length]}
        frustumCulled={false}
        onClick={handleClick}
        onPointerOver={(event: ThreeEvent<PointerEvent>) => {
          event.stopPropagation();
          document.body.style.cursor = "pointer";
          if (event.instanceId !== undefined) setHoveredId(event.instanceId);
        }}
        onPointerOut={(event: ThreeEvent<PointerEvent>) => {
          event.stopPropagation();
          document.body.style.cursor = "auto";
          setHoveredId(null);
        }}
      />
    </>
  );
}

// ─── Green screens (with per-agent textures) ──────────────────────────────────

interface GreenScreensProps {
  positions: MonitorPosition[];
  videoPaths: string[];
}

function GreenScreens({ positions, videoPaths }: GreenScreensProps) {
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Create one video + canvas + material per video path (now using tiny 320x240 transcodes)
  const screenData = useMemo(() => {
    if (typeof window === "undefined" || videoPaths.length === 0) {
      return [{ mat: new THREE.MeshBasicMaterial({ color: "#00ff41" }), vid: null, ctx: null, tex: null }];
    }

    return videoPaths.map((src) => {
      const vid = document.createElement("video");
      vid.src = src;
      vid.crossOrigin = "Anonymous";
      vid.loop = true;
      vid.muted = true;
      vid.playsInline = true;
      vid.play().catch((err) => console.log("Autoplay prevented:", err));

      const cvs = document.createElement("canvas");
      cvs.width = 256;
      cvs.height = 192;
      const ctx = cvs.getContext("2d")!;

      const tex = new THREE.CanvasTexture(cvs);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.generateMipmaps = false;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;

      const mat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false });
      return { mat, vid, ctx, tex };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const screenMats = useMemo(() => screenData.map((d) => d.mat), [screenData]);

  // Draw loops with proper cleanup
  useEffect(() => {
    let cancelled = false;

    screenData.forEach(({ vid, ctx, tex }) => {
      if (!vid || !ctx || !tex) return;
      vid.play().catch(() => { });

      let lastDraw = 0;
      const drawLoop = (now: number) => {
        if (cancelled) return;
        requestAnimationFrame(drawLoop);
        if (now - lastDraw < 42) return; // ~24fps
        lastDraw = now;
        if (vid.readyState >= 2) {
          ctx.drawImage(vid, 0, 0, 256, 192);
          tex.needsUpdate = true;
        }
      };
      requestAnimationFrame(drawLoop);
    });

    return () => { cancelled = true; };
  }, [screenData]);

  // Split positions round-robin by video index
  const groups = useMemo(() => {
    const g: MonitorPosition[][] = screenMats.map(() => []);
    positions.forEach((p, i) => { g[i % screenMats.length].push(p); });
    return g;
  }, [positions, screenMats]);

  const roundScreenGeo = useMemo(() => createRoundedPlaneGeo(0.85, 0.64, 0.08), []);

  return (
    <>
      {groups.map((groupPositions, gi) => (
        <GreenScreenGroup 
          key={gi} 
          positions={groupPositions} 
          material={screenMats[gi]} 
          geometry={roundScreenGeo} 
          dummy={dummy} 
          startIdx={gi}
          step={screenMats.length}
        />
      ))}
    </>
  );
}

function GreenScreenGroup({ positions, material, geometry, dummy, startIdx, step }: {
  positions: MonitorPosition[];
  material: THREE.MeshBasicMaterial;
  geometry: THREE.BufferGeometry;
  dummy: THREE.Object3D;
  startIdx: number;
  step: number;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    if (!meshRef.current) return;
    
    positions.forEach((p, i) => {
      // Recover global index: i * step + startIdx
      const globalIdx = i * step + startIdx;
      
      if (INTERACTIVE_IDS.includes(globalIdx)) {
        // Hide this instance by scaling it to 0 or moving it far away
        dummy.position.set(0, -100, 0); 
        dummy.scale.set(0, 0, 0);
      } else {
        dummy.position.set(p.x, p.y, p.z);
        dummy.scale.set(1, 1, 1);
        dummy.lookAt(0, p.lookAtY, 0);
        dummy.translateZ(0.6);
      }
      
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.computeBoundingSphere();
  }, [positions, dummy, startIdx, step]);

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, positions.length]} frustumCulled={false} />
  );
}

// ─── Bezel edge highlight (thin emissive ring around each screen) ─────────────

function InteractiveMonitorLayer({ positions, activeId, onClose }: { 
  positions: MonitorPosition[]; 
  activeId: number | null;
  onClose: () => void;
}) {
  return (
    <group>
      {INTERACTIVE_IDS.map((id) => {
        const p = positions[id];
        if (!p) return null;
        const isFocused = activeId === id;

        return (
          <group key={id} position={[p.x, p.y, p.z]}>
            <Html
              transform
              distanceFactor={0.8}
              position={[0, 0, 0.61]} // Sit flush against the bezel
              rotation={[0, -p.angle, 0]}
              occlude="blending"
              style={{
                width: "1024px",
                height: "768px",
                transition: "opacity 0.5s",
                opacity: 1,
              }}
            >
              <div className="relative group">
                <InteractiveTerminal />
                {isFocused && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                    className="absolute top-4 left-4 z-50 px-6 py-2 bg-black border border-green-500 text-green-500 font-mono text-sm hover:bg-green-500 hover:text-black transition-colors"
                  >
                    ← CLOSE
                  </button>
                )}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

function ScreenBezels({ positions }: { positions: MonitorPosition[] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const bezelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#003300",
        emissive: "#00ff41",
        emissiveIntensity: 0.18,
        roughness: 0.4,
      }),
    []
  );

  // Width shrunk to proportionally match monitor 4:3 size
  const bezelGeo = useMemo(() => createRoundedPlaneGeo(0.91, 0.68, 0.1), []);

  useEffect(() => {
    if (!meshRef.current) return;
    positions.forEach((p, i) => {
      dummy.position.set(p.x, p.y, p.z);
      dummy.lookAt(0, p.lookAtY, 0);
      dummy.translateZ(0.595); // just behind the screen plane
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.computeBoundingSphere();
  }, [positions, dummy]);

  return (
    <instancedMesh ref={meshRef} args={[bezelGeo, bezelMat, positions.length]} frustumCulled={false} />
  );
}

// ─── Room shell (dark cylinder + dome cap, rendered from inside) ──────────────

function RoomShell() {
  return (
    <group>
      {/* Cylindrical walls — radius just outside the monitor ring */}
      <mesh>
        <cylinderGeometry args={[15.5, 15.5, 20, 64, 1, true]} />
        <meshStandardMaterial color="#111111" side={THREE.BackSide} roughness={0.9} />
      </mesh>
      {/* Dome cap — top hemisphere */}
      <mesh position={[0, 10, 0]}>
        <sphereGeometry args={[15.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#111111" side={THREE.BackSide} roughness={0.9} />
      </mesh>
    </group>
  );
}

// ─── Ambient green glow light ─────────────────────────────────────────────────

function ScreenGlow() {
  return (
    <pointLight
      position={[0, 5, -10]}
      color="#00ff41"
      intensity={1.2}
      distance={25}
      decay={2}
    />
  );
}

// ─── Door ─────────────────────────────────────────────────────────────────────

interface DoorProps {
  onClick: () => void;
  hovered: boolean;
  onHover: (h: boolean) => void;
}

function Door({ onClick, hovered, onHover }: DoorProps) {
  const innerRef = useRef<THREE.Group>(null);
  const leafRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Subtle float toward viewer on hover relative to inner group
  useFrame((state, delta) => {
    if (!innerRef.current) return;
    const targetZ = hovered && !isOpen ? 0.3 : 0;
    innerRef.current.position.z = THREE.MathUtils.lerp(
      innerRef.current.position.z,
      targetZ,
      0.1
    );

    if (leafRef.current) {
      // Swing inward into the room by ~90 degrees
      const targetRotation = isOpen ? 1.6 : 0; // positive pushes the left edge inward
      leafRef.current.rotation.y = THREE.MathUtils.lerp(
        leafRef.current.rotation.y,
        targetRotation,
        0.8 * delta
      );

      if (lightRef.current) {
        // Calculate door swing ratio (0.0 to 1.0)
        const openRatio = Math.max(0, Math.min(1, leafRef.current.rotation.y / 1.6));
        
        // Intensity ramps on a heavy exponential curve so it doesn't flash instantly
        lightRef.current.intensity = Math.pow(openRatio, 4) * 4000;
        
        // The distance parameter controls the absolute boundary sphere of the light.
        // Expanding it dynamically simulates the light physically creeping across the floor and washing over shapes "like water".
        lightRef.current.distance = 1.0 + Math.pow(openRatio, 2) * 30;
      }
    }
  });

  // Edge highlight material for door frame
  const frameMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#888888",
        roughness: 0.6,
        metalness: 0.5,
        emissive: "#444444",
        emissiveIntensity: hovered ? 1.0 : 0.5,
      }),
    [hovered]
  );

  const paneMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#f8f8f8",
        roughness: 0.08,
        metalness: 0.2,
        emissive: "#ffffff",
        emissiveIntensity: hovered ? 0.06 : 0.01,
      }),
    [hovered]
  );

  return (
    <group
      position={[0, 1.6, -13.95]}
      onClick={(e) => {
        e.stopPropagation();
        setIsOpen(true);
        onClick();
      }}
      onPointerOver={() => { onHover(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { onHover(false); document.body.style.cursor = "auto"; }}
    >
      <group ref={innerRef}>
        {/*
          We construct the door from the floor up.
          The group sits at world Y = 1.6, so the floor is at local Y = -1.6.
        */}
        {(() => {
          // Mathematically grounded to span exactly from world Y=0 to Y=4.8 gap
          const floorY = -1.6;
          const doorHeight = 4.57;
          const doorWidth = 1.9;

          // Outer frame (Architrave)
          const frameThick = 0.15;
          const frameDepth = 0.26;
          const frameH = doorHeight + frameThick;

          // Door leaf
          const leafDepth = 0.045; // Substantially increased depth to prevent geometric clipping
          const leafH = doorHeight - 0.035; // Shrink slightly to clear the top lintel threshold when swinging
          const leafCenterY = floorY + leafH / 2;

          // Doorknob (standard waist height)
          const knobY = floorY + 2.0;
          const knobX = -(doorWidth / 2 - 0.2);

          return (
            <>
              {/* Outer frame - Left */}
              <mesh name="DoorFrameLeft" position={[-(doorWidth / 2 + frameThick / 2), floorY + frameH / 2, -0.1]}>
                <boxGeometry args={[frameThick, frameH, frameDepth]} />
                <primitive object={frameMat} attach="material" />
              </mesh>
              {/* Outer frame - Right */}
              <mesh name="DoorFrameRight" position={[(doorWidth / 2 + frameThick / 2), floorY + frameH / 2, -0.1]}>
                <boxGeometry args={[frameThick, frameH, frameDepth]} />
                <primitive object={frameMat} attach="material" />
              </mesh>
              {/* Outer frame - Top lintel */}
              <mesh name="DoorFrameTop" position={[0, floorY + doorHeight + frameThick / 2, -0.09]}>
                <boxGeometry args={[doorWidth + frameThick * 2 + 0.1, frameThick, frameDepth + 0.04]} />
                <primitive object={frameMat} attach="material" />
              </mesh>

              {/* The Matrix "Source" Void behind the door */}
              <mesh position={[0, leafCenterY, -0.15]}>
                <planeGeometry args={[doorWidth + 0.2, leafH + 0.2]} />
                <meshBasicMaterial color="#ffffff" toneMapped={false} />
              </mesh>

              {/* Blinding Point Light linked to the door opening */}
              <pointLight 
                ref={lightRef} 
                position={[0, leafCenterY, -0.10]} 
                color="#ffffff" 
                intensity={0} 
                distance={1.0} 
                decay={1.5} 
              />

              {/* Pivot Hinge Group for swinging the door leaf */}
              <group ref={leafRef} position={[doorWidth / 2, 0, 0]}>
                {/* Main Door Solid Base (Flat, bland slab door) shifted relative to hinge */}
                <mesh position={[-doorWidth / 2, leafCenterY, 0]}>
                  <boxGeometry args={[doorWidth, leafH, leafDepth]} />
                  <primitive object={paneMat} attach="material" />
                </mesh>

                {/* High-Fidelity Doorknob Assembly shifted relative to hinge */}
                <group position={[knobX - doorWidth / 2, knobY, leafDepth / 2 + 0.005]}>
                  {/* Hardware Rose (Circular Backplate) */}
                  <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.075, 0.075, 0.015, 32]} />
                    <meshStandardMaterial color="#666666" metalness={0.9} roughness={0.4} />
                  </mesh>

                  {/* Knob Stem */}
                  <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
                    {/* Thicker stem */}
                    <cylinderGeometry args={[0.025, 0.025, 0.08, 32]} />
                    <meshStandardMaterial color="#aaaaaa" metalness={0.9} roughness={0.3} />
                  </mesh>

                  {/* Prominent Steel Ball Knob */}
                  <mesh position={[0, 0, 0.09]}>
                    {/* Significantly oversized sphere to stand out heavily on the screen */}
                    <sphereGeometry args={[0.085, 64, 64]} />
                    <meshStandardMaterial
                      color="#cccccc"
                      metalness={0.8}
                      roughness={0.3}
                    />
                  </mesh>

                  {/* Classic Keyhole cut directly into the Rose */}
                  <mesh position={[0, -0.02, 0.008]}>
                    <circleGeometry args={[0.01, 16]} />
                    <meshBasicMaterial color="#000000" />
                  </mesh>
                  <mesh position={[0, -0.035, 0.008]}>
                    <planeGeometry args={[0.012, 0.02]} />
                    <meshBasicMaterial color="#000000" />
                  </mesh>
                </group>
              </group>
            </>
          );
        })()}
      </group>
    </group>
  );
}

// ─── Fullscreen video overlay ─────────────────────────────────────────────────

interface VideoOverlayProps {
  src: string;
  onClose: () => void;
}

function VideoOverlay({ src, onClose }: VideoOverlayProps) {
  const [opacity, setOpacity] = useState(0);

  // Fade in on mount
  useEffect(() => {
    const id = requestAnimationFrame(() => setOpacity(1));
    return () => cancelAnimationFrame(id);
  }, []);

  const handleClose = () => {
    setOpacity(0);
    setTimeout(onClose, 500);
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#000",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        opacity,
        transition: "opacity 0.5s ease",
      }}
    >
      {/* Back button */}
      <button
        onClick={handleClose}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 60,
          background: "rgba(0,0,0,0.7)",
          border: "1px solid rgba(0,255,65,0.4)",
          color: "#00ff41",
          fontFamily: "monospace",
          fontSize: 13,
          padding: "8px 16px",
          borderRadius: 4,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
          backdropFilter: "blur(8px)",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.background =
          "rgba(0,255,65,0.12)")
        }
        onMouseLeave={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.background =
          "rgba(0,0,0,0.7)")
        }
      >
        ← BACK
      </button>

      {/* Video */}
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />

      {/* Scanline overlay for CRT feel */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

// ─── Scene contents (split out so Canvas context is available) ────────────────

interface SceneProps {
  positions: MonitorPosition[];
  cameraTarget: THREE.Vector3 | null;
  cameraLookAt: THREE.Vector3 | null;
  onCameraArrived: () => void;
  onMonitorClick: (id: number, worldPos: THREE.Vector3, lookAtPos: THREE.Vector3) => void;
  doorHovered: boolean;
  onDoorHover: (h: boolean) => void;
  onDoorClick: () => void;
  videoPaths: string[];
  isActiveScreen: boolean;
  isDoorApproach: boolean;
}

function Scene({
  positions,
  cameraTarget,
  cameraLookAt,
  onCameraArrived,
  onMonitorClick,
  doorHovered,
  onDoorHover,
  onDoorClick,
  videoPaths,
  isActiveScreen,
  isDoorApproach,
}: SceneProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orbitRef = useRef<any>(null);
  const { camera } = useThree();

  // Disable OrbitControls while camera is animating toward a monitor
  useEffect(() => {
    if (orbitRef.current) {
      orbitRef.current.enabled = !cameraTarget;
    }
  }, [cameraTarget]);

  // Point camera forward into the scene on first load or back navigation
  useEffect(() => {
    const homePos = ARCHITECT_CONFIG.cameraHome;
    const homeLookAt = ARCHITECT_CONFIG.cameraLookAtHome;

    // Explicitly reset position in case the browser cached the modified camera state
    camera.position.copy(homePos);
    camera.lookAt(homeLookAt);
    if (orbitRef.current) {
      orbitRef.current.target.copy(homeLookAt);
      orbitRef.current.update();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <CameraRig
        targetPos={cameraTarget}
        targetLookAt={cameraLookAt}
        orbitRef={orbitRef}
        onArrived={onCameraArrived}
        isDoorApproach={isDoorApproach}
      />

      {/* Lighting - Subtly graded with a faintly noticeable Matrix green tint */}
      <ambientLight intensity={0.55} color="#dce8e3" />
      <directionalLight
        position={[0, 12, 5]}
        intensity={1.3}
        color="#f0f8f5" // Nearly white with a 1% green coolness
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={60}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={15}
        shadow-camera-bottom={-5}
      />
      {/* Subtle fill from behind viewer, pushing deep, faint cinematic green into shadows */}
      <directionalLight position={[0, 4, 8]} intensity={0.3} color="#0c1b14" />

      <ScreenGlow />

      {/* Background & fog: graded to almost pure black/grey, with only the slimmest hint of dark green */}
      <color attach="background" args={["#060a08"]} />
      <fog attach="fog" args={["#060a08", 16, 45]} />

      {/* Reflective floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
          blur={[1200, 1200]}
          resolution={1024}
          mixBlur={3}
          mixStrength={35}
          roughness={0.75}
          depthScale={1.2}
          minDepthThreshold={0.8}
          maxDepthThreshold={3.5}
          color="#eeeeee83"
          metalness={0.1}
          mirror={0.35}
        />
      </mesh>

      {/* Room shell */}
      <RoomShell />

      {/* Monitor wall */}
      <CRTWall positions={positions} onMonitorClick={onMonitorClick} />
      <GreenScreens positions={positions} videoPaths={videoPaths} />
      <ScreenBezels positions={positions} />
      
      {/* Interactive HTML Layer */}
      <InteractiveMonitorLayer 
        positions={positions} 
        activeId={cameraTarget ? positions.findIndex(p => p.x === cameraTarget.x && p.y === cameraTarget.y) : null} 
        onClose={onCameraArrived} 
      />

      {/* Door */}
      <Door onClick={onDoorClick} hovered={doorHovered} onHover={onDoorHover} />

      {/* ── Neo (Standing, left side) ────────────────────────────── */}
      <group position={ARCHITECT_CONFIG.neoPosition} rotation={ARCHITECT_CONFIG.neoRotation}>
        <NeoModel scale={0.022} position={[0, 0, 0]} />
      </group>

      {/* ── The Architect (Seated, right side) ────────────────────── */}
      <group position={ARCHITECT_CONFIG.architectPosition} rotation={ARCHITECT_CONFIG.architectRotation}>
        {/* ─ Architect Component ─ */}
        <ArchitectModel position={[0, 0, 0]} />
      </group>

      {/* OrbitControls — look-only in production, fully unlocked noclip in Dev Mode */}
      <OrbitControls
        ref={orbitRef}
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.08}
        // Tighten vertical (Y) movement to hide extreme ceiling/floor, unless in transition
        maxPolarAngle={cameraTarget !== null || isActiveScreen ? Math.PI : Math.PI / 2 + 0.05}
        minPolarAngle={cameraTarget !== null || isActiveScreen ? 0 : Math.PI / 2.2}
        // Tighten horizontal (X) to 80 degrees total, unless transitioning out of bounds
        minAzimuthAngle={cameraTarget !== null || isActiveScreen ? -Infinity : -40 * (Math.PI / 180)}
        maxAzimuthAngle={cameraTarget !== null || isActiveScreen ? Infinity : 40 * (Math.PI / 180)}
        rotateSpeed={0.45}
      />
    </>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function ArchitectScene({ onDoorClick, videoPaths = [] }: ArchitectSceneProps) {
  const positions = useMemo(() => buildPositions(), []);

  const [activeScreen, setActiveScreen] = useState<ActiveScreen | null>(null);
  const [cameraTarget, setCameraTarget] = useState<THREE.Vector3 | null>(null);
  const [cameraLookAtTarget, setCameraLookAtTarget] = useState<THREE.Vector3 | null>(null);
  const [videoVisible, setVideoVisible] = useState(false);
  const [doorHovered, setDoorHovered] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [isDoorApproach, setIsDoorApproach] = useState(false);
  const pendingDoorCallback = useRef<(() => void) | null>(null);

  // Fade in control for initial mount
  const [sceneOpacity, setSceneOpacity] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setSceneOpacity(1), 50);
    return () => clearTimeout(t);
  }, []);

  // Get video src for the fullscreen overlay — swap _sm transcodes back to original full-res
  const getVideoSrc = useCallback(
    (instanceId: number): string => {
      if (!videoPaths.length) return "";
      const smPath = videoPaths[instanceId % videoPaths.length];
      return smPath.replace("_sm.mp4", ".mp4");
    },
    [videoPaths]
  );

  const handleMonitorClick = useCallback(
    (instanceId: number, worldPos: THREE.Vector3, lookAtPos: THREE.Vector3) => {
      if (isReturning || activeScreen) return;
      const src = getVideoSrc(instanceId);
      setActiveScreen({ instanceId, worldPosition: worldPos, lookAtPosition: lookAtPos, videoSrc: src });
      setCameraTarget(worldPos);
      setCameraLookAtTarget(lookAtPos);
    },
    [isReturning, activeScreen, getVideoSrc]
  );

  // Camera has finished moving
  const handleCameraArrived = useCallback(() => {
    if (isDoorApproach) {
      setIsDoorApproach(false);
      setCameraTarget(null);
      setCameraLookAtTarget(null);
      pendingDoorCallback.current?.();
      pendingDoorCallback.current = null;
    } else if (isReturning) {
      setIsReturning(false);
      setCameraTarget(null);
      setCameraLookAtTarget(null);
      setActiveScreen(null);
    } else {
      // Only show top-level video overlay if the screen isn't an interactive one
      if (activeScreen && !INTERACTIVE_IDS.includes(activeScreen.instanceId)) {
        setVideoVisible(true);
      }
    }
  }, [isDoorApproach, isReturning, activeScreen]);

  const handleDoorClick = useCallback(() => {
    pendingDoorCallback.current = onDoorClick;
    setIsDoorApproach(true);
    setCameraTarget(new THREE.Vector3(0, 1.6, -9));
    setCameraLookAtTarget(new THREE.Vector3(0, 1.5, -14));
  }, [onDoorClick]);

  const handleCloseVideo = useCallback(() => {
    setVideoVisible(false);
    setIsReturning(true);
    // Animate camera back to home position facing the door
    setCameraTarget(ARCHITECT_CONFIG.cameraHome.clone());
    setCameraLookAtTarget(ARCHITECT_CONFIG.cameraLookAtHome.clone());
  }, []);

  return (
    <div 
      style={{ 
        position: "relative", 
        width: "100%", 
        height: "100vh", 
        background: "#000", 
        opacity: sceneOpacity, 
        transition: "opacity 3s ease-in-out" 
      }}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 1.6, 0], fov: 50 }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        // Only re-render when something changes — huge perf win when idle
        frameloop="always"
      >
        <Scene
          positions={positions}
          cameraTarget={cameraTarget}
          cameraLookAt={cameraLookAtTarget}
          onCameraArrived={handleCameraArrived}
          onMonitorClick={handleMonitorClick}
          doorHovered={doorHovered}
          onDoorHover={setDoorHovered}
          onDoorClick={handleDoorClick}
          videoPaths={videoPaths}
          isActiveScreen={!!activeScreen}
          isDoorApproach={isDoorApproach}
        />
      </Canvas>

      {/* Fullscreen video overlay */}
      {videoVisible && activeScreen && (
        <VideoOverlay src={activeScreen.videoSrc} onClose={handleCloseVideo} />
      )}

      {/* Cinematic Black Bars (Letterbox) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "12vh",
          background: "black",
          zIndex: 40, // Below the VideoOverlay which has zIndex: 50
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "12vh",
          background: "black",
          zIndex: 40,
          pointerEvents: "none",
        }}
      />

      {/* Hint label */}
      {!activeScreen && (
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            color: "rgba(255,255,255,0.3)",
            fontFamily: "monospace",
            fontSize: 11,
            letterSpacing: "0.12em",
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 45, // Above the black bars
          }}
        >
          DRAG TO LOOK · CLICK A SCREEN · CLICK THE DOOR
        </div>
      )}
    </div>
  );
}