import { create } from 'zustand';


// ==========================================
// THE TIME ENGINE (Zaman)
// ==========================================
export type TimeOfDay = 'Morning' | 'Afternoon' | 'Golden Hour' | 'Night';

interface TimeState {
  timeOfDay: TimeOfDay;
  isRealTime: boolean; // If true, matches the user's local clock
  setTimeOfDay: (time: TimeOfDay) => void;
  toggleRealTime: () => void;
}

export const useTimeStore = create<TimeState>((set) => ({
  timeOfDay: 'Afternoon', // Default
  isRealTime: false,
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
export type Room = 'Study' | 'Gallery' | 'Archive';

interface VisitorState {
  currentRoom: Room;
  focusedObjectId: string | null; // e.g., 'laptop', 'notebook', or an Entity ID
  curiosityTrail: string[]; // History of interacted entities
  
  setRoom: (room: Room) => void;
  focusObject: (id: string | null) => void;
  addToTrail: (entityId: string) => void;
}

export const useVisitorStore = create<VisitorState>((set) => ({
  currentRoom: 'Study',
  focusedObjectId: null,
  curiosityTrail: [],
  
  setRoom: (room) => set({ currentRoom: room }),
  focusObject: (id) => set({ focusedObjectId: id }),
  addToTrail: (entityId) => set((state) => {
    // Only add if it's not the most recent one to prevent duplicates
    if (state.curiosityTrail[state.curiosityTrail.length - 1] !== entityId) {
      return { curiosityTrail: [...state.curiosityTrail, entityId] };
    }
    return state;
  }),
}));
