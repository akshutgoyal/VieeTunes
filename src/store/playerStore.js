import { create } from 'zustand'

const saved = (() => { try { return JSON.parse(localStorage.getItem('vieetunes-player') || '{}') } catch { return {} } })()
const persist = (state) => { try { localStorage.setItem('vieetunes-player', JSON.stringify({ trackId: state.currentTrack?.id ?? null, volume: state.volume, isShuffle: state.isShuffle, repeat: state.repeat })) } catch {} }

export const usePlayerStore = create((set, get) => ({
  tracks: [], queue: [], currentTrack: null, isPlaying: false, currentTime: 0, duration: 0,
  volume: typeof saved.volume === 'number' ? saved.volume : 0.75, isShuffle: Boolean(saved.isShuffle), repeat: saved.repeat === 'one' ? 'one' : 'off',
  setTracks: (tracks) => { const currentTrack = tracks.find((track) => track.id === saved.trackId) ?? tracks[0] ?? null; set({ tracks, currentTrack, queue: currentTrack ? tracks.slice(tracks.indexOf(currentTrack) + 1) : [], duration: currentTrack?.duration ?? 0, isPlaying: false }); },
  playTrack: (id) => { const { tracks } = get(); const index = tracks.findIndex((track) => track.id === id); set({ currentTrack: tracks[index] ?? null, queue: index >= 0 ? tracks.slice(index + 1) : [], isPlaying: true, currentTime: 0 }); },
  startPlaylist: () => { const { tracks } = get(); if (!tracks.length) return; set({ currentTrack: tracks[0], queue: tracks.slice(1), isShuffle: false, isPlaying: true, currentTime: 0 }); },
  startShuffle: () => { const { tracks } = get(); if (!tracks.length) return; const shuffled = [...tracks.slice(1)].sort(() => Math.random() - 0.5); set({ currentTrack: tracks[0], queue: shuffled, isShuffle: true, isPlaying: true, currentTime: 0 }); },
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  seek: (currentTime) => set({ currentTime }),
  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
  toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),
  // The visible replay control is intentionally a direct repeat-current toggle.
  toggleRepeat: () => set((state) => ({ repeat: state.repeat === 'one' ? 'off' : 'one' })),
  next: () => { const { tracks, queue, repeat } = get(); if (!tracks.length) return; if (repeat === 'one') return set({ currentTime: 0, isPlaying: true }); if (queue.length) { const [nextTrack, ...remaining] = queue; return set({ currentTrack: nextTrack, queue: remaining, currentTime: 0, isPlaying: true }); } return set({ currentTrack: tracks[0], queue: tracks.slice(1), currentTime: 0, isPlaying: true }); },
  previous: () => { const { tracks, currentTrack, currentTime } = get(); if (!tracks.length) return; if (currentTime > 3) return set({ currentTime: 0, isPlaying: true }); const index = tracks.findIndex((t) => t.id === currentTrack?.id); const previousIndex = (index - 1 + tracks.length) % tracks.length; set({ currentTrack: tracks[previousIndex], queue: tracks.slice(previousIndex + 1), currentTime: 0, isPlaying: true }); }
}))

usePlayerStore.subscribe((state) => persist(state))
