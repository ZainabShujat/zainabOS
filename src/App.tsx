import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, CameraControls, RoundedBox, Box, Text, ContactShadows, Cylinder, Sky } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { UIOverlay } from './components/UIOverlay';
import { SplashScreen } from './components/SplashScreen';
import { LightingSystem } from './components/LightingSystem';
import { useTimeStore } from './lib/engine/store';

// ==========================================
// SCENE & SKY
// ==========================================

function DynamicSky() {
  const timeOfDay = useTimeStore((s) => s.timeOfDay);
  
  // Match the sun positions from LightingSystem.tsx
  const sunPosition: [number, number, number] = 
    timeOfDay === 'Morning' ? [-25, 5, 2] :
    timeOfDay === 'Afternoon' ? [-15, 15, 5] :
    timeOfDay === 'Golden Hour' ? [-30, 2, 5] :
    [-15, -10, -5]; // Night (sun below horizon)
  
  return <Sky distance={450000} sunPosition={sunPosition} mieCoefficient={timeOfDay === 'Night' ? 0.05 : 0.005} rayleigh={timeOfDay === 'Night' ? 0.1 : 2} />;
}

// ==========================================
// OBJECTS (Premium Rounded Geometries)
// ==========================================

function Laptop({ position, rotation, onClick }: { position: [number, number, number], rotation: [number, number, number], onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <group 
      position={position} 
      rotation={rotation} 
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      {/* Floating prompt */}
      {hovered && (
        <Text position={[0, 1.5, 0]} fontSize={0.2} color="#38bdf8" outlineWidth={0.01} outlineColor="#000">
          [ Access Terminal ]
        </Text>
      )}
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
  );
}

function WallShelves() {
  return (
    <group position={[0, 3, -2.4]}>
      {/* Middle Left Shelf */}
      <RoundedBox args={[2.5, 0.05, 0.8]} radius={0.02} smoothness={4} position={[-2, 1, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#6b4423" roughness={0.8} />
      </RoundedBox>
      {/* Container with red lid on left shelf */}
      <Cylinder args={[0.2, 0.2, 0.3]} position={[-2, 1.2, 0]} castShadow>
         <meshStandardMaterial color="#ffffff" transparent opacity={0.5} />
      </Cylinder>
      <Cylinder args={[0.2, 0.2, 0.05]} position={[-2, 1.35, 0]} castShadow>
         <meshStandardMaterial color="#ef4444" />
      </Cylinder>

      {/* Top Right Shelf */}
      <RoundedBox args={[2.5, 0.05, 0.8]} radius={0.02} smoothness={4} position={[2.5, 2.5, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#6b4423" roughness={0.8} />
      </RoundedBox>

      {/* Bottom Right Shelf (Router + Unicorn) */}
      <RoundedBox args={[3, 0.05, 0.8]} radius={0.02} smoothness={4} position={[2.5, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#6b4423" roughness={0.8} />
      </RoundedBox>
      
      {/* Purple Unicorn Bookend (Block-out) */}
      <RoundedBox args={[0.8, 1, 0.4]} radius={0.05} smoothness={4} position={[1.5, 0.5, 0]} castShadow>
        <meshStandardMaterial color="#d8b4e2" roughness={0.9} />
      </RoundedBox>

      {/* Airtel Xstream Router */}
      <RoundedBox args={[1.2, 0.8, 0.2]} radius={0.05} smoothness={4} position={[3, 0.45, 0]} rotation={[-0.1, 0, 0]} castShadow>
        <meshStandardMaterial color="#f8fafc" roughness={0.2} />
      </RoundedBox>
      <Cylinder args={[0.02, 0.02, 0.8]} position={[2.5, 0.8, -0.1]} rotation={[0, 0, 0.2]} castShadow><meshStandardMaterial color="#f8fafc" /></Cylinder>
      <Cylinder args={[0.02, 0.02, 0.8]} position={[3.5, 0.8, -0.1]} rotation={[0, 0, -0.2]} castShadow><meshStandardMaterial color="#f8fafc" /></Cylinder>
      <RoundedBox args={[0.4, 0.02, 0.02]} radius={0.01} smoothness={2} position={[2.8, 0.6, 0.1]}><meshBasicMaterial color="#4ade80" /></RoundedBox>

      <Cylinder args={[0.005, 0.005, 3]} position={[3.4, -1.5, 0]} rotation={[0, 0, -0.05]}>
        <meshStandardMaterial color="#fde047" />
      </Cylinder>
    </group>
  );
}

function OpenNotebook({ position, rotation, onClick }: { position: [number, number, number], rotation: [number, number, number], onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group 
      position={position} 
      rotation={rotation} 
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      {/* Floating prompt */}
      {hovered && (
        <Text position={[0, 1, 0]} rotation={[0, Math.PI, 0]} fontSize={0.2} color="#fbbf24" outlineWidth={0.01} outlineColor="#000">
          [ Read Notes ]
        </Text>
      )}
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
  );
}

function MessyOrganizers() {
  return (
    <group>
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
  const timeOfDay = useTimeStore((s) => s.timeOfDay);
  const isDark = timeOfDay === 'Night' || timeOfDay === 'Golden Hour';
  const [lampOn, setLampOn] = useState(isDark);

  // Auto-switch based on time, but user can override
  useEffect(() => {
    setLampOn(isDark);
  }, [isDark]);

  return (
    <group>
      {/* Sleek Table Lamp */}
      <group 
        position={[-6, 0, -2.5]}
        onClick={(e) => { e.stopPropagation(); setLampOn(!lampOn); }}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; }}
      >
        <Cylinder args={[0.6, 0.8, 0.05]} position={[0, 0.025, 0]} castShadow><meshStandardMaterial color="#111" /></Cylinder>
        <Cylinder args={[0.05, 0.05, 2.5]} position={[0, 1.25, 0]} castShadow><meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} /></Cylinder>
        <Cylinder args={[0.8, 0.4, 0.8]} position={[0, 2.5, 0]} castShadow>
          <meshStandardMaterial color="#111" />
        </Cylinder>
        {/* Lamp Bulb */}
        <Cylinder args={[0.3, 0.7, 0.7]} position={[0, 2.45, 0]}>
          <meshStandardMaterial color={lampOn ? "#fde047" : "#444"} emissive="#fde047" emissiveIntensity={lampOn ? 2 : 0} />
        </Cylinder>
        {/* Lamp Light Source */}
        {lampOn && (
          <pointLight position={[0, 2, 0]} color="#fef08a" intensity={3} distance={15} decay={2} castShadow />
        )}
      </group>

      {/* Water bottle far left front */}
      <Cylinder args={[0.15, 0.15, 1.4]} position={[-5, 0.7, 1]} rotation={[0, 0.2, 0]} castShadow>
        <meshStandardMaterial color="#1e3a8a" roughness={0.4} metalness={0.1} />
      </Cylinder>
      
      {/* Fuzzy coaster far right */}
      <Cylinder args={[0.4, 0.4, 0.02]} position={[5.5, 0.01, 1]} rotation={[0, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#f8fafc" roughness={1} />
      </Cylinder>
      <Cylinder args={[0.1, 0.1, 0.02]} position={[5.45, 0.03, 1]} castShadow><meshStandardMaterial color="#fef08a" /></Cylinder>

      <RoundedBox args={[0.15, 0.2, 0.15]} radius={0.05} smoothness={4} position={[6.2, 0.1, 0.6]} rotation={[0, 0.4, 0]} castShadow><meshStandardMaterial color="#064e3b" /></RoundedBox>
      <RoundedBox args={[0.15, 0.3, 0.15]} radius={0.05} smoothness={4} position={[5.9, 0.15, 0.5]} rotation={[0, -0.2, 0]} castShadow><meshStandardMaterial color="#312e81" /></RoundedBox>

      {/* Journal and Remote center right */}
      <RoundedBox args={[1, 0.08, 1.4]} radius={0.02} smoothness={4} position={[1, 0.04, 2.5]} rotation={[0, 0.15, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#e5e5e5" roughness={0.8} />
      </RoundedBox>
      <RoundedBox args={[0.2, 0.05, 0.6]} radius={0.02} smoothness={4} position={[0.9, 0.1, 2.6]} rotation={[0, -0.4, 0]} castShadow>
        <meshStandardMaterial color="#f1f5f9" />
      </RoundedBox>

      {/* GEM box center left */}
      <RoundedBox args={[0.3, 0.1, 0.4]} radius={0.02} smoothness={4} position={[-1, 0.05, 1.5]} rotation={[0, -0.1, 0]} castShadow>
        <meshStandardMaterial color="#a3e635" transparent opacity={0.6} />
      </RoundedBox>

      {/* Stray Cable snaking across the back of the desk */}
      <Cylinder args={[0.01, 0.01, 10]} position={[0, 0.01, -1.6]} rotation={[Math.PI / 2, 0.05, 1.5]} castShadow>
        <meshStandardMaterial color="#111" />
      </Cylinder>
    </group>
  );
}

function EnclosedArchitecture() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.5} />
      </mesh>
      
      {/* Roof */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 10, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Back Wall (Vertical Pine Wood Panels) */}
      <mesh position={[0, 3, -2.5]} receiveShadow>
        <planeGeometry args={[40, 20]} />
        <meshStandardMaterial color="#d97736" roughness={0.9} />
      </mesh>
      
      {/* Right Wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[10, 3, 0]} receiveShadow>
        <planeGeometry args={[40, 20]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      
      {/* Wall behind the camera */}
      <mesh rotation={[0, Math.PI, 0]} position={[0, 3, 10]} receiveShadow>
        <planeGeometry args={[40, 20]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Left Wall (The Window Wall) */}
      <group position={[-10, 3, 0]}>
        {/* Top chunk */}
        <Box args={[1, 6, 40]} position={[0, 7, 0]} receiveShadow><meshStandardMaterial color="#1e293b" /></Box>
        {/* Bottom chunk */}
        <Box args={[1, 4, 40]} position={[0, -5, 0]} receiveShadow><meshStandardMaterial color="#1e293b" /></Box>
        {/* Front chunk */}
        <Box args={[1, 10, 15]} position={[0, 1, 12.5]} receiveShadow><meshStandardMaterial color="#1e293b" /></Box>
        {/* Back chunk */}
        <Box args={[1, 10, 15]} position={[0, 1, -12.5]} receiveShadow><meshStandardMaterial color="#1e293b" /></Box>
        
        {/* The Window Frame (Mullions) */}
        <Box args={[0.2, 10, 0.2]} position={[0, 1, 0]} castShadow><meshStandardMaterial color="#0f172a" /></Box>
        <Box args={[0.2, 0.2, 10]} position={[0, 1, 0]} castShadow><meshStandardMaterial color="#0f172a" /></Box>
      </group>
    </group>
  );
}

// ==========================================
// SCENE
// ==========================================

export default function App() {
  const [started, setStarted] = useState(false);
  const [focusedObject, setFocusedObject] = useState<string | null>(null);
  const cameraControlRef = React.useRef<any>(null);
  
  // Time controls
  const timeOfDay = useTimeStore((s) => s.timeOfDay);
  const setTimeOfDay = useTimeStore((s) => s.setTimeOfDay);

  const handlePointerMissed = () => {
    setFocusedObject(null);
  };

  // The Camera Swoop Logic
  React.useEffect(() => {
    if (cameraControlRef.current && started) {
      if (focusedObject === 'laptop') {
        // Swoop to laptop screen 
        cameraControlRef.current.setLookAt(-3, 0.6, 0.5, -3, 0.5, -1.4, true);
      } else if (focusedObject === 'notebook') {
        // Swoop to notebook pages
        cameraControlRef.current.setLookAt(2.5, 0.8, 1.8, 2.5, 0, 1, true);
      } else {
        // Reset to default room view
        cameraControlRef.current.setLookAt(0, 4, 8, 0, 0.5, 0, true);
      }
    }
  }, [focusedObject, started]);

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#0a0a0a' }}>
      <SplashScreen started={started} onEnter={() => setStarted(true)} />
      
      {started && (
        <>
          <Canvas shadows camera={{ position: [0, 4, 8], fov: 45 }} onPointerMissed={handlePointerMissed}>
            
            <color attach="background" args={['#d1d5db']} />
            {/* The Dynamic Sky (visible through the window) */}
            <DynamicSky />
            
            {/* Dynamic Lighting System replaces static lights */}
            <LightingSystem />
            <Environment preset="apartment" environmentIntensity={timeOfDay === 'Night' ? 0.05 : timeOfDay === 'Golden Hour' ? 0.4 : 0.8} />

            {/* Cinematic Post-Processing */}
            <EffectComposer>
              <Bloom luminanceThreshold={0.85} luminanceSmoothing={0.9} intensity={0.1} />
              <Noise opacity={0.02} />
              <Vignette eskil={false} offset={0.1} darkness={0.6} />
            </EffectComposer>

            {/* The Desk Surface */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
              <planeGeometry args={[15, 8]} />
              <meshStandardMaterial color="#3f1d13" roughness={0.8} />
            </mesh>

            {/* Desk Underneath (Drawer Unit on Right) */}
            <group position={[5.4, -2, 0.5]}>
              <Box args={[4, 4, 6]} castShadow receiveShadow>
                 <meshStandardMaterial color="#3f1d13" roughness={0.9} />
              </Box>
              <Box args={[4.02, 0.02, 5.8]} position={[0, 0.8, 0.1]}><meshStandardMaterial color="#111" /></Box>
              <Box args={[1, 0.05, 0.05]} position={[0, 1.2, 3.02]}><meshStandardMaterial color="#c0c0c0" /></Box>
            </group>
            
            {/* The Enclosed Room Architecture (Walls, Roof, Window) */}
            <EnclosedArchitecture />

            {/* The Desk Mat */}
            <mesh rotation={[-Math.PI / 2, 0, 0.02]} position={[-0.2, 0.005, 0.5]} receiveShadow>
              <planeGeometry args={[7, 4]} />
              <meshStandardMaterial color="#1c1917" roughness={0.9} />
            </mesh>
            
            {/* Contact Shadows for realism on the desk */}
            <ContactShadows resolution={1024} scale={15} blur={2.5} opacity={0.6} far={10} color="#000" position={[0, 0.02, 0]} />

            {/* Architecture */}
            <WallShelves />

            {/* Lived-in Objects - PREMIUM ROUNDED GEOMETRIES */}
            <Laptop 
              position={[-3, 0.01, -1]} 
              rotation={[0, 0.35, 0]}
              onClick={() => setFocusedObject('laptop')} 
            />

            <OpenNotebook 
              position={[2.5, 0.01, 1]} 
              rotation={[0, -0.2, 0]}
              onClick={() => setFocusedObject('notebook')} 
            />

            <MessyOrganizers />
            <ScatteredObjects />

            {/* Camera Controls */}
            <CameraControls 
              ref={cameraControlRef}
              makeDefault 
              minPolarAngle={0} 
              maxPolarAngle={Math.PI / 2 + 0.2}
              minDistance={1.5} 
              maxDistance={12} 
            />
          </Canvas>
          
          {/* HTML Overlay connecting the 3D scene to the Knowledge Graph */}
          <UIOverlay focusedObject={focusedObject} onClose={() => setFocusedObject(null)} />

          {/* Environmental Controls (CTA) */}
          <div style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '1rem',
            background: 'rgba(0,0,0,0.5)',
            padding: '1rem',
            borderRadius: '2rem',
            backdropFilter: 'blur(10px)',
            pointerEvents: 'auto'
          }}>
            <span style={{ color: 'white', lineHeight: '2rem', marginRight: '1rem', fontFamily: 'monospace' }}>TIME: {timeOfDay}</span>
            {['Morning', 'Afternoon', 'Golden Hour', 'Night'].map((t) => (
              <button 
                key={t}
                onClick={() => setTimeOfDay(t as any)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '1rem',
                  border: 'none',
                  background: timeOfDay === t ? 'white' : 'transparent',
                  color: timeOfDay === t ? 'black' : 'white',
                  cursor: 'pointer',
                  fontWeight: timeOfDay === t ? 'bold' : 'normal'
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
