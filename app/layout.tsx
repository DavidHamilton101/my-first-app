import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'Candle Shack — Change Control',
  description: 'Internal change management system for Candle Shack',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen" style={{ background: '#FAF7F2' }}>
        <Header />
        {children}
      </body>
    </html>
  )
}
