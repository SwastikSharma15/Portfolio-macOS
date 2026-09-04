import { WindowControls } from '#components'
import WindowWrapper from '#hoc/WindowWrapper'
import { ExternalLink } from 'lucide-react/dist/esm/icons'
import useWindowStore from '#store/window'
import { useEffect } from 'react'

const VSCode = () => {
  const focusWindow = useWindowStore(state => state.focusWindow);
  const isFocused = useWindowStore(state => {
    const self = state.windows['vscode'];
    if (!self?.isOpen) return false;
    let maxZ = 0;
    for (const key in state.windows) {
      const w = state.windows[key as keyof typeof state.windows];
      if (w.isOpen && w.zIndex > maxZ) maxZ = w.zIndex;
    }
    return self.zIndex === maxZ;
  });

  useEffect(() => {
    const handler = (e) => {
      if (e?.data === 'focus-vscode' || e?.data?.type === 'focus-vscode') {
        focusWindow('vscode');
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [focusWindow]);

  return (
    <>
      <div 
        id='window-header' 
        className='window-drag-handle'
        style={{ backgroundColor: '#f3f4f6' }}
      >
        <WindowControls target="vscode" />
        <h2>VS Code Web IDE</h2>
        <a
          href="https://vs-code-web-ide.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          title="Open VS Code in New Tab"
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
            aria-label="Activate VS Code"
            onClick={(e) => {
              e.stopPropagation();
              focusWindow('vscode');
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
          src="https://vs-code-web-ide.vercel.app/"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block',
            pointerEvents: isFocused ? 'auto' : 'none',
          }}
          title="VS Code Web IDE"
        />
      </div>
    </>
  )
}

export default WindowWrapper(VSCode, 'vscode')
