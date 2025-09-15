'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';

export function LandingHero() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-display font-mono font-black mb-6 text-black">
          Find your next track, film & series.
        </h1>
        <p className="text-lg font-sans font-medium max-w-2xl mx-auto mb-12 text-surface-800">
          Give us up to five seeds. Our AI engine will analyze your taste and find perfect matches.
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
    <Card className="text-center p-6">
      <div className="text-4xl mb-4">{emoji}</div>
      <h3 className="font-sans font-bold text-lg mb-2 text-black">{title}</h3>
      <p className="font-sans font-medium text-sm text-surface-800">{description}</p>
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
    primary: 'hover:bg-primary-50 border-primary-500 hover:border-primary-600',
    accent: 'hover:bg-accent-50 border-accent-500 hover:border-accent-600'
  };

  return (
    <Link href={href} className="block group" tabIndex={0}>
      <Card 
        className={`p-8 h-full transition-all duration-200 group-hover:transform group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:rotate-1 border-4 ${colorClasses[color]}`}
        style={{boxShadow: '4px 4px 0px 0px #000000'}}
        role="button"
        tabIndex={-1}
      >
        <CardContent className="text-center">
          <div className="text-6xl mb-6 group-hover:animate-bounce-subtle">
            {emoji}
          </div>
          <h2 className="font-mono font-black text-title mb-4 text-black">
            {title}
          </h2>
          <p className="font-sans font-medium text-lg text-surface-800 leading-relaxed">
            {description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}