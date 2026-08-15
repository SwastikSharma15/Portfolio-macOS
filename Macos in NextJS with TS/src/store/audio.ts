import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

// Throttle helper for timeupdate events
const throttle = (fn: (...args: any[]) => void, delay: number) => {
  let lastCall = 0;
  return (...args: any[]) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
};

export interface AudioTrack {
  id: string | number;
  title: string;
  author?: string;
  src: string;
  cover?: string;
  [key: string]: any;
}

export interface AudioState {
  audio: HTMLAudioElement | null;
  playlist: AudioTrack[];
  currentIndex: number;
  initialized: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  ended: boolean;
  repeatMode: 'none' | 'repeat-one' | 'autoplay';
  shuffle: boolean;
  playedIndices: number[];
  history: AudioTrack[];
  
  init: (songs: AudioTrack[]) => void;
  play: () => Promise<void>;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  setMuted: (m: boolean) => void;
  toggleRepeatMode: () => void;
  setRepeatMode: (mode: 'none' | 'repeat-one' | 'autoplay') => void;
  toggleShuffle: () => void;
  setShuffle: (s: boolean) => void;
  getNextShuffleIndex: () => number;
  setIndex: (idx: number, options?: { autoplay?: boolean }) => Promise<void>;
  next: () => Promise<void> | void;
  prev: () => Promise<void> | void;
}

// A single, shared HTMLAudioElement + playback state for the whole app
// Any component can subscribe and control playback; UI always reflects real audio state

const useAudioStore = create<AudioState>()(immer((set, get) => ({
  // Core
  audio: null,           // HTMLAudioElement (singleton)
  playlist: [],          // array of songs [{ id, title, src, cover }]
  currentIndex: 0,
  initialized: false,

  // Reactive state (kept in sync with real audio via events)
  isPlaying: false,      // mirrors !audio.paused
  currentTime: 0,
  duration: 0,
  volume: 1,
  muted: false,
  ended: false,

  // Playback modes
  repeatMode: 'none',    // 'none' | 'repeat-one' | 'autoplay'
  shuffle: false,
  playedIndices: [],     // Track which songs have been played in shuffle mode
  history: [],           // Track recently played songs

  // Initialize once with a playlist
  init: (songs) => set((state) => {
    if (state.initialized) return; // no-op if already set up

    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = songs?.[0]?.src || '';
    audio.volume = state.volume;
    audio.muted = state.muted;

    // Event listeners to sync real audio state back into store
    const onPlay = () => set((s) => { s.isPlaying = true; s.ended = false; });
    const onPause = () => set((s) => { s.isPlaying = false; });
    // Throttle timeupdate to reduce re-renders (update every 250ms instead of ~4x per second)
    const onTime = throttle(() => set((s) => { s.currentTime = audio.currentTime || 0; }), 250);
    const onLoaded = () => set((s) => { s.duration = audio.duration || 0; });
    const onEnded = () => {
      set((s) => { s.isPlaying = false; s.ended = true; });
      // Handle repeat/autoplay modes
      const { repeatMode, next } = get();
      if (repeatMode === 'repeat-one') {
        // Repeat current song
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else if (repeatMode === 'autoplay') {
        // Play next song
        next();
      }
      // If repeatMode is 'none', do nothing (song ends)
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('ended', onEnded);

    // Save listeners for cleanup if ever needed
    (audio as any).__listeners = { onPlay, onPause, onTime, onLoaded, onEnded };

    state.audio = audio as any;
    state.playlist = Array.isArray(songs) ? songs : [];
    state.currentIndex = 0;
    state.initialized = true;
    state.duration = 0;
    state.currentTime = 0;
    state.isPlaying = false;
  }),

  // Controls
  play: async () => {
    const { audio } = get();
    if (!audio) return;
    try { await audio.play(); } catch (_) {}
  },
  pause: () => {
    const { audio } = get();
    if (!audio) return;
    audio.pause();
  },
  togglePlay: () => {
    const { audio } = get();
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  },
  seek: (time) => {
    const { audio } = get();
    if (!audio || Number.isNaN(time)) return;
    audio.currentTime = Math.max(0, Math.min(time, audio.duration || Number.MAX_SAFE_INTEGER));
  },
  setVolume: (v) => set((state) => {
    const volume = Math.max(0, Math.min(1, Number(v)));
    state.volume = Number.isNaN(volume) ? state.volume : volume;
    if (state.audio) state.audio.volume = state.volume;
    if (state.volume > 0 && state.muted) state.muted = false;
  }),
  toggleMute: () => set((state) => {
    state.muted = !state.muted;
    if (state.audio) state.audio.muted = state.muted;
  }),
  setMuted: (m) => set((state) => {
    state.muted = Boolean(m);
    if (state.audio) state.audio.muted = state.muted;
  }),

  // Repeat mode cycling: none -> autoplay -> repeat-one -> none
  toggleRepeatMode: () => set((state) => {
    if (state.repeatMode === 'none') {
      state.repeatMode = 'autoplay';
    } else if (state.repeatMode === 'autoplay') {
      state.repeatMode = 'repeat-one';
    } else {
      state.repeatMode = 'none';
    }
  }),

  setRepeatMode: (mode) => set((state) => {
    state.repeatMode = mode;
  }),

  // Shuffle toggle
  toggleShuffle: () => set((state) => {
    state.shuffle = !state.shuffle;
    if (state.shuffle) {
      // Reset played indices when enabling shuffle
      state.playedIndices = [state.currentIndex];
    } else {
      state.playedIndices = [];
    }
  }),

  setShuffle: (s) => set((state) => {
    state.shuffle = s;
    if (state.shuffle) {
      state.playedIndices = [state.currentIndex];
    } else {
      state.playedIndices = [];
    }
  }),

  // Get next random unplayed song
  getNextShuffleIndex: () => {
    const { playlist, playedIndices, currentIndex } = get();
    
    // Get unplayed indices
    const unplayedIndices = [];
    for (let i = 0; i < playlist.length; i++) {
      if (!playedIndices.includes(i)) {
        unplayedIndices.push(i);
      }
    }
    
    // If all songs played, reset and start over (excluding current)
    if (unplayedIndices.length === 0) {
      set((state) => {
        state.playedIndices = [currentIndex];
      });
      // Get all indices except current
      for (let i = 0; i < playlist.length; i++) {
        if (i !== currentIndex) {
          unplayedIndices.push(i);
        }
      }
    }
    
    // Pick random from unplayed
    if (unplayedIndices.length > 0) {
      const randomIdx = Math.floor(Math.random() * unplayedIndices.length);
      return unplayedIndices[randomIdx];
    }
    
    return (currentIndex + 1) % playlist.length;
  },

  // Track switching
  setIndex: async (idx, { autoplay } = {}) => {
    const wasPlaying = get().isPlaying;
    
    set((state) => {
      const next = ((idx % state.playlist.length) + state.playlist.length) % state.playlist.length;
      state.currentIndex = next;
      
      // Add to played indices if shuffle is on
      if (state.shuffle && !state.playedIndices.includes(next)) {
        state.playedIndices.push(next);
      }
      
      const nextSong = state.playlist?.[next];
      if (nextSong) {
        // Remove from history if it already exists to prevent duplicates
        state.history = state.history.filter((song) => song.id !== nextSong.id);
        // Add to the front of history
        state.history.unshift(nextSong);
        if (state.history.length > 10) state.history.pop();
      }

      if (state.audio) {
        state.audio.pause();
        state.audio.src = nextSong?.src || '';
        state.audio.currentTime = 0;
        state.currentTime = 0;
        state.duration = 0;
        state.ended = false;
      }
    });
    
    // Auto-play if was playing before OR if autoplay is explicitly true
    const shouldAutoplay = autoplay !== undefined ? autoplay : wasPlaying;
    if (shouldAutoplay) {
      // Small delay to ensure audio is loaded
      setTimeout(async () => {
        await get().play();
      }, 50);
    }
  },
  
  next: () => {
    const { currentIndex, playlist, shuffle, repeatMode } = get();
    if (!playlist.length) return;
    
    let nextIdx;
    if (shuffle) {
      nextIdx = get().getNextShuffleIndex();
    } else {
      nextIdx = (currentIndex + 1) % playlist.length;
    }
    
    // Auto-play if autoplay mode is on OR if currently playing
    const shouldAutoplay = repeatMode === 'autoplay' || get().isPlaying;
    return get().setIndex(nextIdx, { autoplay: shouldAutoplay });
  },
  
  prev: () => {
    const { currentIndex, playlist, shuffle, playedIndices, repeatMode } = get();
    if (!playlist.length) return;
    
    let prevIdx;
    if (shuffle && playedIndices.length > 1) {
      // Go to previous played song
      const currentPos = playedIndices.indexOf(currentIndex);
      if (currentPos > 0) {
        prevIdx = playedIndices[currentPos - 1];
        // Remove current from played list so we can go back
        set((state) => {
          state.playedIndices = state.playedIndices.slice(0, currentPos);
        });
      } else {
        prevIdx = (currentIndex - 1 + playlist.length) % playlist.length;
      }
    } else {
      // Normal previous
      prevIdx = (currentIndex - 1 + playlist.length) % playlist.length;
    }
    
    // Auto-play if autoplay mode is on OR if currently playing
    const shouldAutoplay = repeatMode === 'autoplay' || get().isPlaying;
    return get().setIndex(prevIdx, { autoplay: shouldAutoplay });
  },
})));

export default useAudioStore;
