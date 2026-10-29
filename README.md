# NYSRP Public Website

Responsive React, TypeScript, and Vite site. The staff dashboard remains a separate application at `https://nysrpstaffdashboard.vercel.app/`.

## Start and build

```powershell
npm install
npm run dev
npm run typecheck
npm run build
npm run preview
```

Deploy `dist/` with an SPA fallback to `index.html`. To receive reports, also deploy the `api/reports.js` Node function on Vercel or an equivalent serverless Node host; a static-only host cannot run the secure report endpoint. See `docs/DEPLOYMENT.md`.

## Logo and theme

The supplied logo is `public/images/nysrp-logo.png`. Shared brand colors and responsive styling are in `src/styles/global.css`: orange `#ff8a00`, highlight orange `#ffb000`, cyan `#00bfff`, and deep blue `#0646a6`. Update those CSS variables if the palette changes.

## Rules

Accordion structure and currently general (not official NYSRP-verified) guidance live in `src/pages/PublicPages.tsx`, in the `rules` array and `RulesPage`. Replace the copy with approved community rules there. Rebuild/restart Vite after code edits.

## Shop

The Shop starts with the legacy `shopItems` catalog from `src/data/shop.ts`. In `/admin` you can explicitly import that catalog once, then add, edit, remove, filter, and reorder Firestore products. Its categories are New York Memberships, Donations, and Paid Advertisements. Each item supports name, description, Robux price, optional image, perks, ad details, Game Pass link, featured flag, availability, and persistent display order. See the management instructions below.

Roblox Game Pass links open on Roblox. A valid link enables the button only when available is Boolean true. An unavailable product shows Coming Soon; an available product with a missing or invalid link remains marked available and clearly asks for the Game Pass link. Until a Firestore catalog is explicitly managed, the public shop uses the current source catalog; after import, Firestore is authoritative, including when the catalog is intentionally empty.

## External links and map

Optional `.env.local` values (copied from `.env.example`) are public browser configuration:

- `VITE_DISCORD_URL`: confirmed public invite link.
- Report intake uses the same-origin /api/reports server endpoint. Configure DISCORD_REPORT_WEBHOOK_URL privately on the server; never use a VITE_ prefix for it.

Vite variables are bundled publicly; never put secrets in them. Restart the dev server after editing local environment values; rebuild and redeploy to apply production values.

The map page fetches `https://api.erlc.gg/maps`, parses the returned `{ "maps": [URL, ...] }` response, and presents the image variants. The observed response lists seasonal blank and postal PNGs. It does not provide live player positions, player counts, join code, or server status. The page has loading, error/retry, selection, and image failure states. No API key was needed for the successful endpoint check performed during this update.

## Verification boundaries

TypeScript and production build checks are run after changes. News and staff records are stored in Cloud Firestore after Firebase is configured below. Roblox checkout occurs on Roblox; this site does not verify the payment. Admin persistence, report delivery, and live player/server data are not active until their server integrations are configured.
# Managing the NYSRP Shop

Use the existing `/admin` Shop section for normal product management. On first use, choose **Import current catalog** to copy the existing `src/data/shop.ts` entries exactly into Firestore; this import is explicit and does not run automatically. Then manage product fields, availability, and manual display order in the dashboard. You can also sort by name, price, or availability and filter categories without modifying saved product data. New or edited products are saved to Firestore and appear on the public `/shop` page. If the catalog is intentionally emptied, the Firestore managed marker keeps the public page empty instead of restoring the legacy list.


## Roblox payment limits

A purchase button opens a real configured Roblox Game Pass page in a new tab with safe external-link settings. A click is not proof of payment. This public site does not collect Roblox credentials, verify purchases, or automatically grant benefits. Automated verification/fulfilment would require a separate trusted server integration supported by Roblox, plus secure server-side credentials and a fulfillment process. No such backend is configured here.

## Firebase Admin, News, Staff, and Gallery

The site uses Firebase Authentication and Cloud Firestore from the Firebase JavaScript SDK. /admin signs users in with email/password, requires a verified email and an active allowlist record at admins/<authUid>, then exposes News, Public Staff, and Gallery management. Public pages query only documents where published == true. The rules are in firestore.rules; they deny client access to all other collections and deny all client writes to admins.

### Configure Firebase

1. In Firebase Console, open the existing project, then **Project settings → General → Your apps**. Register/select its Web app and copy the web config values.
2. In Authentication → **Sign-in method**, enable **Email/Password**.
3. Create/enable Cloud Firestore in the project.
4. Open the existing project-root `.env` and set the seven Firebase variables shown in `.env.example`, filling them from the Web app config. Do not replace the existing file or change its other values. These web values are public client configuration, not admin credentials. Never add a service account key.
5. In Authentication → Settings → Authorized domains, add `localhost` for local development if it is absent, and add your production website domain. Restart `npm run dev`. In production, configure those same seven build-time variables in the host and redeploy.
6. In Firebase Authentication → Users, add the admin account's email/password. Visit `/admin`, sign in, choose **Send verification email**, and verify the account. Sign in again if needed.
7. Copy that user's UID from Authentication → Users. In Firestore Data, create collection `admins`, then a document whose **document ID is exactly the UID**, with boolean field `active: true`. This is the explicit allowlist. Never make `admins` client-writable.
8. Open Firestore > Rules, replace the rules with the complete contents of firestore.rules, and click Publish. The rules include the gallery collection and preserve the existing secure policies for admins, news, staff, announcements, and staffRota. If this database is shared with another app, merge its policies before publishing.

### Content management

In /admin, use News & Updates, Public Staff Roster, or Gallery. News documents use title, content, published, publishedAt (ISO date string), optional author, and optional image URL. News content supports headings, bold/italic text, paragraphs, bullet lists, Markdown links, and HTTPS Markdown images. Use **Add supplied announcements** in News & Updates to add the three requested posts to the existing `news` collection; existing posts are kept and matching posts are skipped. Staff documents use name, role, published, and optional department and avatar URL. Gallery records use title, an HTTPS image URL, an optional description, and a Boolean `published` field. Create, edit, publish/unpublish, and delete operations are persisted in Firestore. The public `/gallery` page queries only published gallery records and displays a clear empty or error state without sample tiles. File uploads are not configured, so gallery images use HTTPS URLs. Only include profile information approved for public display.

Firebase web config missing, sign-in failures, unverified accounts, unapproved UIDs, and Firestore permission/network errors have separate UI states. No API key/service account private key belongs in the browser app.

## Other integrations

- Report intake uses the same-origin /api/reports server endpoint. Configure DISCORD_REPORT_WEBHOOK_URL privately on the server; never use a VITE_ prefix for it.

## Verification boundaries

`npm run typecheck` and `npm run build` validate the client. Firebase Auth sign-in, Firestore reads/writes, and deployed rules require your Firebase project configuration and were not verified here. The Firebase Emulator/CLI is not installed in this environment, so rules were not emulator-tested. Review/publish the included rules in your Firebase project and test with one allowlisted account plus one non-admin account before launch.
