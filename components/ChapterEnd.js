'use client'

import { useState } from 'react'

const DEFAULT_REWARDS = {
  chapter: {
    icon: '/rewards/chapter-sticker.svg',
    title: 'Silver Book'
  },
  story: {
    icon: '/rewards/story-badge.svg',
    title: 'Golden Book'
  },
  book: {
    icon: '/rewards/book-trophy.svg',
    title: 'Diamond Book'
  }
}

export default function ChapterEnd({ story, chapter, onNext, isLastChapter, currentChapterIndex, totalChapters, earnedAchievements = [] }) {
  const [showRewards, setShowRewards] = useState(false)
  const [showArtifact, setShowArtifact] = useState(false)
  const rewardConfig = {
    ...DEFAULT_REWARDS,
    ...(story?.rewards || {}),
    ...(chapter?.rewards || {})
  }

  const normalizeArtifactUrl = (url) => {
    // Convert jpg references to svg if needed
    return url?.replace('.jpg', '.svg') || url
  }

  const handleContinue = () => {
    onNext()
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full space-y-8">
        {/* Chapter complete message */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-serif text-calm-text">
            Chapter Complete
          </h2>
          <p className="text-calm-accent">
            You've unlocked a new artifact
          </p>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-calm-accent">
            <span>Chapter Progress</span>
            <span>{currentChapterIndex + 1} / {totalChapters}</span>
          </div>
          <div className="h-2 bg-calm-accent/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-calm-accent rounded-full"
              style={{ width: `${((currentChapterIndex + 1) / totalChapters) * 100}%` }}
            />
          </div>
        </div>

        {!showRewards ? (
          <div className="text-center py-12">
            <button
              onClick={() => setShowRewards(true)}
              className="px-12 py-4 bg-calm-accent text-white rounded-lg text-lg hover:bg-opacity-90 transition-all"
            >
              Reveal Reward
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {earnedAchievements.length > 0 && (
              <div className="bg-white border border-calm-accent/30 rounded-lg p-4">
                <h3 className="text-lg font-serif text-calm-text mb-3">New Achievements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {earnedAchievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3">
                      <img src={achievement.icon} alt={achievement.title} className="w-12 h-12" />
                      <div>
                        <p className="text-sm font-medium text-calm-text">{achievement.title}</p>
                        <p className="text-xs text-calm-accent">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rewards */}
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              <div className="text-center">
                <div className="relative mx-auto h-28 w-28">
                  <div className="absolute inset-0 rounded-full bg-calm-accent/10 blur-xl" />
                  <div className="absolute -bottom-2 left-1/2 h-5 w-20 -translate-x-1/2 rounded-full bg-calm-text/20 blur-sm" />
                  <img
                    src={rewardConfig.chapter.icon}
                    alt={rewardConfig.chapter.title}
                    className="relative z-10 h-28 w-28 object-contain drop-shadow-[0_16px_24px_rgba(0,0,0,0.28)]"
                    loading="lazy"
                  />
                </div>
                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-calm-accent/30 bg-white/70 px-3 py-1 text-xs text-calm-text">
                  <span className="h-2 w-2 rounded-full bg-[#d4af37]" />
                  Chapter Reward
                </div>
                <p className="text-sm text-calm-text mt-2">{rewardConfig.chapter.title}</p>
              </div>
              <div className={`text-center ${isLastChapter ? '' : 'opacity-40'}`}>
                <div className="relative mx-auto h-28 w-28">
                  <div className="absolute inset-0 rounded-full bg-[#f5c15d]/20 blur-xl" />
                  <div className="absolute -bottom-2 left-1/2 h-5 w-20 -translate-x-1/2 rounded-full bg-calm-text/20 blur-sm" />
                  <img
                    src={rewardConfig.story.icon}
                    alt={rewardConfig.story.title}
                    className="relative z-10 h-28 w-28 object-contain drop-shadow-[0_16px_24px_rgba(0,0,0,0.28)]"
                    loading="lazy"
                  />
                </div>
                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-calm-accent/30 bg-white/70 px-3 py-1 text-xs text-calm-text">
                  <span className="h-2 w-2 rounded-full bg-[#f5b942]" />
                  Story Reward
                </div>
                <p className="text-sm text-calm-text mt-2">{rewardConfig.story.title}</p>
              </div>
              <div className={`text-center ${isLastChapter ? '' : 'opacity-40'}`}>
                <div className="relative mx-auto h-28 w-28">
                  <div className="absolute inset-0 rounded-full bg-[#8ab6ff]/20 blur-xl" />
                  <div className="absolute -bottom-2 left-1/2 h-5 w-20 -translate-x-1/2 rounded-full bg-calm-text/20 blur-sm" />
                  <img
                    src={rewardConfig.book.icon}
                    alt={rewardConfig.book.title}
                    className="relative z-10 h-28 w-28 object-contain drop-shadow-[0_16px_24px_rgba(0,0,0,0.28)]"
                    loading="lazy"
                  />
                </div>
                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-calm-accent/30 bg-white/70 px-3 py-1 text-xs text-calm-text">
                  <span className="h-2 w-2 rounded-full bg-[#7aa9ff]" />
                  Book Reward
                </div>
                <p className="text-sm text-calm-text mt-2">{rewardConfig.book.title}</p>
              </div>
            </div>

            {!showArtifact ? (
              <div className="text-center pt-2">
                <button
                  onClick={() => setShowArtifact(true)}
                  className="px-10 py-3 bg-calm-accent text-white rounded-lg text-lg hover:bg-opacity-90 transition-all"
                >
                  Reveal Artifact
                </button>
              </div>
            ) : (
              <div className="bg-calm-accent bg-opacity-10 rounded-lg p-6 text-center">
                <div className="w-full max-w-xl mx-auto overflow-hidden rounded-lg border border-calm-accent/30 bg-white">
                  <img
                    src={normalizeArtifactUrl(chapter.artifact.url)}
                    alt={chapter.artifact.caption}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = '/artifacts/fallback.svg'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Continue button */}
            <div className="text-center pt-4">
              <button
                onClick={handleContinue}
                className="px-12 py-4 bg-calm-accent text-white rounded-lg text-lg hover:bg-opacity-90 transition-all"
              >
                {isLastChapter ? 'View Journal' : 'Next Chapter'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
