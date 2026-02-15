import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Toaster } from 'sonner'

import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kompressor.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Kompressor - Bulk Image Compressor',
    template: '%s | Kompressor',
  },
  description:
    'Compress multiple images at once in the browser. Upload, compress, and download as ZIP. Free, fast, and private — no images stored on our servers.',
  keywords: [
    'image compressor',
    'bulk compress',
    'image optimization',
    'browser',
    'webp',
    'jpeg',
    'png',
    'compress images',
    'reduce file size',
  ],
  authors: [{ name: 'Kompressor' }],
  creator: 'Kompressor',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Kompressor',
    title: 'Kompressor - Bulk Image Compressor',
    description:
      'Compress multiple images at once in the browser. Free, fast, and private — no images stored on our servers.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Kompressor - Bulk Image Compressor',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kompressor - Bulk Image Compressor',
    description:
      'Compress multiple images at once in the browser. Free, fast, and private — no images stored on our servers.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'hsl(0 0% 7%)',
              border: '1px solid hsl(0 0% 14%)',
              color: 'hsl(0 0% 95%)',
            },
          }}
        />
      </body>
    </html>
  )
}
