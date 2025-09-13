'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Seed, Domain, SAMPLE_SONGS, SAMPLE_MOVIES } from '@/types';
import { validateSeedTitle, normalizeSeed } from '@/lib/utils';

interface SeedListProps {
  domain: Domain;
  seeds: Seed[];
  onSeedsChange: (seeds: Seed[]) => void;
  maxSeeds?: number;
}

export function SeedList({ domain, seeds, onSeedsChange, maxSeeds = 5 }: SeedListProps) {
  const [errors, setErrors] = useState<Record<number, string>>({});

  const addSeed = () => {
    if (seeds.length >= maxSeeds) return;
    onSeedsChange([...seeds, { title: '', by: '' }]);
  };

  const removeSeed = (index: number) => {
    const newSeeds = seeds.filter((_, i) => i !== index);
    onSeedsChange(newSeeds);
    
    // Remove error for this index
    const newErrors = { ...errors };
    delete newErrors[index];
    // Shift down error indices
    const shiftedErrors: Record<number, string> = {};
    Object.entries(newErrors).forEach(([key, value]) => {
      const idx = parseInt(key);
      if (idx > index) {
        shiftedErrors[idx - 1] = value;
      } else {
        shiftedErrors[idx] = value;
      }
    });
    setErrors(shiftedErrors);
  };

  const updateSeed = (index: number, field: 'title' | 'by', value: string) => {
    const newSeeds = [...seeds];
    newSeeds[index] = { ...newSeeds[index], [field]: value };
    onSeedsChange(newSeeds);

    // Validate title field
    if (field === 'title') {
      const newErrors = { ...errors };
      if (value.trim() && !validateSeedTitle(value)) {
        newErrors[index] = 'Title must be 2-120 characters and not just emojis';
      } else {
        delete newErrors[index];
      }
      setErrors(newErrors);
    }
  };

  const addSampleSeeds = () => {
    const samples = domain === 'songs' ? SAMPLE_SONGS : SAMPLE_MOVIES;
    const sampleSeeds = samples.slice(0, 3).map(normalizeSeed);
    onSeedsChange(sampleSeeds);
    setErrors({});
  };

  const clearAll = () => {
    onSeedsChange([]);
    setErrors({});
  };

  const byLabel = domain === 'songs' ? 'Artist' : 'Director';
  const placeholderTitle = domain === 'songs' ? 'Song title...' : 'Movie title...';
  const placeholderBy = domain === 'songs' ? 'Artist name...' : 'Director name...';

  return (
    <Card>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-mono font-black text-heading text-black">
            Seeds ({seeds.length}/{maxSeeds})
          </h3>
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={addSampleSeeds}
              disabled={seeds.length >= maxSeeds}
            >
              Add Samples
            </Button>
            {seeds.length > 0 && (
              <Button
                variant="default"
                size="sm"
                onClick={clearAll}
              >
                Clear All
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {seeds.map((seed, index) => (
            <SeedRow
              key={index}
              index={index}
              seed={seed}
              error={errors[index]}
              onUpdate={updateSeed}
              onRemove={removeSeed}
              byLabel={byLabel}
              placeholderTitle={placeholderTitle}
              placeholderBy={placeholderBy}
              canRemove={seeds.length > 1 || seed.title.trim() !== ''}
            />
          ))}

          {seeds.length === 0 && (
            <div className="text-center py-8 text-surface-600">
              <p className="font-mono font-bold mb-4">No seeds yet!</p>
              <Button onClick={addSeed} variant="primary">
                Add Your First Seed
              </Button>
            </div>
          )}

          {seeds.length > 0 && seeds.length < maxSeeds && (
            <Button
              onClick={addSeed}
              variant="primary"
              className="w-full"
              disabled={seeds.length >= maxSeeds}
            >
              + Add Seed ({seeds.length}/{maxSeeds})
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface SeedRowProps {
  index: number;
  seed: Seed;
  error?: string;
  onUpdate: (index: number, field: 'title' | 'by', value: string) => void;
  onRemove: (index: number) => void;
  byLabel: string;
  placeholderTitle: string;
  placeholderBy: string;
  canRemove: boolean;
}

function SeedRow({
  index,
  seed,
  error,
  onUpdate,
  onRemove,
  byLabel,
  placeholderTitle,
  placeholderBy,
  canRemove,
}: SeedRowProps) {
  return (
    <div className="p-4 border-2 border-black bg-surface-50">
      <div className="flex justify-between items-start mb-3">
        <span className="font-mono font-bold text-sm text-surface-800">
          Seed #{index + 1}
        </span>
        {canRemove && (
          <button
            onClick={() => onRemove(index)}
            className="font-mono font-bold text-red-600 hover:text-red-800 transition-colors text-lg leading-none"
            aria-label={`Remove seed ${index + 1}`}
          >
            ×
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="Title *"
          value={seed.title}
          onChange={(e) => onUpdate(index, 'title', e.target.value)}
          placeholder={placeholderTitle}
          error={error}
          required
        />
        <Input
          label={byLabel}
          value={seed.by || ''}
          onChange={(e) => onUpdate(index, 'by', e.target.value)}
          placeholder={placeholderBy}
        />
      </div>
    </div>
  );
}