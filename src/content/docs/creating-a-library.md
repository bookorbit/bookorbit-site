---
title: "Creating a Library"
description: "Connect book folders, choose scanning behavior, and create your first BookOrbit library."
---

A library is the bridge between the folders that hold your files and the books you see in BookOrbit. You tell BookOrbit where to look, how to group the files it finds, and how much automation you want. It takes care of the scan from there.

The seven-step wizard is deliberately front-loaded with the two decisions that matter most: a name and at least one folder. The remaining steps let you shape the result for ebooks, comics, audiobooks, or a mixed collection.

## Before You Start

Library creation requires the `manage_libraries` permission. Users without it can still use libraries they can access, but they will not see the creation controls.

Most importantly, choose the folder from BookOrbit's point of view. Paths are resolved on the BookOrbit server, not on the computer running your browser. In Docker, use the mounted path inside the container, such as `/books/audiobooks`, rather than the Finder or Explorer path on the host.

:::tip
Create separate libraries when groups of books need different rules. An ebook library might prefer portrait covers and EPUBs, while an audiobook library can use square covers and place audio formats first.
:::

## Open The Wizard

You can begin wherever you happen to be working. Each route opens the same seven-step wizard.

On a new installation, select **Create your first library** on the dashboard.

<img src="/images/getting-started/dashboard-empty-state.webp" alt="Dashboard empty state prompting the user to create their first library" class="img-md img-bordered" />

From anywhere in the app, open the `...` menu beside **Libraries** in the sidebar and select **New Library**.

<img src="/images/getting-started/sidebar-new-library-menu.webp" alt="Libraries sidebar menu with New Library and Reorder options" class="img-xs img-bordered" />

Or open **Settings > Libraries** and select **Add Library**. On an empty instance, the page also offers **Add your first library**.

<img src="/images/getting-started/settings-libraries-empty.webp" alt="Settings Libraries page showing an empty state and Add your first library button" class="img-lg img-bordered" />

## Walk Through The Setup

### 1. Give The Library A Name

<img src="/images/getting-started/create-library-details-step.webp" alt="Create a library Details step with name, icon picker, and cover appearance settings" class="img-lg img-bordered" />

Start with a name that will still make sense in the sidebar a year from now: `Ebooks`, `Audiobooks`, `Comics`, or `Kids Books` are all good examples. The name must be unique. Pick an icon at the same time, because BookOrbit uses it anywhere the library is represented.

Choose **Portrait** covers for ebooks and most mixed libraries. Choose **Square** for audiobook-only libraries with square artwork. You cannot continue until the library has both a name and an icon.

### 2. Show BookOrbit Where The Books Live

<img src="/images/getting-started/create-library-folders-step.webp" alt="Create a library Folders step showing selected folders, manual path entry, and folder checks" class="img-lg img-bordered" />

Add one or more server-accessible folders. Use **Add folders** to browse the server filesystem, or expand **Enter a path manually** and enter a path such as `/books/audiobooks`. All folders in the library share the scanner rules you choose next.

Run **Check folders** before creating the library. The prescan reports whether BookOrbit can access each folder, the number of matching files, and whether the folder overlaps a folder already used by another library.

:::tip
The prescan counts files, not final book records. For example, `Book.epub` and `Book.pdf` can count as two files but become one book when you use **Folder as Book**.
:::

:::caution
Avoid overlapping folders unless you intentionally want the same physical files in more than one library. Overlap makes scans and missing-file states harder to interpret.
:::

### 3. Decide What A Book Looks Like On Disk

<img src="/images/getting-started/create-library-scanner-step.webp" alt="Create a library Scanning step showing scan mode, allowed formats, and exclude patterns" class="img-lg img-bordered" />

This is where a folder of files becomes a library of books. **Folder as Book** is the default and usually the right choice: files in one book folder stay together, including alternate formats, sidecar metadata, covers, and audiobook tracks. Root-level book files still become individual books.

Choose **File as Book** only for a flat folder where each supported file is a separate title. It does not associate sidecars or folder-level extras with a book. For audiobooks, use **Folder as Book** so multi-file titles stay together; BookOrbit also handles common disc-folder names such as `CD 1` and `Disc 2`.

Leave **Allowed formats** empty to accept every supported format. Selecting one or more formats turns the list into a filter.

| Type | Formats |
|------|---------|
| Ebooks | EPUB, KEPUB, PDF, MOBI, AZW3, AZW, FB2 |
| Comics | CBZ, CBR, CB7 |
| Audiobooks | M4B, MP3, M4A, OPUS, OGG, FLAC |

If you later restrict formats, books whose files are no longer allowed can be marked missing on the next scan. Use **Exclude patterns** for paths you never want the scanner to consider. Literal names and simple `*` wildcards are the safest choices: `samples`, `node_modules`, `*.tmp`, and `*_sample.*` are typical examples. Files and folders whose names begin with `.` are skipped automatically.

### 4. Choose Which File Wins

<img src="/images/getting-started/create-library-metadata-step.webp" alt="Create a library Metadata step showing source precedence and format priority" class="img-lg img-bordered" />

When more than one file can describe the same book, this step establishes a predictable order. Put the metadata source you trust most at the top: **Embedded metadata** reads the book file itself, while **OPF files** uses a separate `.opf` file kept beside the book.

The format list answers a different question: which file is primary? BookOrbit registers every allowed file, then selects the first available format in the priority list for normal reading, downloads, and embedded-metadata import. New libraries start with this order:

`EPUB`, `KEPUB`, `PDF`, `CBZ`, `CBR`, `CB7`, `MOBI`, `AZW3`, `AZW`, `FB2`, `M4B`, `MP3`, `M4A`, `OPUS`, `OGG`, `FLAC`

For audiobooks, move `M4B`, `M4A`, or `MP3` toward the top. Format priority does not exclude anything; return to **Scanning** and use **Allowed formats** when you want a format excluded entirely.

### 5. Set The Reading Milestones

<img src="/images/getting-started/create-library-reading-step.webp" alt="Create a library Reading step with reading-start and finished thresholds" class="img-lg img-bordered" />

BookOrbit uses progress to move a book through your reading states. The defaults are intentionally forgiving: a book becomes **Reading** at 0.25%, and becomes **Finished** at 98%. The finish threshold avoids treating appendices, indexes, credits, or trailing blank pages as required reading.

| Setting | Range | Default |
|---------|-------|---------|
| **Reading start** | 0.05% to 5% | 0.25% |
| **Mark as finished** | 90% to 100%, whole numbers | 98% |

### 6. Decide How The Library Stays Current

<img src="/images/getting-started/create-library-schedule-step.webp" alt="Create a library Automation step with folder watching and scan schedule options" class="img-lg img-bordered" />

Turn on **Watch folders** when the storage backing the library provides reliable filesystem events. BookOrbit then schedules targeted scan work as files are added, changed, moved, or removed. For a network mount that does not report events reliably, leave watching off and use a manual or scheduled scan instead.

Choose a schedule if you want a regular safety net. The built-in choices are hourly, every 6 or 12 hours, daily, weekly, or a custom five-field cron expression. For example, `*/30 * * * *` runs every 30 minutes. **Never** stores no schedule.

### 7. Decide Whether BookOrbit May Change Files

<img src="/images/getting-started/create-library-file-write-step.webp" alt="Create a library File updates step with file renaming and metadata-writing options" class="img-lg img-bordered" />

The final step is optional and is off by default. Leave it that way if you want BookOrbit to keep its metadata changes in the database only. Enable it when BookOrbit should write changes such as titles, authors, series, descriptions, tags, ratings, or covers back to the files themselves.

| Option | Default | What it changes |
|--------|---------|-----------------|
| **Rename files after metadata changes** | Off | Renames physical files when relevant metadata changes, using the library naming pattern. |
| **Write metadata to files** | Off | Enables writing metadata to supported files. |
| **Include cover image** | On | Includes the stored cover when the target format supports it. |
| **EPUB** | On, 100 MB | Writes metadata into the OPF inside the EPUB archive. |
| **PDF** | On, 100 MB | Writes PDF Info and XMP metadata. |
| **Comic archives (CBX)** | Off, 500 MB | Writes `ComicInfo.xml` into CBZ and CB7 archives. CBR is imported but not written by this option. |
| **Audio** | On, 500 MB | Embeds the stored cover into M4B, M4A, MP3, and FLAC files. |

Each file-size limit can be set from 1 MB to 10,000 MB. Keep backups before enabling file updates for a collection you want to preserve exactly as imported.

## Create It, Then Let It Scan

Once **Details** and **Folders** are complete, **Create now** is available from the later wizard steps if you are happy with the defaults. Otherwise, finish the walkthrough and select **Create library** on the final step.

BookOrbit saves the library, adds its folders, starts a watcher when **Watch folders** is on, and immediately begins the first scan. The initial scan may take seconds or minutes, depending on the number of files and the storage speed.

<img src="/images/getting-started/settings-libraries-list.webp" alt="Settings Libraries page with libraries, scan controls, watch status, and schedules" class="img-lg img-bordered" />

Afterward, **Settings > Libraries** is the library's control room. Use **Scan All** to scan every library, **Scan** to scan one, and the `...` menu to edit the library, refresh covers, sync metadata to files, or delete it. The edit flow also adds an **Access** section, because access rules only become meaningful after the library exists.
