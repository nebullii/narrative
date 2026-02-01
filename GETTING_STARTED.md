# Getting Started with Narratai

This guide will walk you through building the Narratai MVP with Next.js and Claude Code.

## What You Have Right Now

✅ `.claude/spec.md` - Complete specification of what to build
✅ `.claude/rules.md` - Build constraints and structure
✅ `data/secret-garden.json` - Sample story with 2 chapters
✅ `README.md` - Project documentation

## Step-by-Step Build Process

### Step 1: Understand the Specifications

Read these files to understand the project:

```bash
cat .claude/spec.md    # What features to build
cat .claude/rules.md   # How to build them
```

**Key points:**
- Day 1 = Solo reading mode
- Day 2 = Add voice for two players
- No over-engineering (simple > scalable)

### Step 2: Build Day 1 (Core Reading)

Tell Claude Code to build from your specifications:

```bash
claude "Read .claude/spec.md and .claude/rules.md. Build the Day 1 MVP with Next.js:
- Next.js app structure with App Router
- Reading screen with line-by-line progression
- Chapter completion with artifacts
- Journal for progress tracking
- Story data loading from JSON

Focus on getting solo reading mode working end-to-end."
```

Claude will:
1. Create Next.js app with App Router structure
2. Build UI components (ReadingScreen, ChapterEnd, Journal)
3. Implement API routes for stories
4. Set up localStorage for progress tracking
5. Connect everything together

### Step 3: Test Day 1 Build

```bash
# Install and run
npm install
npm run dev
# Opens at http://localhost:3000
```

### Optional: AI Backgrounds (Gemini)

To enable AI-generated backgrounds, set:

```bash
GEMINI_API_KEY="your-key"
GEMINI_IMAGE_MODEL="gemini-1.5-flash"
```

If not set, the app falls back to the chapter background image/keywords.

**Manual test checklist:**
- [ ] Can you load the Secret Garden story?
- [ ] Does clicking "Next" advance through lines?
- [ ] Do narrator/player lines show differently?
- [ ] Does chapter end screen show the artifact?
- [ ] Does journal save your progress?

### Step 4: Build Day 2 (Voice Mode)

Once Day 1 works, add voice features:

```bash
claude "Day 1 solo mode is working. Now implement Day 2:
- WebRTC peer-to-peer connection
- Voice Activity Detection (VAD) to unlock lines
- Room creation and joining
- Shared artifacts between players
- Keep solo mode working too

Use simple-peer or native WebRTC. No complex infrastructure."
```

### Step 5: Test Day 2 Build

**Two-player test:**
1. Open app in two browser windows (or devices)
2. Create a room in window 1
3. Join room in window 2 with room code
4. Speak in window 1 → Your line should unlock
5. Speak in window 2 → Their line should unlock
6. Complete chapter → Both see artifact

### Step 6: Polish & Deploy

```bash
# UI improvements
claude "Polish the UI:
- Smooth transitions between lines
- Calm color scheme (soft backgrounds)
- Better typography for reading
- Ambient quiet moment after chapters"

# Deploy to Vercel
npm install -g vercel
vercel
```

## Common Issues & Solutions

### "I want to change the story structure"

Edit `data/secret-garden.json` and tell Claude:
```bash
claude "I updated the story data. Please adjust the frontend to handle the new structure."
```

### "The voice detection isn't working"

```bash
claude "Debug the VAD implementation. Check:
- Microphone permissions
- Audio threshold levels
- WebRTC connection state
Add console logs to diagnose the issue."
```

### "I want to add a new feature"

1. Add it to `.forge/spec.md` under Features
2. Tell Claude: `"Read the updated spec.md and implement [new feature]"`

### "The build is too complex"

Check `.forge/rules.md` - it should prevent over-engineering. Tell Claude:
```bash
claude "Simplify this code following the rules in .forge/rules.md.
Remove unnecessary abstractions."
```

## Pro Tips

### 🎯 Be Specific with Claude

**Bad:**
"Build the app"

**Good:**
"Read .forge/spec.md and build the ReadingScreen component. It should show one line at a time from the story data, with the speaker highlighted."

### 🔄 Iterate in Small Steps

Don't try to build everything at once:
1. Get data loading working
2. Then build the reading UI
3. Then add chapter progression
4. Then add artifacts, etc.

### 📖 Reference the Spec

Always point Claude to the spec:
```bash
claude "According to .forge/spec.md, the vibe should be 'calm and mindful'.
Update the CSS to match this - remove bright colors, add softer transitions."
```

### 🐛 Debug with Context

Give Claude error messages:
```bash
claude "I'm getting this error: [paste error].
Check the ReadingScreen component and fix it."
```

## Next Steps After MVP

Once your 2-day MVP works:

1. **Test with real users** - Get feedback on the reading experience
2. **Add more stories** - Create new JSON files in `data/`
3. **Enhance artifacts** - Add audio clips, animations, interactive elements
4. **Add authentication** - Let users save progress across devices
5. **Mobile app** - Convert to React Native or PWA

## Resources

- [Forge Documentation](https://github.com/sundai-club/forge)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React + Vite Docs](https://vitejs.dev/guide/)
- [WebRTC Tutorial](https://webrtc.org/getting-started/overview)
- [simple-peer](https://github.com/feross/simple-peer) - Easy WebRTC library

## Getting Help

If you're stuck:
1. Read the error message carefully
2. Check `.forge/spec.md` - is the feature clearly defined?
3. Ask Claude to explain what's happening
4. Simplify - remove features until it works, then add back

Remember: **The goal is a working MVP in 2 days, not a perfect product.**

Happy building! 🚀
