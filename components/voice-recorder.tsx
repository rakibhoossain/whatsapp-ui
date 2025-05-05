"use client"

import { useState, useEffect } from "react"
import { Mic, X, Send, Pause, Play, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VoiceRecorderProps {
  onComplete: (audioUrl: string) => void
  onCancel: () => void
}

export default function VoiceRecorder({ onComplete, onCancel }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [duration, setDuration] = useState(0)
  const [recordingComplete, setRecordingComplete] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRecording, isPaused])

  const startRecording = () => {
    // In a real app, this would use the Web Audio API
    setIsRecording(true)
  }

  const pauseRecording = () => {
    setIsPaused(true)
  }

  const resumeRecording = () => {
    setIsPaused(false)
  }

  const stopRecording = () => {
    setIsRecording(false)
    setRecordingComplete(true)
  }

  const sendRecording = () => {
    // In a real app, this would process and send the actual audio
    onComplete("/placeholder.svg?height=100&width=100")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="p-3 bg-[#f0f2f5] flex items-center gap-2">
      <Button variant="ghost" size="icon" className="text-red-500 rounded-full" onClick={onCancel}>
        <X size={24} />
      </Button>

      <div className="flex-1 flex items-center gap-3">
        {recordingComplete ? (
          <Button
            variant="ghost"
            size="icon"
            className="text-[#54656f] rounded-full h-10 w-10"
            onClick={() => {
              // In a real app, this would play the recording
            }}
          >
            <Play size={24} />
          </Button>
        ) : isRecording ? (
          isPaused ? (
            <Button
              variant="ghost"
              size="icon"
              className="text-[#00a884] rounded-full h-10 w-10"
              onClick={resumeRecording}
            >
              <Play size={24} />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="text-[#54656f] rounded-full h-10 w-10"
              onClick={pauseRecording}
            >
              <Pause size={24} />
            </Button>
          )
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500 animate-pulse rounded-full h-10 w-10"
            onClick={startRecording}
          >
            <Mic size={24} />
          </Button>
        )}

        <div className="flex-1">
          <div className="w-full bg-gray-200 h-1 rounded-full">
            <div
              className="bg-[#00a884] h-1 rounded-full transition-all"
              style={{ width: `${(duration / 120) * 100}%` }}
            ></div>
          </div>
          <div className="text-xs text-[#54656f] mt-1">{formatTime(duration)}</div>
        </div>

        {recordingComplete ? (
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500 rounded-full h-10 w-10"
            onClick={() => {
              setRecordingComplete(false)
              setDuration(0)
            }}
          >
            <Trash2 size={20} />
          </Button>
        ) : isRecording ? (
          <Button variant="ghost" size="icon" className="text-[#00a884] rounded-full h-10 w-10" onClick={stopRecording}>
            <Send size={20} />
          </Button>
        ) : null}
      </div>

      {recordingComplete && (
        <Button size="icon" className="rounded-full bg-[#00a884] hover:bg-[#017561] h-10 w-10" onClick={sendRecording}>
          <Send size={18} />
        </Button>
      )}
    </div>
  )
}
