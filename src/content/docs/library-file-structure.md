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
| **File as Book** | One book per file. Folder structure is ignored. | Only for a flat ebook dump with no sidecar files and no multi-format grouping needed. |

:::tip
**For ebooks and comics**, Folder as Book is always the safe default - files with different names in the same folder are imported as separate books.

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

If you have the same book in multiple formats, put them all in the same folder. BookOrbit groups them into one book and uses the library's **Format priority** to decide which is primary. You can read in any available format from the book detail view.

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

Use **Folder as Book**. One folder per title or issue.

### Single-volume or graphic novel

```
Comics/
  Watchmen/
    Watchmen.cbz
    cover.jpg
  Batman - Year One/
    Batman - Year One.cbr
    cover.jpg
```

### Multi-issue series

Give each issue its own folder so they appear as individual books in the library. Use zero-padded issue numbers in folder and file names to keep them in order.

```
Comics/
  The Sandman/
    The Sandman 001/
      The Sandman 001.cbz
    The Sandman 002/
      The Sandman 002.cbz
    The Sandman 003/
      The Sandman 003.cbz
```

:::tip
If you want the whole series as one browseable run, use BookOrbit's **Series** field and **series index** rather than trying to group issues into one folder. The series view collapses them into one entry in the grid automatically.
:::

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

Files with extension `.opf` or `.nfo` in the same folder are read as metadata sidecars. Whether they take precedence over embedded metadata depends on the library's **Source precedence** order, set on the Metadata step during library creation.

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

If your library folder contains non-book directories or files you want the scanner to ignore, add exclude patterns on the library's **Scanner** step. Patterns are matched against the **file or folder name only** - not the full path.

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

**Set your scan mode before importing.** Changing from File as Book to Folder as Book (or vice versa) after books are already imported forces a full rescan and can change which files are treated as books vs sidecars. Choose the right mode during library creation.

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
