import { WindowControls } from '#components'
import { songs } from '#constants'
import WindowWrapper from '#hoc/WindowWrapper'
import useWindowStore from '#store/window'
import useAudioStore from '#store/audio'
import React, { useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'

const formatTime = (s) => {
  if (!s || Number.isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

const Music = () => {
  const { windows } = useWindowStore();
  const isOpen = windows.music?.isOpen;

  const {
    init,
    playlist,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    muted,
    play,
    pause,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    next,
    prev,
    setIndex,
  } = useAudioStore();

  // Initialize the shared audio controller once
  useEffect(() => {
    init(songs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pause playback when the Music window is closed
  useEffect(() => {
    if (isOpen === false) {
      pause();
    }
  }, [isOpen, pause])

  const seekHandler = (e) => {
    const val = Number(e.target.value);
    seek(val);
  };

  const changeVolume = (e) => {
    const val = Number(e.target.value);
    setVolume(val);
  };

  const selectSong = (idx) => {
    // Continue playing if we were already playing
    setIndex(idx);
  };

  const current = playlist?.[currentIndex] || songs[currentIndex] || null;

  return (
    <div className="flex flex-col h-full">
      <div id='window-header' className='window-drag-handle'>
        <WindowControls target="music" />
        <h2 className='flex-1 text-center font-bold'>Music</h2>
      </div>
      <div className='flex w-full flex-1 min-h-0'>
        <div className='sidebar'>
          <h2>Playlist</h2>
          <ul>
            {songs.map((song, idx) => (
              <li
                key={song.id}
                onClick={() => selectSong(idx)}
                className={idx === currentIndex ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}
                title={song.title}
              >
                <img src={song.cover} alt="cover" className='w-5 h-5 object-cover rounded' loading='lazy' />
                <p className='truncate'>{song.title}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className='player'>
          <div className='cover'>
            <img src={current?.cover || '/images/music.png'} alt={current?.title || 'Cover'} loading='lazy' />
          </div>
          <div className='mt-6 text-center'>
            <h3 className='text-3xl font-bold'>{current?.title || 'Unknown'}</h3>
            <p className='text-sm text-gray-500 mt-1'>{current?.author || 'Unknown'}</p>
          </div>
          <div className='sliders mt-3'>
            <div className='flex-1'>
              <input
                type='range'
                min={0}
                max={Math.max(duration, 0)}
                step={0.01}
                value={Math.min(currentTime, duration || 0)}
                onChange={seekHandler}
                className='w-full accent-red-500'
                onMouseDown={(e) => e.stopPropagation()}
                onMouseDownCapture={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className='flex justify-between text-xs text-gray-500 mt-1'>
            <span>{formatTime(currentTime)}</span> &nbsp; - &nbsp;
            <span>{formatTime(duration)}</span>
          </div>
          <div className='flex items-center justify-center gap-6 mt-4'>
            <button aria-label='Previous' onClick={prev} className='p-2 rounded-full bg-gray-100 hover:bg-gray-200'>
              <SkipBack size={22} className='text-gray-700' />
            </button>
            <button aria-label='Play/Pause' onClick={togglePlay} className='w-12 h-12 rounded-full bg-red-500 flex items-center justify-center shadow-md hover:bg-red-600'>
              {isPlaying ? <Pause size={28} className='text-white' /> : <Play size={28} className='text-white' />}
            </button>
            <button aria-label='Next' onClick={next} className='p-2 rounded-full bg-gray-100 hover:bg-gray-200'>
              <SkipForward size={22} className='text-gray-700' />
            </button>
          </div>
          <div className='sliders mt-4 flex-center mr-2 scale-75'>
            <button aria-label='Mute' onClick={toggleMute} className='p-2 rounded bg-gray-100 hover:bg-gray-200'>
              {muted || volume === 0 ? <VolumeX size={18} className='text-gray-600' /> : <Volume2 size={18} className='text-gray-600' />}
            </button>
            <input
              type='range'
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={changeVolume}
              className='accent-gray-600 w-1/2 mx-auto'
              onMouseDown={(e) => e.stopPropagation()}
              onMouseDownCapture={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            />
          </div>
          {/* Centralized audio: no <audio> element needed; store manages a single Audio instance */}
        </div>
      </div>
    </div>
  )
}

const MusicWindow = WindowWrapper(Music, 'music')

export default MusicWindow
