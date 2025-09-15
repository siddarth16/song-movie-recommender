'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const pathname = usePathname();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b-2 border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-40 shadow-soft">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              href="/"
              className="font-mono font-black text-xl hover:scale-105 transition-transform duration-75"
              aria-label="Go to homepage"
            >
              RECO<span className="text-primary-500">•</span>MMEND
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1" role="navigation">
              <NavLink href="/" active={pathname === '/'}>
                Home
              </NavLink>
              <NavLink href="/songs" active={pathname === '/songs'}>
                Songs
              </NavLink>
              <NavLink href="/movies" active={pathname === '/movies'}>
                Movies
              </NavLink>
              <NavLink href="/tvshows" active={pathname === '/tvshows'}>
                TV Shows
              </NavLink>
            </nav>

            {/* Theme Toggle */}
            <div className="hidden md:flex items-center gap-2">
              <span className="font-sans text-sm text-gray-600">Light</span>
              <button
                onClick={toggleTheme}
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                  theme === 'dark' ? 'bg-primary-500' : 'bg-gray-200'
                )}
                role="switch"
                aria-checked={theme === 'dark'}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm',
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
              <span className="font-sans text-sm text-gray-600">Dark</span>
            </div>

          </div>

          {/* Mobile Navigation */}
          <nav className="md:hidden py-4 border-t border-gray-200" role="navigation">
            <div className="grid grid-cols-2 gap-2 mb-4">
              <NavLink href="/" active={pathname === '/'}>
                Home
              </NavLink>
              <NavLink href="/songs" active={pathname === '/songs'}>
                Songs
              </NavLink>
              <NavLink href="/movies" active={pathname === '/movies'}>
                Movies
              </NavLink>
              <NavLink href="/tvshows" active={pathname === '/tvshows'}>
                TV Shows
              </NavLink>
            </div>

            {/* Mobile Theme Toggle */}
            <div className="flex items-center justify-center gap-2 pt-2 border-t border-gray-100">
              <span className="font-sans text-sm text-gray-600">Light</span>
              <button
                onClick={toggleTheme}
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                  theme === 'dark' ? 'bg-primary-500' : 'bg-gray-200'
                )}
                role="switch"
                aria-checked={theme === 'dark'}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm',
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
              <span className="font-sans text-sm text-gray-600">Dark</span>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1" role="main">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-gray-200 bg-gray-50 mt-auto" role="contentinfo">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-sans font-medium text-sm text-center">
              Powered by advanced AI • No tracking • Privacy-first design
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                className="font-sans font-medium text-sm hover:text-primary-500 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <Link
                href="/privacy"
                className="font-sans font-medium text-sm hover:text-primary-500 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Privacy
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
        'font-sans font-semibold px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        active
          ? 'bg-primary-500 text-white shadow-soft'
          : 'bg-white text-gray-700 border border-gray-200 shadow-soft hover:shadow-soft-md hover:bg-gray-50'
      )}
    >
      {children}
    </Link>
  );
}