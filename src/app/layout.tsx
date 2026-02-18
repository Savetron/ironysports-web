import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'https://ironysports.com'),
  title: {
    default: 'IronySports - Sporun En Zeki Hali',
    template: '%s | IronySports',
  },
  description: 'Türkiye\'nin yeni nesil spor haberciliği ve analiz platformu. Futbol, basketbol ve detaylı maç analizleri.',
  keywords: ['spor', 'futbol', 'basketbol', 'analiz', 'haber', 'transfer'],
  authors: [{ name: 'IronySports Ekibi' }],
  creator: 'IronySports',
  publisher: 'IronySports',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: '/',
    siteName: 'IronySports',
    title: 'IronySports - Sporun En Zeki Hali',
    description: 'Sporun en ciddi anlarına hafif tebessümle yaklaşan analiz platformu.',
    images: [
      {
        url: '/og-image.jpg', // Make sure to add this file later or use a default
        width: 1200,
        height: 630,
        alt: 'IronySports',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IronySports',
    description: 'Sporun En Zeki Hali',
    creator: '@ironysports', // Replace with actual handle if available
  },
  verification: {
    google: 'google-site-verification-code', // Placeholder
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
