import { useVisitorStore } from '../lib/engine/store';
import { Text } from '@react-three/drei';
import { AnimatedDoor } from './shared/AnimatedDoor';
import { StudyRoom } from './rooms/StudyRoom';
import { HallwayRoom } from './rooms/HallwayRoom';
import { TherapyRoom } from './rooms/TherapyRoom';

export function SceneRouter() {
  const currentRoom = useVisitorStore(s => s.currentRoom);
  
  return (
    <>
      {currentRoom === 'Study' && <StudyRoom />}
      {currentRoom === 'Hallway' && <HallwayRoom />}
      
      {/* Placeholder Rooms for new Universes */}
      {currentRoom === 'TherapyRoom' && <TherapyRoom />}
      {currentRoom === 'ChroniclesLibrary' && <PlaceholderRoom title="Chronicles Library" />}
      {currentRoom === 'FreelanceStudio' && <PlaceholderRoom title="Freelance Studio" />}
      {currentRoom === 'AILab' && <PlaceholderRoom title="AI Laboratory" />}
      {currentRoom === 'AstronomyCorner' && <PlaceholderRoom title="Astronomy Corner" />}
      {currentRoom === 'MathCorner' && <PlaceholderRoom title="Math Corner" />}
    </>
  );
}

// Temporary scaffolding for rooms under construction
function PlaceholderRoom({ title }: { title: string }) {
  return (
    <group>
      {/* Basic Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#334155" roughness={0.7} />
      </mesh>
      
      {/* Floating Hologram text */}
      <Text position={[0, 2, -2]} fontSize={1} color="#fbbf24" anchorX="center" anchorY="middle">
        {title}
      </Text>
      <Text position={[0, 0.5, -2]} fontSize={0.4} color="#94a3b8" anchorX="center" anchorY="middle">
        (Under Construction)
      </Text>

      {/* Door back to Hallway */}
      <AnimatedDoor 
        position={[0, -4, 9.8]} 
        rotation={[0, Math.PI, 0]} 
        targetRoom="Hallway" 
        label="[ Back to Hallway ]" 
      />
    </group>
  );
}
