import React from 'react'
import { WindowControls } from '#components'
import WindowWrapper from '#hoc/WindowWrapper'
import useWindowStore from '#store/window'

const ImageFile = () => {
  const { windows } = useWindowStore() as any;
  const data = windows.imgfile?.data;

  if (!data) return null;

  const { name, imageUrl } = data;

  const setAsWallpaper = () => {
    if (!imageUrl) return;
    document.documentElement.style.setProperty(
      '--wallpaper-url', `url('${imageUrl}')`
    );
    localStorage.setItem('wallpaperUrl', imageUrl);
  };

  const handleWallpaper = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAsWallpaper();
  };

  return (
    <div className="flex flex-col h-full bg-black text-white">
      <div id='window-header' className="window-drag-handle flex items-center justify-between px-4 border-b border-gray-800 relative z-40 pointer-events-auto [.mobile-view_&]:pt-12 [.mobile-view_&]:pb-3 [.mobile-view_&]:bg-black/90 [.mobile-view_&]:backdrop-blur-xl">
        <WindowControls target="imgfile" />
        <h2 className="text-center font-bold truncate px-2 text-white text-base">{name}</h2>
        <button
          type="button"
          onClick={handleWallpaper}
          onTouchEnd={handleWallpaper}
          className="px-2.5 py-1 text-xs rounded-lg bg-blue-600 text-white hover:bg-blue-500 font-medium active:scale-95 transition-all shadow relative z-50 pointer-events-auto cursor-pointer"
          title="Set as Wallpaper"
        >
          Set Wallpaper
        </button>
      </div>
      <div className='flex-1 overflow-auto bg-black p-4 flex items-center justify-center select-none'>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            loading='lazy'
            className='max-w-full max-h-full object-contain rounded'
          />
        ) : null}
      </div>
    </div>
  )
}

const ImageWindow = WindowWrapper(ImageFile, 'imgfile')

export default ImageWindow
