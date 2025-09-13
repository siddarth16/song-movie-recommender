import { Metadata } from 'next';
import { RecommenderPage } from '@/components/RecommenderPage';

export const metadata: Metadata = {
  title: 'Song Recommendations • RECOMMEND',
  description: 'Get AI-powered song recommendations based on your favorite tracks. Powered by Gemini 2.5 Flash.',
  openGraph: {
    title: 'Song Recommendations • RECOMMEND',
    description: 'Get AI-powered song recommendations based on your favorite tracks. Powered by Gemini 2.5 Flash.',
  }
};

export default function SongsPage() {
  return (
    <RecommenderPage
      domain="songs"
      title="Song Recommendations"
      description="Drop song titles (add artist if you can). We'll return similar vibes."
    />
  );
}