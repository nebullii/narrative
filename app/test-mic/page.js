'use client'

import { useState, useRef, useEffect } from 'react'

export default function TestMic() {
  const [status, setStatus] = useState('Click "Test Microphone" to start')
  const [audioLevel, setAudioLevel] = useState(0)
  const [devices, setDevices] = useState([])
  const [selectedDevice, setSelectedDevice] = useState('')
  const [recording, setRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)

  const streamRef = useRef(null)
  const analyserRef = useRef(null)
  const animationRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])

  useEffect(() => {
    // Get list of audio devices
    navigator.mediaDevices.enumerateDevices().then(deviceList => {
      const audioInputs = deviceList.filter(d => d.kind === 'audioinput')
      setDevices(audioInputs)
      console.log('Audio devices:', audioInputs)
    })

    return () => {
      stopStream()
    }
  }, [])

  const stopStream = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }

  const testMicrophone = async () => {
    try {
      stopStream()
      setStatus('Requesting microphone access...')

      const constraints = {
        audio: selectedDevice ? { deviceId: { exact: selectedDevice } } : true
      }

      console.log('getUserMedia constraints:', constraints)
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      const track = stream.getAudioTracks()[0]
      console.log('Audio track:', track.label, track.getSettings())
      setStatus(`Microphone active: ${track.label}`)

      // Set up audio analyzer to show levels
      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      analyserRef.current = analyser

      const dataArray = new Uint8Array(analyser.frequencyBinCount)

      const checkLevel = () => {
        analyser.getByteFrequencyData(dataArray)
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length
        setAudioLevel(Math.round(average))
        animationRef.current = requestAnimationFrame(checkLevel)
      }
      checkLevel()

    } catch (error) {
      console.error('Microphone error:', error)
      setStatus(`Error: ${error.message}`)
    }
  }

  const startRecording = async () => {
    if (!streamRef.current) {
      await testMicrophone()
    }

    if (!streamRef.current) return

    chunksRef.current = []
    const mediaRecorder = new MediaRecorder(streamRef.current)
    mediaRecorderRef.current = mediaRecorder

    mediaRecorder.ondataavailable = (e) => {
      console.log('Chunk received:', e.data.size, 'bytes')
      if (e.data.size > 0) {
        chunksRef.current.push(e.data)
      }
    }

    mediaRecorder.onstop = () => {
      console.log('Recording stopped, total chunks:', chunksRef.current.length)
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
      console.log('Blob created:', blob.size, 'bytes')
      const url = URL.createObjectURL(blob)
      setAudioUrl(url)
      setStatus(`Recording complete: ${Math.round(blob.size / 1024)} KB`)
    }

    mediaRecorder.start(500)
    setRecording(true)
    setStatus('Recording... Speak into your microphone')
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    setRecording(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold">Microphone Test</h1>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Select Microphone:</label>
          <select
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="">Default</option>
            {devices.map(device => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Microphone ${device.deviceId.slice(0, 8)}`}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <button
            onClick={testMicrophone}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Test Microphone
          </button>

          {!recording ? (
            <button
              onClick={startRecording}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Stop Recording
            </button>
          )}
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Status:</p>
          <p className="font-medium">{status}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">Audio Level: {audioLevel}</p>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-100"
              style={{ width: `${Math.min(audioLevel * 2, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">
            {audioLevel === 0 ? 'No audio detected - speak into your microphone' : 'Audio detected!'}
          </p>
        </div>

        {audioUrl && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Playback:</p>
            <audio controls src={audioUrl} className="w-full" />
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>Troubleshooting:</p>
          <ul className="list-disc pl-5">
            <li>Make sure your microphone is connected and selected above</li>
            <li>Check that Chrome has microphone permission (lock icon in address bar)</li>
            <li>Try selecting a different microphone from the dropdown</li>
            <li>The audio level bar should move when you speak</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
