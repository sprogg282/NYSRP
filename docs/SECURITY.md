# Security

- Firebase client configuration uses public `VITE_FIREBASE_*` web app values. Never add a service account/private key to this frontend.
- `/admin` requires Firebase Authentication, a verified email, and `admins/{uid}` with `active: true`.
- Firestore authorization is enforced by `firestore.rules`. Clients cannot write administrator documents; published News/Staff records are the only public-readable app content.
- Public staff documents must contain only information approved for public display. Firestore rules authorize documents, not selected fields, so avoid storing private fields in public-readable `staff` documents.
- Report intake is validated by api/reports.js; the Discord webhook must be stored in the private server variable DISCORD_REPORT_WEBHOOK_URL, never in a VITE_* variable. Per-instance rate limiting is best-effort; use the host WAF for stronger abuse controls.
