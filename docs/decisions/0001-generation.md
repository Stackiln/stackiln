# 0001: Independent generated products

The generator copies the base template and enabled module source into a standalone pnpm workspace. No generated runtime imports Stackiln. Planning is pure and apply uses a sibling staging directory. Managed file hashes record ownership and protect product customisation during later upgrades. Next.js owns `apps/web/next-env.d.ts` and rewrites it between dev and build; it is copied initially but excluded from managed checksums.
