import React, { Suspense, lazy, useEffect, useState } from 'react'
import useWindowStore from '#store/window'

// Detect mobile once
const isMobile = typeof window !== 'undefined' && window.innerWidth <= 640;

// Lazy load components
const NavBar = lazy(() => import('./components/NavBar.jsx'))
const Welcome = lazy(() => import('./components/Welcome.jsx'))
const Dock = lazy(() => import('./components/Dock.jsx'))
const Home = lazy(() => import('./components/Home.jsx'))

const Finder = lazy(() => import('./windows/Finder.jsx'))
const Resume = lazy(() => import('./windows/Resume.jsx'))
const Safari = lazy(() => import('./windows/Safari.jsx'))
const Terminal = lazy(() => import('./windows/Terminal.jsx'))
const Text = lazy(() => import('./windows/Text.jsx'))
const Image = lazy(() => import('./windows/Image.jsx'))
const Contact = lazy(() => import('./windows/Contact.jsx'))
const Photos = lazy(() => import('./windows/Photos.jsx'))
const Music = lazy(() => import('./windows/Music.jsx'))
const Game = lazy(() => import('./windows/Game.jsx'))
const Trash = lazy(() => import('./windows/Trash.jsx'))
const VSCode = lazy(() => import('./windows/VSCode.jsx'))

// Lazy load analytics only on desktop
const Analytics = !isMobile ? lazy(() => import('@vercel/analytics/react').then(m => ({ default: m.Analytics }))) : null;
const SpeedInsights = !isMobile ? lazy(() => import('@vercel/speed-insights/react').then(m => ({ default: m.SpeedInsights }))) : null;

// Only register GSAP plugins on desktop for better mobile performance
if (!isMobile) {
  import('gsap').then(({ gsap }) => {
    import('gsap/Draggable').then(({ Draggable }) => {
      gsap.registerPlugin(Draggable);
    });
  });
}

const App = () => {
  const { windows } = useWindowStore();
  const [eagerMount, setEagerMount] = useState(false);
  
  useEffect(() => {
    const saved = localStorage.getItem('wallpaperUrl');
    if (saved && !isMobile) { // Only apply custom wallpaper on desktop
      document.documentElement.style.setProperty(
        '--wallpaper-url', `url('${saved}')`
      );
    }
  }, []);

  useEffect(() => {
    // Skip eager mounting on mobile to improve initial load
    if (isMobile) return;
    
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
      import('./windows/Game.jsx');
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
        <Suspense fallback={<div />}>
          <NavBar />
          <Welcome />
          <Dock />
        </Suspense>
        {!isMobile && eagerMount ? (
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
            <Suspense fallback={null}><Game /></Suspense>
            <Suspense fallback={null}><VSCode /></Suspense>
            <Suspense fallback={null}><Trash /></Suspense>
          </>
        ) : null}
        {!isMobile && <Suspense fallback={null}><Home /></Suspense>}
      </main>
      {/* Defer analytics on mobile for better performance */}
      {!isMobile && Analytics && SpeedInsights && (
        <Suspense fallback={null}>
          <Analytics />
          <SpeedInsights />
        </Suspense>
      )}
    </>
  )
}

export default App
