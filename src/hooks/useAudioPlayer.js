import { useEffect, useRef } from 'react'
import { usePlayerStore } from '../store/playerStore'

export function useAudioPlayer() {
  const audioRef = useRef(new Audio())
  const track = usePlayerStore((s) => s.currentTrack)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const volume = usePlayerStore((s) => s.volume)
  const setPlaying = usePlayerStore((s) => s.setPlaying)
  const setCurrentTime = usePlayerStore((s) => s.setCurrentTime)
  const setDuration = usePlayerStore((s) => s.setDuration)
  const next = usePlayerStore((s) => s.next)
  const currentTime = usePlayerStore((s) => s.currentTime)
  const repeat = usePlayerStore((s) => s.repeat)

  useEffect(() => { const audio = audioRef.current; audio.loop = repeat === 'one'; if (!track) return; audio.src = track.audio; audio.load(); if (isPlaying) audio.play().catch(() => setPlaying(false)); }, [track, isPlaying, repeat, setPlaying])
  useEffect(() => { const audio = audioRef.current; audio.volume = volume; isPlaying ? audio.play().catch(() => setPlaying(false)) : audio.pause() }, [isPlaying, volume, setPlaying])
  useEffect(() => { if (Math.abs(audioRef.current.currentTime - currentTime) > 0.25) audioRef.current.currentTime = currentTime }, [currentTime])
  useEffect(() => { const audio = audioRef.current; const time = () => setCurrentTime(audio.currentTime); const loaded = () => setDuration(audio.duration || track?.duration || 0); const ended = () => { if (repeat === 'one') { audio.currentTime = 0; setCurrentTime(0); audio.play().catch(() => setPlaying(false)) } else next() }; const failed = () => { console.warn(`Unable to load audio: ${track?.audio}`); next() }; audio.addEventListener('timeupdate', time); audio.addEventListener('loadedmetadata', loaded); audio.addEventListener('ended', ended); audio.addEventListener('error', failed); return () => { audio.removeEventListener('timeupdate', time); audio.removeEventListener('loadedmetadata', loaded); audio.removeEventListener('ended', ended); audio.removeEventListener('error', failed) } }, [next, repeat, setCurrentTime, setDuration, setPlaying, track])
  return audioRef
}
