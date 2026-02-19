import { WindowControls } from '#components'
import WindowWrapper from '#hoc/WindowWrapper'
import { ExternalLink, ArrowLeft, Gamepad2 } from 'lucide-react'
import useWindowStore from '#store/window'
import useAudioStore from '#store/audio'
import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

const games = [
  {
    id: 'slapner',
    name: 'SlapNer',
    icon: '/images/slapner.png',
    url: 'https://slapner.vercel.app',
    description: 'Wake Ner Up',
    category: 'arcade'
  },
  {
    id: 'chess',
    name: 'Chess',
    icon: '/images/chess.jpg',
    url: 'https://chessnubot.vercel.app/',
    description: 'Play chess online',
    category: 'strategy'
  }
]

const categories = [
  { id: 'all', name: 'All Games', count: games.length },
  { id: 'arcade', name: 'Arcade', count: games.filter(g => g.category === 'arcade').length },
  { id: 'strategy', name: 'Strategy', count: games.filter(g => g.category === 'strategy').length }
]

const Game = () => {
  const { focusWindow, windows } = useWindowStore();
  const { pause } = useAudioStore();
  const iframeRef = useRef(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const isOpen = windows['game']?.isOpen;
  const isMaximized = windows['game']?.isMaximized;
  
  const filteredGames = selectedCategory === 'all' 
    ? games 
    : games.filter(g => g.category === selectedCategory);
  
  const isFocused = (() => {
    const openWindows = Object.values(windows).filter(w => w.isOpen);
    const maxZ = openWindows.reduce((m, w) => Math.max(m, w.zIndex), 0);
    const self = windows['game'];
    return !!self?.isOpen && self?.zIndex === maxZ;
  })();

  useEffect(() => {
    const handler = (e) => {
      if (e?.data === 'focus-game' || e?.data?.type === 'focus-game') {
        focusWindow('game');
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [focusWindow]);

  // Handle audio cleanup when window is closed
  useEffect(() => {
    if (!isOpen && iframeRef.current) {
      pause();
      
      try {
        iframeRef.current.contentWindow?.postMessage({ 
          type: 'pause-all-audio'
        }, '*');
      } catch (e) {
        // Ignore postMessage errors
      }
      
      const timeoutId = setTimeout(() => {
        if (iframeRef.current && !isOpen) {
          const src = iframeRef.current.src;
          iframeRef.current.src = 'about:blank';
          iframeRef.current.dataset.originalSrc = src;
        }
      }, 100);
      
      return () => clearTimeout(timeoutId);
    } else if (isOpen && iframeRef.current?.dataset.originalSrc) {
      const src = iframeRef.current.dataset.originalSrc;
      iframeRef.current.src = src;
      delete iframeRef.current.dataset.originalSrc;
    }
  }, [isOpen, pause]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      pause();
      
      if (iframeRef.current) {
        try {
          iframeRef.current.contentWindow?.postMessage({ 
            type: 'pause-all-audio',
            action: 'stop-audio' 
          }, '*');
        } catch (error) {
          // Ignore errors on unmount
        }
      }
    };
  }, [pause]);

  const handleBackClick = () => {
    setSelectedGame(null);
  };

  return (
    <>
      <div 
        id='window-header' 
        className='window-drag-handle'
      >
        <WindowControls target="game" />
        <h2>{selectedGame ? selectedGame.name : 'Games'}</h2>
        <div className="flex items-center gap-2">
          {selectedGame && (
            <button
              onClick={handleBackClick}
              className="icon p-1 hover:bg-gray-200 rounded hover:cursor-default transition-colors"
              title="Back to Games"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          {selectedGame && (
            <a
              href={selectedGame.url}
              target="_blank"
              rel="noopener noreferrer"
              title={`Open ${selectedGame.name} in New Tab`}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <ExternalLink className="icon mr-3" />
            </a>
          )}
        </div>
      </div>

      {!selectedGame ? (
        // Game Selector View with Sidebar
        <div className="flex bg-white flex-1 overflow-hidden">
          {!isFocused && (
            <button
              type="button"
              aria-label="Activate Games"
              onClick={(e) => {
                e.stopPropagation();
                focusWindow('game');
              }}
              className="absolute inset-0 bg-transparent cursor-pointer z-10"
            />
          )}

          {/* Sidebar */}
          <div className="sidebar w-48 bg-gray-50 border-r border-gray-200 flex flex-col p-5 space-y-3 shrink-0">
            <div>
              <h3 className="text-xs font-medium text-gray-400 mb-2 flex items-center gap-2">
                <Gamepad2 className="w-3 h-3" /> Games
              </h3>
              <ul className="space-y-1">
                {categories.map((category) => (
                  <li
                    key={category.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCategory(category.id);
                      if (isFocused) focusWindow('game');
                    }}
                    className={clsx(
                      'flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors text-sm',
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    <span>{category.name}</span>
                    <span className="text-xs text-gray-500">{category.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Content Area */}
          <div className="content flex-1 p-6 bg-white overflow-y-auto">
            <div className="grid grid-cols-2 gap-6 auto-rows-max">
              {filteredGames.map((game) => (
                <button
                  key={game.id}
                  onClick={() => {
                    if (isFocused) {
                      setSelectedGame(game);
                    }
                  }}
                  className="group flex flex-col items-center gap-4 p-4 bg-none border-none transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <div className="rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow w-50 h-40">
                    <img
                      src={game.icon}
                      alt={game.name}
                      className="w-full h-40 object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-base font-semibold text-gray-800">
                      {game.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {game.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Game View - takes full space
        <div className={`relative flex-1 w-full overflow-hidden bg-white ${isMaximized ? 'h-full' : 'h-152'}`}>
          {!isFocused && (
            <button
              type="button"
              aria-label="Activate Game"
              onClick={(e) => {
                e.stopPropagation();
                focusWindow('game');
              }}
              className="absolute inset-0 bg-transparent cursor-pointer z-10"
            />
          )}
          <iframe
            ref={iframeRef}
            src={selectedGame.url}
            className="w-full h-full border-none block"
            style={{
              pointerEvents: isFocused ? 'auto' : 'none',
            }}
            title={selectedGame.name}
          />
        </div>
      )}
    </>
  )
}

export default WindowWrapper(Game, 'game', 'Games')
