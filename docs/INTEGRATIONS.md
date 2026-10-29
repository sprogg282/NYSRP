# Integrations

## Firebase Authentication and Cloud Firestore

The web client initializes Firebase from `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, and `VITE_FIREBASE_APP_ID`. Email/Password Authentication is used for `/admin`. Authorization requires a verified email plus an active UID record in `admins/{uid}`. The owner creates that record in Firebase Console; client rules deny all writes to `admins`.

Website content collections are `news`, `staff`, and `gallery`. Public pages query records with `published == true`; admin CRUD reads/writes those collections. News `author` is optional for existing documents. News content is rendered with a safe Markdown subset (headings, emphasis, lists, HTTPS links, and HTTPS images). The supplied announcements can be added idempotently from `/admin` to the existing `news` collection. Gallery stores an HTTPS image URL, title, optional description, and Boolean `published`; image uploads are not configured. Schemas and rules are in `firestore.rules` and README.md. Deploy the rules before testing CRUD.

## ER:LC maps

The client requests `https://api.erlc.gg/maps`. A checked response returned a JSON object with eight HTTPS PNG URLs: seasonal blank and postal variants. This endpoint returns images, not live server/player status.

## Reports

Report submission posts to the same-origin /api/reports endpoint. Its Discord webhook is configured as the private server environment variable DISCORD_REPORT_WEBHOOK_URL.

## Legacy records

The public shop and supporter pages and their admin controls have been removed. Existing Firestore shop, shopConfig, supportersPublic, and supportersPrivate collections and their security rules are intentionally retained; no historical records were deleted. The legacy source catalog remains in the repository but is unused by the current application.
