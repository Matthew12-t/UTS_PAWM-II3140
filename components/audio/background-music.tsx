"use client"

import { useEffect, useRef, useState } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = 0.3

    const handleEnded = () => {
      audio.currentTime = 0
      audio.play()
    }

    const handlePlay = () => {
      setIsPlaying(true)
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("play", handlePlay)
    audio.addEventListener("pause", handlePause)

    const playAudio = () => {
      audio.play().catch((error) => {
        console.log("Autoplay diblokir:", error)
      })
    }

    setTimeout(playAudio, 500)

    return () => {
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("play", handlePlay)
      audio.removeEventListener("pause", handlePause)
    }
  }, [])

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isMuted) {
      audio.volume = 0.3
      audio.play()
    } else {
      audio.volume = 0
      audio.pause()
    }
    setIsMuted(!isMuted)
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/Audio/lofi-study.mp3"
        loop
        crossOrigin="anonymous"
      />

      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isPlaying ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}></div>
          <span className="text-xs font-semibold text-gray-700">
            {isPlaying ? "On" : "Off"}
          </span>
        </div>
        <Button
          onClick={toggleMute}
          size="sm"
          variant="outline"
          className="p-2 h-auto"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </Button>
      </div>
    </>
  )
}
