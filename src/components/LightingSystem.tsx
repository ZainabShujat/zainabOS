import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTimeStore } from '../lib/engine/store';
import * as THREE from 'three';

const TIME_COLORS = {
  'Morning': {
    ambient: new THREE.Color('#e0f2fe'),
    directional: new THREE.Color('#fdf4ff'),
    intensity: { ambient: 0.15, directional: 3.5 },
    position: new THREE.Vector3(-25, 5, 2)
  },
  'Afternoon': {
    ambient: new THREE.Color('#ffffff'),
    directional: new THREE.Color('#fffbeb'),
    intensity: { ambient: 0.2, directional: 4.0 },
    position: new THREE.Vector3(-15, 15, 5)
  },
  'Golden Hour': {
    ambient: new THREE.Color('#fef3c7'),
    directional: new THREE.Color('#ea580c'),
    intensity: { ambient: 0.05, directional: 8.0 },
    position: new THREE.Vector3(-30, 2, 5)
  },
  'Night': {
    ambient: new THREE.Color('#020205'),
    directional: new THREE.Color('#0a0a2a'),
    intensity: { ambient: 0.01, directional: 0.05 },
    position: new THREE.Vector3(-15, 10, -5)
  }
};

export function LightingSystem() {
  const timeOfDay = useTimeStore((state) => state.timeOfDay);
  
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const directionalRef = useRef<THREE.DirectionalLight>(null);

  useFrame((_, delta) => {
    if (!ambientRef.current || !directionalRef.current) return;

    const target = TIME_COLORS[timeOfDay];
    const speed = delta * 2; // interpolation speed

    // Interpolate ambient
    ambientRef.current.color.lerp(target.ambient, speed);
    ambientRef.current.intensity = THREE.MathUtils.lerp(ambientRef.current.intensity, target.intensity.ambient, speed);

    // Interpolate directional
    directionalRef.current.color.lerp(target.directional, speed);
    directionalRef.current.intensity = THREE.MathUtils.lerp(directionalRef.current.intensity, target.intensity.directional, speed);
    directionalRef.current.position.lerp(target.position, speed);
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.2} color="#ffffff" />
      <directionalLight 
        ref={directionalRef}
        castShadow 
        shadow-mapSize-width={4096} // High res shadows for the window frame
        shadow-mapSize-height={4096}
        shadow-bias={-0.0001}
      >
        <orthographicCamera attach="shadow-camera" args={[-20, 20, 20, -20, 0.5, 50]} />
      </directionalLight>
      {/* We import Environment here but it's loaded from drei inside the component */}
    </>
  );
}
