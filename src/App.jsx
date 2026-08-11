import { useEffect, useState } from 'react'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { usePlayerStore } from './store/playerStore'
import LeftSidebar from './components/LeftSidebar'
import ActionBar from './components/ActionBar'
import NowPlayingSidebar from './components/NowPlayingSidebar'
import PlaylistHeader from './components/PlaylistHeader'
import TrackList from './components/TrackList'
import PlayerBar from './components/PlayerBar'
import Navbar from './components/Navbar'
import QueuePanel from './components/QueuePanel'
import MiniPlayer from './components/MiniPlayer'
import { openMiniPlayer } from './utils/openMiniPlayer'

export default function App() {
  useAudioPlayer()
  const tracks = usePlayerStore((s) => s.tracks)
  const setTracks = usePlayerStore((s) => s.setTracks)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [nowOpen, setNowOpen] = useState(true)
  const [queueOpen, setQueueOpen] = useState(false)
  const isMiniWindow = new URLSearchParams(window.location.search).has('mini')

  useEffect(() => { fetch(`${import.meta.env.BASE_URL}songs.json`).then((r) => { if (!r.ok) throw new Error('songs.json failed'); return r.json() }).then((songs) => { const resolveAsset = (path) => `${import.meta.env.BASE_URL}${String(path).replace(/^\/+/, '')}`; const normalized = Array.isArray(songs) ? songs.map((song) => ({ ...song, cover: resolveAsset(song.cover), audio: resolveAsset(song.audio) })) : []; setTracks(normalized); setLoading(false) }).catch(() => { setError('No tracks found'); setLoading(false) }) }, [setTracks])
  const toggleQueue = () => { setQueueOpen((open) => !open); setNowOpen(false) }
  const showNowPlaying = () => { setQueueOpen(false); setNowOpen((open) => !open) }
  if (isMiniWindow) return <div className="mini-window-shell">{loading ? <p>Loading player…</p> : error ? <p>{error}</p> : <MiniPlayer onClose={() => window.close()} />}</div>
  return <div className={`app-shell ${!nowOpen && !queueOpen ? 'no-sidebar' : ''}`}><Navbar/><LeftSidebar/><main><div className="top-glow"/><PlaylistHeader tracks={tracks}/>{loading ? <div className="skeleton-list" aria-label="Loading tracks">{[1,2,3,4].map((i) => <div className="skeleton-row" key={i}><i/><i/><i/></div>)}</div> : error || !tracks.length ? <div className="empty-state">{error || 'No tracks found'}</div> : <><ActionBar/><TrackList tracks={tracks}/></>}</main>{queueOpen ? <QueuePanel open onClose={() => setQueueOpen(false)}/> : nowOpen ? <NowPlayingSidebar open={nowOpen} onToggleQueue={toggleQueue}/> : null}<PlayerBar onToggleNow={showNowPlaying} onToggleQueue={toggleQueue} nowOpen={nowOpen} queueOpen={queueOpen} onToggleMini={openMiniPlayer}/></div>
}
