import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { UIOverlay } from './components/UIOverlay';
import { LightingSystem } from './components/LightingSystem';
import { PresenceController } from './components/PresenceController';
import { useTimeStore, useVisitorStore } from './lib/engine/store';
import { SceneRouter } from './components/SceneRouter';
import { LiveMapUI } from './components/LiveMapUI';
import { RoomWalkthroughUI } from './components/RoomWalkthroughUI';
import { TherapyChatUI } from './components/TherapyChatUI';
import { AnimatePresence, motion } from 'framer-motion';
import { useSettingsStore } from './lib/engine/store';
import { FloatingIsland } from './components/FloatingIsland';
import { ArrivalCinematic } from './components/ArrivalCinematic';
import { RecommendationUI, ModeSelectionUI } from './components/ArrivalSequenceUI';
import { ArrivalTextOverlay } from './components/ArrivalTextOverlay';
import { LandingScreen } from './components/SplashScreen';
import { CanvasErrorBoundary } from './components/CanvasErrorBoundary';
import { ControlsUI } from './components/ControlsUI';

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
  
  // The sun position far away in the sky
  const sunPosition: [number, number, number] = 
    timeOfDay === 'Morning' ? [-800, 200, -1000] :
    timeOfDay === 'Afternoon' ? [0, 600, -1000] :
    timeOfDay === 'Golden Hour' ? [800, 150, -1000] :
    [0, -500, 0]; // Night (sun below horizon)
  
  return (
    <group>
      <Stars radius={800} depth={200} count={25000} factor={8} saturation={1} fade speed={2} />
      {timeOfDay !== 'Night' && (
        <group>
          {/* The Physical Glowing Star */}
          <mesh position={sunPosition}>
            <sphereGeometry args={[150, 64, 64]} />
            <meshStandardMaterial color={timeOfDay === 'Golden Hour' ? "#fbbf24" : "#fef08a"} emissive={timeOfDay === 'Golden Hour' ? "#f59e0b" : "#fde047"} emissiveIntensity={2} toneMapped={false} />
          </mesh>
          
          <directionalLight 
            position={sunPosition} 
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
  const focusedObjectId = useVisitorStore(s => s.focusedObjectId);
  const setFocusedObject = useVisitorStore(s => s.focusObject);
  const currentRoom = useVisitorStore(s => s.currentRoom);
  const previousRoom = useVisitorStore(s => s.previousRoom);
  const cameraControlRef = useRef<any>(null);
  
  // Time controls
  const timeOfDay = useTimeStore((s) => s.timeOfDay);
  const setTimeOfDay = useTimeStore((s) => s.setTimeOfDay);
  
  // Graphics Settings

  const handlePointerMissed = () => {
    setFocusedObject(null);
    if (viewMode === 'immersive' && (arrivalPhase === 'complete' || arrivalPhase === 'training')) {
      document.body.requestPointerLock();
    }
  };
  
  const arrivalPhase = useVisitorStore(s => s.arrivalPhase);
  const viewMode = useSettingsStore(s => s.viewMode);

  // The Camera Swoop Logic & Dynamic Spawning
  useEffect(() => {
    if (cameraControlRef.current) {
      if (focusedObjectId === 'laptop') {
        cameraControlRef.current.setLookAt(-3, 0.6, 0.5, -3, 0.5, -1.4, true);
      } else if (focusedObjectId === 'notebook') {
        cameraControlRef.current.setLookAt(2.5, 0.8, 1.8, 2.5, 0, 1, true);
      } else {
        if (arrivalPhase === 'training') {
          // Teleport to the center of the Orientation Room!
          // We set animate=false to snap instantly
          cameraControlRef.current.setLookAt(0, 1.6, 5, 0, 1.6, -2, false);
        } else if (arrivalPhase === 'complete') {
          // Dynamic Room Spawning
          if (currentRoom === 'Atrium' || currentRoom === 'Hallway') {
            // Spawn in the Atrium facing the Grand Staircase
            cameraControlRef.current.setLookAt(0, 3.0, 15, 0, 3.0, -5, true);
          } else if (currentRoom === 'Study') {
            // Spawn at the door facing into the Study
            cameraControlRef.current.setLookAt(-1, 3.0, 21.5, -1, 3.0, 0, true);
          } else if (currentRoom === 'TherapyRoom') {
            // Spawn at the door facing into the Therapy Room
            cameraControlRef.current.setLookAt(0, 3.0, 18, 0, 3.0, 0, true);
          } else {
            // Default spawn
            cameraControlRef.current.setLookAt(0, 3.0, 10, 0, 3.0, 0, true);
          }
        }
      }
    }
  }, [focusedObjectId, currentRoom, previousRoom, arrivalPhase]);

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#0a0a0a', position: 'relative' }}>
      
      <CanvasErrorBoundary>
        <Canvas shadows camera={{ position: [0, 1.5, 10], fov: 45, far: 5000 }} onPointerMissed={handlePointerMissed}>
            <color attach="background" args={['#03030a']} />
            <DynamicGalaxy />
            <LightingSystem />
            <React.Suspense fallback={null}>
              <Environment preset="apartment" environmentIntensity={timeOfDay === 'Night' ? 0.05 : timeOfDay === 'Golden Hour' ? 0.4 : 0.8} />
            </React.Suspense>

            <EngineSettings />
            
            {/* Cinematic Post-Processing (Disabled temporarily to debug black screen) */}

            {/* The Floating Island Base */}
            <React.Suspense fallback={null}>
              <group scale={[3, 3, 3]} position={[0, -8.6, 0]}>
                <FloatingIsland />
              </group>
            </React.Suspense>

            {/* Render Current Room based on State */}
            <React.Suspense fallback={null}>
              <SceneRouter />
            </React.Suspense>

            {/* Camera Controls - Cinematic overrides when in arrival phase */}
            <ArrivalCinematic cameraRef={cameraControlRef} />
            <PresenceController ref={cameraControlRef} />
        </Canvas>
      </CanvasErrorBoundary>

          {/* ACT I: Title Screen */}
          <LandingScreen />

          {/* Blackout curtain during introText */}
          {arrivalPhase === 'introText' && (
            <div style={{
              position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
              backgroundColor: '#000', zIndex: 9000, pointerEvents: 'none'
            }} />
          )}

          {/* Recommendation UI (ACT IV) */}
          <RecommendationUI />
          
          {/* Central Reticle (Crosshair) - Only show when immersive and playing */}
          {(arrivalPhase === 'complete' || arrivalPhase === 'training') && viewMode === 'immersive' && (
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
          )}
          
          {/* HTML Overlay - Only show during gameplay or training */}
          {(arrivalPhase === 'training' || arrivalPhase === 'complete') && (
            <UIOverlay focusedObject={focusedObjectId} onClose={() => setFocusedObject(null)} />
          )}

          {/* Spatial Live Map - Only show during complete gameplay */}
          {arrivalPhase === 'complete' && <LiveMapUI />}


          {/* Room Walkthrough UI */}
          <RoomWalkthroughUI />

          {/* Therapy Session Chat UI */}
          <TherapyChatUI />

          {/* Room Transition Overlay */}
          <TransitionOverlay />

          {/* Cinematic Text Overlay for Arrival Sequence */}
          <ArrivalTextOverlay />

          {/* Mode Selection UI */}
          <ModeSelectionUI />

          <ControlsUI />

          {/* Environmental Controls (CTA) - Only show during complete gameplay */}
          {arrivalPhase === 'complete' && (
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
          )}

          {/* DEV OVERLAY FOR DEBUGGING (REMOVED) */}
        </div>
  );
}
