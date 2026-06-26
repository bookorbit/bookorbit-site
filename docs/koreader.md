# KOReader Sync

KOReader sync starts with a small account in BookOrbit, then becomes a background conversation between the reader and the library. The device reports where you are, what you read, and which highlights changed. BookOrbit matches that back to the book file, updates the book page, and keeps enough state to send newer changes back on the next sync.

Use the BookOrbit KOReader plugin when you want progress, reading sessions, highlights, annotation deletes, ratings, read status, and catalog browsing directly on the device.

## The Account

<img src="/images/koreader/settings-status.webp" alt="KOReader Sync settings page showing progress sync toggle, credentials, sync server URL, plugin download, and paired device" class="img-lg img-bordered" />

The KOReader account is separate from the normal BookOrbit login. A user with `koreader_sync` creates one username and password in **Settings > Integrations > KOReader**. That account belongs to the same BookOrbit user, so every sync request is still scoped to that user's accessible libraries and permissions.

The **Progress sync** toggle is the kill switch for the device account. When it is off, paired KOReader devices stop syncing. Deleting the credentials disconnects the devices, but the progress, reading sessions, and annotations already stored in BookOrbit remain.

| Permission | Access |
|------------|--------|
| `koreader_sync` | Open KOReader settings, create or delete sync credentials, download the plugin package, view device activity, and authenticate KOReader sync requests. |

If the BookOrbit user is disabled or loses `koreader_sync`, the KOReader credentials stop working.

## Installing The Plugin

After credentials exist, the KOReader Sync page shows the sync server URL and a **Download Plugin** button. The download is a preconfigured `bookorbit.koplugin.zip`; it includes the BookOrbit origin, username, and KOReader-compatible password key so you do not have to type them on the device. The page also shows the latest available plugin version and notes that device-side updates can be applied from within KOReader once the plugin is installed.

Install it like a normal KOReader plugin:

1. Download the plugin package from BookOrbit.
2. Unzip `bookorbit.koplugin.zip`.
3. Copy `bookorbit.koplugin` to `koreader/plugins/` on the KOReader device.
4. Restart KOReader.
5. Open a book and use **Tools > BookOrbit sync**.

::: tip
The URL in local screenshots may use `localhost`. A real device needs the public BookOrbit URL it can reach over the network, such as `https://books.example.com/api/v1/koreader`.
:::

If the server cannot build the plugin package, the BookOrbit server likely cannot find the plugin source directory. In that case, configure `KOREADER_PLUGIN_PATH` on the server to point at the plugin source.

## First Sync

<img src="/images/koreader/koreader-tools-menu.webp" alt="KOReader tools menu showing BookOrbit sync" class="img-md img-bordered" />

The plugin does not ask BookOrbit for a reading list. When you sync the open book or run a full sync, it computes the same KOReader document fingerprint BookOrbit stores for scanned files and asks which fingerprints match files in libraries the user can access. That fingerprint match is why the same EPUB file matters: BookOrbit syncs against the stored file identity, including previous identities kept after BookOrbit has rewritten or rescanned a file.

When a book matches, the plugin can send progress, page statistics, book state, rating, and annotation changes for that file. Unmatched files are skipped instead of creating new library entries.

::: warning
For reliable sync, put the BookOrbit-managed copy of the book on the KOReader device. A manually copied file can still match if it produces the same KOReader fingerprint BookOrbit scanned, but a converted, edited, re-zipped, or metadata-rewritten copy will usually have a different identity and will not sync to that BookOrbit book.
:::

<img src="/images/koreader/koreader-plugin-settings.webp" alt="KOReader BookOrbit plugin menu showing Browse library, auto sync, highlight sync, periodic sync, manual sync actions, and plugin version" class="img-md img-bordered" />

The device-side panel controls both sync behavior and catalog access. The top of the menu has account-level actions; the sync options below apply to the currently open book.

| Option | Behavior |
|--------|----------|
| **Browse library** | Opens the catalog browser to navigate, search, and download books from your BookOrbit library without leaving KOReader. |
| **Auto sync this book** | Pulls progress when a book opens. On close or suspend, uploads the open book's progress, highlights, status, rating, and reading time. |
| **Two-way highlight sync** | Also applies BookOrbit highlight, note, and delete changes back to KOReader. When off, local KOReader highlight changes still upload. |
| **Periodically sync every # pages** | Pushes progress after the configured number of page turns, once reading has been idle briefly. Set it to `0` to disable page-turn progress pushes. |
| **Sync behavior** | Sets separate choices for **Sync to a newer state** and **Sync to an older state**: apply silently, prompt first, or never move. |
| **Sync this book now** | Runs the full open-book sync immediately: progress, reading events, highlights, status, and rating. |
| **Sync all books now** | Runs a manual device sweep across matched books from KOReader history, statistics, and sidecar files. |
| **Installed plugin: vX.X.X (Check for update)** | Shows the installed version and checks BookOrbit for a newer plugin package. A tap downloads and applies the update in place. |

Full-library sweeps are manual. They are useful after installing the plugin on a device that already has reading history, but they still only upload files KOReader can fingerprint and BookOrbit can match. If an old sidecar file reports stale progress, BookOrbit records the device state without rolling the shared book progress backward.

## Library Browser

<img src="/images/koreader/catalog-root.webp" alt="KOReader BookOrbit catalog browser showing Continue reading, Recently added, Libraries, Collections, SmartScopes, Authors, Series, All Books, and On device" class="img-md img-bordered" />

**Browse library** opens a native catalog browser connected to your BookOrbit library. It authenticates with the same KOReader credentials and lets you navigate, search, and download books entirely from within KOReader.

The root view lists entry points: Continue reading, Recently added, Libraries, Collections, SmartScopes, Authors, Series, All Books, and On device. Tap any row to open that section. The magnifier in the title bar opens a search box for full-text title and author search across your library.

<img src="/images/koreader/catalog-books.webp" alt="KOReader BookOrbit catalog mosaic grid showing book covers with sort and view options menu open" class="img-md img-bordered" />

Tap the menu icon in the title bar of a book list to open view and sort controls.

| Control | What it does |
|---------|--------------|
| **Sort** | Choose from Title, Author, Recently added, Recently updated, Recently read, or Series order. |
| **Reverse** | Flip the sort direction. |
| **Read status** | Filter by reading, finished, abandoned, or unread. |
| **Format** | Filter by file format. |
| **View: Mosaic / List** | Switch between cover grid and compact list. |
| **Grid size** | Adjust the number of columns and rows in the mosaic. |

<img src="/images/koreader/catalog-detail.webp" alt="KOReader BookOrbit catalog book detail page showing cover, metadata, and Download button" class="img-md img-bordered" />

Tap a book to open its detail page with the cover, author, series, year, publisher, page count, library, genres, and description. Tap **Download** to save the file to the device. The title-bar menu on the detail page also lets you set the read status without opening a browser. The **On device** category in the root menu lists books already downloaded so you can find local files at a glance.

## Three-Way Sync

The powerful part is that KOReader does not have to live in a separate lane. BookOrbit can sit between the web reader, KOReader, and Kobo, keeping the newest reading position and annotation state moving through the same book record.

With Kobo two-way progress sync enabled, progress reported by KOReader can advance the Kobo bookmark on the next Kobo sync. Progress from Kobo can also update BookOrbit, and a later KOReader sync can pick up that newer BookOrbit position. For highlights, KOReader changes land in BookOrbit first; if **Sync BookOrbit highlights to Kobo** is enabled in Kobo settings, those BookOrbit and KOReader highlights can be offered to Kobo as well. Kobo highlight import works independently, and linked annotations can continue syncing edits and deletes through BookOrbit.

Kobo-side return sync depends on Kobo settings and KEPUB delivery. If Kobo is sending regular EPUBs instead of KEPUBs, BookOrbit may still record progress, but precise Kobo restore and BookOrbit-to-Kobo highlight placement are limited.

## What Comes Back To BookOrbit

<img src="/images/koreader/settings-activity.webp" alt="KOReader Plugin Activity section showing device with up-to-date version badge, matched books, reading events, highlights, and synced totals" class="img-lg img-bordered" />

The settings page becomes useful after the first book sync or full sweep. **Devices** shows the last device progress update and the last book title seen from that device. **Plugin Activity** shows the richer plugin path: for each device, the plugin version with an up-to-date or update-available badge, the last full sync time, matched books, reading events, and highlights. A **Synced totals** summary below that shows aggregate counts across all devices. A **Setup Guide** section at the bottom walks through pairing steps for new users.

BookOrbit stores several kinds of KOReader state:

| Data | How BookOrbit uses it |
|------|-----------------------|
| Progress | Stores a per-device KOReader position, updates BookOrbit file progress, and auto-updates the user's book status when progress crosses the app's normal thresholds. |
| Reading events | Converts KOReader page-stat events into reading sessions, reading-log rows, daily stats, and achievement activity. |
| Highlights and notes | Creates or updates BookOrbit annotations with KOReader text, note, style, color, chapter, page, and device position. |
| Annotation deletes | Soft-deletes the matching BookOrbit annotation and tracks whether other devices still need to acknowledge the delete. |
| Book status | Maps KOReader `reading`, `complete`, and `abandoned` states to BookOrbit Reading, Finished, and Abandoned when the device change is newer. |
| Rating | Writes a KOReader 1-5 rating to the user's BookOrbit rating when the device change is newer. A missing device rating does not clear the BookOrbit rating. |

Reading sessions are derived from page-stat clusters. Events within a 30 minute gap stay in one session; a longer gap starts another session. Very short sessions under 10 seconds are ignored. If an older sync later fills a gap, BookOrbit can recompute the sessions for that device and file so the reading log stays consistent.

## Position Sync

Progress moves both ways. When KOReader syncs, BookOrbit updates the book's file progress, read status, and book detail progress source. When KOReader opens a book, reconnects, or pulls progress manually, BookOrbit sends back the newest known progress for that file.

| Newer source | What KOReader receives |
|--------------|------------------------|
| KOReader | The last KOReader position for that device/book file. |
| BookOrbit web reader | The latest BookOrbit reading position, translated as closely as possible for KOReader. |

KOReader-to-BookOrbit restore is usually the most exact path because it starts with a native KOReader position. BookOrbit-to-KOReader restore may land nearby rather than at the exact line when the position came from another reader.

## Highlight Sync

<img src="/images/koreader/koreader-highlights.webp" alt="BookOrbit Highlights tab showing KOReader annotations with source badge, Approximate flag, color filter panel, and date range filter" class="img-lg img-bordered" />

Highlight sync is bidirectional with the BookOrbit plugin. Highlights, notes, style changes, and deletes made in KOReader can appear in [BookOrbit annotations](./annotations), and BookOrbit annotation changes can return to KOReader on the next sync.

KOReader annotations appear in the Highlights tab with a **KOReader** source badge. Highlights that BookOrbit could not place at an exact text position are tagged **Approximate** - the text is preserved, but the anchor is best-effort. The Highlights tab lets you filter by color, highlight style, and date range so you can work with large annotation sets from multiple sources.

BookOrbit keeps enough device state to avoid turning edits or moved highlights into duplicates. Deletes are also tracked until the device confirms that it applied them, which is why the settings page can show pending deleted highlights.

Colors and highlight styles are mapped between KOReader and BookOrbit palettes. Most highlights sync quietly; if BookOrbit cannot place a highlight back into KOReader, it is counted under **failed positions** so you know something needs attention.

## Reading Log And Book Pages

<img src="/images/koreader/koreader-reading-log.webp" alt="BookOrbit Reading Log showing reading sessions with KOReader and Web source badges, progress journey chart, and activity heatmap" class="img-lg img-bordered" />

KOReader sessions appear in the same reading log as manual and web-reader sessions, with `KOReader` as the source. The Reading Log tab shows a **Where you read this book** breakdown bar that splits total reading time across BookOrbit, KOReader, and Kobo sources, so you can see at a glance how much of a book came from the device. Progress from KOReader also appears on book details as a KOReader progress source when the user has `koreader_sync`.

On a book page, BookOrbit keeps the canonical progress source by timestamp. If KOReader has the newest update, the KOReader percentage and chapter are shown. If the web reader is newer, the web-reader progress remains canonical. BookOrbit also records when a file was modified after the last KOReader sync so stale device state can be surfaced.

## Cleanup

<img src="/images/koreader/settings-danger-zone.webp" alt="KOReader Sync danger zone with delete credentials action" class="img-lg img-bordered" />

Deleting credentials removes the KOReader account and disconnects paired devices. It does not erase existing BookOrbit reading progress, reading sessions, highlights, or ratings. Create new credentials when you want to pair devices again.

## Troubleshooting

| Symptom | Check |
|---------|-------|
| Device cannot log in | Confirm the BookOrbit user has `koreader_sync`, the KOReader account exists, sync is enabled, and the device can reach the public `/api/v1/koreader` URL. |
| Plugin download fails | Confirm the server has access to the BookOrbit KOReader plugin source, or set `KOREADER_PLUGIN_PATH`. |
| No books match | Confirm the same book files exist in BookOrbit, the user can access their libraries, and the device copy has not been modified into a different document fingerprint. |
| Auto sync cannot be enabled | On KOReader devices with seamless Wi-Fi control, set **Network > Action when Wi-Fi is off** to turn Wi-Fi on. KOReader blocks auto sync when that setting is not enabled. |
| Progress appears but no reading sessions appear | Confirm the BookOrbit KOReader plugin is installed and has uploaded page statistics. |
| Highlights do not move both ways | Enable **Two-way highlight sync** in the KOReader BookOrbit sync panel and run another sync for the book. |
| Deleted highlights remain pending | Sync the KOReader device again so it can acknowledge the delete. Pending deletes are kept until the device reports that it applied them. |
| Restore lands near the chapter, not the exact line | BookOrbit may only have an approximate translated position for that direction. Open and sync the book once from KOReader to store a native KOReader position. |
| Catalog browser shows no books | Confirm the device can reach the BookOrbit server and the user can access at least one library. The catalog uses the same KOReader credentials as sync. |
| Catalog download fails | Check available storage on the KOReader device and confirm the file format is supported. |
| Plugin update check finds nothing | The check runs against the BookOrbit server the plugin is configured against. Confirm the server is reachable and is running a version that ships the newer plugin. |
