"use client"

import { useCallback, useEffect, useRef, useState, memo } from "react"
import { FlipVertical2Icon as FlipCamera2, RotateCcw, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppState } from "@/lib/app-state"

// Custom hook for camera management
function useCameraStream(isFrontCamera: boolean) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Function to get camera stream
  const getStream = useCallback(async () => {
    try {
      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }

      // Request new stream
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: isFrontCamera ? "user" : "environment",
        },
        audio: false,
      })

      // Store stream in ref and state
      streamRef.current = newStream
      setStream(newStream)
      setError(null)
    } catch (err) {
      console.error("Camera error:", err)
      setError(err instanceof Error ? err : new Error(String(err)))
      setStream(null)
    }
  }, [isFrontCamera])

  // Initialize camera on mount and when camera direction changes
  useEffect(() => {
    getStream()

    // Cleanup on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
    }
  }, [getStream])

  return { stream, error }
}

// Memoized camera controls component
const CameraControls = memo(
  ({
    onCapture,
    onFlip,
    lastPhoto,
    onPhotoClick,
  }: {
    onCapture: () => void
    onFlip: () => void
    lastPhoto: string | null
    onPhotoClick: () => void
  }) => {
    const modes = ["CINEMATIC", "VIDEO", "PHOTO", "PORTRAIT", "PANO"] as const
    const [mode, setMode] = useState<(typeof modes)[number]>("PHOTO")

    return (
      <div className="absolute bottom-0 left-0 right-0 pb-8 bg-gradient-to-t from-black/80 to-transparent">
        {/* Mode Selection */}
        <div className="flex justify-center gap-6 mb-8">
          {modes.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn("text-sm font-medium", mode === m ? "text-yellow-500" : "text-white/80")}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Camera Controls */}
        <div className="flex items-center justify-between px-8">
          {/* Last Photo Thumbnail */}
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/40 cursor-pointer" onClick={onPhotoClick}>
            {lastPhoto ? (
              <img
                src={lastPhoto || "/placeholder.svg"}
                alt="Last captured photo"
                className="w-full h-full object-cover"
              />
            ) : null}
          </div>

          {/* Shutter Button */}
          <button onClick={onCapture} className="w-20 h-20 rounded-full border-4 border-white p-1">
            <div className="w-full h-full rounded-full bg-white" />
          </button>

          {/* Camera Flip */}
          <button onClick={onFlip} className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center">
            <RotateCcw className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>
    )
  },
)

CameraControls.displayName = "CameraControls"

// Memoized zoom controls component
const ZoomControls = memo(
  ({
    zoom,
    setZoom,
  }: {
    zoom: string
    setZoom: (zoom: string) => void
  }) => {
    const zoomLevels = [".5", "1", "2"]

    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 flex gap-2 bg-black/40 rounded-full px-2 py-1">
        {zoomLevels.map((level) => (
          <button
            key={level}
            onClick={() => setZoom(level)}
            className={cn(
              "px-3 py-1 rounded-full text-sm font-medium",
              zoom === level ? "bg-yellow-500/20 text-yellow-500" : "text-white",
            )}
          >
            {level}x
          </button>
        ))}
      </div>
    )
  },
)

ZoomControls.displayName = "ZoomControls"

// Main Camera component
export function Camera() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isFrontCamera, setIsFrontCamera] = useState(false)
  const [zoom, setZoom] = useState("1")
  const [lastPhoto, setLastPhoto] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const { closeApp, openApp } = useAppState()

  // Use custom hook for camera stream
  const { stream, error } = useCameraStream(isFrontCamera)

  // Set video source when stream changes
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  // Load the last photo from localStorage on mount
  useEffect(() => {
    const storedPhotos = localStorage.getItem("photos")
    if (storedPhotos) {
      const photos = JSON.parse(storedPhotos)
      if (photos.length > 0) {
        setLastPhoto(photos[0].url)
      }
    }
  }, [])

  // Memoized handlers
  const handleFlipCamera = useCallback(() => {
    setIsFrontCamera((prev) => !prev)
  }, [])

  const capturePhoto = useCallback(async () => {
    setIsCapturing(true)
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw video frame to canvas
      const context = canvas.getContext("2d")
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        const photoUrl = canvas.toDataURL("image/jpeg")
        setLastPhoto(photoUrl)

        // Save to localStorage
        const storedPhotos = localStorage.getItem("photos")
        const photos = storedPhotos ? JSON.parse(storedPhotos) : []
        const newPhoto = {
          id: Date.now().toString(),
          url: photoUrl,
          timestamp: Date.now(),
        }
        photos.unshift(newPhoto)
        localStorage.setItem("photos", JSON.stringify(photos))
      }
    }
    setIsCapturing(false)
  }, [])

  const handleOpenPhotos = useCallback(() => {
    // Close camera and open photos app
    closeApp()
    openApp("photos")
  }, [closeApp, openApp])

  return (
    <div className="relative h-full w-full bg-black overflow-hidden">
      {/* Camera Preview */}
      <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />

      {/* Hidden canvas for capturing photos */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Error message */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-white text-center p-4">
            <p className="text-red-500 mb-2">Camera error</p>
            <p>{error.message}</p>
          </div>
        </div>
      )}

      {/* Top Controls */}
      <div className="absolute top-2 left-0 right-0 flex justify-between px-4 z-10">
        <button onClick={closeApp} className="rounded-full bg-black/40 p-2">
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>

        <button onClick={handleFlipCamera} className="rounded-full bg-black/40 p-2">
          <FlipCamera2 className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Zoom Controls */}
      <ZoomControls zoom={zoom} setZoom={setZoom} />

      {/* Camera Controls */}
      <CameraControls
        onCapture={capturePhoto}
        onFlip={handleFlipCamera}
        lastPhoto={lastPhoto}
        onPhotoClick={handleOpenPhotos}
      />

      {/* Added loading indicator */}
      {isCapturing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white text-center p-4">
            <p>Capturing...</p>
          </div>
        </div>
      )}
    </div>
  )
}
