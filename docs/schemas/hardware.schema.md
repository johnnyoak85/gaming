# Hardware Schema

> Type: `hardware` — consoles, controllers, accessories, peripherals, adapters

This document defines the canonical shape of hardware entries. It is organized around two concerns:

1. **Taxonomy** — What is this? Who made it? What system does it belong to?
2. **Collection** — Do I own it? Which variants? Should I acquire more?

---

## Schema

```jsonc
{
    // ─── TAXONOMY ──────────────────────────────────────────────────────

    // Unique internal identifier.
    // Format: kebab-case slug.
    "id": "game-boy-advance-sp",

    // Display name.
    "name": "Game Boy Advance SP",

    // Short explanation of what this hardware is.
    // One or two sentences — elevator pitch for someone unfamiliar.
    "description": "Clamshell redesign of the Game Boy Advance with a frontlit screen and rechargeable battery.",

    // Local asset path for default/representative cover image.
    // Format: slug resolved to ./assets/images/hardware/<slug>.png
    "cover": "game-boy-advance-sp",

    // Original release date (earliest worldwide).
    // Format: YYYY-MM-DD (ISO 8601).
    "release": "2003-03-23",

    // Always "hardware" for this schema.
    "type": "hardware",

    // What kind of hardware this is.
    // Allowed: "console" | "computer" | "controller" | "accessory" | "peripheral" | "adapter" | "storage" | "cable"
    //
    // - "console"    = playable game system (home, handheld, mini, dedicated)
    // - "computer"   = home computer / microcomputer
    // - "controller" = primary input device
    // - "accessory"  = simple/passive add-on (stands, cases, grips)
    // - "peripheral" = active/specialized device adding distinct capability
    // - "adapter"    = compatibility/connectivity bridge
    // - "storage"    = memory card, VMU, SD card, etc.
    // - "cable"      = cable or connector
    "category": "console",

    // Alternative regional names for this hardware.
    // ONLY official regional name differences — not abbreviations, nicknames, or model numbers.
    // Romanized only — no Japanese/Korean/Chinese characters.
    // Examples:
    //   Sega Mega Drive → "Sega Genesis"
    //   Super Famicom → "Super Nintendo Entertainment System"
    // Use [] if the name is the same across all regions.
    "aliases": [],

    // Physical/functional form factor.
    // Allowed: "home" | "handheld" | "hybrid" | "mini" | "dedicated" | "plug_and_play" | "add_on" | "standard" | "special"
    //
    // For consoles:
    // - "home"          = traditional home console (TV-connected)
    // - "handheld"      = portable self-contained console
    // - "hybrid"        = both handheld and docked/home use
    // - "mini"          = modern mini/replica console
    // - "dedicated"     = fixed-purpose hardware with built-in games only
    // - "plug_and_play" = TV plug-and-play device
    // - "add_on"        = expansion hardware attached to another system
    //
    // For controllers/accessories:
    // - "standard"      = default/expected form for this type
    // - "special"       = unusual/specialized/limited form
    "form": "handheld",

    // Display-era label for the hardware's graphical/technological generation.
    // Allowed: "primitive" | "classic" | "8-bit" | "16-bit" | "32-bit" | "128-bit" | "720p" | "1080p" | "4k"
    //
    // - "primitive" = Pong, early Atari
    // - "classic"   = Atari 2600, Intellivision, Game & Watch
    // - "8-bit"     = NES, Master System, Game Boy, C64
    // - "16-bit"    = SNES, Mega Drive, PC Engine, GBA
    // - "32-bit"    = PS1, Saturn, N64, DS
    // - "128-bit"   = Dreamcast, PS2, GameCube, Xbox, PSP
    // - "720p"      = PS3, Xbox 360, Wii, 3DS
    // - "1080p"     = PS4, Xbox One, Switch, Vita
    // - "4k"        = PS5, Switch 2
    //
    // null for controllers/accessories/cables where era is irrelevant.
    "era": "32-bit",

    // Primary system/platform family this hardware belongs to.
    // Links to a `system` type document via id.
    // Determines which system detail page lists this hardware.
    // For controllers/accessories: the system they were designed for.
    "system": "game-boy-advance-system",

    // Other systems this hardware is compatible with.
    // Array of system IDs. Used for backwards-compatible consoles or
    // cross-compatible controllers/accessories.
    //
    // For consoles: other system libraries playable on this hardware.
    //   Example: GBA SP → ["game-boy-system", "game-boy-color-system"]
    //   Example: Switch 2 → ["nintendo-switch-system"]
    //
    // For controllers: other hardware this controller works with (by hardware ID).
    //   Example: Pro Controller → ["nintendo-switch-2"]
    //   Example: Wii Remote Plus → ["nintendo-wii"]
    //
    // Use [] if no cross-compatibility.
    "compatible_with": ["game-boy-system", "game-boy-color-system"],

    // Franchise/product family grouping.
    "franchise": {
        // Main product family this belongs to.
        // Links to a `series` type document via id.
        // Use null if standalone / no series.
        "series": "game-boy-series",

        // More specific branch within the product family.
        // Links to a `series` type document via id.
        // Use null if not applicable.
        "subseries": "game-boy-advance-series"
    },

    // Companies that manufactured this hardware.
    // Array of company IDs. Links to `company` type documents.
    // Focus on manufacturers — distributors/retailers are irrelevant.
    "companies": [
        "nintendo-company"
    ],

    // Notable people associated with this hardware.
    // Array of person IDs. Links to `person` type documents.
    // Includes designers, engineers, architects — anyone worth highlighting.
    // Examples: Gunpei Yokoi (Game Boy), Ken Kutaragi (PlayStation), Masato Kuwahara (GBA SP)
    "people": [],

    // Commercial release line or product branding.
    // Examples: "Nintendo Classic Mini", "Sega Mini", "Player's Choice"
    // Use null if not part of any release line.
    "release_line": null,

    // Time-bound event, campaign, or anniversary.
    // Examples: "Super Mario Bros. 35th Anniversary", "The Legend of Zelda 35th Anniversary"
    // Use null if not tied to any event.
    "event": null,

    // ─── COLLECTION ────────────────────────────────────────────────────

    // Physical units: variants/editions/colors owned, wishlisted, or tracked.
    // Each entry represents one distinct variant of this hardware.
    // Merges the old "variants" + "ownership" concepts into one place.
    //
    // If variant identity doesn't matter (e.g., only one version exists),
    // use a single entry with name: null.
    "variants": [
        {
            // Variant display name (color, edition, bundle name).
            // null if this hardware has no meaningful variant distinction.
            "name": "Platinum",

            // Variant-specific cover image slug.
            // null to use the entry's default cover.
            "cover": "game-boy-advance-sp-platinum",

            // Ownership/wishlist status for this variant.
            // Allowed: "owned" | "wishlist" | "borrowed" | "unavailable"
            //
            // - "owned"       = currently owned
            // - "wishlist"    = wanted
            // - "borrowed"    = temporary access
            // - "unavailable" = tracked but not obtainable
            "status": "owned",

            // Event/anniversary tie-in for this specific variant.
            // null if not applicable.
            "event": null,

            // Variant-specific notes.
            // Examples: "Missing charger", "Includes box", "Battery replaced",
            //           "Third-party shell", "Used to own"
            "notes": null
        }
    ],

    // Acquisition and collection-prioritization metadata.
    // Answers: "Why should I procure, keep, upgrade, or wishlist this?"
    "acquisition": {
        // Personal collecting/procurement priority.
        // 1 = Low | 2 = Medium | 3 = High | 4 = Essential | 5 = Non-negotiable
        // null if not relevant.
        "priority": 5,

        // Collector-facing reason. Why this matters to the collection.
        "reason": "Preferred compact model for GBA library with GB/GBC compatibility.",

        // Acquisition-specific notes.
        // Examples: "Prefer PAL model", "Need charger", "Want boxed",
        //           "Already own original, upgrade only"
        "notes": null
    },

    // Built-in or included software.
    // Array of game entry IDs pre-loaded on this hardware.
    // Use for mini consoles, dedicated consoles, plug-and-play, Game & Watch devices.
    // Do NOT use for backwards-compatibility libraries.
    "contains": [],

    // Freeform personal notes about this hardware entry as a whole.
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
| `cover` | ✓ | string | Local image slug (→ `./assets/images/hardware/<slug>.png`) |
| `release` | ✓ | string | ISO 8601 date (`YYYY-MM-DD`) |
| `type` | ✓ | string | Always `"hardware"` |
| `category` | ✓ | enum | `console` \| `computer` \| `controller` \| `accessory` \| `peripheral` \| `adapter` \| `storage` \| `cable` |
| `aliases` | — | string[] | Official regional name differences |
| `form` | ✓ | enum | `home` \| `handheld` \| `hybrid` \| `mini` \| `dedicated` \| `plug_and_play` \| `add_on` \| `standard` \| `special` |
| `era` | — | enum \| null | `primitive` \| `classic` \| `8-bit` \| … \| `4k` |
| `system` | ✓ | string | System entry ID |
| `compatible_with` | — | string[] | System IDs (consoles) or hardware IDs (controllers/accessories) |
| `franchise.series` | — | string \| null | Series entry ID |
| `franchise.subseries` | — | string \| null | Subseries entry ID |
| `companies` | ✓ | string[] | Company entry IDs (manufacturers) |
| `people` | — | string[] | Person entry IDs (designers, engineers) |
| `release_line` | — | string \| null | Branded product line name |
| `event` | — | string \| null | Time-bound campaign/anniversary |

### Collection fields

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `variants` | ✓ | array | Physical units with name, cover, status, event, notes |
| `acquisition.priority` | — | number \| null | 1–5 procurement priority |
| `acquisition.reason` | — | string \| null | Why to collect |
| `acquisition.notes` | — | string \| null | Procurement notes |
| `contains` | — | string[] | Built-in game entry IDs |
| `notes` | — | string \| null | General freeform notes |

---

## Enums

```
Category:           console | computer | controller | accessory | peripheral | adapter | storage | cable

Form:               home | handheld | hybrid | mini | dedicated | plug_and_play |
                    add_on | standard | special

Era:                primitive | classic | 8-bit | 16-bit | 32-bit | 128-bit |
                    720p | 1080p | 4k

Variant Status:     owned | wishlist | borrowed | unavailable

Acquisition Priority: 1 (Low) | 2 (Medium) | 3 (High) | 4 (Essential) | 5 (Non-negotiable)
```

---

## Design notes

### Why merge `variants` and `ownership`?
Previously, `variants` cataloged what exists and `ownership` referenced variants by name string. This caused:
- Loose coupling via string matching
- Redundancy (variant name repeated in two places)
- Unclear what happens when ownership has `variant: null`

Now each variant entry carries its own `status`. If you own a Platinum and want a Cobalt Blue, they're two entries in `variants`. If variant identity doesn't matter, use `name: null`. Only list variants you own, want, or are tracking — not every color ever released.

### Why `category` and `form` are top-level (not nested in `hardware`)?
The old `hardware` object was a grab-bag mixing classification (`category`, `form`) with compatibility (`primary_family`, `compatible_families`) with era info (`generation`, `era`). Breaking it up:
- `category` + `form` + `era` = top-level taxonomy (what it IS)
- `system` + `compatible_with` = compatibility (what it PLAYS/WORKS WITH)
- No wrapper object needed

### Why remove `primary_family`?
Redundant with `system`. The `system` field already establishes which platform family this hardware represents. Games link to systems via their own `system` field, so the matching is already done.

### Why remove `generation`?
Numeric generations are arbitrary and inconsistent across companies. `era` provides a better curatorial label that actually communicates capability/context (an "8-bit" era device tells you more than "generation 3").

### Why `compatible_with` is dual-purpose?
For consoles, it references system IDs (what other libraries you can play). For controllers/accessories, it references hardware IDs (what devices they plug into). The context is clear from `category` — a console's compatibility is about software, a controller's compatibility is about hardware it connects to.

### Why `people`?
Hardware has notable designers: Gunpei Yokoi (Game Boy), Ken Kutaragi (PlayStation), Satoru Okada (DS), Lance Barr (NES industrial design). Same curation value as game creators.

### What about `franchise.series`/`subseries`?
Current data uses display strings ("Game Boy", "Switch 2") rather than IDs. These should migrate to series document IDs (`game-boy-series`, `switch-2-series`) for consistency with the game schema.

---

## Migration notes (from current data)

| Change | Action needed |
|--------|---------------|
| Flatten `hardware` object | Move `category`, `form`, `era` to top level; remove wrapper |
| Remove `hardware.primary_family` | Redundant with `system` ✓ (already has `system`) |
| Remove `hardware.generation` | Drop field entirely |
| `hardware.compatible_families` → `compatible_with` | Rename + unify with old `hardware.compatible_with` |
| Merge `ownership` into `variants` | Add `status` to each variant; remove separate `ownership` array |
| Handle no-variant entries | Entries with empty `variants` + `ownership`: create single variant with `name: null` |
| `companies` shape | Flatten `{manufacturer, publisher}` → flat array of IDs |
| `franchise.series`/`subseries` → IDs | Convert display strings to series document IDs |
| Add `people` | Start empty: `[]` |
| Add `release_line` | Extract from `event` where applicable (e.g., "Nintendo Classic Mini") |
| `cover` format | Already local slugs ✓ |
| Add `contains` population | Populate built-in game IDs for mini/dedicated consoles |
