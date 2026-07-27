import { useState, useEffect } from 'react';
import { RoundedBox, Box, Text, ContactShadows, Cylinder, DragControls } from '@react-three/drei';
import * as THREE from 'three';
import { useTimeStore, useVisitorStore, useSettingsStore } from '../../lib/engine/store';
import { AnimatedDoor } from '../shared/AnimatedDoor';
import { InteractiveProp } from '../shared/InteractiveProp';
import { LightSwitch } from '../shared/LightSwitch';
import { AnimatedWindow } from '../shared/AnimatedWindow';

function Laptop({ position, rotation, onClick }: { position: [number, number, number], rotation: [number, number, number], onClick: () => void }) {
  return (
    <InteractiveProp 
      id="laptop" 
      label="[ Access Terminal ]" 
      position={position} 
      rotation={rotation}
      onClick={onClick}
      labelOffset={[0, 2.5, 0]}
    >
      <group scale={1.6}>
      {/* Laptop Cooling Pad/Stand underneath */}
      <RoundedBox args={[1.4, 0.02, 0.9]} radius={0.01} smoothness={4} position={[0, -0.02, 0]} castShadow>
        <meshStandardMaterial color="#111" />
      </RoundedBox>

      {/* Base */}
      <RoundedBox args={[1.5, 0.05, 1]} radius={0.02} smoothness={4} position={[0, 0.02, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#c0c0c0" roughness={0.4} metalness={0.7} /> 
      </RoundedBox>
      {/* Screen - Open and displaying VS Code */}
      <RoundedBox position={[0, 0.5, -0.45]} rotation={[-0.15, 0, 0]} radius={0.02} smoothness={4} args={[1.5, 1, 0.05]} castShadow>
        <meshStandardMaterial color="#1e1e1e" emissive="#1e1e1e" emissiveIntensity={0.3} />
      </RoundedBox>
      <Text position={[0, 0.5, -0.42]} rotation={[-0.15, 0, 0]} fontSize={0.04} color="#9cdcfe" anchorX="left" anchorY="top" position-x={-0.65} position-y={0.9}>
        {`import React from 'react';\nimport { Canvas } from '@react-three/fiber';\n\nfunction Room() {\n  // Rebuilding reality\n  return <Scene />;\n}`}
      </Text>
      
      {/* Laptop charging cable snaking away */}
      <Cylinder args={[0.01, 0.01, 2]} position={[-0.5, -0.02, -1.2]} rotation={[Math.PI / 2, 0, -0.5]} castShadow>
        <meshStandardMaterial color="#222" />
      </Cylinder>
      </group>
    </InteractiveProp>
  );
}

function WallShelves() {
  return (
    <group position={[-4.5, 3.8, -2.4]}>

      {/* Top Right Shelf */}
      <RoundedBox args={[2.5, 0.05, 0.8]} radius={0.02} smoothness={4} position={[2.5, 2.5, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#6b4423" roughness={0.8} />
      </RoundedBox>

      {/* Bottom Right Shelf (Router + Unicorn) */}
      <RoundedBox args={[3, 0.05, 0.8]} radius={0.02} smoothness={4} position={[2.5, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#6b4423" roughness={0.8} />
      </RoundedBox>
      
      {/* Purple Unicorn Bookend (Block-out) */}
      <InteractiveProp id="unicorn_bookend" label="[ Inspect Bookend ]" position={[1.5, 0.5, 0]} labelOffset={[0, 1, 0]}>
        <RoundedBox args={[0.8, 1, 0.4]} radius={0.05} smoothness={4} castShadow>
          <meshStandardMaterial color="#d8b4e2" roughness={0.9} />
        </RoundedBox>
      </InteractiveProp>

      {/* Airtel Xstream Router */}
      <InteractiveProp id="router" label="[ Inspect Router ]" position={[3, 0.45, 0]} rotation={[-0.1, 0, 0]} labelOffset={[0, 1, 0]}>
        <RoundedBox args={[1.2, 0.8, 0.2]} radius={0.05} smoothness={4} castShadow>
          <meshStandardMaterial color="#f8fafc" roughness={0.2} />
        </RoundedBox>
        <Cylinder args={[0.02, 0.02, 0.8]} position={[-0.5, 0.35, -0.1]} rotation={[0.1, 0, 0.2]} castShadow><meshStandardMaterial color="#f8fafc" /></Cylinder>
        <Cylinder args={[0.02, 0.02, 0.8]} position={[0.5, 0.35, -0.1]} rotation={[0.1, 0, -0.2]} castShadow><meshStandardMaterial color="#f8fafc" /></Cylinder>
        <RoundedBox args={[0.4, 0.02, 0.02]} radius={0.01} smoothness={2} position={[-0.2, 0.15, 0.1]}><meshBasicMaterial color="#4ade80" /></RoundedBox>
      </InteractiveProp>

      <Cylinder args={[0.005, 0.005, 3]} position={[3.4, -1.5, 0]} rotation={[0, 0, -0.05]}>
        <meshStandardMaterial color="#fde047" />
      </Cylinder>
    </group>
  );
}

function OpenNotebook({ position, rotation, onClick }: { position: [number, number, number], rotation: [number, number, number], onClick: () => void }) {
  return (
    <InteractiveProp 
      id="notebook" 
      label="[ Read Notes ]" 
      position={position} 
      rotation={rotation}
      onClick={onClick}
      labelOffset={[0, 1, 0]}
    >
      <group>
      {/* Pages */}
      <RoundedBox args={[1.2, 0.05, 1.6]} radius={0.01} smoothness={4} castShadow receiveShadow position={[0, 0.025, 0]}>
        <meshStandardMaterial color="#f8fafc" roughness={0.9} /> 
      </RoundedBox>
      {/* Spiral Bind */}
      <Cylinder args={[0.04, 0.04, 1.6]} position={[-0.6, 0.04, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
        <meshStandardMaterial color="#94a3b8" metalness={0.5} />
      </Cylinder>
      <Text position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.04} color="#334155" maxWidth={1}>
        {`24 25 26 27 28 \n\n- Workshop \n- Hackathon \n- Claude \n\n   Founding Member...`}
      </Text>
      
      {/* Blue Pen */}
      <RoundedBox args={[0.02, 0.02, 0.7]} radius={0.01} smoothness={4} position={[0.2, 0.06, 0.3]} rotation={[0, 0.8, 0]} castShadow>
         <meshStandardMaterial color="#0284c7" />
      </RoundedBox>

      {/* Clear ruler */}
      <RoundedBox args={[0.15, 0.01, 1.5]} radius={0.005} smoothness={2} position={[-0.8, 0, -0.4]} rotation={[0, -0.3, 0]} castShadow>
        <meshStandardMaterial color="#cbd5e1" transparent opacity={0.4} roughness={0.1} />
      </RoundedBox>
      </group>
    </InteractiveProp>
  );
}

function DraggableLamp() {
  const timeOfDay = useTimeStore((s) => s.timeOfDay);
  const isDark = timeOfDay === 'Night' || timeOfDay === 'Golden Hour';
  
  // 0 = Off, 1 = Yellow, 2 = White
  const [lampState, setLampState] = useState(isDark ? 1 : 0);

  // Auto-switch based on time, but user can override
  useEffect(() => {
    setLampState(isDark ? 1 : 0);
  }, [isDark]);

  const color = lampState === 1 ? '#fde047' : lampState === 2 ? '#f8fafc' : '#444';
  const intensity = lampState !== 0 ? 8 : 0;
  
  // To make spotLight target point down, we use a target object
  const [target] = useState(() => new THREE.Object3D());
  useEffect(() => {
    target.position.set(0, -1, 0); // pointing straight down relative to the light
  }, [target]);

  return (
    <DragControls axisLock="y" dragLimits={[[-10, 5], [0, 0], [-3, 3]]}>
      <group 
        position={[-6, 0, -2.5]}
        onClick={(e) => { e.stopPropagation(); setLampState((s) => (s + 1) % 3); }}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'grab'; }}
        onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; }}
        onPointerDown={(e) => { e.stopPropagation(); document.body.style.cursor = 'grabbing'; }}
        onPointerUp={(e) => { e.stopPropagation(); document.body.style.cursor = 'grab'; }}
      >
        {/* Clamp Base */}
        <RoundedBox args={[0.5, 0.4, 0.5]} radius={0.05} smoothness={4} position={[0, -0.1, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#111" />
        </RoundedBox>
        
        {/* Main Vertical Stem */}
        <Cylinder args={[0.04, 0.04, 3]} position={[0, 1.5, 0]} castShadow>
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} />
        </Cylinder>
        
        {/* Hinge Joint */}
        <Cylinder args={[0.06, 0.06, 0.1]} position={[0, 3, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
           <meshStandardMaterial color="#000" metalness={0.9} />
        </Cylinder>

        {/* Angled Neck */}
        <Cylinder args={[0.04, 0.04, 1.5]} position={[0.6, 3.4, 0]} rotation={[0, 0, -Math.PI / 3]} castShadow>
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} />
        </Cylinder>

        {/* Top Hinge */}
        <Cylinder args={[0.06, 0.06, 0.1]} position={[1.2, 3.8, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
           <meshStandardMaterial color="#000" metalness={0.9} />
        </Cylinder>

        {/* Double Light Head (T-Bar) */}
        <RoundedBox args={[4, 0.05, 0.3]} radius={0.02} smoothness={2} position={[1.2, 3.8, 0]} castShadow>
          <meshStandardMaterial color="#111" />
        </RoundedBox>
        
        {/* Light emission panels */}
        <RoundedBox args={[1.8, 0.02, 0.2]} position={[-0.7, 3.78, 0]}>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity * 0.5} />
        </RoundedBox>
        <RoundedBox args={[1.8, 0.02, 0.2]} position={[3.1, 3.78, 0]}>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity * 0.5} />
        </RoundedBox>
        
        {/* Actual Lights emitting downwards */}
        {lampState !== 0 && (
          <>
            <primitive object={target} position={[1.2, 3, 0]} />
            <spotLight position={[-0.7, 3.7, 0]} target={target} color={color} intensity={intensity} distance={25} decay={2} castShadow angle={Math.PI / 2} penumbra={1} />
            <spotLight position={[3.1, 3.7, 0]} target={target} color={color} intensity={intensity} distance={25} decay={2} castShadow angle={Math.PI / 2} penumbra={1} />
          </>
        )}
      </group>
    </DragControls>
  );
}

function MessyOrganizers() {
  return (
    <group position={[-4.5, 0, 0]}>
      {/* Pink Organizer pushed far back left */}
      <group position={[-2, 0.2, -1.8]} rotation={[0, 0.15, 0]}>
        <RoundedBox args={[1, 0.4, 0.6]} radius={0.05} smoothness={4} castShadow receiveShadow>
          <meshStandardMaterial color="#fbcfe8" roughness={0.7} />
        </RoundedBox>
        <Cylinder args={[0.02, 0.02, 0.6]} position={[-0.3, 0.3, -0.1]} rotation={[0.2, 0, 0.3]} castShadow><meshStandardMaterial color="#dc2626" /></Cylinder>
        <Cylinder args={[0.02, 0.02, 0.7]} position={[-0.1, 0.3, 0.1]} rotation={[-0.2, 0, -0.1]} castShadow><meshStandardMaterial color="#1d4ed8" /></Cylinder>
        <Cylinder args={[0.02, 0.02, 0.5]} position={[0.2, 0.2, -0.2]} rotation={[0.5, 0, -0.4]} castShadow><meshStandardMaterial color="#fbbf24" /></Cylinder>
      </group>

      {/* Floral Organizer pushed far back right */}
      <group position={[4.5, 0.6, -1.5]} rotation={[0, -0.35, 0]}>
        <RoundedBox args={[1, 1.2, 0.8]} radius={0.05} smoothness={4} castShadow receiveShadow>
          <meshStandardMaterial color="#fef3c7" roughness={0.9} />
        </RoundedBox>
        <RoundedBox args={[0.05, 1.1, 0.7]} radius={0.01} smoothness={2} position={[-0.3, 0, 0]} rotation={[0, 0, 0.1]} castShadow><meshStandardMaterial color="#4c1d95" /></RoundedBox>
        <RoundedBox args={[0.05, 1.05, 0.7]} radius={0.01} smoothness={2} position={[-0.1, 0, 0]} rotation={[0, 0, -0.05]} castShadow><meshStandardMaterial color="#0f766e" /></RoundedBox>
        <RoundedBox args={[0.05, 1.15, 0.7]} radius={0.01} smoothness={2} position={[0.15, 0.05, 0]} rotation={[0, 0, 0.02]} castShadow><meshStandardMaterial color="#e2e8f0" /></RoundedBox>
      </group>
    </group>
  );
}

function ScatteredObjects() {
  return (
    <group position={[-4.5, 0, 0]}>
      <DraggableLamp />

      {/* Water bottle far left front */}
      <InteractiveProp id="water_bottle" label="[ Hydrate ]" position={[-5, 0.7, 1]} rotation={[0, 0.2, 0]}>
        <Cylinder args={[0.15, 0.15, 1.4]} castShadow>
          <meshStandardMaterial color="#1e3a8a" roughness={0.4} metalness={0.1} />
        </Cylinder>
      </InteractiveProp>
      
      {/* Fuzzy coaster far right */}
      <InteractiveProp id="fuzzy_coaster" label="[ Inspect Coaster ]" position={[5.5, 0.01, 1]}>
        <Cylinder args={[0.4, 0.4, 0.02]} castShadow receiveShadow>
          <meshStandardMaterial color="#f8fafc" roughness={1} />
        </Cylinder>
        <Cylinder args={[0.1, 0.1, 0.02]} position={[-0.05, 0.02, 0]} castShadow><meshStandardMaterial color="#fef08a" /></Cylinder>
      </InteractiveProp>

      <InteractiveProp id="tea_mug" label="[ Drink Tea ]" position={[6.2, 0.1, 0.6]} rotation={[0, 0.4, 0]}>
        <RoundedBox args={[0.15, 0.2, 0.15]} radius={0.05} smoothness={4} castShadow><meshStandardMaterial color="#064e3b" /></RoundedBox>
      </InteractiveProp>
      <InteractiveProp id="coffee_mug" label="[ Drink Coffee ]" position={[5.9, 0.15, 0.5]} rotation={[0, -0.2, 0]}>
        <RoundedBox args={[0.15, 0.3, 0.15]} radius={0.05} smoothness={4} castShadow><meshStandardMaterial color="#312e81" /></RoundedBox>
      </InteractiveProp>

      {/* Journal and Remote center right */}
      <InteractiveProp id="journal_remote" label="[ Inspect Journal ]" position={[1, 0.04, 2.5]} rotation={[0, 0.15, 0]}>
        <RoundedBox args={[1, 0.08, 1.4]} radius={0.02} smoothness={4} castShadow receiveShadow>
          <meshStandardMaterial color="#e5e5e5" roughness={0.8} />
        </RoundedBox>
        <RoundedBox args={[0.2, 0.05, 0.6]} radius={0.02} smoothness={4} position={[-0.1, 0.06, 0.1]} rotation={[0, -0.55, 0]} castShadow>
          <meshStandardMaterial color="#f1f5f9" />
        </RoundedBox>
      </InteractiveProp>

      {/* GEM box center left */}
      <InteractiveProp id="gem_box" label="[ Inspect GEM Box ]" position={[-1, 0.05, 1.5]} rotation={[0, -0.1, 0]}>
        <RoundedBox args={[0.3, 0.1, 0.4]} radius={0.02} smoothness={4} castShadow>
          <meshStandardMaterial color="#a3e635" transparent opacity={0.6} />
        </RoundedBox>
      </InteractiveProp>

      {/* Stray Cable snaking across the back of the desk */}
      <Cylinder args={[0.01, 0.01, 10]} position={[0, 0.01, -1.6]} rotation={[Math.PI / 2, 0.05, 1.5]} castShadow>
        <meshStandardMaterial color="#111" />
      </Cylinder>
    </group>
  );
}

function RoomFurniture() {
  const setSitTarget = useVisitorStore(s => s.setSitTarget);
  return (
    <group position={[-4.5, 0, 0]}>
      {/* The Rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.9, 2]} receiveShadow>
        <planeGeometry args={[18, 16]} />
        <meshStandardMaterial color="#e2e8f0" roughness={1} />
      </mesh>

      {/* The Chair */}
      <group 
        position={[1, -1, 4.5]} 
        rotation={[0, -0.2, 0]}
        onClick={(e) => { e.stopPropagation(); setSitTarget([-3.5, 1.0, 4.5], [-3.5, 1.0, 2.0]); }}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; }}
      >
        {/* Floating Prompt */}
        <Text position={[0, 2.5, 0]} fontSize={0.2} color="#fbbf24" outlineWidth={0.01} outlineColor="#000">
          [ Sit ]
        </Text>
        {/* Seat */}
        <RoundedBox args={[3, 0.4, 3]} radius={0.1} smoothness={4} position={[0, -0.5, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </RoundedBox>
        {/* Backrest */}
        <RoundedBox args={[3, 4, 0.4]} radius={0.1} smoothness={4} position={[0, 1.5, 1.5]} castShadow receiveShadow>
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </RoundedBox>
        {/* Base / Leg */}
        <Cylinder args={[0.2, 0.2, 2.5]} position={[0, -1.75, 0]} castShadow>
          <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
        </Cylinder>
        {/* Feet */}
        <Cylinder args={[1.5, 1.5, 0.2]} position={[0, -3, 0]} castShadow>
          <meshStandardMaterial color="#111" />
        </Cylinder>
      </group>

      {/* The Bed (Bottom Left) */}
      <group 
        position={[-6, -3.5, 14]} 
        rotation={[0, 0, 0]}
        onClick={(e) => { e.stopPropagation(); setSitTarget([-4, -1, 14], [-4, 2, 0]); }}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; }}
      >
        <Text position={[0, 3, 0]} fontSize={0.2} color="#fbbf24" outlineWidth={0.01} outlineColor="#000">
          [ Rest ]
        </Text>
        {/* Frame */}
        <RoundedBox args={[7, 1, 10]} radius={0.1} smoothness={4} castShadow receiveShadow>
          <meshStandardMaterial color="#3f1d13" roughness={0.9} />
        </RoundedBox>
        {/* Mattress */}
        <RoundedBox args={[6.6, 1.2, 9.6]} radius={0.2} smoothness={4} position={[0, 0.5, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#f8fafc" roughness={1} />
        </RoundedBox>
        {/* Pillows */}
        <RoundedBox args={[2.5, 0.4, 1.5]} radius={0.2} smoothness={4} position={[-1.5, 1.1, 3.5]} rotation={[-0.2, 0, 0]} castShadow>
          <meshStandardMaterial color="#e2e8f0" roughness={1} />
        </RoundedBox>
        <RoundedBox args={[2.5, 0.4, 1.5]} radius={0.2} smoothness={4} position={[1.5, 1.1, 3.5]} rotation={[-0.2, 0, 0]} castShadow>
          <meshStandardMaterial color="#e2e8f0" roughness={1} />
        </RoundedBox>
        {/* Blanket */}
        <RoundedBox args={[6.8, 0.2, 6]} radius={0.1} smoothness={4} position={[0, 1.15, -2]} castShadow receiveShadow>
          <meshStandardMaterial color="#334155" roughness={1} />
        </RoundedBox>
      </group>

      {/* The Almirah (Wardrobe) (Right Wall, Top) */}
      <group position={[10.5, 0.5, 0]} rotation={[0, -Math.PI/2, 0]}>
        <RoundedBox args={[6, 9, 3]} radius={0.1} smoothness={4} castShadow receiveShadow>
          <meshStandardMaterial color="#3f1d13" roughness={0.9} />
        </RoundedBox>
        {/* Doors */}
        <Box args={[2.9, 8.8, 0.1]} position={[-1.48, 0, 1.5]}><meshStandardMaterial color="#2d130c" /></Box>
        <Box args={[2.9, 8.8, 0.1]} position={[1.48, 0, 1.5]}><meshStandardMaterial color="#2d130c" /></Box>
        {/* Handles */}
        <Cylinder args={[0.05, 0.05, 1]} position={[-0.2, 0, 1.6]} castShadow><meshStandardMaterial color="#c0c0c0" metalness={0.8} /></Cylinder>
        <Cylinder args={[0.05, 0.05, 1]} position={[0.2, 0, 1.6]} castShadow><meshStandardMaterial color="#c0c0c0" metalness={0.8} /></Cylinder>
      </group>

      {/* The Sofa (Bottom Right) */}
      <group 
        position={[8, -2.5, 14]} 
        rotation={[0, Math.PI / 2, 0]}
        onClick={(e) => { e.stopPropagation(); setSitTarget([3.5, 1.0, 14], [-3.5, 1.0, 14]); }}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; }}
      >
        <Text position={[0, 4, 1]} rotation={[0, -Math.PI/2, 0]} fontSize={0.3} color="#fbbf24" outlineWidth={0.01} outlineColor="#000">
          [ Sit ]
        </Text>
        {/* Base */}
        <RoundedBox args={[8, 1, 3]} radius={0.1} smoothness={4} position={[0, 0, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#94a3b8" roughness={0.8} />
        </RoundedBox>
        {/* Seat Cushions */}
        <RoundedBox args={[3.8, 0.5, 2.8]} radius={0.1} smoothness={4} position={[-1.9, 0.6, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
        </RoundedBox>
        <RoundedBox args={[3.8, 0.5, 2.8]} radius={0.1} smoothness={4} position={[1.9, 0.6, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
        </RoundedBox>
        {/* Backrest */}
        <RoundedBox args={[8, 3, 1]} radius={0.1} smoothness={4} position={[0, 2, 1]} castShadow receiveShadow>
          <meshStandardMaterial color="#94a3b8" roughness={0.8} />
        </RoundedBox>
        {/* Armrests */}
        <RoundedBox args={[1, 2, 3]} radius={0.1} smoothness={4} position={[-3.5, 1, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
        </RoundedBox>
        <RoundedBox args={[1, 2, 3]} radius={0.1} smoothness={4} position={[3.5, 1, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
        </RoundedBox>
      </group>

      {/* The Softboard */}
      <group position={[-4.5, 4, -3.9]}>
        <Box args={[10, 4, 0.2]} castShadow receiveShadow>
          <meshStandardMaterial color="#5c3a21" roughness={1} /> {/* Frame */}
        </Box>
        <Box args={[9.6, 3.6, 0.25]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#c19a6b" roughness={1} /> {/* Corkboard */}
        </Box>
        
        {/* Pinned Note 1 */}
        <InteractiveProp id="pinned_goals" label="[ Read Goals ]" position={[-3, 0.5, 0.15]} rotation={[0, 0, 0.1]}>
          <Box args={[2, 2, 0.05]}><meshStandardMaterial color="#fef08a" /></Box>
          <Cylinder args={[0.05, 0.05, 0.1]} position={[0, 0.8, 0.05]} rotation={[Math.PI/2, 0, 0]}><meshStandardMaterial color="#ef4444" /></Cylinder>
          <Text position={[-0.8, 0.6, 0.05]} fontSize={0.2} color="#111" anchorX="left" maxWidth={1.8}>
            {`GOALS\n- Living Architecture\n- Knowledge Graph`}
          </Text>
        </InteractiveProp>

        {/* Pinned Note 2 */}
        <InteractiveProp id="pinned_blueprint" label="[ Inspect Blueprint ]" position={[1, -0.5, 0.15]} rotation={[0, 0, -0.05]}>
          <Box args={[1.5, 1.5, 0.05]}><meshStandardMaterial color="#bae6fd" /></Box>
          <Cylinder args={[0.05, 0.05, 0.1]} position={[0, 0.6, 0.05]} rotation={[Math.PI/2, 0, 0]}><meshStandardMaterial color="#3b82f6" /></Cylinder>
        </InteractiveProp>

        {/* Photo/Postcard */}
        <InteractiveProp id="postcard" label="[ View Memory ]" position={[3.5, 0.8, 0.15]} rotation={[0, 0, 0.15]}>
          <Box args={[2, 1.5, 0.05]}><meshStandardMaterial color="#f8fafc" /></Box>
          <Box args={[1.8, 1.1, 0.06]} position={[0, 0.1, 0]}><meshStandardMaterial color="#94a3b8" /></Box>
          <Cylinder args={[0.05, 0.05, 0.1]} position={[0, 0.6, 0.05]} rotation={[Math.PI/2, 0, 0]}><meshStandardMaterial color="#10b981" /></Cylinder>
        </InteractiveProp>
      </group>
    </group>
  );
}



function EnclosedArchitecture() {
  return (
    <group position={[-4.5, 0, 0]}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 8]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#2d2a26" roughness={0.7} />
      </mesh>
      
      {/* Roof */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 10, 8]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#1f2421" />
      </mesh>

      {/* Back Wall */}
      <Box args={[30, 20, 1]} position={[0, 3, -4.5]} receiveShadow>
        <meshStandardMaterial color="#4a5d4e" roughness={0.9} /> {/* Deep Sage Green */}
      </Box>
      
      {/* Right Wall */}
      <Box args={[1, 20, 30]} position={[12.5, 3, 8]} receiveShadow>
        <meshStandardMaterial color="#4a5d4e" />
      </Box>
      
      {/* Wall behind the camera (Front Wall) */}
      <Box args={[30, 20, 1]} position={[0, 3, 23.5]} receiveShadow>
        <meshStandardMaterial color="#4a5d4e" />
      </Box>

      {/* Left Wall (The Window Wall) */}
      <group position={[-12, 3, 8]}>
        <Box args={[1, 6, 30]} position={[0, 7, 0]} receiveShadow><meshStandardMaterial color="#1e293b" /></Box>
        <Box args={[1, 4, 30]} position={[0, -5, 0]} receiveShadow><meshStandardMaterial color="#1e293b" /></Box>
        <Box args={[1, 10, 10]} position={[0, 1, 10]} receiveShadow><meshStandardMaterial color="#1e293b" /></Box>
        <Box args={[1, 10, 10]} position={[0, 1, -10]} receiveShadow><meshStandardMaterial color="#1e293b" /></Box>
        
        {/* The Animated Window perfectly aligned with the cavity */}
        <AnimatedWindow position={[0, 0.5, 0]} rotation={[0, Math.PI / 2, 0]} width={10} height={7} />
      </group>

      <AnimatedDoor 
        position={[-1, -4, 22.8]} 
        rotation={[0, Math.PI, 0]} 
        targetRoom="Atrium" 
        label="[ Return to Atrium ]" 
        glowColor="#FFC857"
      />

      {/* Warm Amber Sconces (Night) */}
      <group position={[-5, 2, -3.9]}>
        <Box args={[0.2, 0.4, 0.1]} castShadow><meshStandardMaterial color="#111" /></Box>
        <pointLight color="#fbbf24" intensity={useTimeStore.getState().timeOfDay === 'Night' ? 2 : 0} distance={10} castShadow />
      </group>
      <group position={[5, 2, -3.9]}>
        <Box args={[0.2, 0.4, 0.1]} castShadow><meshStandardMaterial color="#111" /></Box>
        <pointLight color="#fbbf24" intensity={useTimeStore.getState().timeOfDay === 'Night' ? 2 : 0} distance={10} castShadow />
      </group>
    </group>
  );
}

export function StudyInterior() {
  const setFocusedObject = useVisitorStore(s => s.focusObject);
  const roomLights = useSettingsStore(s => s.roomLights);
  const isLightOn = roomLights['Study'];

  return (
    <group scale={0.4} position={[2, 1.6, -1]}>
      <ambientLight intensity={isLightOn ? 0.3 : 0.05} />
      {isLightOn && (
        <spotLight 
          position={[0, 9, 0]} 
          intensity={2} 
          angle={Math.PI / 3} 
          penumbra={1} 
          castShadow 
          shadow-mapSize={[2048, 2048]} 
        />
      )}
      
      {/* The Desk Surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-4.5, 0, 0]} receiveShadow>
        <planeGeometry args={[15, 8]} />
        <meshStandardMaterial color="#3f1d13" roughness={0.8} />
      </mesh>
      
      {/* Left Support Plank */}
      <Box args={[0.2, 4, 7.8]} position={[-11.9, -2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#3f1d13" roughness={0.9} />
      </Box>

      {/* Desk Underneath (Drawer Unit on Right) */}
      <group position={[0.9, -2, 0.5]}>
        <Box args={[4, 4, 6]} castShadow receiveShadow>
           <meshStandardMaterial color="#3f1d13" roughness={0.9} />
        </Box>
        <Box args={[4.02, 0.02, 5.8]} position={[0, 0.8, 0.1]}><meshStandardMaterial color="#111" /></Box>
        <Box args={[1, 0.05, 0.05]} position={[0, 1.2, 3.02]}><meshStandardMaterial color="#c0c0c0" /></Box>
      </group>
      
      {/* The Enclosed Room Architecture was removed to integrate into global mansion */}

      {/* The Desk Mat */}
      <mesh rotation={[-Math.PI / 2, 0, 0.02]} position={[-0.2, 0.005, 0.5]} receiveShadow>
        <planeGeometry args={[7, 4]} />
        <meshStandardMaterial color="#1c1917" roughness={0.9} />
      </mesh>
      
      {/* Contact Shadows for realism on the desk */}
      <ContactShadows resolution={1024} scale={15} blur={2.5} opacity={0.6} far={10} color="#000" position={[0, 0.02, 0]} />

      {/* Architecture */}
      <WallShelves />

      {/* The Light Switch near the door */}
      <LightSwitch position={[0.5, -1, 3.9]} rotation={[0, Math.PI, 0]} roomName="Study" />

      {/* Lived-in Objects */}
      <Laptop 
        position={[-3.5, 0.01, 2]} 
        rotation={[0, 0.1, 0]}
        onClick={() => setFocusedObject('laptop')} 
      />

      <OpenNotebook 
        position={[2.5, 0.01, 1]} 
        rotation={[0, -0.2, 0]}
        onClick={() => setFocusedObject('notebook')} 
      />

      <MessyOrganizers />
      <ScatteredObjects />
      <RoomFurniture />
    </group>
  );
}
