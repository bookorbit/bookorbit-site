# Appearance

**Settings > Appearance** controls the app chrome, library grid layout, author grid layout, book-card overlays, Smart Scope preview behavior, and the default series grouping behavior.

Appearance is available to every signed-in user. Most options are saved in the browser's local storage, so they are personal to the browser/device you are using. The **Collapse series by default** preference is saved to your user account because it affects library and collection queries.

## Theme

<img src="/images/appearance/theme-and-background.webp" alt="Appearance theme and background settings" class="img-md img-bordered" />

Theme settings change the app shell immediately. There is no separate save button.

| Setting | What it changes |
|---------|-----------------|
| **Color scheme** | Switches the whole interface between light and dark mode. |
| **Accent color** | Changes primary buttons, active tabs, sliders, selected states, focus rings, and other interactive highlights. |
| **Corner radius** | Changes the roundness of cards, buttons, inputs, dialogs, and similar UI surfaces. |
| **Surface brightness** | Lightens dark-mode surfaces. This is only shown while dark mode is active. |

### Accent colors

Accent colors are split into two rows:

- **Vivid colors**: Higher-contrast colors for stronger visual emphasis.
- **Pastel colors**: Softer colors for a quieter interface.

The selected accent is applied as a CSS class on the document and updates both normal content and sidebar accent tokens.

### Corner radius

| Option | Result |
|--------|--------|
| **Sharp** | Squarer controls and cards. |
| **Default** | Standard BookOrbit radius. |
| **Rounded** | Softer cards and controls. |
| **Pill** | Maximum rounding where controls support it. |

### Surface brightness

Surface brightness controls the dark-mode lift value used by theme tokens. Increase it if dark cards and panels feel too close to the page background. **Reset** returns the lift to `0%`.

## Background Pattern

The background pattern is part of **Library View** and is applied behind the main app content, where it is most visible behind book grids and settings pages.

Patterns are grouped in the picker:

| Group | Patterns |
|-------|----------|
| **Fundamental** | None, Dots, Cross, Terminal, Millimeter |
| **Structural** | Blueprint, Brushed, Scanlines, Vinyl, Carbon, Perforated |
| **Ambient** | Aurora, Horizon, Glow, Mesh, Elevation |
| **Refractive** | Prism, Spectrum, Spectrum X, Spectrum Plus, Eclipse, Nova, Golden Ratio |

Use **None** if you want the least visual noise. Use subtle structural patterns when you want texture without changing the page's color balance.

## Library View Layout

<img src="/images/appearance/library-and-author-grid.webp" alt="Appearance library and author grid settings" class="img-lg img-bordered" />

Library View settings control book grids in libraries, collections, and Smart Scopes.

### Cover size behavior

| Mode | Behavior |
|------|----------|
| **Sync all views** | One shared size and spacing is used for every library, collection, and Smart Scope. Changes made from a view's Display panel update the shared values. |
| **Per-view sizes** | Each library, collection, and Smart Scope keeps its own cover size and spacing. The global sliders in Appearance are disabled; adjust each view from its Display panel. |

BookOrbit stores separate shared values for portrait and square libraries. A library's cover style decides which set is used.

### Size and spacing controls

| Setting | Range | Applies to |
|---------|-------|------------|
| **Portrait cover size** | 100px to 280px | Libraries and views using portrait covers. |
| **Square cover size** | 100px to 280px | Libraries and views using square covers. |
| **Portrait grid spacing** | 4px to 40px | Gap between portrait book cards. |
| **Square grid spacing** | 4px to 40px | Gap between square book cards. |

Use smaller covers for dense browsing and larger covers when cover art matters more than the number of visible books.

## Author Grid

Author Grid settings control the Authors page.

| Setting | Range / options | Behavior |
|---------|-----------------|----------|
| **Cover size** | 100px to 280px | Sets the width used by author cards in the grid. |
| **Cover shape** | Circle or Square | Chooses whether author images render as circular portraits or square/portrait cards. |

The Authors page also uses the shared grid spacing value from display settings.

## Card Overlays

<img src="/images/appearance/card-overlays.webp" alt="Appearance card overlay settings" class="img-lg img-bordered" />

Card overlays control small status indicators shown directly on book covers in grid view. They are designed for scanning a library quickly without opening each book.

| Overlay | Position | Shown when |
|---------|----------|------------|
| **Progress bar** | Bottom edge | The book has reading progress greater than `0%`. It turns green at `100%`. |
| **File format** | Bottom-right | The book has a primary/readable file format, such as EPUB, PDF, CBZ, or M4B. |
| **Rating** | Bottom-left | The book has a rating. The badge shows the rounded rating with a color-coded star. |
| **Read status** | Top-left | The book has a read status other than unread. |
| **Lock status** | Top-right | The book is not missing and selection mode is off. Orange means metadata is locked; green means unlocked. |

The default overlay set is **Progress bar**, **File format**, **Rating**, and **Read status**. **Lock status** is available but off by default.

::: tip
If your covers feel cluttered, turn off overlays you do not use. The same data is still available from the book detail page and list views.
:::

## Smart Scopes

<img src="/images/appearance/smart-scopes-and-series.webp" alt="Appearance Smart Scopes and series settings" class="img-lg img-bordered" />

**Show filter preview by default** controls whether a Smart Scope opens with its active filter and sort summary expanded.

Turn this on when you frequently audit Smart Scope rules. Turn it off if you prefer Smart Scopes to open directly into the book grid with less header detail.

## Series

**Collapse series by default** controls the global default for grouping books in the same series into a single card in library and collection views.

Series collapse follows this precedence:

1. Collection-specific override, when one is set.
2. Library-specific override, when one is set.
3. Global default from **Settings > Appearance**.

Use this when series-heavy libraries become noisy as individual books. Leave it off if you prefer every volume to appear as its own card by default.
