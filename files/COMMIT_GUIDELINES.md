# Commit Message Guidelines

This repository is a **VitePress documentation site** for BookOrbit, not the main application codebase. Commit messages should reflect this repo's structure: docs pages, theme/config, image assets, build tooling, Docker packaging, and CI workflows.

## Format

```text
<type>(<scope>): <summary>

[body]

[footer]
```

- `type` and `summary` are required.
- `scope` is optional, but strongly encouraged.
- `body` is optional for small docs edits; include it when context is needed.
- `footer` is optional; use it for issue links and breaking changes.

## Header

```text
<type>(<scope>): <summary>
```

Header rules:

- Use imperative mood: `add`, `fix`, `update`, `remove`
- Start summary with lowercase
- No trailing period
- Keep summary under 72 characters
- Describe what changed; explain why in the body

## Type

Use one of these types:

| Type       | When to use |
| ---------- | ----------- |
| `docs`     | Markdown content changes in `docs/*.md`, copy updates, screenshots tied to docs content |
| `feat`     | New site behavior in VitePress theme/layout/components/scripts |
| `fix`      | Correct broken behavior (bad links, wrong instructions, rendering bugs, script defects) |
| `style`    | Visual-only changes (CSS/theme styles, spacing, colors) with no behavior change |
| `perf`     | Performance improvements (build speed, image processing, runtime rendering) |
| `refactor` | Internal restructuring with no behavior change |
| `build`    | Tooling/build/packaging changes (`package.json`, VitePress config, Docker) |
| `ci`       | Workflow/automation changes in `.github/workflows/` |
| `chore`    | General maintenance that does not fit the above |
| `revert`   | Revert a prior commit |

## Scope

Use a scope that matches the area changed. Prefer one dominant scope.

### Docs content scopes

| Scope | What it covers |
| ----- | -------------- |
| `docs` | Multi-page or broad content edits across `docs/*.md` |
| `<page-slug>` | A single docs page using its filename slug (for example `installation`, `book-details`, `oidc`) |

For single-page updates, derive the scope from the filename directly:

- `docs/installation.md` -> `docs(installation): ...`
- `docs/book-details.md` -> `docs(book-details): ...`
- `docs/index.md` -> `docs(index): ...`

### Platform scopes (repo structure)

| Scope | What it covers |
| ----- | -------------- |
| `vitepress` | `docs/.vitepress/config.mts` (nav, sidebar, search, site config) |
| `theme` | `docs/.vitepress/theme/*` (`.vue`, `.ts`, `.css`) |
| `images` | `docs/public/images/*` and screenshot asset updates |
| `scripts` | `scripts/*` (for example `optimize-images.js`) |
| `docker` | `Dockerfile`, `docker/nginx.conf` |
| `ci` | `.github/workflows/*` |
| `deps` | Dependency updates in `package.json` / `package-lock.json` |
| `local` | `local/*` deployment helper scripts/docs |
| `repo` | Top-level repo metadata/config files |

If a commit spans many docs pages, use `docs` or the most impacted page scope.

## Project-Specific Rules

- Keep one logical change per commit.
- For screenshot updates, commit optimized outputs in `docs/public/images/*`.
- Do not commit `docs/public/images/_originals/` (it is intentionally ignored).
- If renaming a docs page file, update VitePress sidebar/nav links in the same commit.
- Use `revert` for rollbacks; include the reverted SHA in the body.

## Body

Write a body when the header alone is not enough:

- Why the change was needed
- Any tradeoffs or follow-up work
- Migration notes (for URL/structure changes)

Body format:

- One blank line after the header
- Wrap lines around ~100 chars
- Keep it concise and factual

## Footer

### Issue links

```text
Fixes #123
Closes #456
Ref #789
```

### Breaking changes

Use this when external behavior changes (for example URL/permalink changes, deploy/runtime assumptions):

```text
BREAKING CHANGE: rename /users doc route to /users-and-permissions

Update external links and bookmarks to the new route.
```

## Examples

### Docs content

```text
docs(installation): clarify ghcr login step for vps deploy
```

```text
docs(creating-a-library): add scanner schedule screenshot and guidance
```

### VitePress config and theme

```text
fix(vitepress): correct sidebar link for book details page
```

```text
style(theme): tighten spacing for inline callout images
```

```text
feat(theme): add animated space home layout variant
```

### Images and scripts

```text
docs(images): refresh metadata settings screenshots
```

```text
perf(scripts): skip unchanged files in image optimization pass
```

### Build, CI, and Docker

```text
build(docker): switch docs build stage to node 22 slim image
```

```text
ci(docker): publish branch and tag images to ghcr
```

```text
chore(deps): bump @nolebase plugin to latest patch
```

### Revert

```text
revert: revert "feat(theme): add animated space home layout variant"

Reverts commit a1b2c3d.

Animation loop caused excessive CPU usage on low-power devices.
```
