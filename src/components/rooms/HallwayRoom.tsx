import React, { useState } from 'react';
import { Box, Text } from '@react-three/drei';
import { useVisitorStore } from '../../lib/engine/store';

export function HallwayRoom() {
  const setIsTransitioning = useVisitorStore((s) => s.setIsTransitioning);
  const setRoom = useVisitorStore((s) => s.setRoom);
  const [hovered, setHovered] = useState(false);

  const handleDoorClick = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setRoom('Study');
    }, 1000);
  };

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]} receiveShadow>
        <planeGeometry args={[10, 40]} />
        <meshStandardMaterial color="#475569" roughness={0.7} />
      </mesh>
      
      {/* Walls */}
      <Box args={[1, 14, 40]} position={[-5.5, 3, 0]} receiveShadow><meshStandardMaterial color="#1e293b" /></Box>
      <Box args={[1, 14, 40]} position={[5.5, 3, 0]} receiveShadow><meshStandardMaterial color="#1e293b" /></Box>
      <Box args={[10, 14, 1]} position={[0, 3, 20]} receiveShadow><meshStandardMaterial color="#0f172a" /></Box>
      
      {/* Door back to Study */}
      <group 
        position={[0, -0.5, -19.8]} 
        onClick={(e) => { e.stopPropagation(); handleDoorClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        {hovered && (
          <Text position={[0, 4, 0]} fontSize={0.3} color="#fbbf24" outlineWidth={0.02} outlineColor="#000" rotation={[0, Math.PI, 0]}>
            [ Open Door to Study ]
          </Text>
        )}
        <Box args={[4.2, 7.2, 0.4]} position={[0, 3.5, 0]}>
          <meshStandardMaterial color="#1f150e" />
        </Box>
        <Box args={[3.8, 6.8, 0.2]} position={[0, 3.5, 0.1]}>
          <meshStandardMaterial color="#3f1d13" />
        </Box>
      </group>

      <Text position={[0, 2, 0]} rotation={[0, Math.PI, 0]} fontSize={0.8} color="#94a3b8">
        The Hallway
      </Text>
    </group>
  );
}
