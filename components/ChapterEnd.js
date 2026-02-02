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
    <main className="min-h-screen flex items-center justify-center px-3 py-6 md:px-4 md:py-12 bg-[radial-gradient(circle_at_top,#f9efe1_0%,#f2e5d5_55%,#e9d9c5_100%)]">
      <div className="w-full space-y-6 md:space-y-8 rounded-2xl md:rounded-3xl border border-calm-accent/40 bg-white/80 p-5 md:p-8 shadow-[0_30px_70px_-55px_rgba(43,26,18,0.6)] backdrop-blur">
        {/* Chapter complete message */}
        <div className="text-center space-y-2 md:space-y-4">
          <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-calm-accent">Great Reading</p>
          <h2 className="text-2xl md:text-4xl font-['Cormorant_Garamond'] font-semibold text-calm-text">
            Chapter Complete
          </h2>
          <p className="text-sm md:text-base text-calm-text/70">
            Your recording is saved and ready to download
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
              className="h-full rounded-full bg-gradient-to-r from-calm-accent via-[#d2b15c] to-[#f0d28c]"
              style={{ width: `${((currentChapterIndex + 1) / totalChapters) * 100}%` }}
            />
          </div>
        </div>

        {!showRewards ? (
          <div className="text-center py-8 md:py-12">
            <button
              onClick={() => setShowRewards(true)}
              className="px-8 py-3 md:px-12 md:py-4 rounded-full bg-calm-accent text-white text-base md:text-lg uppercase tracking-[0.2em] md:tracking-[0.25em] hover:bg-opacity-90 transition-all"
            >
              Reveal Reward
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {earnedAchievements.length > 0 && (
              <div className="bg-white/90 border border-calm-accent/30 rounded-2xl p-4">
                <h3 className="text-lg font-['Cormorant_Garamond'] font-semibold text-calm-text mb-3">New Achievements</h3>
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
            <div className="grid grid-cols-3 gap-4 md:gap-8">
              <div className="text-center">
                <div className="relative mx-auto h-16 w-16 md:h-28 md:w-28">
                  <div className="absolute inset-0 rounded-full bg-calm-accent/10 blur-xl" />
                  <img
                    src={rewardConfig.chapter.icon}
                    alt={rewardConfig.chapter.title}
                    className="relative z-10 h-16 w-16 md:h-28 md:w-28 object-contain drop-shadow-[0_16px_24px_rgba(0,0,0,0.28)]"
                    loading="lazy"
                  />
                </div>
                <div className="mt-2 md:mt-3 inline-flex items-center gap-1 md:gap-2 rounded-full border border-calm-accent/30 bg-white/70 px-2 py-0.5 md:px-3 md:py-1 text-[9px] md:text-xs text-calm-text">
                  <span className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-[#d4af37]" />
                  Chapter
                </div>
              </div>
              <div className={`text-center ${isLastChapter ? '' : 'opacity-40'}`}>
                <div className="relative mx-auto h-16 w-16 md:h-28 md:w-28">
                  <div className="absolute inset-0 rounded-full bg-[#f5c15d]/20 blur-xl" />
                  <img
                    src={rewardConfig.story.icon}
                    alt={rewardConfig.story.title}
                    className="relative z-10 h-16 w-16 md:h-28 md:w-28 object-contain drop-shadow-[0_16px_24px_rgba(0,0,0,0.28)]"
                    loading="lazy"
                  />
                </div>
                <div className="mt-2 md:mt-3 inline-flex items-center gap-1 md:gap-2 rounded-full border border-calm-accent/30 bg-white/70 px-2 py-0.5 md:px-3 md:py-1 text-[9px] md:text-xs text-calm-text">
                  <span className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-[#f5b942]" />
                  Story
                </div>
              </div>
              <div className={`text-center ${isLastChapter ? '' : 'opacity-40'}`}>
                <div className="relative mx-auto h-16 w-16 md:h-28 md:w-28">
                  <div className="absolute inset-0 rounded-full bg-[#8ab6ff]/20 blur-xl" />
                  <img
                    src={rewardConfig.book.icon}
                    alt={rewardConfig.book.title}
                    className="relative z-10 h-16 w-16 md:h-28 md:w-28 object-contain drop-shadow-[0_16px_24px_rgba(0,0,0,0.28)]"
                    loading="lazy"
                  />
                </div>
                <div className="mt-2 md:mt-3 inline-flex items-center gap-1 md:gap-2 rounded-full border border-calm-accent/30 bg-white/70 px-2 py-0.5 md:px-3 md:py-1 text-[9px] md:text-xs text-calm-text">
                  <span className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-[#7aa9ff]" />
                  Book
                </div>
              </div>
            </div>

            {!showArtifact ? (
              <div className="text-center pt-2">
                <button
                  onClick={() => setShowArtifact(true)}
                  className="px-6 py-2.5 md:px-10 md:py-3 rounded-full bg-calm-accent text-white text-sm md:text-lg uppercase tracking-[0.15em] md:tracking-[0.22em] hover:bg-opacity-90 transition-all"
                >
                  Reveal Artifact
                </button>
              </div>
            ) : (
              <div className="bg-calm-accent bg-opacity-10 rounded-xl md:rounded-2xl p-3 md:p-6 text-center">
                <div className="w-full overflow-hidden rounded-xl md:rounded-2xl border border-calm-accent/30 bg-white">
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
            <div className="text-center pt-2 md:pt-4">
              <button
                onClick={handleContinue}
                className="px-8 py-3 md:px-12 md:py-4 rounded-full bg-calm-accent text-white text-base md:text-lg uppercase tracking-[0.2em] md:tracking-[0.25em] hover:bg-opacity-90 transition-all"
              >
                {isLastChapter ? 'View Recordings' : 'Next Chapter'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
