import { usePlayerStore } from '../store/playerStore'

export default function TrackRow({ track, index }) {
  const current = usePlayerStore((s) => s.currentTrack?.id === track.id)
  const playing = usePlayerStore((s) => s.isPlaying)
  const playTrack = usePlayerStore((s) => s.playTrack)
  const togglePlay = usePlayerStore((s) => s.togglePlay)
  const mins = `${Math.floor(track.duration / 60)}:${String(track.duration % 60).padStart(2, '0')}`
  const handleRowControl = (event) => { event.stopPropagation(); current && playing ? togglePlay() : current ? togglePlay() : playTrack(track.id) }

  return <button className={`track-row ${current ? 'current' : ''}`} onClick={() => playTrack(track.id)}>
    <span className="track-number">{current && playing ? <span className="equalizer" aria-label="Currently playing"><i/><i/><i/><i/></span> : index + 1}<span className="row-play" aria-hidden="true" onClick={handleRowControl}>{current && playing ? <span className="pause-icon"/> : <span className="play-icon"/>}</span></span>
    <span className="track-info"><img src={track.cover} alt=""/><span><strong>{track.title}</strong><small>{track.artist}</small></span></span>
    <span className="album">{track.album}</span><span className="date-added">13 Aug 2026</span><span className="track-duration">{mins}</span>
  </button>
}
