import { useState, useRef } from 'react';
import { Box } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { playUIClick } from '../../lib/audio';

interface AnimatedWindowProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
}

export function AnimatedWindow({ position, rotation = [0, 0, 0], width = 8, height = 4.2 }: AnimatedWindowProps) {
  const [isOpen, setIsOpen] = useState(false);

  const leftPaneRef = useRef<THREE.Group>(null);
  const rightPaneRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (leftPaneRef.current && rightPaneRef.current) {
      const targetRotationLeft = isOpen ? Math.PI / 2.5 : 0;
      const targetRotationRight = isOpen ? -Math.PI / 2.5 : 0;
      
      leftPaneRef.current.rotation.y = THREE.MathUtils.lerp(leftPaneRef.current.rotation.y, targetRotationLeft, 5 * delta);
      rightPaneRef.current.rotation.y = THREE.MathUtils.lerp(rightPaneRef.current.rotation.y, targetRotationRight, 5 * delta);
    }
  });

  const toggleWindow = (e: any) => {
    e.stopPropagation();
    playUIClick();
    setIsOpen(!isOpen);
  };

  const halfW = width / 2;
  const paneW = halfW;
  const paneOffset = paneW / 2;

  return (
    <group position={position} rotation={rotation}>
      {/* Outer Window Frame (Top, Bottom, Left, Right) */}
      <Box args={[width, 0.2, 0.2]} position={[0, height / 2, 0]}><meshStandardMaterial color="#1e293b" /></Box>
      <Box args={[width, 0.2, 0.2]} position={[0, -height / 2, 0]}><meshStandardMaterial color="#1e293b" /></Box>
      <Box args={[0.2, height, 0.2]} position={[-halfW, 0, 0]}><meshStandardMaterial color="#1e293b" /></Box>
      <Box args={[0.2, height, 0.2]} position={[halfW, 0, 0]}><meshStandardMaterial color="#1e293b" /></Box>

      {/* Left Pane Hinge */}
      <group 
        ref={leftPaneRef} 
        position={[-halfW, 0, 0]}
        onClick={toggleWindow}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; }}
      >
        <Box args={[paneW, height, 0.05]} position={[paneOffset, 0, 0]}>
          <meshPhysicalMaterial color="#38bdf8" transmission={0.9} opacity={1} transparent roughness={0.1} thickness={1} />
        </Box>
        <Box args={[paneW, 0.1, 0.1]} position={[paneOffset, height / 2 - 0.05, 0]}><meshStandardMaterial color="#334155" /></Box>
        <Box args={[paneW, 0.1, 0.1]} position={[paneOffset, -height / 2 + 0.05, 0]}><meshStandardMaterial color="#334155" /></Box>
        <Box args={[0.1, height, 0.1]} position={[paneW - 0.05, 0, 0]}><meshStandardMaterial color="#334155" /></Box>
        <Box args={[0.1, height, 0.1]} position={[paneOffset, 0, 0]}><meshStandardMaterial color="#334155" /></Box>
      </group>

      {/* Right Pane Hinge */}
      <group 
        ref={rightPaneRef} 
        position={[halfW, 0, 0]}
        onClick={toggleWindow}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; }}
      >
        <Box args={[paneW, height, 0.05]} position={[-paneOffset, 0, 0]}>
          <meshPhysicalMaterial color="#38bdf8" transmission={0.9} opacity={1} transparent roughness={0.1} thickness={1} />
        </Box>
        <Box args={[paneW, 0.1, 0.1]} position={[-paneOffset, height / 2 - 0.05, 0]}><meshStandardMaterial color="#334155" /></Box>
        <Box args={[paneW, 0.1, 0.1]} position={[-paneOffset, -height / 2 + 0.05, 0]}><meshStandardMaterial color="#334155" /></Box>
        <Box args={[0.1, height, 0.1]} position={[-paneW + 0.05, 0, 0]}><meshStandardMaterial color="#334155" /></Box>
        <Box args={[0.1, height, 0.1]} position={[-paneOffset, 0, 0]}><meshStandardMaterial color="#334155" /></Box>
      </group>
    </group>
  );
}
