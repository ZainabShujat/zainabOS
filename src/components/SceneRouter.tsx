import React from 'react';
import { useVisitorStore } from '../lib/engine/store';
import { StudyRoom } from './rooms/StudyRoom';
import { HallwayRoom } from './rooms/HallwayRoom';

export function SceneRouter() {
  const currentRoom = useVisitorStore(s => s.currentRoom);
  
  return (
    <>
      {currentRoom === 'Study' && <StudyRoom />}
      {currentRoom === 'Hallway' && <HallwayRoom />}
      {/* Other rooms will be added here later */}
    </>
  );
}
