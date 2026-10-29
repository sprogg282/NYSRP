# Architecture

This repository contains the public NYSRP site only. React Router maps public paths to page components; `PublicLayout` provides the shared navigation and footer. The official staff dashboard is a separate application reached through an external link.

Public source files live in `src/`; static files belong in `public/`. A small Vercel Node function at `api/reports.js` handles report intake, with matching middleware for local Vite development. The function requires the private `DISCORD_REPORT_WEBHOOK_URL` environment variable. Published news, staff, and gallery content use Cloud Firestore; map data requires a separate public service contract. Legacy shop and supporter records and their existing Firestore rules are retained but no longer have frontend routes or management UI.
