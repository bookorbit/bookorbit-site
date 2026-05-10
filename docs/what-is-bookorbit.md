# What is BookOrbit?

BookOrbit is a self-hosted book and library manager. Deploy it once on your own server and get a full reading platform: built-in readers, rich metadata, reading statistics, device sync, and multi-user support - all running on your hardware.

No subscription. No third-party account. No data leaving your server.

## Four readers, one app

BookOrbit ships with a dedicated reader for every format type. Nothing to install, no browser plugins.

| Reader | Formats |
|--------|---------|
| **eBook** | EPUB, KEPUB, MOBI, AZW3, AZW, FB2 |
| **PDF** | PDF |
| **Comics** | CBZ, CBR, CB7 |
| **Audiobook** | M4B, MP3, M4A, OPUS, OGG, FLAC |

The eBook reader comes with 13 themes (including AMOLED), adjustable fonts and columns, max content width, and per-book layout preferences. Reading progress syncs automatically across all your devices. While reading you can highlight text, add notes, and drop bookmarks - and annotations stay attached to the book across devices.

## Organize your collection

- **Multiple libraries** - each library has its own folders, scan rules, format priorities, metadata config, file-write settings, and reading thresholds. Audiobooks and ebooks don't need the same rules.
- **Collections** - manually curate groups of books into named lists. Use them for reading plans, thematic sets, or anything else.
- **Smart Scopes** - save any filter combination as a named scope that lives in your sidebar. Filter by format, genre, series, reading status, metadata score, or any mix of fields.
- **Series tracking** - series and series index are first-class fields. Collapse series in the grid so a 20-book run takes one row instead of twenty.

## Metadata at scale

BookOrbit pulls from nine providers and lets you control exactly how each field is filled.

- **Nine providers**: Google Books, Amazon, Goodreads, Hardcover, Open Library, iTunes, Audible, AudNexus, ComicVine
- **Field-level rules** - choose which providers feed each field, in what order, and whether to fill-missing, overwrite-if-provided, or always overwrite. Override any rule per library.
- **Confidence score** - every book gets a 0-100 completeness score based on weighted fields. Auto-fetch uses the score to decide which books need attention.
- **Auto-fetch** - queue books for metadata on import, on a schedule, or on demand. Eligible books are determined by score threshold and missing fields.
- **Author enrichment** - fetch bios and profile photos via AudNexus automatically as authors are added.
- **Field locks** - lock any field on any book and it will never be touched by auto-fetch, auto-fill, or bulk operations again.

## Reading statistics

BookOrbit tracks every reading session and turns it into a full analytics dashboard.

**Your reading** - daily reading time, reading heatmap, peak hours, favorite days, session timeline, completion timeline, reading pace, and goal trajectory.

**Your library** - format and language distribution, genre breakdown, metadata completeness, storage by format, books added over time, top authors, and more.

## Connect your devices and apps

| Integration | What it does |
|-------------|--------------|
| **Kobo sync** | Sideload books to a Kobo over the local network; reading position syncs both ways |
| **OPDS** | A built-in catalog server compatible with Moon+ Reader, Panels, Kybook, and any OPDS-capable app |
| **Email delivery** | Send any book directly to an email address - great for Kindle delivery |
| **Book Dock** | Drag-and-drop upload straight into any library from any browser |

## Built for more than one person

BookOrbit supports multiple users with per-user permissions and library access controls. Every user's reading progress, annotations, and statistics are completely isolated.

Connect BookOrbit to your existing identity provider via OIDC/SSO - Authentik, Keycloak, Authelia, and any other compliant provider. Users log in with accounts they already have, and group claims can map automatically to BookOrbit permissions.

## Under the hood

One Docker container, one database, zero external services. Your book files stay exactly where they are on disk - BookOrbit maps paths and never moves or renames anything without your say. Recommendations, metadata scoring, and search all run locally on your server.

## Ready to install?

Head to the [Installation](./installation) guide to get up and running in minutes.
