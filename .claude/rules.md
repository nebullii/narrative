# Build Rules

## Stack
- Frontend: React 18+ with Vite
- Backend: FastAPI with Python 3.10+
- Database: SQLite (single file, no setup)
- Styling: Tailwind CSS
- Voice: WebRTC (simple-peer or native RTCPeerConnection)
- Optional: Firebase/Supabase for room signaling only

## Structure
```
/
├── frontend/          # React app
│   ├── src/
│   │   ├── components/
│   │   │   ├── ReadingScreen.jsx
│   │   │   ├── ChapterEnd.jsx
│   │   │   ├── Journal.jsx
│   │   │   └── VoiceConnection.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Solo.jsx
│   │   │   └── Room.jsx
│   │   ├── hooks/
│   │   │   ├── useVoiceActivity.js
│   │   │   └── useWebRTC.js
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/           # FastAPI app
│   ├── main.py
│   ├── routes/
│   │   ├── stories.py
│   │   ├── rooms.py
│   │   └── progress.py
│   ├── models.py
│   ├── requirements.txt
│   └── database.py
├── data/              # Story JSON files
│   └── secret-garden.json
├── assets/            # Artifacts (images)
│   └── artifacts/
└── README.md
```

## Constraints
- Free tiers only (no paid services)
- Single repo, single deploy
- SQLite for data (no external DB)
- WebRTC for peer-to-peer voice (no media servers for MVP)
- Environment variables for all secrets
- NO scoring, NO streaks, NO gamification

## Frontend Rules
- Functional components only
- Use fetch() for API calls
- Responsive design (mobile-first)
- No unnecessary dependencies
- Keep animations subtle and calm
- Focus on readability (larger text, good spacing)
- Use Tailwind for consistent, minimal styling

## Backend Rules
- FastAPI with automatic OpenAPI docs
- Pydantic for validation
- SQLite with raw SQL or sqlite3
- CORS enabled for frontend
- Simple room state management (no complex WebSocket server needed for MVP)
- Story data loaded from JSON files (no admin interface for MVP)

## Voice Rules (Day 2)
- Use WebRTC for direct peer-to-peer connection
- Voice Activity Detection (VAD) can be simple threshold-based or use existing library
- No recording or storage of voice data
- Handle connection failures gracefully
- Optional: Use Firebase Realtime Database for WebRTC signaling only

## Data Priorities
- Story content is static JSON (no CMS for MVP)
- Progress stored per user in SQLite
- Room state is ephemeral (no long-term storage for MVP)
- Artifacts are static image files in assets folder

## Anti-Patterns to Avoid
- No complex state management (Redux, etc.) - use React Context or simple props
- No authentication for MVP (optional anonymous IDs only)
- No real-time sync beyond voice - progress saves on chapter completion
- No media servers, TURN servers, or complex WebRTC infrastructure
- No backend rendering of story content - serve JSON directly

## Deploy Target
- Vercel (frontend) + Vercel serverless functions (backend)
- Or Railway/Render for full-stack
- Static assets (artifacts) served from public folder

## Day 1 vs Day 2 Focus
**Day 1**: Solo reading must work end-to-end
- Story loading → Reading → Chapter end → Artifact → Journal

**Day 2**: Add voice connection on top
- Don't break Day 1 functionality
- Voice mode is addition, not replacement
- Polish UI after voice is working

## Design Principles
- Calm over exciting
- Meaningful over gamified
- Simple over scalable
- Connection over competition
- Reflection over metrics
