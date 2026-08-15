"use client"

import { useState } from "react"
import { ArrowLeft, PenSquare, Search, Trash2 } from "lucide-react"
import type { Folder, Note } from "./notes-app"

interface FolderViewProps {
  folder: Folder
  onBack: () => void
  onNoteClick: (note: Note) => void
  onCreateNote: () => void
  onDeleteNote: (noteId: string) => void
}

export function FolderView({ folder, onBack, onNoteClick, onCreateNote, onDeleteNote }: FolderViewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredNotes = folder.notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="h-full w-full bg-[#F2F2F7] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <button onClick={onBack}>
            <ArrowLeft className="h-5 w-5 text-[#FF9500]" />
          </button>
          <h1 className="text-2xl font-bold">{folder.name}</h1>
        </div>
        <button className="text-[#FF9500] font-medium" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Done" : "Edit"}
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-2">
        <div className="bg-[#E5E5EA] rounded-lg flex items-center px-3 py-2">
          <Search className="h-4 w-4 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent w-full outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-auto px-4 pb-4">
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>No Notes</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl overflow-hidden">
            {filteredNotes.map((note, index) => (
              <div
                key={note.id}
                className={`p-3 ${index !== filteredNotes.length - 1 ? "border-b" : ""}`}
                onClick={() => !isEditing && onNoteClick(note)}
              >
                <div className="flex items-center gap-2">
                  {isEditing && (
                    <button className="text-red-500" onClick={() => onDeleteNote(note.id)}>
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                  <div>
                    <h3 className="font-semibold">{note.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">
                      {new Date(note.updatedAt).toLocaleDateString()} • {note.content.substring(0, 30)}
                      {note.content.length > 30 ? "..." : ""}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Toolbar */}
      <div className="flex items-center justify-end p-4 border-t bg-[#F2F2F7]">
        <button className="text-[#FF9500]" onClick={onCreateNote}>
          <PenSquare className="h-6 w-6" />
        </button>
      </div>
    </div>
  )
}
