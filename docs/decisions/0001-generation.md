# 0001: Independent generated products

The generator copies the base template and enabled module source into a standalone pnpm workspace. No generated runtime imports the factory. Planning is pure and apply uses a sibling staging directory. Managed file hashes record ownership and protect product customisation during later upgrades.
