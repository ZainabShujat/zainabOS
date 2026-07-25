import { Box, RoundedBox, Cylinder, Text, ContactShadows } from '@react-three/drei';
import { AnimatedDoor } from '../shared/AnimatedDoor';
import * as THREE from 'three';
import { useVisitorStore } from '../../lib/engine/store';

function TherapyFurniture() {
  const setSitTarget = useVisitorStore(s => s.setSitTarget);
  return (
    <group position={[0, -4, 0]}>
      {/* Soft circular rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
        <circleGeometry args={[8, 64]} />
        <meshStandardMaterial color="#fef3c7" roughness={1} />
      </mesh>

      {/* Patient Couch (Left) */}
      <group 
        position={[-3, 0.5, 0]} 
        rotation={[0, Math.PI / 2, 0]} 
        scale={1.2}
        onClick={(e) => { e.stopPropagation(); setSitTarget([-3, 0.5, 0]); }}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; }}
      >
        <Text position={[0, 4, 1]} rotation={[0, Math.PI, 0]} fontSize={0.3} color="#fbbf24" outlineWidth={0.01} outlineColor="#000">
          [ Sit ]
        </Text>
        <RoundedBox args={[6, 0.8, 3]} radius={0.2} smoothness={4} position={[0, 0.4, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#0f766e" roughness={0.9} /> {/* Deep teal */}
        </RoundedBox>
        <RoundedBox args={[6, 3, 1]} radius={0.2} smoothness={4} position={[0, 2, -1]} castShadow receiveShadow>
          <meshStandardMaterial color="#0f766e" roughness={0.9} />
        </RoundedBox>
        <RoundedBox args={[1, 1.5, 3]} radius={0.2} smoothness={4} position={[-3, 1, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#115e59" roughness={0.9} />
        </RoundedBox>
        {/* Pillow */}
        <RoundedBox args={[1.5, 0.4, 1.5]} radius={0.2} smoothness={4} position={[2, 0.8, 0]} rotation={[0, 0, 0.2]} castShadow>
          <meshStandardMaterial color="#fcd34d" roughness={0.9} />
        </RoundedBox>
      </group>

      {/* Therapist Chair (Right) */}
      <group 
        position={[4, 0.5, 0]} 
        rotation={[0, -Math.PI / 2, 0]} 
        scale={1.2}
        onClick={(e) => { e.stopPropagation(); setSitTarget([4, 0.5, 0]); }}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; }}
      >
        <Text position={[0, 4, 1]} rotation={[0, Math.PI, 0]} fontSize={0.3} color="#fbbf24" outlineWidth={0.01} outlineColor="#000">
          [ Sit ]
        </Text>
        <RoundedBox args={[3, 0.8, 3]} radius={0.2} smoothness={4} position={[0, 0.4, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#b45309" roughness={0.9} /> {/* Warm leather brown */}
        </RoundedBox>
        <RoundedBox args={[3, 4, 1]} radius={0.2} smoothness={4} position={[0, 2.5, -1]} castShadow receiveShadow>
          <meshStandardMaterial color="#b45309" roughness={0.9} />
        </RoundedBox>
        <RoundedBox args={[1, 1.5, 3]} radius={0.2} smoothness={4} position={[-1.5, 1, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#92400e" roughness={0.9} />
        </RoundedBox>
        <RoundedBox args={[1, 1.5, 3]} radius={0.2} smoothness={4} position={[1.5, 1, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#92400e" roughness={0.9} />
        </RoundedBox>
      </group>

      {/* Low Coffee Table */}
      <group position={[0.5, 0, 0]}>
        <Cylinder args={[1.5, 1.5, 0.2]} position={[0, 1.2, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#f8fafc" roughness={0.1} /> {/* Glass-ish */}
        </Cylinder>
        <Cylinder args={[0.1, 0.8, 1.2]} position={[0, 0.6, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#111" />
        </Cylinder>
        {/* Tissue Box */}
        <Box args={[0.6, 0.3, 0.6]} position={[0, 1.45, 0]} rotation={[0, 0.4, 0]} castShadow>
          <meshStandardMaterial color="#e2e8f0" />
        </Box>
        {/* Tissues pulled out */}
        <mesh position={[0, 1.6, 0]} rotation={[0, 0.4, 0.2]}>
          <planeGeometry args={[0.4, 0.4]} />
          <meshStandardMaterial color="#fff" side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

function GroundingStation() {
  return (
    <group position={[-8, -4, -8]}>
      {/* Wooden Work Table */}
      <Box args={[6, 0.2, 4]} position={[0, 3, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </Box>
      <Cylinder args={[0.1, 0.1, 3]} position={[-2.8, 1.5, -1.8]} castShadow><meshStandardMaterial color="#451a03" /></Cylinder>
      <Cylinder args={[0.1, 0.1, 3]} position={[2.8, 1.5, -1.8]} castShadow><meshStandardMaterial color="#451a03" /></Cylinder>
      <Cylinder args={[0.1, 0.1, 3]} position={[-2.8, 1.5, 1.8]} castShadow><meshStandardMaterial color="#451a03" /></Cylinder>
      <Cylinder args={[0.1, 0.1, 3]} position={[2.8, 1.5, 1.8]} castShadow><meshStandardMaterial color="#451a03" /></Cylinder>

      {/* Pottery Wheel */}
      <Cylinder args={[0.8, 0.8, 0.2]} position={[0, 3.2, 0]} castShadow>
        <meshStandardMaterial color="#1f2937" metalness={0.5} />
      </Cylinder>
      
      {/* Half-finished clay pot */}
      <Cylinder args={[0.3, 0.2, 0.8]} position={[0, 3.7, 0]} castShadow>
        <meshStandardMaterial color="#b45309" roughness={1} />
      </Cylinder>

      {/* Scattered clay lumps */}
      <RoundedBox args={[0.3, 0.2, 0.3]} radius={0.1} position={[-1.5, 3.2, 0.5]} castShadow><meshStandardMaterial color="#b45309" roughness={1} /></RoundedBox>
      <RoundedBox args={[0.2, 0.15, 0.2]} radius={0.05} position={[-1.2, 3.15, 1]} castShadow><meshStandardMaterial color="#b45309" roughness={1} /></RoundedBox>

      {/* Stool */}
      <Cylinder args={[0.6, 0.6, 0.2]} position={[0, 1.5, 2.5]} castShadow><meshStandardMaterial color="#fcd34d" /></Cylinder>
      <Cylinder args={[0.1, 0.1, 1.5]} position={[0, 0.75, 2.5]} castShadow><meshStandardMaterial color="#451a03" /></Cylinder>
      <Cylinder args={[0.4, 0.6, 0.2]} position={[0, 0.1, 2.5]} castShadow><meshStandardMaterial color="#451a03" /></Cylinder>

      <Text position={[0, 5, -1.9]} fontSize={0.6} color="#fbbf24" anchorX="center">
        The Grounding Station
      </Text>
    </group>
  );
}

export function TherapyRoom() {
  return (
    <group>
      {/* The Room Architecture */}
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#1c1917" roughness={0.8} /> {/* Dark, warm wood floor */}
      </mesh>
      
      {/* Walls */}
      {/* Back Wall */}
      <Box args={[40, 20, 1]} position={[0, 6, -20]} receiveShadow>
        <meshStandardMaterial color="#292524" /> {/* Warm dark grey */}
      </Box>
      {/* Right Wall */}
      <Box args={[1, 20, 40]} position={[20, 6, 0]} receiveShadow>
        <meshStandardMaterial color="#292524" />
      </Box>
      {/* Left Wall */}
      <Box args={[1, 20, 40]} position={[-20, 6, 0]} receiveShadow>
        <meshStandardMaterial color="#292524" />
      </Box>
      {/* Front Wall */}
      <Box args={[40, 20, 1]} position={[0, 6, 20]} receiveShadow>
        <meshStandardMaterial color="#292524" />
      </Box>
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 16, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#1c1917" />
      </mesh>

      {/* Warm Ambient & Spot Lighting specific to this room */}
      <ambientLight intensity={0.2} color="#fcd34d" />
      <spotLight position={[0, 12, 0]} color="#fcd34d" intensity={2} angle={Math.PI / 3} penumbra={1} castShadow />
      
      <TherapyFurniture />
      <GroundingStation />

      {/* Door back to the Hallway */}
      <AnimatedDoor 
        position={[0, -4, 19.8]} 
        rotation={[0, Math.PI, 0]} 
        targetRoom="Hallway" 
        label="[ Back to Hallway ]" 
      />
      
      <ContactShadows resolution={1024} scale={30} blur={2.5} opacity={0.6} far={10} color="#000" position={[0, -3.9, 0]} />
    </group>
  );
}
