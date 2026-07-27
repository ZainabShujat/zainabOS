import { useState, useRef } from 'react';
import { Box, Cylinder, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * A 3D padlock that floats in front of a sealed area.
 * Gently bobs up and down and rotates, with a soft glow.
 */
interface PadlockProps {
  position: [number, number, number];
  color?: string;
  label?: string;
}

export function Padlock({ position, color = '#94a3b8', label }: PadlockProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle bobbing
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
      // Slow rotation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <group 
      ref={groupRef} 
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'not-allowed'; }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      {/* Lock Body */}
      <Box args={[1.2, 1, 0.5]} position={[0, 0, 0]} castShadow>
        <meshStandardMaterial 
          color={hovered ? '#fbbf24' : color} 
          metalness={0.8} 
          roughness={0.2} 
        />
      </Box>

      {/* Keyhole */}
      <Cylinder args={[0.1, 0.1, 0.6]} position={[0, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#0f172a" metalness={1} roughness={0} />
      </Cylinder>
      <Box args={[0.08, 0.2, 0.6]} position={[0, -0.2, 0]}>
        <meshStandardMaterial color="#0f172a" metalness={1} roughness={0} />
      </Box>

      {/* Shackle (the U-shaped top) */}
      {/* Left arm */}
      <Cylinder args={[0.12, 0.12, 0.8]} position={[-0.35, 0.85, 0]}>
        <meshStandardMaterial color={hovered ? '#fbbf24' : '#64748b'} metalness={0.9} roughness={0.15} />
      </Cylinder>
      {/* Right arm */}
      <Cylinder args={[0.12, 0.12, 0.8]} position={[0.35, 0.85, 0]}>
        <meshStandardMaterial color={hovered ? '#fbbf24' : '#64748b'} metalness={0.9} roughness={0.15} />
      </Cylinder>
      {/* Top curve (approximated with a box for simplicity) */}
      <Box args={[0.82, 0.25, 0.25]} position={[0, 1.25, 0]} castShadow>
        <meshStandardMaterial color={hovered ? '#fbbf24' : '#64748b'} metalness={0.9} roughness={0.15} />
      </Box>

      {/* Glow */}
      <pointLight position={[0, 0, 0.5]} distance={4} intensity={hovered ? 2 : 0.5} color={hovered ? '#fbbf24' : color} />

      {/* Label (visible on hover) */}
      {label && hovered && (
        <Text 
          position={[0, -1.2, 0]} 
          fontSize={0.3} 
          color="#94a3b8" 
          anchorX="center" 
          anchorY="middle"
        >
          {label}
        </Text>
      )}
    </group>
  );
}
