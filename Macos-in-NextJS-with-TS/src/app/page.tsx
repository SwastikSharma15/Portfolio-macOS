"use client";

import React, { Suspense, lazy, useEffect, useState } from 'react'
import useWindowStore from '#store/window'

// Lazy load macOS components
const NavBar = lazy(() => import('#components/macos/NavBar'))
const Welcome = lazy(() => import('#components/macos/Welcome'))
const Dock = lazy(() => import('#components/macos/Dock'))
const Home = lazy(() => import('#components/macos/Home'))

// Lazy load iOS Layout
const IosLayout = lazy(() => import('#components/ios/IosLayout'))
const IosAppWrapper = lazy(() => import('#components/ios/IosAppWrapper'))

const Finder = lazy(() => import('#windows/Finder'))
const Resume = lazy(() => import('#windows/Resume'))
const Safari = lazy(() => import('#windows/Safari'))
const Terminal = lazy(() => import('#windows/Terminal'))
const Text = lazy(() => import('#windows/Text'))
const Image = lazy(() => import('#windows/Image'))
const Contact = lazy(() => import('#windows/Contact'))
const Photos = lazy(() => import('#windows/Photos'))
const Music = lazy(() => import('#windows/Music'))
const Game = lazy(() => import('#windows/Game'))
const Trash = lazy(() => import('#windows/Trash'))
const VSCode = lazy(() => import('#windows/VSCode'))

const Analytics = lazy(() => import('@vercel/analytics/react').then(m => ({ default: m.Analytics })));
const SpeedInsights = lazy(() => import('@vercel/speed-insights/react').then(m => ({ default: m.SpeedInsights })));

const App = () => {
  const { windows } = useWindowStore() as any;
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('wallpaperUrl');
    if (saved) { 
      document.documentElement.style.setProperty(
        '--wallpaper-url', `url('${saved}')`
      );
    }
  }, []);

  useEffect(() => {
    if (isMobile) return;
    
    // Dynamically register GSAP
    import('gsap').then(({ gsap }) => {
      import('gsap/Draggable').then(({ Draggable }) => {
        gsap.registerPlugin(Draggable);
      });
    });

    const preloadModules = () => {
      import('#windows/Finder');
      import('#windows/Resume');
      import('#windows/Safari');
      import('#windows/Terminal');
      import('#windows/Text');
      import('#windows/Image');
      import('#windows/Contact');
      import('#windows/Photos');
      import('#windows/Music');
      import('#windows/Game');
      import('#windows/Trash');
      import('#windows/VSCode');
    };
    if ('requestIdleCallback' in window) {
      // @ts-ignore
      requestIdleCallback(preloadModules);
    } else {
      setTimeout(preloadModules, 100);
    }
  }, [isMobile]);

  if (!mounted) return null; // Avoid hydration mismatch
  
  return (
    <>
      <main className={isMobile ? 'mobile-view' : ''}>
        <Suspense fallback={<div />}>
          {isMobile ? (
            <IosLayout />
          ) : (
            <>
              <NavBar />
              <Welcome />
              <Dock />
              <Home />
            </>
          )}
        </Suspense>

        {/* Windows are rendered for both desktop and mobile. 
            On mobile, CSS will override them to be full screen iOS apps. */}
        <>
          {windows['terminal']?.isOpen && <Suspense fallback={null}><Terminal /></Suspense>}
          {windows['safari']?.isOpen && <Suspense fallback={null}><Safari /></Suspense>}
          {windows['resume']?.isOpen && <Suspense fallback={null}><Resume /></Suspense>}
          {windows['imgfile']?.isOpen && <Suspense fallback={null}><Image /></Suspense>}
          {windows['txtfile']?.isOpen && <Suspense fallback={null}><Text /></Suspense>}
          {windows['finder']?.isOpen && <Suspense fallback={null}><Finder /></Suspense>}
          {windows['contact']?.isOpen && <Suspense fallback={null}><Contact /></Suspense>}
          {windows['photos']?.isOpen && <Suspense fallback={null}><Photos /></Suspense>}
          {windows['music']?.isOpen && <Suspense fallback={null}><Music /></Suspense>}
          {windows['game']?.isOpen && <Suspense fallback={null}><Game /></Suspense>}
          {windows['vscode']?.isOpen && <Suspense fallback={null}><VSCode /></Suspense>}
          {windows['trash']?.isOpen && <Suspense fallback={null}><Trash /></Suspense>}
          
          {isMobile && <Suspense fallback={null}><IosAppWrapper /></Suspense>}
        </>
      </main>
      
      <Suspense fallback={null}>
        <Analytics />
        <SpeedInsights />
      </Suspense>
    </>
  )
}

export default App
