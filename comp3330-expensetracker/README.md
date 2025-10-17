# comp3330-expensetracker

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

## Deploying to Render (Bun)

If you see an error like:

> Cannot find module '@smithy/core/protocols' ... script "start" exited with code 1

it's caused by a transient break in the AWS SDK/@smithy packages when Bun resolves the latest versions. The fix is to pin @smithy packages and ensure the lockfile is used during install:

-   We removed the direct `@smithy/core` dependency and added an `overrides` section in `package.json`:
    -   `@smithy/core@3.14.0`
    -   `@smithy/types@4.6.0`
    -   `@smithy/protocol-http@5.3.0`
-   The Dockerfile copies `bun.lock*` before `bun install` so the locked versions are respected in container builds.

Render settings (no Docker):

-   Root Directory: `comp3330-expensetracker`
-   Build Command: `bun install`
-   Start Command: `bun run start`

Render settings (Docker):

-   No build or start commands needed; Render will build the Dockerfile.

This project was created using `bun init` in bun v1.2.21. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
