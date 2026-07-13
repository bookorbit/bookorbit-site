# Contributing to the BookOrbit documentation

Thank you for helping make BookOrbit easier to understand. This repository
accepts corrections, clearer explanations, new guides, screenshots, and site
improvements.

Application code, product bugs, and feature requests belong in the
[main BookOrbit repository](https://github.com/bookorbit/bookorbit).

## Before you start

For a small correction, open a focused pull request directly. For a new guide,
navigation change, or substantial visual redesign, start with an issue so the
scope and placement can be agreed on before you invest in the full change.

You need:

- Node.js 22
- npm
- Git
- Docker only if you want to test the production container

## Set up the project

```bash
git clone https://github.com/bookorbit/bookorbit-site.git
cd bookorbit-site
npm ci
npm run dev
```

The development site is available at <http://localhost:5174>.

## Make a documentation change

Documentation lives in `src/content/docs`. The filename becomes the public URL:
`installation.md` is served at `/installation`.

Every page should start with useful frontmatter:

```yaml
---
title: "Creating a Library"
description: "Connect book folders, choose scanning behavior, and create your first BookOrbit library."
---
```

When writing or reviewing a guide:

- Lead with what the feature does and when the reader should use it.
- Prefer task-based headings such as "Connect a device" over vague headings.
- Use short paragraphs, ordered steps for sequences, and tables for comparisons.
- Match labels and capitalization from the BookOrbit interface.
- Explain prerequisites and permissions before the steps that require them.
- Use `:::note`, `:::tip`, and `:::caution` callouts sparingly.
- Include troubleshooting only for concrete, recoverable problems.
- Never include real credentials, private URLs, tokens, or personal server details.
- Use a hyphen instead of an em dash.

Link to another guide with its root-relative route:

```markdown
See [Creating a Library](/creating-a-library) for the next step.
```

The production build validates internal links and fails when one is broken.

## Add or update screenshots

Source screenshots are local working files and are not committed. Optimized
WebP files are the reviewable source of truth in Git.

1. Put the source PNG or JPEG in `public/images/_originals/<section>/`.
2. Use a descriptive kebab-case name, such as `create-library-details-step.png`.
3. Run `npm run images:optimize`.
4. Add the generated file from `public/images/<section>/` to the page.

Use an HTML image element so the shared sizing and zoom styles apply:

```html
<img
  src="/images/getting-started/create-library-details-step.webp"
  alt="Create Library dialog showing the name and organization fields"
  class="img-lg img-bordered"
/>
```

Choose the smallest size that keeps the interface legible:

| Class | Maximum width | Typical use |
| --- | ---: | --- |
| `img-xs` | 260 px | Small menus and sidebar controls |
| `img-sm` | 320 px | Narrow panels and forms |
| `img-md` | 480 px | Dialogs and focused workflows |
| `img-lg` | 700 px | Wide panels and settings pages |
| `img-xl` | 900 px | Near-full-width application views |

Add `img-bordered` when the screenshot edge blends into the page. Write alt text
that identifies the screen and the useful state shown. Do not repeat nearby
body copy or begin alt text with "Image of".

## Update navigation

When adding, renaming, or moving a guide, update the `sidebar` configuration in
`astro.config.mjs`. Put the page in the section where a reader would look for
the task, and avoid listing one page in more than one section.

## Validate the change

Run both checks before opening a pull request:

```bash
npm run check
npm run build
```

`npm run check` validates Astro and TypeScript. `npm run build` produces the
static site, builds the search index, and checks internal documentation links.
For visual changes, also inspect the affected page at desktop and mobile widths
in both light and dark themes.

## Commits and pull requests

Use a concise Conventional Commit message, for example:

```text
docs(installation): clarify reverse proxy setup
```

See the [commit message guidelines](files/COMMIT_GUIDELINES.md) for accepted
types and scopes.

Keep each pull request focused. In its description, include:

- The reader problem being solved
- The pages or site areas changed
- Screenshots for visual changes
- Any behavior that was verified against the BookOrbit application

By submitting a contribution, you confirm that you have the right to provide
the text and images included in it.
