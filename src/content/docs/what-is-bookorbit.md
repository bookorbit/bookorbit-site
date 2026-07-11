---
title: "What is BookOrbit?"
---


BookOrbit is a Docker-native, self-hosted platform that turns your server into a private multi-user reading hub. Manage large libraries, metadata, and per-user reading progress locally, with no cloud account, no third-party sync dependency, and no lock-in.

## What you get

- **Multi-library management** with collections, series, and a full author directory
- **Smart Scopes** - saved rule-based filters that behave as live dynamic shelves (e.g. "unread sci-fi over 400 pages rated above 3 stars")
- **Three library views** - grid, list, and table with sortable columns
- **Metadata automation** backed by configurable providers with per-field control over what gets overwritten
- **Real multi-user support** with per-library access control, granular role-based permissions, and fully isolated reading progress per user
- **Multi-provider OIDC / SSO** - connect multiple identity providers simultaneously for seamless home-lab single sign-on

## Readers and formats

| Reader | Formats |
|--------|---------|
| **eBook** | EPUB, KEPUB, MOBI, AZW3, AZW, FB2 |
| **PDF** | PDF |
| **Comics** | CBZ, CBR, CB7 |
| **Audiobook** | M4B, MP3, M4A, OPUS, OGG, FLAC |

## Dashboard and reading analytics

A widget-based dashboard gives you an at-a-glance view of your reading life: currently reading, reading goals, daily streak, reading rhythm, diversity score, year projection, and more. A dedicated statistics page adds deeper charts - heatmaps, reading pace, genre breakdowns, top authors and series, and library trends over time.

## Integrations

| Integration | What it does |
|-------------|-------------|
| **Kobo** | Sync supported books and reading position with Kobo devices |
| **KOReader** | Two-way reading progress sync |
| **OPDS** | Private OPDS catalog for any compatible reader app |
| **Email delivery** | Send books directly to Kindle or any email-based delivery workflow |
| **Book Dock** | Upload staging area - edit and validate metadata before finalizing into a library |
| **OIDC / SSO** | Connect multiple providers simultaneously (Authelia, Keycloak, Authentik, and others) |

## Built for self-hosting

BookOrbit runs as a Docker deployment with a standard PostgreSQL backend. Metadata enrichment, search indexing, and file scanning all run locally. No external services are required unless you configure them.

## Next step

Continue with the [Installation](/installation) guide.
