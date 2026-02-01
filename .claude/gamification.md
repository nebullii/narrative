# Rewards & Micro-Achievements (Light Gamification)

This project allows **small, non-competitive** achievements that feel rewarding without pressure.

## Allowed Rewards
- **Chapter completion**: Silver Book sticker
- **Story completion**: Golden Book badge
- **Book completion**: Diamond Book trophy

## Micro-Achievements (Local Only)
- **First Voice**: first recording
- **Chapter Spark**: first completed chapter
- **Three Chapters**: complete three chapters
- **Story Finished**: complete a story

## Progress Tracking
- Chapter progress (paragraphs)
- Book progress (chapters)
- Visible during reading and at chapter end

## Not Allowed
- XP, levels, streaks
- Leaderboards
- Unlock trees or scarcity mechanics
- Competitive badges or social pressure

### 7. Story Themes & Collections
**Stories grouped by themes:**
- 🦄 Fantasy Adventures
- 🕵️ Mystery & Detective
- 🚀 Science Fiction
- 📚 Classic Literature
- 👶 Children's Tales
- 🌍 World Mythology

**Collection Mechanic:**
- Complete all stories in a theme → Earn special badge
- Unlock bonus content (author biographies, historical context)
- Visual: Theme icons light up when complete

### 8. Unlockables (Non-Story Content)
**As you progress, unlock:**
- 🎨 **Gallery Mode** - View all collected illustrations
- 📖 **Author Notes** - Behind-the-scenes story info
- 🎭 **Voice Tips** - Narration improvement guides
- 🎧 **Audio Tools** - Simple editing features (trim, fade)
- 🌟 **Themes** - UI color themes/backgrounds
- 🎵 **Ambient Sounds** - Optional background audio while recording

### 9. Progression Gates (Keep Engagement)
**Unlock Requirements:**
- Some stories require completing previous ones
- Advanced stories require Narrator Level X
- Bonus content requires badges
- Special illustrations require team milestones

**Example:**
```
🔒 "The Wizard of Oz"
Requirements:
✓ Complete "Alice in Wonderland"
✗ Reach Narrator Level 5 (Currently Level 3)
✗ Earn "Bookworm" badge (Complete 5 stories)
```

## UI/UX Design

### Dashboard Layout
```
┌─────────────────────────────────────┐
│  👤 Sarah - Level 5 Storyteller     │
│  🎯 Streak: 7 days | ⭐ 12 badges   │
├─────────────────────────────────────┤
│  📖 Continue Your Story             │
│  ┌───────────────────────────────┐  │
│  │ Alice in Wonderland           │  │
│  │ Chapter 3: Tea Party          │  │
│  │ ▓▓▓▓▓▓▓░░░ 70%               │  │
│  │ [Continue Narrating]          │  │
│  └───────────────────────────────┘  │
├─────────────────────────────────────┤
│  🎨 Recent Achievements             │
│  • Earned "Clear Voice" badge       │
│  • Leveled up to Level 5!           │
│  • Unlocked "Wizard of Oz"          │
├─────────────────────────────────────┤
│  📚 Story Library (5 unlocked)      │
│  [Browse Stories]                   │
│                                     │
│  🏆 Your Progress                   │
│  [View Stats & Badges]              │
└─────────────────────────────────────┘
```

### Story Library View
- Grid of story cards
- Locked stories shown but grayed out
- Hover shows unlock requirements
- Filter by: All, Unlocked, Locked, Theme
- Sort by: Difficulty, Length, Recently Added

### Badge Collection View
- Visual badge wall (like trophy case)
- Earned badges: Full color + earned date
- Locked badges: Silhouette + how to earn
- Categories: Story, Narration, Team, Streaks

## Data Models (Additional)

```sql
-- Badges definition
CREATE TABLE badges (
  id UUID PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  icon VARCHAR(50),
  category VARCHAR(50),
  requirement JSONB,
  created_at TIMESTAMP
);

-- User badges earned
CREATE TABLE user_badges (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  badge_id UUID REFERENCES badges(id),
  earned_at TIMESTAMP,
  team_id UUID REFERENCES teams(id),
  UNIQUE(user_id, badge_id)
);

-- Story unlocks
CREATE TABLE story_unlocks (
  id UUID PRIMARY KEY,
  team_id UUID REFERENCES teams(id),
  story_id VARCHAR(100),
  unlocked_at TIMESTAMP,
  unlocked_by UUID REFERENCES users(id),
  UNIQUE(team_id, story_id)
);

-- User progression
ALTER TABLE users ADD COLUMN narrator_level INTEGER DEFAULT 1;
ALTER TABLE users ADD COLUMN narrator_xp INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN current_streak INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN last_narration_date DATE;

-- Story metadata
CREATE TABLE story_metadata (
  story_id VARCHAR(100) PRIMARY KEY,
  theme VARCHAR(50),
  difficulty VARCHAR(20),
  unlock_requirement JSONB,
  estimated_time_minutes INTEGER
);
```

## Balance & Pacing

### XP Curve
- Paragraph: 10 XP
- Chapter Complete: 50 XP bonus
- Story Complete: 200 XP bonus
- First recording of the day: 20 XP bonus

### Level Requirements
- Level 1→2: 100 XP (10 paragraphs)
- Level 2→3: 200 XP
- Level 3→4: 300 XP
- Level 4→5: 500 XP
- Level 5+: 500 XP per level

### Unlock Pacing
- Every story completion: Unlock 1-2 new stories
- Every 2 levels: Unlock new feature
- Every 5 badges: Unlock bonus content

## Anti-Frustration Design
- ✅ No failed recordings (can always re-record)
- ✅ No penalties for taking breaks
- ✅ Streaks are celebrated but not punished if broken
- ✅ Can unlock stories through multiple paths
- ✅ Partner leaving doesn't lose your progress
- ✅ Clear requirements for locked content
- ✅ No time pressure or daily limits

## Motivation Loop
```
Record paragraph → Earn XP → Progress bar fills → Level up!
    ↓                                                ↓
Complete chapter → Unlock illustration → Badge earned
    ↓                                                ↓
Complete story → Unlock new stories → Continue journey
```

## Implementation Priority
**Phase 1 (Core):**
- ✅ XP & Level system
- ✅ Story unlocking (3 start, 2 unlock per completion)
- ✅ Basic badges (10 badges)
- ✅ Personal stats dashboard

**Phase 2 (Engagement):**
- Story map visualization
- Badge collection view
- Streak tracking
- Gallery mode for illustrations

**Phase 3 (Polish):**
- More badges (30+ total)
- Story themes/collections
- Audio tools unlockables
- Advanced stats & graphs
