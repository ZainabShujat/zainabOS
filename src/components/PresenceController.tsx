import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useSettingsStore, useVisitorStore } from '../lib/engine/store';
import { playFootstep } from '../lib/audio';

export const PresenceController = forwardRef((_, ref) => {
  const { camera, scene } = useThree();
  const controlsRef = useRef<any>(null);
  
  const sitTarget = useVisitorStore(s => s.sitTarget);
  
  useImperativeHandle(ref, () => ({
    setLookAt: (px: number, py: number, pz: number, tx: number, ty: number, tz: number) => {
      camera.position.set(px, py, pz);
      camera.lookAt(tx, ty, tz);
    }
  }));
  
  const moveSpeed = useSettingsStore(s => s.moveSpeed) * 0.5; // Tone down speed for walking
  const soundVolume = useSettingsStore(s => s.soundVolume);
  const mouseSensitivity = useSettingsStore(s => s.mouseSensitivity);
  const viewMode = useSettingsStore(s => s.viewMode);
  const keys = useRef({ w: false, a: false, s: false, d: false, shift: false });
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
    if (viewMode === 'explorer') {
      camera.position.set(camera.position.x, 25, camera.position.z + 15);
      camera.lookAt(camera.position.x, 0, camera.position.z - 15);
    } else {
      camera.position.y = eyeHeight;
    }
  }, [camera, eyeHeight, viewMode]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'KeyW') keys.current.w = true;
      if (event.code === 'KeyA') keys.current.a = true;
      if (event.code === 'KeyS') keys.current.s = true;
      if (event.code === 'KeyD') keys.current.d = true;
      if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') keys.current.shift = true;
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
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys.current.shift = false;
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

  useFrame((state, delta) => {
    // Force raycaster to always shoot from the center of the screen
    if (controlsRef.current && controlsRef.current.isLocked) {
      state.pointer.set(0, 0);
      state.raycaster.setFromCamera(state.pointer, state.camera);
    }

    if (sitTarget) {
      // Lerp to sit target
      camera.position.lerp(new THREE.Vector3(sitTarget[0], sitTarget[1], sitTarget[2]), 5 * delta);
      // Reset velocity so we don't shoot off when standing up
      velocity.current.set(0, 0, 0);
      return; // Skip walking logic
    }

    // Normal walking logic
    if (viewMode === 'explorer') return; // Bypass first-person walking physics in Explorer Mode
    
    if (!controlsRef.current || !controlsRef.current.isLocked) return;
    
    // Smooth inertia physics
    velocity.current.x -= velocity.current.x * 10.0 * delta;
    velocity.current.z -= velocity.current.z * 10.0 * delta;

    direction.current.z = Number(keys.current.w) - Number(keys.current.s);
    direction.current.x = Number(keys.current.d) - Number(keys.current.a);
    direction.current.normalize(); // Ensure consistent movement diagonally

    const activeMoveSpeed = keys.current.shift ? moveSpeed * 2.5 : moveSpeed;

    // Acceleration
    if (keys.current.w || keys.current.s) velocity.current.z -= direction.current.z * activeMoveSpeed * delta;
    if (keys.current.a || keys.current.d) velocity.current.x -= direction.current.x * activeMoveSpeed * delta;

    // Apply movement
    const dx = -velocity.current.x;
    const dz = -velocity.current.z;
    
    // Collision Detection (Raycasting)
    const raycaster = new THREE.Raycaster();
    const currentPos = camera.position.clone();
    // Raycast at torso level to avoid hitting floor
    currentPos.y = eyeHeight - 1.0; 
    
    let canMoveX = true;
    let canMoveZ = true;

    // Check X direction
    if (Math.abs(dx) > 0.001) {
      const dirX = new THREE.Vector3(Math.sign(dx), 0, 0);
      // Transform local movement into world direction for raycaster
      dirX.applyQuaternion(camera.quaternion);
      dirX.y = 0; // Keep ray horizontal
      dirX.normalize();
      
      raycaster.set(currentPos, dirX);
      const hitsX = raycaster.intersectObjects(scene.children, true);
      if (hitsX.length > 0 && hitsX[0].distance < 0.5) {
        canMoveX = false;
        velocity.current.x = 0; // Stop momentum
      }
    }

    // Check Z direction (Forward/Backward)
    if (Math.abs(dz) > 0.001) {
      const dirZ = new THREE.Vector3(0, 0, Math.sign(dz));
      // Transform local movement into world direction for raycaster
      dirZ.applyQuaternion(camera.quaternion);
      dirZ.y = 0; // Keep ray horizontal
      dirZ.normalize();
      
      raycaster.set(currentPos, dirZ);
      const hitsZ = raycaster.intersectObjects(scene.children, true);
      if (hitsZ.length > 0 && hitsZ[0].distance < 0.5) {
        canMoveZ = false;
        velocity.current.z = 0; // Stop momentum
      }
    }

    if (canMoveX) controlsRef.current.moveRight(dx);
    if (canMoveZ) controlsRef.current.moveForward(dz);
    
    // Head Bob calculation
    const speedSq = velocity.current.x * velocity.current.x + velocity.current.z * velocity.current.z;
    if (speedSq > 0.0001) {
      const prevTimer = headBobTimer.current;
      headBobTimer.current += delta * 12; // Frequency of bob
      
      // Play footstep every time we cross PI (bottom/top of sine wave relative to steps)
      // Actually a step is usually when the head is at its lowest point.
      // Math.sin(t) is lowest at 3PI/2, 7PI/2, etc.
      // An easier way: check if Math.floor(prevTimer / Math.PI) < Math.floor(headBobTimer.current / Math.PI)
      if (Math.floor(prevTimer / Math.PI) < Math.floor(headBobTimer.current / Math.PI)) {
         playFootstep(soundVolume);
      }

      // Subtle sine wave for Y bob
      camera.position.y = eyeHeight + Math.sin(headBobTimer.current) * 0.04; 
    } else {
      // Smoothly return to standing still eye height
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, eyeHeight, 5 * delta);
    }
  });

  return (
    <>
      {viewMode === 'immersive' && <PointerLockControls ref={controlsRef} pointerSpeed={mouseSensitivity} />}
      {viewMode === 'explorer' && <OrbitControls ref={controlsRef} enablePan={true} enableZoom={true} enableRotate={true} makeDefault />}
    </>
  );
});
