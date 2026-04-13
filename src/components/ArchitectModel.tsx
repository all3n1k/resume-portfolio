"use client";

import React, { useMemo, useEffect } from "react";
import { useGraph } from "@react-three/fiber";
import { useFBX } from "@react-three/drei";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";

export default function ArchitectModel(props: React.ComponentProps<"group">) {
  // Load the FBX model
  const fbx = useFBX("/architect/ARCHITECTTEST.fbx");

  // Clone the scene so we can mutate it safely
  const clone = useMemo(() => SkeletonUtils.clone(fbx), [fbx]);
  useGraph(clone);

  useEffect(() => {
    // Just ensure the mesh receives/casts shadows and has cleaned normals
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        // Compute normals to discard broken smoothing groups (fixes vertical lines/stripes)
        if (mesh.geometry) {
          mesh.geometry.computeVertexNormals();
        }

        // Leave material side to default (FrontSide). DoubleSide on full character rigs causes internal shell bleeding
      }
    });
  }, [clone]);

  return (
    <group {...props}>
      {/* 
        The full standing model
      */}
      <group position={[0, 0, 0.4]} scale={[0.022, 0.022, 0.022]}>
        <primitive object={clone} />
      </group>

    </group>
  );
}

// Preload the model so it doesn't pop in
useFBX.preload("/architect/ARCHITECTTEST.fbx");
