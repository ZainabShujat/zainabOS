import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import * as THREE from 'three';
import { TrainingIcon } from '../shared/TrainingIcon';
import { useVisitorStore } from '../../lib/engine/store';

/**
 * ACT IV: The Orientation Room
 * A dedicated, museum-like space that exists solely to teach the visitor.
 * It contains abstract versions of key objects (desk, door, stairs, window).
 * When training is complete, the walls dissolve to reveal the Atrium.
 */
export function OrientationRoom() {
  const arrivalPhase = useVisitorStore(s => s.arrivalPhase);
  const setArrivalPhase = useVisitorStore(s => s.setArrivalPhase);
  
  const [step, setStep] = useState(1);
  const wallsRef = useRef<THREE.Group>(null);

  // When step 4 is reached, we trigger the dissolve animation
  useFrame((_, delta) => {
    if (step === 4 && wallsRef.current) {
      let allDissolved = true;
      
      wallsRef.current.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.transparent = true;
          mat.opacity = THREE.MathUtils.damp(mat.opacity, 0, 2, delta);
          if (mat.opacity > 0.05) {
            allDissolved = false;
          }
        }
      });

      // Once fully dissolved, move to ACT V (Recommendation)
      if (allDissolved) {
        setArrivalPhase('recommendation');
      }
    }
  });

  if (arrivalPhase !== 'training') return null;

  return (
    <group>
      {/* ==================== */}
      {/* THE DISSOLVING WALLS */}
      {/* ==================== */}
      <group ref={wallsRef}>
        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.9, 0]}>
          <planeGeometry args={[29, 39]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.5} metalness={0.1} />
        </mesh>
        
        {/* Back Wall */}
        <Box args={[29, 13.9, 1]} position={[0, 3, -9.5]}>
          <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
        </Box>
        
        {/* Left Wall */}
        <Box args={[1, 13.9, 39]} position={[-14.5, 3, 5]}>
          <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
        </Box>
        
        {/* Right Wall */}
        <Box args={[1, 13.9, 39]} position={[14.5, 3, 5]}>
          <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
        </Box>
        
        {/* Front Wall */}
        <Box args={[29, 13.9, 1]} position={[0, 3, 19.5]}>
          <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
        </Box>

        {/* Ceiling */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 9.9, 0]}>
          <planeGeometry args={[29, 39]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
        </mesh>

        {/* Interior Lighting for the Orientation Room */}
        <pointLight position={[0, 8, 0]} intensity={1.5} color="#ffffff" distance={30} decay={2} />
        <pointLight position={[0, 4, -5]} intensity={0.8} color="#e0f2fe" distance={20} decay={2} />
      </group>

      {/* ==================== */}
      {/* MUSEUM PROPS (Abstracted) */}
      {/* ==================== */}
      <group>
        {/* Abstract Desk */}
        <Box args={[4, 1.5, 2]} position={[6, -3, -2]} castShadow>
          <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.5} />
        </Box>
        
        {/* Abstract Notebook */}
        <Box args={[0.8, 0.1, 0.6]} position={[6, -2.2, -2]} castShadow>
          <meshStandardMaterial color="#38bdf8" roughness={0.5} />
        </Box>

        {/* Abstract Door */}
        <Box args={[3, 6, 0.2]} position={[-14, -1, 5]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <meshStandardMaterial color="#cbd5e1" roughness={0.2} />
        </Box>

        {/* Abstract Staircase */}
        <group position={[-5, -4, -6]}>
          {[0, 1, 2, 3].map((i) => (
            <Box key={i} args={[3, 0.3, 1]} position={[0, i * 0.3, -i * 1]} castShadow>
              <meshStandardMaterial color="#cbd5e1" />
            </Box>
          ))}
        </group>

        {/* Abstract Window Frame */}
        <group position={[14, 2, 8]} rotation={[0, -Math.PI / 2, 0]}>
          <Box args={[4, 0.2, 0.2]} position={[0, 2, 0]}><meshStandardMaterial color="#94a3b8" /></Box>
          <Box args={[4, 0.2, 0.2]} position={[0, -2, 0]}><meshStandardMaterial color="#94a3b8" /></Box>
          <Box args={[0.2, 4, 0.2]} position={[-2, 0, 0]}><meshStandardMaterial color="#94a3b8" /></Box>
          <Box args={[0.2, 4, 0.2]} position={[2, 0, 0]}><meshStandardMaterial color="#94a3b8" /></Box>
        </group>
      </group>

      {/* ==================== */}
      {/* LIGHTING */}
      {/* ==================== */}
      <ambientLight intensity={step === 4 ? 0 : 0.8} color="#ffffff" />
      <pointLight position={[0, 8, 5]} intensity={step === 4 ? 0 : 1} distance={30} />

      {/* ==================== */}
      {/* TRAINING ICONS */}
      {/* ==================== */}
      {/* Step 1: Walk toward me */}
      <TrainingIcon 
        position={[0, 0, 10]} 
        type="footprints" 
        label="Walk toward me (W/A/S/D or Click Floor)" 
        active={step === 1} 
        onInteract={() => setStep(2)} 
      />
      
      {/* Step 2: Look around */}
      <TrainingIcon 
        position={[-5, 0, 5]} 
        type="eye" 
        label="Look around (Click and Drag)" 
        active={step === 2} 
        onInteract={() => setStep(3)} 
      />
      
      {/* Step 3: Orientation / Finalize */}
      <TrainingIcon 
        position={[6, 0, -2]} 
        type="hand" 
        label="Orientation Complete." 
        active={step === 3} 
        onInteract={() => setStep(4)} // Triggers dissolve
      />

    </group>
  );
}
