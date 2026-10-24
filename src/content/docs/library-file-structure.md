---
title: "Library File Structure"
description: "Organize ebooks, audiobooks, comics, and sidecar files so BookOrbit imports them correctly."
---


How you organize files on disk determines what BookOrbit imports. This page covers the recommended layouts for every library type, what sidecar files are recognized, and how to handle real-world collections.

## The golden rule

Every library has a **scan mode** chosen during setup. That mode must match how your files are laid out on disk - everything else follows from it.

| Scan mode | What it creates | Use when |
|-----------|-----------------|----------|
| **Folder as Book** | One book per folder. All files inside are grouped together. | Almost always. Required for audiobooks, multi-format books, and any library with cover or OPF sidecar files. |
| **File as Book** | One book per file. Folders only group files, and can name their series. | A flat ebook dump with no sidecar files, or comics and manga kept in one folder per series. |

:::tip
**For ebooks**, Folder as Book is the safe default. Give every book its own folder: all the files in one book folder become one book, whatever their names.

**For comics and manga** kept in one folder per series, the layout Komga and Kavita use, choose File as Book and turn on **Folders are series**. See [Comics](#comics).

**For audiobooks**, Folder as Book requires that each audiobook has its own dedicated folder. If any subfolder contains audio files, BookOrbit treats that entire folder as one audiobook - all tracks merged together, regardless of their names. See the [Audiobooks](#audiobooks) section below.
:::

---

## Ebooks

Use **Folder as Book** with one subfolder per book. Inside each folder, put the book file, an optional cover image, and an optional OPF metadata sidecar.

```
Ebooks/
  Dune/
    Dune.epub
    cover.jpg
    Dune.opf
  Project Hail Mary/
    Project Hail Mary.epub
    cover.jpg
```

If you have the same book in multiple formats, put them all in the same folder. BookOrbit groups them into one book and uses the library's **Primary file** order to decide which is primary. You can read in any available format from the book detail view.

```
Ebooks/
  The Hobbit/
    The Hobbit.epub
    The Hobbit.mobi
    The Hobbit.pdf
    cover.jpg
```

### Flat ebook collections (File as Book)

If your entire collection is a single folder of files with no subfolders and no sidecar files, use **File as Book** mode instead. No subfolders needed.

```
Ebooks/
  Dune.epub
  Foundation.epub
  The Hobbit.mobi
```

:::caution
In **File as Book** mode, cover images and OPF metadata files are never associated with a book - each file is completely standalone. If you ever want to add sidecar covers or have multiple formats per book, switch to **Folder as Book** before your collection grows.
:::

---

## Audiobooks

Always use **Folder as Book** for audiobooks. File as Book cannot group multiple tracks into one book and will not correctly import multi-disc libraries.

:::caution
**Each audiobook must have its own dedicated folder.** The moment any subfolder contains an audio file, BookOrbit treats that entire folder as one audiobook - all audio files merged together, no matter their names. Never put multiple unrelated audio titles in the same subfolder.
:::

### Single-file audiobook

One audio file in its own folder.

```
Audiobooks/
  Project Hail Mary/
    Project Hail Mary.m4b
    cover.jpg
  The Martian/
    The Martian.mp3
    cover.jpg
```

### Multi-track audiobook

Multiple audio files in one folder are automatically grouped into one book. Files are sorted by filename for playback, so use zero-padded numbers to get the right order.

```
Audiobooks/
  Dune/
    01 - Dune.mp3
    02 - Dune.mp3
    03 - Dune.mp3
    cover.jpg
```

:::tip
Always zero-pad track numbers: `01, 02 ... 09, 10, 11` not `1, 2 ... 9, 10, 11`. Without padding, `10` sorts before `2` alphabetically, which breaks playback order.
:::

### Multi-disc audiobook

Put disc tracks in subfolders named with a recognized disc pattern. BookOrbit flattens them into the parent book automatically - no extra configuration needed.

```
Audiobooks/
  The Way of Kings/
    Disc 1/
      01 - Track.mp3
      02 - Track.mp3
    Disc 2/
      01 - Track.mp3
      02 - Track.mp3
    cover.jpg
```

Recognized disc folder names (case-insensitive): `CD 1`, `Disc 2`, `Disk 3`, `Part A`, `Side IV`. The number can be a digit, letter, or roman numeral.

Tracks play disc by disc: every track of `Disc 1`, then every track of `Disc 2`, with the disc folders in natural order (`Disc 2` before `Disc 10`). Tracks in different discs can share a name. A library scanned with an earlier version that played such tracks interleaved is put back in disc order by its next scan, and audiobook bookmarks move with their tracks.

:::caution
Only these specific patterns are treated as disc folders. Names like `Volume 1`, `Book 1`, or `Part One` (spelled out) are not recognized and will be imported as separate books instead of disc groupings. Rename them to `Part 1`, `Disc 1`, etc.
:::

### Audiobook with companion ebook

If you have both an audio file and an ebook for the same title, use a subfolder named exactly after the audio file's stem. BookOrbit absorbs the subfolder into the parent book.

```
Audiobooks/
  Dune/
    Dune.m4b
    Dune/            ← same name as the .m4b stem - gets absorbed
      Dune.epub
    cover.jpg
```

Both files become part of the same book record, and the book gets two covers: a portrait Book cover and a square Audiobook cover. See [Books with an ebook and an audiobook](#books-with-an-ebook-and-an-audiobook) for where each comes from.

---

## Comics

Comics and manga come in two layouts. Pick the scan mode that matches yours.

### One folder per series (Komga and Kavita layout)

Most comic and manga collections keep one folder per series and one file per issue, volume or chapter. This is the layout Komga, Kavita and Mylar use.

```
Comics/
  Marvel/
    Deadpool (2016)/
      Deadpool 001 (2016).cbz
      Deadpool 002 (2016).cbz
  Saga/
    Saga #01.cbz
    Saga #02.cbz
  One Piece/
    One Piece v01.cbz
    One Piece c1001.cbz
  Watchmen.cbz
```

When you create the library, choose **Series folders** in the **Scanning** section. It is not a mode of its own: it sets **File as Book**, which decides what one book is (a single file, as in Komga and Kavita), and turns on **Folders are series** in the **Series** card, which decides which series the book belongs to.

<img src="/images/library-file-structure/series-folders-layout.webp" alt="Scanning section of a new library with the Series folders layout selected and Folders are series turned on" class="img-lg img-bordered" />

Every file becomes its own book, and:

- The folder a file sits in becomes its series. A year in parentheses stays part of the name, so `Batman (2011)` and `Batman (2016)` remain two series. Release tags in square or curly brackets are left out: `One Piece [Digital]`, `[Group] One Piece` and `One Piece {Viz}` all name the series `One Piece`.
- The number in the file name becomes the book's place in the series: `#12`, `012`, `v01`, `Vol. 1`, `T01`, `c1001`, `Chapter 5`, a leading `01 - `, and Japanese, Chinese and Korean markers such as `第1話`, `12巻`, `01화` and `3권`. A chapter or issue number wins over a volume number in the same name.
- A folder that only groups files is skipped and the folder above it names the series: `Volume 05 (2005)`, `Part 1`, `Season 2` and a bare year such as `1986`. Files in a `Specials`, `Extras`, `Annuals`, `Bonus` or `_oneshots` folder inside a series folder join that series without a number, so an annual never takes issue #1's place.
- Files at the top of the library folder, like `Watchmen.cbz` above, keep the series their own metadata gives them.
- A series named in a file's `ComicInfo.xml` still comes first, unless you move **Regex** above **Tags in the book file** in the **Metadata** section. The exception is the same name without the year: a file tagged `Batman` inside `Batman (2016)/` joins `Batman (2016)`.

A publisher or genre folder above the series folders is fine. Point the library at the folder that holds the series folders, not at a single series folder: files at the top of the library get no series from their folder. Folders are series is a set of path rules; open **Configure** next to **Regex** in the **Metadata** section to see them, test a path, or start from them and adjust. Libraries that use the rules unchanged follow later improvements to them automatically; edited rules are yours and stay as they are.

<img src="/images/library-file-structure/folders-are-series-preset.webp" alt="Configure regex metadata dialog with the Folders are series rules and a Use these rules button" class="img-lg img-bordered" />

Type a path into the preview to see what the rules make of it before you move any files:

<img src="/images/library-file-structure/folders-are-series-preview.webp" alt="Regex preview for a manga chapter path, matching the series Spice and Wolf with series number 11" class="img-lg img-bordered" />

:::tip
Turning Folders are series on in an existing library does not change the books already in it, because a scan only re-reads files that changed. Save the library, then use **Apply rules to existing books** in the **Metadata** section. It writes only the series and number the rules decide, keeps locked fields, and leaves titles, descriptions and everything else alone. Turning the switch off later keeps the series already set; it only stops new ones.
:::

When you edit an existing File as Book library, the **Series** card sits under the layout, which is set at creation:

<img src="/images/library-file-structure/series-folders-existing-library.webp" alt="Scanning section of an existing File as Book library with the Series card and Folders are series turned on" class="img-lg img-bordered" />

**Apply rules to existing books** sits under the sources in the **Metadata** section and reports what it changed:

<img src="/images/library-file-structure/apply-rules-existing-books.webp" alt="Book details come from list with the Apply rules to existing books button and a summary of the books processed" class="img-lg img-bordered" />

#### When the folders are not tidy

The folders decide, so the result is only as tidy as the tree. BookOrbit does not guess around a layout; it names every series after a folder by the same rules, so the result is predictable and fixed by fixing the folders. Common surprises:

| Layout | What you get | Fix |
|--------|--------------|-----|
| Several series loose in one folder, `Comics/Batman 001.cbz` and `Comics/Superman 001.cbz` | One series called `Comics` | Give each series its own folder |
| The same folder name in two places, `Marvel/Batman/` and `DC/Batman/` | One merged `Batman` series | Add the start year: `Batman (1940)`, `Batman (2016)` |
| Runs nested under one title without years, `Supergirl/Volume 05/` | One `Supergirl` series with two issue #1s | Name the run folders `Supergirl (2005)`, `Supergirl (2011)` |
| An extra folder level, `Maison Ikkoku/Collector's Edition/` | A series called `Collector's Edition` | Rename the folder, or move the files up |
| A volume and a chapter, or an annual, with the same number in one folder | Two books at the same place in the series | Move annuals and specials into a `Specials`, `Annuals` or `Extras` folder inside the series folder; they join the series without a number |
| A file name with no number | A book in the series with no number | Add the number to the file name |
| A folder of loose images instead of an archive | Not imported | Pack each chapter or issue as a CBZ |

After fixing folders, run **Apply rules to existing books** to bring the books already in the library up to date. **Configure** in the **Metadata** section can test any path before you move files.

:::note
Folders are series and Apply rules to existing books need BookOrbit v3.6.0 or later.
:::

### One folder per issue

**Folder as Book** treats every folder as one book, so a folder that holds a whole series becomes a single book. Use it for comics only when each issue has a folder of its own, for example because it carries a cover image or an OPF file beside it.

```
Comics/
  The Sandman/
    The Sandman 001/
      The Sandman 001.cbz
    The Sandman 002/
      The Sandman 002.cbz
  Watchmen/
    Watchmen.cbz
    cover.jpg
```

Use zero-padded issue numbers in folder and file names to keep them in order, and set each book's **Series** field and series index to group the issues. The series view collapses them into one entry in the grid.

---

## Sidecar files

Sidecar files live in the same folder as the book and are associated with it automatically. They do not become separate book records.

### Cover images

The file extension can be `jpg`, `jpeg`, `png`, `webp`, `gif`, or `bmp`. The **filename** (without extension) must be one of:

| Filename | Notes |
|----------|-------|
| `cover` | Recommended - most universally recognized |
| `folder` | Common in audiobook rips |
| `thumbnail` | |
| `artwork` | |
| `front` | |

Any other image in the folder - `back-cover.jpg`, `author.png`, `map.webp` - is ignored.

A cover image is a fallback. When the book's own files carry embedded cover art, that art is used and the image is not. A new or changed cover image is picked up by the next scan, or shortly after the change when **Watch folders** is on. It can fill an empty cover or replace one that came from an earlier folder image, but it never replaces embedded art, a cover you uploaded, or a locked cover.

#### Books with an ebook and an audiobook

A folder that holds both ebook and audio files makes a book with two covers, a Book cover and an Audiobook cover (see [Book and Audiobook Covers](/book-details#book-and-audiobook-covers)). The same scan fills both, each from its own files:

- The **Book cover** comes from the art embedded in the ebook that ranks highest in the library's format priority.
- The **Audiobook cover** comes from the art embedded in the first audio track, by file name.

A cover image fills only a cover whose files have no embedded art, and its shape decides which one:

| Image shape | Fills |
|-------------|-------|
| Square: width within 10% of the height | The Audiobook cover |
| Portrait: width under 85% of the height | The Book cover |
| Anything in between, or wider than it is tall | Whichever cover is still empty, starting with the primary file's |

So a portrait image never becomes the Audiobook cover, and a square image never becomes the Book cover. When several cover images qualify, BookOrbit takes the closest shape for each cover, then goes by file name.

A [Storyteller read-aloud EPUB](/storyteller-read-aloud) also gets an Audiobook cover, because its narration counts as an audiobook. Only a square cover image fills it from the folder; the EPUB's own art is always its Book cover.

A book with only one kind of file has one cover, and any recognized cover image can fill it, whatever its shape.

### Metadata sidecar files

Files with extension `.opf` or `.nfo` in the same folder are read as metadata sidecars. Whether they take precedence over embedded metadata depends on the library's **Book details come from** order in its **Metadata** section.

---

## Grouping folders

Your library folders can have intermediate grouping folders - for example, sorting books by author or genre. BookOrbit walks the entire folder tree and handles them correctly, as long as each actual book lives in its own leaf folder.

```
Ebooks/
  Sci-Fi/               ← grouping folder, not a book
    Isaac Asimov/       ← grouping folder, not a book
      Foundation/
        Foundation.epub
      I Robot/
        I Robot.epub
  Fantasy/
    Dune/
      Dune.epub
```

:::tip
Deep nesting works, but it adds maintenance overhead that BookOrbit's built-in tools make unnecessary. **Collections** and **Smart Scopes** let you group, filter, and browse by genre, author, or series without touching the folder structure at all. A flat two-level layout (`Library root > Book folder`) is the easiest to maintain long-term.
:::

---

## Exclude patterns

If your library folder contains non-book directories or files you want the scanner to ignore, add them under **Skip files matching** in the library's **Scanning** section. Patterns are matched against the **file or folder name only** - not the full path.

| Pattern | What it skips |
|---------|---------------|
| `samples` | Any file or folder named exactly `samples` |
| `*.tmp` | Any file ending in `.tmp` |
| `*_sample.*` | Files like `Dune_sample.epub` |
| `extras` | A folder named `extras` |

:::tip
Use literal names for folders and simple `*` wildcards for file patterns. Full-path patterns like `**/samples` are not supported - only the entry name is matched.
:::

---

## Tips and tricks

**Choose the layout before importing.** How files become books is set when the library is created and cannot be changed afterwards, because switching would turn the same files into different books. To use another layout, create a new library for the folder.

**Multiple formats in one folder are always better than separate libraries.** If you have both EPUB and MOBI versions of a book, keep them in the same folder. BookOrbit shows them as one book with multiple available formats.

**Keep the Book Dock folder separate from your library folders.** The Book Dock staging folder is managed internally by BookOrbit. Adding it as a library folder will cause duplicate imports.

---

## Troubleshooting

### A multi-file audiobook was split into separate books

1. **Check the scan mode.** File as Book creates one record per file by design. Switch to Folder as Book under **Settings > Libraries > Edit > Scanner** and re-scan.
2. **Check that all tracks are in the same folder.** Each subfolder becomes its own book unless it has a recognized disc name.
3. **Check disc subfolder names.** Only `CD N`, `Disc N`, `Disk N`, `Part N`, and `Side N` are flattened. `Volume 1`, `Book 1`, and spelled-out names like `Part One` are treated as separate books - rename them and re-scan.

### A sidecar cover or OPF is not being picked up

- Confirm the cover filename is exactly one of: `cover`, `folder`, `thumbnail`, `artwork`, or `front` (with an image extension). Other image filenames are ignored.
- Confirm the sidecar is in the same folder as the book file, not a parent or sibling folder.
- A cover image is used only when the book's files have no embedded cover art. To use it anyway, upload it from the book's cover editor.
- In a folder with both an ebook and an audiobook, check the image's shape: a square image fills only the Audiobook cover, and a portrait image fills only the Book cover.
- If you added an OPF after the initial import, run a manual **Scan** - the watcher does not re-import a folder for OPF-only changes.
- If the book and its cover image were in the library before you upgraded to a version with separate Book and Audiobook covers, run **Refresh covers** from the library's `...` menu in **Settings > Libraries**. A normal scan only reads covers again for books whose files changed.

### Disc folders are creating separate books instead of one audiobook

The subfolder name does not match the disc pattern. Rename it to `Disc 1`, `CD 1`, or `Part 1` (numeral required - `Part One` does not match) and run a manual **Scan**.

### A book appears twice

Two different folder paths are being treated as separate books. This usually happens when a file exists both at the library root and inside a subfolder. Remove the duplicate file and re-scan.
