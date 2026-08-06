import { usePlayerStore } from '../store/playerStore'

export default function QueuePanel({ open, onClose }) {
  const current = usePlayerStore((s) => s.currentTrack)
  const queue = usePlayerStore((s) => s.queue)
  if (!open) return null
  return <aside className="queue-panel"><div className="queue-panel-head"><h2>Queue</h2><button aria-label="Close queue" onClick={onClose}>×</button></div><h3>Now playing</h3>{current && <div className="queue-current"><img src={current.cover} alt=""/><span><b>{current.title}</b><em>{current.artist}</em></span></div>}<h3 className="next-heading">Next in queue</h3>{queue.length ? queue.map((track) => <div className="queue-item" key={track.id}><img src={track.cover} alt=""/><span><b>{track.title}</b><em>{track.artist}</em></span></div>) : <p className="queue-empty">Your queue is empty.</p>}</aside>
}
