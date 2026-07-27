import { useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useVisitorStore } from '../lib/engine/store';

/**
 * Handles the cinematic camera movements for the Arrival Sequence (ACT I and ACT II).
 * - Fly-in from deep space to the island.
 * - Slow circling of the mansion while text appears.
 */
export function ArrivalCinematic({ cameraRef }: { cameraRef: React.MutableRefObject<any> }) {
  const arrivalPhase = useVisitorStore(s => s.arrivalPhase);
  const setArrivalPhase = useVisitorStore(s => s.setArrivalPhase);
  
  const [startTime, setStartTime] = useState(0);

  useEffect(() => {
    if (arrivalPhase === 'flyIn' || arrivalPhase === 'circling') {
      setStartTime(performance.now());
    }
  }, [arrivalPhase]);

  useFrame(() => {
    if (!cameraRef.current) return;
    
    const elapsed = (performance.now() - startTime) / 1000;

    if (arrivalPhase === 'flyIn') {
      // Deep space fly-in (ACT I)
      // Start far away: z=150, y=50
      // End at circling orbit start: z=40, y=10
      const duration = 20; // 20 seconds for the fly-in 
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth step easing
      const ease = progress * progress * (3 - 2 * progress);
      
      const startZ = 80;
      const endZ = 40;
      const startY = 50;
      const endY = 10;

      const currentZ = startZ - (startZ - endZ) * ease;
      const currentY = startY - (startY - endY) * ease;

      cameraRef.current.setLookAt(
        0, currentY, currentZ, // Camera pos
        0, 0, 0, // Look at center of mansion
        true // Animate
      );

      if (progress >= 1) {
        setArrivalPhase('circling');
      }

    } else if (arrivalPhase === 'circling') {
      // Cinematic circling (ACT II)
      // Orbit around the mansion slowly
      const radius = 40;
      const height = 10;
      const speed = 0.05; // radians per second
      
      const angle = elapsed * speed;
      
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;

      cameraRef.current.setLookAt(
        x, height, z, // Camera pos moving in a circle
        0, 0, 0, // Always look at center
        true
      );
    }
  });

  return null; // Logic only
}
