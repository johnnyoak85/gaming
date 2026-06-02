# Release Line Schema

> Type: `release_line` — branded commercial product lines and retail series

A release line represents a persistent product branding applied to game releases: Classic NES Series, Player's Choice, Nintendo Selects, Super Mario Advance, Sega 3D Classics, Greatest Hits, etc. Entries reference release lines via their `release_line` field (by ID).

---

## Schema

```jsonc
{
    // Unique internal identifier.
    // Format: kebab-case slug with "-release-line" suffix.
    "id": "classic-nes-series-release-line",

    // Display name.
    "name": "Classic NES Series",

    // Short explanation of what this release line is.
    // One or two sentences — what it offers and why it exists.
    "description": "GBA ports of NES classics with faithful emulation. Known as Famicom Mini in Japan.",

    // Always "release_line" for this schema.
    "type": "release_line",

    // Local asset path for release line logo/badge.
    // Format: slug resolved to ./assets/icons/<slug>.png
    // null if no dedicated logo exists.
    "logo": "classic-nes-series-logo",

    // Approximate launch date of this product line.
    // When the first entry in this line was released.
    // Format: YYYY-MM-DD (ISO 8601).
    "date": "2004-02-14",

    // What kind of release line this is.
    // Allowed: "rerelease" | "budget" | "enhanced" | "compilation" | "storefront"
    //
    // - "rerelease"    = faithful ports/rereleases of older games (Classic NES Series, Sega Ages)
    // - "budget"       = reduced-price label for existing games (Player's Choice, Greatest Hits, Nintendo Selects)
    // - "enhanced"     = enhanced versions under a branded line (Super Mario Advance, 3D Classics)
    // - "compilation"  = branded compilation series (Mega Man Legacy Collection, Castlevania Anniversary)
    // - "storefront"   = digital-only retail channel (Virtual Console, Arcade Archives)
    "category": "rerelease",

    // Platform this release line targets.
    // Links to a system entry ID.
    // null if multi-platform (e.g., Virtual Console spans Wii/3DS/Wii U).
    "system": "game-boy-advance-system",

    // Company behind this product line.
    // Array of company IDs.
    "companies": [
        "nintendo-company"
    ],

    // Freeform notes.
    // Context about the line, its purpose, scope, etc.
    "notes": "GBA ports of NES classics. Known as 'Famicom Mini' in Japan."
}
```

---

## Field reference

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `id` | ✓ | string | Kebab-case slug with `-release-line` suffix |
| `name` | ✓ | string | Display name |
| `type` | ✓ | string | Always `"release_line"` |
| `logo` | — | string \| null | Icon slug (→ `./assets/icons/<slug>.png`) |
| `date` | ✓ | string | ISO 8601 date (line launch) |
| `category` | ✓ | enum | `rerelease` \| `budget` \| `enhanced` \| `compilation` \| `storefront` |
| `system` | — | string \| null | Target system entry ID (null if multi-platform) |
| `companies` | ✓ | string[] | Company entry IDs |
| `notes` | — | string \| null | Freeform notes |

---

## Enums

```
Category:   rerelease | budget | enhanced | compilation | storefront
```

---

## Design notes

### Why release lines as documents?
Previously, `release_line` was planned as a freeform string. Promoting to documents enables:
- Dedicated pages: "all Classic NES Series games"
- Consistent naming across entries
- Metadata: logos, target platforms, categories
- Filtering: "show me all budget labels" or "all GBA rerelease lines"

### Why `category`?
Release lines serve different purposes. A "Player's Choice" budget label is fundamentally different from a "Sega 3D Classics" enhanced port series. Category enables meaningful grouping and display.

### Why `system`?
Most release lines target one platform (Classic NES Series = GBA, Nintendo Selects = 3DS/Wii U). Some span multiple (Virtual Console = Wii + 3DS + Wii U). The field enables "show me all release lines for this system."

### How entries link to release lines
Collection entries reference release lines via `release_line` field containing the release line entry ID (e.g., `"release_line": "classic-nes-series-release-line"`). This replaces the old freeform string.

### ID convention: `-release-line` suffix
Same disambiguation pattern as other types. "Classic NES Series" could collide with a compilation game entry — the suffix prevents that.

### Examples of release lines

| Release Line | Category | System | Company |
|-------------|----------|--------|---------|
| Classic NES Series | rerelease | GBA | Nintendo |
| Super Mario Advance | enhanced | GBA | Nintendo |
| Sega 3D Classics | enhanced | 3DS | Sega |
| Sega Ages | enhanced | Switch | Sega |
| Player's Choice | budget | GameCube | Nintendo |
| Nintendo Selects | budget | 3DS/Wii U | Nintendo |
| Greatest Hits | budget | PlayStation | Sony |
| Virtual Console | storefront | multi | Nintendo |
| Arcade Archives | storefront | multi | Hamster/SNK |
| Mega Man Legacy Collection | compilation | multi | Capcom |

---

## Migration notes

| Change | Action needed |
|--------|---------------|
| Create release line entries | One document per unique product line identified |
| Update game references | Replace freeform `release_line` strings with entry IDs |
| Separate from `event` | Entries currently using `event` for product lines (e.g., "Super Mario Advance") need migration |
| Add to manifest | New entries need manifest.json registration |
| Create logos | Where product line branding exists |
