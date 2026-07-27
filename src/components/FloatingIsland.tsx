import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Sphere } from '@react-three/drei';
import * as THREE from 'three';

/**
 * The Floating Island — the ancient rock foundation beneath the mansion.
 * Includes layered rock, hanging crystals, waterfalls, and a garden ring.
 */
export function FloatingIsland() {
  return (
    <group position={[0, -10.7, 0]}>
      {/* ==================== */}
      {/* MAIN ROCK BODY */}
      {/* ==================== */}
      {/* Top slab (flat surface the mansion sits on) */}
      <Cylinder args={[132, 120, 10, 64]} position={[0, -3.5, 0]} receiveShadow>
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </Cylinder>
      
      {/* Mid rock layer (slightly narrower) */}
      <Cylinder args={[120, 96, 15, 64]} position={[0, -16, 0]} receiveShadow>
        <meshStandardMaterial color="#334155" roughness={1} />
      </Cylinder>

      {/* Lower rock layer (tapering) */}
      <Cylinder args={[96, 60, 20, 64]} position={[0, -33.5, 0]} receiveShadow>
        <meshStandardMaterial color="#1e293b" roughness={1} />
      </Cylinder>

      {/* Bottom tip */}
      <Cylinder args={[60, 18, 30, 64]} position={[0, -58.5, 0]} receiveShadow>
        <meshStandardMaterial color="#0f172a" roughness={1} />
      </Cylinder>

      {/* ==================== */}
      {/* GLOWING VEINS IN THE ROCK */}
      {/* ==================== */}
      <RockVein position={[64, -8, 30]} rotation={[0.3, 0.5, 0.8]} length={25} color="#6366f1" />
      <RockVein position={[-50, -12, -56]} rotation={[0.1, -0.3, 0.4]} length={18} color="#8b5cf6" />
      <RockVein position={[30, -20, 64]} rotation={[-0.2, 0.8, 0.1]} length={30} color="#06b6d4" />
      <RockVein position={[-56, -25, 26]} rotation={[0.5, -0.1, 0.6]} length={22} color="#6366f1" />

      {/* ==================== */}
      {/* HANGING CRYSTALS */}
      {/* ==================== */}
      <Crystal position={[36, -48, 28]} size={2.5} color="#6366f1" />
      <Crystal position={[-32, -52, -30]} size={2.2} color="#8b5cf6" />
      <Crystal position={[26, -55, -56]} size={1.8} color="#06b6d4" />
      <Crystal position={[-40, -47, 34]} size={2.0} color="#a855f7" />
      <Crystal position={[0, -78, 0]} size={4.0} color="#6366f1" />
      <Crystal position={[44, -46, -26]} size={1.7} color="#22d3ee" />
      <Crystal position={[-28, -61, 40]} size={2.3} color="#8b5cf6" />

      {/* ==================== */}
      {/* WATERFALLS */}
      {/* ==================== */}
      <Waterfall position={[116, -2, 0]} />
      <Waterfall position={[-92, -2, 76]} />
      <Waterfall position={[30, -2, -116]} />

      {/* ==================== */}
      {/* GARDEN RING (around the edge of the top platform) */}
      {/* ==================== */}
      <GardenRing />
    </group>
  );
}

// ==========================================
// ROCK VEIN (glowing lines embedded in stone)
// ==========================================
function RockVein({ position, rotation, length, color }: { position: [number, number, number]; rotation: [number, number, number]; length: number; color: string }) {
  return (
    <group position={position} rotation={rotation}>
      <Cylinder args={[0.08, 0.05, length, 4]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} roughness={0.3} />
      </Cylinder>
      <pointLight position={[0, 0, 0]} distance={6} intensity={0.5} color={color} />
    </group>
  );
}

// ==========================================
// CRYSTAL (hanging crystalline formations)
// ==========================================
function Crystal({ position, size, color }: { position: [number, number, number]; size: number; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle pulsing glow
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2 + phase) * 0.3;
    }
  });

  return (
    <group position={position}>
      {/* Main crystal shard */}
      <mesh ref={meshRef} rotation={[0.2 + Math.random() * 0.3, 0, Math.random() * 0.5]}>
        <coneGeometry args={[size * 0.4, size * 2, 5]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={0.5} 
          transparent 
          opacity={0.85}
          roughness={0.1}
          metalness={0.3}
        />
      </mesh>
      {/* Secondary smaller shard */}
      <mesh position={[size * 0.3, size * 0.2, size * 0.1]} rotation={[0.5, 0.3, 0.2]}>
        <coneGeometry args={[size * 0.2, size * 1.2, 4]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={0.4} 
          transparent 
          opacity={0.7}
          roughness={0.15}
        />
      </mesh>
      {/* Point light for crystal glow */}
      <pointLight position={[0, 0, 0]} distance={size * 5} intensity={size * 0.3} color={color} />
    </group>
  );
}

// ==========================================
// WATERFALL (particle-like cascading effect)
// ==========================================
function Waterfall({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const drops = useMemo(() => {
    return Array.from({ length: 150 }, (_, i) => ({
      x: (Math.random() - 0.5) * 8,
      y: -i * 0.4,
      z: (Math.random() - 0.5) * 4,
      speed: 1.5 + Math.random() * 1.5,
      phase: Math.random() * 20,
      scale: 0.6 + Math.random() * 1.4,
    }));
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const drop = drops[i];
        if (drop && child) {
          // Animate drops falling down 70 units
          const elapsed = state.clock.elapsedTime * drop.speed + drop.phase;
          const yPos = ((elapsed * 5) % 70) - 0;
          child.position.y = -yPos;
          // Fade out as they fall further towards the bottom
          const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
          if (mat) {
            mat.opacity = Math.max(0, 1 - yPos / 60);
          }
        }
      });
    }
  });

  return (
    <group position={position} ref={groupRef}>
      {drops.map((drop, i) => (
        <Sphere key={i} args={[drop.scale, 6, 6]} position={[drop.x, drop.y, drop.z]}>
          <meshStandardMaterial 
            color="#38bdf8" 
            emissive="#0ea5e9" 
            emissiveIntensity={0.3} 
            transparent 
            opacity={0.6} 
          />
        </Sphere>
      ))}
      {/* Ambient waterfall glow */}
      <pointLight position={[0, -8, 0]} distance={12} intensity={0.8} color="#38bdf8" />
    </group>
  );
}

// ==========================================
// GARDEN RING
// ==========================================
function GardenRing() {
  // Simple garden elements around the edge of the platform
  const trees = useMemo(() => {
    const result = [];
    for (let i = 0; i < 27; i++) {
      const angle = Math.random() * Math.PI * 2; // Completely random angle for uneven clustering
      const radius = 115 + Math.random() * 18; // Spread trees between radius 115 and 133
      result.push({
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        scale: 4.0 + Math.random() * 6.0,
        color: ['#166534', '#15803d', '#22c55e'][Math.floor(Math.random() * 3)],
      });
    }
    return result;
  }, []);

  return (
    <group position={[0, 1.5, 0]}>
      {/* Grass ring on the platform edge */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <ringGeometry args={[100, 135, 128]} />
        <meshStandardMaterial color="#166534" roughness={0.9} />
      </mesh>

      {/* Main Front Pathway (Matches graybox reference) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 75]}>
        <planeGeometry args={[12, 120]} />
        <meshStandardMaterial color="#64748b" roughness={0.9} />
      </mesh>

      {/* Front Circular Fountain/Plaza area */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.2, 115]}>
        <circleGeometry args={[15, 32]} />
        <meshStandardMaterial color="#475569" roughness={0.9} />
      </mesh>

      {/* Trees (simple cones + cylinders) */}
      {trees.map((tree, i) => (
        <group key={i} position={[tree.x, 0, tree.z]}>
          {/* Trunk */}
          <Cylinder args={[0.15 * (tree.scale/3), 0.2 * (tree.scale/3), 1.5 * tree.scale, 6]} position={[0, (1.5 * tree.scale) / 2, 0]}>
            <meshStandardMaterial color="#78350f" roughness={0.9} />
          </Cylinder>
          {/* Canopy */}
          <mesh position={[0, (1.5 * tree.scale) + (2.5 * tree.scale) / 2, 0]}>
            <coneGeometry args={[1.2 * tree.scale, 2.5 * tree.scale, 6]} />
            <meshStandardMaterial color={tree.color} roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
