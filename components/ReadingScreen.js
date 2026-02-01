'use client'

import { useState, useRef, useEffect } from 'react'
import { saveAudio, getAudio } from '@/lib/audioStorage'
import { awardAchievement } from '@/lib/achievements'

export default function ReadingScreen({ story, chapter, currentParagraph, currentChapterIndex, totalChapters, onSelectParagraph, onCompleteChapter }) {
  const paragraph = chapter.paragraphs[currentParagraph]
  const audioKey = `${story.id}-ch${chapter.id}`

  // States
  const [started, setStarted] = useState(false)
  const [textVisible, setTextVisible] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [hasRecording, setHasRecording] = useState(false)
  const [recordingError, setRecordingError] = useState('')
  const [micReady, setMicReady] = useState(false)
  const [mode, setMode] = useState('solo')
  const [readerNames, setReaderNames] = useState({ 1: 'Reader 1', 2: 'Reader 2' })
  const [activeReader, setActiveReader] = useState(1)
  const [includeBackground, setIncludeBackground] = useState(true)
  const [aiBackgroundEnabled, setAiBackgroundEnabled] = useState(false)
  const [resolvedBackgroundUrl, setResolvedBackgroundUrl] = useState(null)
  const [toasts, setToasts] = useState([])

  // Refs
  const ambientRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const streamRef = useRef(null)
  const audioContextRef = useRef(null)
  const micSourceRef = useRef(null)
  const ambientSourceRef = useRef(null)
  const destinationRef = useRef(null)
  const micGainRef = useRef(null)
  const ambientGainRef = useRef(null)
  const isMountedRef = useRef(true)

  // Check for existing recording
  useEffect(() => {
    getAudio(audioKey).then(audio => setHasRecording(!!audio)).catch(() => {})
  }, [audioKey])

  // Fade in text after starting
  useEffect(() => {
    if (started) {
      const timer = setTimeout(() => setTextVisible(true), 100)
      return () => clearTimeout(timer)
    }
  }, [started, currentParagraph])

  // Reset text visibility on paragraph change
  useEffect(() => {
    setTextVisible(false)
    const timer = setTimeout(() => setTextVisible(true), 100)
    return () => clearTimeout(timer)
  }, [currentParagraph])
  
  useEffect(() => {
    setRecordingError('')
  }, [currentParagraph])

  useEffect(() => {
    return () => {
      isMountedRef.current = false
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop()
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [isRecording])

  // Ensure ambient audio continues across chapter changes
  useEffect(() => {
    if (!started || !ambientRef.current) return
    ambientRef.current.volume = 0.25
    ambientRef.current.play().catch(() => {})
  }, [started, chapter.ambientAudio])

  const ensureMicPermission = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setRecordingError('Microphone access is not supported in this browser.')
      return false
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop())
      setMicReady(true)
      return true
    } catch (error) {
      setRecordingError('Microphone permission denied. Please allow access and try again.')
      return false
    }
  }

  const enterStory = async () => {
    setStarted(true)
    setRecordingError('')
    if (!micReady) {
      await ensureMicPermission()
    }
    if (ambientRef.current) {
      ambientRef.current.volume = 0.25
      ambientRef.current.play().catch(() => {})
    }
  }

  const startRecording = async () => {
    if (isRecording) return
    try {
      if (!window.MediaRecorder) {
        setRecordingError('Recording is not supported in this browser.')
        return
      }
      if (!micReady) {
        const ok = await ensureMicPermission()
        if (!ok) return
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 48000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })
      streamRef.current = stream

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      }
      const audioContext = audioContextRef.current
      await audioContext.resume()

      destinationRef.current = audioContext.createMediaStreamDestination()
      micSourceRef.current = audioContext.createMediaStreamSource(stream)
      micGainRef.current = audioContext.createGain()
      micGainRef.current.gain.value = 1
      micSourceRef.current.connect(micGainRef.current)
      micGainRef.current.connect(destinationRef.current)

      if (includeBackground && ambientRef.current) {
        try {
          ambientRef.current.play().catch(() => {})
          if (!ambientSourceRef.current) {
            ambientSourceRef.current = audioContext.createMediaElementSource(ambientRef.current)
          }
          ambientGainRef.current = audioContext.createGain()
          ambientGainRef.current.gain.value = 0.6
          ambientSourceRef.current.connect(ambientGainRef.current)
          ambientGainRef.current.connect(destinationRef.current)
        } catch (error) {
          console.warn('Ambient mix error:', error)
        }
      }

      // Try highest quality format available
      let mimeType = 'audio/webm;codecs=opus'
      const formats = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4;codecs=mp4a.40.2'
      ]
      for (const format of formats) {
        if (MediaRecorder.isTypeSupported(format)) {
          mimeType = format
          break
        }
      }

      const mediaRecorder = new MediaRecorder(destinationRef.current.stream, {
        mimeType,
        audioBitsPerSecond: 192000
      })

      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: mimeType })
        await saveAudio(audioKey, blob)
        if (isMountedRef.current) {
          setHasRecording(true)
          setRecordingError('')
          const earned = awardAchievement('first_recording')
          if (earned) {
            const toastId = `${earned.id}-${Date.now()}`
            setToasts((prev) => [...prev, { ...earned, toastId }])
            setTimeout(() => {
              setToasts((prev) => prev.filter((t) => t.toastId !== toastId))
            }, 2800)
          }
        }
        if (micSourceRef.current) micSourceRef.current.disconnect()
        if (micGainRef.current) micGainRef.current.disconnect()
        if (ambientGainRef.current) ambientGainRef.current.disconnect()
        if (ambientSourceRef.current) ambientSourceRef.current.disconnect()
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Microphone error:', error)
      setRecordingError('Could not start recording. Check mic permission and try again.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleContinue = () => {
    setTextVisible(false)
    setTimeout(() => {
      setHasRecording(false)
      onCompleteChapter()
    }, 300)
  }

  // Generate background URL from keywords or use provided image
  const getBackgroundUrl = () => {
    if (chapter.backgroundImage) return chapter.backgroundImage
    if (story.coverImage) return story.coverImage
    if (chapter.backgroundKeywords) {
      const keywords = chapter.backgroundKeywords.split(' ').join(',')
      return `https://source.unsplash.com/1920x1080/?${keywords}`
    }
    return null
  }

  useEffect(() => {
    const loadAiBackground = async () => {
      if (!aiBackgroundEnabled) {
        setResolvedBackgroundUrl(null)
        return
      }
      const cacheKey = `narratai-bg-${story.id}-ch${chapter.id}`
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        setResolvedBackgroundUrl(cached)
        return
      }
      try {
        const res = await fetch('/api/background', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            storyId: story.id,
            chapterId: chapter.id,
            title: chapter.title,
            description: story.description,
            keywords: chapter.backgroundKeywords
          })
        })
        if (!res.ok) throw new Error('Background request failed')
        const data = await res.json()
        if (data?.url) {
          localStorage.setItem(cacheKey, data.url)
          setResolvedBackgroundUrl(data.url)
        }
      } catch (error) {
        console.warn('AI background error:', error)
        setResolvedBackgroundUrl(null)
      }
    }
    loadAiBackground()
  }, [aiBackgroundEnabled, story.id, chapter.id, chapter.title, chapter.backgroundKeywords, story.description])

  const backgroundUrl = resolvedBackgroundUrl || getBackgroundUrl()
  const backgroundStyle = backgroundUrl ? {
    backgroundImage: `url(${backgroundUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  } : {}

  return (
    <main
      className={`min-h-screen flex flex-col relative ${
        started ? '' : 'items-center justify-center cursor-pointer'
      }`}
      style={backgroundStyle}
      onClick={!started ? enterStory : undefined}
    >
      <div className={`absolute inset-0 ${started ? 'bg-black/50' : 'bg-black/60'}`} />

      {toasts.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {toasts.map((toast) => (
            <div
              key={toast.toastId}
              className="flex items-center gap-3 bg-white/90 text-calm-text border border-calm-accent/30 rounded-lg px-4 py-3 shadow-lg"
            >
              <img src={toast.icon} alt={toast.title} className="w-10 h-10" />
              <div>
                <p className="text-sm font-medium">{toast.title}</p>
                <p className="text-xs text-calm-accent">{toast.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {chapter.ambientAudio && (
        <audio ref={ambientRef} src={chapter.ambientAudio} loop preload="auto" />
      )}

      {!started ? (
        <div
          className="relative z-10 text-center space-y-6 px-8 w-full max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <h1 className="text-4xl font-serif text-white">{chapter.title}</h1>
          <p className="text-white/60 text-lg">{story.title}</p>
          <div className="pt-4 space-y-4 text-left">
            <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
              <span className="text-white/80 text-sm">Mode</span>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setMode('solo')
                  }}
                  className={`px-3 py-1 rounded-full text-xs ${
                    mode === 'solo' ? 'bg-white text-black' : 'bg-white/10 text-white/70'
                  }`}
                >
                  Solo
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setMode('duo')
                  }}
                  className={`px-3 py-1 rounded-full text-xs ${
                    mode === 'duo' ? 'bg-white text-black' : 'bg-white/10 text-white/70'
                  }`}
                >
                  Two readers
                </button>
              </div>
            </div>

            {mode === 'duo' && (
              <div className="space-y-3">
                <div className="flex flex-col gap-2">
                  <label className="text-white/70 text-xs">Reader 1 name</label>
                  <input
                    value={readerNames[1]}
                    onChange={(e) => setReaderNames({ ...readerNames, 1: e.target.value })}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder:text-white/40"
                    placeholder="Reader 1"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-white/70 text-xs">Reader 2 name</label>
                  <input
                    value={readerNames[2]}
                    onChange={(e) => setReaderNames({ ...readerNames, 2: e.target.value })}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder:text-white/40"
                    placeholder="Reader 2"
                  />
                </div>
              </div>
            )}
            <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
              <span className="text-white/80 text-sm">AI background</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setAiBackgroundEnabled(!aiBackgroundEnabled)
                }}
                className={`px-3 py-1 rounded-full text-xs ${
                  aiBackgroundEnabled ? 'bg-white text-black' : 'bg-white/10 text-white/70'
                }`}
              >
                {aiBackgroundEnabled ? 'On' : 'Off'}
              </button>
            </div>
          </div>
          <div className="pt-8 flex flex-col items-center gap-3">
            <button
              onClick={enterStory}
              className="w-16 h-16 border-2 border-white/40 rounded-full flex items-center justify-center animate-pulse"
            >
              <span className="text-white/80 text-2xl">▶</span>
            </button>
            <button
              onClick={enterStory}
              className="text-white/70 text-sm underline underline-offset-4"
            >
              begin
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Progress */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-11/12 max-w-xl space-y-2">
            <div className="flex items-center justify-between text-xs text-white/70">
              <span>Chapter</span>
              <span>{currentParagraph + 1} / {chapter.paragraphs.length}</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/80 rounded-full transition-all"
                style={{ width: `${((currentParagraph + 1) / chapter.paragraphs.length) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-white/70">
              <span>Book</span>
              <span>{currentChapterIndex + 1} / {totalChapters}</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/80 rounded-full transition-all"
                style={{ width: `${((currentChapterIndex + 1) / totalChapters) * 100}%` }}
              />
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 relative z-10">
            <div className="w-full max-w-2xl space-y-4">
              {chapter.paragraphs.map((item, index) => {
                const isActive = index === currentParagraph
                const canRead = mode !== 'duo' || !item.reader || item.reader === activeReader
                return (
                  <button
                    key={item.id || index}
                    onClick={() => onSelectParagraph(index)}
                    className={`w-full text-left rounded-2xl border transition-all ${
                      isActive
                        ? 'border-white/70 bg-white/20'
                        : 'border-white/20 bg-white/10 hover:bg-white/15'
                    }`}
                  >
                    <div className="p-5 md:p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-white/60">Line {index + 1}</span>
                          {mode === 'duo' && item.reader && (
                            <span className="text-xs px-2 py-1 rounded-full bg-white/20 text-white">
                              {readerNames[item.reader] || `Reader ${item.reader}`}
                            </span>
                          )}
                        </div>
                        {!canRead && (
                          <span className="text-xs text-white/50">Other reader</span>
                        )}
                      </div>
                      <p className={`text-lg md:text-xl leading-relaxed font-serif ${isActive ? 'text-white' : 'text-white/80'}`}>
                        {item.text}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Bottom controls */}
          <div className="relative z-10 pb-12 flex flex-col items-center gap-6">
            {mode === 'duo' && (
              <div className="flex items-center gap-3 text-white/70 text-sm">
                <span>Active:</span>
                <button
                  onClick={() => setActiveReader(1)}
                  className={`px-3 py-1 rounded-full ${
                    activeReader === 1 ? 'bg-white text-black' : 'bg-white/10'
                  }`}
                >
                  {readerNames[1] || 'Reader 1'}
                </button>
                <button
                  onClick={() => setActiveReader(2)}
                  className={`px-3 py-1 rounded-full ${
                    activeReader === 2 ? 'bg-white text-black' : 'bg-white/10'
                  }`}
                >
                  {readerNames[2] || 'Reader 2'}
                </button>
              </div>
            )}
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <span>Include background in recording</span>
              <button
                onClick={() => setIncludeBackground(!includeBackground)}
                className={`px-3 py-1 rounded-full text-xs ${
                  includeBackground ? 'bg-white text-black' : 'bg-white/10'
                }`}
              >
                {includeBackground ? 'On' : 'Off'}
              </button>
            </div>
            {/* Recording button */}
            <button
              onClick={() => (isRecording ? stopRecording() : startRecording())}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                isRecording
                  ? 'bg-red-500 scale-110'
                  : hasRecording
                  ? 'bg-green-500/80'
                  : 'bg-white/20 backdrop-blur-sm border-2 border-white/40'
              }`}
            >
              {isRecording ? (
                <div className="w-6 h-6 bg-white rounded-sm animate-pulse" />
              ) : hasRecording ? (
                <span className="text-white text-2xl">✓</span>
              ) : (
                <span className="text-white text-3xl">🎙</span>
              )}
            </button>

            <p className="text-white/50 text-sm">
              {isRecording ? 'recording...' : hasRecording ? 'recorded' : 'tap to record'}
            </p>

            {mode === 'duo' && paragraph.reader && paragraph.reader !== activeReader && (
              <p className="text-white/50 text-xs text-center max-w-xs">
                This line is for {readerNames[paragraph.reader] || `Reader ${paragraph.reader}`}.
              </p>
            )}

            {recordingError && (
              <p className="text-red-200 text-xs text-center max-w-xs">{recordingError}</p>
            )}

            {/* Continue button */}
            {hasRecording && (
              <button
                onClick={handleContinue}
                className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white rounded-full border border-white/30 hover:bg-white/30 transition-all"
              >
                {currentParagraph < chapter.paragraphs.length - 1 ? 'continue' : 'finish chapter'}
              </button>
            )}
          </div>
        </>
      )}
    </main>
  )
}
