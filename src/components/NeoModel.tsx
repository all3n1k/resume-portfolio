import React, { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useFBX, useAnimations, useTexture } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'

const texRoot = '/neo/';

export function Model(props: any) {
  const group = React.useRef<any>(null)

  const fbx = useFBX('/neo/Neo.fbx')
  const idleAnim = useFBX('/neo/Breathing Idle.fbx')

  // Clone to safely mount / play animations without mutating the cached fbx
  const clone = useMemo(() => SkeletonUtils.clone(fbx), [fbx])

  const { actions, names } = useAnimations(idleAnim.animations, group)

  // Map textures extracted from the original MTL precisely to the Mixamo FBX naming
  const textures = useTexture({
    '0008_untitledoutout': texRoot + 'topfront.png',
    '0012_untitledoutout': texRoot + 'hair2.png',
    '0009_untitledoutout': texRoot + 'pants.png',
    '0006_untitledoutout': texRoot + 'neck.png',
    '0001_untitledoutout': texRoot + 'arms.png',
    '0000_untitledoutout': texRoot + 'skirtfront.png',
    '0004_untitledoutout': texRoot + 'hair.png',
    '0007_untitledoutout': texRoot + 'head.png',
    '0015_untitledoutout': texRoot + 'teeth.png',
    '0010_untitledoutout': texRoot + 'hands.png',
    '0005_untitledoutout': texRoot + 'skirtback.png',
    '0014_untitledoutout': texRoot + 'glasses.png',
    '0013_untitledoutout': texRoot + 'eyes.png',
    '0003_untitledoutout': texRoot + 'topback.png',
    '0002_untitledoutout': texRoot + 'face.png',
    '0011_untitledoutout': texRoot + 'shoes.png'
  })

  useEffect(() => {
    // Rely purely on the native Drei hook for standard infinite looping
    if (names.length > 0 && actions[names[0]]) {
      actions[names[0]]?.reset().play();
    }
  }, [actions, names])

  useEffect(() => {
    // Apply textures and fix backface culling
    clone.traverse((child: any) => {
      if (child.isMesh) {
        const tex = textures[child.name as keyof typeof textures];
        if (tex) {
          tex.colorSpace = THREE.SRGBColorSpace;

          child.material = new THREE.MeshStandardMaterial({
            map: tex,
            side: THREE.DoubleSide,
            roughness: 0.8,
            metalness: 0.1
          });
        }
      }
    });
  }, [clone, textures]);

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={clone} />
    </group>
  )
}

useFBX.preload('/neo/Neo.fbx')
useFBX.preload('/neo/Breathing Idle.fbx')

