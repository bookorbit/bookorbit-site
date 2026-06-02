# KOReader Sync

**Settings > Integrations > KOReader** creates the account KOReader uses for progress sync. Use this when you want KOReader and BookOrbit to exchange reading position. If you only need browsing and downloads, use [OPDS](./opds) instead.

<img src="/images/koreader/settings-overview.webp" alt="KOReader Sync settings page showing the enabled progress sync toggle, sync server URL, account summary, and device list" class="img-lg img-bordered" />

## Setup Checklist

For a first connection:

1. Give the BookOrbit user the `koreader_sync` permission.
2. Open **Settings > Integrations > KOReader**.
3. Create a username and password.
4. Copy the sync server URL.
5. On the KOReader device, open **Tools > Progress sync**.
6. Set the custom sync server to the copied URL.
7. Enter the same username and password.
8. Tap **Register** the first time, then **Login** after the account exists.

::: tip
The URL in the screenshot uses `localhost` because this docs site is running locally. On an actual device, use a BookOrbit URL that the device can reach directly.
:::

## Permissions

| Permission | Access |
|------------|--------|
| `koreader_sync` | Opens **Settings > Integrations > KOReader**, manages credentials, reads sync status, and allows KOReader progress-sync requests. |

If the parent BookOrbit user is disabled or loses `koreader_sync`, the KOReader credentials stop working.

## Settings Page

The page is split into five operational areas:

| Area | What it does |
|------|--------------|
| **Sync** | Turns progress sync on or off for the stored account. |
| **Sync Server URL** | Shows the BookOrbit endpoint and lets you copy it. |
| **Account** | Shows the username, total synced books, last sync, and a refresh action. |
| **Devices** | Lists paired devices with last sync time and last book title. |
| **Danger Zone** | Deletes the KOReader credentials and disconnects all devices while keeping progress data. |

The credential form is only shown before the account exists. Usernames must be unique and at least 3 characters long. Passwords must be at least 6 characters long.

## Sync URL

The displayed URL is built from the current BookOrbit origin:

```text
/api/v1/koreader
```

Example:

```text
https://books.example.com/api/v1/koreader
```

Use that exact URL in KOReader's custom sync server field. If BookOrbit sits behind a reverse proxy, make sure the public host and protocol are forwarded correctly so the device sees the same origin that BookOrbit advertises.

## Setup Guide

<img src="/images/koreader/setup-guide.webp" alt="KOReader Sync settings page showing the setup guide, danger zone, and cross-reader compatibility note" class="img-lg img-bordered" />

The setup guide on the page matches the KOReader workflow:

- `Tools > Progress sync`
- custom sync server set to the BookOrbit URL
- username and password from the BookOrbit settings page
- `Register` on first pairing, `Login` on later connections

Reading progress syncs automatically when KOReader opens and closes a book.

## Sync Behavior

BookOrbit stores KOReader progress per device and per book, then updates the BookOrbit reading state with the synced percentage. When the built-in web reader also has progress for the same book, the newer source wins.

KOReader to BookOrbit is usually more precise. BookOrbit to KOReader works best for EPUBs and usually resumes at chapter level rather than an exact character position.

On a book detail page, KOReader progress appears as a `KO` badge alongside the other progress sources.

## Troubleshooting

| Symptom | Check |
|---------|-------|
| The device cannot connect | Confirm the sync URL is reachable from the device and does not rely on `localhost`. |
| Sync stops working | Confirm the account still has `koreader_sync` and the Progress Sync toggle is enabled. |
| The settings page shows no devices | Sync at least one book from KOReader, then refresh the page. |
| Progress moves in BookOrbit but not on the device | Run another sync from KOReader and confirm the same account is paired. |
| Delete removed the device pairing | Recreate credentials or re-pair the device. Book progress data stays in BookOrbit. |
