import { z } from 'zod';
import { Domain } from '@/types';

export const SeedSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(120, 'Title must be less than 120 characters'),
  by: z.string().optional()
});

export const RecommendationRequestSchema = z.object({
  domain: z.enum(['songs', 'movies'], { 
    message: 'Domain must be either "songs" or "movies"' 
  }),
  seeds: z.array(SeedSchema).min(1, 'At least one seed is required').max(5, 'Maximum 5 seeds allowed'),
  count: z.number().min(1, 'Count must be at least 1').max(20, 'Count must be at most 20').int('Count must be an integer')
});

export type ValidatedRecommendationRequest = z.infer<typeof RecommendationRequestSchema>;

export function validateSeeds(seeds: any[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!Array.isArray(seeds)) {
    return { valid: false, errors: ['Seeds must be an array'] };
  }

  if (seeds.length === 0) {
    return { valid: false, errors: ['At least one seed is required'] };
  }

  if (seeds.length > 5) {
    return { valid: false, errors: ['Maximum 5 seeds allowed'] };
  }

  seeds.forEach((seed, index) => {
    if (!seed || typeof seed !== 'object') {
      errors.push(`Seed ${index + 1}: Must be an object`);
      return;
    }

    const title = seed.title?.trim();
    if (!title) {
      errors.push(`Seed ${index + 1}: Title is required`);
    } else if (title.length < 2) {
      errors.push(`Seed ${index + 1}: Title must be at least 2 characters`);
    } else if (title.length > 120) {
      errors.push(`Seed ${index + 1}: Title must be less than 120 characters`);
    } else if (/^[\p{Emoji}\s]*$/u.test(title)) {
      errors.push(`Seed ${index + 1}: Title cannot be only emojis`);
    }

    if (seed.by && typeof seed.by !== 'string') {
      errors.push(`Seed ${index + 1}: By field must be a string`);
    }
  });

  return { valid: errors.length === 0, errors };
}

export function validateDomain(domain: any): domain is Domain {
  return domain === 'songs' || domain === 'movies';
}

export function validateCount(count: any): { valid: boolean; value?: number; error?: string } {
  if (typeof count !== 'number') {
    const parsed = Number(count);
    if (isNaN(parsed)) {
      return { valid: false, error: 'Count must be a number' };
    }
    count = parsed;
  }

  if (!Number.isInteger(count)) {
    return { valid: false, error: 'Count must be an integer' };
  }

  if (count < 1) {
    return { valid: false, error: 'Count must be at least 1' };
  }

  if (count > 20) {
    return { valid: false, error: 'Count must be at most 20' };
  }

  return { valid: true, value: count };
}

export function sanitizeInput(input: string): string {
  return input.trim().slice(0, 120);
}