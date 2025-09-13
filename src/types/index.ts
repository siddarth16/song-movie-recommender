// Core types for the recommendation system

export type Domain = 'songs' | 'movies';

export interface Seed {
  title: string;
  by?: string; // artist for songs, director for movies
}

export interface SongRecommendation {
  title: string;
  artist: string;
  year: number;
  genres: string[];
  why: string;
  confidence: number;
}

export interface MovieRecommendation {
  title: string;
  director: string;
  year: number;
  genres: string[];
  why: string;
  confidence: number;
}

export type Recommendation = SongRecommendation | MovieRecommendation;

export interface RecommendationResponse {
  items: Recommendation[];
  meta: {
    seed_count: number;
    requested: number;
    model: string;
  };
}

export interface RecommendationRequest {
  domain: Domain;
  seeds: Seed[];
  count: number;
}

export interface ErrorResponse {
  error: string;
  code: 'BAD_REQUEST' | 'UPSTREAM' | 'RATE_LIMIT' | 'PARSE_ERROR';
}

export interface AppState {
  lastSeeds: Record<Domain, Seed[]>;
  lastCount: number;
  theme: 'light' | 'dark';
}

// Sample seeds for empty state
export const SAMPLE_SONGS: Seed[] = [
  { title: "Bohemian Rhapsody", by: "Queen" },
  { title: "Smells Like Teen Spirit", by: "Nirvana" },
  { title: "Hotel California", by: "Eagles" },
  { title: "Billie Jean", by: "Michael Jackson" },
  { title: "Stairway to Heaven", by: "Led Zeppelin" }
];

export const SAMPLE_MOVIES: Seed[] = [
  { title: "Pulp Fiction", by: "Quentin Tarantino" },
  { title: "The Shawshank Redemption", by: "Frank Darabont" },
  { title: "Inception", by: "Christopher Nolan" },
  { title: "The Godfather", by: "Francis Ford Coppola" },
  { title: "Spirited Away", by: "Hayao Miyazaki" }
];