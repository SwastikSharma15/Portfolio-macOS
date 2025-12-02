import { WindowControls } from '#components'
import { socials } from '#constants'
import WindowWrapper from '#hoc/WindowWrapper'
import { Mail } from 'lucide-react'
import React from 'react'

const Contact = () => {
  const email = 'swastik15.sharma.work@gmail.com'
  
  return (
    <>
      <div id='window-header' className='flex items-center justify-between'>
        <WindowControls target="contact" />
        <h2 className='flex-1 text-center'>Contact Me</h2>
        <a
          href={`mailto:${email}`}
          title={`Email: ${email}`}
          className='p-2 hover:bg-gray-200 rounded-md transition-colors'
        >
          <Mail size={17} />
        </a>
      </div>
      <div className='p-5 space-y-5'>
        <img
          src='/images/swastik.jpg'
          alt='Swastik'
          loading='lazy'
          className='w-20 rounded-full'
        />
        <h3>
          Let's Connect
        </h3>
        <p>
          Got an Idea? A bug to squash? Or just wanna talk tech? I'm in.
        </p>
        <p>
          swastik15.sharma.work@gmail.com
        </p>
        <ul>
          {socials.map(({id, bg, link, icon, text}) => (
            <li key={id} style={{backgroundColor: bg}}>
              <a 
                href={link} 
                target='_blank' 
                rel='noopener noreferrer'
                title={text}
              >
                <img
                  src={icon}
                  alt={text}
                  loading='lazy'
                  className='size-5'
                />
                <p>
                  {text}
                </p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

const ContactWindow = WindowWrapper(Contact, 'contact')

export default ContactWindow;
