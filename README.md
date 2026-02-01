# Narratai - Interactive Storytelling App

> A calm, meaningful reading experience for solo readers or pairs reading together with voice.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
# Opens at http://localhost:3000
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

1. Make your edits in `app/`, `components/`, or `data/`
2. Run the dev server and test locally
3. Iterate

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
