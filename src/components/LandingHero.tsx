'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';

export function LandingHero() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16 relative">
        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-70 animate-bounce"></div>
          <div className="absolute top-32 right-16 w-16 h-16 bg-pink-400 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-emerald-400 rounded-full opacity-50"></div>
        </div>

        <h1 className="text-display font-mono font-black mb-6 bg-gradient-to-r from-primary-600 via-purple-600 to-accent-600 bg-clip-text text-transparent hover-lift">
          Find your next track, film & series.
        </h1>
        <p className="text-xl font-sans font-bold max-w-2xl mx-auto mb-12 text-surface-800 leading-relaxed">
          🎯 Give us up to five seeds. Our AI engine will analyze your taste and find perfect matches.
        </p>

        {/* Feature Callouts */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <FeatureCard
            title="No Login"
            description="Open & instant"
            emoji="🚀"
          />
          <FeatureCard
            title="Smart AI"
            description="Advanced recommendation engine"
            emoji="⚡"
          />
          <FeatureCard
            title="Privacy-Friendly"
            description="Keys stay server-side"
            emoji="🔒"
          />
        </div>

        {/* Main CTAs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <CTACard
            href="/songs"
            title="Songs"
            description="Drop song titles (add artist if you can). We'll return similar vibes."
            emoji="🎵"
            color="primary"
          />
          <CTACard
            href="/movies"
            title="Movies"
            description="List a few films you love. We'll surface neighbors by tone, theme, and craft."
            emoji="🎬"
            color="accent"
          />
          <CTACard
            href="/tvshows"
            title="TV Shows"
            description="Share your favorite series (add creator if you know it). We'll find shows with similar vibes and storytelling."
            emoji="📺"
            color="primary"
          />
        </div>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  emoji: string;
}

function FeatureCard({ title, description, emoji }: FeatureCardProps) {
  return (
    <Card className="text-center p-6 gradient-bg-warm border-2 border-surface-800 brutal-shadow-color hover-lift">
      <div className="text-5xl mb-4 hover:scale-110 transition-transform duration-200">{emoji}</div>
      <h3 className="font-sans font-black text-xl mb-3 text-surface-900">{title}</h3>
      <p className="font-sans font-bold text-base text-surface-700">{description}</p>
    </Card>
  );
}

interface CTACardProps {
  href: string;
  title: string;
  description: string;
  emoji: string;
  color: 'primary' | 'accent';
}

function CTACard({ href, title, description, emoji, color }: CTACardProps) {
  const colorClasses = {
    primary: 'bg-gradient-to-br from-primary-100 to-yellow-100 border-primary-600 hover:from-primary-200 hover:to-yellow-200',
    accent: 'bg-gradient-to-br from-accent-100 to-emerald-100 border-accent-600 hover:from-accent-200 hover:to-emerald-200'
  };

  return (
    <Link href={href} className="block group" tabIndex={0}>
      <Card
        className={`p-8 h-full transition-all duration-300 group-hover:transform group-hover:-translate-x-2 group-hover:-translate-y-2 group-hover:rotate-2 border-4 brutal-shadow-rainbow hover-lift ${colorClasses[color]}`}
        role="button"
        tabIndex={-1}
      >
        <CardContent className="text-center">
          <div className="text-7xl mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
            {emoji}
          </div>
          <h2 className="font-mono font-black text-title mb-4 bg-gradient-to-r from-surface-900 to-surface-700 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="font-sans font-bold text-lg text-surface-800 leading-relaxed">
            {description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}