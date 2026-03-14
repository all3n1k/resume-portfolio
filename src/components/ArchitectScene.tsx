"use client";

import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  MeshReflectorMaterial,
  BakeShadows,
  OrbitControls,
} from "@react-three/drei";
import * as THREE from "three";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MonitorPosition {
  x: number;
  y: number;
  z: number;
  angle: number;
}

interface ActiveScreen {
  instanceId: number;
  worldPosition: THREE.Vector3;
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

const RADIUS = 20;
const ITEMS_PER_ROW = 51;
const ROWS = 12;
const MONITOR_HEIGHT = 0.95;
const COUNT_LIMIT = 800;

// ─── EASY-TWEAK POSITIONING CONTROLS ──────────────────────────────────────────
// Change these offsets to visually re-arrange the characters and camera!
// The door is at roughly Z = -19.6
export const ARCHITECT_CONFIG = {
  // Camera starts at the center of the dome
  cameraHome: new THREE.Vector3(0, 1.6, 0), 
  cameraLerpSpeed: 0.06,

  // Neo on the LEFT side, angled slightly right toward Architect
  // [X (left/right), Y (up/down), Z (forward/back)]
  neoPosition: [-5, 0, -8] as [number, number, number],
  neoRotation: [0, Math.PI / 6, 0] as [number, number, number], // slight turn right

  // Architect on the RIGHT side, angled slightly left toward Neo
  architectPosition: [5, 0, -8] as [number, number, number],
  architectRotation: [0, -Math.PI / 6, 0] as [number, number, number], // slight turn left
};

// Fake agent lines for each "screen type" (cycles via index % AGENT_LINES.length)
const AGENT_LINES: string[][] = [
  ["> INIT AGENT_04", "scanning nodes...", "FOUND: 142 targets", "> MAPPING...", "eta: 00:03:12", "> STATUS: ACTIVE", "threads: 8/8", "> OUTPUT READY"],
  ["> NEURAL_SYNC v2", "loss: 0.00312", "epoch 847/1000", "> GRADIENT OK", "lr: 0.00001", "> CHECKPOINT", "saving weights...", "> RESUMED"],
  ["> SCRAPER_9X", "queue: 4,821 urls", "processed: 3,204", "> RATE: 142/s", "errors: 0", "> PROXY POOL", "active: 24/30", "> CONTINUING"],
  ["> CODEGEN_AI", "context: 128k", "> WRITING...", "fn: parseMatrix()", "lines: 847", "> LINT: CLEAN", "tests: 12/12", "> COMMITTING"],
  ["> MONITOR_SYS", "cpu: 34%  mem: 61%", "disk: 2.1TB free", "> ALL NODES UP", "latency: 4ms", "> UPTIME: 99.9%", "alerts: 0", "> NOMINAL"],
];

// ─── Utility: build monitor positions ─────────────────────────────────────────

function buildPositions(): MonitorPosition[] {
  const pos: MonitorPosition[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let i = 0; i < ITEMS_PER_ROW; i++) {
      const mid = Math.floor(ITEMS_PER_ROW / 2); // 25
      // Remove exactly 3 columns (24, 25, 26) up to row 4
      const isDoorGap = r < 4 && i >= mid - 1 && i <= mid + 1;
      if (!isDoorGap && pos.length < COUNT_LIMIT) {
        const angle = (i / (ITEMS_PER_ROW - 1)) * Math.PI - Math.PI / 2;
        pos.push({
          x: Math.sin(angle) * RADIUS,
          y: r * MONITOR_HEIGHT + MONITOR_HEIGHT / 2 + 0.1,
          z: -Math.cos(angle) * RADIUS,
          angle,
        });
      }
    }
  }
  return pos;
}

// ─── Utility: build a canvas texture for a given agent type ──────────────────

function buildScreenTexture(agentIndex: number): THREE.CanvasTexture {
  const w = 256, h = 180;
  const cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  const ctx = cv.getContext("2d")!;

  // Background: deep phosphor green-black
  ctx.fillStyle = "#020f02";
  ctx.fillRect(0, 0, w, h);

  // Scanline overlay
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  for (let y = 0; y < h; y += 4) ctx.fillRect(0, y, w, 2);

  // Text
  const lines = AGENT_LINES[agentIndex % AGENT_LINES.length];
  ctx.font = "bold 13px monospace";
  lines.forEach((line, i) => {
    const brightness = i === 0 ? "#00ff41" : i % 3 === 0 ? "#00cc33" : "#009922";
    ctx.fillStyle = brightness;
    ctx.fillText(line, 10, 18 + i * 20);
  });

  // Subtle vignette
  const grad = ctx.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, h * 0.9);
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  return new THREE.CanvasTexture(cv);
}

// ─── Camera animation controller ─────────────────────────────────────────────

interface CameraRigProps {
  target: THREE.Vector3 | null;
  onArrived: () => void;
}

function CameraRig({ target, onArrived }: CameraRigProps) {
  const { camera } = useThree();
  const arrived = useRef(false);

  useEffect(() => { arrived.current = false; }, [target]);

  useFrame(() => {
    if (!target) return;
    camera.position.lerp(target, ARCHITECT_CONFIG.cameraLerpSpeed);
    if (camera.position.distanceTo(target) < 0.05 && !arrived.current) {
      arrived.current = true;
      camera.position.copy(target);
      onArrived();
    }
  });

  return null;
}

// ─── Monitor wall (cases) ─────────────────────────────────────────────────────

interface CRTWallProps {
  positions: MonitorPosition[];
  onMonitorClick: (instanceId: number, worldPos: THREE.Vector3) => void;
}

function CRTWall({ positions, onMonitorClick }: CRTWallProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Build rounded box geometry for premium bevel look
  // RoundedBox is not InstancedMesh-friendly directly, so we extract its geometry
  const caseGeo = useMemo(() => {
    // Manually create a rounded box via BufferGeometry subdivision trick
    // Using a slightly inset box with bevel via segments
    const geo = new THREE.BoxGeometry(1.18, 0.78, 1.18, 1, 1, 1);
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
      dummy.lookAt(0, p.y, 0);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [positions, dummy]);

  const handleClick = useCallback(
    // Three/fiber events extend standard DOM events with custom properties
    (e: unknown) => {
      const event = e as { stopPropagation: () => void; instanceId?: number };
      event.stopPropagation();
      const id = event.instanceId;
      if (id == null) return;
      const p = positions[id];
      // Compute world position in front of that monitor
      const angle = p.angle;
      const camOffset = 3.5;
      const worldPos = new THREE.Vector3(
        p.x - Math.sin(angle) * camOffset,
        p.y,
        p.z + Math.cos(angle) * camOffset
      );
      onMonitorClick(id, worldPos);
    },
    [positions, onMonitorClick]
  );

  return (
    <instancedMesh
      ref={meshRef}
      args={[caseGeo, caseMat, positions.length]}
      castShadow
      receiveShadow
      frustumCulled={false}
      onClick={handleClick}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "auto")}
    />
  );
}

// ─── Green screens (with per-agent textures) ──────────────────────────────────

interface GreenScreensProps {
  positions: MonitorPosition[];
}

function GreenScreens({ positions }: GreenScreensProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Build 5 unique agent textures, share across monitors
  const textures = useMemo(() => {
    if (typeof window === "undefined") return [];
    return Array.from({ length: 5 }, (_, i) => buildScreenTexture(i));
  }, []);

  // We use a single shared "average" texture on the instanced mesh.
  // For per-instance textures you'd need a custom shader — this gives
  // a great look at scale without the overhead.
  const screenMat = useMemo(
    () =>
      textures[0]
        ? new THREE.MeshBasicMaterial({
          map: textures[0],
          toneMapped: false,
        })
        : new THREE.MeshBasicMaterial({ color: "#00ff41" }),
    [textures]
  );

  useEffect(() => {
    if (!meshRef.current) return;
    positions.forEach((p, i) => {
      dummy.position.set(p.x, p.y, p.z);
      dummy.lookAt(0, p.y, 0);
      dummy.translateZ(0.6);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [positions, dummy]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, screenMat, positions.length]} frustumCulled={false}>
      <planeGeometry args={[0.92, 0.64]} />
    </instancedMesh>
  );
}

// ─── Bezel edge highlight (thin emissive ring around each screen) ─────────────

function ScreenBezels({ positions }: { positions: MonitorPosition[] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const bezelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#003300",
        emissive: "#00ff41",
        emissiveIntensity: 0.12,
        roughness: 0.9,
      }),
    []
  );

  const bezelGeo = useMemo(() => new THREE.PlaneGeometry(1.02, 0.66), []);

  useEffect(() => {
    if (!meshRef.current) return;
    positions.forEach((p, i) => {
      dummy.position.set(p.x, p.y, p.z);
      dummy.lookAt(0, p.y, 0);
      dummy.translateZ(0.595); // just behind the screen plane
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [positions, dummy]);

  return (
    <instancedMesh ref={meshRef} args={[bezelGeo, bezelMat, positions.length]} frustumCulled={false} />
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

  // Subtle float toward viewer on hover relative to inner group
  useFrame(() => {
    if (!innerRef.current) return;
    const targetZ = hovered ? 0.3 : 0;
    innerRef.current.position.z = THREE.MathUtils.lerp(
      innerRef.current.position.z,
      targetZ,
      0.1
    );
  });

  // Edge highlight material for door frame
  const frameMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#e8e8e8",
        roughness: 0.2,
        metalness: 0.15,
        emissive: hovered ? "#ffffff" : "#888888",
        emissiveIntensity: hovered ? 0.08 : 0.02,
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

  const trimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#cccccc",
        roughness: 0.3,
        metalness: 0.6,
        emissive: "#aaaaaa",
        emissiveIntensity: hovered ? 0.3 : 0.05,
      }),
    [hovered]
  );

  return (
    <group
      position={[0, 1.5, -20]}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={() => { onHover(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { onHover(false); document.body.style.cursor = "auto"; }}
    >
      <group ref={innerRef}>
        {/* Outer frame */}
        <mesh castShadow receiveShadow position={[0, 0, -0.12]}>
          <boxGeometry args={[3.6, 4.0, 0.18]} />
          <primitive object={frameMat} attach="material" />
        </mesh>

        {/* Door pane */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[3.3, 3.7, 0.08]} />
          <primitive object={paneMat} attach="material" />
        </mesh>

        {/* Top trim strip */}
        <mesh position={[0, 1.88, 0.05]}>
          <boxGeometry args={[3.34, 0.05, 0.06]} />
          <primitive object={trimMat} attach="material" />
        </mesh>
        {/* Bottom trim */}
        <mesh position={[0, -1.88, 0.05]}>
          <boxGeometry args={[3.34, 0.05, 0.06]} />
          <primitive object={trimMat} attach="material" />
        </mesh>
        {/* Left trim */}
        <mesh position={[-1.67, 0, 0.05]}>
          <boxGeometry args={[0.05, 3.8, 0.06]} />
          <primitive object={trimMat} attach="material" />
        </mesh>
        {/* Right trim */}
        <mesh position={[1.67, 0, 0.05]}>
          <boxGeometry args={[0.05, 3.8, 0.06]} />
          <primitive object={trimMat} attach="material" />
        </mesh>

        {/* Doorknob */}
        <mesh castShadow position={[1.35, 0, 0.1]}>
          <sphereGeometry args={[0.09, 32, 32]} />
          <meshStandardMaterial color="#aaaaaa" metalness={0.95} roughness={0.05} />
        </mesh>

        {/* Knob backplate */}
        <mesh position={[1.35, 0, 0.06]}>
          <cylinderGeometry args={[0.12, 0.12, 0.02, 32]} />
          <meshStandardMaterial color="#999999" metalness={0.8} roughness={0.1} />
        </mesh>
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
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#000",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Back button */}
      <button
        onClick={onClose}
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
        loop
        playsInline
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
  onCameraArrived: () => void;
  onMonitorClick: (id: number, worldPos: THREE.Vector3) => void;
  doorHovered: boolean;
  onDoorHover: (h: boolean) => void;
  onDoorClick: () => void;
}

function Scene({
  positions,
  cameraTarget,
  onCameraArrived,
  onMonitorClick,
  doorHovered,
  onDoorHover,
  onDoorClick,
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

  // Point camera forward into the scene on first load
  useEffect(() => {
    camera.lookAt(0, 1.6, -10);
    if (orbitRef.current) {
      orbitRef.current.target.set(0, 1.6, -10);
      orbitRef.current.update();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <CameraRig target={cameraTarget} onArrived={onCameraArrived} />
      <BakeShadows />

      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[0, 12, 5]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={60}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={15}
        shadow-camera-bottom={-5}
      />
      {/* Subtle fill from behind viewer */}
      <directionalLight position={[0, 4, 8]} intensity={0.3} color="#e0e8ff" />

      <ScreenGlow />

      {/* Background & fog */}
      <color attach="background" args={["#ffffff"]} />
      <fog attach="fog" args={["#ffffff", 14, 45]} />

      {/* Reflective floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={90}
          roughness={0.08}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#efefef"
          metalness={0.12}
          mirror={1}
        />
      </mesh>

      {/* Monitor wall */}
      <CRTWall positions={positions} onMonitorClick={onMonitorClick} />
      <GreenScreens positions={positions} />
      <ScreenBezels positions={positions} />

      {/* Door */}
      <Door onClick={onDoorClick} hovered={doorHovered} onHover={onDoorHover} />

      {/* ── Neo (Standing, left side) ────────────────────────────── */}
      <group position={ARCHITECT_CONFIG.neoPosition} rotation={ARCHITECT_CONFIG.neoRotation}>
        {/* Head */}
        <mesh position={[0, 1.72, 0]} castShadow>
          <sphereGeometry args={[0.14, 12, 8]} />
          <meshStandardMaterial color="#d4a574" roughness={0.8} />
        </mesh>
        {/* Hair */}
        <mesh position={[0, 1.82, -0.02]} castShadow>
          <sphereGeometry args={[0.15, 8, 6]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.95} />
        </mesh>
        {/* Sunglasses band */}
        <mesh position={[0, 1.73, 0.12]}>
          <boxGeometry args={[0.22, 0.04, 0.04]} />
          <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Neck */}
        <mesh position={[0, 1.56, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.07, 0.12, 8]} />
          <meshStandardMaterial color="#d4a574" roughness={0.8} />
        </mesh>
        {/* Torso (black coat) */}
        <mesh position={[0, 1.25, 0]} castShadow>
          <boxGeometry args={[0.42, 0.55, 0.24]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.85} />
        </mesh>
        {/* Coat lower (long trench) */}
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[0.44, 0.5, 0.26]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.85} />
        </mesh>
        {/* Coat tail (goes past knees) */}
        <mesh position={[0, 0.35, -0.04]} castShadow>
          <boxGeometry args={[0.40, 0.35, 0.18]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.85} />
        </mesh>
        {/* Left arm */}
        <mesh position={[-0.28, 1.18, 0]} castShadow>
          <boxGeometry args={[0.12, 0.55, 0.14]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.85} />
        </mesh>
        {/* Right arm */}
        <mesh position={[0.28, 1.18, 0]} castShadow>
          <boxGeometry args={[0.12, 0.55, 0.14]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.85} />
        </mesh>
        {/* Left leg */}
        <mesh position={[-0.1, 0.38, 0]} castShadow>
          <boxGeometry args={[0.16, 0.76, 0.18]} />
          <meshStandardMaterial color="#111111" roughness={0.9} />
        </mesh>
        {/* Right leg */}
        <mesh position={[0.1, 0.38, 0]} castShadow>
          <boxGeometry args={[0.16, 0.76, 0.18]} />
          <meshStandardMaterial color="#111111" roughness={0.9} />
        </mesh>
      </group>

      {/* ── The Architect (Seated, right side) ────────────────────── */}
      <group position={ARCHITECT_CONFIG.architectPosition} rotation={ARCHITECT_CONFIG.architectRotation}>
        {/* ─ High-back chair ─ */}
        {/* Seat cushion */}
        <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.7, 0.1, 0.65]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.85} />
        </mesh>
        {/* Chair back */}
        <mesh position={[0, 0.95, -0.3]} castShadow>
          <boxGeometry args={[0.68, 0.85, 0.08]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.85} />
        </mesh>
        {/* Left armrest */}
        <mesh position={[-0.35, 0.62, -0.08]} castShadow>
          <boxGeometry args={[0.06, 0.06, 0.45]} />
          <meshStandardMaterial color="#222" roughness={0.8} />
        </mesh>
        {/* Right armrest */}
        <mesh position={[0.35, 0.62, -0.08]} castShadow>
          <boxGeometry args={[0.06, 0.06, 0.45]} />
          <meshStandardMaterial color="#222" roughness={0.8} />
        </mesh>
        {/* Chair legs (4) */}
        <mesh position={[-0.28, 0.22, 0.25]}>
          <cylinderGeometry args={[0.025, 0.025, 0.44, 6]} />
          <meshStandardMaterial color="#333" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0.28, 0.22, 0.25]}>
          <cylinderGeometry args={[0.025, 0.025, 0.44, 6]} />
          <meshStandardMaterial color="#333" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[-0.28, 0.22, -0.25]}>
          <cylinderGeometry args={[0.025, 0.025, 0.44, 6]} />
          <meshStandardMaterial color="#333" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0.28, 0.22, -0.25]}>
          <cylinderGeometry args={[0.025, 0.025, 0.44, 6]} />
          <meshStandardMaterial color="#333" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* ─ Architect figure (seated) ─ */}
        {/* Head */}
        <mesh position={[0, 1.42, -0.05]} castShadow>
          <sphereGeometry args={[0.14, 12, 8]} />
          <meshStandardMaterial color="#d4a574" roughness={0.8} />
        </mesh>
        {/* White hair */}
        <mesh position={[0, 1.5, -0.08]} castShadow>
          <sphereGeometry args={[0.145, 8, 6]} />
          <meshStandardMaterial color="#e8e8e8" roughness={0.95} />
        </mesh>
        {/* Beard */}
        <mesh position={[0, 1.34, 0.08]}>
          <boxGeometry args={[0.14, 0.1, 0.06]} />
          <meshStandardMaterial color="#cccccc" roughness={0.95} />
        </mesh>
        {/* Neck */}
        <mesh position={[0, 1.26, -0.02]} castShadow>
          <cylinderGeometry args={[0.06, 0.07, 0.1, 8]} />
          <meshStandardMaterial color="#d4a574" roughness={0.8} />
        </mesh>
        {/* Torso — light grey suit jacket */}
        <mesh position={[0, 1.0, -0.05]} castShadow>
          <boxGeometry args={[0.44, 0.45, 0.26]} />
          <meshStandardMaterial color="#c8c8c8" roughness={0.6} />
        </mesh>
        {/* Vest (darker layer) */}
        <mesh position={[0, 1.0, 0.06]}>
          <boxGeometry args={[0.30, 0.38, 0.06]} />
          <meshStandardMaterial color="#999999" roughness={0.7} />
        </mesh>
        {/* Tie */}
        <mesh position={[0, 1.02, 0.1]}>
          <boxGeometry args={[0.06, 0.32, 0.02]} />
          <meshStandardMaterial color="#888888" roughness={0.5} />
        </mesh>
        {/* Left arm (resting on armrest) */}
        <mesh position={[-0.3, 0.85, 0.05]} castShadow>
          <boxGeometry args={[0.12, 0.45, 0.14]} />
          <meshStandardMaterial color="#c8c8c8" roughness={0.6} />
        </mesh>
        {/* Right arm */}
        <mesh position={[0.3, 0.85, 0.05]} castShadow>
          <boxGeometry args={[0.12, 0.45, 0.14]} />
          <meshStandardMaterial color="#c8c8c8" roughness={0.6} />
        </mesh>
        {/* Lap / upper legs (seated, horizontal) */}
        <mesh position={[-0.1, 0.56, 0.15]} castShadow>
          <boxGeometry args={[0.16, 0.1, 0.45]} />
          <meshStandardMaterial color="#b0b0b0" roughness={0.65} />
        </mesh>
        <mesh position={[0.1, 0.56, 0.15]} castShadow>
          <boxGeometry args={[0.16, 0.1, 0.45]} />
          <meshStandardMaterial color="#b0b0b0" roughness={0.65} />
        </mesh>
        {/* Lower legs (hanging down) */}
        <mesh position={[-0.1, 0.25, 0.35]} castShadow>
          <boxGeometry args={[0.14, 0.5, 0.14]} />
          <meshStandardMaterial color="#b0b0b0" roughness={0.65} />
        </mesh>
        <mesh position={[0.1, 0.25, 0.35]} castShadow>
          <boxGeometry args={[0.14, 0.5, 0.14]} />
          <meshStandardMaterial color="#b0b0b0" roughness={0.65} />
        </mesh>
        {/* Shoes */}
        <mesh position={[-0.1, 0.02, 0.4]}>
          <boxGeometry args={[0.14, 0.06, 0.22]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>
        <mesh position={[0.1, 0.02, 0.4]}>
          <boxGeometry args={[0.14, 0.06, 0.22]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>
      </group>

      {/* OrbitControls — look-only, no pan/zoom */}
      <OrbitControls
        ref={orbitRef}
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.08}
        maxPolarAngle={Math.PI / 2 + 0.15}
        minPolarAngle={Math.PI / 6}
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
  const [videoVisible, setVideoVisible] = useState(false);
  const [doorHovered, setDoorHovered] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  // Get video src for a given monitor instance
  const getVideoSrc = useCallback(
    (instanceId: number): string => {
      if (!videoPaths.length) return "";
      return videoPaths[instanceId % videoPaths.length];
    },
    [videoPaths]
  );

  const handleMonitorClick = useCallback(
    (instanceId: number, worldPos: THREE.Vector3) => {
      if (isReturning || activeScreen) return;
      const src = getVideoSrc(instanceId);
      setActiveScreen({ instanceId, worldPosition: worldPos, videoSrc: src });
      setCameraTarget(worldPos);
    },
    [isReturning, activeScreen, getVideoSrc]
  );

  // Camera has finished moving toward the monitor
  const handleCameraArrived = useCallback(() => {
    if (isReturning) {
      // Finished returning home
      setIsReturning(false);
      setCameraTarget(null);
      setActiveScreen(null);
    } else {
      // Finished moving toward monitor — show video
      setVideoVisible(true);
    }
  }, [isReturning]);

  const handleCloseVideo = useCallback(() => {
    setVideoVisible(false);
    setIsReturning(true);
    // Animate camera back to home position
    setCameraTarget(ARCHITECT_CONFIG.cameraHome.clone());
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", background: "#fff" }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 1.6, 0], fov: 60 }}
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
          onCameraArrived={handleCameraArrived}
          onMonitorClick={handleMonitorClick}
          doorHovered={doorHovered}
          onDoorHover={setDoorHovered}
          onDoorClick={onDoorClick}
        />
      </Canvas>

      {/* Fullscreen video overlay */}
      {videoVisible && activeScreen && (
        <VideoOverlay src={activeScreen.videoSrc} onClose={handleCloseVideo} />
      )}

      {/* Hint label */}
      {!activeScreen && (
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            color: "rgba(0,0,0,0.3)",
            fontFamily: "monospace",
            fontSize: 11,
            letterSpacing: "0.12em",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          DRAG TO LOOK · CLICK A SCREEN · CLICK THE DOOR
        </div>
      )}
    </div>
  );
}