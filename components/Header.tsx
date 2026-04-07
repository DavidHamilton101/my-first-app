'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const nav = [
  { href: '/',                  label: 'Board' },
  { href: '/list',              label: 'List View' },
  { href: '/changes/new',       label: '+ New RFC' },
  { href: '/admin/approvers',   label: 'Approvers' },
  { href: '/admin/systems',     label: 'Systems' },
]

export default function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header style={{ background: '#1D3A2F' }} className="shadow-lg">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 no-underline">
            <span className="text-2xl">🕯️</span>
            <div>
              <div className="font-serif text-lg font-bold leading-none" style={{ color: '#C17D3C' }}>
                Candle Shack
              </div>
              <div className="text-xs leading-none mt-0.5" style={{ color: 'rgba(250,247,242,0.65)' }}>
                Change Control System
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {nav.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-3 py-1.5 rounded text-sm font-medium transition-colors"
                style={
                  isActive(href)
                    ? { background: '#C17D3C', color: '#fff' }
                    : { color: 'rgba(250,247,242,0.75)' }
                }
                onMouseEnter={e => { if (!isActive(href)) (e.currentTarget as HTMLElement).style.color = '#fff' }}
                onMouseLeave={e => { if (!isActive(href)) (e.currentTarget as HTMLElement).style.color = 'rgba(250,247,242,0.75)' }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Mobile burger */}
          <button
            className="md:hidden p-2"
            style={{ color: 'rgba(250,247,242,0.75)' }}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile nav */}
        {open && (
          <div className="md:hidden pb-4 space-y-1 border-t border-white/10 pt-3">
            {nav.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded text-sm"
                style={
                  isActive(href)
                    ? { background: '#C17D3C', color: '#fff' }
                    : { color: 'rgba(250,247,242,0.75)' }
                }
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
