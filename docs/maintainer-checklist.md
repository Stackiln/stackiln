# Public repository checklist

Code changes prepare the repository for public use; these hosting settings still require a repository administrator.

- Rename the GitHub repository from `Site-Factory` to `StackKiln` and update the local `origin` URL.
- Add the description, website, and topics: `nextjs`, `typescript`, `generator`, `starter-kit`, `full-stack`, and `open-source`.
- Enable Issues, Discussions, and private vulnerability reporting.
- Protect `main`: require pull requests, the verification check, resolved conversations, and dismissal of stale approvals after new commits.
- Enable Dependabot alerts, secret scanning, push protection, and dependency review where available.
- Confirm `@ChristianRelf` can receive Code of Conduct and security reports at the documented address.
- Create repository labels for bugs, enhancements, documentation, security, and good first issues.
- Review the first public release notes and tag against [docs/releasing.md](releasing.md).
