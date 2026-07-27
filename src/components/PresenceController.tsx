import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useSettingsStore, useVisitorStore } from '../lib/engine/store';
import { playFootstep } from '../lib/audio';

const S = 9; // Scale factor

// These coordinates match the MansionArchitecture RoomBlocks * scale factor
export const ROOM_SPAWNS: Record<string, [number, number, number]> = {
  'Atrium': [0 * S, -0.8 * S, (8 - 15) * S],
  'Study': [-11 * S, 2.4 * S, (4 - 15) * S],
  'TherapyRoom': [-9 * S, -4 * S, (9 - 15) * S],
  'SystemRoom': [-10 * S, -4 * S, (-5 - 15) * S],
  'IdeaGarden': [9 * S, -4 * S, (-6.5 - 15) * S],
  'ArchiveLibrary': [10 * S, -4 * S, (9.5 - 15) * S],
  'CodeLab': [-9 * S, -0.8 * S, (-1 - 15) * S],
  'AILab': [9 * S, -0.8 * S, (-1 - 15) * S],
  'ProjectGallery': [-11.5 * S, -0.8 * S, (13.5 - 15) * S],
  'RecreationRoom': [10 * S, -0.8 * S, (12.5 - 15) * S],
  'Observatory': [0 * S, 2.4 * S, (-1.5 - 15) * S],
  'WriterRoom': [-10.5 * S, 2.4 * S, (14 - 15) * S]
};

export const PresenceController = forwardRef((_, ref) => {
  const { camera, scene } = useThree();
  const pointerLockRef = useRef<any>(null);
  const orbitRef = useRef<any>(null);
  const isTransitioningCamera = useRef(false);
  const transitionTarget = useRef(new THREE.Vector3(0, 80, 200));
  
  const sitTarget = useVisitorStore(s => s.sitTarget);
  const currentRoom = useVisitorStore(s => s.currentRoom);
  
  useImperativeHandle(ref, () => ({
    setLookAt: (px: number, py: number, pz: number, tx: number, ty: number, tz: number) => {
      camera.position.set(px, py, pz);
      camera.lookAt(tx, ty, tz);
    }
  }));
  
  const moveSpeed = useSettingsStore(s => s.moveSpeed) * 3.0; // Increased speed for 9x larger house
  const soundVolume = useSettingsStore(s => s.soundVolume);
  const mouseSensitivity = useSettingsStore(s => s.mouseSensitivity);
  const viewMode = useSettingsStore(s => s.viewMode);
  const keys = useRef({ w: false, a: false, s: false, d: false, shift: false });
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  
  // Head bob state
  const headBobTimer = useRef(0);
  
  // The door is 8.8 units tall. 4/5ths of the door height is roughly 7 units.
  const standingHeight = 7.0;

  // When room changes, teleport the camera to that room's coordinates
  useEffect(() => {
    if (ROOM_SPAWNS[currentRoom]) {
      const [spawnX, spawnY, spawnZ] = ROOM_SPAWNS[currentRoom];
      camera.position.set(spawnX, spawnY + standingHeight, spawnZ + 2); // Start slightly inside the room
      camera.lookAt(spawnX, spawnY + standingHeight, spawnZ - 5);
      
      // Also update transition target for Explorer Mode
      transitionTarget.current.set(spawnX, spawnY + 25, spawnZ + 15);
    }
  }, [currentRoom, camera]);

  useEffect(() => {
    camera.far = 10000;
    camera.updateProjectionMatrix();
    if (viewMode === 'explorer') {
      camera.position.set(camera.position.x, transitionTarget.current.y, transitionTarget.current.z);
      camera.lookAt(camera.position.x, 0, camera.position.z - 15);
    }
  }, [camera, viewMode]);

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
    if (sitTarget && sitLookAt) {
      const dummy = new THREE.Camera();
      dummy.position.set(sitTarget[0], sitTarget[1], sitTarget[2]);
      dummy.lookAt(sitLookAt[0], sitLookAt[1], sitLookAt[2]);
      
      // Directly copy quaternion to avoid Euler gimbal issues
      camera.quaternion.copy(dummy.quaternion);
    }
  }, [sitTarget, sitLookAt, camera]);

  useFrame((state, delta) => {
    // Force raycaster to always shoot from the center of the screen
    if (pointerLockRef.current && pointerLockRef.current.isLocked) {
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
    if (viewMode === 'explorer') {
       if (isTransitioningCamera.current) {
         camera.position.lerp(transitionTarget.current, 3 * delta);
         const dist = camera.position.distanceTo(transitionTarget.current);
         if (dist < 1.0) {
            isTransitioningCamera.current = false;
         }
       }
       return; // Bypass first-person walking physics in Explorer Mode
    }
    
    if (!pointerLockRef.current || !pointerLockRef.current.isLocked) return;
    
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
    currentPos.y -= 1.0; 
    
    let canMoveX = true;
    let canMoveZ = true;

    // Check X direction
    if (Math.abs(dx) > 0.001) {
      const dirX = new THREE.Vector3(Math.sign(dx), 0, 0);
      // Transform local movement into world direction for raycaster
      dirX.applyQuaternion(camera.quaternion);
      dirX.y = 0; // Keep ray horizontal
      dirX.normalize();
      
      // raycaster.set(currentPos, dirX);
      // const hitsX = raycaster.intersectObjects(scene.children, true);
      // if (hitsX.length > 0 && hitsX[0].distance < 0.5) {
      //   canMoveX = false;
      //   velocity.current.x = 0; // Stop momentum
      // }
    }

    // Check Z direction (Forward/Backward)
    if (Math.abs(dz) > 0.001) {
      const dirZ = new THREE.Vector3(0, 0, Math.sign(dz));
      // Transform local movement into world direction for raycaster
      dirZ.applyQuaternion(camera.quaternion);
      dirZ.y = 0; // Keep ray horizontal
      dirZ.normalize();
      
      // raycaster.set(currentPos, dirZ);
      // const hitsZ = raycaster.intersectObjects(scene.children, true);
      // if (hitsZ.length > 0 && hitsZ[0].distance < 0.5) {
      //   canMoveZ = false;
      //   velocity.current.z = 0; // Stop momentum
      // }
    }

    if (canMoveX) pointerLockRef.current.moveRight(dx);
    if (canMoveZ) pointerLockRef.current.moveForward(dz);
    
    // Head Bob calculation
    const speedSq = velocity.current.x * velocity.current.x + velocity.current.z * velocity.current.z;
    if (speedSq > 0.0001) {
      const prevTimer = headBobTimer.current;
      // 2 steps/sec walking (6.28 freq), 3 steps/sec running (9.42 freq)
      const bobFreq = keys.current.shift ? 9.42 : 6.28;
      headBobTimer.current += delta * bobFreq; 
      
      // Play footstep every time we cross PI
      if (Math.floor(prevTimer / Math.PI) < Math.floor(headBobTimer.current / Math.PI)) {
         playFootstep(soundVolume);
      }

      // Subtle sine wave for Y bob
      const baseFloorY = ROOM_SPAWNS[currentRoom] ? ROOM_SPAWNS[currentRoom][1] : -4;
      camera.position.y = baseFloorY + standingHeight + Math.sin(headBobTimer.current) * 0.04; 
    } else {
      // Smoothly return to standing still eye height
      const baseFloorY = ROOM_SPAWNS[currentRoom] ? ROOM_SPAWNS[currentRoom][1] : -4;
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, baseFloorY + standingHeight, 5 * delta);
    }
  });

  const arrivalPhase = useVisitorStore(s => s.arrivalPhase);
  
  // Set initial camera position for explorer mode once when it activates
  useEffect(() => {
    if (viewMode === 'explorer') {
      isTransitioningCamera.current = true;
      // We don't instantly snap anymore, the lerp handles it
      // but we do need OrbitControls to look at center
      if (orbitRef.current) {
        orbitRef.current.target.set(0,0,0);
      }
    }
  }, [viewMode, camera]);

  return (
    <>
      {(arrivalPhase === 'training' || arrivalPhase === 'complete') && viewMode === 'immersive' && (
        <PointerLockControls 
          key={sitTarget ? sitTarget.join(',') : 'standing'} 
          ref={pointerLockRef} 
          pointerSpeed={mouseSensitivity} 
        />
      )}
      {(arrivalPhase === 'training' || arrivalPhase === 'complete') && viewMode === 'explorer' && (
        <OrbitControls 
          ref={orbitRef} 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true} 
          makeDefault 
        />
      )}
    </>
  );
});
