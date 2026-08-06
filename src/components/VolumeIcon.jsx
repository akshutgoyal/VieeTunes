export default function VolumeIcon({ volume }) {
  return <svg className="volume-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 9v6h4l5 4V5L7 9H3Z" fill="currentColor"/>
    {volume > 0 && <path d="M15 9.2a4 4 0 0 1 0 5.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>}
    {volume >= .5 && <path d="M18 6.5a8 8 0 0 1 0 11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>}
    {volume === 0 && <path d="m16 9 5 6m0-6-5 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>}
  </svg>
}
