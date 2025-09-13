import { Suspense } from 'react';
import { RecommenderPageContent } from './RecommenderPageContent';
import { Domain } from '@/types';

interface RecommenderPageProps {
  domain: Domain;
  title: string;
  description: string;
}

export function RecommenderPage({ domain, title, description }: RecommenderPageProps) {
  return (
    <Suspense fallback={
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-8 w-64 checkerboard mb-4"></div>
        <div className="h-6 w-96 checkerboard mb-8"></div>
        <div className="space-y-6">
          <div className="h-64 w-full checkerboard"></div>
          <div className="h-32 w-full checkerboard"></div>
        </div>
      </div>
    }>
      <RecommenderPageContent domain={domain} title={title} description={description} />
    </Suspense>
  );
}