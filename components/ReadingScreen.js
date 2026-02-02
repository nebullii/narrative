'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
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
  const [toasts, setToasts] = useState([])
  const [completedChapters, setCompletedChapters] = useState(0)
  // DEBUG STATE
  const [debugLogs, setDebugLogs] = useState([])

  const addLog = (msg) => {
    console.log(msg)
    setDebugLogs(prev => [...prev.slice(-4), msg]) // Keep last 5 logs
  }

  // Refs
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const streamRef = useRef(null)
  const isMountedRef = useRef(true)

  // Check for existing recording
  useEffect(() => {
    getAudio(audioKey).then(audio => setHasRecording(!!audio)).catch(() => { })
  }, [audioKey])

  // Load book progress from localStorage
  useEffect(() => {
    const progress = JSON.parse(localStorage.getItem('narratai-progress') || '{}')
    const storyProgress = progress[story.id]
    if (storyProgress?.completedChapters) {
      setCompletedChapters(storyProgress.completedChapters.length)
    }
  }, [story.id])

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
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])  // Only cleanup on unmount, not on isRecording change


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
      console.error('Mic permission error:', error)
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setRecordingError('Microphone permission denied. Please allow access in browser settings.')
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setRecordingError('No microphone found. Please connect a microphone.')
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        setRecordingError('Microphone is busy or not readable. Try closing other apps using it.')
      } else {
        setRecordingError('Could not access microphone. Please check your system settings.')
      }
      return false
    }
  }

  const enterStory = async () => {
    setStarted(true)
    setRecordingError('')
    if (!micReady) {
      await ensureMicPermission()
    }
  }

  const startRecording = async () => {
    if (isRecording) return
    try {
      if (!window.MediaRecorder) {
        setRecordingError('Recording is not supported in this browser.')
        addLog('MediaRecorder not supported')
        return
      }
      if (!micReady) {
        addLog('Mic not ready, ensuring permission...')
        const ok = await ensureMicPermission()
        if (!ok) {
          addLog('Mic permission failed')
          return
        }
      }

      // Get microphone stream
      addLog('Requesting getUserMedia...')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      addLog('Stream obtained')

      // Find supported mime type - prefer mp4 for better compatibility
      let mimeType = ''
      const formats = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg']
      for (const format of formats) {
        if (MediaRecorder.isTypeSupported(format)) {
          mimeType = format
          break
        }
      }

      addLog(`Starting recording with mimeType: ${mimeType}`)

      // Record directly from microphone stream
      const options = mimeType ? { mimeType } : {}
      const mediaRecorder = new MediaRecorder(stream, options)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        // console.log('Data available:', e.data.size, 'bytes')
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        addLog(`Recording stopped, chunks: ${chunksRef.current.length}`)
        const finalMimeType = mediaRecorder.mimeType || 'audio/webm'
        const blob = new Blob(chunksRef.current, { type: finalMimeType })
        addLog(`Created blob: ${blob.size} bytes, type: ${finalMimeType}`)

        if (blob.size === 0) {
          setRecordingError('Recording failed - no audio captured. Check your microphone.')
          addLog('Error: 0 byte blob')
          stream.getTracks().forEach(track => track.stop())
          return
        }

        if (isMountedRef.current) {
          setHasRecording(true)
          setRecordingError('')
        }
        try {
          addLog('Saving to DB...')
          await saveAudio(audioKey, blob)
          addLog('Audio saved successfully')
        } catch (error) {
          console.error('Save audio failed:', error)
          addLog(`Save failed: ${error.message}`)
        }
        if (isMountedRef.current) {
          const earned = awardAchievement('first_recording')
          if (earned) {
            const toastId = `${earned.id}-${Date.now()}`
            setToasts((prev) => [...prev, { ...earned, toastId }])
            setTimeout(() => {
              setToasts((prev) => prev.filter((t) => t.toastId !== toastId))
            }, 2800)
          }
        }
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.onerror = (e) => {
        console.error('MediaRecorder error:', e)
        setRecordingError('Recording error occurred')
        addLog(`MediaRecorder error: ${e.error?.message || 'Unknown'}`)
      }

      // Start recording - collect data every 500ms for more reliable capture
      mediaRecorder.start(500)
      console.log('MediaRecorder started, state:', mediaRecorder.state)
      setIsRecording(true)
      addLog('Started recording')
    } catch (error) {
      console.error('Microphone error:', error)
      addLog(`Start error: ${error.name} - ${error.message}`)
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setRecordingError('Microphone permission denied.')
      } else if (error.name === 'NotFoundError') {
        setRecordingError('No microphone found.')
      } else {
        setRecordingError('Could not start recording. Check mic permission.')
      }
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      console.log('Stopping recording...')
      // Request any remaining data before stopping
      if (mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.requestData()
      }
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleContinue = () => {
    setTextVisible(false)
    setTimeout(() => {
      if (currentParagraph < chapter.paragraphs.length - 1) {
        // Go to next paragraph
        setHasRecording(false)
        onSelectParagraph(currentParagraph + 1)
      } else {
        // Last paragraph - complete the chapter
        onCompleteChapter()
      }
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

  const backgroundUrl = getBackgroundUrl()
  const backgroundStyle = backgroundUrl ? {
    backgroundImage: `url(${backgroundUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  } : {}

  return (
    <main
      className={`min-h-screen flex flex-col relative ${started ? '' : 'items-center justify-center cursor-pointer'
        }`}
      style={backgroundStyle}
      onClick={!started ? enterStory : undefined}
    >
      <div className={`absolute inset-0 ${started ? 'bg-[#1b0f0b]/65' : 'bg-[#1b0f0b]/75'}`} />

      {/* Home link */}
      <Link
        href="/"
        className="absolute top-3 left-3 md:top-4 md:left-4 z-30 inline-flex items-center gap-1.5 md:gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-xs uppercase tracking-[0.15em] md:tracking-[0.25em] text-white/70 transition-all hover:border-white/50 hover:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <span aria-hidden="true">←</span>
        Home
      </Link>

      {toasts.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {toasts.map((toast) => (
            <div
              key={toast.toastId}
              className="flex items-center gap-3 bg-white/95 text-calm-text border border-calm-accent/40 rounded-2xl px-4 py-3 shadow-[0_16px_40px_-30px_rgba(43,26,18,0.6)]"
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


      {!started ? (
        <div
          className="relative z-10 w-full max-w-lg mx-3 space-y-4 md:space-y-6 rounded-2xl md:rounded-3xl border border-white/10 bg-black/30 px-5 py-6 md:px-8 md:py-10 text-center backdrop-blur"
          onClick={(e) => e.stopPropagation()}
        >
          <h1 className="text-2xl md:text-4xl font-serif text-white">{chapter.title}</h1>
          <p className="text-white/60 text-base md:text-lg">{story.title}</p>

          {/* Book Progress */}
          <div className="w-full space-y-2 pt-2">
            <div className="flex justify-between text-xs text-white/60">
              <span>Book Progress</span>
              <span>{completedChapters} / {totalChapters} chapters</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#b08a3a] via-[#f0d28c] to-[#d2b15c] transition-all"
                style={{ width: `${(completedChapters / totalChapters) * 100}%` }}
              />
            </div>
          </div>

          <div className="pt-4 space-y-4 text-left">
            <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
              <span className="text-white/80 text-sm">Mode</span>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setMode('solo')
                  }}
                  className={`px-3 py-1 rounded-full text-xs ${mode === 'solo' ? 'bg-white text-black' : 'bg-white/10 text-white/70'
                    }`}
                >
                  Solo
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setMode('duo')
                  }}
                  className={`px-3 py-1 rounded-full text-xs ${mode === 'duo' ? 'bg-white text-black' : 'bg-white/10 text-white/70'
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
          </div>
          <div className="pt-8 flex flex-col items-center gap-3">
            <button
              onClick={enterStory}
              className="w-16 h-16 rounded-full border-2 border-[#f0d28c]/70 bg-[#1b0f0b]/40 flex items-center justify-center animate-pulse"
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
          <div className="absolute top-12 md:top-4 left-1/2 -translate-x-1/2 z-20 w-[94%] md:w-11/12 max-w-xl space-y-1.5 md:space-y-2">
            <div className="flex items-center justify-between text-[10px] md:text-xs text-white/70">
              <span>Chapter</span>
              <span>{currentParagraph + 1} / {chapter.paragraphs.length}</span>
            </div>
            <div className="h-1.5 md:h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#b08a3a] via-[#f0d28c] to-[#d2b15c] transition-all"
                style={{ width: `${((currentParagraph + 1) / chapter.paragraphs.length) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] md:text-xs text-white/70">
              <span>Book</span>
              <span>{currentChapterIndex + 1} / {totalChapters}</span>
            </div>
            <div className="h-1.5 md:h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#b08a3a] via-[#f0d28c] to-[#d2b15c] transition-all"
                style={{ width: `${((currentChapterIndex + 1) / totalChapters) * 100}%` }}
              />
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 flex flex-col items-center justify-start px-3 md:px-6 pt-28 md:pt-24 pb-6 relative z-10">
            <div className="w-full space-y-3 md:space-y-4">
              {chapter.paragraphs.map((item, index) => {
                const isActive = index === currentParagraph
                const canRead = mode !== 'duo' || !item.reader || item.reader === activeReader
                return (
                  <button
                    key={item.id || index}
                    onClick={() => onSelectParagraph(index)}
                    className={`w-full text-left rounded-xl md:rounded-2xl border transition-all ${isActive
                      ? 'border-white/70 bg-white/20'
                      : 'border-white/20 bg-white/10 hover:bg-white/15'
                      }`}
                  >
                    <div className="p-3 md:p-5">
                      <div className="flex items-center justify-between mb-2 md:mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] md:text-xs text-white/60">Line {index + 1}</span>
                          {mode === 'duo' && item.reader && (
                            <span className="text-[10px] md:text-xs px-2 py-0.5 md:py-1 rounded-full bg-white/20 text-white">
                              {readerNames[item.reader] || `Reader ${item.reader}`}
                            </span>
                          )}
                        </div>
                        {!canRead && (
                          <span className="text-[10px] md:text-xs text-white/50">Other reader</span>
                        )}
                      </div>
                      <p className={`text-base md:text-xl leading-relaxed font-serif ${isActive ? 'text-white' : 'text-white/80'}`}>
                        {item.text}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Bottom controls */}
          <div className="sticky bottom-0 z-10 bg-gradient-to-t from-[#1b0f0b] via-[#1b0f0b]/95 to-transparent pt-6 pb-6 md:pb-10 flex flex-col items-center gap-4 md:gap-6">
            {mode === 'duo' && (
              <div className="flex items-center gap-2 md:gap-3 text-white/70 text-xs md:text-sm">
                <span>Active:</span>
                <button
                  onClick={() => setActiveReader(1)}
                  className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm ${activeReader === 1 ? 'bg-white text-black' : 'bg-white/10'
                    }`}
                >
                  {readerNames[1] || 'Reader 1'}
                </button>
                <button
                  onClick={() => setActiveReader(2)}
                  className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm ${activeReader === 2 ? 'bg-white text-black' : 'bg-white/10'
                    }`}
                >
                  {readerNames[2] || 'Reader 2'}
                </button>
              </div>
            )}

            {/* Recording and continue row */}
            <div className="flex items-center gap-4 md:gap-6">
              {/* Recording button */}
              <button
                onClick={() => (isRecording ? stopRecording() : startRecording())}
                className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all ${isRecording
                  ? 'bg-red-500 scale-110'
                  : hasRecording
                    ? 'bg-green-500/80'
                    : 'bg-white/20 backdrop-blur-sm border-2 border-white/40'
                  }`}
              >
                {isRecording ? (
                  <div className="w-5 h-5 md:w-6 md:h-6 bg-white rounded-sm animate-pulse" />
                ) : hasRecording ? (
                  <span className="text-white text-xl md:text-2xl">✓</span>
                ) : (
                  <span className="text-white text-2xl md:text-3xl">🎙</span>
                )}
              </button>

              {/* Continue button */}
              {hasRecording && (
                <button
                  onClick={handleContinue}
                  className="px-6 py-3 md:px-8 md:py-3 rounded-full border border-[#f0d28c]/70 bg-[#b08a3a] text-black/90 text-sm md:text-base uppercase tracking-[0.15em] md:tracking-[0.2em] hover:bg-[#d2b15c] transition-all"
                >
                  {currentParagraph < chapter.paragraphs.length - 1 ? 'continue' : 'finish chapter'}
                </button>
              )}
            </div>

            <p className="text-white/50 text-xs md:text-sm">
              {isRecording ? 'recording...' : hasRecording ? 'recorded' : 'tap to record'}
            </p>

            {mode === 'duo' && paragraph.reader && paragraph.reader !== activeReader && (
              <p className="text-white/50 text-[10px] md:text-xs text-center max-w-xs">
                This line is for {readerNames[paragraph.reader] || `Reader ${paragraph.reader}`}.
              </p>
            )}

            {recordingError && (
              <div className="flex flex-col items-center gap-1">
                <p className="text-red-200 text-[10px] md:text-xs text-center max-w-xs">{recordingError}</p>
                <Link href="/test-mic" target="_blank" className="text-[#f0d28c] text-[10px] md:text-xs underline hover:text-white">
                  Troubleshoot Microphone
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </main>
  )
}
