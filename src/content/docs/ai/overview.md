---
title: "What is AI in BookOrbit?"
description: "What BookOrbit's AI features do for readers, what an administrator needs to set up, what works on which iPhone, and what it sends and costs."
---

Put a long fantasy novel down on a Tuesday and pick it up the following Monday. A character you half remember has just walked back into the story, and you cannot place them. Scrolling back means hunting through chapters, and it risks running into something you have not read yet.

BookOrbit's AI features are for that moment. They do not write books or recommend them. They answer one question while you read: **who is this, and what do I know about them so far?**

:::note
The AI features are in the **BookOrbit iPhone app only**. The Android app and the web reader do not have them. The web app is where an administrator sets the AI up and where story guides are built.
:::

BookOrbit has no AI of its own and sends nothing anywhere until an administrator connects an AI provider and switches a feature on. A server that never does this works exactly as it always has.

## What readers can do

In the iPhone app, while reading a text book:

- **See who is who.** **Constellations** lists every person, place and term in the book, with a short description of each. It shows only what is on the pages you have already read, so it does not spoil what is ahead.
- **See who is connected.** The **Sky** draws the cast as a star map of who appears with whom, and who is family, friend or enemy.
- **Be reminded.** Select a name on the page for a short reminder of who it is. Open the **Recap** after a break to catch up on the story so far and where you stopped.
- **Ask a question.** Type something like "Why does Harry live with the Dursleys?" and get an answer built from the pages you have read, with the passages it used.
- **Scan books with the camera.** Photograph a cover or a shelf and see which books are already in your library and which you could request.

[Constellations & Reading Help](/ai/ios) shows each of these with screenshots, and [Photo Scans](/ai/photo-scans) covers the camera.

## Who sets up what

| Who | What they do | Where |
|-----|--------------|-------|
| **An administrator** | Connects an AI provider (a service such as OpenAI or Anthropic, or a model you run yourself), chooses which model does which job, switches features on and sets a spending limit. Needs the **App settings** permission. | **Settings > Server > AI** in the web app. See [Setting Up AI](/ai/connect-a-provider). |
| **Someone who builds story guides** | Builds a guide for a book: a who's who the server writes by reading the whole book once. It makes Constellations and the recap much richer. Needs the **Build story guides** permission, which an administrator can give without handing over the server settings. | The **AI** icon in the sidebar and a book's **Story guide** card. See [Story Guides](/ai/story-guides). |
| **A reader** | Uses it in the iPhone app. Chooses whether answers are written on the phone or by the server's AI. | **Settings > Reading Help** and **Settings > Photo Scans** in the app. |

Permissions are covered in [Users & Permissions](/users).

## What works with your setup

Two things decide what a reader gets: whether the **server** has AI connected, and whether the **iPhone** supports **Apple Intelligence**, Apple's own AI that runs on the phone itself. Apple Intelligence runs on the iPhone 15 Pro and Pro Max and on every iPhone 16 and iPhone 17 model; Apple's own list is the one to check for newer models.

| Server | iPhone | What the reader gets |
|--------|--------|----------------------|
| AI connected | Supports Apple Intelligence | Everything. Reminders and recaps can be written by the phone or by the server, as the reader chooses. |
| AI connected | Does not support it | Everything except typed questions. The server's AI writes the reminders, recaps and descriptions. |
| No AI | Supports Apple Intelligence | Constellations and the Sky with names only, reminders and recaps written on the phone, and typed questions. There are no story guides, so no descriptions from a guide, no ties and no chapter summaries. |
| No AI | Does not support it | Constellations and the Sky with names only, photo scans read on the phone, and barcode scans. |

## Which AI does each feature use?

There are two kinds of AI behind these features, and some features use none.

- **Server AI** is the provider the administrator connects. It works for every reader, whatever phone they have, and is paid for from the server's AI budget.
- **Apple Intelligence** runs on the iPhone. Nothing leaves the phone and no provider is involved. It needs a supported phone, and the answers it writes need **BookOrbit Premium**.

| Feature | Server AI | Apple Intelligence | Notes |
|---------|-----------|--------------------|-------|
| Build a **story guide** | Required | Not used | Built on the server, once per book. |
| **Constellations**: lists, search, entries, "Where it comes up", marked names | Not used | Not used | Works on any iPhone. The phone finds names as you read. A story guide adds merged names, descriptions and ties. |
| The **Sky** | Not used | Not used | A story guide adds the ties. |
| A **reminder** for a selected name, the **Where you stopped** part of a recap, a Constellations **description**, **Ask about this chapter** | Your choice. | Your choice. | Choose in **Settings > Reading Help**, separately on each iPhone. |
| The **Story so far** part of a recap | Used when the story guide was built | Not used | Comes from the guide's chapter summaries. |
| **Ask about the story so far**, a question you type | Never | Required. | Always answered on the phone. |
| **Photo scans** on **Cover** and **Shelf** | Your choice | Not used | By default the phone reads the photo itself, with Apple's text recognition, which is not Apple Intelligence and works on any iPhone. Choose in **Settings > Photo Scans**. |
| **Barcode** scans, **Visual Intelligence** lookups, the **Who Is This in a Book** Siri action | Not used | Not used | No BookOrbit AI involved. Visual Intelligence is Apple's own feature and needs an iPhone that offers it. |

### What the iPhone needs for Apple Intelligence

- **A supported phone**, as above, running **iOS 26 or later**, which the BookOrbit app requires anyway.
- **Apple Intelligence switched on** in the iPhone's Settings, with its model finished downloading. The app says when it is still getting ready.
- **A language it supports.** A book in a language the model cannot read gets no on-device answer.
- **BookOrbit Premium** for the answers it writes.

If the phone does not qualify, the features that depend on Apple Intelligence hide themselves, unless the reader has chosen a server option in **Settings > Reading Help**. Then the server's AI writes the reminders, recap and descriptions instead. A typed question is the one feature the server cannot take over.

## What gets sent to the AI provider

This is the part worth reading slowly, because it depends on the feature.

| Feature | What goes to the provider | What does not |
|---------|--------------------------|---------------|
| Story guides | The whole text of each book that is built. | Readers' accounts, reading positions and notes. |
| Reminders, recaps and descriptions written by the server | A few passages from before the reader's place, and the words they asked about. | The book's title, its author and the rest of its text. |
| Photo scans, when the reader chooses an AI option | The photo being scanned. | Everything else. Matching the books it reads against your library happens on your server. |

The first time an administrator switches a feature on, BookOrbit asks them to confirm what it sends, and records who confirmed and when. The iPhone asks each reader again before passages or photos leave the phone.

The provider handles that text under its own terms. Running a model on your own hardware keeps everything on your network; see [Setting Up AI](/ai/connect-a-provider#running-a-model-at-home).

## What it costs

The provider charges for what it reads and writes, and BookOrbit has no say in that price. What BookOrbit does is keep the spending visible and capped:

- A **monthly limit** for the whole server, and optionally a share of it for each feature.
- An **estimate before every story guide**, shown in the confirmation dialog.
- A **monthly allowance for each reader** for server-written answers, so one reader cannot use up the budget.
- A **usage view** with the month's requests, tokens and cost.

A story guide for a full-length novel is the largest single cost. It runs from tens of cents on a small, fast model to a few dollars on a premium one, and it is paid once for everyone who reads that book. A server-written reminder costs a fraction of a cent on a small model, and an answer that has already been written is reused for free.

## Words used on these pages

| Word | What it means |
|------|---------------|
| **Provider** | The service or model that does the AI work, such as OpenAI, Anthropic, OpenRouter or a model on your own machine. |
| **Slot** | A job a model is picked for. There are three: **Fast** (many small requests), **Careful** (the best judgement) and **Vision** (reading pictures). |
| **Story guide** | A who's who for one book, written by the server's AI from the book's text. |
| **Constellations** | The iPhone app's list of people, places and terms in a book, up to your page. |
| **Reading help** | The administrator's switch for server-written reminders, recaps and descriptions. |
| **Premium** | BookOrbit's paid upgrade in the iPhone app. It is needed only for answers written on the phone. |

## Getting started

1. An administrator [connects a provider](/ai/connect-a-provider) and switches the features on.
2. Someone [builds a story guide](/ai/story-guides) for a book.
3. A reader opens the book in the [iPhone app](/ai/ios).
