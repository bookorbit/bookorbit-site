---
title: "Book Requests"
description: "Let people ask for books the library does not have, approve them, and fetch them from sources you choose."
---

Sooner or later someone asks you for a book you do not have. On a shared instance that conversation happens somewhere outside BookOrbit: a message, a note, a list on a fridge. You go looking, you find something, you drop it in the Book Dock, and three days later you cannot remember whether you ever told them.

**Requests** moves that whole conversation inside the app. Someone searches for a book, asks for it, and can watch it arrive. You see a queue instead of a pile of messages. And once a request is approved, BookOrbit can go and fetch the book from sources you have chosen, hand it to a download client you already run, and file it in the right library with the right name, without anyone touching a file.

The important word there is *chosen*. BookOrbit ships with no sources of its own. Nothing is bundled, nothing is switched on, and until you add something the request queue is exactly what it says on the label: a list of books people would like. What you connect it to, and what those sources index, is your decision and your responsibility.

## Before you start

Two things decide how much of this feature a person sees.

The first is the **Request books** permission (`book_request_access`). Without it there is no Requests entry in the sidebar at all. With it, a person gets two tabs: one to ask for books, one to watch their own requests.

The second is **Manage book requests** (`manage_book_requests`), which turns the page into a moderation queue. It adds the **All requests** tab, the approve and reject buttons, the release picker, and the ability to delete a settled request for everybody.

Setting up the plumbing - sources, download clients, automation - is a third, separate thing. It lives under **Settings > Server > Requests** and needs **App settings** (`manage_app_settings`), not **Manage book requests**. Holding a tracker credential is a different level of trust from waving a request through, so the two are kept apart.

Everything below works without a single source configured, right up to the moment a book has to actually be fetched. If you only want the social half - a queue of what people want, which you satisfy by hand - you can stop reading after [Closing a request by hand](#closing-a-request-by-hand).

## Asking for a book

The **Request a book** tab searches metadata providers, not trackers. That is deliberate: a requester asks for a *work*, and never sees a tracker, a release name, or a seeder count. Picking the actual file is somebody else's job.

<img src="/images/book-requests/request-a-book.webp" alt="Request a book tab with search results grouped by work, each showing its cover, author, year and source count" class="img-bordered" />

Type a title, an author, or both, and pick the medium: **E-book**, **Audiobook**, or **Comic**. The medium matters more than it looks. It is chosen before anything is searched, so it decides which sources get asked, which release profile applies, and - if nobody picks a library - where the book eventually lands. One request covers one medium; wanting the audiobook as well means a second request.

Results are grouped by work rather than listed per provider, so one book that four providers know about is one row saying **4 sources**, not four near-identical rows. A row already in your library says so instead of offering a button.

Two more controls sit next to the medium:

- **Language** starts as your interface language. The pin button beside it saves your choice for every future request, so a reader who wants German editions asks once rather than every time. A release in a language the request explicitly asked for something else in is filtered out of the picker entirely.
- **Add to library** decides where the book is filed. What you see here depends on who you are, and that is covered in the next section.

Press **Request** and it joins the queue. If somebody has already asked for the same book in the same medium, the button reads **Add me too** instead: rather than opening a second request, BookOrbit adds you to the existing one, and you are notified along with everyone else when it arrives.

### Where the book will go

Three things can decide where the book is filed, and the later one always wins:

1. The instance default for that medium, from **Settings > Server > Requests > Automation**, applied when the requester names nowhere.
2. A library the requester picked on the request form.
3. A library the approver chose when approving, which overrides whatever the request was carrying.

For an ordinary requester the select can be left alone; it shows either the instance default by name, or **Let the approver decide** when there is no default. For anyone whose requests settle immediately - auto-approvers and self-servers, both below - the select is not optional, because there is no later moment where anyone picks. If no destination is set anywhere, the request is refused with a message saying so rather than being created with nowhere to go.

## Watching the queue

**My requests** is what a requester sees. **All requests** appears for moderators and shows everybody's, with filters for status, format and requester, and a **Show dismissed** checkbox.

<img src="/images/book-requests/my-requests.webp" alt="My requests table showing title, format, requester, age, state and outcome for each request" class="img-bordered" />

Two columns carry most of the meaning. **State** is the machine's answer: where the request has got to. **Outcome** is the human one: `Filed in Novels 2 hours ago`, `Looking for a release`, `Waiting for approval`. Between them you can read a queue of forty rows without opening any of them.

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

Sort by title, format, requester, age or state, switch between **Comfortable** and **Compact** density, and filter by status. Clicking a row opens a drawer over the list rather than navigating away, and `J` and `K` walk through the queue inside it, `A` approves, `Esc` closes. On a long queue that is the difference between forty page loads and forty keystrokes.

Selecting rows with the checkboxes reveals a bulk bar. A moderator can **Approve all** the pending ones; anybody can **Hide** settled ones from their own list.

### Cancel, dismiss, delete

Three actions that sound alike and are not:

- **Cancel** stops a request that is still running. It moves to cancelled, and anyone waiting on it does not get the book. If a transfer is in flight it is stopped: data already in the download client is kept, and any partial direct-download staging is cleaned up.
- **Dismiss** hides a settled request from *your own* list. Nobody else's view changes. **Restore** puts it back.
- **Delete** removes the row for everyone, which is why it is a moderator action on a settled request only. Any torrent still seeding is removed from the download client with its files left in place.

## Approving

Open a pending request and the drawer offers **Approve** and **Reject**, both with an optional note that the requester will see. Approving is also where a moderator can reroute the book to a different library, as long as it is one they can reach themselves.

Approving does not fetch anything by itself. It marks the request as cleared and moves it to the next stage, where a release still has to be chosen. What happens then depends on whether you have turned on automatic downloads: with them off, the request sits at **Approved** with `Looking for a release` in the outcome column and a **Find a release** button waiting for you.

### The release picker

This is where the tracker side of the world finally appears, and only for the person approving.

<img src="/images/book-requests/release-picker.webp" alt="Release picker showing three scored releases with sort controls and format and indexer facets" class="img-lg img-bordered" />

BookOrbit searches every enabled source in parallel, merges the answers into one list, and scores each release out of 100. The score is not a quality rating; it is a confidence rating, an answer to *is this the book that was asked for*:

| Contributes | Worth |
|-------------|-------|
| Title, author and ISBN match | up to 61 |
| Format: preferred, then merely usable, then unstated | 12 / 6 / 2 |
| A plausible file size for the medium | 10 |
| Seeders, saturating around 60 of them | up to 12 |
| Freeleech | 5 |
| An implausible size for the medium | -25 |
| More than a dozen files, so possibly a pack of books | -5 |

**Why this score** on any row breaks that down line by line. Since the match is worth more than everything else put together, a well-seeded release of the wrong book cannot climb over a thin one of the right book. The weights sum to 100, but freeleech is 5 of them, so an otherwise flawless release that is not freeleech tops out at 95.

Some releases never reach the list at all. A release with an indexer-reported seeder count of zero, a format that is not usable for the requested medium, or a stated language the request explicitly ruled out is filtered out before scoring, and a line under the list says how many went that way. File count is deliberately *not* a filter: three formats of one title, or an audiobook in twelve parts, are ordinary packaging.

Above the list, sort by best match, seeders, size, bitrate or date, and narrow by format, indexer, language or freeleech. The facets are counted from the results you actually got, so a chip that would leave nothing is not offered.

**View files** on a row reads the release's file list before you commit to it. That tells you whether you are looking at one book in several formats, one book split into parts, an archive whose contents are not known until it unpacks, or genuinely several separate books. The last case is fine: it downloads, and then BookOrbit asks which book to keep. A magnet link cannot be inspected this way, because its file list does not exist until a client fetches it from the swarm.

**Paste a link instead** skips the search entirely for a magnet link or a `.torrent` file you already have. It goes through the same pipeline as everything else.

If a release turns out badly, **Try another release** reopens the picker on a failed request without re-approving it. Releases that already failed for this request are marked so you do not walk into the same wall twice, along with the reason: a source that refused the file, a source that did not answer, a release needing a VIP account, or a download client that would not take it.

## What happens after a grab

<img src="/images/book-requests/request-detail.webp" alt="Request detail drawer showing the progress strip, transfer summary, download client statistics and request metadata" class="img-md img-bordered" />

The **Progress** strip at the top of the drawer is the whole journey in five steps: **Asked**, **Approved**, **Release found**, **Downloading**, **Filed**. Under it, the transfer section names the release, the source, the client, and how the release was chosen - picked by an approver, grabbed automatically, or pasted by hand.

Behind those five steps, a lot happens:

1. The release goes to the highest-priority enabled download client, tagged with that client's category so BookOrbit only ever acts on its own downloads.
2. BookOrbit polls the client for progress. Nothing is moved while the transfer runs.
3. When it completes, the finished file is **hardlinked** into the Book Dock, so it occupies no extra disk and the torrent keeps seeding from exactly where it was. If the download folder and the Book Dock are on different filesystems, a hardlink is impossible and BookOrbit copies instead, which does use the space twice.
4. The Book Dock reads the file's title and author, so it can be named and filed correctly.
5. If import checking is on, the file is scored against the request. Anything that clears the threshold is filed into the destination library and the request goes to **Available**.
6. Everyone who asked for the book is notified.

Sources that hand over a plain file rather than a torrent - LibriVox, Project Gutenberg and similar - skip the download client entirely. BookOrbit fetches the file itself into a staging directory and joins the same pipeline at step 4. No torrent client is needed for those at all.

### When a request needs review

Step 5 is the guard against the thing that goes wrong most often: a release that says it is one book and is actually another. The check compares what landed against what was asked for - title, author, ISBN - and scores it out of 100.

This is a different question from the one the Book Dock's own confidence column answers. That column measures whether the file's embedded metadata agrees with what providers returned for it. Ask for *Dune*, receive *Dune Messiah*, and both sides agree perfectly on *Dune Messiah*: high confidence, wrong book. The request check is the one that catches it.

Below the threshold, nothing is filed. The request moves to **Needs review**, the file waits in the Book Dock, and the drawer shows a **Why this is waiting** panel with the requested and imported values side by side and a verdict on each field. From there you can **File it anyway**, which files it into the destination library exactly as a passing score would have, or open the Book Dock and deal with it there.

The threshold is forgiving on purpose. Subtitles, series suffixes and translated editions all cost points, and a false hold costs one click while a false pass puts the wrong book in somebody's library.

### Seeding

BookOrbit never stops a seed on its own. The source file is never moved or deleted, so a torrent keeps seeding indefinitely after the book is in your library.

Seed goals are not something you set on a source. Where a tracker's feed states a ratio or a time, that figure is passed to the download client at grab time and the client enforces it; where it states neither, your client's own defaults apply. BookOrbit only reads the result back. The **Download client** section of the drawer shows the state, ratio, seeding time and uploaded bytes, with a **Remove from client** action and an optional **Also delete the downloaded files** checkbox. Removing a torrent never touches the imported book.

### Closing a request by hand

None of the above is compulsory. A moderator can close any request against a book that is already in the library, or a file already sitting in the Book Dock, by searching for it from the request drawer. The requester is notified exactly as they would be if BookOrbit had fetched it. This is the whole workflow for an instance that has no sources configured and does not want any.

## Setting up the plumbing

Everything from here is **Settings > Server > Requests**, and needs the **App settings** permission.

### Sources

<img src="/images/book-requests/settings-sources.webp" alt="Sources tab listing installed plugins and Torznab indexers with their connection status" class="img-bordered" />

There are two kinds of source, and the difference matters.

**Torrent indexers** speak Torznab, which is the protocol Prowlarr, Jackett and NZBHydra all expose. Torznab is generic and names no site, which is why it is the one indexer type built into BookOrbit. Add one row per Torznab feed you want searched, with its feed URL and API key.

**Plugins** are single files that teach BookOrbit to search one specific site. None ship with BookOrbit. **Install plugin** uploads one, and the review dialog shows you what the file declares about itself and the code it will run before you agree to anything.

:::caution
A plugin runs inside the BookOrbit process with that process's access: your database, your library files, your encryption key. Install one only from a source you trust, and read it first. Installing, updating or removing a plugin needs a restart to take effect.
:::

Either way, a source is a row you configure and switch on.

<img src="/images/book-requests/source-editor.webp" alt="Source editor for a LibriVox plugin showing name, color, base URL and availability" class="img-md img-bordered" />

| Setting | What it does |
|---------|--------------|
| **Color** | Marks this source on every release it returns, so you can tell where a result came from before reading the name. Torrent and direct download keep their own two colors, which is why neither is offered here. |
| **Search this source for** | Turn off a medium the source does not carry. An audiobook-only tracker behind a general proxy still claims to carry everything, and asking it for ebooks costs a request on every search. |
| **Categories** | For Torznab, the indexer's own category numbers to search per medium. |
| **Allow private addresses** | Off by default. Needed only when the source runs on your own network, such as a local Jackett. |
| **Advanced network** | Per-source DNS servers and an HTTP proxy, for when the default path to a site does not work. |

Credentials are stored encrypted, which requires `BOOK_REQUEST_ENCRYPTION_KEY` in the server environment. Without it, saving a credential is refused rather than stored in the clear:

```bash
openssl rand -hex 32
```

**Test connection** on any row tells you whether the source answers, and the result is stamped on the row so you can see at a glance which of your sources went quiet last week.

### Download clients

<img src="/images/book-requests/settings-download-clients.webp" alt="Download clients tab showing qBittorrent, Transmission and Deluge each connected" class="img-bordered" />

qBittorrent, Transmission and Deluge are supported. Direct HTTP downloads work with no client at all, so you only need one of these if you use torrent sources.

<img src="/images/book-requests/download-client-editor.webp" alt="Download client editor showing connection fields, category, hardlink toggle and path mappings" class="img-md img-bordered" />

Three settings are worth understanding before you save:

**Category** tags every torrent BookOrbit adds, so it only ever acts on its own downloads and leaves the rest of your client alone. Transmission has no categories, so the category becomes a subfolder of its download directory instead. Deluge needs its Label plugin switched on.

**Use hardlinks** is on by default and is what lets a torrent keep seeding while the book sits in your library, without storing it twice. It only works when the client's download folder and the Book Dock are on the same filesystem. **Test hardlink** answers that question directly rather than leaving you to find out later.

**Path mappings** translate the paths the client reports into paths BookOrbit can open. You need them when the two run in separate containers and see the same files at different paths, and not otherwise.

### Automation

<img src="/images/book-requests/settings-automation.webp" alt="Automation tab showing the automatic downloads group switched off and import checks switched on" class="img-bordered" />

**Automatic downloads** is off by default, and the reason is worth stating plainly: matching a book to the right release is hard, and a person is usually the better judge. Left off, every approved request waits for someone to open the picker.

Switch it on and an approved request sends its highest-scoring release straight to the download client, as long as that release clears the **Minimum release score** (default 80, floor 50). **Try the next release after a failure** falls through to the runner-up when an automatic attempt fails, bounded by **Attempts per request** (default 3). Retries only ever apply to releases BookOrbit chose itself; one an approver picked by hand stays failed and waits for them.

When automation cannot proceed it hands the request back with a reason rather than stalling silently: nothing scored high enough, nothing matched your release profile, everything good enough has already been tried, or automatic grabbing is simply off. Whoever is responsible for the request is notified.

**Import checks** is the verification pass described earlier, on by default with a threshold of 70. Turning it off means every download is filed as soon as its title and author have been read, and a mislabelled release lands in your library without warning.

#### Default destinations

<img src="/images/book-requests/settings-default-destinations.webp" alt="Default destinations showing a library and folder for each of e-book, audiobook and comic" class="img-bordered" />

One default per medium, because the medium is the only thing known about a file before anything is searched. A library picked on the request form, or one chosen at approval, is always used ahead of these. They start unset: guessing which of your libraries holds audiobooks is how a book ends up somewhere nobody looks.

#### Release profiles

<img src="/images/book-requests/settings-release-profiles.webp" alt="Release profiles showing an e-book tier and an audiobook tier with format, file layout and seeder conditions" class="img-bordered" />

A profile describes the edition you want, best first. A release is matched against your tiers top to bottom and takes the first one it fits.

This is a separate axis from the score. The score asks *is this the right book*; a profile asks *is this the edition I want*. A release matching no tier is never downloaded automatically, though it still appears in the picker for you to send by hand. Leave a medium empty - which is how it ships - and nothing is filtered or refused; releases rank by score alone.

Each tier can require formats, a file layout, a seeder floor, freeleech, and for audiobooks a minimum bitrate. Note that a bitrate floor narrows less than it looks: most sources measure very few of their releases, and an unmeasured release is not turned away.

#### Import formats

<img src="/images/book-requests/settings-import-formats.webp" alt="Import formats offering All available or Preferred only" class="img-bordered" />

What to keep when one release carries the same book in more than one format, an EPUB and a PDF together for instance. **All available** keeps everything the release carried; **Preferred only** keeps the format highest in the destination library's format priority. Neither applies to a multipart audiobook, whose parts are one book rather than competing editions.

## Downloading without asking

There is one more shape this feature takes. **Download books directly** (`book_request_self_fulfill`) gives a trusted user the whole pipeline with no approver in it: they search, they pick the release themselves, and it downloads.

For those users the search results say **Download** rather than **Request**, and pressing it goes straight to the release picker. They also get an escape hatch the ordinary form does not offer: when no metadata provider knows about the book at all, the empty state offers to search the indexers for the typed text directly. That option exists only for self-servers, because a request row carrying nothing but a typed string gives an approver no way to tell whether it is the book that was meant.

Self-served requests still create a real row, so the whole history is visible and everything downstream works the same way. They appear in **All requests** with a **Self-served** badge, and when one goes wrong the people on that request are notified rather than every moderator - it was never their queue item. What bounds them is work in flight: ten self-served requests can be open at once, because every live one is a release search against every enabled source.

A related permission, **Auto-approve requests** (`book_request_auto_approve`), is a lighter version: requests are created already approved, but a release is still picked the normal way.

**Download books directly** requires **Request books**, and BookOrbit enforces that when permissions are assigned rather than quietly implying it at check time. **Auto-approve requests** carries no such dependency, but it does nothing on its own: without **Request books** there is no Requests page to make a request from.

## Notifications

Requests hook into the normal notification system under the **Book requests** category, which each user can turn on or off in their own notification preferences.

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

Every action on a request is written to the audit log: created, approved, rejected, cancelled, grabbed, imported, fulfilled, deleted, and torrents removed from a client.

## Troubleshooting

### The Requests page is not in my sidebar

Grant **Request books**. Nothing about this feature is visible without it.

### Nothing happens when a request is approved

Automatic downloads are off by default, which is the intended state. The request waits at **Approved** with a **Find a release** button. If you meant to turn automation on, it is under **Settings > Server > Requests > Automation**.

### The release picker finds nothing

Check that at least one source is enabled and answers **Test connection**, and that it is set to be searched for this medium. If the picker says no source carries this kind of book, none of your enabled sources cover that medium at all.

### A credential will not save

`BOOK_REQUEST_ENCRYPTION_KEY` is not set on the server. Credentials are refused rather than stored in the clear. If it was set and later changed, previously stored credentials cannot be read and must be re-entered.

### A source will not connect on my own network

Turn on **Allow private addresses** for that source. It is off by default, and needed only when the source runs on your local network or the same machine, such as a Jackett instance.

### Downloads finish but nothing lands in the library

Check import checks first: the request is probably at **Needs review**, with the file waiting in the Book Dock and a comparison panel explaining why. If the request has no destination library, grab refuses before downloading and says so.

### Imports use twice the disk

The download folder and the Book Dock are on different filesystems, so hardlinking is impossible and BookOrbit is copying. **Test hardlink** in the download client editor confirms it.

### BookOrbit cannot see the finished file

The download client is reporting paths BookOrbit cannot open, which usually means the two run in separate containers. Add a path mapping.

### A release keeps failing

Open the request and use **Try another release**. Releases that already failed for this request are marked with the reason, so you can pick a different one rather than retrying the same wall.

### Someone requested a book we already have

Rows already in the library say so instead of offering a button, but the check depends on matching metadata. Close the request against the existing book from the request drawer.

### A request cannot be deleted

Deleting is a moderator action on a settled request only: rejected, cancelled, available or failed. Cancel it first if it is still running.
