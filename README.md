# RECOMMEND • Neo-Brutalist Song & Movie Recommender

**Find your next track & film** with AI-powered recommendations using Google's Gemini 2.5 Flash. No login required, privacy-friendly, and built with a bold neo-brutalist design.

## ✨ Features

- **🎵 Song Recommendations**: Get music recommendations based on up to 5 seed tracks
- **🎬 Movie Recommendations**: Discover films based on your favorite movies
- **⚡ Gemini 2.5 Flash**: Powered by Google's fast and accurate AI model
- **🔒 Privacy-First**: No tracking, no analytics, API keys stay server-side
- **🎨 Neo-Brutalist Design**: Bold, accessible design with high contrast and tactile interactions
- **📱 Responsive**: Works great on desktop and mobile
- **♿ Accessible**: Full keyboard navigation, ARIA labels, high contrast
- **💾 Smart Persistence**: Remembers your last seeds and preferences locally

## 🚀 Live Demo

[Add your live Vercel URL here once deployed]

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom neo-brutalist design system
- **AI**: Google Gemini 2.5 Flash API
- **TypeScript**: Full type safety
- **Testing**: Jest with React Testing Library
- **Deployment**: Optimized for Vercel

### Why Next.js?

After researching current best practices, Next.js was chosen for:
- Native Vercel integration with optimal cold-start performance
- Built-in API routes perfect for server-side Gemini calls
- File-based routing with query param support for deep-linkable URLs
- Excellent SEO and performance optimization capabilities
- Mature ecosystem with extensive tooling support

## 📋 Local Development Setup

### Prerequisites

- Node.js 18+ 
- npm (comes with Node.js)
- A Google AI Studio account for Gemini API key

### 1. Clone and Install

```bash
git clone [your-repo-url]
cd song-movie-recommender
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

**Getting a Gemini API Key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and add it to your `.env.local` file

⚠️ **Important**: Never commit your API key to version control. The `.env.local` file is already in `.gitignore`.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### 4. Build and Test

```bash
# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Run linting
npm run lint
```

## 🌐 Deployment to Vercel

### Option 1: GitHub Integration (Recommended)

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Set environment variables:
   - `GEMINI_API_KEY`: Your Gemini API key
6. Deploy!

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variable
vercel env add GEMINI_API_KEY
```

## 🏗 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/recommend/      # Recommendation API endpoint
│   ├── songs/              # Songs recommender page
│   ├── movies/             # Movies recommender page
│   ├── privacy/            # Privacy policy page
│   └── layout.tsx          # Root layout with providers
├── components/             # React components
│   ├── ui/                 # Base UI components (Button, Input, etc.)
│   ├── forms/              # Form components (SeedList)
│   ├── AppShell.tsx        # Main app layout
│   ├── LandingHero.tsx     # Homepage hero section
│   └── ResultsList.tsx     # Results display
├── lib/                    # Utility libraries
│   ├── gemini.ts           # Gemini API integration
│   ├── validation.ts       # Request validation
│   ├── api-client.ts       # Client-side API wrapper
│   ├── storage.ts          # localStorage management
│   └── utils.ts            # General utilities
├── hooks/                  # React hooks
│   └── useRecommendations.ts # Recommendations hook
└── types/                  # TypeScript types
    └── index.ts            # Type definitions
```

## 🎨 Design System

The app uses a custom neo-brutalist design system with:
- **Bold typography**: Monospace fonts with high contrast
- **Thick borders**: 2-4px borders throughout
- **Drop shadows**: Offset shadows that move on hover
- **High contrast**: WCAG AA compliant color combinations
- **Tactile interactions**: Hover effects that simulate physical depth
- **Accessible focus states**: Clear focus rings and keyboard navigation

## 📡 API Documentation

### POST /api/recommend

Generate recommendations for songs or movies.

**Request Body:**
```json
{
  "domain": "songs" | "movies",
  "seeds": [
    { "title": "Song/Movie Title", "by": "Artist/Director (optional)" }
  ],
  "count": 10
}
```

**Response:**
```json
{
  "items": [
    {
      "title": "Recommended Title",
      "artist": "Artist Name", // songs only
      "director": "Director Name", // movies only
      "year": 2020,
      "genres": ["Pop", "Rock"],
      "why": "Reason for recommendation",
      "confidence": 0.85
    }
  ],
  "meta": {
    "seed_count": 2,
    "requested": 10,
    "model": "gemini-2.5-flash"
  }
}
```

**Rate Limits:**
- 10 requests per 15-minute window per IP
- Implements exponential backoff for retries

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- lib/validation.test.ts
```

Tests cover:
- JSON schema validation
- Confidence clamping logic
- Duplicate removal
- API error handling
- Component rendering

## 🔍 Troubleshooting

### Common Issues

**"GEMINI_API_KEY not found" error:**
- Make sure your `.env.local` file is in the root directory
- Verify the API key is valid and not expired
- Restart the development server after adding environment variables

**Rate limiting errors:**
- The app implements basic rate limiting (10 requests per 15 minutes)
- Wait for the rate limit window to reset
- In production, consider implementing user-based rate limiting

**Build errors:**
- Run `npm run lint` to check for TypeScript/ESLint errors
- Ensure all environment variables are set in Vercel dashboard
- Check the build logs for specific error messages

**Slow API responses:**
- Gemini API response times can vary based on request complexity
- The app implements timeout and retry logic
- Consider reducing the number of requested recommendations

## 🚧 Known Limitations

1. **Rate Limiting**: Basic IP-based rate limiting resets on server restart
2. **Caching**: No Redis/persistent caching layer for repeated requests  
3. **Gemini API**: Response quality depends on Google's model performance
4. **Mobile UX**: Some neo-brutalist hover effects are reduced on touch devices

## 🔮 Potential Improvements

- [ ] Redis-based persistent rate limiting
- [ ] Request caching to reduce API calls
- [ ] User accounts for personalized recommendations
- [ ] Export recommendations to Spotify/Apple Music
- [ ] Recommendation history and favorites
- [ ] A/B testing for prompt optimization
- [ ] Internationalization support

## 🔐 Privacy & Security

- **No Tracking**: Zero analytics or tracking by default
- **Server-Side Processing**: API keys never exposed to client
- **Local Storage**: User preferences stored locally only
- **Rate Limiting**: Basic protection against abuse
- **Input Sanitization**: All user inputs validated and sanitized

## 📄 License

This project is open source. See the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please read the contributing guidelines and submit pull requests.

---

**Built with ❤️ and lots of ☕ using Claude Code**
