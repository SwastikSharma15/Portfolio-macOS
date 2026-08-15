import { socials } from '#constants'
import { Mail } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import clsx from 'clsx'

export const ContactApp = () => {
  const email = 'swastik15.sharma.work@gmail.com'
  const [showModal, setShowModal] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [result, setResult] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { register, reset, handleSubmit, formState: { errors } } = useForm()

  const accessKey1 = (import.meta as any).env?.VITE_WEB3FORMS_ACCESS_KEY_1 || '18536a8d-1f17-4f02-97b1-e5cf2b45e4fb'
  const accessKey2 = (import.meta as any).env?.VITE_WEB3FORMS_ACCESS_KEY_2 || '3632924f-f67c-4571-883a-ae15e8c4ed16'

  const submitToBothEndpoints = async (formData: any) => {
    setSubmitting(true)
    setResult('Sending message...')

    const submitToEndpoint = async (accessKey: string) => {
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            access_key: accessKey,
            from_name: 'iOS Portfolio – Contact',
            subject: 'New Contact Message from iOS Portfolio',
            ...formData
          })
        })
        const result = await response.json()
        return { success: response.ok, message: result.message }
      } catch (error: any) {
        return { success: false, message: error.message }
      }
    }

    const [result1, result2] = await Promise.all([
      submitToEndpoint(accessKey1),
      submitToEndpoint(accessKey2)
    ])

    if (result1.success || result2.success) {
      setIsSuccess(true)
      setResult('Message sent successfully!')
      reset()
    } else {
      setIsSuccess(false)
      setResult('Failed to send message.')
    }
    setSubmitting(false)
  }

  useEffect(() => {
    if (isSuccess && showModal) {
      const t = setTimeout(() => setShowModal(false), 1800)
      return () => clearTimeout(t)
    }
  }, [isSuccess, showModal])

  return (
    <div className='flex-1 w-full bg-[#f2f2f7] min-h-full pb-20'>
      {/* Profile Header section */}
      <div className="flex flex-col items-center pt-8 pb-4">
        <img
          src='/images/swastik_2.jpeg'
          alt='Swastik'
          loading='lazy'
          className='w-28 h-28 object-cover object-top rounded-full shadow-md border-2 border-white'
        />
        <h2 className="text-2xl font-semibold mt-4 text-black">Swastik Sharma</h2>
        <p className="text-[#8e8e93] text-sm mt-1">Open for work & collaboration</p>
      </div>

      {/* Main Actions Group */}
      <div className="px-4 mt-2">
        <div className="bg-white rounded-[10px] overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200/60 active:bg-gray-100 transition-colors">
            <div className="w-7 h-7 bg-[#007aff] rounded-md flex items-center justify-center">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[17px] text-black">Email</p>
              <a href={`mailto:${email}`} className="text-sm text-[#007aff]">{email}</a>
            </div>
          </div>

          <button
            onClick={() => {
              setIsSuccess(false)
              setResult('')
              setShowModal(true)
            }}
            className="w-full flex items-center gap-3 px-4 py-3 active:bg-gray-100 transition-colors text-left"
          >
            <div className="w-7 h-7 bg-[#34c759] rounded-md flex items-center justify-center">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[17px] text-black">Contact Form</p>
              <p className="text-sm text-[#8e8e93]">Send me a direct message</p>
            </div>
          </button>
        </div>
      </div>

      {/* Socials Group */}
      <div className="px-4 mt-6">
        <h3 className="text-[13px] text-[#6d6d72] uppercase font-normal ml-4 mb-2 tracking-wide">Social Networks</h3>
        <div className="bg-white rounded-[10px] overflow-hidden">
          {socials.map(({ id, bg, link, icon, text }, index) => (
            <a
              key={id}
              href={link}
              target='_blank'
              rel='noopener noreferrer'
              className={`flex items-center gap-3 px-4 py-3 active:bg-gray-100 transition-colors ${index !== socials.length - 1 ? 'border-b border-gray-200/60' : ''}`}
            >
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center"
                style={{ backgroundColor: bg }}
              >
                <img src={icon} alt={text} className='w-4 h-4 object-contain brightness-0 invert' />
              </div>
              <p className="text-[17px] text-black flex-1">{text}</p>
              <span className="text-[#c7c7cc] text-xl font-light">›</span>
            </a>
          ))}
        </div>
      </div>

      {/* Contact Form Modal */}
      {showModal && (
        <div className='fixed inset-0 z-[100] flex flex-col justify-end bg-black/40 backdrop-blur-sm'>
          <div className='w-full bg-[#f2f2f7] rounded-t-[20px] shadow-2xl overflow-hidden mt-20 h-[85vh] flex flex-col'>
            {/* Modal Header */}
            <div className='flex items-center justify-between border-b border-gray-200/60 px-4 py-3 bg-white'>
              <button
                onClick={() => setShowModal(false)}
                className='text-[#007aff] text-[17px]'
              >
                Cancel
              </button>
              <h3 className='text-[17px] font-semibold text-black'>New Message</h3>
              <button
                onClick={handleSubmit((data) => submitToBothEndpoints(data))}
                disabled={submitting}
                className='text-[#007aff] text-[17px] font-semibold disabled:opacity-50'
              >
                {submitting ? 'Sending...' : 'Send'}
              </button>
            </div>

            {/* Form Content */}
            <div className='flex-1 overflow-y-auto px-4 py-6'>
              <form className='space-y-6'>
                <div className='bg-white rounded-[10px] overflow-hidden'>
                  <div className='flex items-center border-b border-gray-200/60 px-4 py-3'>
                    <label className='w-20 text-[17px] text-black'>To:</label>
                    <input
                      type='text'
                      value="Swastik Sharma"
                      disabled
                      className='flex-1 text-[17px] outline-none text-[#8e8e93] bg-transparent'
                    />
                  </div>
                  <div className='flex items-center border-b border-gray-200/60 px-4 py-3'>
                    <label className='w-20 text-[17px] text-black'>Name:</label>
                    <input
                      type='text'
                      placeholder='Your name'
                      className='flex-1 text-[17px] outline-none text-black bg-transparent'
                      {...register('name', { required: 'Name is required' })}
                    />
                  </div>
                  <div className='flex items-center px-4 py-3'>
                    <label className='w-20 text-[17px] text-black'>Email:</label>
                    <input
                      type='email'
                      placeholder='you@example.com'
                      className='flex-1 text-[17px] outline-none text-black bg-transparent'
                      {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /[^@\s]+@[^@\s]+\.[^@\s]+/, message: 'Valid email required' }
                      })}
                    />
                  </div>
                </div>

                <div className='bg-white rounded-[10px] overflow-hidden p-4'>
                  <textarea
                    rows={8}
                    className='w-full resize-none text-[17px] outline-none text-black bg-transparent placeholder-[#8e8e93]'
                    placeholder="Message..."
                    {...register('message', { required: 'Message is required', minLength: 10 })}
                  />
                </div>

                <input type="text" {...register('botcheck')} className="hidden" />

                {(errors.name || errors.email || errors.message || result) && (
                  <div className='px-4'>
                    <p className={`text-sm text-center ${isSuccess ? 'text-[#34c759]' : 'text-[#ff3b30]'}`}>
                      {errors.name ? String(errors.name.message) :
                        errors.email ? String(errors.email.message) :
                          errors.message ? String(errors.message.message) : result}
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
