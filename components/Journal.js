'use client'

import { useState, useEffect, useRef } from 'react'
import { getAllRecordings, clearAllRecordings } from '@/lib/audioStorage'

export default function Journal({ progress }) {
  const [recordings, setRecordings] = useState([])
  const [playing, setPlaying] = useState(null)
  const audioRef = useRef(null)
  const audioUrlRef = useRef(null)

  useEffect(() => {
    getAllRecordings().then(setRecordings).catch(console.error)
  }, [])

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current)
      audioUrlRef.current = null
    }
  }

  useEffect(() => {
    return () => stopPlayback()
  }, [])

  const playRecording = (recording) => {
    if (playing === recording.key) {
      stopPlayback()
      setPlaying(null)
      return
    }

    stopPlayback()
    const url = URL.createObjectURL(recording.blob)
    audioUrlRef.current = url
    const audio = new Audio(url)
    audioRef.current = audio
    audio.onended = () => {
      setPlaying(null)
      stopPlayback()
    }
    audio.play()
    setPlaying(recording.key)
  }
  const normalizeArtifactUrl = (url) => {
    // Convert jpg references to svg if needed
    return url?.replace('.jpg', '.svg') || url
  }

  // Parse recording key like "secret-garden-ch1-p1"
  const parseKey = (key) => {
    const parts = key.split('-ch')
    if (parts.length < 2) return { story: key, chapter: '?', paragraph: '?' }
    const storyId = parts[0]
    const rest = parts[1].split('-')
    const paragraphRaw = rest[1]
    return {
      story: storyId,
      chapter: rest[0],
      paragraph: paragraphRaw ? paragraphRaw.replace('p', '') : null
    }
  }

  const storiesWithArtifacts = Object.entries(progress).filter(
    ([, storyProgress]) => storyProgress.artifacts.length > 0
  )

  return (
    <div className="space-y-10">
      {recordings.length > 0 && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-calm-accent">Recordings</p>
              <h2 className="text-2xl md:text-3xl font-['Cormorant_Garamond'] font-semibold text-calm-text">
                Your Audio Notes
              </h2>
            </div>
            <button
              onClick={async () => {
                stopPlayback()
                await clearAllRecordings()
                setRecordings([])
              }}
              className="rounded-full border border-calm-accent/50 px-4 py-2 text-xs uppercase tracking-[0.25em] text-calm-accent transition-all hover:bg-calm-accent hover:text-white"
            >
              Clear all
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recordings.map((recording) => {
              const info = parseKey(recording.key)
              const isPlaying = playing === recording.key
              return (
                <button
                  key={recording.key}
                  onClick={() => playRecording(recording)}
                  className="flex items-center justify-between gap-4 rounded-xl border border-calm-accent/30 bg-white/70 px-4 py-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-24px_rgba(58,53,50,0.45)]"
                >
                  <div>
                    <p className="font-medium text-calm-text">
                      Chapter {info.chapter}
                      {info.paragraph ? `, Paragraph ${info.paragraph}` : ' (Full Chapter)'}
                    </p>
                    <p className="text-xs uppercase tracking-[0.25em] text-calm-text/50">
                      {info.story}
                    </p>
                  </div>
                  <span className={`text-lg ${isPlaying ? 'text-player' : 'text-calm-accent'}`}>
                    {isPlaying ? '⏸️' : '▶️'}
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {storiesWithArtifacts.map(([storyId, storyProgress]) => (
        <section key={storyId} className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-calm-accent">Artifacts</p>
            <h2 className="text-2xl md:text-3xl font-['Cormorant_Garamond'] font-semibold text-calm-text">
              {storyProgress.title || storyId}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {storyProgress.artifacts.map((artifact, index) => {
              const rotations = [-4, 3, -2, 5, -3, 2]
              const tilt = rotations[index % rotations.length]
              return (
                <div
                  key={index}
                  className="relative"
                  style={{ transform: `rotate(${tilt}deg)` }}
                >
                  <div className="rounded-[26px] bg-white p-[6px] shadow-[0_18px_30px_-14px_rgba(58,53,50,0.55)] ring-1 ring-black/5 transition-transform hover:-translate-y-1 hover:rotate-0">
                    <div className="rounded-[22px] bg-white p-[3px] ring-1 ring-black/5">
                      <div className="overflow-hidden rounded-[18px] bg-white">
                        <img
                          src={normalizeArtifactUrl(artifact.url)}
                          alt={artifact.caption}
                          className="h-28 w-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = '/artifacts/fallback.svg'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      ))}

      {storiesWithArtifacts.length === 0 && (
        <div className="rounded-2xl border border-dashed border-calm-accent/60 bg-white/60 p-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-calm-accent">No artifacts yet</p>
          <p className="mt-3 text-calm-text/70">
            Start reading to collect your first artifact.
          </p>
        </div>
      )}
    </div>
  )
}
