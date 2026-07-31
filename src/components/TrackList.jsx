import TrackRow from './TrackRow'
export default function TrackList({ tracks }) { return <section className="track-list"><div className="list-head"><span>#</span><span>Title</span><span>Album</span><span>Date added</span><span>◷</span></div>{tracks.map((track, i) => <TrackRow key={track.id} track={track} index={i}/>)}</section> }
