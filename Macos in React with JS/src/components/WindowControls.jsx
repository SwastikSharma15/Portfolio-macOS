import useWindowStore from '#store/window'
import React from 'react'

const WindowControls = ({target}) => {

  const { closeWindow, toggleMaximizeWindow } = useWindowStore();

  return (
    <div id='window-controls'>
      <div className='close' onClick={() => closeWindow(target)} />
      <div className='minimize' onClick={() => closeWindow(target)} />
      <div className='maximize' onClick={() => toggleMaximizeWindow(target)} />
    </div>
  )
}

export default WindowControls