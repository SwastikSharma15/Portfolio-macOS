import { WindowControls } from '#components'
import { songs } from '#constants'
import WindowWrapper from '#hoc/WindowWrapper'
import React, { useEffect, useRef, useState } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'

const formatTime = (s) => {
  if (!s || Number.isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

const Music = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [prevVolume, setPrevVolume] = useState(1)

  const audioRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onLoaded = () => setDuration(audio.duration || 0)
    const onTime = () => setCurrentTime(audio.currentTime || 0)
    const onEnded = () => setIsPlaying(false)

    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('ended', onEnded)
    }
  }, [currentIndex])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume
    audio.muted = muted
  }, [volume, muted])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
      setIsPlaying(true)
    }
  }

  const seek = (e) => {
    const audio = audioRef.current
    if (!audio) return
    const val = Number(e.target.value)
    audio.currentTime = val
    setCurrentTime(val)
  }

  const changeVolume = (e) => {
    const val = Number(e.target.value)
    if (muted && val > 0) setMuted(false)
    setVolume(val)
  }

  const selectSong = (idx) => {
    setCurrentIndex(idx)
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
    setTimeout(() => {
      if (isPlaying) audio.play()
    }, 0)
  }

  const current = songs[currentIndex]

  const prevSong = () => {
    const next = (currentIndex - 1 + songs.length) % songs.length
    selectSong(next)
  }

  const nextSong = () => {
    const next = (currentIndex + 1) % songs.length
    selectSong(next)
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    if (muted) {
      setMuted(false)
      setVolume(prevVolume || 1)
      audio.muted = false
      audio.volume = prevVolume || 1
    } else {
      setPrevVolume(volume)
      setMuted(true)
      audio.muted = true
      audio.volume = 0
    }
  }

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
            <p className='text-sm text-gray-500 mt-1'>Audio</p>
          </div>
          <div className='sliders mt-3'>
            <div className='flex-1'>
              <input
                type='range'
                min={0}
                max={Math.max(duration, 0)}
                step={0.01}
                value={Math.min(currentTime, duration || 0)}
                onChange={seek}
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
            <button aria-label='Previous' onClick={prevSong} className='p-2 rounded-full bg-gray-100 hover:bg-gray-200'>
              <SkipBack size={22} className='text-gray-700' />
            </button>
            <button aria-label='Play/Pause' onClick={togglePlay} className='w-12 h-12 rounded-full bg-red-500 flex items-center justify-center shadow-md hover:bg-red-600'>
              {isPlaying ? <Pause size={28} className='text-white' /> : <Play size={28} className='text-white' />}
            </button>
            <button aria-label='Next' onClick={nextSong} className='p-2 rounded-full bg-gray-100 hover:bg-gray-200'>
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
          <audio ref={audioRef} src={current?.src} preload='auto' />
        </div>
      </div>
    </div>
  )
}

const MusicWindow = WindowWrapper(Music, 'music')

export default MusicWindow
