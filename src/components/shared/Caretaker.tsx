import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface CaretakerProps {
  position?: [number, number, number];
}

export function Caretaker({ position = [0, 0, 0] }: CaretakerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * 1.5) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* The main blob body */}
      <Sphere ref={meshRef} args={[0.5, 64, 64]} scale={[1, 1.2, 1]}>
        <MeshDistortMaterial
          ref={materialRef}
          color="#38bdf8"
          emissive="#0ea5e9"
          emissiveIntensity={0.8}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.1}
          roughness={0.2}
          transparent={true}
          opacity={0.8}
          distort={0.3} // Amount of wobbly distortion
          speed={2} // Speed of wobble
        />
      </Sphere>
      
      {/* Core glow */}
      <pointLight color="#38bdf8" intensity={2} distance={3} decay={2} />
    </group>
  );
}
