import { Metadata } from 'next';
import { RecommenderPage } from '@/components/RecommenderPage';

export const metadata: Metadata = {
  title: 'TV Show Recommendations • RECOMMEND',
  description: 'Get AI-powered TV show recommendations based on your favorite series. Powered by Gemini 2.5 Flash.',
  openGraph: {
    title: 'TV Show Recommendations • RECOMMEND',
    description: 'Get AI-powered TV show recommendations based on your favorite series. Powered by Gemini 2.5 Flash.',
  }
};

export default function TVShowsPage() {
  return (
    <RecommenderPage
      domain="tvshows"
      title="TV Show Recommendations"
      description="Share your favorite series (add creator if you know it). We'll find shows with similar vibes and storytelling."
    />
  );
}