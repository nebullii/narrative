'use client'

import { useState, useEffect, useRef } from 'react'
import { getAllRecordings, clearAllRecordings } from '@/lib/audioStorage'
import { getAchievements } from '@/lib/achievements'

export default function Journal({ progress }) {
  const [recordings, setRecordings] = useState([])
  const [playing, setPlaying] = useState(null)
  const audioRef = useRef(null)
  const audioUrlRef = useRef(null)
  const [achievements, setAchievements] = useState([])

  useEffect(() => {
    getAllRecordings().then(setRecordings).catch(console.error)
  }, [])
  
  useEffect(() => {
    setAchievements(getAchievements())
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
    const map = {
      '/artifacts/story-garden.jpg': '/artifacts/story-garden.svg',
      '/artifacts/mary-arrival.jpg': '/artifacts/mary-arrival.svg'
    }
    return map[url] || url
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

  return (
    <div className="space-y-12">
      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-3xl font-serif text-calm-text border-b-2 border-calm-accent pb-2">
            Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="border-2 border-calm-accent rounded-lg p-4 flex items-center gap-4 bg-white"
              >
                <img src={achievement.icon} alt={achievement.title} className="w-14 h-14" />
                <div>
                  <p className="font-medium text-calm-text">{achievement.title}</p>
                  <p className="text-sm text-calm-accent">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audio Recordings Section */}
      {recordings.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4 border-b-2 border-calm-accent pb-2">
            <h2 className="text-3xl font-serif text-calm-text">Your Recordings</h2>
            <button
              onClick={async () => {
                stopPlayback()
                await clearAllRecordings()
                setRecordings([])
              }}
              className="text-sm text-calm-accent underline underline-offset-4"
            >
              Clear all
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recordings.map((recording) => {
              const info = parseKey(recording.key)
              return (
                <button
                  key={recording.key}
                  onClick={() => playRecording(recording)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    playing === recording.key
                      ? 'border-player bg-player/10'
                      : 'border-calm-accent hover:bg-calm-accent/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {playing === recording.key ? '⏸️' : '▶️'}
                    </span>
                    <div>
                      <p className="font-medium text-calm-text">
                        Chapter {info.chapter}{info.paragraph ? `, Paragraph ${info.paragraph}` : ' (Full Chapter)'}
                      </p>
                      <p className="text-sm text-calm-accent">{info.story}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Story Progress */}
      {Object.entries(progress).map(([storyId, storyProgress]) => (
        <div key={storyId} className="space-y-6">
          <h2 className="text-3xl font-serif text-calm-text border-b-2 border-calm-accent pb-2">
            {storyProgress.title || storyId}
          </h2>

          {/* Progress summary */}
          <div className="bg-calm-accent bg-opacity-10 rounded-lg p-6 space-y-1">
            {storyProgress.author && (
              <p className="text-calm-text">
                <span className="font-medium">Author:</span> {storyProgress.author}
              </p>
            )}
            <p className="text-calm-text">
              <span className="font-medium">Chapters completed:</span>{' '}
              {storyProgress.completedChapters.length}
            </p>
            <p className="text-calm-text">
              <span className="font-medium">Artifacts collected:</span>{' '}
              {storyProgress.artifacts.length}
            </p>
          </div>

          {/* Artifacts */}
          {storyProgress.artifacts.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-serif text-calm-text">Collected Artifacts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {storyProgress.artifacts.map((artifact, index) => (
                  <div
                    key={index}
                    className="border-2 border-calm-accent rounded-lg p-6 space-y-3"
                  >
                    <div className="w-full overflow-hidden rounded-lg border border-calm-accent/30 bg-white">
                      <img
                        src={normalizeArtifactUrl(artifact.url)}
                        alt={artifact.caption}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = '/artifacts/story-garden.svg'
                        }}
                      />
                    </div>
                    <p className="text-calm-text italic text-center">
                      {artifact.caption}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reflections */}
          {Object.keys(storyProgress.reflections).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-serif text-calm-text">Your Reflections</h3>
              {Object.entries(storyProgress.reflections).map(([chapterId, reflection]) => (
                <div
                  key={chapterId}
                  className="bg-white border-2 border-calm-accent rounded-lg p-6"
                >
                  <p className="text-sm text-calm-accent mb-2">
                    Chapter {chapterId}
                  </p>
                  <p className="text-calm-text">{reflection}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Empty state */}
      {recordings.length === 0 && Object.keys(progress).length === 0 && achievements.length === 0 && (
        <div className="text-center py-12">
          <p className="text-calm-accent text-lg">No recordings yet. Start reading to create your journal!</p>
        </div>
      )}
    </div>
  )
}
