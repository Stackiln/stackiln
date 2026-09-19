# Enabled modules

## email

Validated contact endpoint with local and Resend adapters.

Routes: /contact, /contact/thanks, /contact/error, /api/contact. Tables: none.

## accounts

Verified email/password accounts with recovery, profile and session controls.

Routes: /sign-in, /sign-up, /forgot-password, /reset-password, /account, /api/auth/*, /api/account/export. Tables: user, session, account, verification.

## analytics

Consent-gated browser events with a local sink.

Routes: none. Tables: none.

## cms

Local typed content.

Routes: /features. Tables: none.

## legal

Product-owned legal page starters.

Routes: /privacy, /terms. Tables: none.

## seo

Metadata, sitemap, robots and unavailable states.

Routes: none. Tables: none.
