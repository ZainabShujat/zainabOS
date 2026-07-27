import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

/**
 * A glowing, floating 3D icon for the Training sequence (Arrival ACT IV).
 * Used for diegetic instructions like "Walk toward me" (Footprints) and "Look around" (Eye).
 */
interface TrainingIconProps {
  position: [number, number, number];
  type: 'footprints' | 'eye' | 'hand';
  label: string;
  active: boolean; // Only visible/pulsing if active
  onInteract?: () => void;
}

export function TrainingIcon({ position, type, label, active, onInteract }: TrainingIconProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!active) return;
    
    if (groupRef.current) {
      // Gentle bobbing
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      // Always face camera (billboard effect for the icon itself)
      groupRef.current.quaternion.copy(state.camera.quaternion);
    }

    if (ringRef.current) {
      // Pulsing glow ring on the floor beneath the icon
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.1;
      ringRef.current.scale.set(scale, scale, scale);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(state.clock.elapsedTime * 4) * 0.2;
    }
  });

  if (!active) return null;

  // Simple SVG paths for the icons
  const getIcon = () => {
    switch (type) {
      case 'footprints':
        return '👣'; // Fallback to emoji if 3D svg parsing is too complex for now, but stylized
      case 'eye':
        return '👁️';
      case 'hand':
        return '👆';
      default:
        return '✨';
    }
  };

  return (
    <group>
      {/* The floating icon and text */}
      <group 
        ref={groupRef} 
        position={position}
        onClick={(e) => {
          if (onInteract) {
            e.stopPropagation();
            onInteract();
          }
        }}
        onPointerOver={() => { document.body.style.cursor = onInteract ? 'pointer' : 'auto'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      >
        {/* Glow sphere behind icon */}
        <mesh position={[0, 0, -0.1]}>
          <circleGeometry args={[0.4, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
        </mesh>

        <React.Suspense fallback={null}>
          <Text 
            position={[0, 0.1, 0]} 
            fontSize={0.4} 
            color="#ffffff" 
            anchorX="center" 
            anchorY="middle"
          >
            {getIcon()}
          </Text>

          <Text 
            position={[0, -0.4, 0]} 
            fontSize={0.15} 
            color="#f8fafc" 
            anchorX="center" 
            anchorY="middle"
            outlineWidth={0.01}
            outlineColor="#000000"
          >
            {label}
          </Text>
        </React.Suspense>
      </group>

      {/* The glowing footprint/target ring on the floor */}
      <mesh 
        ref={ringRef} 
        position={[position[0], -3.95, position[2]]} 
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.5, 0.6, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
      </mesh>
      
      {/* Central dot for the floor target */}
      <mesh position={[position[0], -3.95, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.1, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}
