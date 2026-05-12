# SpendLens — AI Spend Audit for Startups

SpendLens is a free tool that audits your AI tool subscriptions and finds where you're overspending. Built for startup founders and engineering managers who pay for Cursor, Claude, ChatGPT, GitHub Copilot, and similar tools.

Built as a lead generation asset for [Credex](https://credex.rocks) — which sells discounted AI credits to startups.

## Screenshots

> Add screenshots or Loom link here after deployment

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Resend account
- Gemini API key

### Install & Run Locally

```bash
git clone https://github.com/YOUR_USERNAME/spendlens
cd spendlens
npm install
cp .env.example .env.local
# Fill in your environment variables
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

```env
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_gemini_api_key
OPENAI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
OPENAI_MODEL=gemini-2.5-flash
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Deploy to Vercel

```bash
vercel
```

## Decisions

1. **MongoDB over Supabase** — Audit results are JSON blobs naturally. Mongoose schema validation gives us type safety without needing relational structure.

2. **Deterministic audit engine over AI** — Financial recommendations must be traceable and defensible. AI hallucinations in savings calculations would destroy trust. Pure TypeScript rules are testable and auditable.

3. **Non-blocking AI summary** — The audit saves instantly. The AI summary generates in the background. Users never wait for AI — they see results immediately and the summary loads in.

4. **Honeypot over CAPTCHA for abuse protection** — CAPTCHAs hurt conversion. A hidden honeypot field catches bots silently without friction for real users.

5. **localStorage for form persistence** — No auth required per spec. localStorage is zero-latency, works offline, and persists across reloads on the same device. The tradeoff is device-specificity, which is acceptable for a single-session tool.

## Live URL

> Add your Vercel URL here