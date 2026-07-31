import { create } from 'zustand'

export const usePlayerStore = create((set, get) => ({
  tracks: [], queue: [], currentTrack: null, isPlaying: false, currentTime: 0, duration: 0,
  volume: 0.75, isShuffle: false, repeat: 'off',
  setTracks: (tracks) => set({ tracks, currentTrack: tracks[0] ?? null, duration: tracks[0]?.duration ?? 0 }),
  playTrack: (id) => { const { tracks } = get(); const index = tracks.findIndex((track) => track.id === id); set({ currentTrack: tracks[index] ?? null, queue: index >= 0 ? tracks.slice(index + 1) : [], isPlaying: true, currentTime: 0 }); },
  startPlaylist: () => { const { tracks } = get(); if (!tracks.length) return; set({ currentTrack: tracks[0], queue: tracks.slice(1), isShuffle: false, isPlaying: true, currentTime: 0 }); },
  startShuffle: () => { const { tracks } = get(); if (!tracks.length) return; const shuffled = [...tracks.slice(1)].sort(() => Math.random() - 0.5); set({ currentTrack: tracks[0], queue: shuffled, isShuffle: true, isPlaying: true, currentTime: 0 }); },
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  seek: (currentTime) => set({ currentTime }),
  setVolume: (volume) => set({ volume }),
  toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),
  toggleRepeat: () => set((state) => ({ repeat: state.repeat === 'off' ? 'all' : state.repeat === 'all' ? 'one' : 'off' })),
  next: () => { const { tracks, queue, repeat } = get(); if (!tracks.length) return; if (repeat === 'one') return set({ currentTime: 0, isPlaying: true }); if (queue.length) { const [nextTrack, ...remaining] = queue; return set({ currentTrack: nextTrack, queue: remaining, currentTime: 0, isPlaying: true }); } if (repeat === 'all') return set({ currentTrack: tracks[0], queue: tracks.slice(1), currentTime: 0, isPlaying: true }); set({ isPlaying: false, currentTime: 0 }); },
  previous: () => { const { tracks, currentTrack } = get(); const index = tracks.findIndex((t) => t.id === currentTrack?.id); set({ currentTrack: tracks[(index - 1 + tracks.length) % tracks.length], currentTime: 0, isPlaying: true }); }
}))
