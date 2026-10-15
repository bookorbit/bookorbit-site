---
title: "Android Privacy Policy"
description: "How the BookOrbit Android app handles account data, library content, purchases, crash reports, and optional network services."
---

Effective October 15, 2026.

BookOrbit is a client for a self-hosted reading server. The Android app keeps your library, reading activity, and account data under the control of you and your BookOrbit server administrator. BookOrbit does not sell personal information, show advertising, or track you across apps or websites.

## Data the app handles

The app may handle the following data to provide its features:

- The address of the BookOrbit server you connect to
- Account information returned by that server, such as your username, display name, email address, and avatar
- Sign-in tokens needed to keep you signed in
- Library metadata, reading progress, annotations, bookmarks, journal entries, activity, downloads, uploads, and playback state
- Purchase status for BookOrbit Premium
- Crash reports, unless you turn them off

Sign-in tokens are encrypted on the phone with a key held in the Android Keystore, which never leaves it. Offline books, audiobooks, covers, widget data, and preferences are kept in the app's private storage. The app excludes all of its data from Android's cloud backup and device-to-device transfer, so a new phone signs in again and syncs from your server.

## Signing out and uninstalling

Signing out of an account removes that account's downloads and offline library from the phone, along with its launcher shortcuts, widget data, and cached covers. A few settings tied to the account, such as recent searches and the Home layout, stay on the phone until the app is uninstalled. Uninstalling the app removes everything it stored on the phone. Neither deletes anything on your BookOrbit server.

## Self-hosted servers

Most account and library data is exchanged directly between the app and the BookOrbit server you choose, along with your phone's make and model, which names its signed-in session there. That server is operated by you or by an administrator you trust, not by the BookOrbit app developer. Its administrator controls its accounts, storage, backups, logs, connected services, and retention practices.

To access, correct, export, or delete data held by a BookOrbit server, contact that server's administrator. Uninstalling the Android app does not delete data stored on the server.

## Purchases

Google Play processes payments for BookOrbit Premium. BookOrbit does not receive your payment details.

BookOrbit uses RevenueCat to retrieve products and determine whether BookOrbit Premium is active. RevenueCat receives an anonymous identifier the app creates and purchase information such as product identifiers, transaction status, and entitlement status. The app does not send your BookOrbit username, email address, server address, library, or reading activity to RevenueCat.

See [Google's privacy policy](https://policies.google.com/privacy) and [RevenueCat's privacy policy](https://www.revenuecat.com/privacy/) for their practices.

## Crash reports

The app uses Firebase Crashlytics, a Google service, to report crashes and moments when the app stops responding, so they can be fixed. A report contains the type of error and where in the app's code it happened, the app version, the device model, the Android version, and an identifier Firebase creates for this installation of the app.

Before a report is sent, the app removes the error's message, which is where a server address, file name, or identifier could otherwise appear. Reports never include your account, server address, books, or reading.

Crash reports are on by default. Turn them off at any time in the app's Settings. See [Firebase's privacy information](https://firebase.google.com/support/privacy) for Google's practices.

## Optional network services

Some features contact other services only when you use them:

- Reading aloud with an Orbit voice sends the text being read and the chosen voice to Microsoft's speech service, which returns the audio. The list of Orbit voices comes from Microsoft too. No BookOrbit account, token, or server address is sent. See the [Microsoft Privacy Statement](https://privacy.microsoft.com/privacystatement).
- Reading aloud with a server voice sends the text to your BookOrbit server, which may pass it to a speech provider its administrator set up.
- Reading aloud with the phone's own voices uses Android's text-to-speech engine, which follows its own settings.
- Looking up a word sends only that word to the [Free Dictionary API](https://dictionaryapi.dev/) and to [Wiktionary](https://foundation.wikimedia.org/wiki/Policy:Privacy_policy), never the passage or the book.
- Opening the notice about a newer BookOrbit server asks GitHub for that release's notes.
- Sign-in through an OpenID Connect provider opens the provider's page in your browser and follows the settings of your BookOrbit server administrator.
- Support pages, release notes, and a book's page on another site open in your browser.

Each of these services may receive ordinary network information, such as your IP address, with the request.

## Permissions

- **Camera:** used only while the barcode scanner is open. Its images are read on the phone and never stored or sent; only the code it reads is used, to search your BookOrbit server.
- **Notifications:** show download, upload, and playback progress.
- **Local network:** lets the app reach a BookOrbit server on your home network.

## Diagnostics

Apart from crash reports, the app writes diagnostic notes only to the phone's own system log, in a fixed wording that leaves out server addresses, names, file names, and identifiers. Nothing in that log is uploaded by BookOrbit.

## Children

BookOrbit is a general-purpose reading app and is not directed to children under 13. A BookOrbit server administrator decides who may have an account on their server.

## Changes

This policy may be updated as BookOrbit changes. The effective date at the top of this page identifies the current version.

## Contact

For questions about the Android app's privacy, open an issue in the [BookOrbit Android support repository](https://github.com/bookorbit/bookorbit-android-support/issues/new/choose), without secrets or private details. Report a security concern privately through [GitHub Security Advisories](https://github.com/bookorbit/bookorbit/security/advisories/new). For data held by a self-hosted server, contact that server's administrator.
