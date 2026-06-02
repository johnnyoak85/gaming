# Event Schema

> Type: `event` — time-bound campaigns, anniversaries, and launches

An event represents a specific occasion that motivated one or more releases: an anniversary celebration, a promotional campaign, a console launch, or a commemorative initiative. Entries reference events via their `event` field (by ID).

---

## Schema

```jsonc
{
    // Unique internal identifier.
    // Format: kebab-case slug with "-event" suffix.
    "id": "super-mario-bros-35th-anniversary-event",

    // Display name.
    "name": "Super Mario Bros. 35th Anniversary",

    // Short explanation of what this event is.
    // One or two sentences — what happened and why it matters.
    "description": "Nintendo's celebration of 35 years of Super Mario Bros. with limited-time releases and special hardware.",

    // Always "event" for this schema.
    "type": "event",

    // Local asset path for event logo/badge.
    // Format: slug resolved to ./assets/icons/<slug>.png
    // null if no dedicated logo exists.
    "logo": "super-mario-35th-logo",

    // Event date or start date.
    // For anniversaries: the date the celebration was announced/kicked off.
    // For launches: the launch date.
    // For campaigns: the start date.
    // Format: YYYY-MM-DD (ISO 8601).
    "date": "2020-09-03",

    // End date for multi-day/multi-month campaigns.
    // null for single-day events or when end is not meaningful.
    // Format: YYYY-MM-DD (ISO 8601).
    "end_date": "2021-03-31",

    // What kind of event this is.
    // Allowed: "anniversary" | "campaign" | "launch" | "commemoration"
    //
    // - "anniversary"    = franchise/game/hardware birthday celebration
    // - "campaign"       = marketing initiative (Year of Luigi, My Nintendo push)
    // - "launch"         = hardware or major software launch event
    // - "commemoration"  = tribute, memorial, or one-off celebration
    "category": "anniversary",

    // Franchise(s) this event celebrates.
    // Array of series entry IDs.
    // Use [] for cross-franchise events (console launches, company anniversaries).
    "franchise": [
        "super-mario-series"
    ],

    // Company behind the event.
    // Array of company IDs.
    "companies": [
        "nintendo-company"
    ],

    // Freeform notes.
    // Context about the event, what was announced, significance, etc.
    "notes": "Nintendo celebrated Mario's 35th with limited-time releases, Game & Watch hardware, and Super Mario 3D All-Stars."
}
```

---

## Field reference

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `id` | ✓ | string | Kebab-case slug with `-event` suffix |
| `name` | ✓ | string | Display name |
| `type` | ✓ | string | Always `"event"` |
| `logo` | — | string \| null | Icon slug (→ `./assets/icons/<slug>.png`) |
| `date` | ✓ | string | ISO 8601 date (start/announcement) |
| `end_date` | — | string \| null | ISO 8601 date (end of campaign) |
| `category` | ✓ | enum | `anniversary` \| `campaign` \| `launch` \| `commemoration` |
| `franchise` | — | string[] | Series entry IDs |
| `companies` | ✓ | string[] | Company entry IDs |
| `notes` | — | string \| null | Freeform notes |

---

## Enums

```
Category:   anniversary | campaign | launch | commemoration
```

---

## Design notes

### Why events as documents?
Previously, `event` was a freeform string on game/hardware/amiibo entries ("Super Mario Bros. 35th Anniversary"). Promoting events to their own documents enables:
- Dedicated event pages showing everything released for that occasion
- Consistent naming (no "The Year of Luigi" vs "Year of Luigi" drift)
- Metadata: dates, logos, related franchises
- Cross-type views: "all games + hardware + amiibo + merch from this anniversary"

### Why `date` + `end_date`?
Some events are moments (a launch day). Others span months (Year of Luigi ran ~12 months, Mario 35th ran Sept 2020–March 2021). The pair captures both.

### Why `category`?
Distinguishes character between anniversary celebrations, marketing campaigns, hardware launches, and one-off commemorations. Enables filtering: "show me all anniversary events."

### How entries link to events
Collection entries (games, hardware, amiibo, merchandise) reference events via `event` field containing the event entry ID (e.g., `"event": "super-mario-bros-35th-anniversary-event"`). This replaces the old freeform string.

### ID convention: `-event` suffix
Same disambiguation pattern as other types. Prevents collision if an event name overlaps with a game or series.

---

## Migration notes

| Change | Action needed |
|--------|---------------|
| Create event entries | One document per unique `event` string currently in use |
| Update references | Replace freeform `event` strings on all entries with event entry IDs |
| Add to manifest | New entries need manifest.json registration |
| Create logos | Where event-specific branding exists |
