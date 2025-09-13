import {
  cn,
  validateSeedTitle,
  normalizeSeed,
  clampConfidence,
  removeDuplicates,
  sortByConfidence,
  formatGenres,
  truncateText
} from '../utils';

describe('cn (className utility)', () => {
  test('combines class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  test('handles conditional classes', () => {
    expect(cn('base', true && 'conditional', false && 'hidden')).toBe('base conditional');
  });
});

describe('validateSeedTitle', () => {
  test('accepts valid titles', () => {
    expect(validateSeedTitle('Valid Title')).toBe(true);
    expect(validateSeedTitle('Song with Numbers 123')).toBe(true);
  });

  test('rejects empty or invalid titles', () => {
    expect(validateSeedTitle('')).toBe(false);
    expect(validateSeedTitle(' ')).toBe(false);
    expect(validateSeedTitle('A')).toBe(false); // too short
  });

  test('rejects titles that are too long', () => {
    const longTitle = 'A'.repeat(121);
    expect(validateSeedTitle(longTitle)).toBe(false);
  });

  test('rejects emoji-only titles', () => {
    expect(validateSeedTitle('😀😃😄')).toBe(false);
    expect(validateSeedTitle('🎵 🎶')).toBe(false);
  });

  test('accepts titles with some emojis mixed with text', () => {
    expect(validateSeedTitle('Great Song 🎵')).toBe(true);
  });

  test('handles non-string input', () => {
    expect(validateSeedTitle(null as any)).toBe(false);
    expect(validateSeedTitle(undefined as any)).toBe(false);
    expect(validateSeedTitle(123 as any)).toBe(false);
  });
});

describe('normalizeSeed', () => {
  test('trims title and by fields', () => {
    const seed = { title: '  Song Title  ', by: '  Artist Name  ' };
    const result = normalizeSeed(seed);
    expect(result.title).toBe('Song Title');
    expect(result.by).toBe('Artist Name');
  });

  test('handles empty by field', () => {
    const seed = { title: 'Song Title', by: '' };
    const result = normalizeSeed(seed);
    expect(result.title).toBe('Song Title');
    expect(result.by).toBeUndefined();
  });

  test('handles missing by field', () => {
    const seed = { title: 'Song Title' };
    const result = normalizeSeed(seed);
    expect(result.title).toBe('Song Title');
    expect(result.by).toBeUndefined();
  });
});

describe('clampConfidence', () => {
  test('clamps values within 0-1 range', () => {
    expect(clampConfidence(0.5)).toBe(0.5);
    expect(clampConfidence(-0.5)).toBe(0);
    expect(clampConfidence(1.5)).toBe(1);
    expect(clampConfidence(0)).toBe(0);
    expect(clampConfidence(1)).toBe(1);
  });
});

describe('removeDuplicates', () => {
  test('removes duplicate songs by title and artist', () => {
    const songs = [
      { title: 'Song A', artist: 'Artist 1', confidence: 0.8 },
      { title: 'Song B', artist: 'Artist 2', confidence: 0.7 },
      { title: 'Song A', artist: 'Artist 1', confidence: 0.6 }, // duplicate
      { title: 'Song C', artist: 'Artist 1', confidence: 0.5 }
    ];
    
    const result = removeDuplicates(songs);
    expect(result).toHaveLength(3);
    expect(result.map(s => s.title)).toEqual(['Song A', 'Song B', 'Song C']);
  });

  test('removes duplicate movies by title and director', () => {
    const movies = [
      { title: 'Movie A', director: 'Director 1', confidence: 0.8 },
      { title: 'Movie B', director: 'Director 2', confidence: 0.7 },
      { title: 'Movie A', director: 'Director 1', confidence: 0.6 }, // duplicate
    ];
    
    const result = removeDuplicates(movies);
    expect(result).toHaveLength(2);
    expect(result.map(m => m.title)).toEqual(['Movie A', 'Movie B']);
  });

  test('handles case insensitive comparison', () => {
    const items = [
      { title: 'Item A', artist: 'Artist 1', confidence: 0.8 },
      { title: 'item a', artist: 'artist 1', confidence: 0.7 }, // duplicate (different case)
    ];
    
    const result = removeDuplicates(items);
    expect(result).toHaveLength(1);
  });
});

describe('sortByConfidence', () => {
  test('sorts items by confidence in descending order', () => {
    const items = [
      { title: 'Low', confidence: 0.3 },
      { title: 'High', confidence: 0.9 },
      { title: 'Medium', confidence: 0.6 }
    ];
    
    const result = sortByConfidence(items);
    expect(result.map(item => item.title)).toEqual(['High', 'Medium', 'Low']);
    expect(result.map(item => item.confidence)).toEqual([0.9, 0.6, 0.3]);
  });

  test('does not mutate original array', () => {
    const items = [
      { title: 'A', confidence: 0.1 },
      { title: 'B', confidence: 0.9 }
    ];
    const original = [...items];
    
    sortByConfidence(items);
    expect(items).toEqual(original);
  });
});

describe('formatGenres', () => {
  test('formats single genre', () => {
    expect(formatGenres(['Pop'])).toBe('Pop');
  });

  test('formats two genres', () => {
    expect(formatGenres(['Pop', 'Rock'])).toBe('Pop & Rock');
  });

  test('formats multiple genres', () => {
    expect(formatGenres(['Pop', 'Rock', 'Electronic', 'Dance'])).toBe('Pop, Rock, Electronic & Dance');
  });

  test('handles empty array', () => {
    expect(formatGenres([])).toBe('');
  });
});

describe('truncateText', () => {
  test('truncates long text', () => {
    const longText = 'This is a very long text that should be truncated';
    const result = truncateText(longText, 20);
    expect(result).toBe('This is a very lo...');
    expect(result.length).toBe(20);
  });

  test('does not truncate short text', () => {
    const shortText = 'Short text';
    const result = truncateText(shortText, 20);
    expect(result).toBe(shortText);
  });

  test('handles exact length match', () => {
    const text = 'Exactly twenty chars';
    const result = truncateText(text, 20);
    expect(result).toBe(text);
  });
});