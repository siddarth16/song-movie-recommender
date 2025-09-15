'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b-2 border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-40 brutal-shadow-gentle">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              href="/"
              className="font-mono font-black text-xl hover:scale-105 transition-all duration-200 hover-lift"
              aria-label="Go to homepage"
            >
              <span className="text-indigo-600">RECO</span>
              <span className="text-purple-400">•</span>
              <span className="text-emerald-600">MMEND</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-2" role="navigation" aria-label="Main navigation">
              <NavLink href="/" active={pathname === '/'}>
                🏠 Home
              </NavLink>
              <NavLink href="/songs" active={pathname === '/songs'}>
                🎵 Songs
              </NavLink>
              <NavLink href="/movies" active={pathname === '/movies'}>
                🎬 Movies
              </NavLink>
              <NavLink href="/tvshows" active={pathname === '/tvshows'}>
                📺 TV Shows
              </NavLink>
            </nav>

            {/* Decorative Element */}
            <div className="hidden md:flex items-center">
              <div className="w-6 h-6 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full animate-pulse opacity-60"></div>
            </div>

          </div>

          {/* Mobile Navigation */}
          <nav className="md:hidden py-6 border-t border-gray-200" role="navigation" aria-label="Mobile navigation">
            <div className="grid grid-cols-2 gap-4">
              <NavLink href="/" active={pathname === '/'}>
                🏠 Home
              </NavLink>
              <NavLink href="/songs" active={pathname === '/songs'}>
                🎵 Songs
              </NavLink>
              <NavLink href="/movies" active={pathname === '/movies'}>
                🎬 Movies
              </NavLink>
              <NavLink href="/tvshows" active={pathname === '/tvshows'}>
                📺 TV Shows
              </NavLink>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1" role="main">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 gradient-bg-soft mt-auto" role="contentinfo">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-sans font-medium text-sm text-center text-surface-700">
              ⚡ Powered by advanced AI • 🔒 No tracking • 🎨 Privacy-first design
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                className="font-sans font-medium text-sm text-purple-500 hover:text-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                📚 GitHub
              </a>
              <Link
                href="/privacy"
                className="font-sans font-medium text-sm text-emerald-500 hover:text-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
              >
                🛡️ Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface NavLinkProps {
  href: string;
  active: boolean;
  children: React.ReactNode;
}

function NavLink({ href, active, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'font-sans font-semibold px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 hover-lift border-2 touch-target ripple-effect focus-visible',
        active
          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-indigo-600 brutal-shadow-soft'
          : 'bg-white text-surface-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50 brutal-shadow-cute'
      )}
      aria-current={active ? 'page' : undefined}
    >
      {children}
    </Link>
  );
}