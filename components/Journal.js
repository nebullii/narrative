'use client'

import { useState, useEffect, useRef } from 'react'
import { getAllRecordings, clearAllRecordings } from '@/lib/audioStorage'

export default function Journal({ progress }) {
  const [recordings, setRecordings] = useState([])
  const [currentAudioUrl, setCurrentAudioUrl] = useState(null)
  const [playing, setPlaying] = useState(null)
  const audioRef = useRef(null)

  useEffect(() => {
    getAllRecordings().then(recs => {
      console.log('Loaded recordings:', recs.map(r => ({ key: r.key, type: r.blob?.type, size: r.blob?.size })))
      setRecordings(recs)
    }).catch(console.error)
  }, [])

  useEffect(() => {
    return () => {
      if (currentAudioUrl) {
        URL.revokeObjectURL(currentAudioUrl)
      }
    }
  }, [currentAudioUrl])

  const playRecording = (recording) => {
    // Stop current playback
    if (audioRef.current) {
      audioRef.current.pause()
    }
    if (currentAudioUrl) {
      URL.revokeObjectURL(currentAudioUrl)
    }

    if (playing === recording.key) {
      setPlaying(null)
      setCurrentAudioUrl(null)
      return
    }

    if (!recording.blob || recording.blob.size === 0) {
      alert('This recording is empty or corrupted')
      return
    }

    console.log('Playing recording:', recording.key, 'type:', recording.blob.type, 'size:', recording.blob.size)

    const url = URL.createObjectURL(recording.blob)
    setCurrentAudioUrl(url)
    setPlaying(recording.key)

    // Play after state update
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(err => {
          console.error('Playback failed:', err)
          alert('Could not play this recording. It may be corrupted.')
        })
      }
    }, 100)
  }

  const downloadRecording = (recording) => {
    if (!recording.blob || recording.blob.size === 0) {
      alert('This recording is empty or corrupted')
      return
    }

    console.log('Downloading:', recording.key, 'type:', recording.blob.type, 'size:', recording.blob.size)

    // Create a new blob with explicit audio type
    const type = recording.blob.type || 'audio/webm'
    const blob = new Blob([recording.blob], { type })

    // Get appropriate file extension based on mime type
    const getExtension = (mimeType) => {
      if (mimeType.includes('mp4')) return 'm4a'
      if (mimeType.includes('ogg')) return 'ogg'
      if (mimeType.includes('mpeg')) return 'mp3'
      return 'webm'
    }

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = `${recording.key}.${getExtension(type)}`
    document.body.appendChild(a)
    a.click()

    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 100)
  }

  const handleClearAll = async () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    if (currentAudioUrl) {
      URL.revokeObjectURL(currentAudioUrl)
    }
    setCurrentAudioUrl(null)
    setPlaying(null)
    await clearAllRecordings()
    setRecordings([])
  }

  const normalizeArtifactUrl = (url) => {
    return url?.replace('.jpg', '.svg') || url
  }

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
    ([, storyProgress]) => storyProgress.artifacts?.length > 0
  )

  return (
    <div className="space-y-10">
      {/* Hidden audio element for playback */}
      <audio
        ref={audioRef}
        src={currentAudioUrl}
        onEnded={() => setPlaying(null)}
        onError={(e) => console.error('Audio error:', e)}
      />

      {recordings.length > 0 && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-calm-accent">Recordings</p>
              <h2 className="text-xl md:text-3xl font-['Cormorant_Garamond'] font-semibold text-calm-text">
                Your Story Recordings
              </h2>
            </div>
            <button
              onClick={handleClearAll}
              className="rounded-full border border-red-400 px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-xs uppercase tracking-[0.15em] md:tracking-[0.25em] text-red-500 transition-all hover:bg-red-500 hover:text-white"
            >
              Clear all
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {recordings.map((recording) => {
              const info = parseKey(recording.key)
              const isPlaying = playing === recording.key
              const blob = recording.blob
              const sizeKB = blob ? Math.round(blob.size / 1024) : 0
              const isAudio = blob?.type?.includes('audio')

              return (
                <div
                  key={recording.key}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border px-3 py-3 md:px-4 ${
                    isAudio ? 'border-calm-accent/30 bg-white/70' : 'border-red-300 bg-red-50'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-calm-text text-sm md:text-base truncate">
                      Chapter {info.chapter}
                      {info.paragraph ? `, Paragraph ${info.paragraph}` : ''}
                    </p>
                    <p className="text-[10px] md:text-xs text-calm-text/50 truncate">
                      {info.story} · {sizeKB} KB
                    </p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => playRecording(recording)}
                      className={`flex-1 sm:flex-none px-4 py-2 rounded-full text-xs ${
                        isPlaying
                          ? 'bg-player text-white'
                          : 'border border-calm-accent/40 text-calm-accent hover:bg-calm-accent hover:text-white'
                      }`}
                    >
                      {isPlaying ? 'Stop' : 'Play'}
                    </button>
                    <button
                      onClick={() => downloadRecording(recording)}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-full border border-calm-accent/40 text-xs text-calm-accent hover:bg-calm-accent hover:text-white"
                    >
                      Download
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {recordings.length === 0 && (
        <div className="rounded-2xl border border-dashed border-calm-accent/60 bg-white/60 p-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-calm-accent">No recordings yet</p>
          <p className="mt-3 text-calm-text/70">
            Record yourself reading stories and download them to share with your kids.
          </p>
        </div>
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
    </div>
  )
}
