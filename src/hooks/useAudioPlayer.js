import { useEffect, useRef } from 'react'
import { usePlayerStore } from '../store/playerStore'

export function useAudioPlayer() {
  const audioRef = useRef(new Audio())
  const audioGraphRef = useRef(null)
  const track = usePlayerStore((s) => s.currentTrack)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const volume = usePlayerStore((s) => s.volume)
  const setPlaying = usePlayerStore((s) => s.setPlaying)
  const setCurrentTime = usePlayerStore((s) => s.setCurrentTime)
  const setDuration = usePlayerStore((s) => s.setDuration)
  const next = usePlayerStore((s) => s.next)
  const currentTime = usePlayerStore((s) => s.currentTime)
  const repeat = usePlayerStore((s) => s.repeat)
  useEffect(() => { const audio = audioRef.current; audio.crossOrigin = 'anonymous'; const AudioContext = window.AudioContext || window.webkitAudioContext; if (!AudioContext) return; const context = new AudioContext(); const source = context.createMediaElementSource(audio); const analyser = context.createAnalyser(); analyser.fftSize = 128; analyser.smoothingTimeConstant = .72; source.connect(analyser); analyser.connect(context.destination); audioGraphRef.current = { context, analyser }; return () => { source.disconnect(); analyser.disconnect(); context.close() } }, [])

  useEffect(() => { const audio = audioRef.current; audio.loop = repeat === 'one'; if (!track) return; audio.src = track.audio; audio.load(); if (isPlaying) audio.play().catch(() => setPlaying(false)); }, [track, isPlaying, repeat, setPlaying])
  useEffect(() => { const audio = audioRef.current; audio.volume = volume; isPlaying ? audio.play().catch(() => setPlaying(false)) : audio.pause() }, [isPlaying, volume, setPlaying])
  useEffect(() => { const onKeyDown = (event) => { const target = event.target; if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLButtonElement) return; if (event.code === 'Space') { event.preventDefault(); usePlayerStore.getState().togglePlay() } else if (event.code === 'ArrowRight') { event.preventDefault(); next() } else if (event.code === 'ArrowLeft') { event.preventDefault(); usePlayerStore.getState().previous() } }; window.addEventListener('keydown', onKeyDown); return () => window.removeEventListener('keydown', onKeyDown) }, [next])
  useEffect(() => { if (!('mediaSession' in navigator)) return; const session = navigator.mediaSession; const audio = audioRef.current; const handlers = { play: () => { audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false)) }, pause: () => { audio.pause(); setPlaying(false) }, nexttrack: () => { audio.pause(); next() }, previoustrack: () => { audio.pause(); usePlayerStore.getState().previous() } }; Object.entries(handlers).forEach(([action, handler]) => { try { session.setActionHandler(action, handler) } catch {} }); if (track && 'MediaMetadata' in window) session.metadata = new MediaMetadata({ title: track.title, artist: track.artist, album: track.album }); return () => { Object.keys(handlers).forEach((action) => { try { session.setActionHandler(action, null) } catch {} }) } }, [next, setPlaying, track])
  useEffect(() => { if ('mediaSession' in navigator) navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused' }, [isPlaying])
  useEffect(() => { const graph = audioGraphRef.current; if (!graph) return; let frame; const values = new Uint8Array(graph.analyser.frequencyBinCount); const draw = () => { graph.analyser.getByteFrequencyData(values); const bars = Array.from({ length: 28 }, (_, i) => { const start = Math.floor((i / 28) * values.length); const end = Math.max(start + 1, Math.floor(((i + 1) / 28) * values.length)); let sum = 0; for (let j = start; j < end; j++) sum += values[j]; return Math.max(.12, sum / (end - start) / 255) }); window.dispatchEvent(new CustomEvent('vieetunes-visualizer', { detail: bars })); if (isPlaying) frame = requestAnimationFrame(draw) }; if (isPlaying) { graph.context.resume(); draw() } return () => cancelAnimationFrame(frame) }, [isPlaying])
  useEffect(() => { if (Math.abs(audioRef.current.currentTime - currentTime) > 0.25) audioRef.current.currentTime = currentTime }, [currentTime])
  useEffect(() => { const audio = audioRef.current; const time = () => setCurrentTime(audio.currentTime); const loaded = () => setDuration(audio.duration || track?.duration || 0); const ended = () => { if (repeat === 'one') { audio.currentTime = 0; setCurrentTime(0); audio.play().catch(() => setPlaying(false)) } else next() }; const failed = () => { console.warn(`Unable to load audio: ${track?.audio}`); next() }; audio.addEventListener('timeupdate', time); audio.addEventListener('loadedmetadata', loaded); audio.addEventListener('ended', ended); audio.addEventListener('error', failed); return () => { audio.removeEventListener('timeupdate', time); audio.removeEventListener('loadedmetadata', loaded); audio.removeEventListener('ended', ended); audio.removeEventListener('error', failed) } }, [next, repeat, setCurrentTime, setDuration, setPlaying, track])
  return audioRef
}
