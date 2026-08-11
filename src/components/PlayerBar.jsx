import { useState } from 'react'
import { usePlayerStore } from '../store/playerStore'
import ProgressBar from './ProgressBar'
import VolumeIcon from './VolumeIcon'
import Icon from './Icons'
import { assetUrl } from '../utils/assetUrl'
const fmt = (n) => `${Math.floor(n / 60)}:${String(Math.floor(n % 60)).padStart(2, '0')}`

export default function PlayerBar({ onToggleNow, onToggleQueue, nowOpen, queueOpen, onToggleMini }) {
  const s = usePlayerStore(); const [liked, setLiked] = useState(false); const [previousVolume, setPreviousVolume] = useState(.75)
  if (!s.currentTrack) return null
  const mute = () => { if (s.volume > 0) { setPreviousVolume(s.volume); s.setVolume(0) } else s.setVolume(previousVolume || .75) }
  const toggleFullscreen = () => { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen?.() }
  return <footer className="player"><div className="now-playing"><img src={s.currentTrack.cover} alt=""/><div><strong>{s.currentTrack.title}</strong><span>{s.currentTrack.artist}</span></div><button className={`like ${liked ? 'liked' : ''}`} onClick={() => setLiked(!liked)} aria-label="Like">♡</button></div><div className="controls"><div className="control-buttons"><button aria-label="Shuffle" className={s.isShuffle ? 'selected' : ''} onClick={s.toggleShuffle}><Icon name="shuffle"/></button><button aria-label="Previous" onClick={s.previous}>◀</button><button className="play-pause" aria-label={s.isPlaying ? 'Pause' : 'Play'} onClick={s.togglePlay}>{s.isPlaying ? <span className="pause-icon"/> : <span className="play-icon"/>}</button><button aria-label="Next" onClick={s.next}>▶</button><button aria-label={`Repeat ${s.repeat}`} className={s.repeat !== 'off' ? 'selected' : ''} onClick={s.toggleRepeat}>↻</button></div><div className="timeline"><span>{fmt(s.currentTime)}</span><ProgressBar value={s.currentTime} max={s.duration || s.currentTrack.duration} onChange={s.seek}/><span>{fmt(s.duration || s.currentTrack.duration)}</span></div></div><div className="player-tools"><button aria-label="Show now playing" className={nowOpen ? 'selected' : ''} onClick={onToggleNow}><Icon name="mini"/></button><button aria-label="Queue" className={queueOpen ? 'selected' : ''} onClick={onToggleQueue}><Icon name="queue"/></button><button className="volume-button" aria-label={s.volume === 0 ? 'Unmute' : 'Mute'} onClick={mute}><VolumeIcon volume={s.volume}/></button><ProgressBar compact value={s.volume} max={1} onChange={s.setVolume}/><button aria-label="Mini player" onClick={onToggleMini}><Icon name="mini"/></button><button aria-label="Fullscreen" onClick={toggleFullscreen}><Icon name="fullscreen"/></button></div></footer>
}
