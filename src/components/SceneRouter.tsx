import React from 'react';
import { useVisitorStore } from '../lib/engine/store';
import { AtriumRoom } from './rooms/AtriumRoom';
import { OrientationRoom } from './rooms/OrientationRoom';

export function SceneRouter() {
  const arrivalPhase = useVisitorStore(s => s.arrivalPhase);
  
  return (
    <>
      {/* If training is active, render OrientationRoom ON TOP of the current room */}
      {arrivalPhase === 'training' && (
        <React.Suspense fallback={null}>
          <OrientationRoom />
        </React.Suspense>
      )}

      {/* The Global Mansion Environment is ALWAYS rendered */}
      <React.Suspense fallback={null}>
        <AtriumRoom />
      </React.Suspense>
    </>
  );
}
