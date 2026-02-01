'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Journal from '@/components/Journal'

export default function JournalPage() {
  const [progress, setProgress] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('narratai-progress')
    if (saved) {
      setProgress(JSON.parse(saved))
    }
  }, [])

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif text-calm-text">Your Journal</h1>
          <Link
            href="/"
            className="px-6 py-2 border-2 border-calm-accent text-calm-accent rounded-lg hover:bg-calm-accent hover:text-white transition-all"
          >
            Home
          </Link>
        </div>

        {!progress || Object.keys(progress).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-calm-accent text-lg mb-6">
              Your journal is empty. Start reading to collect artifacts and memories.
            </p>
            <Link
              href="/solo/secret-garden"
              className="inline-block px-8 py-4 bg-calm-accent text-white rounded-lg hover:bg-opacity-90 transition-all"
            >
              Begin Your Journey
            </Link>
          </div>
        ) : (
          <Journal progress={progress} />
        )}
      </div>
    </main>
  )
}
