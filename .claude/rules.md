# Build Rules - Narratai (Current MVP)

## Stack
- **Framework**: Next.js App Router
- **Language**: JavaScript (no TypeScript)
- **Styling**: Tailwind CSS
- **Audio**: MediaRecorder + Web Audio API (mix mic + ambient)
- **Storage**:
  - Progress: localStorage
  - Recordings: IndexedDB
- **AI Backgrounds**: Gemini image generation (optional via env)

## Scope Rules
- Keep it simple: single-device, local duo mode only.
- No auth, no database, no server-side user accounts.
- No WebRTC or live streaming.
- Allow light micro-achievements; avoid competitive systems (no streaks, leaderboards, XP).
- Rewards are visual only and tied to progress tiers.

## Project Structure (current)
```
app/
  page.js
  solo/[storyId]/page.js
  journal/page.js
  api/background/route.js
components/
  SoloReadingClient.js
  ReadingScreen.js
  ChapterEnd.js
  Journal.js
lib/
  audioStorage.js
data/
  *.json
public/
  artifacts/
  rewards/
  audio/
```

## Audio Rules
- One recording per chapter.
- Recording must support mic + optional ambient mix.
- Always request mic permissions explicitly.
- Handle missing MediaRecorder gracefully.
- Stop tracks and disconnect nodes on stop/unmount.

## UI/UX Rules
- Calm, cozy, magical visual tone.
- Chapter view shows the whole chapter at once.
- Users can toggle which paragraph is active, but recording is a single chapter take.
- Progress bars:
  - Chapter progress (paragraphs)
  - Book progress (chapters)
  - Visible on reading and chapter end screens.
- Rewards:
  - Chapter completion: Silver Book sticker
  - Story completion: Golden Book badge
  - Book completion: Diamond Book trophy
- Micro-achievements are allowed and should be non-competitive.

## Data Rules
- Story JSON uses:
  - `chapters[].paragraphs[]` with optional `reader` assignments.
  - `artifact` with `url` and `caption`.
- `narratai-progress` in localStorage stores:
  - `title`, `author`
  - `completedChapters`, `artifacts`, `reflections` (if used later)

## AI Background Rules
- AI backgrounds are optional; always fallback to static image/keywords.
- Cache AI results in localStorage and in-memory cache (server route).
- Never block rendering if AI request fails.

## Anti-Patterns
- No complex state management libraries.
- No server-side user data persistence.
- No external media servers.
- No invasive analytics.
