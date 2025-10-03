Resume Submission and Review Platform

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

Setup
- Create a Supabase project. Enable Email auth (magic links). Create public storage bucket `resumes`.
- Apply SQL (profiles, resumes, RLS and storage policies as per spec).
- Copy `.env.example` to `.env.local` and fill values: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ADMIN_USER_IDS`, `RESEND_API_KEY`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

Supabase Edge Function
- Function at `supabase/functions/send-status-email` expects POST `{ email, status, notes }`.
- Deploy: `npx supabase functions deploy send-status-email`
- Set secret: `npx supabase secrets set RESEND_API_KEY=...`

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
