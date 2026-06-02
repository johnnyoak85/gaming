# Merchandise Schema

> Type: `merchandise` — physical collectibles, media, promotional items, and display pieces

This document defines the canonical shape of merchandise entries. It covers everything in the gaming collection that isn't playable software or active hardware: figures, books, soundtracks, LEGO, steelbooks, promotional rewards, collector's edition extras, and display pieces.

Organized around two concerns:

1. **Taxonomy** — What is this? What does it represent? Where did it come from?
2. **Collection** — Do I own it? Is it worth acquiring?

---

## What qualifies as merchandise?

### Always included
| Category | Examples | Why |
|----------|----------|-----|
| Soundtracks | CDs, vinyl, cassettes | Historical + collectible audio |
| Artbooks | Art of Zelda, Metroid Dread artbook | Preservation, lore, visual history |
| Strategy guides | Official guides, limited hardcovers | Gaming culture artifacts |
| Steelbooks | Game steelbook cases | Collector release artifacts |
| Collector's edition boxes | Outer packaging, premium boxes | Physical release identity |
| CE extras | Scarves, maps, medals, coins, pins | Directly tied to a release |
| Figures | UDF, Nendoroid, World of Nintendo | Display collectibles |
| Statues/statuettes | First 4 Figures, Dark Horse statues | Premium display pieces |
| LEGO sets | LEGO NES, LEGO Mario sets | Display/crossover history |
| Dioramas | Console Heroes cartridge dioramas | Display art |
| Music toys | Kirby Otamatone | Licensed novelty collectibles |
| Video/film | Bonus DVDs, behind-the-scenes | Release artifacts |
| Promotional rewards | My Nintendo items, Club Nintendo items | Limited/exclusive rewards |
| Event exclusives | Convention items, anniversary items | Limited-run collectibles |

### Conditionally included (must be official + tied to specific release/event/campaign)
| Category | Condition |
|----------|-----------|
| Pins | Anniversary, event-exclusive, or My Nintendo reward only |
| Keychains | Anniversary, event-exclusive, or premium only |
| Coins/medals | Commemorative or reward-based only |
| Patches/charms | Event-exclusive or reward-based only |
| Clothing/wearables | Limited/event-exclusive only (not evergreen merch) |

### Always excluded
| Category | Why |
|----------|-----|
| Posters | Too generic, even when official |
| Fast-food toys | Mass-market promotional, not collectible |
| Generic evergreen merch | T-shirts, mugs, phone cases from general retail |
| Bootleg/unofficial | Not part of curation |

---

## Schema

```jsonc
{
    // ─── TAXONOMY ──────────────────────────────────────────────────────

    // Unique internal identifier.
    // Format: kebab-case slug.
    "id": "ultra-detail-figure-link-majoras-mask",

    // Display name.
    "name": "Ultra Detail Figure: Link (Majora's Mask)",

    // Short explanation of what this item is.
    // One or two sentences — what it depicts and why it's notable.
    "description": "Medicom UDF figure of Link wearing the Fierce Deity Mask from Majora's Mask.",

    // Local asset path for cover image.
    // Format: slug resolved to ./assets/images/merchandise/<slug>.png
    "cover": "udf-link-majoras-mask",

    // Original release date.
    // Format: YYYY-MM-DD (ISO 8601).
    // Use best-known date; null if truly unknown.
    "release": "2020-06-15",

    // Always "merchandise" for this schema.
    "type": "merchandise",

    // What kind of merchandise this is.
    // Allowed:
    // - "soundtrack"       = official soundtrack (CD, vinyl, cassette, digital-with-physical)
    // - "video"            = official DVD/Blu-ray/bonus video release
    // - "artbook"          = official art, lore, design, or history book
    // - "guide"            = official strategy guide or walkthrough
    // - "manga"            = official manga adaptation or tie-in
    // - "steelbook"        = standalone or bundled steelbook case
    // - "collector_box"    = collector's/limited edition outer package or display box
    // - "collector_extra"  = physical extra bundled with a game CE (scarf, map, medal, etc.)
    // - "figure"           = collectible figure (UDF, Nendoroid, World of Nintendo, etc.)
    // - "statue"           = larger/premium display statue or statuette (First 4 Figures, etc.)
    // - "plush"            = official plush/stuffed collectible
    // - "lego"             = gaming-related LEGO set or figure
    // - "diorama"          = display scene or deco piece (Console Heroes, etc.)
    // - "music_toy"        = music-related collectible object (Otamatone, music box, etc.)
    // - "replica"          = prop replica, weapon replica, wearable replica
    // - "pin"              = enamel pin (event/reward-exclusive only)
    // - "keychain"         = keychain (event/reward-exclusive only)
    // - "coin"             = commemorative coin or medal
    // - "patch"            = embroidered patch (event/reward-exclusive only)
    // - "charm"            = phone charm, bag charm (event/reward-exclusive only)
    // - "clothing"         = limited/event-exclusive wearable (not evergreen retail)
    // - "card"             = trading card, art card, collectible card (not amiibo)
    // - "poster_print"     = limited/numbered art print (not generic posters)
    // - "misc"             = anything else that qualifies but doesn't fit above
    "category": "figure",

    // Physical material/media form.
    // Describes what you're physically holding.
    // Allowed:
    // - "book"         = printed book (artbook, guide, manga)
    // - "cd"           = compact disc
    // - "vinyl"        = vinyl record
    // - "cassette"     = audio cassette
    // - "dvd"          = DVD disc
    // - "blu_ray"      = Blu-ray disc
    // - "steelbook"    = metal case
    // - "figure"       = molded/painted figure
    // - "statue"       = large display piece
    // - "plush"        = soft/stuffed item
    // - "lego_set"     = LEGO bricks and instructions
    // - "lego_figure"  = single LEGO minifigure or character
    // - "fabric"       = scarf, flag, cloth map, clothing
    // - "metal"        = coin, medal, pin, keychain
    // - "enamel"       = enamel pin or badge
    // - "plastic"      = generic plastic collectible
    // - "resin"        = resin statue/figure
    // - "pvc"          = PVC figure (most UDF, Nendoroid, etc.)
    // - "rubber"       = rubber/silicone item
    // - "paper"        = card, print, poster, sticker
    // - "wood"         = wooden collectible
    // - "mixed"        = multiple materials (CE box contents, etc.)
    // - "electronic"   = battery-powered toy/gadget
    "material": "pvc",

    // Franchise/product grouping.
    "franchise": {
        // Main franchise this merchandise represents.
        // Links to a `series` type document via id.
        "series": "the-legend-of-zelda-series",

        // More specific game or subseries tie-in.
        // Links to a `series` type document via id.
        // null if broadly franchise-wide.
        "subseries": "majoras-mask-series"
    },

    // Specific game, hardware, or entry this item represents or is tied to.
    // Links to any entry by id (game, hardware, etc.)
    // Use when the item specifically depicts or relates to ONE entry.
    // null if it represents a broad franchise or character without a specific game.
    "represents": "the-legend-of-zelda-majoras-mask",

    // Product line, manufacturer line, or collectible series.
    // The brand/line that produced this item.
    // Examples:
    // - "Ultra Detail Figure"
    // - "Nendoroid"
    // - "First 4 Figures"
    // - "World of Nintendo"
    // - "Console Heroes"
    // - "LEGO Nintendo"
    // - "Hero Collector"
    // - "Dark Horse"
    // - "My Nintendo"
    // - "Club Nintendo"
    // null if not part of any named line.
    "product_line": "Ultra Detail Figure",

    // Manufacturer or publisher of the merchandise.
    // Not the game company — the company that made THIS physical item.
    // Examples: "Medicom Toy", "Good Smile Company", "First 4 Figures",
    //           "Dark Horse Comics", "LEGO", "Nintendo", "Iam8bit"
    // null if unknown.
    "manufacturer": "Medicom Toy",

    // Where this item comes from / how it was originally obtained.
    // Allowed:
    // - "retail"           = standard retail purchase
    // - "collector_edition"= bundled with a collector's/limited/special edition
    // - "preorder_bonus"   = preorder incentive
    // - "my_nintendo"      = My Nintendo reward
    // - "club_nintendo"    = Club Nintendo reward
    // - "event"            = convention, event, or in-store exclusive
    // - "promotional"      = press kit, review copy bonus, store display
    // - "subscription"     = subscription box or service bonus
    // - "contest"          = contest/giveaway prize
    // - "bundle"           = bundled with hardware or other product
    // null if unknown or standard purchase.
    "source": "retail",

    // If this item came from a specific game edition, link it.
    // References a game/bundle entry id.
    // null for standalone retail items.
    // Example: "the-legend-of-zelda-skyward-sword-limited-edition"
    "source_entry": null,

    // Companies this merchandise is associated with (game-side).
    // Array of company IDs. The game developers/publishers whose IP this represents.
    // NOT the merchandise manufacturer (that's `manufacturer` above).
    "companies": [
        "nintendo-company"
    ],

    // Notable people depicted or associated.
    // Array of person IDs.
    // Use when the item depicts a real person or is by a notable artist.
    // Example: A Shigeru Miyamoto figure, or a print by a specific artist.
    "people": [],

    // Time-bound event, campaign, or anniversary.
    // Examples: "Zelda 25th Anniversary", "Super Mario Bros. 35th Anniversary"
    // null if not tied to any event.
    "event": null,

    // ─── COLLECTION ────────────────────────────────────────────────────

    // Ownership/wishlist status.
    // Allowed: "owned" | "wishlist"
    "ownership": "wishlist",

    // Acquisition and collection-prioritization metadata.
    "acquisition": {
        // Personal collecting/procurement priority.
        // 1 = Low | 2 = Medium | 3 = High | 4 = Essential | 5 = Non-negotiable
        "priority": 4,

        // Collector-facing reason. Why this matters to the collection.
        "reason": "Beautiful UDF figure of Link in Fierce Deity form. Strong display value.",

        // Acquisition-specific notes.
        // Examples: "Japan exclusive", "Out of print", "Ebay only",
        //           "Came with CE but sold separately too", "Pre-ordered"
        "notes": "Japan import"
    },

    // Freeform personal notes.
    // Physical details, display quirks, condition, bundled contents, etc.
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
| `cover` | ✓ | string | Local image slug (→ `./assets/images/merchandise/<slug>.png`) |
| `release` | — | string \| null | ISO 8601 date (null if unknown) |
| `type` | ✓ | string | Always `"merchandise"` |
| `category` | ✓ | enum | What kind of item (see enums) |
| `material` | ✓ | enum | Physical material/form (see enums) |
| `franchise.series` | ✓ | string | Series entry ID |
| `franchise.subseries` | — | string \| null | Subseries entry ID |
| `represents` | — | string \| null | Specific game/hardware entry ID this depicts |
| `product_line` | — | string \| null | Branded collectible line name |
| `manufacturer` | — | string \| null | Company that made this physical item |
| `source` | — | enum \| null | How this item was originally obtained |
| `source_entry` | — | string \| null | Game/bundle entry ID if from a CE |
| `companies` | — | string[] | Game-side company IDs (IP owners) |
| `people` | — | string[] | Person IDs (depicted/associated) |
| `event` | — | string \| null | Time-bound campaign/anniversary |

### Collection fields

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `ownership` | ✓ | enum | `owned` \| `wishlist` |
| `acquisition.priority` | ✓ | number | 1–5 procurement priority |
| `acquisition.reason` | ✓ | string | Why to collect |
| `acquisition.notes` | — | string \| null | Procurement notes |
| `notes` | — | string \| null | Physical details / personal notes |

---

## Enums

```
Category:       soundtrack | video | artbook | guide | manga |
                steelbook | collector_box | collector_extra |
                figure | statue | plush | lego | diorama | music_toy | replica |
                pin | keychain | coin | patch | charm | clothing |
                card | poster_print | misc

Material:       book | cd | vinyl | cassette | dvd | blu_ray | steelbook |
                figure | statue | plush | lego_set | lego_figure |
                fabric | metal | enamel | plastic | resin | pvc | rubber |
                paper | wood | mixed | electronic

Source:         retail | collector_edition | preorder_bonus |
                my_nintendo | club_nintendo | event | promotional |
                subscription | contest | bundle

Ownership:      owned | wishlist

Acquisition Priority: 1 (Low) | 2 (Medium) | 3 (High) | 4 (Essential) | 5 (Non-negotiable)
```

---

## Design notes

### Why `category` + `material` instead of one field?
A figure can be PVC, resin, or plastic. A soundtrack can be CD, vinyl, or cassette. Separating "what it is" from "what it's made of" allows filtering both ways: "show me all soundtracks" and "show me all vinyl in my collection."

### Why `product_line` instead of folding into franchise?
Product lines are about the merchandise manufacturer's branding, not the game franchise. "Ultra Detail Figure" spans many franchises. "Console Heroes" spans many platforms. This enables browsing by collectible line across the whole collection.

### Why `manufacturer` as a string and not an ID?
Merchandise manufacturers (Medicom Toy, Good Smile Company, First 4 Figures) are not game companies and don't need their own taxonomy documents. A plain string is sufficient for filtering/display without creating dozens of single-purpose documents.

### Why `source` as a field?
Provenance matters for collectibles. Knowing an item came from a CE, a My Nintendo reward, or a convention helps assess rarity, replaceability, and collector value. It also enables views like "all my My Nintendo rewards" or "all CE extras."

### Why `source_entry`?
When a steelbook or scarf came from "Zelda: Skyward Sword Limited Edition," linking to that bundle entry enables cross-referencing. On the game's detail page: "this CE included these items." On the merch page: "this came from that edition."

### Why `represents` separately from `franchise`?
`franchise` groups by series (all Zelda merch together). `represents` pinpoints the specific game depicted (this figure is from Majora's Mask specifically). A Zelda artbook covering the whole series has `franchise.series` but no `represents`. A figure of OoT Link has both.

### Why `companies` points at game companies?
The IP owner is the curatorial link — "show me all Nintendo-IP merchandise" or "all Sega merchandise." The physical manufacturer is in `manufacturer`.

### Why no `backlog` section?
Merchandise isn't "played" — there's no progress, difficulty, or hours-to-beat. The collection concern IS the primary concern beyond taxonomy. `acquisition` covers everything needed.

### Why `people`?
Niche but useful: a Shigeru Miyamoto figure, a print signed by a specific artist, or a collector's item depicting a notable designer. Rare but meaningful when it applies.

---

## Examples

```jsonc
// Soundtrack
{
    "id": "ocarina-of-time-ost",
    "name": "The Legend of Zelda: Ocarina of Time Original Soundtrack",
    "cover": "oot-ost",
    "release": "1998-12-18",
    "type": "merchandise",
    "category": "soundtrack",
    "material": "cd",
    "franchise": { "series": "the-legend-of-zelda-series", "subseries": null },
    "represents": "the-legend-of-zelda-ocarina-of-time",
    "product_line": null,
    "manufacturer": "Pony Canyon",
    "source": "retail",
    "source_entry": null,
    "companies": ["nintendo-company"],
    "people": ["koji-kondo"],
    "event": null,
    "ownership": "wishlist",
    "acquisition": { "priority": 4, "reason": "Iconic soundtrack, collector essential.", "notes": "Japan import" },
    "notes": null
}

// LEGO set
{
    "id": "lego-nes",
    "name": "LEGO Nintendo Entertainment System",
    "cover": "lego-nes",
    "release": "2020-08-01",
    "type": "merchandise",
    "category": "lego",
    "material": "lego_set",
    "franchise": { "series": "nintendo-entertainment-system-series", "subseries": null },
    "represents": "nintendo-entertainment-system",
    "product_line": "LEGO Nintendo",
    "manufacturer": "LEGO",
    "source": "retail",
    "source_entry": null,
    "companies": ["nintendo-company"],
    "people": [],
    "event": null,
    "ownership": "wishlist",
    "acquisition": { "priority": 3, "reason": "Impressive display piece, NES nostalgia.", "notes": "Retired set, rising price" },
    "notes": "2646 pieces. Includes buildable TV with scrolling SMB level."
}

// CE extra
{
    "id": "hyrule-warriors-scarf",
    "name": "Hyrule Warriors Link Scarf",
    "cover": "hw-link-scarf",
    "release": "2014-09-26",
    "type": "merchandise",
    "category": "collector_extra",
    "material": "fabric",
    "franchise": { "series": "the-legend-of-zelda-series", "subseries": "hyrule-warriors-series" },
    "represents": "hyrule-warriors",
    "product_line": null,
    "manufacturer": null,
    "source": "collector_edition",
    "source_entry": "hyrule-warriors-limited-edition",
    "companies": ["nintendo-company", "koei-tecmo-company"],
    "people": [],
    "event": null,
    "ownership": "owned",
    "acquisition": { "priority": 3, "reason": "Unique CE item, great display piece.", "notes": null },
    "notes": "Link's scarf from the Hyrule Warriors Limited Edition."
}

// Console Heroes diorama
{
    "id": "console-heroes-sonic-2-cartridge",
    "name": "Console Heroes: Sonic the Hedgehog 2 Cartridge",
    "cover": "ch-sonic-2",
    "release": "2023-03-15",
    "type": "merchandise",
    "category": "diorama",
    "material": "resin",
    "franchise": { "series": "sonic-the-hedgehog-series", "subseries": null },
    "represents": "sonic-the-hedgehog-2",
    "product_line": "Console Heroes",
    "manufacturer": "Numskull Designs",
    "source": "retail",
    "source_entry": null,
    "companies": ["sega-company"],
    "people": [],
    "event": null,
    "ownership": "wishlist",
    "acquisition": { "priority": 2, "reason": "Cool Mega Drive cartridge diorama.", "notes": null },
    "notes": "Mega Drive cartridge-shaped resin display with embedded scene."
}

// My Nintendo promotional item
{
    "id": "my-nintendo-zelda-pin-set",
    "name": "The Legend of Zelda Pin Set",
    "cover": "my-nintendo-zelda-pins",
    "release": "2021-02-15",
    "type": "merchandise",
    "category": "pin",
    "material": "enamel",
    "franchise": { "series": "the-legend-of-zelda-series", "subseries": null },
    "represents": null,
    "product_line": "My Nintendo",
    "manufacturer": "Nintendo",
    "source": "my_nintendo",
    "source_entry": null,
    "companies": ["nintendo-company"],
    "people": [],
    "event": "The Legend of Zelda 35th Anniversary",
    "ownership": "owned",
    "acquisition": { "priority": 3, "reason": "Anniversary exclusive, limited availability.", "notes": null },
    "notes": "Set of 4 enamel pins. My Nintendo Platinum Points reward."
}
```

---

## Migration notes (from existing schema draft)

| Change | Action needed |
|--------|---------------|
| Remove `merchandise` wrapper | Flatten — `category`, `material` are top-level |
| `merchandise.format` → `material` | Renamed for clarity |
| `merchandise.line` → `product_line` | Promoted to top-level |
| `merchandise.source` → `source_entry` | Renamed; new `source` enum for provenance type |
| `merchandise.represents` → `represents` | Promoted to top-level |
| Add `manufacturer` | New field for physical item maker |
| Add `source` enum | Provenance type (retail, CE, My Nintendo, etc.) |
| Add `companies` | Game-side IP owner IDs |
| Add `people` | Person IDs where relevant |
| `priority` + `reason` → `acquisition` | Wrapped in acquisition object (consistency) |
| `franchise.series`/`subseries` → IDs | Link to series docs |
| `cover` → local | Same migration path as other schemas |
| No data exists yet | Fresh start — no entries to migrate |
