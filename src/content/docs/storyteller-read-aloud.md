---
title: "Storyteller Read-Aloud Books"
description: "Keep a normal EPUB, a Storyteller EPUB3, and an audiobook together without losing your place."
---

A Storyteller book is more than an EPUB with a large audio file tucked inside it. Its media overlay is a map between the words on the page and moments in the narration. BookOrbit can use that map to make several copies of the same book feel like one continuous reading experience.

The most reliable setup begins with two matching files on one BookOrbit book, with a third file available when you want a plain reading copy:

- A Storyteller EPUB3 for reading and listening together in the web reader.
- The matching standalone audiobook, as one file or an ordered set of audio files, for the audiobook player.
- Optionally, the normal EPUB that Storyteller used as its source.

If you keep a normal EPUB beside it, use the same textual edition that Storyteller used, ideally the exact source EPUB. Matching titles are not enough: chapter order and text must still agree.

Storyteller normally adds sentence anchors that do not exist in the untouched source. BookOrbit needs those anchors for its most precise position bridge, so the Storyteller EPUB should be the primary file. That makes one canonical text-and-audio map responsible for the default web reading experience, Kobo delivery, and audiobook position translation.

BookOrbit makes that choice for you. The library's format priority is considered first. When EPUB is the winning format, the scanner looks inside each EPUB for a usable media overlay and prefers the read-aloud edition over a plain EPUB. This is capability detection, not filename detection: an ordinary EPUB3 is still an ordinary EPUB unless it contains the timing map and synchronized audio resources.

## One book, several ways to read

Imagine stopping halfway through a chapter while listening in the car. The audiobook player saves the exact audio position. BookOrbit follows the Storyteller timing map to the corresponding sentence, then records that native position in the Storyteller EPUB. It also tries to carry the position into every other EPUB attached to the book.

An untouched source EPUB usually does not have Storyteller's sentence IDs. BookOrbit therefore compares the normalized text of the corresponding chapter. When the chapter text is identical, it can use the same character position to create a locator native to that EPUB. When the chapter text differs, BookOrbit skips that copy instead of guessing.

The return trip works too. Read several pages in the web reader, on Kobo, or in KOReader and BookOrbit maps the position back into the Storyteller chapter, finds the nearest earlier sentence marker, and translates that marker onto the audiobook timeline. If the source chapter cannot be proven equivalent, the audiobook keeps its existing position.

```text
                              +-> Web read-aloud (full EPUB3)
Standalone audiobook <-> map <-> Storyteller EPUB3 (preferred primary)
                              +-> Kobo / KOReader (audio removed)
                              +-> Normal EPUB (when chapter text matches)
```

This is not a simple percentage copy. BookOrbit uses the media-overlay fragments inside the Storyteller EPUB to resolve a real text position, then converts that position for each compatible EPUB. Source timestamps travel with the update, so an older device report cannot replace a newer cross-format position.

The bridge synchronizes reading position only. Highlights, notes, and bookmarks follow the normal [annotation sync](/annotations) rules and are not copied between the normal and Storyteller EPUB by this feature.

BookOrbit also keeps reading and listening intent separate inside a read-aloud session. If you read ahead and later resume narration from an earlier sentence, that narration does not drag the furthest text position backward. Once the narration advances beyond the stored page, it can move the shared position forward again.

## What each reader receives

The web reader receives the original file you choose. The default **Read** action opens the primary Storyteller EPUB in the recommended setup. BookOrbit serves that full original EPUB3, keeping its embedded audio and timing information intact so narration can follow the text. Choose the normal EPUB from the Read or Files menu when you want an ordinary text-only session.

The audiobook player uses the standalone audio files. It does not extract audio from the Storyteller EPUB. That separation keeps normal audiobook playback efficient and gives BookOrbit a stable audio timeline to synchronize.

Kobo receives the primary Storyteller EPUB through a device-safe path. BookOrbit first builds an audio-free copy so the device does not have to download narration it cannot use, then converts that copy to KEPUB when your [Kobo settings](/kobo) allow it. The stripped edition keeps the text anchors that make precise progress translation possible.

To carry progress in both directions, enable **Two-way progress sync** in the Kobo settings and use the BookOrbit-delivered KEPUB. A manually sideloaded EPUB or a regular EPUB delivered without KEPUB conversion cannot provide the same precise Kobo position bridge.

The [KOReader catalog](/koreader-plugin) shows the normal EPUB as usual. A Storyteller edition appears as **Read Along (audio removed)**. When both editions would otherwise have the same filename, the derived edition receives a ` - Read Along.epub` suffix so it cannot overwrite the normal book. Install the current BookOrbit plugin and keep progress sync enabled on the device; the position returns to BookOrbit when KOReader performs its normal open, close, periodic, or manual sync.

## The audio-free copy is disposable

BookOrbit never removes audio from the EPUB in your library. A normal download of the Storyteller file still returns the full original EPUB3. Choose the explicitly labeled audio-free or KOReader download when you need a lighter edition.

When Kobo, KOReader, or that audio-free action requests the lighter edition, the server rebuilds the archive in temporary storage. It removes the embedded audio and playback overlays while preserving the text anchors used for position matching.

The temporary EPUB is deleted after delivery. If Kobo conversion is enabled, the resulting audio-free KEPUB may remain in BookOrbit's conversion cache so the next device download does not repeat the expensive conversion. The cache identity includes the source and BookOrbit's stripping version, so a changed source or a future stripping revision does not silently reuse an older result. The original Storyteller file remains untouched.

KOReader delivery fails closed: if BookOrbit cannot safely build the audio-free edition, it reports a download error instead of quietly sending the full audio archive. Kobo can fall back to the original Storyteller EPUB when rebuilding fails. That keeps the book downloadable, but it can produce a much larger device transfer, so investigate repeated rebuild failures in the server logs.

## Let the files prove they belong together

Open the book's **Details** tab and find **Read-aloud progress sync**. The setting belongs to the signed-in user, so another reader can make a different choice for the same book. BookOrbit enables the bridge automatically when it finds an EPUB with a usable media overlay, at least one standalone audio file, and complete duration metadata. Storyteller EPUB3 files are the usual source, but the capability is based on the EPUB media overlay rather than a Storyteller filename or label.

The two audio timelines must be close. BookOrbit adds the duration of every standalone audio file on the book in its stored track order, then compares that total with the selected media overlay. BookOrbit accepts a difference of up to 5 percent, capped at five minutes. A small difference is normal when one edition has a short lead-in or slightly different encoding. A larger difference usually means the audiobook is abridged, belongs to another edition, has missing or duplicate tracks, includes bonus audio, or is ordered incorrectly.

Keep one read-aloud EPUB on the book when possible. If several EPUBs contain media overlays, BookOrbit uses the primary one when it is eligible; otherwise it uses the first eligible file in the book's stored order. Removing that ambiguity makes both the status and any troubleshooting easier to understand. Remember that format priority still comes first: if your library places another format ahead of EPUB, that format can remain primary even though a read-aloud EPUB is present.

Primary selection controls the default file used for reading, downloads, and device delivery. It does not switch the progress bridge on or off by itself. BookOrbit can still find an eligible read-aloud EPUB for synchronization when a custom format priority makes another format primary, but keeping EPUB first gives every reading path the same canonical text map.

If the status says **Unavailable**, the message points to the part of the chain that is missing:

- No read-aloud EPUB means BookOrbit found no usable media overlay.
- No audio files means the standalone audiobook is absent.
- Missing duration means one or more audio files, or the overlay itself, could not be measured.
- A duration mismatch means the two narrations are too different to map safely.

Rescan or replace the incorrect file instead of forcing a questionable match. A wrong mapping is worse than keeping two honest, independent positions.

## When to turn sync off

Leave sync enabled when the standalone audiobook is the same narration embedded by Storyteller. Turn it off from the book's **Details** tab when the files tell different versions of the story: abridged and unabridged recordings, dramatizations, alternate translations, or editions with substantially different chapter order.

Disabling read-aloud sync does not remove files or erase their progress. It simply lets the audiobook and EPUB editions remember their own places for your account until you enable the bridge again.

## A comfortable long-term routine

Start with the Storyteller EPUB3, add the complete matching audiobook in the correct track order, and add the normal source EPUB only if you want a separate text-only copy. Let the next scan choose the read-aloud EPUB automatically, then confirm that its **Primary** badge is visible in the **Files** tab. Remove bonus or duplicate audio files, then check that read-aloud sync reports **Enabled**.

Open the Storyteller edition from the book's Read or Files menu and confirm that narration follows the text. For Kobo, enable two-way progress sync and download the BookOrbit KEPUB. For KOReader, install the current plugin, leave progress sync enabled, and download whichever of the clearly labeled normal and audio-free editions you want on the device.

From then on, choose the reader that suits the moment. BookOrbit keeps the original files in their proper roles and carries your place between them.
