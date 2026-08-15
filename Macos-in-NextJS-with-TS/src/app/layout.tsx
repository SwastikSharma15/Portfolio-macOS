import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'
import { Providers } from "@/components/shared/providers"

export const viewport = {
  themeColor: '#111827',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: 'Swastik Sharma | Frontend Developer Portfolio | Swastik Macolio',
    template: '%s | Swastik Sharma'
  },
  description: 'A fully interactive macOS and iOS-style portfolio built with Next.js and TypeScript, featuring a draggable dock, window management system, custom apps (Music Player, Gallery, Resume, Projects, Terminal, Finder, etc.), smooth GSAP animations, and native-like UI interactions. Designed to feel like a functional operating system running seamlessly inside your browser across all devices.',
  applicationName: 'Swastik Macolio',
  keywords: [
    'Swastik Sharma',
    'Frontend Developer',
    'React Developer',
    'Next.js Developer',
    'Web Developer Portfolio',
    'TypeScript Developer',
    'UI/UX Enthusiast',
    'GSAP Animations',
    'Tailwind CSS',
    'Software Engineer India',
    'JavaScript Expert',
    'Macolio',
    'macOS Portfolio',
    'Interactive Website'
  ],
  authors: [{ name: 'Swastik Sharma', url: 'https://www.swastikmacolio.in' }],
  creator: 'Swastik Sharma',
  publisher: 'Swastik Sharma',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://www.swastikmacolio.in/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.swastikmacolio.in/',
    siteName: 'Swastik Sharma Portfolio',
    title: 'Swastik Sharma | Frontend Developer Portfolio',
    description: 'A fully interactive macOS and iOS-style portfolio built with Next.js and TypeScript, featuring a draggable dock, window management system, custom apps (Music Player, Gallery, Resume, Projects, Terminal, Finder, etc.), smooth GSAP animations, and native-like UI interactions. Designed to feel like a functional operating system running seamlessly inside your browser across all devices.',
    images: [
      {
        url: 'https://www.swastikmacolio.in/preview.png',
        width: 1200,
        height: 630,
        alt: 'Swastik Sharma Portfolio Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Swastik Sharma | Frontend Developer Portfolio',
    description: 'A fully interactive macOS and iOS-style portfolio built with Next.js and TypeScript, featuring a draggable dock, window management system, custom apps (Music Player, Gallery, Resume, Projects, Terminal, Finder, etc.), smooth GSAP animations, and native-like UI interactions. Designed to feel like a functional operating system running seamlessly inside your browser across all devices.',
    creator: '@swastiksharma',
    images: ['https://www.swastikmacolio.in/preview.png'],
  },
  category: 'technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/swastik_logo_border.ico" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Georama:ital,wght@0,100..900;1,100..900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet" />
        
        {/* Schema.org JSON-LD */}
        <Script id="schema-website" type="application/ld+json" dangerouslySetInnerHTML={{ __html: `
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Swastik Sharma Portfolio - Swastik Sharma Macolio",
            "alternateName": "Swastik Macolio",
            "url": "https://www.swastikmacolio.in/",
            "logo": "https://www.swastikmacolio.in/swastik_logo_borderr.png",
            "description": "Frontend developer portfolio showcasing React projects, UI experiments, articles and gallery by Swastik Sharma.",
            "keywords": "Swastik Sharma, swastik sharma macolio, frontend developer, React developer, portfolio",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://www.swastikmacolio.in/?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }
        `}} />
        <Script id="schema-person" type="application/ld+json" dangerouslySetInnerHTML={{ __html: `
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Swastik Sharma",
            "alternateName": "Swastik Macolio",
            "url": "https://www.swastikmacolio.in/",
            "logo": "https://www.swastikmacolio.in/swastik_logo_borderr.png",
            "jobTitle": "Frontend Developer",
            "description": "Frontend Developer specializing in React, JavaScript, and modern web technologies",
            "knowsAbout": ["React", "JavaScript", "Frontend Development", "UI/UX Design", "Web Development", "Vite", "Tailwind CSS", "GSAP"],
            "sameAs": [
              "https://www.linkedin.com/in/swastik15sharma/",
              "https://github.com/swastiksharma15",
              "https://www.youtube.com/@SpeedX_"
            ]
          }
        `}} />
      </head>
      <body suppressHydrationWarning>
        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-QF6X2WC0BG" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QF6X2WC0BG');
          `}
        </Script>
        
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
