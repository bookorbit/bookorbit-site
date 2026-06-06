# Hardcover Sync

Hardcover sync sends your BookOrbit reading state to Hardcover: status, progress, reading dates, rating, and privacy. It works best after each book has a reliable Hardcover match, because BookOrbit must know which Hardcover record to update before it can push anything.

Think of the integration in two passes. First, connect the user account and decide which changes should trigger sync. Then make sure the books you care about can be matched to Hardcover, ideally by saving a verified Hardcover provider ID in metadata.

## Setup Flow

For a predictable first sync, set up the user before tuning book matches.

### Allow the user to sync

Give the BookOrbit user the `hardcover_sync` permission.

<img src="/images/hardcover/permission-hardcover-sync.webp" alt="User permission editor with Hardcover sync enabled" class="img-md img-bordered" />

This permission opens the Hardcover settings page and allows that user to call the sync endpoints. It does not connect their Hardcover account by itself.

### Connect the Hardcover account

Open **Settings > Integrations > Hardcover**, paste the user's Hardcover API token, and save.

<img src="/images/hardcover/settings-connection.webp" alt="Hardcover connection settings with a configured account" class="img-lg img-bordered" />

The API token belongs to the BookOrbit user, not the server. Each user who wants Hardcover sync needs their own token.

### Keep sync enabled

Leave **Enable sync** on, then keep the trigger toggles on for the changes you want BookOrbit to push.

<img src="/images/hardcover/sync-options.webp" alt="Hardcover sync options for status, progress, rating, and privacy" class="img-lg img-bordered" />

BookOrbit needs all of these before background sync can run:

| Requirement | Why it matters |
|-------------|----------------|
| `hardcover_sync` permission | Opens the Hardcover settings page and allows sync endpoints for that user. |
| API token | Lets BookOrbit call Hardcover on the user's behalf. |
| **Enable sync** | Pauses or resumes this user's Hardcover integration without deleting the token. |
| At least one trigger toggle | Allows automatic sync for status, progress, or rating changes. |

If the user loses the permission, is disabled, disconnects Hardcover, or turns off **Enable sync**, background sync stops. The token stays private and is never shown back in the UI.

Once those account settings are in place, the rest of setup is about book identity: clean up Hardcover matches for the books you expect to sync, then run **Manual sync** once to reconcile existing reading data.

## Matching Comes First

Before BookOrbit can sync a book, it has to find the matching Hardcover book. The best metadata anchor is a saved **Hardcover provider ID** from a result you have verified. It is highly recommended for books you actively track, especially when a title has many editions, missing ISBNs, alternate subtitles, or similar author names.

BookOrbit tries matches in this order:

1. A cached previous Hardcover match.
2. The book's saved Hardcover ID when it can be used directly.
3. ISBN-13.
4. ISBN-10.
5. Title plus author.

ISBN and title matching are useful fallbacks, but they are still guesses. Choosing the correct Hardcover result through metadata search gives BookOrbit the best identity data to work from, including the provider ID and edition metadata.

### Getting the Hardcover ID

Use the normal metadata workflow:

1. Open the book.
2. Go to **Edit Metadata**.
3. Click **Search online**.
4. Filter to or select the correct Hardcover result.
5. Apply the result to the form, or copy only the Hardcover provider ID.
6. Save the book.

<img src="/images/book-details/metadata-search.webp" alt="Metadata search drawer with Hardcover results available beside other providers" class="img-lg img-bordered" />

The edit form stores provider IDs with the rest of the metadata. Once the Hardcover provider ID is saved, future syncs have a stronger match anchor before they fall back to ISBN or title matching.

<img src="/images/book-details/edit-metadata.webp" alt="Book metadata editor with provider ID fields including Hardcover" class="img-lg img-bordered" />

::: tip
If a book already failed with `no_match`, save the correct Hardcover provider ID from metadata search and sync again. BookOrbit treats the changed metadata as meaningful and retries the match.
:::

## What Syncs

Only books that are not `Unread` are eligible. This keeps untouched library inventory from creating Hardcover entries.

| BookOrbit data | Hardcover update |
|----------------|------------------|
| Read status | Maps BookOrbit reading states such as Reading, Want to Read, Finished, Paused, and DNF to Hardcover statuses. |
| Progress | Converts BookOrbit percentage to Hardcover progress pages when the matched edition has a page count. |
| Reading dates | Sends started and finished dates when BookOrbit has them. |
| Rating | Sends the user's star rating. |
| Privacy | Uses the privacy choice saved in Hardcover settings. |

Progress needs both a matched Hardcover book and an edition page count. If BookOrbit can match the book but Hardcover does not provide pages for the edition, the rest of the sync can still run, but progress remains pending until a usable edition match is available.

## Automatic Sync

Automatic sync listens to BookOrbit events:

| Trigger | When it fires |
|---------|---------------|
| Status change | You mark a book as Reading, Finished, Paused, DNF, Want to Read, or another non-unread state. |
| Progress update | The web reader saves progress, a reading session is saved, or KOReader pushes progress into BookOrbit. |
| Rating change | You add, change, or clear a star rating. |

When several changes land together, BookOrbit folds them into one near-immediate sync for that user and book. For example, a KOReader progress push may also auto-mark a book as Reading; BookOrbit waits briefly and sends one Hardcover update instead of two.

## Manual Sync

<img src="/images/hardcover/manual-sync.webp" alt="Hardcover manual sync card showing pending count and last synced time" class="img-lg img-bordered" />

Manual sync is the catch-up button. Use it after first setup, after importing a library, after cleaning metadata IDs, or after turning sync back on.

The pending count is based on local changes since the last sync attempt. It is not the same thing as a matching report. A book can fail with `no_match`, stop appearing as pending because no local data changed afterward, and then become pending again once you save a Hardcover ID the matcher can use.

## KOReader Progress

KOReader does not talk to Hardcover directly. The path is:

```text
KOReader -> BookOrbit progress -> Hardcover auto-sync
```

That means the KOReader side only has to reach BookOrbit. After BookOrbit stores the progress, the Hardcover trigger uses the same matching and settings rules as any other progress update.

If progress appears in BookOrbit but not in Hardcover, check matching first. A saved BookOrbit percentage proves the KOReader sync arrived; it does not prove BookOrbit found the right Hardcover record.

## Troubleshooting

| Symptom | Check |
|---------|-------|
| The Hardcover page is missing | Confirm the user has `hardcover_sync`. |
| Manual sync is unavailable | Confirm the token is configured, **Enable sync** is on, and the user still has permission. |
| Progress updates in BookOrbit but not Hardcover | Confirm the book is not `Unread`, has a matching Hardcover record, and has a usable page count. |
| A book logs or stores `no_match` | Add the correct Hardcover provider ID from metadata search, save the book, then sync again. |
| A book keeps syncing the wrong Hardcover record | Replace the saved Hardcover provider ID with the correct value from a verified Hardcover result, save, and run manual sync. |
| Pending count does not match your expectation | Pending means local data changed since the last attempt. It does not list every book that ever failed to match. |
| Auto-sync does nothing after setup | Trigger a new status/progress/rating change, or run manual sync once to catch up existing data. |

For deeper metadata cleanup, see [Book Details, Editing, and Viewer](./book-details#provider-ids). For provider configuration, see [Metadata](./metadata).
