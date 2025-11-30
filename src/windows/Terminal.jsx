import { WindowControls } from '#components'
import { techStack } from '#constants'
import WindowWrapper from '#hoc/WindowWrapper'
import { Check, Flag } from 'lucide-react'
import React from 'react'

const Terminal = () => {
  return (
    <>
      <div id='window-header'>
        <div>
          <WindowControls target='terminal' />
        </div>
        <h2>
          Tech Stack
        </h2>
      </div>
      <div className='techstack'>
        <p>
          <span className='font-bold'>@swastik % </span>
          show tech stack
        </p>
        <div className='label'>
          <p className='w-32'>
            Category
          </p>
          <p>
            Technologies
          </p>
        </div>

        <ul className='content'>
          {techStack.map(({ category, items }) => (
            <li className='flex items-center' key={category}>
              <Check className='check' size={20} />
              <h3>
                {category}
              </h3>
              <ul>
                {items.map((item, i) => (
                  <li key={i}>
                    {item}
                    {i < items.length - 1 ? ',' : ''}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <div className='footnote'>
          <p>
            <Check size={20} /> 5 of 5 stacks loaded successfully
          </p>
          <p className='text-black'>
            <Flag size={15} fill='black'/>
            Render time: 6ms
          </p>
        </div>
      </div>
    </>
  )
}

const TerminalWindow = WindowWrapper(Terminal, 'terminal')

export default TerminalWindow