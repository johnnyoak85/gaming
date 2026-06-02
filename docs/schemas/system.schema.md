# System Schema

> Type: `system` — platform families that group games and hardware

A system represents a software platform family: NES, Game Boy, Switch, etc. Games and hardware link to systems via their `system` field. Systems are the primary axis for browsing "what do I have for this platform?"

---

## Schema

```jsonc
{
    // Unique internal identifier.
    // Format: kebab-case slug with "-system" suffix ALWAYS.
    // The suffix disambiguates from hardware entries with the same name.
    // Example: "nintendo-entertainment-system-system" because
    //          "nintendo-entertainment-system" is the hardware entry ID.
    "id": "game-boy-advance-system",

    // Display name.
    "name": "Game Boy Advance",

    // Short explanation of what this system is.
    // One or two sentences — positioning and significance.
    "description": "Nintendo's 32-bit handheld successor to the Game Boy Color. Home to GBA-exclusive titles and SNES-quality portable games.",

    // Always "system" for this schema.
    "type": "system",

    // Local asset path for system logo/icon.
    // Format: slug resolved to ./assets/icons/<slug>.png
    "logo": "game-boy-advance-logo",

    // Display-era label matching the hardware era.
    // Allows grouping/filtering systems by technological generation.
    // Allowed: "primitive" | "classic" | "8-bit" | "16-bit" | "32-bit" | "128-bit" | "720p" | "1080p" | "4k"
    // null for digital-only platforms (DSiWare, WiiWare, eShop).
    "era": "32-bit",

    // Primary company behind this system.
    // Array of company IDs. Links to `company` type documents.
    "companies": [
        "nintendo-company"
    ],

    // Parent system for sub-platforms and digital storefronts.
    // Links to another system entry by id.
    // Examples:
    //   DSiWare → "nintendo-ds"
    //   WiiWare → "nintendo-wii"
    //   Xbox Live Arcade → "xbox-360"
    //   Virtual Console is per-host, not a single parent.
    // null for standalone systems.
    "parent": null,

    // Curated list of essential entries for this system.
    // Array of entry IDs (games, hardware, amiibo, merchandise).
    // Represents "the must-haves for this platform" — a personal editorial selection.
    "essentials": [
        "super-mario-bros",
        "the-legend-of-zelda",
        "metroid"
    ],

    // Major series that started on or are most associated with this system.
    // Array of series entry IDs.
    // Represents franchises born on or defined by this platform.
    "series": [
        "super-mario-series",
        "the-legend-of-zelda-series",
        "metroid-series"
    ],

    // Named eras within this system's lifespan.
    // Defines curatorial periods for browsing and grouping.
    // Games are assigned to eras via their release year falling within the range.
    "eras": [
        {
            // Era display name.
            "title": "Black Box / Arcade Roots Era",

            // Start year (inclusive).
            "start_year": 1985,

            // End year (inclusive). null if ongoing.
            "end_year": 1986,

            // What characterizes this era.
            "description": "Early simple-score, arcade-like games and foundational Nintendo releases."
        },
        {
            "title": "Expansion / Identity Era",
            "start_year": 1987,
            "end_year": 1989,
            "description": "The NES becomes a home for deeper, console-native adventures and long-running series identities."
        },
        {
            "title": "Late Mastery Era",
            "start_year": 1990,
            "end_year": 1994,
            "description": "Late-generation technical and design refinement before and alongside the SNES transition."
        }
    ],

    // Freeform notes.
    "notes": null
}
```

---

## Field reference

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `id` | ✓ | string | Kebab-case slug with `-system` suffix always |
| `name` | ✓ | string | Display name |
| `description` | ✓ | string | Short explanation of what this system is |
| `type` | ✓ | string | Always `"system"` |
| `logo` | ✓ | string | Icon slug (→ `./assets/icons/<slug>.png`) |
| `era` | — | enum \| null | `primitive` \| `classic` \| `8-bit` \| … \| `4k` |
| `companies` | ✓ | string[] | Company entry IDs |
| `parent` | — | string \| null | Parent system entry ID |
| `essentials` | — | string[] | Curated essential entry IDs |
| `series` | — | string[] | Major series started on/associated with this system |
| `eras` | — | array | Named periods: `[{title, start_year, end_year, description}]` |
| `notes` | — | string \| null | Freeform notes |

---

## Enums

```
Era:    primitive | classic | 8-bit | 16-bit | 32-bit | 128-bit | 720p | 1080p | 4k
```

---

## Design notes

### Why add `era` and `companies`?
The current system entries are bare stubs (`id`, `name`, `logo`). Adding `era` enables grouping systems by generation on the systems list page. Adding `companies` enables "show me all Nintendo systems" or "all Sega systems."

### Why `parent`?
Digital storefronts (DSiWare, WiiWare, Xbox Live Arcade) are sub-platforms of a host system. `parent` makes that hierarchy explicit without needing a separate field. Standalone systems have `parent: null`.

### Why no `release` date?
Systems don't have a single release date — they launched on different dates in different regions. The hardware entries (which link to systems) carry their own release dates. The system is an abstract grouping.

### Why no `circle`?
Unlike series and companies, all systems are equally worth showing. There's no "minor system I don't want on the list page" — every system with entries should appear.

### ID convention: mandatory `-system` suffix
Every system entry MUST end with `-system`. This disambiguates from hardware entries sharing the same platform name. `nintendo-entertainment-system-system` is correct — `nintendo-entertainment-system` is the hardware entry. Without the suffix, adding a hardware entry later creates a collision. Current data has entries missing the suffix (e.g., `game-boy-advance` should be `game-boy-advance-system`). Migration should normalize all system IDs and update references.

---

## Migration notes

| Change | Action needed |
|--------|---------------|
| Add `description` | Populate for all systems |
| Add `era` | Populate from hardware entries' era values |
| Add `companies` | Populate from hardware/game companies |
| Add `parent` | Set for DSiWare, WiiWare, Xbox Live Arcade; null for rest |
| Add `series` | Populate with major franchises born on each platform |
| Add `notes` | Set null for all initially |
| Normalize IDs | Add `-system` suffix to entries missing it; update all references |
| Create missing entries | `game-watch`, `famicom-disk-system`, `sega-cd`, etc. |
| Fix typos | `game-boy;p=` reference in data |
