import { Metadata } from 'next';
import { RecommenderPage } from '@/components/RecommenderPage';

export const metadata: Metadata = {
  title: 'Movie Recommendations • RECOMMEND',
  description: 'Get AI-powered movie recommendations based on your favorite films. Powered by Gemini 2.5 Flash.',
  openGraph: {
    title: 'Movie Recommendations • RECOMMEND',
    description: 'Get AI-powered movie recommendations based on your favorite films. Powered by Gemini 2.5 Flash.',
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