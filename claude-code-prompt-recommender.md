# Claude Code Prompt — Neo‑Brutalist Song & Movie Recommender (Gemini 2.5 Flash)

> **You are Claude Code.** Build a production‑ready, no‑login web app with an interactive landing page and two tools:
> 1) **Song Recommender** and 2) **Movie Recommender**.  
> Recs must be generated **via Google Gemini `gemini-2.5-flash`** using a **server‑side** call with an API key provided via **Vercel environment variables**.  
> The user will sync code to GitHub and deploy on Vercel. You must **think step‑by‑step**, **research current best practices**, justify each choice briefly in the PR description/comments, and then implement.

---

## TL;DR (Acceptance Criteria)

- **No auth**. Open and use.
- **Pages**: (1) **Get Started** (interactive landing), (2) **Songs** recommender, (3) **Movies** recommender. Clean routing and deep‑linkable URLs.
- **Neo‑brutalism UI**: bold thick borders, chunky shadows, high‑contrast, offset outlines, limited palette with bright accents, large readable type, tactile micro‑interactions. Respect a11y.
- **Inputs**: Up to **5 seed items** (songs or movies). A dropdown to select **1–20** recommendations (default 10).
- **LLM**: Call **Gemini 2.5 Flash** server‑side with key from env (`GEMINI_API_KEY`). **Never expose** key to the client. Handle timeouts, retries, and JSON‑parsing errors.
- **Output**: Structured JSON parsed into UI cards with: title, primary creator (artist/director), year, genres, a short “why it matches” blurb, and a **confidence 0–1**. De‑dupe and sort by confidence.
- **Empty state**: show tasteful sample seeds users can one‑click add.
- **Performance**: debounce inputs, optimistic loading states, error toasts, minimal bundle, cache last result per seed set client‑side.
- **Deploy**: Works locally and on Vercel. **README** with setup. **Env var** documented. Basic QA checks pass.
- **No external paid APIs** besides Gemini. No login/analytics without consent.

---

## Deliverables

1. A single web app repository with clear structure (you choose framework after research).  
2. **README**: run/dev/build/deploy steps; environment variables; model usage notes; troubleshooting.  
3. **ENV**: reads `process.env.GEMINI_API_KEY` (or equivalent for chosen stack).  
4. **Server‑only** module/function for Gemini calls; no key in client bundle.  
5. **Typed response schema** for recommendations with strict parsing & fallbacks.  
6. **Accessibility pass** (landmarks, labels, keyboard navigation, contrast).  
7. **Smoke tests** (at least: JSON schema parser tests & a basic page render test).  
8. **Deployment to Vercel** (document steps).

---

## Non‑Functional Requirements & Guardrails

- **Framework/Stack**: You decide (SSR/SSG/SPA). Prefer file‑based routing. Justify choice in a short comment in the first PR. Keep build and cold‑start fast on Vercel.
- **Styling**: Implement a **neo‑brutalist design system** (tokens + utilities or CSS). Avoid fragile one‑off styles. No dependency bloat—only add libs with clear value.
- **State**: Keep it simple (URL search params or minimal state lib). Remember preferences (last seed set, count) in localStorage with explicit reset.
- **Security**: API key stays server‑side. Rate‑limit the recommendation endpoint (basic protection). Validate/escape all inputs. No PII storage.
- **Privacy**: No tracking by default. If you include optional telemetry, gate behind an explicit toggle that defaults **off** and stores in localStorage.
- **Performance**: Lazy‑load non‑critical chunks. Avoid layout thrash. Provide skeletons. Pass Lighthouse basics on desktop and mobile.
- **Accessibility**: Keyboard‑first navigation. Focus rings. Labels/ARIA where needed. Hit targets ≥ 44px. Respect reduced motion.
- **Internationalization**: English‑only for now; design copy so it won’t break layouts if localized later.

---

## Pages & UX Flow

### 1) Get Started (Landing)
**Goal**: Orient and route users fast.  
**Hero**: Big bold headline (“Find your next track & film.”), subcopy (“Paste up to 5 seeds. We’ll infer taste with Gemini 2.5 Flash.”).  
**Callouts** (3 cards with playful brutalist style):  
- **No login** — open & instant  
- **Fast AI** — Gemini Flash under the hood  
- **Privacy‑friendly** — keys stay server‑side  
**Interactive CTA**: Two massive cards: **Songs** and **Movies**. Hover = offset shadow + slight tilt. Keyboard selectable.  
**Footer**: Minimal. Link to README, repo, and privacy notes.

### 2) Songs Recommender
- **Seed input area** (up to 5): each seed row has **Title** and optional **Artist**. Provide “+ Add seed” until 5; disable beyond.
- **Quick chips**: “Add sample seeds” to auto‑fill 3–5 popular songs (for demo).
- **Count selector**: Dropdown 1–20 (default 10).
- **Action**: **Get Recommendations** button (primary, chunky). While loading: animated checkerboard skeletons.
- **Results**: Grid/List of cards; each shows:
  - Title (bold), Artist, Year, Genres (chips), **Confidence** bar/tag, 1–2 line **Why** blurb.
  - “Copy list” (copies titles) and “Export JSON” (downloads current results).
- **Edge cases**: empty results, low confidence (show warning banner), invalid seeds (inline validation).

### 3) Movies Recommender
Identical mechanics to Songs. Seed rows: **Title** and optional **Director**/**Year**. Same limit and count selector. Same output UI.

---

## Data Contracts (Strict)

### LLM Output JSON (Songs)
```json
{
  "items": [
    {
      "title": "String",
      "artist": "String",
      "year": 2016,
      "genres": ["String"],
      "why": "<= 220 chars reason referencing seed traits (mood, tempo, era, production).",
      "confidence": 0.0
    }
  ],
  "meta": {
    "seed_count": 3,
    "requested": 10,
    "model": "gemini-2.5-flash"
  }
}
```

### LLM Output JSON (Movies)
```json
{
  "items": [
    {
      "title": "String",
      "director": "String",
      "year": 2014,
      "genres": ["String"],
      "why": "<= 220 chars reason referencing seed traits (tone, theme, pacing, cinematography).",
      "confidence": 0.0
    }
  ],
  "meta": {
    "seed_count": 4,
    "requested": 12,
    "model": "gemini-2.5-flash"
  }
}
```

### Client‑Server API
- **Route**: `POST /api/recommend`
- **Body**:
```json
{
  "domain": "songs|movies",
  "seeds": [{"title": "String", "by": "String"}],
  "count": 10
}
```
- **Response**: one of the JSON contracts above (`items` + `meta`).  
- **Errors**: JSON with `{ "error": "message", "code": "BAD_REQUEST|UPSTREAM|RATE_LIMIT|PARSE_ERROR" }`

**Validation rules**:
- `domain` required ∈ {songs, movies}
- `1 ≤ seeds.length ≤ 5`, non‑empty `title` strings (2–120 chars). Reject obviously garbage inputs (emoji‑only, >120 chars).
- `1 ≤ count ≤ 20`

---

## Gemini Call (Server‑Side Only)

- **Model**: `gemini-2.5-flash` (research the latest stable name; document if different).  
- **Key**: `GEMINI_API_KEY` via environment (Vercel dashboard).  
- **Temperature**: start **0.6**; retry with **0.4** if parsing fails or confidence variance too high.  
- **System/Style**: ask for **valid JSON only**, no prose, matching the schema for the selected domain.  
- **Safety**: refuse to output NSFW titles; if unavoidable, drop them and fill with next best alternatives.

**Prompt Template — Songs**
```
You are a music recommender. Given up to five seed songs (title and optional artist),
infer taste signals (mood, tempo, genre, era, production, vocal style, cultural niche).
Return ONLY minified JSON conforming to this schema:

{ "items":[{"title":"String","artist":"String","year":1234,"genres":["String"],"why":"<=220 chars","confidence":0.0}], "meta":{"seed_count":INT,"requested":INT,"model":"gemini-2.5-flash"} }

- Produce EXACTLY {requested} items unless seeds are contradictory; if so, still produce but lower confidence and explain briefly in `why`.
- Keep `confidence` in [0,1].
- Avoid duplicates; avoid seeds themselves.
- Prefer globally recognizable items where possible.
- Max 2 lines worth of characters in `why` (<=220 chars).
- Respond with pure JSON. No markdown.
SEEDS:
{{seeds_json}}
REQUESTED: {{count}}
```

**Prompt Template — Movies**
```
You are a film recommender. Given up to five seed films (title and optional director/year),
infer taste signals (tone, themes, pacing, cinematography, period, country, language).
Return ONLY minified JSON conforming to this schema:

{ "items":[{"title":"String","director":"String","year":1234,"genres":["String"],"why":"<=220 chars","confidence":0.0}], "meta":{"seed_count":INT,"requested":INT,"model":"gemini-2.5-flash"} }

- Produce EXACTLY {requested} items unless impossible; still fill but lower confidence and explain tension in `why`.
- Keep `confidence` in [0,1].
- Avoid duplicates; avoid seeds themselves.
- Mix a few non‑obvious choices if confidence is high.
- Respond with pure JSON. No markdown.
SEEDS:
{{seeds_json}}
REQUESTED: {{count}}
```

**Parsing & Resilience**
- Parse as JSON; if fails, **attempt fast repair** (strip pre/post text, JSON5 tolerance) then one controlled **retry** with stricter instructions.
- On upstream error: backoff (100ms, 400ms), return friendly message to UI.
- Clamp and normalize `confidence` ∈ [0,1]; remove dupes by normalized title+creator.

---

## Design System — Neo‑Brutalism

- **Tokens**: primary, accent, surface, text, border, shadow‑offset.  
- **Typography**: big display for headings, tight leading; monospace or geometric sans for UI.  
- **Buttons**: oversized, thick 2–4px borders, offset drop shadows (2–6px), strong hover/active states.  
- **Cards**: flat fills, visible outlines, slight rotation/offset on hover.  
- **Grid**: CSS grid with generous gaps; mobile‑first responsive.  
- **Color**: 1–2 base neutrals + 2 accents. Respect contrast (WCAG AA).  
- **Motion**: minimal; prefer instant snappy states. Respect `prefers-reduced-motion`.

Provide a small **theme toggle**: Default “Light Neo‑Bru” with optional “Dark Neo‑Bru”.

---

## Component Inventory (you implement)

- `AppShell` (header with logo/name; nav to Songs/Movies; theme toggle; footer).  
- `LandingHero` (interactive CTA cards).  
- `SeedList` (add/remove rows, validation, helpful placeholders).  
- `CountSelect` (1–20).  
- `RecommendButton` (handles loading states).  
- `ResultsList` (cards with copy/export actions).  
- `Toast` (errors/success).  
- `ApiClient` (client→server fetch wrapper).  
- `RecommendHandler` (server function calling Gemini).  
- `Schema` (Zod/Valibot/yup or equivalent—your choice).  
- `Storage` (thin localStorage wrapper to persist last seeds & count).

---

## URL Patterns

- `/` — Landing.  
- `/songs?seeds=...&count=10` — Deep linkable; seeds & count serializable.  
- `/movies?seeds=...&count=10` — Same.

Implement shareable URLs: the UI should hydrate from query params.

---

## Environment & Deployment

- **Env var**: `GEMINI_API_KEY` (document in README).  
- **Local dev**: `.env.local` supported; do not commit.  
- **Vercel**: Create project, add env var in dashboard, connect to GitHub.  
- **Build**: Small bundle; no server key leakage (verify by `grep` client build).  
- **CORS**: Server route should accept only same‑origin.  
- **Rate limiting**: Basic per‑IP or per‑session (your choice; simple memory or edge‑cache friendly approach).

---

## Testing & QA

- **Unit**: JSON schema parsing; confidence clamping; de‑dup logic.  
- **Integration**: Mock Gemini response and ensure UI renders result cards.  
- **E2E (smoke)**: Landing → Songs → enter 3 seeds → request 7 → see 7 items with confidence tags; repeat for Movies.  
- **A11y**: Tab through key flows; verify focus and ARIA labels.  
- **Perf**: Lighthouse ≥ 90 performance on desktop; TTI under 2.5s on median hardware.

---

## Copy (Starter)

- **Landing H1**: “Find your next track & film.”  
- **Subhead**: “Give us up to five seeds. Gemini 2.5 Flash will riff on your taste.”  
- **Songs intro**: “Drop song titles (add artist if you can). We’ll return similar vibes.”  
- **Movies intro**: “List a few films you love. We’ll surface neighbors by tone, theme, and craft.”  
- **Empty state tip**: “No idea? Add sample seeds to try it.”

---

## Stretch (Only if time remains)

- **Keyboard power‑user**: Cmd/Ctrl‑Enter to submit.  
- **Export**: CSV + JSON export.  
- **Share**: “Copy link with seeds” button.  
- **Mini insights**: Small chips like “Moody • 2010s • Electronic • Danceable” (Songs) / “Slow‑burn • Neo‑noir • Europe • 1990s” (Movies)—derived from LLM if reliable.

---

## README Checklist (you must include)

- What this app does, live URL (once deployed).  
- Local setup: clone, install, run dev, set `GEMINI_API_KEY`.  
- Deploy to Vercel with GitHub.  
- Tech choices rationale (short).  
- Known limitations and how to improve.  
- Privacy note: no tracking by default; API key server‑only.

---

## Definition of Done

- Users can land, pick Songs/Movies, add ≤5 seeds, pick 1–20 results, click recommend, and get high‑quality cards with reasons and confidence.  
- No crashes with empty/invalid input (graceful errors).  
- Mobile and desktop are polished and accessible.  
- Key never ships to client.  
- Vercel deploy succeeds from GitHub main.  
- README and env setup are correct.
