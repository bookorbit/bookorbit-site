---
title: "Book Requests"
description: "Let people ask for books the library does not have, approve them, and fetch them from sources you choose."
---

Sooner or later someone asks you for a book you do not have. On a shared instance that conversation happens somewhere outside BookOrbit: a message, a note, a list on a fridge. You go looking, you find something, and three days later you cannot remember whether you ever told them.

**Requests** moves that conversation inside the app. Someone searches for a book, asks for it, and watches it arrive; you get a queue instead of a pile of messages. Once a request is approved, BookOrbit can fetch the book from sources you have chosen, hand it to a download client you already run, and file it in the right library, without anyone touching a file.

The important word there is *chosen*. BookOrbit ships with no sources of its own. Nothing is bundled, nothing is switched on, and until you add something the request queue is exactly what it says on the label: a list of books people would like. What you connect it to is your decision and your responsibility.

:::note
The page is still labelled **Requests (Beta)** in the app. It works end to end, but expect the odd rough edge.
:::

## Before you start

Two permissions decide how much of this feature a person sees.

**Request books** (`book_request_access`) is the floor: without it there is no Requests entry in the sidebar at all. With it, a person gets two tabs, one to ask for books and one to watch their own requests.

**Manage book requests** (`manage_book_requests`) turns the page into a moderation queue: the **All requests** tab, the approve and reject buttons, the release picker, and deleting a settled request for everybody.

Setting up the plumbing - sources, download clients, automation - needs **App settings** (`manage_app_settings`) instead, under **Settings > Server > Requests**: holding a tracker credential is a different level of trust from waving a request through.

Everything below works without a single source configured, right up to the moment a book has to be fetched. If you only want the social half, a queue of what people want that you satisfy by hand, you can stop reading after [Closing a request by hand](#closing-a-request-by-hand).

## Asking for a book

The **Request a book** tab searches metadata providers, not trackers. A requester asks for a *work* and never sees a tracker, a release name or a seeder count; picking the actual file is somebody else's job.

<img src="/images/book-requests/request-a-book.webp" alt="Request a book tab with search results grouped by work, each showing its cover, author, year and source count" class="img-bordered" />

Type a title, an author, or both, and pick the medium: **E-book**, **Audiobook**, or **Comic**. The medium matters more than it looks. Chosen before anything is searched, it decides which sources get asked, which release profile applies, and where the book lands when nobody picks a library. One request covers one medium; wanting the audiobook as well means a second request.

Results are grouped by work rather than listed per provider, so one book that four providers know about is one row saying **4 sources**, not four near-identical rows. Expanding a row shows what each provider returned: title, ISBN, year and language. A row already in your library says so instead of offering a button.

Two more controls sit next to the medium:

- **Request language** starts as your interface language, and a toggle beside it saves that choice for future requests. A release in a language the request ruled out is filtered out of the picker entirely.
- **Add to library** decides where the book is filed, and what you see here depends on who you are. That is the next section.

Press **Request** and it joins the queue. If somebody has already asked for the same book in the same medium, the button reads **Add me too**: rather than opening a second request, BookOrbit adds you to the existing one, and you are notified along with everyone else when it arrives.

### Where the book will go

Three things can decide where the book is filed, and the later one always wins:

1. The instance default for that medium, from **Settings > Server > Requests > Automation**, used when the requester names nowhere.
2. A library the requester picked on the request form.
3. A library the approver chose, which overrides whatever the request was carrying.

An ordinary requester can leave the select alone; it shows the instance default by name, or **Let the approver decide** when there is none. For anyone whose requests settle immediately - auto-approvers and self-servers, both below - it is not optional, because there is no later moment where anyone picks, and a request with nowhere to go is refused rather than created.

## Watching the queue

**My requests** is what a requester sees. **All requests** appears for moderators and shows everybody's, with filters for status, format, requester and fulfilment, plus a **Show dismissed** checkbox. The sidebar carries a count of what is still live: everybody's for a moderator, your own for everyone else.

<img src="/images/book-requests/my-requests.webp" alt="My requests table showing title, format, requester, age, state and outcome for each request" class="img-bordered" />

Two columns carry most of the meaning. **State** is the machine's answer: where the request has got to. **Outcome** is the human one: `Filed in Novels 2 hours ago`, `Looking for a release`, `Waiting for approval`.

The eleven states, in the order a healthy request passes through them:

| State | What it means |
|-------|---------------|
| **Pending** | Asked for, waiting on an approver. |
| **Approved** | Cleared, but no release has been picked yet. |
| **Searching** | Sources are being queried for a release. |
| **Grabbed** | A release was handed to a download client. |
| **Downloading** | The transfer is running. |
| **Importing** | The finished file is passing through the Book Dock. |
| **Needs review** | The imported file did not match the request closely enough, and is waiting in the Book Dock. |
| **Available** | Filed into the library. This is the end of the road. |
| **Rejected** | An approver said no. |
| **Cancelled** | The requester or an approver stopped it. |
| **Failed** | Something broke. Another release can still be tried. |

Sort by title, format, requester, age or state, and switch between **Comfortable** and **Compact** density. Clicking a row opens a drawer over the list rather than navigating away; inside it `J` and `K` walk through the queue, `A` approves, `Esc` closes.

Selecting rows reveals a bulk bar: a moderator can **Approve all** or **Reject all** the pending ones, with one shared reason for the rejection, and anybody can **Hide** settled ones from their own list.

### Cancel, dismiss, delete

Four actions that sound alike and are not:

- **Cancel** stops a request that is still running, and anyone waiting on it does not get the book. A transfer in flight is stopped: data already in the download client is kept, and partial direct-download staging is cleaned up.
- **Dismiss** hides a settled request from *your own* list; nobody else's view changes, and **Restore** puts it back.
- **Leave** is for someone who joined a request rather than making it. You stop following it and stop hearing about it; the request carries on.
- **Delete** removes the row for everyone, which is why it is a moderator action on a settled request only. Any torrent still seeding is removed from the download client with its files left in place.

## Approving

Open a pending request and the drawer offers **Approve** and **Reject**, both with an optional note the requester will see. Approving is also where a moderator can reroute the book to a different library, as long as it is one they can reach themselves.

Approving does not fetch anything by itself; a release still has to be chosen. With automatic downloads off, the request sits at **Approved** with `Looking for a release` in the outcome column and a **Find a release** button waiting for you.

### The release picker

This is where the tracker side of the world finally appears, and only for the person approving.

<img src="/images/book-requests/release-picker.webp" alt="Release picker showing three scored releases with sort controls and format and indexer facets" class="img-lg img-bordered" />

BookOrbit searches every enabled source in parallel, merges the answers into one list, and scores each release out of 100. The score is not a quality rating but a confidence rating, an answer to *is this the book that was asked for*:

| Contributes | Worth |
|-------------|-------|
| Title, author and ISBN match | up to 61 |
| Format: preferred, then merely usable, then unstated | 12 / 6 / 2 |
| A plausible file size for the medium | 10 |
| Seeders, saturating around 60 of them | up to 12 |
| Freeleech | 5 |
| An implausible size for the medium | -25 |
| More than a dozen files, so possibly a pack of books | -5 |

**Why this score** on any row breaks that down line by line. Since the match is worth more than everything else put together, a well-seeded release of the wrong book cannot climb over a thin one of the right book.

Some releases never reach the list. A seeder count of zero, a format not usable for the medium, or a language the request ruled out is filtered before scoring, and a line under the list says how many went that way. File count is deliberately *not* a filter: three formats of one title, or an audiobook in twelve parts, are ordinary packaging.

Above the list, sort by best match, seeders, size, bitrate or date, and narrow by format, source, language, file layout, audio, freeleech or **Hide VIP only**. Facets are counted from the results you actually got, so a chip that would leave nothing is not offered.

**Change search** reopens the query, because a request snapshot is not always the best one. Edit the title and authors, switch between the ISBNs on offer, one you type yourself, or a plain title-and-author search, adjust the language and formats, and search again. The line above the list says what each source was handed and what it returned.

**View files** reads a release's file list before you commit to it: one book in several formats, one book split into parts, an archive whose contents are unknown until it unpacks, or genuinely several separate books. The last case is fine - it downloads, and then BookOrbit asks which book to keep. A magnet link cannot be inspected this way, because its file list does not exist until a client fetches it from the swarm.

**Paste a link instead** skips the search for a magnet link or `.torrent` file you already have, and goes through the same pipeline as everything else.

If a release turns out badly, **Try another release** reopens the picker on a failed request without re-approving it. Releases that already failed are marked with the reason, so you do not walk into the same wall twice: a source that refused the file or did not answer, a release needing a VIP account, or a download client that would not take it.

## What happens after a grab

<img src="/images/book-requests/request-detail.webp" alt="Request detail drawer showing the progress strip, transfer summary, download client statistics and request metadata" class="img-md img-bordered" />

The **Progress** strip at the top of the drawer is the whole journey in five steps: **Asked**, **Approved**, **Release found**, **Downloading**, **Filed**. Under it, the transfer section names the release, the source, the client, and how the release was chosen: by an approver, automatically, or pasted by hand.

Behind those five steps:

1. The release goes to the highest-priority enabled download client, tagged with that client's category so BookOrbit only ever acts on its own downloads.
2. BookOrbit polls for progress. Nothing is moved while the transfer runs.
3. When it completes, the finished file is **hardlinked** into the Book Dock, so it occupies no extra disk and the torrent keeps seeding from where it was. Across filesystems a hardlink is impossible, and BookOrbit copies instead, which does use the space twice.
4. The Book Dock reads the file's title and author, so it can be named and filed correctly.
5. If import checking is on, the file is scored against the request. Anything clearing the threshold is filed into the destination library and the request goes to **Available**.
6. Everyone who asked for the book is notified.

Sources that hand over a plain file rather than a torrent - LibriVox, Project Gutenberg and similar - skip the download client entirely. BookOrbit fetches the file itself into a staging directory and joins the pipeline at step 4.

### When a request needs review

Step 5 guards against the thing that goes wrong most often: a release that says it is one book and is another. The check compares what landed against what was asked for - title, author, ISBN - and scores it out of 100.

This is a different question from the one the Book Dock's confidence column answers, which is whether the file's embedded metadata agrees with what providers returned for it. Ask for *Dune*, receive *Dune Messiah*, and both sides agree perfectly on *Dune Messiah*: high confidence, wrong book. The request check is what catches it.

Below the threshold, nothing is filed. The request moves to **Needs review**, the file waits in the Book Dock, and the drawer shows a **Why this is waiting** panel with the requested and imported values side by side and a verdict on each field. From there, **File it anyway** files it exactly as a passing score would have, and **Discard this import** clears the files out of the Book Dock and marks the request failed. Discarding leaves the torrent seeding; stop that separately if you want it gone.

The threshold is forgiving on purpose: subtitles, series suffixes and translated editions all cost points, and a false hold costs one click while a false pass puts the wrong book in somebody's library.

### Seeding

BookOrbit never stops a seed on its own. The source file is never moved or deleted, so a torrent keeps seeding indefinitely after the book is in your library.

Seed goals are not something you set on a source. Where a tracker's feed states a ratio or a time, that figure is passed to the download client at grab time and the client enforces it; otherwise your client's defaults apply. BookOrbit only reads the result back: the **Download client** section of the drawer shows state, ratio, seeding time and uploaded bytes, with a **Remove from client** action and an optional **Also delete the downloaded files** checkbox. Removing a torrent never touches the imported book.

### Closing a request by hand

None of the above is compulsory. A moderator can close any request against a book already in the library, or a file already sitting in the Book Dock, by searching for it from the request drawer. The requester is notified exactly as they would be if BookOrbit had fetched it. This is the whole workflow for an instance that has no sources and wants none.

## Setting up the plumbing

Everything from here is **Settings > Server > Requests**, and needs the **App settings** permission.

### Sources

<img src="/images/book-requests/settings-sources.webp" alt="Sources tab listing installed plugins and Torznab indexers with their connection status" class="img-bordered" />

There are two kinds of source.

**Torrent indexers** speak Torznab, the protocol Prowlarr, Jackett and NZBHydra all expose. It is generic and names no site, which is why it is the one indexer type built into BookOrbit. Add one row per feed you want searched, with its URL and API key.

**Plugins** are single files that teach BookOrbit to search one specific site. None ship with BookOrbit. **Install plugin** uploads one, and the review dialog shows what the file declares about itself and the code it will run before you agree to anything. A plugin starts working as soon as it is installed; you are only asked to restart if it will not load in the running process.

:::caution
A plugin runs inside the BookOrbit process with that process's access: your database, your library files, your encryption key. Install one only from a source you trust, and read it first.
:::

Either way, a source is a row you configure and switch on.

<img src="/images/book-requests/source-editor.webp" alt="Source editor for a LibriVox plugin showing name, color, base URL and availability" class="img-md img-bordered" />

| Setting | What it does |
|---------|--------------|
| **Color** | Marks this source on every release it returns, so you can tell where a result came from before reading the name. Torrent and direct download keep their own two colors. |
| **Search this source for** | Turn off a medium the source does not carry. An audiobook-only tracker behind a general proxy still claims to carry everything, and asking it for ebooks costs a request per search. |
| **Search by ISBN** | On by default. Turn it off where a catalogue answers an exact ISBN with the wrong book; the source then gets the title and author instead. |
| **Categories** | For Torznab, the indexer's own category numbers to search per medium. |
| **Allow private addresses** | Off by default. Needed only when the source runs on your own network, such as a local Jackett. |
| **Advanced network** | Per-source DNS servers and an HTTP proxy, for when the default path to a site does not work. |

Credentials are stored encrypted, which needs `BOOK_REQUEST_ENCRYPTION_KEY` in the server environment. Without it, saving one is refused rather than stored in the clear:

```bash
openssl rand -hex 32
```

**Test connection** tells you whether a source answers, and the result is stamped on the row. A source that keeps failing *real* searches is flagged separately, with the length of the run: a test call can succeed against a tracker that has refused every search for a week.

### Download clients

<img src="/images/book-requests/settings-download-clients.webp" alt="Download clients tab showing qBittorrent, Transmission and Deluge each connected" class="img-bordered" />

qBittorrent, Transmission and Deluge are supported. Direct HTTP downloads need no client, so you only need one of these if you use torrent sources.

<img src="/images/book-requests/download-client-editor.webp" alt="Download client editor showing connection fields, category, hardlink toggle and path mappings" class="img-md img-bordered" />

Three settings are worth understanding first:

**Category** tags every torrent BookOrbit adds, so it only ever acts on its own downloads. Transmission has no categories, so the category becomes a subfolder of its download directory instead; Deluge needs its Label plugin switched on.

**Use hardlinks** is on by default, and is what lets a torrent keep seeding while the book sits in your library without storing it twice. It only works when the client's download folder and the Book Dock are on the same filesystem, and **Test hardlink** answers that rather than leaving you to find out later.

**Path mappings** translate the paths the client reports into paths BookOrbit can open, and at least one is required: the mapping also declares the directory BookOrbit may import from. When both see the same files at the same paths, map the download directory to itself.

### Automation

<img src="/images/book-requests/settings-automation.webp" alt="Automation tab showing the automatic downloads group switched off and import checks switched on" class="img-bordered" />

**Automatic downloads** is off by default, for a plain reason: matching a book to the right release is hard, and a person is usually the better judge. Left off, every approved request waits for someone to open the picker.

Switch it on and an approved request sends its highest-scoring release straight to the download client, as long as it clears the **Minimum release score** (default 80, floor 50). **Try the next release after a failure** falls through to the runner-up, bounded by **Attempts per request** (default 3). Retries only ever apply to releases BookOrbit chose itself; one an approver picked by hand stays failed and waits for them.

**Keep looking for requests nothing was found for** covers the one hole the rest of the pipeline has no answer to: a request is searched for once, when it is approved, so a book that is not out yet sits at **Approved** forever. Switch this on and BookOrbit checks again on its own. **Search again after** sets the base interval (default 24 hours), which doubles for each week a request has been waiting, up to eight times that figure; **Stop looking after** (default 60 days) is where it gives up and leaves the request to a person. It does nothing while automatic downloads are off.

When automation cannot proceed it hands the request back with a reason rather than stalling silently: nothing scored high enough, nothing matched your release profile, everything good enough has been tried, no source was searched at all, or there is nowhere to file the book. Whoever is responsible for the request is notified.

**Import checks** is the verification pass described earlier, on by default with a threshold of 70. Off, every download is filed as soon as its title and author have been read, and a mislabelled release lands in your library without warning.

#### Default destinations

<img src="/images/book-requests/settings-default-destinations.webp" alt="Default destinations showing a library and folder for each of e-book, audiobook and comic" class="img-bordered" />

One default per medium, because the medium is the only thing known about a file before anything is searched. A library picked on the request form, or chosen at approval, always wins over these. They start unset: guessing which of your libraries holds audiobooks is how a book ends up somewhere nobody looks.

#### Release profiles

<img src="/images/book-requests/settings-release-profiles.webp" alt="Release profiles showing an e-book tier and an audiobook tier with format, file layout and seeder conditions" class="img-bordered" />

A profile describes the edition you want, best first. A release is matched against your tiers top to bottom and takes the first one it fits.

This is a separate axis from the score: the score asks *is this the right book*, a profile asks *is this the edition I want*. A release matching no tier is never downloaded automatically, though it still appears in the picker for you to send by hand. Leave a medium empty - which is how it ships - and nothing is filtered or refused; releases rank by score alone.

Each tier can require formats, a file layout, a seeder floor, a size ceiling, languages, particular sources, freeleech, and no VIP-only releases; audio tiers add a minimum bitrate and a channel count. A bitrate floor narrows less than it looks: most sources measure very few of their releases, and an unmeasured one is not turned away.

#### Import formats

<img src="/images/book-requests/settings-import-formats.webp" alt="Import formats offering All available or Preferred only" class="img-bordered" />

What to keep when one release carries the same book in more than one format, an EPUB and a PDF together for instance. **All available** keeps everything; **Preferred only** keeps the format highest in the destination library's format priority. Neither applies to a multipart audiobook, whose parts are one book rather than competing editions.

## Downloading without asking

**Download books directly** (`book_request_self_fulfill`) gives a trusted user the whole pipeline with no approver in it: they search, pick the release themselves, and it downloads.

For those users the search results say **Download** rather than **Request**, and pressing it goes straight to the release picker. The button also carries a menu of editions: BookOrbit recommends one to search for, preferring the requested language and an ISBN several providers agree on, and you can pick a different edition's ISBN or skip the ISBN entirely. When no provider knows the book at all, the empty state offers to search the indexers for the typed text directly. That last one is self-servers only, because a request row carrying nothing but a typed string gives an approver no way to tell whether it is the book that was meant.

Self-served requests still create a real row, so the history is visible and everything downstream works the same way. They appear in **All requests** with a **Self-served** badge, and when one goes wrong the people on that request are notified rather than every moderator. What bounds them is work in flight: ten can be open at once, because every live one is a release search against every enabled source. A picker opened and never acted on is swept after six hours, so an abandoned search does not keep its claim on a book nobody is fetching.

**Auto-approve requests** (`book_request_auto_approve`) is a lighter version: requests are created already approved, but a release is still picked the normal way.

Both need **Request books** to be useful, and BookOrbit enforces that for **Download books directly** when permissions are assigned rather than implying it at check time.

## Notifications

Requests use the normal notification system, under a **Book requests** category each user can turn on or off.

| Event | Who hears about it |
|-------|--------------------|
| A request is submitted | Everyone with **Manage book requests** |
| A request is approved or rejected | The requester and everyone who joined it |
| The book becomes available | The requester and everyone who joined it |
| A request needs review, needs a release picked, or failed | Moderators, or the requester and everyone who joined it for a self-served request |

:::note
Notification text is written once per event in English, not per recipient. Every other user-facing string in BookOrbit is translated.
:::

## Permissions reference

| Permission | What it allows |
|------------|----------------|
| **Request books** (`book_request_access`) | See the Requests page, search, ask for books, watch your own requests. |
| **Manage book requests** (`manage_book_requests`) | See every request, approve and reject, pick releases, close requests by hand, delete settled requests. |
| **Auto-approve requests** (`book_request_auto_approve`) | Your own requests are created already approved. |
| **Download books directly** (`book_request_self_fulfill`) | Pick a release and download it yourself, with no approval step. Requires **Request books**. |
| **App settings** (`manage_app_settings`) | Configure sources, download clients and automation under Settings > Server > Requests. |

Every action on a request is audited: created, approved, rejected, cancelled, grabbed, imported, fulfilled, deleted, and torrents removed from a client.

## Troubleshooting

### The Requests page is not in my sidebar

Grant **Request books**; nothing about this feature is visible without it.

### Nothing happens when a request is approved

Automatic downloads are off by default, which is the intended state: the request waits at **Approved** with a **Find a release** button. To turn automation on, see **Settings > Server > Requests > Automation**.

### The release picker finds nothing

Check that at least one source is enabled, answers **Test connection**, and is set to be searched for this medium. If the picker says no source carries this kind of book, none of your enabled sources cover that medium.

### A credential will not save

`BOOK_REQUEST_ENCRYPTION_KEY` is not set on the server, and credentials are refused rather than stored in the clear. If it was set and later changed, stored credentials cannot be read and must be re-entered.

### A source will not connect on my own network

Turn on **Allow private addresses** for that source. It is off by default, and needed only when the source runs on your local network or the same machine, such as Jackett.

### A download client will not save

Every client needs at least one path mapping, because that declares the directory BookOrbit may import from. If both see the same paths, map the download directory to itself.

### Downloads finish but nothing lands in the library

Check import checks first: the request is probably at **Needs review**, with the file waiting in the Book Dock and a panel explaining why. A request with no destination library is refused before downloading, and says so.

### Imports use twice the disk

The download folder and the Book Dock are on different filesystems, so hardlinking is impossible and BookOrbit copies. **Test hardlink** in the client editor confirms it.

### BookOrbit cannot see the finished file

The client is reporting paths BookOrbit cannot open, which usually means the two run in separate containers. Add a path mapping for them.

### A release keeps failing

Open the request and use **Try another release**. Releases that already failed for it are marked with the reason, so you can pick a different one.

### Someone requested a book we already have

Rows already in the library say so instead of offering a button, but that check depends on matching metadata. Close the request against the existing book from the request drawer.

### A request cannot be deleted

Deleting is a moderator action on a settled request only: rejected, cancelled, available or failed. Cancel it first if it is still running.
