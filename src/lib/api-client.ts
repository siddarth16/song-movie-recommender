import { RecommendationRequest, RecommendationResponse, ErrorResponse } from '@/types';

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  async getRecommendations(request: RecommendationRequest): Promise<RecommendationResponse> {
    const response = await fetch(`${this.baseUrl}/api/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = data as ErrorResponse;
      throw new ApiError(error.error, error.code, response.status);
    }

    return data as RecommendationResponse;
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }

  isRateLimit(): boolean {
    return this.code === 'RATE_LIMIT';
  }

  isUpstreamError(): boolean {
    return this.code === 'UPSTREAM';
  }

  isBadRequest(): boolean {
    return this.code === 'BAD_REQUEST';
  }

  isParseError(): boolean {
    return this.code === 'PARSE_ERROR';
  }
}

// Singleton instance
export const apiClient = new ApiClient();