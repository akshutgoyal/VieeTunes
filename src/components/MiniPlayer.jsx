import { useEffect } from 'react'
import { usePlayerStore } from '../store/playerStore'
import Icon from './Icons'
import VolumeIcon from './VolumeIcon'

export default function MiniPlayer({ onClose }) {
  const s = usePlayerStore()
  useEffect(() => { try { window.resizeTo(300, 300) } catch {} }, [])
  if (!s.currentTrack) return null
  const mute = () => s.setVolume(s.volume ? 0 : .75)
  return <aside className="mini-player"><button className="mini-close" aria-label="Close mini player" onClick={onClose}>×</button><div className="mini-art"><img src={s.currentTrack.cover} alt=""/><div className="mini-controls"><button aria-label="Volume" onClick={mute}><VolumeIcon volume={s.volume}/></button><button aria-label="Previous" onClick={s.previous}>◀</button><button className="mini-play" aria-label={s.isPlaying ? 'Pause' : 'Play'} onClick={s.togglePlay}>{s.isPlaying ? <span className="pause-icon"/> : <span className="play-icon"/>}</button><button aria-label="Next" onClick={s.next}>▶</button><button aria-label="Show now playing"><Icon name="mini" size={17}/></button></div><div className="mini-progress"><span style={{ width: `${(s.currentTime / (s.duration || s.currentTrack.duration)) * 100}%` }}/></div></div><div className="mini-details"><div><strong>{s.currentTrack.title}</strong><span>{s.currentTrack.artist}</span></div><button aria-label="Like">♡</button></div></aside>
}
