"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FolderIcon, ChevronDown, ChevronRight, PenSquare, Settings2, Trash2 } from "lucide-react"
import { useLocalStorage } from "@/lib/use-local-storage"
import { NoteEditor } from "./note-editor"
import { FolderView } from "./folder-view"

export interface Folder {
  id: string
  name: string
  notes: Note[]
  icon: "folder" | "settings"
}

export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export function NotesApp() {
  const [folders, setFolders] = useLocalStorage<Folder[]>("notes-folders", [
    {
      id: "all-icloud",
      name: "All iCloud",
      notes: [],
      icon: "settings",
    },
    {
      id: "notes",
      name: "Notes",
      notes: [
        {
          id: "note-1",
          title: "Welcome to Notes",
          content: "This is your first note. Tap to edit.",
          tags: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      icon: "folder",
    },
    {
      id: "grocery",
      name: "Grocery List",
      notes: [
        {
          id: "note-3",
          title: "Weekly Groceries",
          content: "- Milk\n- Eggs\n- Bread",
          tags: ["shopping"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      icon: "folder",
    },
  ])

  const [isICloudExpanded, setIsICloudExpanded] = useState(true)
  const [isTagsExpanded, setIsTagsExpanded] = useState(true)
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [currentView, setCurrentView] = useState<"folders" | "folder" | "note">("folders")
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [editingNote, setEditingNote] = useState<Note | null>(null)

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: Folder = {
        id: `folder-${Date.now()}`,
        name: newFolderName,
        notes: [],
        icon: "folder",
      }
      setFolders([...folders, newFolder])
      setNewFolderName("")
      setIsNewFolderDialogOpen(false)
    }
  }

  const handleDeleteFolder = (folderId: string) => {
    setFolders(folders.filter((folder) => folder.id !== folderId))
  }

  const handleFolderClick = (folderId: string) => {
    setSelectedFolderId(folderId)
    setCurrentView("folder")
  }

  const handleCreateNote = () => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: "New Note",
      content: "",
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // If we're in a folder view, add to that folder
    if (currentView === "folder" && selectedFolderId) {
      const updatedFolders = folders.map((folder) => {
        if (folder.id === selectedFolderId) {
          return {
            ...folder,
            notes: [newNote, ...folder.notes],
          }
        }
        return folder
      })
      setFolders(updatedFolders)
    } else {
      // Otherwise add to the default Notes folder
      const updatedFolders = folders.map((folder) => {
        if (folder.id === "notes") {
          return {
            ...folder,
            notes: [newNote, ...folder.notes],
          }
        }
        return folder
      })
      setFolders(updatedFolders)
    }

    setEditingNote(newNote)
    setCurrentView("note")
  }

  const handleNoteClick = (note: Note) => {
    setEditingNote(note)
    setCurrentView("note")
  }

  const handleSaveNote = (updatedNote: Note) => {
    const updatedFolders = folders.map((folder) => {
      const noteIndex = folder.notes.findIndex((note) => note.id === updatedNote.id)
      if (noteIndex !== -1) {
        const updatedNotes = [...folder.notes]
        updatedNotes[noteIndex] = {
          ...updatedNote,
          updatedAt: new Date().toISOString(),
        }
        return {
          ...folder,
          notes: updatedNotes,
        }
      }
      return folder
    })

    setFolders(updatedFolders)
  }

  const handleDeleteNote = (noteId: string) => {
    const updatedFolders = folders.map((folder) => {
      return {
        ...folder,
        notes: folder.notes.filter((note) => note.id !== noteId),
      }
    })

    setFolders(updatedFolders)
    setCurrentView("folder")
  }

  const handleBackToFolders = () => {
    setCurrentView("folders")
    setSelectedFolderId(null)
  }

  const handleBackToFolder = () => {
    setCurrentView("folder")
    setEditingNote(null)
  }

  // Render the appropriate view
  if (currentView === "note" && editingNote) {
    return (
      <NoteEditor note={editingNote} onSave={handleSaveNote} onBack={handleBackToFolder} onDelete={handleDeleteNote} />
    )
  }

  if (currentView === "folder" && selectedFolderId) {
    const selectedFolder = folders.find((folder) => folder.id === selectedFolderId)
    if (!selectedFolder) return null

    return (
      <FolderView
        folder={selectedFolder}
        onBack={handleBackToFolders}
        onNoteClick={handleNoteClick}
        onCreateNote={handleCreateNote}
        onDeleteNote={handleDeleteNote}
      />
    )
  }

  return (
    <div className="h-full w-full bg-[#F2F2F7] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h1 className="text-3xl font-bold">Folders</h1>
        <button className="text-[#FF9500] font-medium" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Done" : "Edit"}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-4 pb-4">
        {/* iCloud Section */}
        <div className="bg-white rounded-xl mb-4 overflow-hidden">
          <div
            className="flex items-center justify-between p-3 border-b"
            onClick={() => setIsICloudExpanded(!isICloudExpanded)}
          >
            <span className="font-semibold">iCloud</span>
            {isICloudExpanded ? (
              <ChevronDown className="h-5 w-5 text-[#FF9500]" />
            ) : (
              <ChevronRight className="h-5 w-5 text-[#FF9500]" />
            )}
          </div>

          <AnimatePresence>
            {isICloudExpanded && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                {folders.map((folder) => (
                  <div
                    key={folder.id}
                    className="flex items-center justify-between p-3 border-b last:border-b-0 cursor-pointer"
                    onClick={() => !isEditing && handleFolderClick(folder.id)}
                  >
                    <div className="flex items-center gap-3">
                      {isEditing && (
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteFolder(folder.id)
                          }}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                      {folder.icon === "folder" ? (
                        <FolderIcon className="h-5 w-5 text-[#FF9500]" />
                      ) : (
                        <Settings2 className="h-5 w-5 text-[#FF9500]" />
                      )}
                      <span>{folder.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">{folder.notes.length}</span>
                      <ChevronRight className="h-5 w-5 text-gray-300" />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tags Section */}
        <div className="bg-white rounded-xl overflow-hidden">
          <div
            className="flex items-center justify-between p-3 border-b"
            onClick={() => setIsTagsExpanded(!isTagsExpanded)}
          >
            <span className="font-semibold">Tags</span>
            {isTagsExpanded ? (
              <ChevronDown className="h-5 w-5 text-[#FF9500]" />
            ) : (
              <ChevronRight className="h-5 w-5 text-[#FF9500]" />
            )}
          </div>

          <AnimatePresence>
            {isTagsExpanded && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.2 }}
                className="p-3"
              >
                <div className="flex gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">All Tags</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">#home</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* New Folder Dialog */}
      {isNewFolderDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[300px] max-w-[80%] overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-center">New Folder</h3>
            </div>
            <div className="p-4">
              <input
                type="text"
                className="w-full border rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#FF9500]"
                placeholder="Folder Name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 text-[#FF9500] hover:bg-[#FF9500]/20"
                  onClick={() => setIsNewFolderDialogOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-[#FF9500] text-white rounded-lg hover:bg-[#FF9500]/90"
                  onClick={handleCreateFolder}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Toolbar */}
      <div className="flex items-center justify-between p-4 border-t bg-[#F2F2F7]">
        <button className="text-[#FF9500] hover:text-[#FF9500]/80" onClick={() => setIsNewFolderDialogOpen(true)}>
          <FolderIcon className="h-6 w-6" />
        </button>

        <button className="text-[#FF9500] hover:text-[#FF9500]/80" onClick={handleCreateNote}>
          <PenSquare className="h-6 w-6" />
        </button>
      </div>
    </div>
  )
}
