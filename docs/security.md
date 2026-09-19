# Security baseline

Generated contact input is parsed with Zod, enforces a same-origin POST, and avoids logging message bodies. Production email uses an adapter; local delivery writes to a mailbox outside container source. Security headers include `nosniff`, frame denial, a strict referrer policy, and a baseline CSP. The container runs as a non-root user. Secrets are absent from the generated manifest and state.

The marketing recipe is not yet a complete security profile: distributed rate limiting, full CSP tuning, data retention workflows, and production provider validation are pending. Do not treat the current legal page starters as published legal advice.

Optional accounts use Better Auth with email verification, recovery, email-change confirmation, server-side session checks, and production rate limiting. The account export route requires a valid session and sends `Cache-Control: no-store`. Deletion requires an emailed confirmation link. These are initial self-service operations: export is synchronous, deletion is immediate after confirmation, and staff controls, audit events, account states, retention policies, and distributed rate-limit storage remain pending. Use a unique `BETTER_AUTH_SECRET` of at least 32 characters in production.
