'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Card, CardContent } from '@/components/ui/Card';
import { SeedList } from '@/components/forms/SeedList';
import { ResultsList } from '@/components/ResultsList';
import { useRecommendations } from '@/hooks/useRecommendations';
import { useToast } from '@/components/ui/Toast';
import { storage } from '@/lib/storage';
import { Domain, Seed } from '@/types';

interface RecommenderPageContentProps {
  domain: Domain;
  title: string;
  description: string;
}

const countOptions = Array.from({ length: 20 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1} recommendations`
}));

export function RecommenderPageContent({ domain, title, description }: RecommenderPageContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const { recommendations, isLoading, error, getRecommendations, clearError } = useRecommendations();

  const [seeds, setSeeds] = useState<Seed[]>([]);
  const [count, setCount] = useState(10);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Initialize from URL params or localStorage
  useEffect(() => {
    if (hasInitialized) return;

    try {
      // Try to get from URL params first
      const seedsParam = searchParams.get('seeds');
      const countParam = searchParams.get('count');

      if (seedsParam) {
        const urlSeeds = JSON.parse(decodeURIComponent(seedsParam));
        if (Array.isArray(urlSeeds) && urlSeeds.length > 0) {
          setSeeds(urlSeeds.slice(0, 5));
          setHasInitialized(true);
        }
      }

      if (countParam) {
        const urlCount = parseInt(countParam);
        if (urlCount >= 1 && urlCount <= 20) {
          setCount(urlCount);
        }
      }

      // If no URL params, load from localStorage
      if (!seedsParam) {
        const storedSeeds = storage.getLastSeeds(domain);
        if (storedSeeds.length > 0) {
          setSeeds(storedSeeds);
        } else {
          // Start with one empty seed
          setSeeds([{ title: '', by: '' }]);
        }
      }

      if (!countParam) {
        setCount(storage.getLastCount());
      }

      setHasInitialized(true);
    } catch (e) {
      console.warn('Failed to parse URL params:', e);
      // Fallback to localStorage or defaults
      const storedSeeds = storage.getLastSeeds(domain);
      setSeeds(storedSeeds.length > 0 ? storedSeeds : [{ title: '', by: '' }]);
      setCount(storage.getLastCount());
      setHasInitialized(true);
    }
  }, [domain, searchParams, hasInitialized]);

  // Update URL when seeds or count change (debounced)
  useEffect(() => {
    if (!hasInitialized) return;

    const validSeeds = seeds.filter(seed => seed.title.trim().length > 0);
    if (validSeeds.length === 0 && count === 10) {
      // Clear URL params when no seeds and default count
      router.replace(`/${domain}`, { scroll: false });
      return;
    }

    const params = new URLSearchParams();
    if (validSeeds.length > 0) {
      params.set('seeds', encodeURIComponent(JSON.stringify(validSeeds)));
    }
    if (count !== 10) {
      params.set('count', count.toString());
    }

    const newUrl = `/${domain}${params.toString() ? `?${params.toString()}` : ''}`;
    router.replace(newUrl, { scroll: false });
  }, [seeds, count, domain, router, hasInitialized]);

  const handleGetRecommendations = async () => {
    const validSeeds = seeds.filter(seed => seed.title.trim().length > 0);
    
    if (validSeeds.length === 0) {
      addToast({
        title: 'No seeds provided',
        description: 'Please add at least one seed to get recommendations',
        type: 'error'
      });
      return;
    }

    clearError();
    await getRecommendations(domain, validSeeds, count);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleGetRecommendations();
    }
  };

  if (!hasInitialized) {
    // Show loading skeleton while initializing
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-8 w-64 checkerboard mb-4"></div>
        <div className="h-6 w-96 checkerboard mb-8"></div>
        <div className="space-y-6">
          <div className="h-64 w-full checkerboard"></div>
          <div className="h-32 w-full checkerboard"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" onKeyDown={handleKeyDown}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-title font-mono font-black mb-4 text-black">
          {title}
        </h1>
        <p className="text-lg font-sans font-medium text-surface-800 max-w-2xl">
          {description}
        </p>
      </div>

      <div className="space-y-8">
        {/* Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SeedList
              domain={domain}
              seeds={seeds}
              onSeedsChange={setSeeds}
              maxSeeds={5}
            />
          </div>
          
          <div className="space-y-6">
            {/* Count Selector */}
            <Card>
              <CardContent>
                <Select
                  label="How many recommendations?"
                  value={count.toString()}
                  onChange={(e) => setCount(parseInt(e.target.value))}
                  options={countOptions}
                />
              </CardContent>
            </Card>

            {/* Action Button */}
            <Button
              onClick={handleGetRecommendations}
              loading={isLoading}
              variant="primary"
              size="lg"
              className="w-full"
              disabled={seeds.filter(s => s.title.trim()).length === 0 || isLoading}
            >
              {isLoading ? 'Generating...' : 'Get Recommendations'}
            </Button>

            {/* Keyboard Shortcut Hint */}
            <p className="text-xs font-sans text-surface-600 text-center">
              💡 Press Cmd+Enter (Mac) or Ctrl+Enter (PC) to submit
            </p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border-4 border-red-500 p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-sans font-bold text-red-900 mb-2">
                  ❌ Error
                </h3>
                <p className="font-sans font-medium text-red-800">
                  {error}
                </p>
              </div>
              <button
                onClick={clearError}
                className="font-mono font-bold text-red-600 hover:text-red-800 text-lg"
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        <ResultsList
          domain={domain}
          recommendations={recommendations}
          isLoading={isLoading}
          error={error || undefined}
        />
      </div>
    </div>
  );
}