
import { Box, Text } from '@react-three/drei';
import { useVisitorStore } from '../../lib/engine/store';
import { AnimatedDoor } from '../shared/AnimatedDoor';

export function HallwayRoom() {


  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]} receiveShadow>
        <planeGeometry args={[10, 100]} />
        <meshStandardMaterial color="#475569" roughness={0.7} />
      </mesh>
      
      {/* Walls */}
      {/* Left Wall */}
      <Box args={[1, 14, 100]} position={[-5.5, 3, 0]} receiveShadow><meshStandardMaterial color="#1e293b" /></Box>
      {/* Right Wall */}
      <Box args={[1, 14, 100]} position={[5.5, 3, 0]} receiveShadow><meshStandardMaterial color="#1e293b" /></Box>
      {/* End Wall */}
      <Box args={[10, 14, 1]} position={[0, 3, 50]} receiveShadow><meshStandardMaterial color="#0f172a" /></Box>
      
      {/* ======================= */}
      {/* THE DOORS */}
      {/* ======================= */}

      {/* Door back to Study (Foyer) */}
      <AnimatedDoor 
        position={[0, -4, -49.8]} 
        rotation={[0, 0, 0]} 
        targetRoom="Study" 
        label="[ The Foyer ]" 
      />

      {/* LEFT WALL DOORS */}
      <AnimatedDoor 
        position={[-4.8, -4, -20]} 
        rotation={[0, Math.PI / 2, 0]} 
        targetRoom="TherapyRoom" 
        label="[ The Mental Sanctum ]" 
      />
      
      <AnimatedDoor 
        position={[-4.8, -4, 10]} 
        rotation={[0, Math.PI / 2, 0]} 
        targetRoom="ChroniclesLibrary" 
        label="[ Chronicles Library ]" 
      />

      {/* RIGHT WALL DOORS */}
      <AnimatedDoor 
        position={[4.8, -4, -20]} 
        rotation={[0, -Math.PI / 2, 0]} 
        targetRoom="FreelanceStudio" 
        label="[ Freelance Studio ]" 
      />

      <AnimatedDoor 
        position={[4.8, -4, 10]} 
        rotation={[0, -Math.PI / 2, 0]} 
        targetRoom="AILab" 
        label="[ AI Laboratory ]" 
      />

      {/* END OF HALLWAY DOORS */}
      <AnimatedDoor 
        position={[-2, -4, 49.8]} 
        rotation={[0, Math.PI, 0]} 
        targetRoom="AstronomyCorner" 
        label="[ Astronomy Corner ]" 
      />

      <AnimatedDoor 
        position={[2, -4, 49.8]} 
        rotation={[0, Math.PI, 0]} 
        targetRoom="MathCorner" 
        label="[ Math Corner ]" 
      />

      <Text position={[0, 2, -40]} rotation={[0, Math.PI, 0]} fontSize={0.8} color="#94a3b8">
        The Hallway
      </Text>
    </group>
  );
}
