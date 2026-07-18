# Lymora Website and OS

Premium Next.js App Router website and role-based Academy operating platform for Lymora.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

The public website is available at `/` and Lymora OS at `/app`.

## Supabase production connection

1. Create a Supabase project.
2. Add its URL, publishable key and server-only service role key to `.env.local`.
3. Set `LYMORA_DATA_PROVIDER=supabase`.
4. Apply `supabase/migrations/202607190001_phase1.sql` in the SQL Editor or with `supabase db push`.
5. Set `LYMORA_ADMIN_EMAIL` and `LYMORA_ADMIN_PASSWORD`, then run `npm run supabase:admin`.
6. Run `npm run supabase:migrate-local` once to import the current applications, cohorts and enrolments.

Never expose `SUPABASE_SERVICE_ROLE_KEY` through a `NEXT_PUBLIC_` variable or commit `.env.local`.

Supabase mode provides managed authentication, PostgreSQL persistence and Row Level Security. Without configured Supabase variables, development automatically uses the ignored local data store.

## Lymora OS Phase 1

- Super Admin, Academy Operations, Assessor and Candidate roles
- Admissions intake, review, scoring and CSV export
- CAIO cohort planning and candidate enrolment
- Team access controls and audit activity
- Candidate programme and learning workspaces

## Before launch

1. Update `.env.local` with the live domain, contact email and booking URL.
2. Replace the mailto contact form with a CRM, Resend, HubSpot or approved form endpoint.
3. Have privacy and terms reviewed for the final UAE entity and data stack.
4. Add final social profile URLs.
5. Connect Google Search Console, Bing Webmaster Tools, GA4 and Microsoft Clarity.
6. Submit `/sitemap.xml` and validate structured data.
7. Add real photography and verified case studies when available.

## SEO/AEO included

- Per-page metadata and canonical URLs
- Open Graph image generation
- Organization, Website, Course and Article JSON-LD
- Sitemap and robots metadata files
- Semantic headings, breadcrumbs, FAQ sections and answer-first content
- Industry landing pages
- Insights content hub
- `llms.txt`
