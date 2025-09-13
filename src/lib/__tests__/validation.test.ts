import { validateSeeds, validateDomain, validateCount, sanitizeInput } from '../validation';

describe('validateSeeds', () => {
  test('accepts valid seeds array', () => {
    const seeds = [
      { title: 'Valid Title', by: 'Valid Author' },
      { title: 'Another Title' }
    ];
    const result = validateSeeds(seeds);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('rejects empty array', () => {
    const result = validateSeeds([]);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('At least one seed is required');
  });

  test('rejects non-array input', () => {
    const result = validateSeeds('not an array' as any);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Seeds must be an array');
  });

  test('rejects more than 5 seeds', () => {
    const seeds = Array(6).fill({ title: 'Title' });
    const result = validateSeeds(seeds);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Maximum 5 seeds allowed');
  });

  test('rejects seeds with empty titles', () => {
    const seeds = [{ title: '', by: 'Author' }];
    const result = validateSeeds(seeds);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Seed 1: Title is required');
  });

  test('rejects titles that are too short', () => {
    const seeds = [{ title: 'A' }];
    const result = validateSeeds(seeds);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Seed 1: Title must be at least 2 characters');
  });

  test('rejects titles that are too long', () => {
    const seeds = [{ title: 'A'.repeat(121) }];
    const result = validateSeeds(seeds);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Seed 1: Title must be less than 120 characters');
  });

  test('rejects emoji-only titles', () => {
    const seeds = [{ title: '😀😃😄' }];
    const result = validateSeeds(seeds);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Seed 1: Title cannot be only emojis');
  });

  test('accepts mixed valid and handles invalid seeds', () => {
    const seeds = [
      { title: 'Valid Title' },
      { title: '' },
      { title: 'Another Valid' }
    ];
    const result = validateSeeds(seeds);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Seed 2: Title is required');
  });
});

describe('validateDomain', () => {
  test('accepts "songs" domain', () => {
    expect(validateDomain('songs')).toBe(true);
  });

  test('accepts "movies" domain', () => {
    expect(validateDomain('movies')).toBe(true);
  });

  test('rejects invalid domain', () => {
    expect(validateDomain('books')).toBe(false);
    expect(validateDomain('')).toBe(false);
    expect(validateDomain(null)).toBe(false);
    expect(validateDomain(undefined)).toBe(false);
  });
});

describe('validateCount', () => {
  test('accepts valid integer count', () => {
    const result = validateCount(5);
    expect(result.valid).toBe(true);
    expect(result.value).toBe(5);
  });

  test('accepts string numbers', () => {
    const result = validateCount('10');
    expect(result.valid).toBe(true);
    expect(result.value).toBe(10);
  });

  test('rejects non-numeric strings', () => {
    const result = validateCount('not a number');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Count must be a number');
  });

  test('rejects floating point numbers', () => {
    const result = validateCount(5.5);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Count must be an integer');
  });

  test('rejects count less than 1', () => {
    const result = validateCount(0);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Count must be at least 1');
  });

  test('rejects count greater than 20', () => {
    const result = validateCount(21);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Count must be at most 20');
  });

  test('handles edge cases', () => {
    expect(validateCount(1).valid).toBe(true);
    expect(validateCount(20).valid).toBe(true);
  });
});

describe('sanitizeInput', () => {
  test('trims whitespace', () => {
    expect(sanitizeInput('  hello world  ')).toBe('hello world');
  });

  test('limits length to 120 characters', () => {
    const longString = 'A'.repeat(150);
    const result = sanitizeInput(longString);
    expect(result).toHaveLength(120);
    expect(result).toBe('A'.repeat(120));
  });

  test('handles empty string', () => {
    expect(sanitizeInput('')).toBe('');
    expect(sanitizeInput('   ')).toBe('');
  });

  test('preserves valid content', () => {
    const input = 'Normal song title with spaces';
    expect(sanitizeInput(input)).toBe(input);
  });
});