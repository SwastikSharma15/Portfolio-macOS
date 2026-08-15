"use client"

import { useState } from "react"
import { Wifi, Bluetooth, Plane, Signal } from "lucide-react"
import { cn } from "@/lib/utils"

export function ConnectivityModule() {
  const [airplaneMode, setAirplaneMode] = useState(false)
  const [wifiEnabled, setWifiEnabled] = useState(true)
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true)
  const [cellularEnabled, setCellularEnabled] = useState(true)

  return (
    <div className="bg-white/50 backdrop-blur-md rounded-2xl p-3 aspect-square">
      <div className="grid grid-cols-2 gap-2 h-full">
        <button
          className={cn(
            "rounded-full flex items-center justify-center transition-colors",
            airplaneMode ? "bg-blue-500" : "bg-white/20",
          )}
          onClick={() => setAirplaneMode(!airplaneMode)}
        >
          <Plane className={cn("h-5 w-5", airplaneMode ? "text-black" : "text-black/80")} />
        </button>

        <button
          className={cn(
            "rounded-full flex items-center justify-center transition-colors",
            wifiEnabled ? "bg-blue-500" : "bg-white/20",
          )}
          onClick={() => setWifiEnabled(!wifiEnabled)}
        >
          <Wifi className={cn("h-5 w-5", wifiEnabled ? "text-black" : "text-black/80")} />
        </button>

        <button
          className={cn(
            "rounded-full flex items-center justify-center transition-colors",
            cellularEnabled ? "bg-green-500" : "bg-white/20",
          )}
          onClick={() => setCellularEnabled(!cellularEnabled)}
        >
          <Signal className={cn("h-5 w-5", cellularEnabled ? "text-black" : "text-black/80")} />
        </button>

        <button
          className={cn(
            "rounded-full flex items-center justify-center transition-colors",
            bluetoothEnabled ? "bg-blue-500" : "bg-white/20",
          )}
          onClick={() => setBluetoothEnabled(!bluetoothEnabled)}
        >
          <Bluetooth className={cn("h-5 w-5", bluetoothEnabled ? "text-black" : "text-black/80")} />
        </button>
      </div>
    </div>
  )
}
