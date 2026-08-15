import { WindowControls } from '#components'
import WindowWrapper from '#hoc/WindowWrapper'
import { ExternalLink } from 'lucide-react/dist/esm/icons'
import useWindowStore from '#store/window'
import useAudioStore from '#store/audio'
import { useEffect, useRef } from 'react'

const Ner = () => {
  const { focusWindow, windows } = useWindowStore();
  const { pause } = useAudioStore();
  const iframeRef = useRef(null);
  const isOpen = windows['ner']?.isOpen;
  
  const isFocused = (() => {
    const openWindows = Object.values(windows).filter(w => w.isOpen);
    const maxZ = openWindows.reduce((m, w) => Math.max(m, w.zIndex), 0);
    const self = windows['ner'];
    return !!self?.isOpen && self?.zIndex === maxZ;
  })();

  useEffect(() => {
    const handler = (e) => {
      if (e?.data === 'focus-ner' || e?.data?.type === 'focus-ner') {
        focusWindow('ner');
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [focusWindow]);

  // Handle audio cleanup when window is closed
  useEffect(() => {
    if (!isOpen && iframeRef.current) {
      // Stop main audio store
      pause();
      
      // Send stop message to iframe
      try {
        iframeRef.current.contentWindow?.postMessage({ 
          type: 'pause-all-audio'
        }, '*');
      } catch (e) {
        // Ignore postMessage errors
      }
      
      // Force stop by blanking iframe after a short delay
      const timeoutId = setTimeout(() => {
        if (iframeRef.current && !isOpen) {
          const src = iframeRef.current.src;
          iframeRef.current.src = 'about:blank';
          iframeRef.current.dataset.originalSrc = src;
        }
      }, 100);
      
      return () => clearTimeout(timeoutId);
    } else if (isOpen && iframeRef.current?.dataset.originalSrc) {
      // Restore iframe when reopening
      const src = iframeRef.current.dataset.originalSrc;
      iframeRef.current.src = src;
      delete iframeRef.current.dataset.originalSrc;
    }
  }, [isOpen, pause]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      // Stop main audio when component unmounts
      pause();
      
      // Try to stop iframe audio on unmount
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

  return (
    <>
      <div 
        id='window-header' 
        className='window-drag-handle'
        style={{ backgroundColor: '#f3f4f6' }}
      >
        <WindowControls target="ner" />
        <h2>SlapNer</h2>
        <a
          href="https://slapner.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          title="Open SlapNer in New Tab"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <ExternalLink className="icon mr-3" />
        </a>
      </div>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 'calc(100% - 48px)',
        }}
      >
        {!isFocused && (
          <button
            type="button"
            aria-label="Activate SlapNer"
            onClick={(e) => {
              e.stopPropagation();
              focusWindow('ner');
            }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'transparent',
              cursor: 'pointer',
            }}
          />
        )}
        <iframe
          ref={iframeRef}
          src="https://slapner.vercel.app"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block',
            pointerEvents: isFocused ? 'auto' : 'none',
          }}
          title="SlapNer"
        />
      </div>
    </>
  )
}

export default WindowWrapper(Ner, 'ner', 'SlapNer')