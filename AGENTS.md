# AI Agent Instructions for SpendLens

## Project Overview
SpendLens is a Next.js 15 app with TypeScript, Tailwind CSS, and shadcn/ui.
Backend uses MongoDB Atlas with Mongoose. AI summaries use Gemini via OpenAI-compatible API.

## Key Architecture Rules
- Audit engine is in `lib/audit-engine/` — NEVER use AI for audit calculations
- All pricing data is in `lib/audit-engine/pricing.ts` — update from official vendor URLs only
- API routes are in `app/api/` — always validate input, always handle errors
- MongoDB models are in `lib/models/` — use lean() for read-only queries
- Never expose secrets — all keys go in .env.local only

## Code Style
- Use TypeScript strictly — no `any` unless absolutely necessary
- Use named exports for utilities, default exports for components
- Use async/await — no .then() chains
- Keep components under 200 lines — split if larger
- Always handle loading and error states in client components

## File Structure
- Components go in `components/` with subfolders: forms, results, shared, ui
- API routes go in `app/api/`
- Business logic goes in `lib/`
- Tests go in `__tests__/`

## Environment Variables
- MONGODB_URI — MongoDB Atlas connection string
- OPENAI_API_KEY — Gemini API key
- OPENAI_BASE_URL — Gemini OpenAI-compatible endpoint
- OPENAI_MODEL — gemini-2.5-flash
- RESEND_API_KEY — Resend email API key
- NEXT_PUBLIC_APP_URL — deployed URL

## Testing
- Tests are in `__tests__/audit-engine.test.ts`
- Run with: `npm test`
- Minimum 5 tests covering audit engine logic