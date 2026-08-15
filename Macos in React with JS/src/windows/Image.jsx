import React from 'react'
import { WindowControls } from '#components'
import WindowWrapper from '#hoc/WindowWrapper'
import useWindowStore from '#store/window'

const ImageFile = () => {
  const { windows } = useWindowStore()
  const data = windows.imgfile?.data

  if (!data) return null

  const { name, imageUrl } = data

  const setAsWallpaper = () => {
    if (!imageUrl) return;
    document.documentElement.style.setProperty(
      '--wallpaper-url', `url('${imageUrl}')`
    );
    localStorage.setItem('wallpaperUrl', imageUrl);
  }

  return (
    <div className="flex flex-col h-full">
      <div id='window-header'>
        <WindowControls target="imgfile" />
        <h2 className="flex items-center justify-center font-bold">{name}</h2>
        <button
          onClick={setAsWallpaper}
          className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
          title="Set as Wallpaper"
        >
          Set as Wallpaper
        </button>
      </div>
      <div className='flex-1 overflow-auto bg-white p-5 flex items-center justify-center'>
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
