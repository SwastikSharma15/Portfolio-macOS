import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import React, { Suspense, lazy, useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { NavBar, Welcome, Dock, Home } from '#components';
import useWindowStore from '#store/window'

const Finder = lazy(() => import('./windows/Finder.jsx'))
const Resume = lazy(() => import('./windows/Resume.jsx'))
const Safari = lazy(() => import('./windows/Safari.jsx'))
const Terminal = lazy(() => import('./windows/Terminal.jsx'))
const Text = lazy(() => import('./windows/Text.jsx'))
const Image = lazy(() => import('./windows/Image.jsx'))
const Contact = lazy(() => import('./windows/Contact.jsx'))
const Photos = lazy(() => import('./windows/Photos.jsx'))
const Music = lazy(() => import('./windows/Music.jsx'))
const Trash = lazy(() => import('./windows/Trash.jsx'))
const VSCode = lazy(() => import('./windows/VSCode.jsx'))

gsap.registerPlugin(Draggable);

const App = () => {
  const { windows } = useWindowStore();
  const [eagerMount, setEagerMount] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem('wallpaperUrl');
    if (saved) {
      document.documentElement.style.setProperty(
        '--wallpaper-url', `url('${saved}')`
      );
    }
  }, []);

  useEffect(() => {
    const start = () => {
      setEagerMount(true);
      // warm the import cache so subsequent mounts don't suspend
      import('./windows/Finder.jsx');
      import('./windows/Resume.jsx');
      import('./windows/Safari.jsx');
      import('./windows/Terminal.jsx');
      import('./windows/Text.jsx');
      import('./windows/Image.jsx');
      import('./windows/Contact.jsx');
      import('./windows/Photos.jsx');
      import('./windows/Music.jsx');
      import('./windows/Trash.jsx');
      import('./windows/VSCode.jsx');
    };
    if ('requestIdleCallback' in window) {
      // @ts-ignore
      requestIdleCallback(start);
    } else {
      setTimeout(start, 100);
    }
  }, []);
  return (
    <>
      <main>
        <NavBar />
        <Welcome />
        <Dock />
        {eagerMount ? (
          <>
            <Suspense fallback={null}><Terminal /></Suspense>
            <Suspense fallback={null}><Safari /></Suspense>
            <Suspense fallback={null}><Resume /></Suspense>
            <Suspense fallback={null}><Image /></Suspense>
            <Suspense fallback={null}><Text /></Suspense>
            <Suspense fallback={null}><Finder /></Suspense>
            <Suspense fallback={null}><Contact /></Suspense>
            <Suspense fallback={null}><Photos /></Suspense>
            <Suspense fallback={null}><Music /></Suspense>
            <Suspense fallback={null}><VSCode /></Suspense>
            <Suspense fallback={null}><Trash /></Suspense>
          </>
        ) : null}
        <Home />
      </main>
      <Analytics />
    </>
  )
}

export default App
