# Copilot Instructions — Gaming

## What this project is

A personal **gaming collection database** — unified data model powering multiple views (dashboard, list pages, detail pages, taxonomy browsers, wishlist). Static site hosted on GitHub Pages; vanilla HTML + CSS + ES-module JS, no build step, no framework.

The mental model: **one dataset, multiple lenses** — Dashboard (overview/navigation), Collection lists ("what do I own?"), Taxonomy browsers (systems/series/companies), Detail pages ("full info on one entry"), Wishlist ("what do I want?").

## Repo structure

```
gaming/
├── assets/
│   ├── data/
│   │   ├── manifest.json          # Entry index: [{id, type}, ...] (~1027 entries)
│   │   ├── super-mario-bros.json  # One JSON file per entry, flat in assets/data/
│   │   ├── game-boy.json
│   │   └── ...
│   ├── images/                    # Local cover images (game/, hardware/ subdirs)
│   ├── icons/                     # System/series/company logos
│   └── fonts/
├── scripts/
│   ├── catalog.js             # Central data loader/cache (manifest + solo files)
│   ├── dashboard.js           # Dashboard page logic
│   ├── games.js               # Games list page logic
│   ├── consoles.js            # Consoles list page logic (legacy name for hardware list)
│   ├── amiibos.js             # Amiibos list page logic
│   ├── wishlist.js            # Wishlist aggregator page logic
│   ├── detail.js              # Game detail page logic + rendering
│   ├── hardware-detail.js     # Hardware detail page logic + rendering
│   ├── amiibo-detail.js       # Amiibo detail page logic + rendering
│   ├── systems.js             # Systems list page logic
│   ├── system-detail.js       # System detail page logic
│   ├── series.js              # Series list page logic
│   ├── series-detail.js       # Series detail page logic
│   ├── developers.js          # Companies list page logic
│   ├── developer-detail.js    # Company detail page logic
│   └── collection/            # Collection browser (not yet wired in)
│       └── index.js
├── styles/
│   ├── dashboard.css          # Dashboard tiles, purple/dark theme
│   ├── list.css               # Shared list/grid/cards for all list pages
│   ├── detail.css             # Shared detail page layout (hero, sections, fields, chips)
│   ├── hardware-detail.css    # Hardware-specific detail styling
│   ├── amiibo-detail.css      # Amiibo-specific detail styling
│   └── collection.css         # Collection browser (not yet wired in)
├── docs/
│   ├── schemas/               # Canonical JSON schemas (one per type)
│   │   ├── game.md
│   │   ├── hardware.md
│   │   ├── amiibo.md
│   │   ├── merch.md
│   │   └── corrections.md     # Schema cleanup rules for data generation
│   ├── lists/                 # Per-platform game checklists
│   ├── wishlists/             # Per-platform hardware wishlists
│   ├── profile/               # Collector profile + philosophy docs
│   └── universes.md           # Franchise universe groupings
├── staging/                   # Raw scraped data (DekuDeals export, etc.)
├── index.html                 # Dashboard — navigation hub
├── games.html                 # Games list page
├── consoles.html              # Hardware list page
├── amiibos.html               # Amiibos list page
├── systems.html               # Systems taxonomy page
├── series.html                # Series taxonomy page
├── developers.html            # Companies taxonomy page
├── wishlist.html              # Wishlist aggregator (all types)
├── detail.html                # Game/collection/bundle detail page shell
├── hardware-detail.html       # Hardware detail page shell
├── amiibo-detail.html         # Amiibo detail page shell
├── system-detail.html         # System detail page shell
├── series-detail.html         # Series detail page shell
├── developer-detail.html      # Company detail page shell
└── todo.md                    # Task tracking + open issues
```

## Data architecture

### Storage model

Each entry is stored as an individual JSON file in `assets/data/{id}.json`. The `assets/data/manifest.json` file is an index array of `{id, type}` objects used by the catalog loader.

**catalog.js** is the central data module. It:
1. Fetches `manifest.json` to get the entry list
2. Fetches individual `assets/data/{id}.json` files in parallel batches of 50
3. Caches the full catalog in `localStorage` (versioned by manifest length)
4. Exports: `loadCatalog`, `invalidateCache`, `getGames`, `getHardware`, `getAmiibo`, `getSystems`, `getSeries`, `getCompanies`

Detail pages fetch individual `assets/data/{id}.json` files directly (no catalog needed).

### Type discrimination

The `type` field on each entry determines routing:

| Type           | Detail page                        | List page        |
|----------------|------------------------------------|------------------|
| `game`         | `detail.html?id=<slug>`            | `games.html`     |
| `collection`   | `detail.html?id=<slug>`            | `games.html`     |
| `bundle`       | `detail.html?id=<slug>`            | `games.html`     |
| `hardware`     | `hardware-detail.html?id=<slug>`   | `consoles.html`  |
| `amiibo`       | `amiibo-detail.html?id=<slug>`     | `amiibos.html`   |
| `system`       | `system-detail.html?id=<slug>`     | `systems.html`   |
| `series`       | `series-detail.html?id=<slug>`     | `series.html`    |
| `company`      | `developer-detail.html?id=<slug>`  | `developers.html`|
| `merchandise`  | *(not yet built)*                  | *(not yet built)*|

## Data model — current schemas

Full schemas with all fields and allowed values live in `docs/schemas/`. Below are the key shapes.

### Game entry (see `docs/schemas/game.md`)

```json
{
  "id": "super-mario-bros",
  "name": "Super Mario Bros.",
  "cover": "https://images.igdb.com/...",
  "release": "1985-09-13",
  "type": "game",
  "franchise": { "universe": "Mario", "series": "Super Mario", "subseries": "Super Mario Bros." },
  "classification": { "genres": [], "subgenres": [], "themes": [], "tags": [] },
  "player_age": 6,
  "access": [
    {
      "platform": "nintendo-switch",
      "via": "nintendo-switch-online",
      "format": "digital",
      "status": "subscription",
      "notes": null
    }
  ],
  "versions": [{ "source": "<other-entry-id>", "format": "remake" }],
  "relationships": [{ "source": "<other-game-id>", "type": "sequel" }],
  "playstyle": { "players": { "min": 1, "max": 2 }, "modes": ["solo", "co_op"] },
  "companies": { "developer": ["..."], "publisher": ["..."] },
  "progress": "planned",
  "backlog": {
    "priority": 5,
    "reason": "Genre-defining platformer with historic importance.",
    "rating": 5,
    "difficulty": 2,
    "estimated_hours": 5
  },
  "acquisition": {
    "priority": 1,
    "reason": "",
    "notes": ""
  },
  "event": null,
  "notes": null
}
```

Key differences from older schema:
- **`access`** replaces `ownership` — has `via` (source granting access), `format`, and `status` fields
- **`backlog`** replaces `planning` — play-prioritization metadata
- **`acquisition`** is new — collection/procurement prioritization
- **`event`** is a top-level field
- **`relationships`** is an array of `{source, type}` objects (not an object)
- Types `bundle` and `collection` have a `contains` array of entry IDs

### Hardware entry (see `docs/schemas/hardware.md`)

```json
{
  "id": "game-boy",
  "name": "Game Boy",
  "cover": "game-boy",
  "release": "1990-09-28",
  "type": "hardware",
  "franchise": { "series": "Game Boy", "subseries": null },
  "companies": { "manufacturer": ["Nintendo"], "publisher": ["Nintendo"] },
  "hardware": {
    "category": "console",
    "form": "handheld",
    "primary_family": "game-boy",
    "compatible_families": [],
    "generation": 4,
    "era": "8-bit",
    "compatible_with": []
  },
  "variants": [{ "name": "Off White", "cover": "game-boy", "event": null, "notes": null }],
  "ownership": [{ "variant": "Off White", "status": "wishlist", "notes": null }],
  "acquisition": { "priority": 5, "reason": "...", "notes": null },
  "contains": [],
  "event": null,
  "notes": null
}
```

Key differences from older schema:
- **`companies`** has `manufacturer` + `publisher` arrays (replaces single `company` string)
- **`hardware.primary_family`** — main software family this console plays (used for game matching)
- **`hardware.compatible_families`** — additional backwards-compatible software families
- **`hardware.era`** — display-era label (primitive/classic/8-bit/16-bit/32-bit/128-bit/720p/1080p/4k)
- **`ownership`** is an array of `{variant, status, notes}` (replaces top-level `wishlist: true`)
- **`acquisition`** — collection priority metadata
- **`contains`** — built-in software for mini consoles / dedicated hardware

### Amiibo entry (see `docs/schemas/amiibo.md`)

```json
{
  "id": "bowser-amiibo",
  "name": "Bowser",
  "cover": "https://amiibo.life/...",
  "release": "2015-03-12",
  "type": "amiibo",
  "franchise": { "series": "Super Mario", "subseries": null },
  "amiibo": { "number": null, "wave": "Super Mario Wave 1" },
  "ownership": "owned",
  "functionality": [{ "game": "super-smash-bros-ultimate", "effect": "..." }],
  "event": null,
  "notes": null
}
```

Key differences from older schema:
- **`amiibo`** object has `number` and `wave` fields
- **`ownership`** is a string: `"owned"` or `"wishlist"` (not a boolean)
- **`functionality[].effect`** replaces `functionality[].function`

### Merchandise entry (see `docs/schemas/merch.md`) — *planned, not yet in data*

Type `"merchandise"` covers soundtracks, artbooks, guides, steelbooks, figures, statues, LEGO sets, collector's edition extras, and select promotional items.

### Taxonomy entries (system, series, company)

These are lightweight entries used for filtering and navigation — they group other entries by console family, franchise, or developer/publisher.

```json
// System — groups hardware + games by platform family
{ "id": "game-boy", "type": "system", "name": "Game Boy", "logo": "game-boy-logo" }

// Series — groups entries by franchise; circle controls list visibility
{ "id": "bomberman-series", "type": "series", "name": "Bomberman", "logo": "bomberman-logo", "circle": "major" }

// Company — developer/publisher; circle controls list visibility
{ "id": "capcom-company", "type": "company", "name": "Capcom", "logo": "capcom-logo", "circle": "major", "founded": "1979-05-30" }
```

- **`circle`** (`major` | `minor` | `sub`): determines visibility on list pages — only `major` and `minor` appear in the main list.
- **`logo`** references an icon file in `assets/icons/`.
- Games/hardware link to these via `franchise.series`, `franchise.subseries`, `system`, and `companies` fields.

## Enums (use these exact values)

```
Types:              game | collection | bundle | hardware | amiibo | system | series | company | merchandise

Progress:           planned | playing | paused | finished | completed | dropped

Access Format:      physical | digital | built_in | contained | injected | reproduction
Access Status:      owned | wishlist | borrowed | subscription | unavailable

Version Format:     base | port | enhanced_port | remaster | enhanced_remaster |
                    remake | enhanced_remake | remix | enhanced_remix |
                    regional_variant | demake | enhanced_version

Relationship Type:  original | prequel | sequel | spinoff | spiritual_successor |
                    spiritual_predecessor | reimagining | expansion | twin_engine | twin_game

Play Modes:         solo | co_op | versus | turn_based | online | party

Hardware Category:  console | computer | controller | accessory | peripheral |
                    adapter | storage | cable
Hardware Form:      home | handheld | hybrid | mini | dedicated | plug_and_play |
                    add_on | standard | special
Hardware Era:       primitive | classic | 8-bit | 16-bit | 32-bit | 128-bit |
                    720p | 1080p | 4k

Hardware Ownership: owned | wishlist | borrowed | unavailable
Amiibo Ownership:   owned | wishlist

Backlog Priority:   1 (Someday) | 2 (Later) | 3 (Soon) | 4 (Next) | 5 (Now)
Backlog Rating:     1 (Avoid) | 2 (Weak) | 3 (Good) | 4 (Strong) | 5 (Essential)
Backlog Difficulty:  1 (Very easy) | 2 (Easy) | 3 (Moderate) | 4 (Hard) | 5 (Very hard)
Acquisition Priority: 1 (Low) | 2 (Medium) | 3 (High) | 4 (Essential) | 5 (Non-negotiable)
```

## Conventions

- **IDs** are kebab-case slugs (e.g. `super-mario-bros`, `game-boy-advance`).
- **Covers**: games use full IGDB URLs (`.webp`); hardware uses short slugs resolved to `./assets/images/hardware/<slug>.png`; amiibo uses full amiibo.life URLs.
- **`access[].platform`** references a hardware entry's `id`.
- **`access[].via`** references a game/collection/hardware entry's `id` (the source granting access).
- **`versions[].source`** references another entry's `id`.
- **`relationships[].source`** references another game entry's `id`.
- **`functionality[].game`** references a game entry's `id`.
- **`hardware.primary_family`** / **`compatible_families`** reference hardware entry IDs used for game↔console matching.
- **Dates** are ISO 8601 strings (`YYYY-MM-DD`).
- All detail pages follow the same pattern: HTML shell loads a type-specific JS module that fetches `data/{id}.json`, and renders via DOM helpers (`el()`, `section()`, `field()`, `chips()`).
- Shared render helpers (`el`, `section`, `field`, `chips`, `formatDate`, `releaseLine`, etc.) are duplicated across detail scripts — eventual refactor target.

## Design decisions

- **Access model**: `access` replaces the old `ownership` array. Each entry describes a way to play the game: platform + via (what grants access) + format + status. This distinguishes "I own the physical cart" from "I can play it through Switch Online" from "it's built into my NES Classic Mini".
- **Family-based game↔console matching**: hardware entries define `primary_family` and `compatible_families`. The hardware detail page cross-references game entries whose `access[].platform` matches any of these families to show owned games for that console.
- **Injection handling**: games with `access[].format: "injected"` appear in a separate "Injected" section on the console detail page, not in the main games list.
- **Main console logic**: when multiple hardware entries share a family, the one with `main: true` shows digital games; others only show physical.
- **Backlog vs acquisition**: `backlog` answers "why/when should I play this?"; `acquisition` answers "why/when should I procure/keep this?". They are independent priorities.
- **Backlog.rating vs priority**: `rating` is external recommendation quality (1-5); `priority` is personal desire to play (1-5).
- **Progress distinction**: `finished` = reached the ending; `completed` = 100%.
- **Universe concept**: `franchise.universe` groups related series (e.g. "Mario" spans Super Mario, Donkey Kong, Yoshi, Wario). Documented in `docs/universes.md`.
- **Classification**: genres are broad (RPG, Platform), subgenres are specific (JRPG, Action Platformer), themes are setting/tone (Fantasy, Sci-Fi), tags are freeform.
- **Relationship direction**: relationships describe the source *relative to this entry*. If this game came first, use `"sequel"` (the source is a sequel). If this game came after, use `"prequel"` (the source is a prequel).
- **Scraping approach**: run local scripts → generate data JSON → commit. Never fetch APIs live in the browser.
- **Data priority on merge**: manual data > IGDB > others. Never overwrite manual fields, only fill gaps.

## Access format emoji conventions (used in detail pages)

```
💿 physical       ☁️ digital        🧩 injection
🃏 reproduction   📦 contained      🕹️ built_in
🤍 wishlist
```

## Pages overview

| Page               | HTML                   | Script                        | CSS                    |
|--------------------|------------------------|-------------------------------|------------------------|
| Dashboard          | `index.html`           | `scripts/dashboard.js`        | `styles/dashboard.css` |
| Games list         | `games.html`           | `scripts/games.js`            | `styles/list.css`      |
| Consoles list      | `consoles.html`        | `scripts/consoles.js`         | `styles/list.css`      |
| Amiibos list       | `amiibos.html`         | `scripts/amiibos.js`          | `styles/list.css`      |
| Wishlist           | `wishlist.html`        | `scripts/wishlist.js`         | `styles/list.css`      |
| Systems list       | `systems.html`         | `scripts/systems.js`          | `styles/list.css`      |
| Series list        | `series.html`          | `scripts/series.js`           | `styles/list.css`      |
| Companies list     | `developers.html`      | `scripts/developers.js`       | `styles/list.css`      |
| Game detail        | `detail.html`          | `scripts/detail.js`           | `styles/detail.css`    |
| Hardware detail    | `hardware-detail.html` | `scripts/hardware-detail.js`  | `styles/detail.css` + `styles/hardware-detail.css` |
| Amiibo detail      | `amiibo-detail.html`   | `scripts/amiibo-detail.js`    | `styles/detail.css` + `styles/amiibo-detail.css`   |
| System detail      | `system-detail.html`   | `scripts/system-detail.js`    | `styles/detail.css`    |
| Series detail      | `series-detail.html`   | `scripts/series-detail.js`    | `styles/detail.css`    |
| Company detail     | `developer-detail.html`| `scripts/developer-detail.js` | `styles/detail.css`    |

## Open issues (from todo.md)

- Games detail: if a game is on the same console more than once (owned + wishlisted), split across Access / Wishlist Access sections.
- Games detail: if hardware has the game's `access[].platform` as a `compatible_families` entry, list it as possible access.
- Hardware detail: if a game is from a `compatible_families` entry but digital or `via != null`, do not list it.

## Planned features

- **Metrics page**: total games, games per console, games per series, owned vs wishlist counts, total consoles, controllers per console.
- **Merchandise page**: lists merchandise entries (schema ready in `docs/schemas/merch.md`, data not yet created).
- **Collection browser** (`scripts/collection/index.js`): richer filtering/sorting — exists but not wired into any HTML page.
- Shared render helpers should be extracted to a common module.

## Build / test / lint

No build step, no bundler, no test framework. Serve the folder with any static HTTP server for local development (ES modules need HTTP, not `file://`).

## Data sources

| Source        | What it provides                         | Notes                    |
|---------------|------------------------------------------|--------------------------|
| IGDB          | Core metadata, covers, genres, platforms | Primary game source      |
| HowLongToBeat | Time to beat (main + completionist)     | Hours data               |
| RAWG          | Tags, community ratings                  | Supplementary            |
| Metacritic    | Review scores                            | For `backlog.rating`     |
| DekuDeals     | Prices, sales, Switch collection export  | Staging data source      |
| amiibo.life   | Amiibo characters, series, images        | Primary amiibo source    |
| Wikipedia     | Hardware specs, generations, history     | Hardware enrichment      |
