import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import { useSettingsStore, useVisitorStore } from '../lib/engine/store';

export const PresenceController = forwardRef((_, ref) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  
  const sitTarget = useVisitorStore(s => s.sitTarget);
  
  useImperativeHandle(ref, () => ({
    setLookAt: (px: number, py: number, pz: number, tx: number, ty: number, tz: number) => {
      camera.position.set(px, py, pz);
      camera.lookAt(tx, ty, tz);
    }
  }));
  
  const moveSpeed = useSettingsStore(s => s.moveSpeed) * 0.5; // Tone down speed for walking
  const keys = useRef({ w: false, a: false, s: false, d: false });
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  
  // Head bob state
  const headBobTimer = useRef(0);
  
  // The door is 8.8 units tall. 4/5ths of the door height is roughly 7 units.
  // Floor is at y = -4. 
  // Standing eye height = -4 + 7.0 = 3.0
  const eyeHeight = 3.0;

  // When room changes, we need to unlock if transitioning? Actually PointerLock automatically unlocks on Esc.
  // We should enforce the eye height initially just in case.
  useEffect(() => {
    camera.position.y = eyeHeight;
  }, [camera, eyeHeight]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'KeyW') keys.current.w = true;
      if (event.code === 'KeyA') keys.current.a = true;
      if (event.code === 'KeyS') keys.current.s = true;
      if (event.code === 'KeyD') keys.current.d = true;
      if (event.code === 'KeyE') {
         if (useVisitorStore.getState().sitTarget) {
            useVisitorStore.getState().setSitTarget(null);
         }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'w') keys.current.w = false;
      if (e.key.toLowerCase() === 'a') keys.current.a = false;
      if (e.key.toLowerCase() === 's') keys.current.s = false;
      if (e.key.toLowerCase() === 'd') keys.current.d = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const sitLookAt = useVisitorStore(s => s.sitLookAt);
  
  useEffect(() => {
    if (sitTarget && sitLookAt && controlsRef.current) {
      const dummy = new THREE.Camera();
      dummy.position.set(sitTarget[0], sitTarget[1], sitTarget[2]);
      dummy.lookAt(sitLookAt[0], sitLookAt[1], sitLookAt[2]);
      
      // Directly copy quaternion to avoid Euler gimbal issues
      camera.quaternion.copy(dummy.quaternion);
    }
  }, [sitTarget, sitLookAt, camera]);

  useFrame((_, delta) => {
    if (sitTarget) {
      // Lerp to sit target
      camera.position.lerp(new THREE.Vector3(sitTarget[0], sitTarget[1], sitTarget[2]), 5 * delta);
      // Reset velocity so we don't shoot off when standing up
      velocity.current.set(0, 0, 0);
      return; // Skip walking logic
    }

    // Normal walking logic
    if (!controlsRef.current || !controlsRef.current.isLocked) return;
    
    // Smooth inertia physics
    velocity.current.x -= velocity.current.x * 10.0 * delta;
    velocity.current.z -= velocity.current.z * 10.0 * delta;

    direction.current.z = Number(keys.current.w) - Number(keys.current.s);
    direction.current.x = Number(keys.current.d) - Number(keys.current.a);
    direction.current.normalize(); // Ensure consistent movement diagonally

    // Acceleration
    if (keys.current.w || keys.current.s) velocity.current.z -= direction.current.z * moveSpeed * delta;
    if (keys.current.a || keys.current.d) velocity.current.x -= direction.current.x * moveSpeed * delta;

    // Apply movement
    controlsRef.current.moveRight(-velocity.current.x);
    controlsRef.current.moveForward(-velocity.current.z);
    
    // Head Bob calculation
    const speedSq = velocity.current.x * velocity.current.x + velocity.current.z * velocity.current.z;
    if (speedSq > 0.0001) {
      headBobTimer.current += delta * 12; // Frequency of bob
      // Subtle sine wave for Y bob
      camera.position.y = eyeHeight + Math.sin(headBobTimer.current) * 0.04; 
    } else {
      // Smoothly return to standing still eye height
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, eyeHeight, 5 * delta);
    }
  });

  return (
    <PointerLockControls ref={controlsRef} />
  );
});
