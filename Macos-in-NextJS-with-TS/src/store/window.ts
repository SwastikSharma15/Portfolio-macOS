import { immer } from "zustand/middleware/immer";
import { create } from "zustand";
import { INITIAL_Z_INDEX, WINDOW_CONFIG } from "#constants";

export type WindowKey = keyof typeof WINDOW_CONFIG;

export interface OriginRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WindowState {
  isOpen: boolean;
  isClosing: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  data: any;
  originRect: OriginRect | null;
}

interface WindowStoreState {
  windows: Record<WindowKey, WindowState>;
  nextZIndex: number;
  openWindow: (windowKey: WindowKey, data?: any, originRect?: OriginRect | null) => void;
  closeWindow: (windowKey: WindowKey) => void;
  startClose: (windowKey: WindowKey) => void;
  finishClose: (windowKey: WindowKey) => void;
  focusWindow: (windowKey: WindowKey) => void;
  toggleMaximizeWindow: (windowKey: WindowKey) => void;
}

const useWindowStore = create<WindowStoreState>()(
  immer((set) => ({
    windows: WINDOW_CONFIG as Record<WindowKey, WindowState>,
    nextZIndex: INITIAL_Z_INDEX + 1,
    openWindow: (windowKey, data = null, originRect = null) => set((state) => {
      const win = state.windows[windowKey];
      if (!win) return;
      win.isOpen = true;
      win.isClosing = false;
      win.zIndex = state.nextZIndex++;
      win.data = data ?? win.data;
      win.originRect = originRect;
    }),
    // startClose: triggers the genie close animation (keeps window visible)
    startClose: (windowKey) => set((state) => {
      const win = state.windows[windowKey];
      if (!win || !win.isOpen) return;
      win.isClosing = true;
    }),
    // finishClose: actually hides the window after animation completes
    finishClose: (windowKey) => set((state) => {
      const win = state.windows[windowKey];
      if (!win) return;
      win.isOpen = false;
      win.isClosing = false;
      win.isMaximized = false;
      win.zIndex = INITIAL_Z_INDEX;
      win.data = null;
      win.originRect = null;
    }),
    // closeWindow: instant close (for mobile / fallback)
    closeWindow: (windowKey) => set((state) => {
      const win = state.windows[windowKey];
      if (!win) return;
      win.isOpen = false;
      win.isClosing = false;
      win.isMaximized = false;
      win.zIndex = INITIAL_Z_INDEX;
      win.data = null;
      win.originRect = null;
    }),
    focusWindow: (windowKey) => set((state) => {
      const win = state.windows[windowKey];
      if (!win) return;
      win.zIndex = state.nextZIndex++;
    }),
    toggleMaximizeWindow: (windowKey) => set((state) => {
      const win = state.windows[windowKey];
      if (!win) return;
      win.isMaximized = !win.isMaximized;
      // bring to front when maximizing
      if (win.isMaximized) {
        win.zIndex = state.nextZIndex++;
      }
    }),
  }))
);

export default useWindowStore;