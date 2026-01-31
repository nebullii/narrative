# Project: Narratai

## What
An interactive storytelling app where people read stories together, either solo or with a partner using voice. Calm, meaningful reading experience with chapter artifacts and progress tracking.

## Users
- Solo readers who want a focused, distraction-free reading experience
- Pairs (friends, parent-child, partners) who want to read stories together remotely
- People seeking mindful, screen-time alternatives to social media

## Features
### Day 1 - Core Reading & Solo MVP
- [ ] Story data structure with JSON chapters (narrator + player lines)
- [ ] Reading screen showing one line at a time with speaker highlighting
- [ ] Chapter progression with "Next Line" button
- [ ] Chapter completion screen with artifact (image/text) reveal
- [ ] Journal/progress screen showing artifacts collected and chapters completed
- [ ] Optional reflection notes for each chapter
- [ ] Two-player room placeholder (join room, display names)

### Day 2 - Two-Player Voice & Polish
- [ ] WebRTC connection for two players
- [ ] Voice Activity Detection (VAD) - speaking unlocks player's line
- [ ] Real-time speaker highlighting in two-player mode
- [ ] Shared artifacts between players
- [ ] Shared journal progress
- [ ] Ambient quiet moment after chapter completion
- [ ] Smooth UI transitions and calm typography
- [ ] Optional ambient soundscape

## Tech Stack
- Frontend: React with Vite
- Backend: FastAPI (Python) for story data and room management
- Database: SQLite for story content and progress tracking
- Styling: Tailwind CSS (calm, minimal design)
- Voice: WebRTC for peer-to-peer voice connection
- Optional: Firebase/Supabase for real-time room state

## Pages
- `/` - Home/landing (start solo or join room)
- `/solo/:storyId` - Solo reading mode
- `/room/:roomId` - Two-player voice reading mode
- `/journal` - Progress tracking (artifacts, chapters, reflections)
- `/chapter-end/:chapterId` - Chapter completion with artifact

## API Endpoints
- `GET /api/health` - Health check
- `GET /api/stories` - List available stories
- `GET /api/stories/:id` - Get story with all chapters
- `GET /api/chapters/:id` - Get specific chapter data
- `POST /api/rooms` - Create two-player room
- `GET /api/rooms/:id` - Get room state
- `POST /api/progress` - Save chapter progress
- `GET /api/progress/:userId` - Get user's journal/progress
- `POST /api/reflections` - Save chapter reflection

## Story Data Structure
```json
{
  "title": "The Secret Garden",
  "chapters": [
    {
      "id": 1,
      "lines": [
        {"speaker": "narrator", "text": "Mary Lennox was a sour-faced girl..."},
        {"speaker": "player1", "text": "I don't like this place."},
        {"speaker": "narrator", "text": "She looked around the big, lonely house..."}
      ],
      "artifact": {
        "type": "image",
        "url": "/artifacts/mary-arrival.jpg",
        "caption": "Mary's arrival sketch"
      }
    }
  ]
}
```

## Vibe
Calm, mindful, distraction-free. Soft backgrounds, warm typography, quiet ambient sounds. No streaks, no percentages, no gamification. Focus on connection (with story or another person) and meaningful reflection. Like a cozy reading nook, not a productivity app.

## MVP Scope (2 Days)
- Day 1: Solo reading works with 2 chapters, artifacts unlock, journal stores progress
- Day 2: Basic two-player voice mode with VAD, shared progress, polished UI
- First story: "The Secret Garden" (first 2 chapters adapted for interactive reading)
