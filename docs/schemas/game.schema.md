# Game Schema

> Type: `game` — all playable entries (standalone, bundles, collections)

This document defines the canonical shape of game entries. It is organized around three concerns:

1. **Taxonomy** — What is this? Who made it? Where does it belong?
2. **Backlog** — Should I play it? How long? How hard? For whom?
3. **Collection** — Do I have it? How do I access it? Should I acquire it?

---

## Schema

```jsonc
{
    // ─── TAXONOMY ──────────────────────────────────────────────────────

    // Unique internal identifier.
    // Format: kebab-case slug.
    "id": "super-mario-bros",

    // Display name.
    "name": "Super Mario Bros.",

    // Short explanation of what this game is.
    // One or two sentences — elevator pitch for someone unfamiliar.
    // Substitutes notes for quick identification.
    "description": "Side-scrolling platformer where Mario rescues Princess Peach from Bowser across 8 worlds.",

    // Local asset path for cover image.
    // Format: slug resolved to ./assets/images/game/<slug>.webp
    // Migration: existing URL covers will be downloaded locally via script.
    "cover": "super-mario-bros",

    // Original release date (earliest worldwide).
    // Format: YYYY-MM-DD (ISO 8601).
    "release": "1985-09-13",

    // Always "game" for this schema.
    "type": "game",

    // What kind of game package this is.
    // Allowed: "single_entry" | "bundle" | "collection"
    //
    // - "single_entry" = one standalone playable work or version
    // - "bundle"       = commercial package of multiple separate items
    // - "collection"   = curated compilation of playable entries
    "category": "single_entry",

    // Alternative regional titles for this game.
    // ONLY official regional name differences — not abbreviations, nicknames, or fan names.
    // Romanized only — no Japanese/Korean/Chinese characters.
    // Examples:
    //   Castlevania → "Devil's Castle Dracula"
    //   Final Fantasy IV → "Final Fantasy II"
    //   Star Fox → "Starwing"
    //   Street Fighter Alpha → "Street Fighter Zero"
    // Use [] if the title is the same across all regions.
    "aliases": [],

    // Franchise grouping.
    "franchise": {
        // Main series this entry belongs to.
        // Links to a `series` type document via id.
        // Use null if standalone / no series.
        "series": "super-mario-series",

        // More specific branch within the series.
        // Links to a `series` type document via id.
        // Use null if not applicable.
        "subseries": "super-mario-bros-series"
    },

    // Primary system/platform family this entry belongs to.
    // Links to a `system` type document via id.
    // Determines which system detail page lists this game.
    "system": "nintendo-entertainment-system-system",

    // Companies involved in development.
    // Array of company IDs. Links to `company` type documents.
    // Focus on developers — publishers are omitted unless relevant to curation.
    "companies": [
        "nintendo-company"
    ],

    // Notable people associated with this entry.
    // Array of person IDs. Links to `person` type documents.
    // Includes directors, designers, composers, artists — anyone worth highlighting.
    "people": [
        "shigeru-miyamoto",
        "koji-kondo"
    ],

    // Commercial release line or product branding.
    // For entries that are part of a branded product series.
    // Examples: "Classic NES Series", "Super Mario Advance", "Sega 3D Classics",
    //           "Player's Choice", "Nintendo Selects", "Greatest Hits"
    // Use null if not part of any release line.
    "release_line": null,

    // Time-bound event, campaign, or anniversary this entry is tied to.
    // Examples: "The Year of Luigi", "Super Mario Bros. 35th Anniversary",
    //           "Nintendo Switch 2 launch", "Konami's 50th Anniversary"
    // Use null if not tied to any event.
    "event": null,

    // Gameplay classification and discovery metadata.
    // NOTE: Currently under rework. Treat as placeholder — do not rely on values.
    "classification": {
        "genres": ["Platform"],
        "subgenres": ["Action Platformer"],
        "themes": ["Fantasy"],
        "tags": ["Retro", "Short"]
    },

    // ─── BACKLOG ───────────────────────────────────────────────────────

    // Recommended age for meaningful appreciation/play.
    // Not an official content rating — personal editorial judgment.
    "player_age": 6,

    // How the game can be played (multiplayer info).
    "playstyle": {
        // Minimum supported players (usually 1).
        "min_players": 1,
        // Maximum supported players.
        "max_players": 2,
        // Play modes available.
        // Allowed: "solo" | "co_op" | "versus" | "turn_based" | "online" | "party"
        "modes": ["solo", "turn_based"]
    },

    // Personal play/progress status.
    // Allowed: "planned" | "playing" | "paused" | "finished" | "completed" | "dropped"
    //
    // - "finished"  = reached the ending / saw credits
    // - "completed" = 100% / all objectives done
    "progress": "finished",

    // Play-prioritization metadata.
    // Answers: "Why should I play this, and how soon?"
    "backlog": {
        // Personal play priority.
        // 1 = Someday | 2 = Later | 3 = Soon | 4 = Next | 5 = Now
        "priority": 5,

        // Why this is worth playing. Player-facing reason.
        // Avoid ownership or access notes here.
        "reason": "Historic importance, revolutionized gaming",

        // Community/critical consensus quality score.
        // 1 = Avoid | 2 = Weak | 3 = Good | 4 = Strong | 5 = Essential
        "rating": 5,

        // Expected difficulty.
        // 1 = Very easy | 2 = Easy | 3 = Moderate | 4 = Hard | 5 = Very hard
        "difficulty": 3,

        // Estimated meaningful completion time in hours.
        "estimated_hours": 2
    },

    // ─── COLLECTION ────────────────────────────────────────────────────

    // How this game can be accessed/played or is wishlisted.
    // Each entry represents one distinct access path.
    "access": [
        {
            // Physical hardware used to play.
            // Links to a `hardware` type document via id.
            "platform": "nintendo-classic-mini-nintendo-entertainment-system",

            // Product, service, or online platform granting access.
            // Use ONLY for online storefronts/services:
            // eShop, Virtual Console, Xbox Live Arcade, DSiWare, NSO, PSN, etc.
            // null if direct access (physical cart, built-in, injected, etc.)
            "via": null,

            // Access format.
            // Allowed:
            // - "physical"     = physical standalone item (cart, disc)
            // - "digital"      = digital standalone license
            // - "built_in"     = included by default in hardware (mini consoles)
            // - "contained"    = inside a bundle/collection/compilation
            // - "injected"     = manually added to compatible hardware
            // - "reproduction" = reproduction cart/disc
            "format": "built_in",

            // Access status.
            // Allowed:
            // - "owned"        = you own this access path
            // - "wishlist"     = you want this access path
            // - "borrowed"     = temporary access from someone
            // - "subscription" = playable through active subscription only
            // - "unavailable"  = tracked but not currently obtainable
            "status": "owned",

            // Per-access-path notes.
            // Examples: "Used to own", "Prefer PAL version", "Save states available"
            "notes": null
        }
    ],

    // Related versions/ports/remasters/remakes of essentially the same work.
    // Do NOT include if the only version is itself.
    "versions": [
        {
            // Related entry ID.
            "source": "super-mario-bros-snes",

            // Version relationship type.
            // Allowed:
            // - "base"              = the original this derives from
            // - "port"              = same game moved to another platform
            // - "enhanced_port"     = port with notable additions
            // - "remaster"          = same game with technical/AV restoration
            // - "enhanced_remaster" = remaster with meaningful extra content
            // - "remake"            = rebuilt while preserving core identity
            // - "enhanced_remake"   = remake with meaningful extra content
            // - "remix"             = rearranged rules/characters/layouts (still same game)
            // - "enhanced_remix"    = remix with substantial added content
            // - "regional_variant"  = different regional release with changes
            // - "demake"            = intentionally reduced fidelity version
            // - "enhanced_version"  = same platform, expanded edition
            "type": "remake"
        }
    ],

    // Entry IDs contained inside this entry.
    // Only present when category is "bundle" or "collection".
    "contains": [],

    // Relationships to OTHER distinct games.
    // Do NOT duplicate version relationships here.
    // Do NOT use for simple same-franchise membership.
    "relationships": [
        {
            // Related game entry ID.
            "source": "super-mario-bros-the-lost-levels",

            // Relationship type. Direction matters:
            // If THIS game came BEFORE the source → "sequel" (source is the sequel)
            // If THIS game came AFTER the source → "prequel" (source is the prequel)
            //
            // Allowed:
            // - "original"              = source is the original this derives from
            // - "prequel"               = source came before this
            // - "sequel"                = source came after this
            // - "spinoff"               = source branches from this
            // - "spiritual_successor"   = source is later, strongly inspired by this
            // - "spiritual_predecessor" = source is earlier, strongly inspired this
            // - "reimagining"           = source is a new reinterpretation
            // - "expansion"             = source expands this (separate entry)
            // - "twin_engine"           = source shares engine/structure, distinct work
            // - "twin_game"             = source is a paired/sibling release
            "type": "sequel"
        }
    ],

    // Acquisition and collection-prioritization metadata.
    // Answers: "Why should I procure, keep, or wishlist this?"
    "acquisition": {
        // Personal collecting/procurement priority.
        // 1 = Low | 2 = Medium | 3 = High | 4 = Essential | 5 = Non-negotiable
        // null if not relevant (e.g., already fully satisfied by access).
        "priority": null,

        // Collector-facing reason. Why this matters to the collection.
        "reason": null,

        // Acquisition-specific notes.
        // Examples: "Used to own", "Prefer PAL", "Only worth cheap",
        //           "Own digitally but want physical", "Reproduction acceptable"
        "notes": null
    },

    // Freeform personal notes about this entry as a whole.
    "notes": null
}
```

---

## Field reference

### Taxonomy fields

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `id` | ✓ | string | Kebab-case unique slug |
| `name` | ✓ | string | Display name |
| `cover` | ✓ | string | Local image slug (resolved to `./assets/images/game/<slug>.webp`) |
| `release` | ✓ | string | ISO 8601 date (`YYYY-MM-DD`) |
| `type` | ✓ | string | Always `"game"` |
| `category` | ✓ | enum | `single_entry` \| `bundle` \| `collection` |
| `aliases` | — | string[] | Official regional title differences |
| `franchise.series` | — | string \| null | Series entry ID |
| `franchise.subseries` | — | string \| null | Subseries entry ID |
| `system` | ✓ | string | System entry ID |
| `companies` | ✓ | string[] | Company entry IDs (developers) |
| `people` | — | string[] | Person entry IDs (directors, composers, etc.) |
| `release_line` | — | string \| null | Branded product line name |
| `event` | — | string \| null | Time-bound campaign/anniversary |
| `classification` | — | object | *Under rework* — genres/subgenres/themes/tags |

### Backlog fields

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `player_age` | ✓ | number | Recommended appreciation age |
| `playstyle.min_players` | ✓ | number | Minimum players |
| `playstyle.max_players` | ✓ | number | Maximum players |
| `playstyle.modes` | ✓ | string[] | `solo` \| `co_op` \| `versus` \| `turn_based` \| `online` \| `party` |
| `progress` | ✓ | enum | `planned` \| `playing` \| `paused` \| `finished` \| `completed` \| `dropped` |
| `backlog.priority` | ✓ | number | 1–5 play priority |
| `backlog.reason` | ✓ | string | Why to play |
| `backlog.rating` | ✓ | number | 1–5 community quality |
| `backlog.difficulty` | ✓ | number | 1–5 difficulty |
| `backlog.estimated_hours` | ✓ | number | Time to beat |

### Collection fields

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `access` | ✓ | array | Access paths (platform + via + format + status + notes) |
| `versions` | — | array | Related versions (source + type) |
| `contains` | — | string[] | Entry IDs inside bundles/collections |
| `relationships` | — | array | Links to other games (source + type) |
| `acquisition.priority` | — | number \| null | 1–5 procurement priority |
| `acquisition.reason` | — | string \| null | Why to collect |
| `acquisition.notes` | — | string \| null | Procurement notes |
| `notes` | — | string \| null | General freeform notes |

---

## Enums

```
Category:           single_entry | bundle | collection

Progress:           planned | playing | paused | finished | completed | dropped

Access Format:      physical | digital | built_in | contained | injected | reproduction
Access Status:      owned | wishlist | borrowed | subscription | unavailable

Version Type:       base | port | enhanced_port | remaster | enhanced_remaster |
                    remake | enhanced_remake | remix | enhanced_remix |
                    regional_variant | demake | enhanced_version

Relationship Type:  original | prequel | sequel | spinoff | spiritual_successor |
                    spiritual_predecessor | reimagining | expansion | twin_engine | twin_game

Play Modes:         solo | co_op | versus | turn_based | online | party

Backlog Priority:   1 (Someday) | 2 (Later) | 3 (Soon) | 4 (Next) | 5 (Now)
Backlog Rating:     1 (Avoid) | 2 (Weak) | 3 (Good) | 4 (Strong) | 5 (Essential)
Backlog Difficulty:  1 (Very easy) | 2 (Easy) | 3 (Moderate) | 4 (Hard) | 5 (Very hard)
Acquisition Priority: 1 (Low) | 2 (Medium) | 3 (High) | 4 (Essential) | 5 (Non-negotiable)
```

---

## Design notes

### Why `type` is always `"game"` with a separate `category`?
The `type` field is used for routing across all entry types in the system (game, hardware, amiibo, system, series, company). Every playable entry is `type: "game"`. The `category` field distinguishes the packaging: standalone work, bundle, or collection. This keeps type discrimination simple at the system level while preserving the distinction within games.

### Why `release_line` instead of `label`?
"Label" is ambiguous (record label? UI label?). **`release_line`** clearly communicates "branded commercial product line" — Classic NES Series, Player's Choice, Nintendo Selects, Greatest Hits, Super Mario Advance, etc. These are marketing/retail categories, not events.

### `release_line` vs `event`
- **`release_line`**: Persistent product branding applied to a release. The game IS part of this line.
- **`event`**: Time-bound campaign or anniversary that motivated the release. The game was released DURING this event.

A game can have both: a "Nintendo Selects" release line tied to "Zelda 25th Anniversary" event.

### Why no `franchise.universe`?
Universes (Mario, Zelda) are derivable from series groupings. The `series` taxonomy documents can define their own universe/parent hierarchy. No need to duplicate that data on every game entry.

### Why `companies` is a flat array (no developer/publisher split)?
Publishers are rarely useful for curation. The list focuses on who **made** the game. If a publisher is notable for curation (e.g., Limited Run Games for physical releases), it can go in `acquisition.notes`.

### Why `people` as a new field?
Key creators (Miyamoto, Kojima, Kondo, Sakurai) are strong curation signals. This enables browsing/filtering by auteur — "show me all Sakurai games" or "all Koji Kondo soundtracks". Links to a future `person` type document.

### Why `access.via` is only for online platforms?
`via` identifies the digital storefront or online service that provides access: eShop, Virtual Console, Xbox Live Arcade, DSiWare, Nintendo Switch Online, PSN, etc. Physical compilations, mini consoles, and built-in software don't need `via` — those are handled by `format` (contained, built_in, injected) and the `platform` pointing directly at the relevant hardware.

---

## Migration notes (from current data)

| Change | Action needed |
|--------|---------------|
| Add `category` field | Set `"single_entry"` for type `"game"`, keep value for `"bundle"`/`"collection"`; then set `type` to `"game"` for all |
| Remove `franchise.universe` | Delete field from all entries |
| Add `people` | Populate incrementally (start empty: `[]`) |
| Add `release_line` | Move product-line values from `event` here; set rest to `null` |
| `cover` → local | Run download script (future task), then replace URLs with slugs |
| `classification` | Keep as-is until rework; mark unreliable |
| `companies` shape | Already migrated (flat array of IDs) ✓ |
| `system` field | Already present ✓ |
| `franchise.series`/`subseries` as IDs | Already migrated ✓ |
| `versions[].format` → `versions[].type` | Rename field in all entries |
| `playstyle.players.min/max` → `playstyle.min_players/max_players` | Flatten in all entries |
| `backlog` fields | Ensure all fields are populated (no nulls) |
| `access[].via` cleanup | Remove `via` from non-online-platform access entries |
| Add `contains` | Add `[]` to single entries; populate for bundles/collections |
| "Nintendo eShop" in `event` | Move to `access[].via` where applicable, remove from `event` |
| "Nintendo Classic Mini: SNES" in `event` | Remove entirely (useless) |
