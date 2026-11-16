---
title: "Library Dock"
description: "Stage incoming books, review their metadata and file them into a library, or give a library its own dock that files for you."
---

A batch of new books arrives: a few novels from a store you trust, a comic, an audiobook with the wrong cover. The comic and the audiobook need a look before they reach a shelf. The novels could go straight into Fiction, named and filed the way the rest of the library is.

The **Library Dock** is where incoming files wait. BookOrbit reads each file's embedded metadata and cover, fetches provider metadata if you want it, and then you file the book into a library, or the dock files it for you.

:::note
Docks for individual libraries need BookOrbit v3.9.0 or later. Earlier versions called this area Book Dock and had one shared folder, which is now the **Unsorted** dock. Files, settings and permissions carry over.
:::

---

## How the Dock Is Laid Out

The dock is one folder on the server: `/data/book-dock` in Docker, set by `BOOK_DOCK_PATH`. Inside it there are two kinds of dock.

| Dock | Folder | What happens to a file |
|------|--------|------------------------|
| **Unsorted** | The dock folder itself | Waits until you choose a library, or files into the library set for Unsorted. |
| **A library's dock** | `_libraries/<folder>/` | Is already headed for that library: it gets the library's metadata rules and can be named and filed on its own. |

```text
book-dock/
├── The Pearl.epub        Unsorted
└── _libraries/
    ├── Fiction/
    │   └── Dune.epub     Fiction dock
    └── Comics/
        └── Saga 01.cbz   Comics dock
```

Subfolders inside a dock are supported. Files placed directly in `_libraries/`, outside any library's folder, are not picked up, and neither are folders that no dock owns. Dock managers see both under **Folders that need you** on the dock page. A folder named after a library without a dock, such as `Fiction/`, offers **Turn on Fiction dock**.

BookOrbit also ignores system and NAS leftovers such as `._*` files, `@eaDir`, `#recycle` and `.stfolder`.

:::caution
Keep the dock folder separate from your library folders. BookOrbit refuses to save a library whose folder sits inside the dock folder or contains it.
:::

---

## Access

| Permission | What it allows |
|------------|----------------|
| **Library Dock** | Open the dock, upload into it, and review and file your own uploads. |
| **Manage Library Dock** | See every file, change dock settings, turn docks on and off, and manage dock folders. |

Users who are not dock managers see only the files they uploaded. Uploading into a library's dock also needs access to that library. An upload files itself only when its uploader has **Upload books** and access to the library; otherwise it waits for a dock manager.

---

## Turn On a Library's Dock

Docks are off until you turn them on, one library at a time. Nothing changes for libraries without a dock.

1. Open **Settings > Server > Library Dock**. The **Docks** table lists Unsorted and every library.
2. Turn on the switch in the **On** column for the library.
3. Check the **Folder** name and, for a library with several folders, which one the dock **Files into**.
4. Click **Turn on**. BookOrbit creates `_libraries/<folder>/`.

<img src="/images/book-dock/turn-on-dock-dialog.webp" alt="Turn on the Audiobooks dock dialog with the folder name and the library folder it files into" class="img-md img-bordered" />

The folder name defaults to the library's name and ignores case. If a folder with that name is already in `_libraries/`, the dock takes it over and picks up its files. Managers also reach this page from **Add a dock** on the dock page.

<img src="/images/book-dock/settings-docks-table.webp" alt="Docks table with Unsorted, a Novels dock that hardlinks and keeps originals, and libraries without a dock" class="img-lg img-bordered" />

The table shows each dock's auto-file setting, how filing reaches the library, and its extras.

| Filing | Meaning |
|--------|---------|
| **Move** | The dock and the library are on the same disk, so filing is an instant move. |
| **Hardlink** | The dock keeps originals and links each file into the library without using more space. |
| **Copy** | The dock and the library are on different disks, so every filed book is copied and uses the space twice. |

Turning a dock off stops new files from being picked up. Files already waiting keep their library and can still be filed, and nothing is deleted.

---

## Set a Dock's Own Rules

Click the pencil next to a dock to open its settings. Anything left at **Default** follows the defaults at the top of the page, shown in brackets, for example **Default (85%)**.

<img src="/images/book-dock/dock-settings-sheet.webp" alt="Novels dock settings with folder, library folder, auto-fetch, auto-file, match needed, metadata mode, join matching books and keep originals" class="img-md img-bordered" />

| Setting | What it does |
|---------|--------------|
| **Folder** | Renames the dock folder on disk. Scripts, download clients or sync tools using the old path stop working. |
| **Files into** | The library folder filed books go to. |
| **Auto-fetch metadata** | Fetches provider metadata after a file arrives. |
| **Auto-file** | Files books whose match reaches **Match needed** without review. |
| **Match needed** | The match score auto-file needs, from `50%` to `100%`. |
| **Metadata mode** | Which metadata is written to the new book; see [Defaults](#defaults). |
| **Join matching books** | Adds a file to a book already in the library when they share an ISBN, ASIN or provider id. Title and author alone never join. Off by default. |
| **Keep originals** | Leaves files in the dock for a download client; see [Keep Originals for Seeding](#keep-originals-for-seeding). |

The Unsorted row has its own settings: **Library for files without one**, which auto-file uses for Unsorted files, plus **Join matching books** and **Keep originals**. Everything else in Unsorted follows the defaults.

### Defaults

The top of the settings page holds the defaults every dock starts from.

| Setting | Behavior |
|---------|----------|
| **Auto-fetch metadata from providers** | Fetches provider metadata after a file arrives, when it has a title or ISBN. If the lookup fails, the file still becomes ready. |
| **Auto-file** | Off unless you turn it on. Files at or above the **Confidence threshold** are filed without review. |
| **Metadata mode** | Controls which metadata layer is written to the new book. |

| Metadata mode | Behavior | Threshold used? |
|---------------|----------|-----------------|
| **Safe merge** | Embedded, then fetched, then manual edits. Later layers win. | Yes |
| **Fetched only** | Fetched metadata, then manual edits. | Yes |
| **Embedded only** | Embedded metadata, then manual edits. | No |

### When a library changes

- **Renamed**: the dock folder keeps its old name and the table marks it **Old name**. **Rename folder to** in the dock's settings brings the two back in line.
- **Folder removed**: if the library loses the folder the dock files into, the dock's files wait until you **Choose a folder**.
- **Deleted**: files waiting in its dock move to Unsorted, marked with the library they came from. The folder stays on disk and appears under **Folders that need you**, with **Move to Unsorted** and **Remove folder** (empty folders only). Files are never deleted.

---

## Keep Originals for Seeding

A download client needs its files to stay where they are while it seeds. With **Keep originals** on, BookOrbit hardlinks each file into the library and leaves the original in the dock, so both share the same space on disk. Where a hardlink is impossible, for example across disks or Docker mounts, it copies the file instead.

- Filed originals disappear from the list. The dock page counts them as **kept for seeding**, and BookOrbit forgets each one once the download client removes the file.
- **Discard** hides the file and remembers to skip it. The file stays on disk for the download client to remove.
- Uploads are never kept: they are moved when filed and deleted when discarded. Only files placed in the dock folder stay behind.
- Writing metadata into the book file later gives the library its own copy, so the seeding original is never changed. The two copies stop sharing space.

---

## Open the Library Dock

Click **Library Dock** in the sidebar. The badge shows how many files are in the dock.

<img src="/images/book-dock/library-dock-page.webp" alt="Library Dock page with the dock switcher, status tabs and files showing match scores, targets and hold reasons" class="img-bordered" />

| Area | What it does |
|------|--------------|
| **Docks** | Switches between **All**, **Unsorted** and each library's dock, with counts. **Off** marks a dock that is turned off. |
| **Status tabs** | Filter by **All**, **On hold**, **Working**, **Ready** or **Error**. |
| **Search** | Filters file names. It does not search every metadata field. |
| **Sort** | Puts files needing attention first, or sorts by date added, name, size, format or status. |
| **Pause** | Stops processing files, including metadata fetching and auto-filing, until you resume. |

Each row shows the cover from the file and the new cover from fetched metadata, the target library and path, the match score, and the buttons to apply metadata, change the destination and file the book.

---

## Add Files

| Way in | Where the file goes |
|--------|---------------------|
| Copy or move it into a dock folder on the server | The dock that owns the folder. Use **Rescan** if it does not appear. |
| **Upload** on the dock page | The dock you are viewing, or Unsorted when viewing **All**. |
| Upload from a library page | When the library has a dock, choose **Review in dock first** or **File now**. BookOrbit remembers your choice for each library. |
| Upload from the iPhone app | **Library Dock** (Unsorted) or a library's dock, chosen in the upload sheet. |
| A [book request](/book-requests) download | Passes through the dock and shows under the dock of the library it is headed for. |

| Type | Formats |
|------|---------|
| Ebooks | EPUB, KEPUB, PDF, DjVu, MOBI, AZW, AZW3, FB2 |
| Comics | CBZ, CBR, CB7 |
| Audiobooks | M4B, M4A, MP3, OPUS, OGG, FLAC |

Uploads follow **Maximum upload file size limit** under **Settings > Library > Maintenance**, 4 GB by default. Copy larger files into the dock folder directly. An upload into a library's dock is refused before any data is sent when the library does not take the format.

### From the iPhone app

In **More > Uploads**, the destination menu lists your libraries, then **Library Dock** ("Hold for review on the web") and each library dock you can use, such as **Novels dock**.

<img src="/images/book-dock/ios-upload-destination-menu.webp" alt="iPhone upload sheet with the destination menu listing libraries, Library Dock and the Novels dock" class="img-sm img-bordered" />

The app lists library docks only on a server that has them. An older server, or an app that has not been updated, offers **Library Dock** alone, and uploads land in Unsorted as before.

---

## Why a File Is Waiting

Every file that is not filed says why. The **On hold** tab shows them all, and the reason chips under the tabs filter by one reason.

| Reason | What it means | What to do |
|--------|---------------|------------|
| **Low match** | The match score is below what auto-file needs, for example "72% match, needs 85%". | Check the metadata, apply what fits, then **File**. |
| **Already in library** | A book in the target library shares an ISBN, ASIN, provider id, or title and author. | **Resolve**: open the existing book, **Add as format**, **Keep both**, or discard the file. |
| **Doesn't fit** | The target library does not take this format. | **Move to** another library, or add the format to its **Allowed formats**. |
| **Layout doesn't fit** | A folder of files, such as an audiobook in parts, that the library cannot store as one book. | Choose another library. |
| **Path taken** | A file already exists at the target path. | Change the destination, the metadata the file name uses, or the naming pattern. |
| **No destination** | An Unsorted file without a library. | **Set destination**. |
| **Folder removed** | The library no longer has the folder its dock files into. | **Choose a folder**. |
| **Waiting for a manager** | The uploader cannot add books to the target library. | A dock manager files it. |

A match in a different library shows as an **Also in** note. It is for information only and does not stop auto-file.

---

## Review Metadata

The dock keeps three metadata layers.

| Layer | Source | Filing priority |
|-------|--------|-----------------|
| **Embedded** | Extracted from the file. | Used when nothing else is selected. |
| **Fetched** | Returned by metadata providers. | Used only after you apply it or auto-file selects it. |
| **Selected** | Manual edits or applied fetched metadata. | Used first. |

The match score compares embedded metadata with fetched metadata. ISBN matches score highest; conflicting ISBNs score low; title, author, year and series fill in the rest. Treat the score as a review signal, not proof.

Open a row to edit title, subtitle, authors, description, publisher, year, language, ISBN, series, genres, cover URL and destination. You can also search metadata providers by hand and apply selected fields through a diff view. An audio file is searched as an audiobook and an ebook as a book, so each is offered art of its own shape. Edits are saved in the dock and used when filing; they do not change the file itself.

Filing saves the chosen cover as the cover for the file's kind: the Audiobook cover for an audio file, the Book cover otherwise. Adding an audiobook to a book that already has an ebook therefore keeps its Book cover.

---

## Bulk Actions

| Action | Use it for | Notes |
|--------|------------|-------|
| **Finalize** | File the selected books into their libraries. | Files without a destination need a default destination in the dialog. |
| **Set Destination** | Assign one library and folder to many rows. | The file stays where it is; only its target changes. |
| **Apply Fetched** | Accept provider metadata for many rows. | Skips edited rows and rows with no fetched metadata. |
| **Retry Errors** | Requeue failed rows. | Only rows in **Error** are retried. |
| **Bulk Edit** | Apply shared fields such as language, publisher, series or genres. | List fields can be merged instead of replaced. |
| **Discard** | Remove files from the dock. | In a dock that keeps originals, the file stays on disk. |

---

## Finalize

<img src="/images/book-dock/finalize-dialog.webp" alt="Finalize dialog with default destination and rename preview" class="img-lg img-bordered" />

Filing turns a dock file into a normal library book. BookOrbit checks access to the library, checks the format against it, resolves the file name, never overwrites an existing file, checks for duplicates, moves or links the file, creates the book with its metadata and cover, and removes the dock row.

If some selected files have no destination, the dialog asks for a **Default Destination Library** and **Default Destination Folder**, used only for those files. Review the rename preview before starting, especially when file naming patterns use title, author or series. Filing can partly succeed; the result screen lists created books, duplicates and per-file errors.

The target preview uses the destination library's file naming pattern when it has one, otherwise the global upload naming pattern, otherwise the original file name.

---

## Notifications

When auto-file works through a batch, each dock sends one notification once it goes quiet, for example **Library Dock: Fiction**, "482 books filed, 18 need review". A single filed book gets its own notification. Choose what you hear about under the **Library Dock** category in your notification preferences.

---

## Typical Workflows

### Review everything

1. Add files to Unsorted.
2. Wait for **Ready**, then fix metadata or search providers where needed.
3. Set destinations in bulk and review the rename preview.
4. Finalize and check any failures.

### One trusted source per library

1. Turn on a dock for the library.
2. In its settings, set **Auto-file** to **On** and keep **Match needed** at `85%` or higher with **Safe merge**.
3. Point the source, a sync tool or a script, at `_libraries/<folder>/`.
4. Check the **On hold** tab now and then for files it left behind.

### Downloads that keep seeding

1. Put the dock on the same disk and Docker mount as the download client's completed folder.
2. Turn on **Keep originals** for the dock and check that **Filing** shows **Hardlink**.
3. Let the download client place finished files in the dock's folder.

---

## Troubleshooting

### Files are not appearing

Check that the file has a supported extension, finished copying, and sits in Unsorted or in a dock that is turned on. Files directly in `_libraries/` and in folders no dock owns are not picked up. Then click **Rescan**.

### Search is not finding a title

Search filters file names only. Open the row to inspect metadata.

### A file is stuck processing

Check that processing is not paused, refresh, then use **Rescan**. If extraction fails, the row moves to **Error** with a message.

### Apply Fetched skipped files

The row either has no fetched metadata or has manual edits. Open the row and use the diff review to apply provider metadata anyway.

### Filing copies instead of moving

The dock and the library are on different disks or separate Docker mounts, so a move or hardlink is impossible. Put both under one mount to file instantly and, with **Keep originals**, without using space twice.

### An upload is refused because the library does not take the format

The library does not import that format. Upload to another dock, or add the format to the library's **Allowed formats** under **Settings > Libraries > Edit > Scanner**.

### The iPhone app does not list a library's dock

The dock must be turned on, you need access to its library, and both the server and the app must be recent enough to support library docks. Until then, the app uploads to Unsorted.

### Finalize says the file already exists

The resolved target path already exists. Change the destination, the metadata the naming pattern uses, or the pattern, or remove the existing file.
