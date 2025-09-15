'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Recommendation, Domain } from '@/types';
import { formatYear, truncateText } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

interface ResultsListProps {
  domain: Domain;
  recommendations: Recommendation[];
  isLoading: boolean;
  error?: string;
}

export function ResultsList({ domain, recommendations, isLoading, error }: ResultsListProps) {
  const { addToast } = useToast();
  
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (recommendations.length === 0) {
    return null;
  }

  const copyList = () => {
    const text = recommendations
      .map(rec => {
        const creator = 'artist' in rec ? rec.artist :
                       'director' in rec ? rec.director :
                       'creator' in rec ? rec.creator : 'Unknown';
        return `${rec.title} - ${creator} (${rec.year})`;
      })
      .join('\n');
    
    navigator.clipboard.writeText(text).then(() => {
      addToast({
        title: 'Copied!',
        description: 'Recommendations copied to clipboard',
        type: 'success',
        duration: 2000
      });
    }).catch(() => {
      addToast({
        title: 'Copy failed',
        description: 'Could not copy to clipboard',
        type: 'error'
      });
    });
  };

  const exportJson = () => {
    const dataStr = JSON.stringify(recommendations, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportName = `${domain}-recommendations-${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportName);
    linkElement.click();

    addToast({
      title: 'Exported!',
      description: `Downloaded ${exportName}`,
      type: 'success',
      duration: 2000
    });
  };

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex justify-between items-center">
        <h2 className="font-mono font-black text-title text-black">
          {recommendations.length} Recommendations
        </h2>
        <div className="flex gap-2">
          <Button variant="default" size="sm" onClick={copyList}>
            Copy List
          </Button>
          <Button variant="default" size="sm" onClick={exportJson}>
            Export JSON
          </Button>
        </div>
      </div>

      {/* Low Confidence Warning */}
      {recommendations.some(r => r.confidence < 0.3) && (
        <div className="bg-yellow-100 border-4 border-yellow-500 p-4">
          <p className="font-mono font-bold text-yellow-900">
            ⚠️ Some recommendations have low confidence. Try more specific seeds for better results.
          </p>
        </div>
      )}

      {/* Results Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((rec, index) => (
          <RecommendationCard
            key={index}
            recommendation={rec}
            rank={index + 1}
          />
        ))}
      </div>
    </div>
  );
}

interface RecommendationCardProps {
  recommendation: Recommendation;
  rank: number;
}

function RecommendationCard({ recommendation, rank }: RecommendationCardProps) {
  const creator = 'artist' in recommendation ? recommendation.artist :
                 'director' in recommendation ? recommendation.director :
                 'creator' in recommendation ? recommendation.creator : 'Unknown';
  const confidencePercent = Math.round(recommendation.confidence * 100);
  
  const confidenceColor = 
    recommendation.confidence >= 0.7 ? 'bg-green-500' :
    recommendation.confidence >= 0.4 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <span className="font-mono font-bold text-sm text-surface-600">
            #{rank}
          </span>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 ${confidenceColor} border border-black`} />
            <span className="font-mono font-bold text-sm">
              {confidencePercent}%
            </span>
          </div>
        </div>
        <CardTitle className="text-lg leading-tight">
          {recommendation.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <p className="font-mono font-bold text-sm text-surface-800">
            {creator} • {formatYear(recommendation.year)}
          </p>
          {recommendation.genres.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {recommendation.genres.slice(0, 3).map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-1 bg-surface-200 border border-black font-mono text-xs font-bold"
                >
                  {genre}
                </span>
              ))}
              {recommendation.genres.length > 3 && (
                <span className="px-2 py-1 bg-surface-200 border border-black font-mono text-xs font-bold">
                  +{recommendation.genres.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="bg-surface-50 p-3 border-2 border-surface-300">
          <p className="font-mono text-sm font-medium leading-relaxed">
            "{truncateText(recommendation.why, 200)}"
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 checkerboard"></div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="h-64">
            <CardContent className="space-y-4 p-6">
              <div className="h-6 w-full checkerboard"></div>
              <div className="h-4 w-2/3 checkerboard"></div>
              <div className="h-4 w-full checkerboard"></div>
              <div className="h-20 w-full checkerboard"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ErrorState({ error }: { error: string }) {
  return (
    <Card className="bg-red-50 border-red-500">
      <CardContent className="text-center py-8">
        <div className="text-4xl mb-4">❌</div>
        <h3 className="font-mono font-black text-lg mb-2 text-red-900">
          Something went wrong
        </h3>
        <p className="font-mono font-bold text-red-800">
          {error}
        </p>
      </CardContent>
    </Card>
  );
}