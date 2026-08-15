import { create } from 'zustand'

export type AppName = 
  | "clock"
  | "settings"
  | "weather"
  | "calendar"
  | "camera"
  | "photos"
  | "notes"
  | "messages"
  | "safari"
  | "music"
  | "phone";

type AppState = {
  isLocked: boolean
  currentApp: AppName | string | null
  controlCenterOpen: boolean
  brightness: number
  appOriginRect: DOMRect | null
  openApp: (appId: AppName | string, originRect?: DOMRect) => void
  closeApp: () => void
  lockDevice: () => void
  unlockDevice: () => void
  openControlCenter: () => void
  closeControlCenter: () => void
  setBrightness: (val: number) => void
  wallpaper: string
  setWallpaper: (val: string) => void
}

export const useAppState = create<AppState>((set) => ({
  isLocked: false,
  currentApp: null,
  controlCenterOpen: false,
  brightness: 100,
  appOriginRect: null,
  wallpaper: typeof window !== "undefined" ? (localStorage.getItem("ios-wallpaper") || "/wallpaper.jpg") : "/wallpaper.jpg",
  openApp: (appId, originRect) => set({ currentApp: appId, appOriginRect: originRect ?? null }),
  closeApp: () => set({ currentApp: null }),
  lockDevice: () => set({ isLocked: true, currentApp: null }),
  unlockDevice: () => set({ isLocked: false }),
  openControlCenter: () => set({ controlCenterOpen: true }),
  closeControlCenter: () => set({ controlCenterOpen: false }),
  setBrightness: (val) => set({ brightness: val }),
  setWallpaper: (val) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("ios-wallpaper", val)
    }
    set({ wallpaper: val })
  },
}))

