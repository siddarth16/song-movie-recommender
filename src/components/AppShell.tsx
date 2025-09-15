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
      <header className="border-b-4 border-surface-800 bg-white/95 backdrop-blur-sm sticky top-0 z-40 brutal-shadow-multi">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link
              href="/"
              className="font-mono font-black text-2xl hover:scale-105 transition-all duration-200 hover-lift"
              aria-label="Go to homepage"
            >
              <span className="text-primary-600">RECO</span>
              <span className="text-accent-500">•</span>
              <span className="text-emerald-600">MMEND</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-2" role="navigation">
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
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-pink-400 rounded-full animate-pulse"></div>
            </div>

          </div>

          {/* Mobile Navigation */}
          <nav className="md:hidden py-4 border-t-2 border-surface-300" role="navigation">
            <div className="grid grid-cols-2 gap-3">
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
      <footer className="border-t-4 border-surface-800 gradient-bg-cool mt-auto" role="contentinfo">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-sans font-bold text-sm text-center text-surface-800">
              ⚡ Powered by advanced AI • 🔒 No tracking • 🎨 Privacy-first design
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                className="font-sans font-bold text-sm text-purple-600 hover:text-purple-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 hover-lift"
                target="_blank"
                rel="noopener noreferrer"
              >
                📚 GitHub
              </a>
              <Link
                href="/privacy"
                className="font-sans font-bold text-sm text-emerald-600 hover:text-emerald-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 hover-lift"
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
        'font-sans font-bold px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 hover-lift border-2',
        active
          ? 'bg-gradient-to-r from-primary-500 to-pink-500 text-white border-surface-800 brutal-shadow-color'
          : 'bg-white text-surface-800 border-surface-300 hover:border-primary-400 hover:bg-primary-50 brutal-shadow-rainbow'
      )}
    >
      {children}
    </Link>
  );
}