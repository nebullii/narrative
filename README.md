# Narratai - Interactive Storytelling App

> A calm, meaningful reading experience for solo readers or pairs reading together with voice.

## 🚀 Quick Start with Forge

This project uses [Forge](https://github.com/nebullii/forge) for structured AI-assisted development.

### 1. Read the Specifications

The AI needs to understand what to build:

```bash
# Your specifications are in:
.claude/spec.md   # What to build (features, pages, API)
.claude/rules.md  # How to build it (constraints, structure)
```

### 2. Build with AI

```bash
# Tell Claude Code to build from specs:
claude "Read .claude/spec.md and .claude/rules.md, then build this project for Day 1 MVP"
```

The AI will:
- Create the Next.js app structure
- Build the reading interface
- Implement chapter progression
- Add artifact reveals and journal
- Set up story data loading from JSON

### 3. Run Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev
# Opens at http://localhost:3000
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

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Storage**: JSON files + localStorage
- **Voice**: WebRTC (peer-to-peer)
- **Deploy**: Vercel

## 📁 Project Structure

```
/
├── app/               # Next.js App Router
│   ├── page.js       # Home
│   ├── solo/         # Solo reading pages
│   ├── journal/      # Progress tracking
│   └── api/          # API routes
├── components/        # React components
├── lib/              # Utilities
├── data/             # Story JSON files
└── public/           # Static assets
```

## 🎨 Design Principles

- **Calm over exciting** - No flashy animations
- **Meaningful over gamified** - No streaks or scores
- **Simple over scalable** - Build for 2 days, not 2 years
- **Connection over competition** - Share stories, not compete

## 📝 Making Changes

1. Update `.claude/spec.md` with new features
2. Tell Claude: `"Read .claude/spec.md and implement [feature]"`
3. Test locally
4. Iterate

## 🚢 Deployment

```bash
# Deploy to Vercel
npx vercel
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
