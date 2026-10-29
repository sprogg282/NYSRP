# Deployment

Build the site with npm ci and npm run build. The public client is emitted to dist/.

## Secure report endpoint

This project includes a Vercel Function at api/reports.js and a matching Vite development middleware. The browser posts reports only to the same-origin /api/reports path; the Discord webhook URL stays server-side.

For local development, set DISCORD_REPORT_WEBHOOK_URL in the ignored project-root .env file, using a newly rotated Discord webhook URL. The Vite config loads it for the development-only middleware. Do not prefix it with VITE_. Restart npm run dev after changing the value.

For production on Vercel, deploy this repository as a Vite project so the root api/reports.js file is deployed as a Function. Add DISCORD_REPORT_WEBHOOK_URL in Vercel Project Settings > Environment Variables for the environments you use, then redeploy. Do not add the webhook to build-time VITE variables.

The original deployment setup described a generic static host and did not identify a current provider. A static-only host cannot run this endpoint. If the site is hosted somewhere other than Vercel, deploy an equivalent server-side function using api/reports.js and route same-origin POST /api/reports requests to it. Never point browser requests directly at Discord.

The endpoint validates report fields and links, caps request sizes, rejects cross-origin browser submissions, limits each observed IP to five reports per ten minutes per running function instance, and handles Discord's successful 204 response. Use your host's WAF or rate limiting for stronger cross-instance abuse controls.

The prior VITE_REPORT_ENDPOINT value was exposed to browser code and must be considered compromised. Delete or rotate that webhook in Discord before configuring its replacement in the private server variable.

For client-side routing, configure SPA fallback to index.html so direct visits to /news, /rules, and the other client routes work.
