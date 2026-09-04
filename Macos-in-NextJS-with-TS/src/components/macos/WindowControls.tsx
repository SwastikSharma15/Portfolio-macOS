import useWindowStore, { type WindowKey } from '#store/window'
import React, { useState, useEffect } from 'react'
import { ChevronLeft } from 'lucide-react'

const WindowControls = ({ target }: { target: WindowKey | string }) => {
  const closeWindow = useWindowStore(state => state.closeWindow);
  const startClose = useWindowStore(state => state.startClose);
  const toggleMaximizeWindow = useWindowStore(state => state.toggleMaximizeWindow);
  const winKey = target as WindowKey;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleBack = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Mobile uses instant close (no genie animation)
    closeWindow(winKey);
  };

  const handleClose = () => {
    // Desktop uses animated genie close
    startClose(winKey);
  };

  if (isMobile) {
    return (
      <button
        type="button"
        onClick={handleBack}
        onTouchEnd={handleBack}
        className="flex items-center gap-1 text-blue-500 font-semibold text-base active:opacity-60 py-1.5 px-2 -ml-2 rounded-lg pointer-events-auto select-none cursor-pointer z-50 relative"
        aria-label="Back"
      >
        <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        <span>Back</span>
      </button>
    );
  }

  return (
    <div id='window-controls'>
      <div className='close' onClick={handleClose} />
      <div className='minimize' onClick={handleClose} />
      <div className='maximize' onClick={() => toggleMaximizeWindow(winKey)} />
    </div>
  )
}

export default WindowControls