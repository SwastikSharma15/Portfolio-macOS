"use client"

import { useState } from "react"
import { Star, Clock, User2, Hash, Voicemail, Phone, X } from "lucide-react"
import { KeyPad } from "./keypad"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function PhoneApp() {
  const [activeTab, setActiveTab] = useState<"favorites" | "recents" | "contacts" | "keypad" | "voicemail">("keypad")
  const [number, setNumber] = useState("")
  const [contactName, setContactName] = useState<string | null>(null)

  // Easter egg: If someone types Jenny's number
  const handleNumberChange = (newNumber: string) => {
    setNumber(newNumber)
    if (newNumber === "8675309") {
      setContactName("Jenny")
    } else {
      setContactName(null)
    }
  }

  const handleKeyPress = (key: string) => {
    if (number.length < 10) {
      handleNumberChange(number + key)
    }
  }

  const handleDelete = () => {
    handleNumberChange(number.slice(0, -1))
  }

  const formatPhoneNumber = (num: string) => {
    if (num.length === 0) return ""
    if (num.length <= 3) return num
    if (num.length <= 6) return `${num.slice(0, 3)}-${num.slice(3)}`
    return `${num.slice(0, 3)}-${num.slice(3, 6)}-${num.slice(6)}`
  }

  const tabs = [
    { id: "favorites", icon: Star, label: "Favorites" },
    { id: "recents", icon: Clock, label: "Recents" },
    { id: "contacts", icon: User2, label: "Contacts" },
    { id: "keypad", icon: Hash, label: "Keypad" },
    { id: "voicemail", icon: Voicemail, label: "Voicemail" },
  ] as const

  return (
    <div className="h-full w-full bg-white flex flex-col">
      {/* Display */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-4xl font-light mb-2">{number}</div>
        {contactName && (
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <span>{contactName}</span>
            <span>{formatPhoneNumber(number)}</span>
          </div>
        )}
        {number && !contactName && <div className="text-sm text-gray-500">{formatPhoneNumber(number)}</div>}
      </div>

      {/* Keypad */}
      <KeyPad onKeyPress={handleKeyPress} />

      {/* Call/Delete Buttons */}
      <div className="flex justify-center items-center gap-4 py-4">
        {number && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center"
            onClick={handleDelete}
          >
            <X className="h-6 w-6 text-gray-600" />
          </motion.button>
        )}
        <button
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center",
            number ? "bg-green-500" : "bg-gray-200",
          )}
        >
          <Phone className={cn("h-6 w-6", number ? "text-white" : "text-gray-600")} />
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-around items-center py-2 border-t">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center p-2 ${activeTab === tab.id ? "text-green-500" : "text-gray-400"}`}
          >
            <tab.icon className="h-6 w-6" />
            <span className="text-xs mt-1">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
