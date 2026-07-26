import { useState } from 'react';
import { Billboard, Text } from '@react-three/drei';
import { useVisitorStore } from '../../lib/engine/store';
import { playUIClick } from '../../lib/audio';

interface InteractivePropProps {
  id: string;
  label: string;
  children: React.ReactNode;
  position?: [number, number, number];
  rotation?: [number, number, number];
  labelOffset?: [number, number, number];
  onClick?: () => void;
}

export function InteractiveProp({ 
  id, 
  label, 
  children, 
  position, 
  rotation, 
  labelOffset = [0, 0.5, 0], 
  onClick 
}: InteractivePropProps) {
  const [hovered, setHovered] = useState(false);
  const addToTrail = useVisitorStore(s => s.addToTrail);

  const handleClick = (e: any) => {
    e.stopPropagation();
    playUIClick();
    addToTrail(id);
    if (onClick) onClick();
  };

  return (
    <group 
      position={position}
      rotation={rotation}
      onClick={handleClick}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      {hovered && (
        <Billboard position={labelOffset} follow={true} lockX={false} lockY={false} lockZ={false}>
          <Text 
            fontSize={0.2} 
            color="#38bdf8" 
            outlineWidth={0.01} 
            outlineColor="#000"
          >
            {label}
          </Text>
        </Billboard>
      )}
      {children}
    </group>
  );
}
