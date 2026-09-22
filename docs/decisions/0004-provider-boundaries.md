# 0004: Provider adapters

Product routes call local interfaces rather than Resend directly. The email recipe selects a local mailbox outside production and Resend in production. Analytics uses a consent-gated local sink for now; the PostHog adapter is pending. External production credentials are never generated into source or state.
