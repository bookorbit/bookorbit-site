# Dashboard

The dashboard is the first thing you see when you open BookOrbit. It gives you a quick pulse on your reading life - what you're currently reading, how consistent you've been, and what your library looks like. Everything on it is personal to you.

<img src="/images/dashboard/dashboard-overview.webp" alt="BookOrbit dashboard showing widgets across the top and two book shelf scrollers below" class="img-lg img-bordered" />

## Two layers: widgets and shelves

The dashboard has two distinct layers:

- **Widgets** - compact stat cards that run across the top. Each widget surfaces a specific piece of information about your reading habits or library.
- **Shelves** - horizontal book rows below the widgets. Each shelf is a scrollable row of covers you can click directly into.

Both are fully customizable.

## Customizing the dashboard

Click the **tune icon** in the bottom-right corner of the dashboard to open the **Customize Dashboard** panel. It has two tabs: **Widgets** and **Shelves**.

<img src="/images/dashboard/customize-widgets.webp" alt="Customize Dashboard panel showing the Widgets tab with 12 widgets, each with a toggle and drag handle" class="img-xs img-bordered" />

In both tabs you can:
- **Toggle** any widget or shelf on or off
- **Drag to reorder** using the grip handle (mouse), or use the up/down arrows (touch)
- **Reset to defaults** to restore the original layout

Widget preferences are saved to your account and follow you across devices. Shelf preferences are saved in your browser's local storage and are per-device.

## Widgets

Twelve widgets are available, each surfacing a different aspect of your reading life - progress, consistency, habits, and library health.

### Currently Reading

<img src="/images/dashboard/widget-currently-reading.webp" alt="Currently Reading widget showing book covers with progress bars" class="img-sm img-bordered" />

Books you have opened and are actively working through, sorted by most recently read. Each entry shows the cover, title, and a progress bar. Clicking a book jumps straight into the reader at your last position.

### Reading Streak

<img src="/images/dashboard/widget-reading-streak.webp" alt="Reading Streak widget showing streak count, best streak, and 7-day dot row" class="img-xs img-bordered" />

Your current consecutive reading streak in days, your all-time best streak, and a dot row showing whether you read on each of the last 7 days. A filled dot is a day you read; an empty dot is a day you skipped.

The streak increments when you record any reading session in a day. Missing a day resets the current streak to zero, though your best-streak record is never erased.

### Reading Goal

<img src="/images/dashboard/widget-reading-goal.webp" alt="Reading Goal widget showing a donut chart with yearly book count progress" class="img-xs img-bordered" />

A donut chart showing your progress toward a yearly book count target. Set your goal by clicking the pencil icon on the widget - enter how many books you want to finish this year. Once set, the ring fills as you complete books. You can update the goal at any time.

### Reading DNA

<img src="/images/dashboard/widget-reading-dna.webp" alt="Reading DNA widget showing four trait bars and an archetype label" class="img-sm img-bordered" />

Four horizontal bars that profile your reading habits:

| Trait | What it measures |
|-------|-----------------|
| **Length** | Whether you tend to read short books, long books, or a mix |
| **Variety** | How wide a range of genres and formats you read |
| **Rhythm** | How consistently you read day-to-day |
| **Time** | Whether you read in the morning, afternoon, or evening |

Below the bars, a one-line archetype label summarizes your overall profile (for example, "Steady Eclectic Explorer"). The widget shows how many books were analyzed to produce the scores.

### Monthly Challenge

<img src="/images/dashboard/widget-monthly-challenge.webp" alt="Monthly Challenge widget showing a challenge description and progress bar" class="img-xs img-bordered" />

A challenge for the current month with a progress bar. Each month BookOrbit picks a challenge algorithmically based on your reading stats and library - for example: finish a book under 200 pages, read a book from a genre you haven't touched recently, or complete a book you've had in progress for over a month. The same challenge stays in place all month and a new one is chosen at the start of the next.

Progress updates automatically as you read.

### Highlight of the Day

<img src="/images/dashboard/widget-highlight-of-the-day.webp" alt="Highlight of the Day widget showing a quote from a book with the title and chapter" class="img-sm img-bordered" />

A random annotation from your reading history, shown with the book title and the chapter where it appears. Clicking the widget opens the book at that annotation. The selection rotates daily. See [Annotations & Highlights](./annotations) for the full annotation workspace.

If you have no annotations yet, this widget stays empty until you make your first highlight.

### Neglected Gems

<img src="/images/dashboard/widget-neglected-gems.webp" alt="Neglected Gems widget showing a stalled book with days since last opened" class="img-xs img-bordered" />

A book you started and then left untouched - with the number of days since you last opened it. The widget cycles through all your neglected in-progress books one at a time. You can click **Add to queue** directly from the widget to mark it as something you still intend to read, without having to open it.

### Reading Rhythm

<img src="/images/dashboard/widget-reading-rhythm.webp" alt="Reading Rhythm widget showing a 28-day bar chart of reading activity" class="img-sm img-bordered" />

A bar chart of your reading time for each of the last 28 days. Taller bars mean more reading time that day. The average reading time per active day is shown below the chart. Empty bars are days with no recorded sessions.

### Diversity Score

<img src="/images/dashboard/widget-diversity-score.webp" alt="Diversity Score widget showing a 0-100 score with four sub-bars and a plain-English label" class="img-xs img-bordered" />

A score from 0 to 100 measuring how varied your reading is across four dimensions: genre, author, publication era, and language. Four sub-bars break down where your score comes from. A label describes the result in plain English. Requires at least 3 completed books to calculate.

### Library Overview

<img src="/images/dashboard/widget-library-overview.webp" alt="Library Overview widget showing total books, authors, series, and storage used" class="img-sm img-bordered" />

Your library by the numbers - total books, authors, series, and total storage used. Clicking any stat navigates to the relevant section. A callout at the bottom shows how many books were added to your accessible libraries this year.

### Year Projection

<img src="/images/dashboard/widget-year-projection.webp" alt="Year Projection widget showing estimated books, pages, and hours by end of year" class="img-xs img-bordered" />

At your current pace, how many books, pages, and hours of reading will you accumulate by the end of the year? The widget shows books completed so far this year alongside days remaining and a trend indicator (up, down, or stable) based on your recent pace vs your earlier pace.

### The Long Wait

<img src="/images/dashboard/widget-long-wait.webp" alt="The Long Wait widget showing the oldest unread book with a day count" class="img-xs img-bordered" />

The book that has been sitting unread in your library the longest - with the day count front and center. A nudge to finally open it. Clicking **Start Reading** opens the book in the reader if the file is available; if not, it navigates to the book detail page.

## Shelves

Shelves are the horizontal book rows below the widgets. Each shelf shows up to 20 covers. Click any cover to open the book.

<img src="/images/dashboard/customize-shelves.webp" alt="Customize Dashboard panel showing the Shelves tab with three shelves and an Add shelf button showing 3/6" class="img-xs img-bordered" />

### Shelf types

| Type | What it shows |
|------|---------------|
| **Continue Reading** | Books you've started but not finished, sorted by most recently read |
| **Recently Added** | The latest books added across all your accessible libraries |
| **Discover Something New** | A random selection from your library - reshuffled on each page load |
| **Smart Scope** | Any saved Smart Scope from your sidebar, shown as a shelf row |

### Adding and removing shelves

You can have up to **6 shelves** at once. Click **Add shelf** to add a new one, choose its type from the dropdown, and save. Each shelf can be enabled or disabled independently without deleting it. The minimum is one shelf - the last shelf cannot be removed.

The Smart Scope shelf type lets you bring any saved filter directly onto the dashboard. After selecting Smart Scope as the type, a second dropdown appears to pick which scope to use. The shelf label automatically takes the scope's name.

::: tip
Shelf preferences are stored in your browser, not your account. If you log in from a different browser or device you will see the default shelves until you reconfigure them there.
:::
