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
    <main className="relative min-h-screen overflow-hidden px-3 py-6 md:px-6 md:py-10 bg-[radial-gradient(circle_at_top,#f9efe1_0%,#f2e5d5_55%,#e9d9c5_100%)]">
      <div className="pointer-events-none absolute -top-24 right-[-10%] h-72 w-72 rounded-full bg-[radial-gradient(circle,#f6d8a5_0%,rgba(246,216,165,0)_70%)] opacity-70" />
      <div className="pointer-events-none absolute -bottom-32 left-[-8%] h-80 w-80 rounded-full bg-[radial-gradient(circle,#c1d7d2_0%,rgba(193,215,210,0)_70%)] opacity-70" />

      <div className="relative w-full font-['Space_Grotesk'] text-calm-text">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-calm-accent/40 bg-white/75 p-4 md:p-6 shadow-[0_20px_50px_-30px_rgba(43,26,18,0.5)] backdrop-blur">
          <div className="space-y-1 md:space-y-2">
            <p className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-calm-accent">Your Recordings</p>
            <h1 className="text-3xl md:text-5xl font-['Cormorant_Garamond'] font-semibold">
              Story Library
            </h1>
            <p className="text-sm text-calm-text/70">
              Your recorded stories ready to download and share with loved ones.
            </p>
          </div>
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full border border-calm-accent/70 bg-white px-4 py-2 text-xs md:text-sm font-medium uppercase tracking-[0.15em] md:tracking-[0.2em] text-calm-accent transition-all hover:bg-calm-accent hover:text-white"
          >
            Back Home
            <span className="text-lg transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="mt-4 md:mt-8 rounded-2xl md:rounded-3xl border border-calm-accent/30 bg-white/80 p-4 md:p-8 shadow-[0_30px_80px_-55px_rgba(58,53,50,0.5)] backdrop-blur">
          {!progress || Object.keys(progress).length === 0 ? (
            <div className="grid gap-6 text-center md:text-left">
              <div>
                <h2 className="text-3xl font-['Cormorant_Garamond'] font-semibold">
                  No recordings yet
                </h2>
                <p className="mt-2 text-calm-text/70">
                  Start reading a story and record yourself. Download your recordings to share with family.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
                <Link
                  href="/solo/secret-garden"
                  className="inline-flex items-center gap-3 rounded-full bg-calm-accent px-7 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white transition-transform hover:-translate-y-0.5"
                >
                  Start Recording
                  <span className="text-lg" aria-hidden="true">✦</span>
                </Link>
                <div className="rounded-full border border-calm-accent/40 bg-white px-4 py-2 text-xs uppercase tracking-[0.2em] text-calm-accent">
                  Perfect for bedtime stories
                </div>
              </div>
            </div>
          ) : (
            <Journal progress={progress} />
          )}
        </div>
      </div>
    </main>
  )
}
