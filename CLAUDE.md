# Claude Instructions for SpendLens

## What This Project Is
SpendLens audits AI tool subscriptions for startups and finds overspend.
It is a lead generation tool for Credex (credex.rocks).

## Tech Stack
- Next.js 15 App Router + TypeScript
- Tailwind CSS + shadcn/ui (Radix Nova preset)
- MongoDB Atlas + Mongoose
- Gemini API via OpenAI-compatible endpoint
- Resend for transactional email
- Vercel for deployment

## Most Important Rules
1. NEVER modify audit engine rules without updating PRICING_DATA.md
2. NEVER put secrets in code — use process.env only
3. NEVER use AI for savings calculations — deterministic rules only
4. ALWAYS handle API failures gracefully with fallbacks
5. ALWAYS use TypeScript types from lib/audit-engine/types.ts

## Common Tasks

### Add a new AI tool
1. Add pricing to `lib/audit-engine/pricing.ts`
2. Add type to `ToolName` in `lib/audit-engine/types.ts`
3. Add audit rules to `lib/audit-engine/rules.ts`
4. Add to TOOL_OPTIONS in `components/forms/ToolRow.tsx`
5. Update PRICING_DATA.md with sources

### Add a new audit rule
1. Add function in `lib/audit-engine/rules.ts`
2. Call it in `auditTool()` function
3. Add a test in `__tests__/audit-engine.test.ts`

### Update pricing data
1. Verify on official vendor pricing page
2. Update `lib/audit-engine/pricing.ts`
3. Update PRICING_DATA.md with new URL and date

## Running Locally
npm run dev

## Building
npm run build

## Testing
npm test