# CIVIC AI — Frontend

"Report. Understand. Resolve." — a citizen reporting UI for a civic governance
platform, wired to your existing FastAPI backend at
`http://127.0.0.1:8000/api/analyze-request`.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (default `http://localhost:5173`) **with your
FastAPI backend already running on port 8000**. The app will not fabricate
data — every result on screen comes from your API.

## ⚠️ Important — what I could and couldn't verify

I built and reviewed this in a sandboxed environment with **no network
access**, so I could not run `npm install`, start Vite, or make a live
request to `127.0.0.1:8000` myself. I cannot honestly claim to have executed
the full flow end-to-end against your backend. What I did do:

- Wrote every file by hand and re-read each one for syntax/type correctness.
- Kept the API contract exactly as specified (`text`, `latitude`, `longitude`
  → `POST /api/analyze-request`), with real `navigator.geolocation`
  coordinates only — never mocked.
- Built defensive response parsing (see below) so the result screen degrades
  gracefully instead of crashing if a field is missing or named differently
  than expected.

**Please run it against your real backend before a demo**, and if anything
breaks on first run it's almost certainly the response-field mapping below —
that's the one part of the contract I had to infer rather than verify.

## Backend response mapping

The spec didn't include your exact JSON response schema, so
`src/lib/api.ts` normalizes the response defensively: it looks for each
field under a few common spellings (`snake_case`, `camelCase`, nested under
`analysis`/`data`, etc.) via the `normalize()` function. If your backend
uses different key names, that's the only place you should need to edit —
add your real key to the relevant `pick(...)` call, e.g.:

```ts
category: pick(analysis, ["category", "Category", "your_actual_key"]),
```

The full raw response is always kept (`result.raw`) and is viewable in the
UI via "View full complaint record", so nothing is ever silently dropped
even if a field isn't mapped yet.

## Structure

```
src/
  lib/api.ts              — API_URL constant, request/response types, error classification
  hooks/useGeolocation.ts — real browser Geolocation API state machine
  components/
    ReportSection.tsx     — orchestrates the whole reporting flow (form → processing → result/error)
    LocationCard.tsx       — location detection UI + states
    ProcessingState.tsx    — staged AI-analysis loading animation
    ResultCard.tsx          — structured result screen
    Hero.tsx, HowItWorks.tsx, ImpactSection.tsx, LocationIntelligenceVisual.tsx, ...
    ui/primitives.tsx      — Button, Card, Badge
```

## Design notes

- Palette: midnight navy (`#060B1F`) surfaces, electric blue (`#2E6BFF`)
  primary accent, cyan (`#22D3EE`) glow accent — all as named Tailwind
  tokens in `tailwind.config.js`.
- Type: Space Grotesk for headings/display, Inter for body copy, JetBrains
  Mono for data/labels (complaint IDs, coordinates, step numbers) — a
  deliberate three-role system rather than one font doing everything.
- Signature element: the animated node pipeline in the hero
  (`PipelineVisual.tsx`) — citizen report → AI analysis → priority →
  location → governance action, connected by a glowing line rather than a
  literal chart or a robot illustration.
- The "Impact" counters and the location-intelligence map are explicitly
  labeled as illustrative/demo — nothing there is presented as real backend
  data, per the spec.
- Respects `prefers-reduced-motion`, keyboard focus is visible everywhere,
  and interactive elements have accessible labels.

## Things worth double-checking against your actual backend

1. **Response field names** (see above) — the single biggest risk to a live
   demo.
2. **CORS** — if your FastAPI app doesn't already allow
   `http://localhost:5173`, add it to your CORS middleware or the fetch
   from the browser will fail with a network error (which the UI will show
   as "We couldn't reach the CIVIC AI service").
3. **Timeout** — set to 45s in `api.ts` to give a Gemini-backed call room to
   breathe; adjust `REQUEST_TIMEOUT_MS` if your backend is slower/faster.
