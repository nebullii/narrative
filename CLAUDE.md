# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Narratai is an interactive storytelling app for solo readers or pairs reading together with voice. Built as a 2-day MVP focusing on calm, meaningful reading experiences without gamification.

**Current Status**: Day 1 MVP complete (solo reading mode). Day 2 features (WebRTC voice, two-player mode) are planned but not yet implemented.

## Commands

```bash
# Development
npm install          # Install dependencies
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Build for production
npm start            # Start production server

# No test/lint commands configured yet
```

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: JavaScript (no TypeScript)
- **Styling**: Tailwind CSS with custom calm color palette
- **Storage**: localStorage for progress, JSON files for story data
- **Voice (Day 2)**: WebRTC planned for peer-to-peer connection

## Architecture

### Story Data Flow

Stories are stored as JSON files in `/data/` directory (e.g., `secret-garden.json`). Each story contains:
- Metadata (id, title, author, description)
- Chapters with sequential lines
- Line speakers: `narrator`, `player1`, or `player2`
- Chapter artifacts (images with captions) revealed on completion
- Optional reflection prompts

The solo reading page (`app/solo/[storyId]/page.js`) is a Server Component that reads JSON files directly using `fs.readFileSync()` and passes the story data to the Client Component for interactivity. No API layer needed.

### Progress Tracking

User progress is stored in localStorage under the key `narratai-progress` with structure:
```json
{
  "[story-id]": {
    "completedChapters": [1, 2],
    "artifacts": [...],
    "reflections": {
      "1": "user reflection text"
    }
  }
}
```

All progress logic is in the client component at `components/SoloReadingClient.js`.

### Reading Flow

1. Home page (`app/page.js`) offers "Read Solo" or "View Journal"
2. Solo page (`app/solo/[storyId]/page.js`) - Server Component reads JSON file
3. Story data passed to `SoloReadingClient` - Client Component manages chapter/line state
4. `ReadingScreen` component displays one line at a time with progress bar
5. On chapter completion, `ChapterEnd` component shows artifact and reflection prompt
6. Progress is saved to localStorage
7. Journal page displays collected artifacts and reflections

### Component Architecture

- **SoloReadingClient** (`components/SoloReadingClient.js`) - Client Component that manages reading state (currentChapter, currentLine) and localStorage operations
- **ReadingScreen** (`components/ReadingScreen.js`) - Displays current line with speaker styling (narrator vs player), progress bar, and Next button
- **ChapterEnd** (`components/ChapterEnd.js`) - Shows chapter artifact, optional reflection input, and navigation to next chapter
- **Journal** (`components/Journal.js`) - Displays user's collected artifacts and reflections

### Styling System

Custom Tailwind colors defined in `tailwind.config.js`:
- `calm-bg`: #f5f3f0 (soft beige background)
- `calm-text`: #3a3532 (warm dark text)
- `calm-accent`: #8b7355 (muted brown for buttons/accents)
- `narrator`: #6b5d54 (narrator text color)
- `player`: #4a7c7e (player text color - teal)

Design principle: Calm, serif typography with subtle transitions. No flashy animations.

## Development Guidelines

### Adding New Stories

1. Create JSON file in `/data/` following the structure in `secret-garden.json`
2. Place artifact images in `/public/artifacts/`
3. Story will automatically appear in stories list

### Important Constraints

- **No over-engineering**: This is a 2-day MVP. Keep solutions simple and focused.
- **No gamification**: No streaks, scores, badges, or competitive features
- **Free services only**: No paid APIs or services
- **Mobile-first**: Design must work well on small screens
- **Calm aesthetic**: Subtle animations, warm colors, serif fonts

### Client vs Server Components

- Default to Server Components (Next.js App Router)
- Use `'use client'` only when needed:
  - `SoloReadingClient` - manages state (useState) for line/chapter progression
  - Components with user interactions/localStorage access
  - Journal page - needs useEffect to read from localStorage
- Solo page reads JSON files as a Server Component, then passes data to Client Components

### Day 2 Features (Not Yet Implemented)

When implementing two-player voice mode:
- WebRTC for peer-to-peer audio connection
- Voice Activity Detection (VAD) to unlock player's lines when speaking
- Room creation/joining flow at `/room/[roomId]`
- Shared artifacts between players
- Keep solo mode fully functional

Reference `.claude/spec.md` and `.claude/rules.md` for full Day 2 specifications.

## Key Files

- `.claude/spec.md` - Complete feature specifications (Day 1 & 2)
- `.claude/rules.md` - Build constraints and anti-patterns
- `data/secret-garden.json` - Example story structure
- `app/solo/[storyId]/page.js` - Server Component that loads story data
- `components/SoloReadingClient.js` - Client Component with reading state management
- `components/ReadingScreen.js` - Main reading interface

## Design Philosophy

From README.md:
- **Calm over exciting** - No flashy animations
- **Meaningful over gamified** - No streaks or scores
- **Simple over scalable** - Build for 2 days, not 2 years
- **Connection over competition** - Share stories, not compete
