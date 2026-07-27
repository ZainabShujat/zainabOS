import React, { useRef } from 'react';
import { Box, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useVisitorStore, useSettingsStore } from '../../lib/engine/store';
import { StudyInterior } from './StudyRoom';
import { TherapyInterior } from './TherapyRoom';

// ==========================================
// ROOM HELPER COMPONENT
// ==========================================
export function RoomBlock({ 
  position, 
  size, 
  color, 
  name, 
  children
}: { 
  position: [number, number, number], 
  size: [number, number, number], 
  color: string, 
  name: string,
  children?: React.ReactNode
}) {
  const [w, h, d] = size;
  
  return (
    <group position={position}>
      {/* Floor Zone (Thin colored carpet/tile area) */}
      <Box args={[w - 0.2, 0.1, d - 0.2]} position={[0, 0, 0]} receiveShadow>
        <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} />
      </Box>

      {/* Ambient Light for the zone */}
      <pointLight position={[0, h - 0.5, 0]} intensity={1.5} distance={15} color={color} decay={2} />
      
      {/* Interior Props */}
      {children}
    </group>
  );
}

// ==========================================
// MANSION ARCHITECTURE (The 3-Story Blueprint)
// ==========================================
function MansionArchitecture() {
  const ch = 3.2; // Ceiling height

  const lowerRef = useRef<THREE.Group>(null);
  const mainRef = useRef<THREE.Group>(null);
  const topRef = useRef<THREE.Group>(null);
  const roofRef = useRef<THREE.Group>(null);

  const viewMode = useSettingsStore(s => s.viewMode);
  const explorerFloorLevel = useSettingsStore(s => s.explorerFloorLevel);

  useFrame(({ camera }) => {
    let level = explorerFloorLevel;
    
    if (viewMode === 'immersive') {
      level = 3;
    } else {
      // Calculate distance to center (which is roughly [0, 0, 0] in world coordinates)
      // Since MansionArchitecture is inside scaled and translated groups, 
      // let's measure distance to the origin
      const dist = camera.position.length();
      if (dist > 350) {
        level = 3; // Force show everything if zoomed out
      }
    }

    if (lowerRef.current) lowerRef.current.visible = level >= 0;
    if (mainRef.current) mainRef.current.visible = level >= 1;
    if (topRef.current) topRef.current.visible = level >= 2;
    if (roofRef.current) roofRef.current.visible = level >= 3;
  });

  // Floor Y levels
  const lowerY = -4;
  const mainY = lowerY + ch; // -0.8
  const topY = mainY + ch; // 2.4

  return (
    <group position={[0, 0, -15]}>
      {/* ================= LOWER FLOOR ================= */}
      <group ref={lowerRef}>
        <RoomBlock name="Therapy Room" position={[-9, lowerY, 9]} size={[8, ch, 8]} color="#9B59B6" />
        <RoomBlock name="System Room" position={[-10, lowerY, -5]} size={[6, ch, 6]} color="#7F8C8D" />
        <RoomBlock name="Idea Garden" position={[9, lowerY, -6.5]} size={[9, ch, 9]} color="#2ECC71" />
        <RoomBlock name="Archive Library" position={[10, lowerY, 9.5]} size={[10, ch, 11]} color="#8B4513" />
        
        {/* Lower Floor Solid Back/Sides */}
        <Box args={[34, ch, 1]} position={[-1.5, lowerY + ch/2, -12]} castShadow receiveShadow><meshStandardMaterial color="#f8fafc" /></Box>
        <Box args={[1, ch, 31]} position={[-18.5, lowerY + ch/2, 3.5]} castShadow receiveShadow><meshStandardMaterial color="#f8fafc" /></Box>
        <Box args={[1, ch, 31]} position={[15.5, lowerY + ch/2, 3.5]} castShadow receiveShadow><meshStandardMaterial color="#f8fafc" /></Box>
      </group>

      {/* ================= MAIN FLOOR ================= */}
      <group ref={mainRef}>
        <RoomBlock name="Entrance Atrium" position={[0, mainY, 8]} size={[7, ch, 7]} color="#F4D03F" />
        <RoomBlock name="Code Lab" position={[-9, mainY, -1]} size={[11, ch, 11]} color="#00D4FF" />
        <RoomBlock name="AI Lab" position={[9, mainY, -1]} size={[11, ch, 11]} color="#00D4FF" />
        <RoomBlock name="Project Gallery" position={[-11.5, mainY, 13.5]} size={[12, ch, 10]} color="#95A5A6" />
        <RoomBlock name="Recreation Room" position={[10, mainY, 12.5]} size={[9, ch, 8]} color="#E74C3C" />

        {/* Main Floor Solid Back/Sides */}
        <Box args={[34, ch, 1]} position={[-1.5, mainY + ch/2, -12]} castShadow receiveShadow><meshStandardMaterial color="#f8fafc" /></Box>
        <Box args={[1, ch, 31]} position={[-18.5, mainY + ch/2, 3.5]} castShadow receiveShadow><meshStandardMaterial color="#f8fafc" /></Box>
        <Box args={[1, ch, 31]} position={[15.5, mainY + ch/2, 3.5]} castShadow receiveShadow><meshStandardMaterial color="#f8fafc" /></Box>
        
        {/* Main Floor Deck */}
        <Box args={[36, 0.4, 34]} position={[-1.5, mainY, 3.5]} receiveShadow><meshStandardMaterial color="#e2e8f0" /></Box>

        {/* Lower to Main Stairs */}
        <Box args={[6, 0.4, 10]} position={[5, lowerY + ch/2, 2]} rotation={[0.6, 0, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#1e293b" />
        </Box>

        {/* Massive Glass Front Facades (Lower -> Main) */}
        <Box args={[34, ch * 2, 0.5]} position={[-1.5, lowerY + ch, 19]} castShadow receiveShadow>
          <meshStandardMaterial color="#94a3b8" transparent opacity={0.3} roughness={0.1} metalness={0.8} />
        </Box>
      </group>

      {/* ================= TOP FLOOR ================= */}
      <group ref={topRef}>
        <RoomBlock name="Observatory" position={[0, topY, -1.5]} size={[12, ch, 12]} color="#4A90E2" />
        <RoomBlock name="Study" position={[-11, topY, 4]} size={[10, ch, 11]} color="#FFC857" />
        <RoomBlock name="Writing Room" position={[-10.5, topY, 14]} size={[9, ch, 9]} color="#FFC857" />

        {/* Top Floor Shell */}
        <Box args={[24, ch, 1]} position={[-6.5, topY + ch/2, -8]} castShadow receiveShadow><meshStandardMaterial color="#f8fafc" /></Box>
        <Box args={[1, ch, 27]} position={[-18.5, topY + ch/2, 5]} castShadow receiveShadow><meshStandardMaterial color="#f8fafc" /></Box>

        {/* Top Floor Deck */}
        <Box args={[26, 0.4, 29]} position={[-6.5, topY, 5]} receiveShadow><meshStandardMaterial color="#e2e8f0" /></Box>

        {/* Main to Top Stairs */}
        <Box args={[6, 0.4, 10]} position={[-5, mainY + ch/2, 2]} rotation={[-0.6, 0, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#1e293b" />
        </Box>

        {/* Glass Front Facade (Top) */}
        <Box args={[24, ch, 0.5]} position={[-6.5, topY + ch/2, 18.5]} castShadow receiveShadow>
          <meshStandardMaterial color="#94a3b8" transparent opacity={0.3} roughness={0.1} metalness={0.8} />
        </Box>
      </group>

      {/* ================= ROOFS ================= */}
      <group ref={roofRef}>
        {/* Main Roof */}
        <Box args={[38, 0.6, 36]} position={[-1.5, mainY + ch, 4.5]} castShadow receiveShadow><meshStandardMaterial color="#0f172a" /></Box>
        {/* Top Roof */}
        <Box args={[28, 0.6, 31]} position={[-6.5, topY + ch, 6]} castShadow receiveShadow><meshStandardMaterial color="#0f172a" /></Box>
      </group>

    </group>
  );
}

// ==========================================
// ATRIUM ROOM MAIN EXPORT
// ==========================================
export function AtriumRoom() {
  const arrivalPhase = useVisitorStore(s => s.arrivalPhase);

  return (
    <group>
      {/* Base Foundation */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -36.2, -45]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>

      {/* MANSION SCALED BY 9x */}
      <group scale={9}>
        <MansionArchitecture />
      </group>
    </group>
  );
}
