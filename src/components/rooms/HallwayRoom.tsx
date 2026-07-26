
import { Box, Text } from '@react-three/drei';
import { AnimatedDoor } from '../shared/AnimatedDoor';

export function HallwayRoom() {


  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]} receiveShadow>
        <planeGeometry args={[20, 100]} />
        <meshStandardMaterial color="#475569" roughness={0.7} />
      </mesh>
      
      {/* Walls */}
      {/* Left Wall */}
      <Box args={[1, 14, 100]} position={[-10.5, 3, 0]} receiveShadow><meshStandardMaterial color="#8B4513" roughness={0.9} /></Box>
      {/* Right Wall */}
      <Box args={[1, 14, 100]} position={[10.5, 3, 0]} receiveShadow><meshStandardMaterial color="#8B4513" roughness={0.9} /></Box>
      {/* End Wall */}
      <Box args={[20, 14, 1]} position={[0, 3, 50]} receiveShadow><meshStandardMaterial color="#5C2C16" roughness={1} /></Box>
      
      {/* ======================= */}
      {/* THE DOORS */}
      {/* ======================= */}

      {/* Door back to Study (Foyer) */}
      <AnimatedDoor 
        position={[0, -4, -49.8]} 
        rotation={[0, 0, 0]} 
        targetRoom="Study" 
        label="[ The Foyer ]" 
        glowColor="#4ade80" // Sage green glow for foyer
      />

      {/* LEFT WALL DOORS */}
      <AnimatedDoor 
        position={[-9.8, -4, -20]} 
        rotation={[0, Math.PI / 2, 0]} 
        targetRoom="TherapyRoom" 
        label="[ The Mental Sanctum ]" 
        glowColor="#c084fc" // Lilac glow for therapy
      />
      
      <AnimatedDoor 
        position={[-9.8, -4, 10]} 
        rotation={[0, Math.PI / 2, 0]} 
        targetRoom="ChroniclesLibrary" 
        label="[ Chronicles Library ]" 
        glowColor="#10b981" // Emerald green glow
      />

      {/* RIGHT WALL DOORS */}
      <AnimatedDoor 
        position={[9.8, -4, -20]} 
        rotation={[0, -Math.PI / 2, 0]} 
        targetRoom="FreelanceStudio" 
        label="[ Freelance Studio ]" 
        glowColor="#06b6d4" // Cyan/Teal glow
      />

      <AnimatedDoor 
        position={[9.8, -4, 10]} 
        rotation={[0, -Math.PI / 2, 0]} 
        targetRoom="AILab" 
        label="[ AI Laboratory ]" 
        glowColor="#e879f9" // Neon pink/purple glow
      />

      {/* END OF HALLWAY DOORS */}
      <AnimatedDoor 
        position={[-2, -4, 49.8]} 
        rotation={[0, Math.PI, 0]} 
        targetRoom="AstronomyCorner" 
        label="[ Astronomy Corner ]" 
        glowColor="#3b82f6" // Deep space blue glow
      />

      <AnimatedDoor 
        position={[2, -4, 49.8]} 
        rotation={[0, Math.PI, 0]} 
        targetRoom="MathCorner" 
        label="[ Math Corner ]" 
        glowColor="#facc15" // Yellow math chalk glow
      />

      <Text position={[0, 2, -40]} rotation={[0, Math.PI, 0]} fontSize={0.8} color="#94a3b8">
        The Hallway
      </Text>
    </group>
  );
}
