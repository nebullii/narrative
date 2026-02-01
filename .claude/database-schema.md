# Database Schema - Not Used in Current MVP

This project is currently **local-only**:
- No auth
- No database
- Progress in localStorage
- Recordings in IndexedDB

If/when a backend is added, use this file as a starting point.

## Draft Prisma Schema (Future)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String    @map("password_hash")
  username      String
  createdAt     DateTime  @default(now()) @map("created_at")

  // Relationships
  teamId        String?   @map("team_id")
  team          Team?     @relation(fields: [teamId], references: [id], onDelete: SetNull)
  recordings    Recording[]
  teamsAsReader1 Team[]   @relation("TeamReader1")
  teamsAsReader2 Team[]   @relation("TeamReader2")

  @@map("users")
}

model Team {
  id              String    @id @default(uuid())
  teamCode        String    @unique @map("team_code") @db.VarChar(6)
  name            String
  currentStoryId  String?   @map("current_story_id")
  createdAt       DateTime  @default(now()) @map("created_at")

  // Reader assignments
  reader1Id       String    @map("reader1_id")
  reader1         User      @relation("TeamReader1", fields: [reader1Id], references: [id], onDelete: Cascade)
  reader2Id       String?   @map("reader2_id")
  reader2         User?     @relation("TeamReader2", fields: [reader2Id], references: [id], onDelete: SetNull)

  // Relationships
  members         User[]
  recordings      Recording[]
  progress        Progress[]

  @@index([teamCode])
  @@map("teams")
}

model Recording {
  id              String    @id @default(uuid())
  teamId          String    @map("team_id")
  userId          String    @map("user_id")
  storyId         String    @map("story_id")
  chapterId       Int       @map("chapter_id")
  paragraphId     String    @map("paragraph_id")
  audioPath       String    @map("audio_path")
  durationSeconds Int?      @map("duration_seconds")
  recordedAt      DateTime  @default(now()) @map("recorded_at")

  // Relationships
  team            Team      @relation(fields: [teamId], references: [id], onDelete: Cascade)
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([teamId, storyId, chapterId, paragraphId])
  @@index([teamId, storyId])
  @@map("recordings")
}

model Progress {
  id                String    @id @default(uuid())
  teamId            String    @unique @map("team_id")
  storyId           String    @map("story_id")
  completedChapters Json      @default("[]") @map("completed_chapters") @db.JsonB
  artifacts         Json      @default("[]") @db.JsonB
  reflections       Json      @default("{}") @db.JsonB
  updatedAt         DateTime  @updatedAt @map("updated_at")

  // Relationships
  team              Team      @relation(fields: [teamId], references: [id], onDelete: Cascade)

  @@index([teamId, storyId])
  @@map("progress")
}
```

## Status
- This schema is **not active** in the codebase.
- Treat it as a placeholder for a future server-backed version.

## Schema Explanation

### Users Table
- **id**: UUID primary key
- **email**: Unique, used for login
- **passwordHash**: Bcrypt hashed password (never store plain text)
- **username**: Display name
- **teamId**: Foreign key to teams (nullable - user might not be in a team yet)
- **createdAt**: Account creation timestamp

### Teams Table
- **id**: UUID primary key
- **teamCode**: 6-character unique code (e.g., "ABC123") for joining
- **name**: Team name (auto-generated or custom)
- **reader1Id**: First team member (creator)
- **reader2Id**: Second team member (nullable until someone joins)
- **currentStoryId**: Story they're currently working on (optional)
- **createdAt**: Team creation timestamp

### Recordings Table
- **id**: UUID primary key
- **teamId**: Which team this recording belongs to
- **userId**: Which user made the recording
- **storyId**: Story identifier (e.g., "alice-in-wonderland")
- **chapterId**: Chapter number (1, 2, 3...)
- **paragraphId**: Paragraph identifier (e.g., "p1", "p2")
- **audioPath**: File path or S3 URL
- **durationSeconds**: Length of recording (optional)
- **recordedAt**: When it was recorded
- **Unique constraint**: One recording per team/story/chapter/paragraph combo

### Progress Table
- **id**: UUID primary key
- **teamId**: Which team's progress (unique - one progress record per team per story)
- **storyId**: Which story
- **completedChapters**: JSON array of completed chapter IDs `[1, 2, 3]`
- **artifacts**: JSON array of unlocked artifacts
- **reflections**: JSON object with chapter reflections `{"1": "My thoughts..."}`
- **updatedAt**: Auto-updated timestamp

## SQL Migrations

### Initial Migration
```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(100) NOT NULL,
  team_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create teams table
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_code VARCHAR(6) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  reader1_id UUID NOT NULL,
  reader2_id UUID,
  current_story_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create recordings table
CREATE TABLE recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL,
  user_id UUID NOT NULL,
  story_id VARCHAR(100) NOT NULL,
  chapter_id INTEGER NOT NULL,
  paragraph_id VARCHAR(50) NOT NULL,
  audio_path TEXT NOT NULL,
  duration_seconds INTEGER,
  recorded_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(team_id, story_id, chapter_id, paragraph_id)
);

-- Create progress table
CREATE TABLE progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID UNIQUE NOT NULL,
  story_id VARCHAR(100) NOT NULL,
  completed_chapters JSONB DEFAULT '[]',
  artifacts JSONB DEFAULT '[]',
  reflections JSONB DEFAULT '{}',
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add foreign keys
ALTER TABLE users ADD CONSTRAINT fk_users_team
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL;

ALTER TABLE teams ADD CONSTRAINT fk_teams_reader1
  FOREIGN KEY (reader1_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE teams ADD CONSTRAINT fk_teams_reader2
  FOREIGN KEY (reader2_id) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE recordings ADD CONSTRAINT fk_recordings_team
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE;

ALTER TABLE recordings ADD CONSTRAINT fk_recordings_user
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE progress ADD CONSTRAINT fk_progress_team
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE;

-- Add indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_teams_code ON teams(team_code);
CREATE INDEX idx_recordings_team_story ON recordings(team_id, story_id);
CREATE INDEX idx_progress_team_story ON progress(team_id, story_id);
```

## Example Queries

### Get team with members
```sql
SELECT
  t.*,
  r1.username as reader1_name,
  r1.email as reader1_email,
  r2.username as reader2_name,
  r2.email as reader2_email
FROM teams t
JOIN users r1 ON t.reader1_id = r1.id
LEFT JOIN users r2 ON t.reader2_id = r2.id
WHERE t.id = 'team-uuid';
```

### Get all recordings for a team's story
```sql
SELECT
  r.*,
  u.username as recorded_by
FROM recordings r
JOIN users u ON r.user_id = u.id
WHERE r.team_id = 'team-uuid'
  AND r.story_id = 'alice-in-wonderland'
ORDER BY r.chapter_id, r.paragraph_id;
```

### Get team progress
```sql
SELECT * FROM progress
WHERE team_id = 'team-uuid'
  AND story_id = 'alice-in-wonderland';
```

## Setup Commands

```bash
# Install Prisma
npm install prisma @prisma/client

# Initialize Prisma
npx prisma init

# Create migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# View database in browser
npx prisma studio

# Reset database (development only!)
npx prisma migrate reset
```
