import { GoogleGenerativeAI } from '@google/generative-ai';
import { Domain, Seed, RecommendationResponse } from '@/types';

const SONG_PROMPT_TEMPLATE = `You are a music recommender. Given up to five seed songs (title and optional artist),
infer taste signals (mood, tempo, genre, era, production, vocal style, cultural niche).
Return ONLY minified JSON conforming to this schema:

{ "items":[{"title":"String","artist":"String","year":1234,"genres":["String"],"why":"<=220 chars","confidence":0.0}], "meta":{"seed_count":INT,"requested":INT,"model":"gemini-2.5-flash"} }

- Produce EXACTLY {requested} items unless seeds are contradictory; if so, still produce but lower confidence and explain briefly in \`why\`.
- Keep \`confidence\` in [0,1].
- Avoid duplicates; avoid seeds themselves.
- Prefer globally recognizable items where possible.
- Max 2 lines worth of characters in \`why\` (<=220 chars).
- Respond with pure JSON. No markdown.
SEEDS:
{seeds_json}
REQUESTED: {count}`;

const MOVIE_PROMPT_TEMPLATE = `You are a film recommender. Given up to five seed films (title and optional director/year),
infer taste signals (tone, themes, pacing, cinematography, period, country, language).
Return ONLY minified JSON conforming to this schema:

{ "items":[{"title":"String","director":"String","year":1234,"genres":["String"],"why":"<=220 chars","confidence":0.0}], "meta":{"seed_count":INT,"requested":INT,"model":"gemini-2.5-flash"} }

- Produce EXACTLY {requested} items unless impossible; still fill but lower confidence and explain tension in \`why\`.
- Keep \`confidence\` in [0,1].
- Avoid duplicates; avoid seeds themselves.
- Mix a few non-obvious choices if confidence is high.
- Respond with pure JSON. No markdown.
SEEDS:
{seeds_json}
REQUESTED: {count}`;

const TVSHOW_PROMPT_TEMPLATE = `You are a TV series recommender. Given up to five seed TV shows (title and optional creator/year),
infer taste signals (narrative style, character development, pacing, themes, tone, setting, format).
Return ONLY minified JSON conforming to this schema:

{ "items":[{"title":"String","creator":"String","year":1234,"genres":["String"],"why":"<=220 chars","confidence":0.0}], "meta":{"seed_count":INT,"requested":INT,"model":"gemini-2.5-flash"} }

- Produce EXACTLY {requested} items unless impossible; still fill but lower confidence and explain tension in \`why\`.
- Keep \`confidence\` in [0,1].
- Avoid duplicates; avoid seeds themselves.
- Mix a few non-obvious choices if confidence is high.
- Consider both streaming and broadcast series.
- Respond with pure JSON. No markdown.
SEEDS:
{seeds_json}
REQUESTED: {count}`;

let genAI: GoogleGenerativeAI | null = null;

function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export async function getRecommendations(
  domain: Domain,
  seeds: Seed[],
  count: number,
  retryCount = 0
): Promise<RecommendationResponse> {
  const maxRetries = 2;
  const temperature = retryCount > 0 ? 0.4 : 0.6;

  try {
    const ai = getGenAI();
    const model = ai.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature,
        maxOutputTokens: 8192,
        topP: 0.8,
        topK: 40
      }
    });

    const template = domain === 'songs' ? SONG_PROMPT_TEMPLATE :
                    domain === 'movies' ? MOVIE_PROMPT_TEMPLATE :
                    TVSHOW_PROMPT_TEMPLATE;
    const seedsJson = JSON.stringify(seeds);
    const prompt = template
      .replace('{seeds_json}', seedsJson)
      .replace('{count}', count.toString())
      .replace('{requested}', count.toString());

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse and validate response
    const parsed = parseGeminiResponse(text);
    
    // Validate structure
    if (!parsed.items || !Array.isArray(parsed.items)) {
      throw new Error('Invalid response structure: missing items array');
    }

    if (!parsed.meta) {
      parsed.meta = {
        seed_count: seeds.length,
        requested: count,
        model: 'gemini-2.5-flash'
      };
    }

    // Validate and normalize items
    parsed.items = parsed.items
      .map((item: any) => normalizeRecommendation(item, domain))
      .filter((item: any) => item !== null)
      .slice(0, count);

    return parsed as RecommendationResponse;

  } catch (error) {
    console.error(`Gemini API error (attempt ${retryCount + 1}):`, error);
    
    if (retryCount < maxRetries) {
      // Exponential backoff
      const delay = Math.pow(2, retryCount) * 100;
      await new Promise(resolve => setTimeout(resolve, delay));
      return getRecommendations(domain, seeds, count, retryCount + 1);
    }

    throw new Error('Failed to get recommendations from Gemini API');
  }
}

function parseGeminiResponse(text: string): any {
  // First try direct JSON parsing
  try {
    return JSON.parse(text);
  } catch (e) {
    // Try to extract JSON from markdown or other text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e) {
        // Last resort: try to repair common JSON issues
        let cleaned = jsonMatch[0]
          .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
          .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":') // Quote unquoted keys
          .replace(/:\s*'([^']*)'/g, ':"$1"'); // Convert single quotes to double
        
        return JSON.parse(cleaned);
      }
    }
    throw new Error('Could not extract valid JSON from response');
  }
}

function normalizeRecommendation(item: any, domain: Domain): any {
  if (!item || typeof item !== 'object') return null;
  
  const title = item.title?.trim();
  if (!title || typeof title !== 'string') return null;

  const baseItem = {
    title,
    year: typeof item.year === 'number' ? Math.max(1900, Math.min(2030, item.year)) : 2020,
    genres: Array.isArray(item.genres) ? item.genres.slice(0, 5) : [],
    why: typeof item.why === 'string' ? item.why.slice(0, 220) : 'Similar to your seeds',
    confidence: typeof item.confidence === 'number' ? Math.max(0, Math.min(1, item.confidence)) : 0.5
  };

  if (domain === 'songs') {
    return {
      ...baseItem,
      artist: item.artist?.trim() || 'Unknown Artist'
    };
  } else if (domain === 'movies') {
    return {
      ...baseItem,
      director: item.director?.trim() || 'Unknown Director'
    };
  } else {
    return {
      ...baseItem,
      creator: item.creator?.trim() || 'Unknown Creator'
    };
  }
}