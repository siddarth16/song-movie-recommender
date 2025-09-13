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
      <header className="border-b-4 border-black bg-white sticky top-0 z-40" style={{boxShadow: '4px 4px 0px 0px #000000'}}>
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
            </nav>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="btn-brutal p-3 text-sm"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="md:hidden py-4 border-t-2 border-black" role="navigation">
            <div className="flex gap-1">
              <NavLink href="/" active={pathname === '/'}>
                Home
              </NavLink>
              <NavLink href="/songs" active={pathname === '/songs'}>
                Songs
              </NavLink>
              <NavLink href="/movies" active={pathname === '/movies'}>
                Movies
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
      <footer className="border-t-4 border-black bg-surface-100 mt-auto" role="contentinfo">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-mono font-bold text-sm text-center">
              Powered by Gemini 2.5 Flash • No tracking • Server-side AI
            </p>
            <div className="flex gap-4">
              <a 
                href="https://github.com" 
                className="font-mono font-bold text-sm hover:text-primary-500 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <Link 
                href="/privacy" 
                className="font-mono font-bold text-sm hover:text-primary-500 transition-colors"
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
        'font-mono font-bold px-4 py-2 border-2 transition-all duration-75',
        active
          ? 'bg-primary-500 text-white border-black'
          : 'bg-white text-black border-black hover:transform hover:translate-x-0.5 hover:translate-y-0.5'
      )}
    >
      {children}
    </Link>
  );
}