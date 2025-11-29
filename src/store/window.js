import { immer } from "zustand/middleware/immer";
import { create } from "zustand";
import { INITIAL_Z_INDEX, WINDOW_CONFIG } from "#constants";

const useWindowStore = create(
  immer((set) => ({
    windows: WINDOW_CONFIG,
    nextZIndex: INITIAL_Z_INDEX + 1,
    openWindow: (windowKey, data = null) => set((state) => {
      const win = state.windows[windowKey];
      if (!win) return;
      win.isOpen = true;
      win.isMinimized = false; // ensure visible when opened
      win.zIndex = state.nextZIndex;
      win.data = data ?? win.data;
      state.nextZIndex++;

    }),
    closeWindow: (windowKey) => set((state) => {
      const win = state.windows[windowKey];
      if (!win) return;
      win.isOpen = false;
      win.isMinimized = false;
      win.isMaximized = false;
      win.zIndex = INITIAL_Z_INDEX;
      win.data = null;
    }),
    focusWindow: (windowKey) => set((state) => {
      const win = state.windows[windowKey];
      if (!win) return;
      win.zIndex = state.nextZIndex++;
    }),
    minimizeWindow: (windowKey) => set((state) => {
      const win = state.windows[windowKey];
      if (!win) return;
      win.isMinimized = true;
    }),
    toggleMaximizeWindow: (windowKey) => set((state) => {
      const win = state.windows[windowKey];
      if (!win) return;
      // un-minimize if maximizing
      if (win.isMinimized) win.isMinimized = false;
      win.isMaximized = !win.isMaximized;
      // bring to front when maximizing
      if (win.isMaximized) {
        win.zIndex = state.nextZIndex++;
      }
    }),
  }))
);

export default useWindowStore;