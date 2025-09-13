'use client';

import { useState, useCallback } from 'react';
import { apiClient, ApiError } from '@/lib/api-client';
import { storage } from '@/lib/storage';
import { Domain, Seed, Recommendation } from '@/types';
import { debounce } from '@/lib/utils';

interface UseRecommendationsReturn {
  recommendations: Recommendation[];
  isLoading: boolean;
  error: string | null;
  getRecommendations: (domain: Domain, seeds: Seed[], count: number) => Promise<void>;
  clearResults: () => void;
  clearError: () => void;
}

export function useRecommendations(): UseRecommendationsReturn {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearResults = useCallback(() => {
    setRecommendations([]);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getRecommendations = useCallback(
    debounce(async (domain: Domain, seeds: Seed[], count: number): Promise<void> => {
      // Validate inputs
      const validSeeds = seeds.filter(seed => seed.title.trim().length > 0);
      if (validSeeds.length === 0) {
        setError('Please add at least one seed');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.getRecommendations({
          domain,
          seeds: validSeeds,
          count
        });

        setRecommendations(response.items);

        // Save to localStorage
        storage.setLastSeeds(domain, validSeeds);
        storage.setLastCount(count);

      } catch (err) {
        console.error('Failed to get recommendations:', err);
        
        if (err instanceof ApiError) {
          if (err.isRateLimit()) {
            setError('Too many requests. Please wait a moment and try again.');
          } else if (err.isUpstreamError()) {
            setError('The AI service is temporarily unavailable. Please try again in a moment.');
          } else if (err.isBadRequest()) {
            setError(err.message);
          } else {
            setError('Something went wrong. Please try again.');
          }
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred. Please try again.');
        }

        setRecommendations([]);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    []
  );

  return {
    recommendations,
    isLoading,
    error,
    getRecommendations,
    clearResults,
    clearError
  };
}