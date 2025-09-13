import { NextRequest, NextResponse } from 'next/server';
import { getRecommendations } from '@/lib/gemini';
import { validateSeeds, validateDomain, validateCount } from '@/lib/validation';
import { removeDuplicates, sortByConfidence, normalizeSeed } from '@/lib/utils';
import { Recommendation } from '@/types';

// Simple rate limiting (in-memory, resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 10; // requests per window
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes

function getRateLimitKey(request: NextRequest): string {
  // Use IP address or a fallback for rate limiting
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 
             request.headers.get('x-real-ip') || 
             'unknown';
  return ip.trim();
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    // Create new record or reset expired one
    const newRecord = { count: 1, resetTime: now + RATE_LIMIT_WINDOW };
    rateLimitMap.set(key, newRecord);
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetTime: newRecord.resetTime };
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - record.count, resetTime: record.resetTime };
}

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const rateLimitKey = getRateLimitKey(request);
    const rateLimit = checkRateLimit(rateLimitKey);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again later.', 
          code: 'RATE_LIMIT' 
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': rateLimit.resetTime.toString(),
          }
        }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body', code: 'BAD_REQUEST' },
        { status: 400 }
      );
    }

    // Validate domain
    if (!validateDomain(body.domain)) {
      return NextResponse.json(
        { error: 'Domain must be either "songs" or "movies"', code: 'BAD_REQUEST' },
        { status: 400 }
      );
    }

    // Validate seeds
    const seedValidation = validateSeeds(body.seeds);
    if (!seedValidation.valid) {
      return NextResponse.json(
        { error: seedValidation.errors.join(', '), code: 'BAD_REQUEST' },
        { status: 400 }
      );
    }

    // Validate count
    const countValidation = validateCount(body.count);
    if (!countValidation.valid) {
      return NextResponse.json(
        { error: countValidation.error, code: 'BAD_REQUEST' },
        { status: 400 }
      );
    }

    const count = countValidation.value!;
    const normalizedSeeds = body.seeds.map(normalizeSeed);

    // Get recommendations from Gemini
    try {
      const response = await getRecommendations(body.domain, normalizedSeeds, count);
      
      // Process recommendations
      let recommendations = response.items as Recommendation[];
      
      // Remove duplicates and sort by confidence
      recommendations = removeDuplicates(recommendations);
      recommendations = sortByConfidence(recommendations);
      
      // Ensure we have the requested count or explain why not
      if (recommendations.length < count) {
        console.warn(`Only got ${recommendations.length} recommendations instead of ${count}`);
      }

      const finalResponse = {
        items: recommendations,
        meta: {
          ...response.meta,
          seed_count: normalizedSeeds.length,
          requested: count
        }
      };

      return NextResponse.json(finalResponse, {
        headers: {
          'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.resetTime.toString(),
        }
      });

    } catch (error) {
      console.error('Gemini API error:', error);
      
      return NextResponse.json(
        { 
          error: 'Failed to generate recommendations. Please try again.', 
          code: 'UPSTREAM' 
        },
        { status: 503 }
      );
    }

  } catch (error) {
    console.error('Unexpected error in recommendation API:', error);
    
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred. Please try again.', 
        code: 'PARSE_ERROR' 
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.', code: 'BAD_REQUEST' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.', code: 'BAD_REQUEST' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.', code: 'BAD_REQUEST' },
    { status: 405 }
  );
}