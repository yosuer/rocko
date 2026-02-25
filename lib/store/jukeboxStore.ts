import { create } from 'zustand';
import type { QueueItem } from '@/lib/types';

interface JukeboxState {
  currentSong: QueueItem | null;
  queue: QueueItem[];
  isPlaying: boolean;
  volume: number;
  connectedUsers: number;
  isLoading: boolean;
  playerReady: boolean;
  /** Tiempo actual de reproducción en segundos (para letras sincronizadas) */
  currentTime: number;

  setCurrentSong: (song: QueueItem | null) => void;
  setQueue: (queue: QueueItem[]) => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setConnectedUsers: (count: number) => void;
  setIsLoading: (loading: boolean) => void;
  setPlayerReady: (ready: boolean) => void;
  setCurrentTime: (time: number) => void;
  addToQueue: (item: QueueItem) => void;
  removeFromQueue: (id: string) => void;
  updateQueueItem: (id: string, updates: Partial<QueueItem>) => void;
}

export const useJukeboxStore = create<JukeboxState>((set) => ({
  currentSong: null,
  queue: [],
  isPlaying: false,
  volume: 70,
  connectedUsers: 0,
  isLoading: false,
  playerReady: false,
  currentTime: 0,

  setCurrentSong: (song) => set({ currentSong: song, currentTime: 0 }),
  setQueue: (queue) => set({ queue }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setVolume: (volume) => set({ volume }),
  setConnectedUsers: (count) => set({ connectedUsers: count }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setPlayerReady: (ready) => set({ playerReady: ready }),
  setCurrentTime: (time) => set({ currentTime: time }),

  addToQueue: (item) =>
    set((state) => ({ queue: [...state.queue, item] })),

  removeFromQueue: (id) =>
    set((state) => ({ queue: state.queue.filter((i) => i.id !== id) })),

  updateQueueItem: (id, updates) =>
    set((state) => ({
      queue: state.queue.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    })),
}));
