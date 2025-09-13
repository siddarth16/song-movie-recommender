import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function validateSeedTitle(title: string): boolean {
  if (!title || typeof title !== 'string') return false;
  const trimmed = title.trim();
  if (trimmed.length < 2 || trimmed.length > 120) return false;
  // Reject emoji-only or obviously garbage inputs
  const emojiOnlyRegex = /^[\p{Emoji}\s]*$/u;
  if (emojiOnlyRegex.test(trimmed)) return false;
  return true;
}

export function normalizeSeed(seed: { title: string; by?: string }) {
  return {
    title: seed.title.trim(),
    by: seed.by?.trim() || undefined
  };
}

export function clampConfidence(confidence: number): number {
  return Math.max(0, Math.min(1, confidence));
}

export function removeDuplicates<T extends { title: string; artist?: string; director?: string }>(
  items: T[]
): T[] {
  const seen = new Set<string>();
  return items.filter(item => {
    const creator = item.artist || item.director || '';
    const key = `${item.title.toLowerCase()}|${creator.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function sortByConfidence<T extends { confidence: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.confidence - a.confidence);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => Promise<void> {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    return new Promise<void>((resolve, reject) => {
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        try {
          await func(...args);
          resolve();
        } catch (error) {
          reject(error);
        }
      }, wait);
    });
  };
}

export function formatYear(year: number): string {
  return year.toString();
}

export function formatGenres(genres: string[]): string {
  if (genres.length === 0) return '';
  if (genres.length === 1) return genres[0];
  if (genres.length === 2) return genres.join(' & ');
  return `${genres.slice(0, -1).join(', ')} & ${genres[genres.length - 1]}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}