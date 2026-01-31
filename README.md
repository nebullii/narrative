# Narratai - Interactive Storytelling App

> A calm, meaningful reading experience for solo readers or pairs reading together with voice.

## 🚀 Quick Start with Forge

This project uses [Forge](https://github.com/sundai-club/forge) for structured AI-assisted development.

### 1. Read the Specifications

The AI needs to understand what to build:

```bash
# Your specifications are in:
.forge/spec.md   # What to build (features, pages, API)
.forge/rules.md  # How to build it (constraints, structure)
```

### 2. Build with AI

```bash
# Tell Claude Code to build from specs:
claude "Read .forge/spec.md and .forge/rules.md, then build this project for Day 1 MVP"
```

The AI will:
- Create the React + FastAPI structure
- Build the reading interface
- Implement chapter progression
- Add artifact reveals and journal
- Set up story data loading

### 3. Run Locally

```bash
# Frontend (React + Vite)
cd frontend
npm install
npm run dev
# Opens at http://localhost:5173

# Backend (FastAPI)
cd backend
pip install -r requirements.txt
python main.py
# Runs at http://localhost:8000
```

### 4. Day 2: Add Voice Mode

```bash
claude "Now implement Day 2 features: WebRTC voice connection and VAD"
```

## 📖 2-Day MVP Plan

### Day 1 - Core Reading & Solo MVP
- ✅ Story data structure (JSON)
- ✅ Reading screen (one line at a time)
- ✅ Chapter progression
- ✅ Artifact reveals
- ✅ Journal/progress tracking
- ✅ Two-player room placeholder

### Day 2 - Voice & Polish
- ⏳ WebRTC connection
- ⏳ Voice Activity Detection
- ⏳ Shared artifacts
- ⏳ UI polish
- ⏳ Ambient soundscape (optional)

## 🎯 Current Story

**The Secret Garden** (first 2 chapters)
- See `data/secret-garden.json` for story structure
- Artifacts in `assets/artifacts/`

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: FastAPI + Python 3.10+
- **Database**: SQLite
- **Voice**: WebRTC (peer-to-peer)
- **Deploy**: Vercel or Railway

## 📁 Project Structure

```
/
├── frontend/          # React app
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Route pages
│   │   ├── hooks/         # Custom hooks (voice, WebRTC)
│   │   └── App.jsx
│   └── package.json
├── backend/           # FastAPI app
│   ├── main.py
│   ├── routes/            # API endpoints
│   └── requirements.txt
├── data/              # Story JSON files
└── assets/            # Static artifacts
```

## 🎨 Design Principles

- **Calm over exciting** - No flashy animations
- **Meaningful over gamified** - No streaks or scores
- **Simple over scalable** - Build for 2 days, not 2 years
- **Connection over competition** - Share stories, not compete

## 📝 Making Changes

1. Update `.forge/spec.md` with new features
2. Tell Claude: `"Read .forge/spec.md and implement [feature]"`
3. Test locally
4. Iterate

## 🚢 Deployment

```bash
# Deploy to Vercel (frontend + serverless backend)
vercel

# Or deploy to Railway (full-stack)
railway up
```

## 🧪 Testing Your Build

**Solo Mode**:
1. Open app → Click "Read Solo"
2. Select "The Secret Garden"
3. Click through lines (Next button)
4. Complete chapter → See artifact
5. Check journal → Verify progress saved

**Two-Player Mode** (Day 2):
1. Open app in 2 browsers/devices
2. Create room → Share room code
3. Join room with second device
4. Speak to advance your lines
5. Complete chapter together → Shared artifact

## 🎭 Story Format

```json
{
  "title": "Story Title",
  "chapters": [
    {
      "id": 1,
      "lines": [
        {"speaker": "narrator", "text": "..."},
        {"speaker": "player1", "text": "..."},
        {"speaker": "player2", "text": "..."}
      ],
      "artifact": {
        "type": "image",
        "url": "/artifacts/chapter-1.jpg",
        "caption": "Artifact description"
      }
    }
  ]
}
```

## 🤝 Contributing

This is a 2-day MVP. Keep it simple:
- No authentication yet
- No complex state management
- No external media servers
- No gamification features

## 📄 License

MIT
