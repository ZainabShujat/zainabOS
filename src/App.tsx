import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, CameraControls, Sky } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { UIOverlay } from './components/UIOverlay';
import { SplashScreen } from './components/SplashScreen';
import { LightingSystem } from './components/LightingSystem';
import { useTimeStore, useSettingsStore, useVisitorStore } from './lib/engine/store';
import { SceneRouter } from './components/SceneRouter';
import { LiveMapUI } from './components/LiveMapUI';
import { AnimatePresence, motion } from 'framer-motion';

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

function WASDControls({ controlsRef }: { controlsRef: React.MutableRefObject<any> }) {
  const keys = useRef({ w: false, a: false, s: false, d: false });
  const moveSpeed = useSettingsStore(s => s.moveSpeed);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'W') keys.current.w = true;
      if (e.key === 'a' || e.key === 'A') keys.current.a = true;
      if (e.key === 's' || e.key === 'S') keys.current.s = true;
      if (e.key === 'd' || e.key === 'D') keys.current.d = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'W') keys.current.w = false;
      if (e.key === 'a' || e.key === 'A') keys.current.a = false;
      if (e.key === 's' || e.key === 'S') keys.current.s = false;
      if (e.key === 'd' || e.key === 'D') keys.current.d = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;
    const speed = moveSpeed * delta;
    if (keys.current.w) controlsRef.current.forward(speed, true);
    if (keys.current.s) controlsRef.current.forward(-speed, true);
    if (keys.current.a) controlsRef.current.truck(-speed, 0, true);
    if (keys.current.d) controlsRef.current.truck(speed, 0, true);
  });

  return null;
}

// ==========================================
// Transition Overlay Overlay Component
// ==========================================
function TransitionOverlay() {
  const isTransitioning = useVisitorStore(s => s.isTransitioning);
  const setIsTransitioning = useVisitorStore(s => s.setIsTransitioning);

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 1500); // Wait for transition fade to finish (1000ms room change + 500ms fade in)
      return () => clearTimeout(timer);
    }
  }, [isTransitioning, setIsTransitioning]);

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: '#000', zIndex: 100, pointerEvents: 'none'
          }}
        />
      )}
    </AnimatePresence>
  );
}

// ==========================================
// SCENE
// ==========================================

export default function App() {
  const [started, setStarted] = useState(false);
  const focusedObjectId = useVisitorStore(s => s.focusedObjectId);
  const setFocusedObject = useVisitorStore(s => s.focusObject);
  const cameraControlRef = useRef<any>(null);
  const mouseSensitivity = useSettingsStore(s => s.mouseSensitivity);
  
  // Time controls
  const timeOfDay = useTimeStore((s) => s.timeOfDay);
  const setTimeOfDay = useTimeStore((s) => s.setTimeOfDay);

  const handlePointerMissed = () => {
    setFocusedObject(null);
  };

  // The Camera Swoop Logic
  useEffect(() => {
    if (cameraControlRef.current && started) {
      if (focusedObjectId === 'laptop') {
        // Swoop to laptop screen 
        cameraControlRef.current.setLookAt(-3, 0.6, 0.5, -3, 0.5, -1.4, true);
      } else if (focusedObjectId === 'notebook') {
        // Swoop to notebook pages
        cameraControlRef.current.setLookAt(2.5, 0.8, 1.8, 2.5, 0, 1, true);
      } else {
        // Reset to default room view (standing height, looking straight ahead)
        cameraControlRef.current.setLookAt(0, 3, 10, 0, 3, 0, true);
      }
    }
  }, [focusedObjectId, started]);

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#0a0a0a', position: 'relative' }}>
      <SplashScreen started={started} onEnter={() => setStarted(true)} />
      
      {started && (
        <>
          <Canvas shadows camera={{ position: [0, 3, 10], fov: 45 }} onPointerMissed={handlePointerMissed}>
            
            <color attach="background" args={['#d1d5db']} />
            <DynamicSky />
            <LightingSystem />
            <Environment preset="apartment" environmentIntensity={timeOfDay === 'Night' ? 0.05 : timeOfDay === 'Golden Hour' ? 0.4 : 0.8} />

            {/* Cinematic Post-Processing */}
            <EffectComposer>
              <Bloom luminanceThreshold={0.85} luminanceSmoothing={0.9} intensity={0.1} />
              <Noise opacity={0.02} />
              <Vignette eskil={false} offset={0.1} darkness={0.6} />
            </EffectComposer>

            {/* Render Current Room based on State */}
            <SceneRouter />

            {/* Camera Controls - Strictly confined to embodied limits */}
            <CameraControls 
              ref={cameraControlRef}
              makeDefault 
              minPolarAngle={Math.PI / 4} // Don't let them look straight up at the void
              maxPolarAngle={Math.PI / 2 - 0.05} // Don't let them look below the floor
              minDistance={1} 
              maxDistance={12} // Restrict zoom out so they stay inside the room boundaries
              azimuthRotateSpeed={mouseSensitivity}
              polarRotateSpeed={mouseSensitivity}
            />
            <WASDControls controlsRef={cameraControlRef} />
          </Canvas>
          
          {/* HTML Overlay connecting the 3D scene to the Knowledge Graph */}
          <UIOverlay focusedObject={focusedObjectId} onClose={() => setFocusedObject(null)} />

          {/* Spatial Live Map */}
          <LiveMapUI />

          {/* Room Transition Overlay */}
          <TransitionOverlay />

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
            pointerEvents: 'auto',
            zIndex: 50
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
