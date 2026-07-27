import { create } from 'zustand';
import { persist } from 'zustand/middleware';


// ==========================================
// THE TIME ENGINE (Zaman)
// ==========================================
export type TimeOfDay = 'Morning' | 'Afternoon' | 'Golden Hour' | 'Night';

function getLocalTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'Morning';
  if (hour >= 12 && hour < 17) return 'Afternoon';
  if (hour >= 17 && hour < 19) return 'Golden Hour';
  return 'Night';
}

interface TimeState {
  timeOfDay: TimeOfDay;
  isRealTime: boolean; // If true, matches the user's local clock
  setTimeOfDay: (time: TimeOfDay) => void;
  toggleRealTime: () => void;
}

export const useTimeStore = create<TimeState>((set) => ({
  timeOfDay: getLocalTimeOfDay(), // Sync with local clock on boot
  isRealTime: true,
  setTimeOfDay: (time) => set({ timeOfDay: time, isRealTime: false }),
  toggleRealTime: () => set((state) => ({ isRealTime: !state.isRealTime })),
}));

// ==========================================
// THE WEATHER ENGINE (Mausam)
// ==========================================
export type WeatherType = 'Clear' | 'Rain' | 'Fog';

interface WeatherState {
  weather: WeatherType;
  setWeather: (weather: WeatherType) => void;
}

export const useWeatherStore = create<WeatherState>((set) => ({
  weather: 'Clear',
  setWeather: (weather) => set({ weather }),
}));

// ==========================================
// THE VISITOR ENGINE
// ==========================================
export type Room = 
  | 'Atrium' | 'Study' | 'WriterRoom' | 'AILab' | 'TherapyRoom'
  | 'Observatory' | 'Library' | 'MathRoom' | 'Balcony'
  | 'ServerRoom' | 'MemoryVault' | 'Archive' | 'ExperimentalLab'
  // Legacy rooms kept for backward compatibility during migration
  | 'Hallway' | 'ChroniclesLibrary' | 'FreelanceStudio' 
  | 'GamingCorner' | 'MathCorner' | 'Garage' 
  | 'CareerCampus' | 'AstronomyCorner' | 'ThoughtOrchard' 
  | 'Porch' | 'Garden' | 'ForestPath';

// Arrival Sequence phases (Volume XVII)
export type ArrivalPhase = 
  | 'landing'        // ACT I: Title screen (SplashScreen)
  | 'introText'      // ACT II: Welcome text overlays on black
  | 'modeSelect'     // Mode selection (Immersive vs Explorer)
  | 'flyIn'
  | 'circling'
  | 'training'       // ACT III: Orientation Room (Immersive)
  | 'recommendation' // ACT IV: "What brings you here?"
  | 'unlocking'      // ACT V: Doors unlock, lights ripple
  | 'complete';      // Arrival is done, full control

interface VisitorState {
  currentRoom: Room;
  previousRoom: Room | null;
  isTransitioning: boolean;
  showMap: boolean;
  focusedObjectId: string | null; // e.g., 'laptop', 'notebook', or an Entity ID
  curiosityTrail: string[]; // History of interacted entities
  sitTarget: [number, number, number] | null;
  sitLookAt: [number, number, number] | null;
  sessionBooked: boolean;
  arrivalPhase: ArrivalPhase;
  
  setRoom: (room: Room) => void;
  setIsTransitioning: (val: boolean) => void;
  setShowMap: (val: boolean) => void;
  focusObject: (id: string | null) => void;
  addToTrail: (entityId: string) => void;
  setSitTarget: (target: [number, number, number] | null, lookAt?: [number, number, number]) => void;
  setSessionBooked: (val: boolean) => void;
  setArrivalPhase: (phase: ArrivalPhase) => void;
}

export const useVisitorStore = create<VisitorState>()(
  persist(
    (set) => ({
      currentRoom: 'Atrium',
      previousRoom: null,
      isTransitioning: false,
      showMap: false,
      focusedObjectId: null,
      curiosityTrail: [],
      sitTarget: null,
      sitLookAt: null,
      sessionBooked: false,
      arrivalPhase: 'landing', // Start with text intro
      
      setRoom: (room) => set((state) => ({ previousRoom: state.currentRoom, currentRoom: room })),
      setIsTransitioning: (val) => set({ isTransitioning: val }),
      setShowMap: (val) => set({ showMap: val }),
      focusObject: (id) => set({ focusedObjectId: id }),
      setSitTarget: (target, lookAt) => set({ sitTarget: target, sitLookAt: lookAt || null }),
      setSessionBooked: (val) => set({ sessionBooked: val }),
      setArrivalPhase: (phase) => set({ arrivalPhase: phase }),
      addToTrail: (entityId) => set((state) => {
        // Only add if it's not the most recent one to prevent duplicates
        if (state.curiosityTrail[state.curiosityTrail.length - 1] !== entityId) {
          return { curiosityTrail: [...state.curiosityTrail, entityId] };
        }
        return state;
      }),
    }),
    {
      name: 'visitor-storage',
      partialize: (state) => ({
        currentRoom: state.currentRoom,
        arrivalPhase: state.arrivalPhase,
        curiosityTrail: state.curiosityTrail,
        sessionBooked: state.sessionBooked,
      }), // Only persist specific fields
    }
  )
);

// ==========================================
// THE SETTINGS ENGINE
// ==========================================
interface SettingsStore {
  mouseSensitivity: number;
  setMouseSensitivity: (val: number) => void;
  moveSpeed: number;
  setMoveSpeed: (val: number) => void;
  soundVolume: number;
  setSoundVolume: (val: number) => void;
  graphicsQuality: 'Low' | 'Medium' | 'High' | 'Ultra';
  setGraphicsQuality: (val: 'Low' | 'Medium' | 'High' | 'Ultra') => void;
  fov: number;
  setFov: (val: number) => void;
  viewMode: 'immersive' | 'explorer';
  setViewMode: (val: 'immersive' | 'explorer') => void;
  roomLights: Record<string, boolean>;
  toggleRoomLight: (room: string) => void;
  explorerFloorLevel: number;
  setExplorerFloorLevel: (level: number) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      mouseSensitivity: 0.5, // lower default since default might be too fast
      setMouseSensitivity: (val) => set({ mouseSensitivity: val }),
      moveSpeed: 10,
      setMoveSpeed: (val) => set({ moveSpeed: val }),
      soundVolume: 0.5,
      setSoundVolume: (val) => set({ soundVolume: val }),
      graphicsQuality: 'High',
      setGraphicsQuality: (val) => set({ graphicsQuality: val }),
      fov: 45,
      setFov: (val) => set({ fov: val }),
      viewMode: 'immersive',
      setViewMode: (val) => set({ viewMode: val }),
      roomLights: { Atrium: true, Study: true, TherapyRoom: true, WriterRoom: true, AILab: true },
      toggleRoomLight: (room) => set((state) => ({ 
        roomLights: { ...state.roomLights, [room]: !state.roomLights[room] } 
      })),
      explorerFloorLevel: 3,
      setExplorerFloorLevel: (level) => set({ explorerFloorLevel: level }),
    }),
    {
      name: 'settings-storage',
    }
  )
);
