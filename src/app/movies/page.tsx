import { Metadata } from 'next';
import { RecommenderPage } from '@/components/RecommenderPage';

export const metadata: Metadata = {
  title: 'Movie Recommendations • RECOMMEND',
  description: 'Get AI-powered movie recommendations based on your favorite films. Advanced algorithms analyze your taste.',
  openGraph: {
    title: 'Movie Recommendations • RECOMMEND',
    description: 'Get AI-powered movie recommendations based on your favorite films. Advanced algorithms analyze your taste.',
  }
};

export default function MoviesPage() {
  return (
    <RecommenderPage
      domain="movies"
      title="Movie Recommendations"
      description="List a few films you love. We'll surface neighbors by tone, theme, and craft."
    />
  );
}