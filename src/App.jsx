import { useEffect } from 'react'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { usePlayerStore } from './store/playerStore'
import LeftSidebar from './components/LeftSidebar'
import ActionBar from './components/ActionBar'
import NowPlayingSidebar from './components/NowPlayingSidebar'
import PlaylistHeader from './components/PlaylistHeader'
import TrackList from './components/TrackList'
import PlayerBar from './components/PlayerBar'

export default function App() { useAudioPlayer(); const tracks = usePlayerStore((s) => s.tracks); const setTracks = usePlayerStore((s) => s.setTracks); useEffect(() => { fetch(`${import.meta.env.BASE_URL}songs.json`).then((r) => r.json()).then(setTracks); }, [setTracks]); return <div className="app-shell"><LeftSidebar/><main><div className="top-glow"/><PlaylistHeader tracks={tracks}/><ActionBar/><TrackList tracks={tracks}/></main><NowPlayingSidebar/><PlayerBar/></div> }
