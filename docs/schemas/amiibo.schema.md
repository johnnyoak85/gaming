# Amiibo Schema

> Type: `amiibo` — NFC figures, cards, and related collectibles

This document defines the canonical shape of amiibo entries. It is organized around two concerns:

1. **Taxonomy** — What is this figure? What line is it from? What does it do?
2. **Collection** — Do I own it? Should I acquire it?

---

## Schema

```jsonc
{
    // ─── TAXONOMY ──────────────────────────────────────────────────────

    // Unique internal identifier.
    // Format: kebab-case slug.
    "id": "simon-amiibo",

    // Display name.
    // Usually the character/figure name as shown on the packaging.
    "name": "Simon",

    // Short explanation of what this amiibo is.
    // One or two sentences — character context and line info.
    "description": "Simon Belmont from the Castlevania series. Part of the Super Smash Bros. Collection.",

    // Local asset path for cover image.
    // Format: slug resolved to ./assets/images/amiibo/<slug>.png
    // Migration: existing amiibo.life URLs will be downloaded locally via script.
    "cover": "simon-amiibo",

    // Original release date (earliest worldwide).
    // Format: YYYY-MM-DD (ISO 8601).
    "release": "2019-11-08",

    // Always "amiibo" for this schema.
    "type": "amiibo",

    // Physical form of the amiibo.
    // Allowed: "figure" | "card" | "plush" | "cereal"
    //
    // - "figure"  = standard NFC figure/statue
    // - "card"    = amiibo card (Animal Crossing, Mario Sports, etc.)
    // - "plush"   = yarn/plush amiibo (Yoshi's Woolly World, etc.)
    // - "cereal"  = novelty form (cereal box, etc.)
    "form": "figure",

    // Amiibo product line grouping.
    "franchise": {
        // Amiibo product line this figure belongs to.
        // Links to a `series` type document via id.
        // Examples: super-smash-bros-series, super-mario-series, the-legend-of-zelda-series
        "series": "super-smash-bros-series",

        // Character's source franchise or specific game tie-in.
        // Links to a `series` type document via id.
        // For Smash Bros: the character's home franchise (castlevania-series)
        // For game-specific lines: the specific game (breath-of-the-wild-series)
        // null if same as series or not applicable.
        "subseries": "castlevania-series"
    },

    // Amiibo-specific collection/catalog metadata.
    "catalog": {
        // Official number within the amiibo line.
        // Primarily relevant for Super Smash Bros. line.
        // null if the line is not numbered.
        "number": 78,

        // Release wave or collector grouping.
        // Useful for sorting and chronological context.
        "wave": "Super Smash Bros. Wave 16"
    },

    // In-game functionality per compatible game.
    // Answers: "What does this amiibo do?" and enables cross-reference with game pages.
    "functionality": [
        {
            // Game entry ID.
            "game": "super-smash-bros-ultimate",

            // Human-readable effect description.
            "effect": "Battle and train up a computer-controlled Figure Player of the character."
        }
    ],

    // Time-bound event, campaign, or anniversary this amiibo is tied to.
    // Examples: "Super Mario Bros. 30th Anniversary", "Zelda: Skyward Sword 10th Anniversary"
    // Use null if not tied to any event.
    "event": null,

    // ─── COLLECTION ────────────────────────────────────────────────────

    // Ownership/wishlist status.
    // Allowed: "owned" | "wishlist"
    "ownership": "owned",

    // Acquisition and collection-prioritization metadata.
    // Answers: "Why should I acquire this?"
    // Most useful for wishlisted amiibos. Can be null if not applicable.
    "acquisition": {
        // Personal collecting/procurement priority.
        // 1 = Low | 2 = Medium | 3 = High | 4 = Essential | 5 = Non-negotiable
        // null if not relevant.
        "priority": null,

        // Collector-facing reason. Why this matters to the collection.
        "reason": null,

        // Acquisition-specific notes.
        // Examples: "Pre-ordered", "Japan exclusive", "Hard to find"
        "notes": null
    },

    // Freeform personal notes about this amiibo.
    // Physical oddities, special materials, glow-in-the-dark, size differences, etc.
    // Examples: "Glows in the dark", "Larger than normal; has transparent details"
    "notes": null
}
```

---

## Field reference

### Taxonomy fields

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `id` | ✓ | string | Kebab-case unique slug |
| `name` | ✓ | string | Display name (character/figure) |
| `cover` | ✓ | string | Local image slug (→ `./assets/images/amiibo/<slug>.png`) |
| `release` | ✓ | string | ISO 8601 date (`YYYY-MM-DD`) |
| `type` | ✓ | string | Always `"amiibo"` |
| `form` | ✓ | enum | `figure` \| `card` \| `plush` \| `cereal` |
| `franchise.series` | ✓ | string | Series entry ID (amiibo product line) |
| `franchise.subseries` | — | string \| null | Series entry ID (character origin / game tie-in) |
| `catalog.number` | — | number \| null | Official line number |
| `catalog.wave` | — | string \| null | Release wave grouping |
| `functionality` | — | array | Per-game effects ({game, effect}) |
| `event` | — | string \| null | Time-bound campaign/anniversary |

### Collection fields

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `ownership` | ✓ | enum | `owned` \| `wishlist` |
| `acquisition.priority` | — | number \| null | 1–5 procurement priority |
| `acquisition.reason` | — | string \| null | Why to collect |
| `acquisition.notes` | — | string \| null | Procurement notes |
| `notes` | — | string \| null | Physical oddities / personal notes |

---

## Enums

```
Form:               figure | card | plush | cereal

Ownership:          owned | wishlist

Acquisition Priority: 1 (Low) | 2 (Medium) | 3 (High) | 4 (Essential) | 5 (Non-negotiable)
```

---

## Design notes

### Why `form` as a new field?
Amiibos come in different physical formats: standard figures (most common), NFC cards (Animal Crossing, Mario Sports Superstars), yarn plushes (Yoshi's Woolly World), and novelties. This enables filtering/display per format and future-proofs for card collections.

### Why rename `amiibo` → `catalog`?
The old `amiibo` wrapper (containing `number` and `wave`) was named after the type itself, which is redundant — you already know it's an amiibo from `type`. `catalog` better describes what these fields are: catalog/collector metadata for organizing within a line.

### Why add `acquisition`?
Consistency with games and hardware. For wishlisted amiibos, it answers "why do I want this?" and "how hard is it to get?" (e.g., exclusive, discontinued, region-locked). For owned amiibos it can be null/empty.

### Why no `system` field?
Amiibos are cross-platform by design — they work across Wii U, 3DS, Switch, and Switch 2. There's no single system they "belong to." The `functionality` array already captures per-game/per-platform compatibility.

### Why no `companies` or `people`?
All amiibos are manufactured by Nintendo. The creative work is the character design, which belongs to the game/franchise, not the figure. If a specific sculptor/artist becomes relevant for curation, `people` can be added later.

### Why `franchise.subseries` has dual semantics?
For Smash Bros amiibo, subseries = character's home franchise (where the character comes from). For game-specific lines (Zelda, Splatoon), subseries = the specific game tie-in. Both represent "more specific origin grouping" — it's the same concept at different granularity levels.

### `catalog.number` should be a number, not a string
Current data has numbers stored as strings (`"78"`, `"35"`). These should be migrated to actual numbers for sorting.

---

## Migration notes (from current data)

| Change | Action needed |
|--------|---------------|
| Rename `amiibo` → `catalog` | Rename wrapper object |
| `catalog.number` type | Convert strings to numbers |
| `franchise.series`/`subseries` → IDs | Convert display strings to series document IDs |
| `cover` → local | Run download script (future); replace amiibo.life URLs with slugs |
| Add `form` | Set `"figure"` for all current entries (all are figures) |
| Add `acquisition` | Add `{priority: null, reason: null, notes: null}` to all; populate for wishlist entries |
| `ownership` | Already correct format ✓ |
| `functionality` | Already correct format ✓ |
| `event` | Already correct format ✓ |
