import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'
import { Providers } from "@/components/shared/providers"

export const viewport = {
  themeColor: '#111827',
}

export const metadata: Metadata = {
  title: 'Swastik Sharma | Frontend Developer Portfolio | Swastik Macolio',
  description: 'Modern frontend developer portfolio by Swastik Sharma. Explore high-performance React projects, interactive UI experiments, articles, and galleries built with React, Vite, Tailwind CSS, and GSAP animations.',
  alternates: {
    canonical: 'https://www.swastikmacolio.in/',
  },
  authors: [{ name: 'Swastik Sharma' }],
  openGraph: {
    title: 'Swastik Sharma - Frontend Developer Portfolio | Swastik Sharma Macolio',
    description: 'Dive into modern React projects, UI demos, articles, and interactive showcases built using React, Vite, Tailwind, and GSAP by Swastik Sharma.',
    url: 'https://www.swastikmacolio.in/',
    siteName: 'Swastik Sharma Macolio Portfolio',
    images: [{ url: 'https://www.swastikmacolio.in/preview.png' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Swastik Sharma - Frontend Developer | Swastik Macolio Portfolio',
    description: 'Explore modern frontend work - React projects, UI experiments, articles, and galleries by Swastik Sharma.',
    creator: '@swastiksharma',
    images: ['https://www.swastikmacolio.in/preview.png'],
  },
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
