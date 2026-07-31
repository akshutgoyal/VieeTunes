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

  useEffect(() => { const audio = audioRef.current; if (!track) return; audio.src = track.audio; audio.load(); if (isPlaying) audio.play().catch(() => setPlaying(false)); }, [track])
  useEffect(() => { const audio = audioRef.current; audio.volume = volume; isPlaying ? audio.play().catch(() => setPlaying(false)) : audio.pause() }, [isPlaying, volume, setPlaying])
  useEffect(() => { if (Math.abs(audioRef.current.currentTime - currentTime) > 0.25) audioRef.current.currentTime = currentTime }, [currentTime])
  useEffect(() => { const audio = audioRef.current; const time = () => setCurrentTime(audio.currentTime); const loaded = () => setDuration(audio.duration || track?.duration || 0); const ended = () => next(); audio.addEventListener('timeupdate', time); audio.addEventListener('loadedmetadata', loaded); audio.addEventListener('ended', ended); return () => { audio.removeEventListener('timeupdate', time); audio.removeEventListener('loadedmetadata', loaded); audio.removeEventListener('ended', ended) } }, [next, setCurrentTime, setDuration, track])
  return audioRef
}
