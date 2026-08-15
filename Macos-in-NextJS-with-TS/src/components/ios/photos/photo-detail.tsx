"use client"

import { useState } from "react"
import { ArrowLeft, Share2, Heart, Trash2, MoreHorizontal } from "lucide-react"
import { useAppState } from "@/lib/app-state"

interface PhotoDetailProps {
  photo: {
    id: string
    url: string
    timestamp: number
  }
  onBack: () => void
  onDelete: (id: string) => void
}

export function PhotoDetail({ photo, onBack, onDelete }: PhotoDetailProps) {
  const [showControls, setShowControls] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)
  const { setWallpaper } = useAppState()

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    })
  }

  const handleImageClick = () => {
    setShowControls(!showControls)
  }

  return (
    <div className="h-full w-full bg-black flex flex-col relative select-none">
      {/* Header */}
      {showControls && (
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-12 pb-4 bg-gradient-to-b from-black/90 via-black/50 to-transparent">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/70 active:scale-95 transition-all shadow-md"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div className="flex gap-2">
            <button
              className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/70 active:scale-95 transition-all shadow-md"
              aria-label="Share"
            >
              <Share2 className="h-5 w-5 text-white" />
            </button>
            <button
              className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/70 active:scale-95 transition-all shadow-md"
              aria-label="Favorite"
            >
              <Heart className="h-5 w-5 text-white" />
            </button>
            <button
              onClick={() => setIsDeleteDialogOpen(true)}
              className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/70 active:scale-95 transition-all shadow-md"
              aria-label="Delete"
            >
              <Trash2 className="h-5 w-5 text-white" />
            </button>
            <button
              onClick={() => setIsMoreMenuOpen(true)}
              className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/70 active:scale-95 transition-all shadow-md"
              aria-label="More"
            >
              <MoreHorizontal className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Photo */}
      <div className="flex-1 flex items-center justify-center p-2" onClick={handleImageClick}>
        <img
          src={photo.url || "/placeholder.svg"}
          alt={`Photo from ${formatDate(photo.timestamp)}`}
          className="max-h-full max-w-full object-contain select-none"
        />
      </div>

      {/* Footer */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pb-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex justify-center">
          <span className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-medium shadow-md">
            {formatDate(photo.timestamp)}
          </span>
        </div>
      )}

      {/* Delete Confirmation - iOS Action Sheet */}
      {isDeleteDialogOpen && (
        <>
          {/* Backdrop */}
          <div
            className="absolute inset-0 z-40"
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              animation: "fadeIn 0.2s ease-out forwards",
            }}
            onClick={() => setIsDeleteDialogOpen(false)}
          />

          {/* Action Sheet */}
          <div
            className="absolute bottom-0 left-0 right-0 z-50 px-3 pb-3"
            style={{ animation: "slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1) forwards" }}
          >
            {/* Main Action Group */}
            <div
              style={{
                borderRadius: "14px",
                overflow: "hidden",
                backgroundColor: "rgba(44, 44, 46, 0.95)",
                backdropFilter: "blur(40px)",
                WebkitBackdropFilter: "blur(40px)",
                marginBottom: "8px",
              }}
            >
              {/* Photo Preview + Message */}
              <div style={{ padding: "16px 16px 12px", textAlign: "center" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    margin: "0 auto 10px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  }}
                >
                  <img
                    src={photo.url || "/placeholder.svg"}
                    alt="Photo to delete"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <p
                  style={{
                    color: "rgba(235, 235, 245, 0.6)",
                    fontSize: "13px",
                    lineHeight: "1.4",
                    margin: 0,
                  }}
                >
                  This photo will be deleted from your library.
                </p>
              </div>

              {/* Separator */}
              <div style={{ height: "0.5px", backgroundColor: "rgba(84, 84, 88, 0.65)" }} />

              {/* Delete Button */}
              <button
                onClick={() => {
                  onDelete(photo.id)
                  setIsDeleteDialogOpen(false)
                }}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "16px",
                  border: "none",
                  background: "transparent",
                  color: "#FF453A",
                  fontSize: "20px",
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "background-color 0.15s",
                }}
                onMouseDown={(e) => (e.currentTarget.style.backgroundColor = "rgba(84, 84, 88, 0.4)")}
                onMouseUp={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                Delete Photo
              </button>
            </div>

            {/* Cancel Group */}
            <div
              style={{
                borderRadius: "14px",
                overflow: "hidden",
                backgroundColor: "rgba(44, 44, 46, 0.95)",
                backdropFilter: "blur(40px)",
                WebkitBackdropFilter: "blur(40px)",
              }}
            >
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "16px",
                  border: "none",
                  background: "transparent",
                  color: "#0A84FF",
                  fontSize: "20px",
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "background-color 0.15s",
                }}
                onMouseDown={(e) => (e.currentTarget.style.backgroundColor = "rgba(84, 84, 88, 0.4)")}
                onMouseUp={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Keyframe Animations */}
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideUp {
              from { transform: translateY(100%); }
              to { transform: translateY(0); }
            }
          `}</style>
        </>
      )}

      {/* More Menu Action Sheet */}
      {isMoreMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="absolute inset-0 z-40"
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              animation: "fadeIn 0.2s ease-out forwards",
            }}
            onClick={() => setIsMoreMenuOpen(false)}
          />

          {/* Action Sheet */}
          <div
            className="absolute bottom-0 left-0 right-0 z-50 px-3 pb-3"
            style={{ animation: "slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1) forwards" }}
          >
            {/* Main Action Group */}
            <div
              style={{
                borderRadius: "14px",
                overflow: "hidden",
                backgroundColor: "rgba(44, 44, 46, 0.95)",
                backdropFilter: "blur(40px)",
                WebkitBackdropFilter: "blur(40px)",
                marginBottom: "8px",
              }}
            >
              {/* Set Wallpaper Button */}
              <button
                onClick={() => {
                  setWallpaper(photo.url)
                  setIsMoreMenuOpen(false)
                }}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "16px",
                  border: "none",
                  background: "transparent",
                  color: "#0A84FF",
                  fontSize: "20px",
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "background-color 0.15s",
                }}
                onMouseDown={(e) => (e.currentTarget.style.backgroundColor = "rgba(84, 84, 88, 0.4)")}
                onMouseUp={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                Set as Wallpaper
              </button>
            </div>

            {/* Cancel Group */}
            <div
              style={{
                borderRadius: "14px",
                overflow: "hidden",
                backgroundColor: "rgba(44, 44, 46, 0.95)",
                backdropFilter: "blur(40px)",
                WebkitBackdropFilter: "blur(40px)",
              }}
            >
              <button
                onClick={() => setIsMoreMenuOpen(false)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "16px",
                  border: "none",
                  background: "transparent",
                  color: "#0A84FF",
                  fontSize: "20px",
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "background-color 0.15s",
                }}
                onMouseDown={(e) => (e.currentTarget.style.backgroundColor = "rgba(84, 84, 88, 0.4)")}
                onMouseUp={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
