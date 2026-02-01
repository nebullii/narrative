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
    <main className="relative min-h-screen overflow-hidden px-4 py-14 bg-[radial-gradient(circle_at_top,#f1e6d5_0%,#f5f3f0_55%,#efe7dc_100%)]">
      <div className="pointer-events-none absolute -top-24 right-[-10%] h-72 w-72 rounded-full bg-[radial-gradient(circle,#f7d9b8_0%,rgba(247,217,184,0)_70%)] opacity-70" />
      <div className="pointer-events-none absolute -bottom-32 left-[-8%] h-80 w-80 rounded-full bg-[radial-gradient(circle,#cddfe0_0%,rgba(205,223,224,0)_70%)] opacity-70" />

      <div className="relative mx-auto max-w-5xl font-['Space_Grotesk'] text-calm-text">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-calm-accent/40 bg-white/70 p-6 shadow-[0_20px_50px_-30px_rgba(58,53,50,0.45)] backdrop-blur">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-calm-accent">Reading Chronicle</p>
            <h1 className="text-4xl md:text-5xl font-['Cormorant_Garamond'] font-semibold">
              Your Journal
            </h1>
            <p className="max-w-xl text-sm text-calm-text/70">
              Gather your recordings, milestones, artifacts, and reflections in one place.
            </p>
          </div>
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full border border-calm-accent/70 bg-white px-5 py-2 text-sm font-medium uppercase tracking-[0.2em] text-calm-accent transition-all hover:bg-calm-accent hover:text-white"
          >
            Back Home
            <span className="text-lg transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="mt-10 rounded-3xl border border-calm-accent/30 bg-white/80 p-6 md:p-10 shadow-[0_30px_80px_-55px_rgba(58,53,50,0.5)] backdrop-blur">
          {!progress || Object.keys(progress).length === 0 ? (
            <div className="grid gap-6 text-center md:text-left">
              <div>
                <h2 className="text-3xl font-['Cormorant_Garamond'] font-semibold">
                  A blank page, ready to be written.
                </h2>
                <p className="mt-2 text-calm-text/70">
                  Your journal grows with every chapter, recording, and reflection you add.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
                <Link
                  href="/solo/secret-garden"
                  className="inline-flex items-center gap-3 rounded-full bg-calm-accent px-7 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white transition-transform hover:-translate-y-0.5"
                >
                  Begin Your Journey
                  <span className="text-lg" aria-hidden="true">✦</span>
                </Link>
                <div className="rounded-full border border-calm-accent/40 bg-white px-4 py-2 text-xs uppercase tracking-[0.2em] text-calm-accent">
                  Tip: read aloud to unlock recordings
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
