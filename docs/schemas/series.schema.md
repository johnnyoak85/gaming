# Series Schema

> Type: `series` — franchise groupings that connect games, hardware, amiibo, and merchandise

A series represents a franchise or product family: Super Mario, Castlevania, Game Boy, etc. Entries link to series via `franchise.series` and `franchise.subseries`. Series are the primary axis for browsing "everything in this franchise."

---

## Schema

```jsonc
{
    // Unique internal identifier.
    // Format: kebab-case slug with "-series" suffix.
    "id": "super-mario-series",

    // Display name.
    "name": "Super Mario",

    // Short explanation of what this series is.
    // One or two sentences — franchise identity and scope.
    "description": "Nintendo's flagship platforming franchise starring Mario. Spans 2D, 3D, sports, RPG, and party sub-franchises.",

    // Always "series" for this schema.
    "type": "series",

    // Local asset path for series logo/icon.
    // Format: slug resolved to ./assets/icons/<slug>.png
    "logo": "super-mario-logo",

    // Visibility tier on list pages.
    // Controls whether this series appears in the main list, a secondary section, or is hidden.
    // Allowed: "major" | "minor" | "sub"
    //
    // - "major" = prominent franchise, always shown on list page
    // - "minor" = smaller franchise, shown in secondary section or collapsed
    // - "sub"   = subseries only — never shown as standalone on list page,
    //             only appears as a child of its parent series
    "circle": "major",

    // Subseries contained within this series.
    // Array of series entry IDs.
    // Defines the hierarchy: Super Mario contains Super Mario Bros., Dr. Mario, etc.
    // Only list direct children, not grandchildren.
    // Use [] if this series has no subseries.
    "contains": [
        "super-mario-bros-series",
        "mario-bros-series",
        "dr-mario-series",
        "donkey-kong-series"
    ],

    // Primary companies associated with this franchise.
    // Array of company IDs. Links to `company` type documents.
    // The main developers/creators of the franchise — not every company that ever touched it.
    "companies": [
        "nintendo-company"
    ],

    // Notable people associated with this franchise.
    // Array of person IDs. Links to `person` type documents.
    // Key creators, directors, composers who shaped the series.
    "people": [
        "shigeru-miyamoto",
        "koji-kondo"
    ],

    // Curated list of essential entries for this series.
    // Array of entry IDs (games, hardware, amiibo, merchandise).
    // Represents "the must-play/must-have for this franchise" — a personal editorial selection.
    "essentials": [
        "super-mario-bros",
        "super-mario-bros-3",
        "super-mario-world"
    ],

    // Named eras within this franchise's history.
    // Defines curatorial periods for browsing and grouping.
    // Games are assigned to eras via their release year falling within the range.
    "eras": [
        {
            // Era display name.
            "title": "Classic Era",

            // Start year (inclusive).
            "start_year": 1985,

            // End year (inclusive). null if ongoing.
            "end_year": 1996,

            // What characterizes this era.
            "description": "The original 2D platformers that defined the franchise."
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
| `id` | ✓ | string | Kebab-case slug with `-series` suffix |
| `name` | ✓ | string | Display name |
| `description` | ✓ | string | Short explanation of what this series is |
| `type` | ✓ | string | Always `"series"` |
| `logo` | ✓ | string | Icon slug (→ `./assets/icons/<slug>.png`) |
| `circle` | ✓ | enum | `major` \| `minor` \| `sub` |
| `contains` | — | string[] | Subseries entry IDs |
| `companies` | — | string[] | Company entry IDs (primary franchise creators) |
| `people` | — | string[] | Person entry IDs (key creators) |
| `essentials` | — | string[] | Curated essential entry IDs |
| `eras` | — | array | Named periods: `[{title, start_year, end_year, description}]` |
| `notes` | — | string \| null | Freeform notes |

---

## Enums

```
Circle:     major | minor | sub
```

---

## Design notes

### Why `contains` for hierarchy?
Series have natural hierarchies: Super Mario → Super Mario Bros., Dr. Mario, Donkey Kong. Rather than a `parent` field on each child (which forces you to query upward), `contains` on the parent lets you render the tree downward — which is what the UI needs.

### Why `circle` instead of a boolean `visible`?
Three tiers give more control. `major` franchises (Mario, Zelda, Castlevania) get prominent placement. `minor` franchises (Balloon Fight, Ice Climber) appear but less prominently. `sub` franchises (Super Mario Bros., Metroid Prime) never appear standalone — they only exist as children of a parent series.

### Why `companies`?
Enables "show me all Capcom franchises" or "all Konami series." A franchise's primary developer is a strong curatorial signal.

### Why no `release` date or `era`?
A franchise spans decades and systems. There's no single meaningful date. Individual entries (games, hardware) carry their own dates.

### Series vs subseries linking
Games link to series via `franchise.series` (main) and `franchise.subseries` (specific branch). The series hierarchy defined by `contains` must match what games reference. If Super Mario Bros. is a subseries of Super Mario, then games should have `franchise: { series: "super-mario-series", subseries: "super-mario-bros-series" }`.

---

## Migration notes

| Change | Action needed |
|--------|---------------|
| Add `description` | Populate for all series |
| Add `companies` | Populate from franchises' primary developers |
| Add `people` | Populate with key creators per franchise |
| Add `notes` | Set null for all initially |
| `franchise.series`/`subseries` consistency | Verify game entries reference valid series IDs |
| Ensure `-series` suffix | Normalize IDs that don't follow convention |
| `contains` validation | Verify all referenced subseries exist as entries |
