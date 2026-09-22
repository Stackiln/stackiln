# Security policy

## Supported versions

Stackiln is currently pre-1.0. Security fixes are made on the `main` branch and included in the next release. Older snapshots are not maintained.

## Reporting a vulnerability

Please do not open a public issue or discussion for a suspected vulnerability.

Use GitHub's private vulnerability reporting from the repository's **Security → Advisories → Report a vulnerability** page. If that option is unavailable, email `christianjamesrelf@gmail.com` with:

- the affected commit or version;
- reproduction steps or a minimal proof of concept;
- likely impact and affected configurations;
- any proposed mitigation; and
- whether you want to be credited.

Do not include live credentials, personal data, or data belonging to another person. You should receive an acknowledgement within seven days. Timelines for validation, remediation, and disclosure depend on severity and complexity and will be coordinated with the reporter.

## Scope

Reports about Stackiln's generator, templates, modules, dependency choices, generated security defaults, or release infrastructure are in scope. Vulnerabilities in a third-party dependency should also be reported upstream when appropriate. Product-specific customisations in a generated application are generally owned by that product's maintainers.

The implementation's current security assumptions and known gaps are documented in [docs/security.md](docs/security.md).
