import { usePlayerStore } from '../store/playerStore'

export default function NowPlayingSidebar({ open = false, onToggleQueue }) {
  const track = usePlayerStore((s) => s.currentTrack)
  const nextTrack = usePlayerStore((s) => s.queue[0])
  if (!track) return <aside className={`now-panel ${open ? 'mobile-visible' : ''} empty-panel`}><p>Select a track</p><span>Your playlist details will appear here.</span></aside>
  return <aside className={`now-panel ${open ? 'mobile-visible' : ''}`}>
    <div className="panel-heading sidebar-sticky-heading"><span className="marquee-title">Late night frequencies</span><button aria-label="More options">•••</button></div>
    <div className="hero-card"><img src={track.cover} alt=""/><div className="hero-scrim"/><div className="hero-copy"><h2>{track.title}</h2><p>{track.artist} <span className="verified">✓</span></p></div></div>
    <section className="artist-info"><div className="artist-info-heading"><strong>About the artist</strong><button>Follow</button></div><p>{track.artist} brings a distinctive atmosphere to every listen. Discover more from this artist in your personal rotation.</p><span className="listeners">1,204 monthly listeners</span></section>
    <div className="credit-card"><strong>Credits <small>Show all</small></strong><span>Main Artist · {track.artist}</span><span>Album · {track.album}</span></div>
    <div className="queue-card"><strong>Next in queue <button className="open-queue" aria-label="Open queue" onClick={onToggleQueue}>Open queue</button></strong>{nextTrack ? <div className="queue-track"><img src={nextTrack.cover} alt=""/><span><b>{nextTrack.title}</b><em>{nextTrack.artist}</em></span></div> : <span className="queue-empty">Nothing queued</span>}</div>
  </aside>
}
