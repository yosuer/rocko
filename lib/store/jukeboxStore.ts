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

  setCurrentSong: (song: QueueItem | null) => void;
  setQueue: (queue: QueueItem[]) => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setConnectedUsers: (count: number) => void;
  setIsLoading: (loading: boolean) => void;
  setPlayerReady: (ready: boolean) => void;
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

  setCurrentSong: (song) => set({ currentSong: song }),
  setQueue: (queue) => set({ queue }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setVolume: (volume) => set({ volume }),
  setConnectedUsers: (count) => set({ connectedUsers: count }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setPlayerReady: (ready) => set({ playerReady: ready }),

  addToQueue: (item) =>
    set((state) => ({ queue: [...state.queue, item] })),

  removeFromQueue: (id) =>
    set((state) => ({ queue: state.queue.filter((i) => i.id !== id) })),

  updateQueueItem: (id, updates) =>
    set((state) => ({
      queue: state.queue.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    })),
}));
