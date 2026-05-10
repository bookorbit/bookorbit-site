# Kobo Sync

**Settings > Kobo** pairs Kobo devices with BookOrbit so selected books, metadata, covers, and reading progress can sync through a Kobo-compatible endpoint.

<img src="/images/kobo/settings.webp" alt="Kobo Sync settings page with registered device and sync preferences" class="img-lg img-bordered" />

## Setup Checklist

For a first successful sync:

1. Give the BookOrbit user the `kobo_sync` permission.
2. Create or edit a collection and enable **Sync to Kobo**.
3. Add EPUB books to that collection.
4. Open **Settings > Kobo**.
5. Click **Add device** and name the device.
6. Copy the sync URL shown after the device is created.
7. On the Kobo, go to **Settings > Account > Add account > Other** and enter the sync URL.
8. Start a sync on the Kobo.

::: warning
The sync URL contains the device token and is shown only once. Treat it like a password. If it is lost or shared accidentally, revoke the device and add it again.
:::

## Permissions

| Permission | Access |
|------------|--------|
| `kobo_sync` | Opens **Settings > Kobo**, manages registered devices, updates sync preferences, and allows device-token sync requests. |

Devices and Kobo sync settings are user-owned. If the parent BookOrbit user is disabled or loses `kobo_sync`, registered device tokens stop working.

## Registered Devices

Each registered device gets a private sync URL:

```text
/api/v1/kobo/{deviceToken}
```

The URL shown in the UI includes the current BookOrbit origin, for example:

```text
https://books.example.com/api/v1/kobo/abc123...
```

Use that full URL on the Kobo device. Kobo may ask for a username and password while adding the account; BookOrbit authenticates the device token in the URL, so any username/password can be entered on the device.

| Action | Effect |
|--------|--------|
| **Add device** | Creates a new token and shows the one-time sync URL. |
| **Rename** | Changes the label shown in BookOrbit only. |
| **Revoke** | Deletes the token. The Kobo cannot sync again until it is paired with a new device entry. |
| **Last sync** | Updates when the device contacts the Kobo endpoint. |

::: tip
Use a BookOrbit URL the Kobo can reach directly. If BookOrbit is behind a reverse proxy, make sure the public host and protocol are forwarded correctly so generated image, metadata, and download URLs point back to the public address.
:::

## What Syncs

BookOrbit syncs a book to Kobo only when all of these are true:

- The user has library access to the book.
- The book status is `present`.
- The book is in at least one collection where **Sync to Kobo** is enabled.
- The book's primary file is an EPUB.

Collections marked **Sync to Kobo** are also sent to the device as Kobo tags/collections, so grouped books stay grouped on the device.

::: warning
If a book has an EPUB file but the primary file is not EPUB, it will not be included in the Kobo sync set. Set the EPUB as the primary file before syncing.
:::

### Sync Updates

Kobo Sync keeps a per-user snapshot of what has already been sent to devices.

| Change in BookOrbit | Device behavior on next sync |
|---------------------|------------------------------|
| New eligible book | Sent as a new Kobo entitlement with metadata and reading state. |
| Title, author, series, or file hash changes | Sent as changed product metadata. |
| Book leaves every **Sync to Kobo** collection | Sent as removed from the Kobo library. |
| Collection membership changes | Sent as updated Kobo tag membership. |

Sync responses are paged in small batches. If the Kobo needs more data, BookOrbit marks the response so the device continues syncing.

## Sync Preferences

Preferences apply to the current user and must be saved before they affect device sync.

| Setting | Behavior |
|---------|----------|
| **Convert to KEPUB** | Converts EPUB downloads to Kobo-optimized KEPUB files when the device downloads a book. |
| **Force hyphenation** | Adds kepubify hyphenation during conversion and uses a separate conversion cache. This appears when KEPUB conversion is enabled. |
| **Two-way progress sync** | Pushes BookOrbit web-reader progress back to the Kobo during sync. |
| **Mark as Reading** | Minimum Kobo progress percentage needed before BookOrbit records the book as reading. |
| **Mark as Finished** | Kobo progress at or above this value is written back to BookOrbit as 100% finished. |
| **KEPUB conversion limit** | Skips KEPUB conversion for files larger than this size and serves the original EPUB instead. |

The reading threshold must be lower than the finished threshold. BookOrbit enforces the UI ranges: reading from `0.5%` to `10%`, finished from `75%` to `100%`, and KEPUB conversion limit from `1 MB` to `500 MB`.

### KEPUB Conversion

When **Convert to KEPUB** is enabled, BookOrbit converts the EPUB on first download and caches the converted file under the app data directory. Later downloads reuse the cached KEPUB as long as the source file hash and hyphenation setting match.

If conversion fails, BookOrbit falls back to the original EPUB so the download can still complete.

## Reading Progress

Kobo progress and BookOrbit progress are related, but they move in two directions:

| Direction | Behavior |
|-----------|----------|
| Kobo to BookOrbit | When the device sends reading state, BookOrbit stores the raw Kobo state and updates BookOrbit reading progress if the percentage meets the configured thresholds. |
| BookOrbit to Kobo | When **Two-way progress sync** is enabled, newer web-reader progress is sent to the Kobo during sync. |

Progress below **Mark as Reading** is stored in the Kobo state but does not update the BookOrbit reading-progress row. Progress at or above **Mark as Finished** is normalized to `100%` in BookOrbit.

## Troubleshooting

| Symptom | Check |
|---------|-------|
| The Kobo cannot add the account | Confirm the sync URL is reachable from the Kobo and includes `/api/v1/kobo/{deviceToken}`. |
| The sync URL was lost | Revoke the device and add it again. The token is intentionally shown only once. |
| The device syncs but no books appear | Confirm books are in a **Sync to Kobo** collection, are accessible to the user, are `present`, and have EPUB as the primary file. |
| A book appears without expected grouping | Confirm the collection itself has **Sync to Kobo** enabled. |
| Reading progress does not update BookOrbit | Sync the Kobo, then check the **Mark as Reading** and **Mark as Finished** thresholds. |
| Web-reader progress does not reach Kobo | Enable **Two-way progress sync** and run another Kobo sync. |
| KEPUB conversion is slow or skipped | Check the conversion limit. Large files are served as EPUB when they exceed the limit. |
