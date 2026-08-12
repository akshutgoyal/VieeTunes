# VieeTunes

A static Spotify-inspired music player built with React, Vite, Tailwind CSS, and Zustand. VieeTunes loads local song metadata and audio files from `public/`, with no backend or external music API.
  
## Features

- Spotify-style dark three-column layout
- Playlist header and responsive track list
- Local audio playback with play, pause, next, previous, seek, and volume controls
- Shuffle, repeat-one, queue, and keyboard/media-key controls
- Persistent playback preferences using `localStorage`
- Picture-in-picture mini player synchronized with the main window
- Responsive desktop, tablet, and mobile layouts
- GitHub Pages deployment workflow

## Requirements

- Node.js 18 or newer
- npm

## Getting started

```bash
npm install
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173`.

## Song data and assets

Song metadata is loaded from [`public/songs.json`](./public/songs.json). Each entry uses this format:

```json
{
  "id": 1,
  "title": "Song title",
  "artist": "Artist name",
  "album": "Album name",
  "cover": "/covers/cover.jpg",
  "audio": "/audio/song.mp3",
  "duration": 180
}
```

Place cover images in `public/covers/` and audio files in `public/audio/`. The paths in `songs.json` must match the files exactly, including spaces and letter casing.

## Production build

```bash
npm run build
npm run preview
```

The Vite production base path is `/VieeTunes/`, which supports the GitHub Pages project URL `https://akshutgoyal.github.io/VieeTunes/`. Local Vite development still serves from `/`.

## Deployment

Push to the `main` branch to trigger [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml). The workflow builds the app and publishes `dist/` to GitHub Pages.

For GitHub Pages, enable Pages in the repository settings and select the `gh-pages` branch as the deployment source if it is not already configured.

## Project structure

```text
src/
├── components/     UI components
├── hooks/          Audio and playback hooks
├── store/          Zustand player state
├── utils/          Shared browser utilities
├── App.jsx
└── main.jsx
public/
├── songs.json
├── audio/
└── covers/
```

## License

This project is intended for personal learning and demonstration purposes. Ensure you have permission to use any music and artwork added to `public/audio/` and `public/covers/`.
