'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function BookCard({ story }) {
  const [completedChapters, setCompletedChapters] = useState(0)

  useEffect(() => {
    const progress = JSON.parse(localStorage.getItem('narratai-progress') || '{}')
    const storyProgress = progress[story.id]
    if (storyProgress?.completedChapters) {
      setCompletedChapters(storyProgress.completedChapters.length)
    }
  }, [story.id])

  const progressPercent = story.chapterCount > 0
    ? (completedChapters / story.chapterCount) * 100
    : 0

  return (
    <Link
      href={`/solo/${story.id}`}
      className="block rounded-lg overflow-hidden border border-calm-accent/20 hover:border-calm-accent/50 hover:shadow-md transition-all bg-white"
    >
      <div
        className="h-40 bg-calm-accent/10 bg-cover bg-center"
        style={story.coverImage ? { backgroundImage: `url(${story.coverImage})` } : {}}
      />
      <div className="p-5">
        <h3 className="text-xl font-serif text-calm-text mb-1">
          {story.title}
        </h3>
        <p className="text-sm text-calm-accent mb-3">
          by {story.author}
        </p>
        <p className="text-calm-text/70 text-sm mb-4">
          {story.description}
        </p>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-calm-accent">
            <span>{completedChapters} / {story.chapterCount} chapters</span>
            {completedChapters === story.chapterCount && story.chapterCount > 0 && (
              <span className="text-green-600">Complete</span>
            )}
          </div>
          <div className="h-2 bg-calm-accent/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-calm-accent rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}
