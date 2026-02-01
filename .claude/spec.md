# Narratai - Product Spec (Current MVP)

## Vision
Create a calm, cozy visual-novel-style reading experience where users narrate chapters aloud. The app feels like a soft, magical studio: warm backgrounds, gentle ambient audio, and visual rewards for completing chapters and books.

## Core Experience
- Users choose a story and read an entire chapter on one screen.
- They can tap any paragraph to make it "active" for focus.
- They record **one full chapter take** (mic plus optional ambient).
- Progress bars show chapter and book completion.
- Rewards appear at chapter end:
  - Silver Book sticker (chapter)
  - Golden Book badge (story)
  - Diamond Book trophy (book)
- Micro-achievements add small dopamine moments (local only).

## Modes
- **Solo**: One reader narrates.
- **Two Readers (Local)**: Two people on the same device. Paragraphs can be labeled `reader: 1` or `reader: 2` to guide turns. Recording remains a single chapter take.

## Audio
- MediaRecorder for capture.
- Web Audio API for mixing mic + ambient.
- User can toggle "Include background in recording".
- Recordings stored in IndexedDB (one per chapter).

## Visuals
- Calm, cozy, magical palette.
- Stickers are colorful and feel tactile.
- AI backgrounds optional:
  - Gemini image generation with a soft, painterly prompt.
  - Cached in localStorage.

## Data Model (Story JSON)
```
{
  "id": "story-id",
  "title": "Story Title",
  "author": "Author Name",
  "description": "...",
  "chapters": [
    {
      "id": 1,
      "title": "Chapter Title",
      "backgroundKeywords": "cozy library dusk",
      "ambientAudio": "/audio/ambient.mp3",
      "paragraphs": [
        { "id": "p1", "reader": 1, "text": "..." }
      ],
      "artifact": { "type": "image", "url": "/artifacts/x.svg", "caption": "..." }
    }
  ]
}
```

## Progress Tracking
- localStorage key: `narratai-progress`
- Store:
  - `completedChapters` array
  - `artifacts` array
  - `title`, `author`

## Micro-Achievements (Local)
- `narratai-achievements`:
  - First Voice (first recording)
  - Chapter Spark (first chapter)
  - Three Chapters (3 chapters completed)
  - Story Finished (story completed)

## Out of Scope (for now)
- Auth or accounts
- Database
- Remote team mode
- WebRTC / live voice chat
- Social sharing
- Competitive gamification
