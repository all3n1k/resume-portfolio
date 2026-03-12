"use client";

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Instance, Instances, Environment, PerspectiveCamera, Html } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// Configuration for the screen wall
const RADIUS = 15;
const HEIGHT = 20;
const ROWS = 12;
const COLS = 36;

const SCREEN_WIDTH = 1.4;
const SCREEN_HEIGHT = 1.0;

function ScreenInstances({ onScreenClick }: { onScreenClick: (pos: THREE.Vector3, rot: THREE.Euler) => void }) {
  const screens = useMemo(() => {
    const items = [];
    // Only go around an arc, not a full cylinder so the player is inside looking at a wall
    const angleRange = Math.PI * 1.2; 
    const startAngle = -angleRange / 2;

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        // Calculate cylindrical coordinates
        const theta = startAngle + (c / (COLS - 1)) * angleRange;
        const y = (r - ROWS / 2 + 0.5) * (SCREEN_HEIGHT * 1.2);
        
        const x = Math.sin(theta) * RADIUS;
        const z = -Math.cos(theta) * RADIUS;

        items.push({
          position: new THREE.Vector3(x, y, z),
          // Look at center (0, y, 0), so invert the coords
          rotation: new THREE.Euler(0, -theta, 0),
          id: `screen-${r}-${c}`,
        });
      }
    }
    return items;
  }, []);

  return (
    <Instances limit={ROWS * COLS}>
      <boxGeometry args={[SCREEN_WIDTH, SCREEN_HEIGHT, 0.1]} />
      <meshStandardMaterial 
        color="#003300" 
        emissive="#00ff41" 
        emissiveIntensity={0.6}
        roughness={0.2} 
        metalness={0.8}
      />
      {screens.map((item) => (
        <Instance
          key={item.id}
          position={item.position}
          rotation={item.rotation}
          onClick={(e) => {
            e.stopPropagation();
            onScreenClick(item.position.clone(), item.rotation.clone());
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'auto';
          }}
        />
      ))}
    </Instances>
  );
}

function CameraRig({ 
  targetPos, 
  targetRot, 
  isZoomed,
  onArrived
}: { 
  targetPos: THREE.Vector3 | null; 
  targetRot: THREE.Euler | null;
  isZoomed: boolean;
  onArrived: () => void;
}) {
  const { camera } = useThree();
  const defaultPos = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const defaultLookAt = useMemo(() => new THREE.Vector3(0, 0, -RADIUS), []);
  
  const currentLookAt = useRef(new THREE.Vector3().copy(defaultLookAt));
  const hasArrived = useRef(false);

  useFrame((state, delta) => {
    if (isZoomed && targetPos && targetRot) {
      // Zoom into the screen, offset just slightly in front of it
      const offset = new THREE.Vector3(0, 0, 1.2);
      offset.applyEuler(targetRot);
      const idealPos = targetPos.clone().add(offset);
      
      camera.position.lerp(idealPos, delta * 3);
      
      // Look at the screen center
      currentLookAt.current.lerp(targetPos, delta * 3);
      camera.lookAt(currentLookAt.current);

      if (camera.position.distanceTo(idealPos) < 0.5 && !hasArrived.current) {
        hasArrived.current = true;
        onArrived();
      }
    } else {
      hasArrived.current = false;
      // Return to center
      camera.position.lerp(defaultPos, delta * 2);
      
      // Add a slight floating idle animation
      const time = state.clock.getElapsedTime();
      const idleLookAt = defaultLookAt.clone();
      idleLookAt.x += Math.sin(time * 0.5) * 2;
      idleLookAt.y += Math.cos(time * 0.3) * 1;
      
      currentLookAt.current.lerp(idleLookAt, delta * 2);
      camera.lookAt(currentLookAt.current);
    }
  });

  return null;
}

export default function MatrixRoom({ 
  onZoomChange, 
  onArrived 
}: { 
  onZoomChange: (zoomed: boolean) => void;
  onArrived: () => void;
}) {
  const [targetPos, setTargetPos] = useState<THREE.Vector3 | null>(null);
  const [targetRot, setTargetRot] = useState<THREE.Euler | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    onZoomChange(isZoomed);
  }, [isZoomed, onZoomChange]);

  const handleScreenClick = (pos: THREE.Vector3, rot: THREE.Euler) => {
    if (isZoomed) return; // Prevent clicking another screen while zoomed
    
    setTargetPos(pos);
    setTargetRot(rot);
    setIsZoomed(true);
  };

  const handleBackgroundClick = () => {
    if (isZoomed) {
      setIsZoomed(false);
    }
  };

  return (
    <div className="w-full h-full absolute inset-0 bg-black">
      <Canvas onPointerMissed={handleBackgroundClick}>
        <PerspectiveCamera makeDefault position={[0, 0, 0]} fov={60} />
        
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 5, 25]} />
        
        <ambientLight intensity={0.2} />
        
        {/* Central glowing light acting as the 'source' or just general room bounce */}
        <pointLight position={[0, 0, -RADIUS/2]} intensity={2} color="#00ff41" distance={20} />

        <ScreenInstances onScreenClick={handleScreenClick} />
        
        {/* Floor Reflections */}
        <mesh position={[0, -HEIGHT/2 * 1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial 
            color="#001100" 
            roughness={0.1} 
            metalness={0.9} 
          />
        </mesh>
        
        {/* Ceiling */}
        <mesh position={[0, HEIGHT/2 * 1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial 
            color="#000000" 
            roughness={0.8} 
          />
        </mesh>

        <CameraRig 
          targetPos={targetPos} 
          targetRot={targetRot} 
          isZoomed={isZoomed} 
          onArrived={onArrived} 
        />

        <EffectComposer>
          <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
