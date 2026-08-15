import React, { useEffect } from 'react';
import useWindowStore from '#store/window';

const IosAppWrapper = () => {
  const windows = useWindowStore((state: any) => state.windows);
  const closeWindow = useWindowStore((state: any) => state.closeWindow);

  // Find the top-most open window
  const openWindows = Object.entries(windows)
    .filter(([_, win]: [string, any]) => win.isOpen)
    .sort((a: any, b: any) => b[1].zIndex - a[1].zIndex);

  const activeAppId = openWindows.length > 0 ? openWindows[0][0] : null;

  // Swipe up to close active window on mobile
  useEffect(() => {
    if (!activeAppId) return;

    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const windowHeight = window.innerHeight;
      const isBottom20 = touchStartY > windowHeight * 0.8;

      if (!isBottom20) return;

      const touchY = e.touches[0].clientY;
      const diff = touchStartY - touchY;

      // If swiped up more than 70px, close the active window
      if (diff > 70) {
        closeWindow(activeAppId);
      }
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [activeAppId, closeWindow]);

  if (!activeAppId) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full h-8 z-[99999] flex justify-center items-end pb-2 pointer-events-auto">
      {/* iOS Home Indicator - click or swipe up to go home/close app */}
      <button
        onClick={() => closeWindow(activeAppId)}
        className="w-32 h-1.5 bg-gray-400/80 dark:bg-white/80 backdrop-blur-md rounded-full shadow-md hover:bg-white transition-all active:scale-95 cursor-pointer"
        aria-label="Close app"
      />
    </div>
  );
};

export default IosAppWrapper;
