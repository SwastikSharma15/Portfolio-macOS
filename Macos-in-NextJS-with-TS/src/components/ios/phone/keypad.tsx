"use client"

import { motion } from "framer-motion"

interface KeyPadProps {
  onKeyPress: (key: string) => void
}

export function KeyPad({ onKeyPress }: KeyPadProps) {
  const keys = [
    { number: "1", letters: "" },
    { number: "2", letters: "ABC" },
    { number: "3", letters: "DEF" },
    { number: "4", letters: "GHI" },
    { number: "5", letters: "JKL" },
    { number: "6", letters: "MNO" },
    { number: "7", letters: "PQRS" },
    { number: "8", letters: "TUV" },
    { number: "9", letters: "WXYZ" },
    { number: "*", letters: "" },
    { number: "0", letters: "+" },
    { number: "#", letters: "" },
  ]

  return (
    <div className="grid grid-cols-3 gap-4 px-4">
      {keys.map((key) => (
        <motion.button
          key={key.number}
          whileTap={{ scale: 0.95 }}
          onClick={() => onKeyPress(key.number)}
          className="aspect-square rounded-full bg-gray-100 flex flex-col items-center justify-center"
        >
          <span className="text-2xl font-light">{key.number}</span>
          {key.letters && <span className="text-[10px] text-gray-500 mt-1">{key.letters}</span>}
        </motion.button>
      ))}
    </div>
  )
}
