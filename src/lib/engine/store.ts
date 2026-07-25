import { create } from 'zustand';


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
  | 'Study' | 'Hallway' | 'TherapyRoom' | 'ChroniclesLibrary' 
  | 'FreelanceStudio' | 'GamingCorner' | 'MathCorner' | 'Garage' 
  | 'CareerCampus' | 'AILab' | 'AstronomyCorner' | 'ThoughtOrchard' 
  | 'Porch' | 'Garden' | 'ForestPath';

interface VisitorState {
  currentRoom: Room;
  isTransitioning: boolean;
  showMap: boolean;
  focusedObjectId: string | null; // e.g., 'laptop', 'notebook', or an Entity ID
  curiosityTrail: string[]; // History of interacted entities
  
  setRoom: (room: Room) => void;
  setIsTransitioning: (val: boolean) => void;
  setShowMap: (val: boolean) => void;
  focusObject: (id: string | null) => void;
  addToTrail: (entityId: string) => void;
}

export const useVisitorStore = create<VisitorState>((set) => ({
  currentRoom: 'Study',
  isTransitioning: false,
  showMap: false,
  focusedObjectId: null,
  curiosityTrail: [],
  
  setRoom: (room) => set({ currentRoom: room }),
  setIsTransitioning: (val) => set({ isTransitioning: val }),
  setShowMap: (val) => set({ showMap: val }),
  focusObject: (id) => set({ focusedObjectId: id }),
  addToTrail: (entityId) => set((state) => {
    // Only add if it's not the most recent one to prevent duplicates
    if (state.curiosityTrail[state.curiosityTrail.length - 1] !== entityId) {
      return { curiosityTrail: [...state.curiosityTrail, entityId] };
    }
    return state;
  }),
}));

// ==========================================
// THE SETTINGS ENGINE
// ==========================================
interface SettingsStore {
  mouseSensitivity: number;
  setMouseSensitivity: (val: number) => void;
  moveSpeed: number;
  setMoveSpeed: (val: number) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  mouseSensitivity: 0.5, // lower default since default might be too fast
  setMouseSensitivity: (val) => set({ mouseSensitivity: val }),
  moveSpeed: 10,
  setMoveSpeed: (val) => set({ moveSpeed: val }),
}));
