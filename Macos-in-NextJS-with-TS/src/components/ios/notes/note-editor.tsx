"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Check, Trash2 } from "lucide-react"
import type { Note } from "./notes-app"

interface NoteEditorProps {
  note: Note
  onSave: (note: Note) => void
  onBack: () => void
  onDelete: (noteId: string) => void
}

export function NoteEditor({ note, onSave, onBack, onDelete }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Auto-save when navigating away
  useEffect(() => {
    return () => {
      if (title !== note.title || content !== note.content) {
        onSave({
          ...note,
          title,
          content,
        })
      }
    }
  }, [title, content, note, onSave])

  const handleSave = () => {
    onSave({
      ...note,
      title,
      content,
    })
    onBack()
  }

  return (
    <div className="h-full w-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b">
        <button onClick={onBack}>
          <ArrowLeft className="h-5 w-5 text-[#FF9500]" />
        </button>
        <div className="flex items-center gap-4">
          <button className="text-red-500" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="h-5 w-5" />
          </button>
          <button className="text-[#FF9500]" onClick={handleSave}>
            <Check className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto p-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full text-2xl font-bold mb-4 outline-none"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Note"
          className="w-full h-[calc(100%-4rem)] outline-none resize-none"
        />
      </div>

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[80%] overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-center">Delete Note</h3>
            </div>
            <div className="p-4">
              <p className="text-center mb-4">Are you sure you want to delete this note?</p>
              <div className="flex justify-end gap-2">
                <button className="px-4 py-2 text-[#FF9500]" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                  onClick={() => {
                    onDelete(note.id)
                    setIsDeleteDialogOpen(false)
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
