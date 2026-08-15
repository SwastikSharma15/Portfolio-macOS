import { WindowControls } from '#components'
import { locations } from '#constants'
import WindowWrapper from '#hoc/WindowWrapper'
import useLocationStore from '#store/location'
import React, { useEffect } from 'react'
import { Trash2 } from 'lucide-react/dist/esm/icons'

const Trash = () => {
  const { setActiveLocation } = useLocationStore()

  useEffect(() => {
    // When Trash window opens, set the active location to trash
    setActiveLocation(locations.trash)
  }, [setActiveLocation])

  return (
    <>
      <div id='window-header'>
        <WindowControls target="trash" />
        <Trash2 size={18} className='text-gray-600' />
        <h2 className='flex-1 text-center'>Trash</h2>
      </div>
      <div className='flex bg-white h-full'>
        <div className='sidebar'>
          <h2>Favorites</h2>
          <ul>
            <li className='flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors bg-blue-100 text-blue-700'>
              <img src={locations.trash.icon} className='w-4' alt='Trash' loading='lazy' />
              <p className='text-sm font-medium truncate'>{locations.trash.name}</p>
            </li>
          </ul>
        </div>
        <ul className='content'>
          {locations.trash.children.map((item) => (
            <li
              key={item.id}
              className={item.position}
            >
              <img src={item.icon} alt={item.name} loading='lazy' />
              <p>{item.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

const TrashWindow = WindowWrapper(Trash, 'trash')

export default TrashWindow
