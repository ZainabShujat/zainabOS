import { Box, Cylinder } from '@react-three/drei';
import { InteractiveProp } from './InteractiveProp';
import { useSettingsStore } from '../../lib/engine/store';
import { playUIClick } from '../../lib/audio';

interface LightSwitchProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  roomName: string;
}

export function LightSwitch({ position, rotation = [0, 0, 0], roomName }: LightSwitchProps) {
  const roomLights = useSettingsStore(s => s.roomLights);
  const toggleRoomLight = useSettingsStore(s => s.toggleRoomLight);
  const isOn = roomLights[roomName];

  return (
    <InteractiveProp 
      id={`switch_${roomName}`} 
      label={isOn ? "[ Turn Lights Off ]" : "[ Turn Lights On ]"} 
      position={position} 
      rotation={rotation}
      onClick={() => {
        playUIClick();
        toggleRoomLight(roomName);
      }}
    >
      <group>
        {/* Wall plate */}
        <Box args={[0.3, 0.4, 0.05]} castShadow>
          <meshStandardMaterial color="#e2e8f0" roughness={0.7} />
        </Box>
        {/* Switch toggler */}
        <Box 
          args={[0.08, 0.15, 0.08]} 
          position={[0, isOn ? 0.05 : -0.05, 0.05]} 
          rotation={[isOn ? -0.2 : 0.2, 0, 0]}
          castShadow
        >
          <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
        </Box>
      </group>
    </InteractiveProp>
  );
}
