'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';

export function LandingHero() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="text-center section-spacing relative">
        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-16 left-16 w-12 h-12 bg-yellow-200 rounded-full opacity-40 pulse-gentle"></div>
          <div className="absolute top-40 right-20 w-10 h-10 bg-pink-200 rounded-full opacity-35 pulse-gentle" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-32 left-1/3 w-8 h-8 bg-emerald-200 rounded-full opacity-30 pulse-gentle" style={{animationDelay: '1s'}}></div>
        </div>

        <h1 className="text-display font-mono font-black mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
          Find your next track, film & series.
        </h1>
        <p className="text-xl font-sans font-semibold max-w-2xl mx-auto mb-16 text-surface-700 leading-relaxed">
          🎯 Give us up to five seeds. Our AI engine will analyze your taste and find perfect matches.
        </p>

        {/* Content Divider */}
        <div className="content-divider"></div>

        {/* Feature Callouts */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
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

        {/* Content Divider */}
        <div className="content-divider"></div>

        {/* Main CTAs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
    <Card className="text-center p-6 gradient-bg-warm border-2 border-gray-200 brutal-shadow-soft hover-lift">
      <div className="text-4xl mb-4 hover:scale-105 transition-transform duration-200">{emoji}</div>
      <h3 className="font-sans font-bold text-lg mb-2 text-surface-800">{title}</h3>
      <p className="font-sans font-medium text-sm text-surface-600">{description}</p>
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
    primary: 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 hover:from-indigo-100 hover:to-purple-100',
    accent: 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 hover:from-emerald-100 hover:to-teal-100'
  };

  return (
    <Link href={href} className="block group touch-target" tabIndex={0}>
      <Card
        className={`p-8 h-full transition-all duration-200 group-hover:transform group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:rotate-1 border-2 brutal-shadow-cute hover-lift ripple-effect group-active:success-bounce focus-visible ${colorClasses[color]}`}
        role="button"
        tabIndex={-1}
      >
        <CardContent className="text-center">
          <div className="text-6xl mb-6 group-hover:scale-105 group-hover:rotate-6 transition-all duration-200">
            {emoji}
          </div>
          <h2 className="font-mono font-black text-title mb-4 text-surface-800">
            {title}
          </h2>
          <p className="font-sans font-semibold text-base text-surface-700 leading-relaxed">
            {description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}