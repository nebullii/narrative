'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function BookCard({ story }) {
  const [completedChapters, setCompletedChapters] = useState(0)
  const [hasResume, setHasResume] = useState(false)

  useEffect(() => {
    const progress = JSON.parse(localStorage.getItem('narratai-progress') || '{}')
    const storyProgress = progress[story.id]
    if (storyProgress?.completedChapters) {
      setCompletedChapters(storyProgress.completedChapters.length)
    }
    const lastPosition = storyProgress?.lastPosition
    setHasResume(!!lastPosition && (storyProgress?.completedChapters?.length || 0) < story.chapterCount)
  }, [story.id])

  const progressPercent = story.chapterCount > 0
    ? (completedChapters / story.chapterCount) * 100
    : 0

  return (
    <Link
      href={`/solo/${story.id}`}
      className="group relative block overflow-hidden rounded-xl md:rounded-2xl border border-calm-accent/35 bg-white/85 shadow-[0_18px_40px_-30px_rgba(43,26,18,0.6)] transition-all hover:-translate-y-1 hover:border-calm-accent/70 hover:shadow-[0_24px_55px_-35px_rgba(43,26,18,0.7)]"
    >
      {hasResume && (
        <div
          className="absolute -top-1 right-4 md:right-6 h-8 w-6 md:h-10 md:w-8 bg-red-600 shadow-[0_10px_20px_-12px_rgba(120,0,0,0.7)]"
          style={{ clipPath: 'polygon(0 0,100% 0,100% 80%,50% 100%,0 80%)' }}
          aria-hidden="true"
        />
      )}
      <div
        className="relative h-32 md:h-40 bg-calm-accent/10 bg-cover bg-center"
        style={story.coverImage ? { backgroundImage: `url(${story.coverImage})` } : {}}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-black/15 via-transparent to-white/10" />
        <div className="absolute bottom-2 left-3 md:bottom-3 md:left-4 rounded-full bg-white/90 px-2 py-0.5 md:px-3 md:py-1 text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.25em] text-calm-accent">
          {story.chapterCount} chapters
        </div>
      </div>
      <div className="p-3 md:p-5">
        <h3 className="text-lg md:text-xl font-['Cormorant_Garamond'] font-semibold text-calm-text mb-0.5 md:mb-1">
          {story.title}
        </h3>
        <p className="text-xs md:text-sm text-calm-accent mb-2 md:mb-3">
          by {story.author}
        </p>
        <p className="text-calm-text/70 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2">
          {story.description}
        </p>

        <div className="space-y-1.5 md:space-y-2">
          <div className="flex justify-between text-[10px] md:text-xs text-calm-accent">
            <span>{completedChapters} / {story.chapterCount} chapters</span>
            {completedChapters === story.chapterCount && story.chapterCount > 0 && (
              <span className="text-emerald-700">Complete</span>
            )}
          </div>
          <div className="h-1.5 md:h-2 rounded-full overflow-hidden bg-calm-accent/20">
            <div
              className="h-full rounded-full bg-gradient-to-r from-calm-accent via-[#d2b15c] to-[#f0d28c] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}
