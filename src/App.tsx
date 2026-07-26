import { useState, useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { UIOverlay } from './components/UIOverlay';
import { SplashScreen } from './components/SplashScreen';
import { LightingSystem } from './components/LightingSystem';
import { PresenceController } from './components/PresenceController';
import { useTimeStore, useVisitorStore } from './lib/engine/store';
import { SceneRouter } from './components/SceneRouter';
import { LiveMapUI } from './components/LiveMapUI';
import { RoomWalkthroughUI } from './components/RoomWalkthroughUI';
import { TherapyChatUI } from './components/TherapyChatUI';
import { AnimatePresence, motion } from 'framer-motion';
import { useSettingsStore } from './lib/engine/store';

// ==========================================
// CAMERA & SETTINGS ENGINE
// ==========================================
function EngineSettings() {
  const fov = useSettingsStore(s => s.fov);
  const { camera } = useThree();
  
  useEffect(() => {
    if ((camera as any).isPerspectiveCamera) {
      (camera as any).fov = fov;
      camera.updateProjectionMatrix();
    }
  }, [fov, camera]);
  
  return null;
}
// ==========================================
// SCENE & GALAXY
// ==========================================

function DynamicGalaxy() {
  const timeOfDay = useTimeStore((s) => s.timeOfDay);
  
  // A localized rogue star that orbits the mansion
  const starPosition: [number, number, number] = 
    timeOfDay === 'Morning' ? [-25, 15, 20] :
    timeOfDay === 'Afternoon' ? [0, 40, 5] :
    timeOfDay === 'Golden Hour' ? [30, 10, -10] :
    [0, -50, 0]; // Night (sun below horizon)
  
  return (
    <group>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      {timeOfDay !== 'Night' && (
        <group>
          {/* The Physical Glowing Star */}
          <mesh position={starPosition}>
            <sphereGeometry args={[2, 32, 32]} />
            <meshBasicMaterial color={timeOfDay === 'Golden Hour' ? '#fbbf24' : '#ffffff'} />
          </mesh>
          
          <directionalLight 
            position={starPosition} 
            intensity={timeOfDay === 'Golden Hour' ? 1.5 : 2} 
            color={timeOfDay === 'Golden Hour' ? '#fbbf24' : '#fff'}
            castShadow 
            shadow-mapSize={[2048, 2048]}
          />
        </group>
      )}
    </group>
  );
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
  const currentRoom = useVisitorStore(s => s.currentRoom);
  const previousRoom = useVisitorStore(s => s.previousRoom);
  const cameraControlRef = useRef<any>(null);
  
  // Time controls
  const timeOfDay = useTimeStore((s) => s.timeOfDay);
  const setTimeOfDay = useTimeStore((s) => s.setTimeOfDay);
  
  // Graphics Settings
  const graphicsQuality = useSettingsStore(s => s.graphicsQuality);

  const handlePointerMissed = () => {
    setFocusedObject(null);
  };

  // The Camera Swoop Logic & Dynamic Spawning
  useEffect(() => {
    if (cameraControlRef.current && started) {
      if (focusedObjectId === 'laptop') {
        // Swoop to laptop screen 
        cameraControlRef.current.setLookAt(-3, 0.6, 0.5, -3, 0.5, -1.4, true);
      } else if (focusedObjectId === 'notebook') {
        // Swoop to notebook pages
        cameraControlRef.current.setLookAt(2.5, 0.8, 1.8, 2.5, 0, 1, true);
      } else {
        // Dynamic Room Spawning based on where the user just came from
        if (currentRoom === 'Study' && previousRoom === 'Hallway') {
           cameraControlRef.current.setLookAt(-1, 3.0, 21.5, -1, 3.0, 0, true);
        } else if (currentRoom === 'Hallway') {
           if (previousRoom === 'Study') {
             cameraControlRef.current.setLookAt(0, 3.0, -48, 0, 3.0, 0, true);
           } else if (previousRoom === 'TherapyRoom') {
             cameraControlRef.current.setLookAt(-3, 3.0, -20, 5, 3.0, -20, true);
           } else if (previousRoom === 'ChroniclesLibrary') {
             cameraControlRef.current.setLookAt(-3, 3.0, 10, 5, 3.0, 10, true);
           } else if (previousRoom === 'FreelanceStudio') {
             cameraControlRef.current.setLookAt(3, 3.0, -20, -5, 3.0, -20, true);
           } else if (previousRoom === 'AILab') {
             cameraControlRef.current.setLookAt(3, 3.0, 10, -5, 3.0, 10, true);
           } else if (previousRoom === 'AstronomyCorner') {
             cameraControlRef.current.setLookAt(-2, 3.0, 48, -2, 3.0, 0, true);
           } else if (previousRoom === 'MathCorner') {
             cameraControlRef.current.setLookAt(2, 3.0, 48, 2, 3.0, 0, true);
           } else {
             cameraControlRef.current.setLookAt(0, 3.0, 0, 0, 3.0, -10, true);
           }
        } else if (previousRoom === 'Hallway') {
           // We just entered a placeholder room from the Hallway. 
           // The placeholder door is at z = 9.8, so spawn at z = 8 facing z = -2
           cameraControlRef.current.setLookAt(0, 3.0, 8, 0, 3.0, -2, true);
        } else {
           // Default Room spawn
           cameraControlRef.current.setLookAt(0, 3.0, 10, 0, 3.0, 0, true);
        }
      }
    }
  }, [focusedObjectId, started, currentRoom, previousRoom]);

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#0a0a0a', position: 'relative' }}>
      <SplashScreen started={started} onEnter={() => setStarted(true)} />
      
      {started && (
        <>
          <Canvas shadows camera={{ position: [0, 1.5, 10], fov: 45 }} onPointerMissed={handlePointerMissed}>
            
            <color attach="background" args={['#03030a']} />
            <DynamicGalaxy />
            <LightingSystem />
            <Environment preset="apartment" environmentIntensity={timeOfDay === 'Night' ? 0.05 : timeOfDay === 'Golden Hour' ? 0.4 : 0.8} />

            <EngineSettings />
            
            {/* Cinematic Post-Processing */}
            {graphicsQuality !== 'Low' && (
              <EffectComposer>
                <Bloom luminanceThreshold={0.85} luminanceSmoothing={0.9} intensity={graphicsQuality === 'Ultra' ? 0.2 : 0.1} />
                <Noise opacity={0.02} />
                <Vignette eskil={false} offset={0.1} darkness={0.6} />
              </EffectComposer>
            )}

            {/* Render Current Room based on State */}
            <SceneRouter />

            {/* Camera Controls - Strictly confined to embodied limits */}
            <PresenceController ref={cameraControlRef} />
          </Canvas>
          
          {/* Central Reticle (Crosshair) */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '6px',
            height: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '50%',
            border: '1px solid rgba(0, 0, 0, 0.5)',
            pointerEvents: 'none',
            zIndex: 1000
          }} />
          
          {/* HTML Overlay connecting the 3D scene to the Knowledge Graph */}
          <UIOverlay focusedObject={focusedObjectId} onClose={() => setFocusedObject(null)} />

          {/* Spatial Live Map */}
          <LiveMapUI />

          {/* Room Walkthrough UI */}
          <RoomWalkthroughUI />

          {/* Therapy Session Chat UI */}
          <TherapyChatUI />

          {/* Room Transition Overlay */}
          <TransitionOverlay />

          {/* Environmental Controls (CTA) */}
          <div 
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            style={{
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
