import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useVisitorStore, RoomType } from '../../lib/engine/store';

interface AnimatedDoorProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  targetRoom: RoomType;
  label: string;
}

export function AnimatedDoor({ position, rotation = [0, 0, 0], targetRoom, label }: AnimatedDoorProps) {
  const [hovered, setHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const setIsTransitioning = useVisitorStore((s) => s.setIsTransitioning);
  const setRoom = useVisitorStore((s) => s.setRoom);
  const doorRef = useRef<THREE.Group>(null);

  const handleDoorClick = () => {
    if (isOpen) return;
    setIsOpen(true);
    // Let the door swing open for 0.8s, then trigger fade to black
    setTimeout(() => {
      setIsTransitioning(true);
      // Wait for 1s fade to finish, then swap geometry
      setTimeout(() => {
        setRoom(targetRoom);
      }, 1000);
    }, 800);
  };

  useFrame((state, delta) => {
    if (isOpen && doorRef.current) {
      // Smoothly swing the door open to 90 degrees (Math.PI / 2)
      doorRef.current.rotation.y = THREE.MathUtils.damp(doorRef.current.rotation.y, Math.PI / 2, 4, delta);
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {hovered && !isOpen && (
        <Text position={[0, 4, -0.5]} fontSize={0.3} color="#fbbf24" outlineWidth={0.02} outlineColor="#000">
          {label}
        </Text>
      )}
      
      {/* Door Frame (Stationary) */}
      <Box args={[4.2, 9.2, 0.4]} position={[0, 4.5, 0]}>
        <meshStandardMaterial color="#1f150e" />
      </Box>

      {/* The Door Hinge Group */}
      <group 
        ref={doorRef}
        position={[1.9, 0, 0]} // Hinge located at the right edge of the frame
        onClick={(e) => { e.stopPropagation(); handleDoorClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); if (!isOpen) setHovered(true); document.body.style.cursor = isOpen ? 'auto' : 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        {/* The Door itself, offset negatively so its edge aligns with the hinge */}
        <Box args={[3.8, 8.8, 0.2]} position={[-1.9, 4.5, 0.1]}>
          <meshStandardMaterial color="#3f1d13" />
        </Box>
        {/* Doorknob, positioned relative to the hinge */}
        <Cylinder args={[0.1, 0.1, 0.2]} position={[-3.4, 4.5, 0.2]} rotation={[Math.PI/2, 0, 0]}>
          <meshStandardMaterial color="#c0c0c0" metalness={0.8} />
        </Cylinder>
      </group>
    </group>
  );
}
