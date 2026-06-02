# Company Schema

> Type: `company` — game developers, studios, and manufacturers

A company represents a game development studio or manufacturer. Entries link to companies via `companies` arrays. Companies are the primary axis for browsing "what did this studio make?"

---

## Schema

```jsonc
{
    // Unique internal identifier.
    // Format: kebab-case slug with "-company" suffix.
    "id": "nintendo-company",

    // Display name.
    "name": "Nintendo",

    // Short explanation of what this company is/was.
    // One or two sentences — identity and significance.
    "description": "Japanese game company and console manufacturer. Creator of Mario, Zelda, and Pokémon.",

    // Always "company" for this schema.
    "type": "company",

    // Local asset path for company logo/icon.
    // Format: slug resolved to ./assets/icons/<slug>.png
    "logo": "nintendo-logo",

    // Visibility tier on list pages.
    // Controls whether this company appears in the main list, a secondary section, or is hidden.
    // Allowed: "major" | "minor" | "sub"
    //
    // - "major" = primary studio, always shown on list page (Nintendo, Capcom, Konami)
    // - "minor" = secondary studio, shown in secondary section (Taito, Technos Japan)
    // - "sub"   = internal/subsidiary studio, only shown as a child of its parent
    //             (HAL Laboratory, Intelligent Systems under Nintendo)
    "circle": "major",

    // Founding date.
    // Format: YYYY-MM-DD (ISO 8601).
    // null if unknown.
    "founded": "1889-09-23",

    // Whether the company is no longer operating independently.
    // null if still active.
    // If defunct, the value is an object describing what happened.
    "defunct": null,

    // Example of a defunct company:
    // "defunct": {
    //     // Date the company ceased independent operation.
    //     // Format: YYYY-MM-DD.
    //     "date": "2003-04-01",
    //
    //     // What happened. Allowed: "merged" | "acquired" | "dissolved" | "renamed"
    //     "reason": "merged",
    //
    //     // Successor company entry ID (if merged/acquired/renamed).
    //     // null if dissolved with no successor.
    //     "successor": "square-enix-company"
    // },

    // Subsidiary studios or internal teams owned by this company.
    // Array of company entry IDs.
    // Only list direct children.
    "contains": [
        "hal-laboratory-company",
        "intelligent-systems-company"
    ],

    // Country of origin.
    // ISO 3166-1 alpha-2 country code.
    // Examples: "JP", "US", "GB", "FR"
    "country": "JP",

    // Notable people associated with this company.
    // Array of person IDs. Links to `person` type documents.
    // Founders, key directors, legendary designers.
    "people": [
        "shigeru-miyamoto",
        "satoru-iwata"
    ],

    // Curated list of essential entries from this company.
    // Array of entry IDs (games, hardware, amiibo, merchandise).
    // Represents "the best of this studio" — a personal editorial selection.
    "essentials": [
        "super-mario-bros",
        "the-legend-of-zelda-breath-of-the-wild",
        "metroid-prime"
    ],

    // Named eras within this company's history.
    // Defines curatorial periods for browsing and grouping.
    // Games are assigned to eras via their release year falling within the range.
    "eras": [
        {
            // Era display name.
            "title": "Golden Age",

            // Start year (inclusive).
            "start_year": 1983,

            // End year (inclusive). null if ongoing.
            "end_year": 1996,

            // What characterizes this era.
            "description": "Console market creation, NES/SNES dominance, and genre-defining franchises."
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
| `id` | ✓ | string | Kebab-case slug with `-company` suffix |
| `name` | ✓ | string | Display name |
| `description` | ✓ | string | Short explanation of what this company is/was |
| `type` | ✓ | string | Always `"company"` |
| `logo` | ✓ | string | Icon slug (→ `./assets/icons/<slug>.png`) |
| `circle` | ✓ | enum | `major` \| `minor` \| `sub` |
| `founded` | — | string \| null | ISO 8601 date |
| `defunct` | — | object \| null | `{ date, reason, successor }` or null if active |
| `contains` | — | string[] | Subsidiary company entry IDs |
| `country` | — | string \| null | ISO 3166-1 alpha-2 code |
| `people` | — | string[] | Person entry IDs |
| `essentials` | — | string[] | Curated essential entry IDs |
| `eras` | — | array | Named periods: `[{title, start_year, end_year, description}]` |
| `notes` | — | string \| null | Freeform notes |

---

## Enums

```
Circle:         major | minor | sub

Defunct Reason:  merged | acquired | dissolved | renamed
```

---

## Design notes

### Why `defunct` as a structured object?
Simple boolean `active: false` doesn't capture what happened. Knowing Square was "merged" into "square-enix-company" enables:
- Showing a banner on the company page: "Merged into Square Enix (2003)"
- Linking to the successor for navigation
- Filtering active vs. defunct studios

### Why `country`?
Enables "show me all Japanese developers" — a meaningful curatorial filter. Using ISO country codes keeps it simple and standard.

### Why `contains` for subsidiaries?
Same pattern as series `contains`. Nintendo's page can show HAL Laboratory and Intelligent Systems as internal studios. The hierarchy renders downward.

### Why `people`?
Companies have legendary figures: Miyamoto at Nintendo, Tokuro Fujiwara at Capcom, Yuji Naka at Sega. Linking enables cross-references between company pages and person pages.

### Why `eras`?
Companies go through distinct creative periods (Capcom's arcade golden age vs. their fighting game era vs. modern RE era). Enables curated timeline browsing on the company detail page.

---

## Migration notes

| Change | Action needed |
|--------|---------------|
| Add `description` | Populate for all companies |
| Add `defunct` | Set null for active companies; populate for Square, Enix, Technos Japan, etc. |
| Add `country` | Populate for all companies |
| Add `people` | Start empty: `[]`, populate incrementally |
| Add `eras` | Start empty: `[]`, populate incrementally |
| Add `notes` | Set null for all initially |
| Add `founded` for missing | Populate for Square, Enix, Square Enix |
| `contains` | Already present ✓ |
| `circle` | Already present ✓ |
| `founded` | Already present for most ✓ |
