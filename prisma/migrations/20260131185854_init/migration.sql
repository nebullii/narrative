-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "narrator_level" INTEGER NOT NULL DEFAULT 1,
    "narrator_xp" INTEGER NOT NULL DEFAULT 0,
    "current_streak" INTEGER NOT NULL DEFAULT 0,
    "last_narration_date" TIMESTAMP(3),
    "team_id" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "team_code" VARCHAR(6) NOT NULL,
    "name" TEXT NOT NULL,
    "current_story_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reader1_id" TEXT NOT NULL,
    "reader2_id" TEXT,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recordings" (
    "id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "story_id" TEXT NOT NULL,
    "chapter_id" INTEGER NOT NULL,
    "paragraph_id" TEXT NOT NULL,
    "audio_path" TEXT NOT NULL,
    "duration_seconds" INTEGER,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recordings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progress" (
    "id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "story_id" TEXT NOT NULL,
    "completed_chapters" JSONB NOT NULL DEFAULT '[]',
    "artifacts" JSONB NOT NULL DEFAULT '[]',
    "reflections" JSONB NOT NULL DEFAULT '{}',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "badges" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "icon" VARCHAR(50) NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "requirement" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_badges" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "badge_id" TEXT NOT NULL,
    "earned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "team_id" TEXT,

    CONSTRAINT "user_badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "story_unlocks" (
    "id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "story_id" TEXT NOT NULL,
    "unlocked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unlocked_by" TEXT NOT NULL,

    CONSTRAINT "story_unlocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "story_metadata" (
    "story_id" VARCHAR(100) NOT NULL,
    "theme" VARCHAR(50) NOT NULL,
    "story_length" VARCHAR(20) NOT NULL,
    "estimated_minutes" INTEGER NOT NULL,
    "chapter_count" INTEGER NOT NULL,
    "unlock_requirement" JSONB,
    "is_starter_story" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "story_metadata_pkey" PRIMARY KEY ("story_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "teams_team_code_key" ON "teams"("team_code");

-- CreateIndex
CREATE INDEX "teams_team_code_idx" ON "teams"("team_code");

-- CreateIndex
CREATE INDEX "recordings_team_id_story_id_idx" ON "recordings"("team_id", "story_id");

-- CreateIndex
CREATE UNIQUE INDEX "recordings_team_id_story_id_chapter_id_paragraph_id_key" ON "recordings"("team_id", "story_id", "chapter_id", "paragraph_id");

-- CreateIndex
CREATE UNIQUE INDEX "progress_team_id_key" ON "progress"("team_id");

-- CreateIndex
CREATE INDEX "progress_team_id_story_id_idx" ON "progress"("team_id", "story_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_badges_user_id_badge_id_key" ON "user_badges"("user_id", "badge_id");

-- CreateIndex
CREATE UNIQUE INDEX "story_unlocks_team_id_story_id_key" ON "story_unlocks"("team_id", "story_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_reader1_id_fkey" FOREIGN KEY ("reader1_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_reader2_id_fkey" FOREIGN KEY ("reader2_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recordings" ADD CONSTRAINT "recordings_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recordings" ADD CONSTRAINT "recordings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress" ADD CONSTRAINT "progress_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_badge_id_fkey" FOREIGN KEY ("badge_id") REFERENCES "badges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_unlocks" ADD CONSTRAINT "story_unlocks_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_unlocks" ADD CONSTRAINT "story_unlocks_unlocked_by_fkey" FOREIGN KEY ("unlocked_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
