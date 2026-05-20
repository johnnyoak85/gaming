# Merch Schema

```jsonc
{
  // Unique internal identifier.
  // Format: kebab-case.
  "id": "hyrule-historia",

  // Display name.
  "name": "The Legend of Zelda: Hyrule Historia",

  // External URL or local asset key.
  "cover": "hyrule-historia",

  // Original release date.
  // Prefer first relevant release date for your collection context.
  // Format: YYYY-MM-DD.
  "release": "2011-12-21",

  // Entry type.
  // For this schema, always "merchandise".
  "type": "merchandise",

  // Franchise/product grouping.
  "franchise": {
    // Main franchise, product line, or represented series.
    // Examples:
    // - "The Legend of Zelda"
    // - "Super Mario"
    // - "Sonic the Hedgehog"
    // - "Kirby"
    // - "Mega Drive"
    "series": "The Legend of Zelda",

    // More specific branch/subseries.
    // Use null if irrelevant.
    // Examples:
    // - "Hyrule Warriors"
    // - "Sonic Adventure"
    // - "Super Mario Bros."
    "subseries": null
  },

  // Merchandise-specific classification.
  "merchandise": {
    // What kind of merchandise this is.
    // Allowed:
    // - "soundtrack"       = official soundtrack CD/vinyl/cassette/etc.
    // - "video"            = official DVD/Blu-ray/bonus video release
    // - "artbook"          = official art/lore/design book
    // - "guide"            = official strategy guide or walkthrough book
    // - "steelbook"        = standalone or bundled steelbook case
    // - "collector_box"    = collector's edition box or outer package
    // - "collector_extra"  = physical extra bundled with a game release
    // - "figure"           = collectible figure
    // - "statue"           = larger/premium display statue or statuette
    // - "lego"             = special gaming-related LEGO set
    // - "diorama"          = display scene/object based on a game/platform
    // - "music_toy"        = music-related collectible object, e.g. Kirby Otamatone
    //
    // Minor merchandise exception:
    // The following categories are normally excluded unless they are official,
    // limited/promotional/reward-based, and directly tied to a specific game release,
    // anniversary, event, campaign, or My Nintendo-style reward:
    // - "pin"
    // - "keychain"
    // - "coin"
    // - "patch"
    // - "charm"
    //
    // Generic evergreen pins/keychains/charms are excluded.
    // Posters are excluded even when official/promotional.
    // Fast-food promotional toys are excluded by default, even when official.
    "category": "artbook",

    // Physical media/material form.
    // Keep broad and practical.
    // Examples:
    // - "book"
    // - "cd"
    // - "vinyl"
    // - "dvd"
    // - "blu_ray"
    // - "steelbook"
    // - "figure"
    // - "statue"
    // - "lego_set"
    // - "fabric"
    // - "box"
    // - "mixed"
    "format": "book",

    // Optional official product line, publisher line, or collectible line.
    // Examples:
    // - "Ultra Detail Figure"
    // - "Hero Collector"
    // - "Console Heroes"
    // - "LEGO Nintendo"
    // - null
    "line": null,

    // Whether this item was released as part of, or bundled with, a specific game edition.
    // Use null for standalone releases.
    // Examples:
    // - "hyrule-warriors-limited-edition"
    // - "the-legend-of-zelda-skyward-sword-limited-edition"
    "source": null,

    // Optional represented game, platform, or product.
    // Use when the item is specifically tied to one entry rather than a broad franchise.
    // Examples:
    // - "sonic-the-hedgehog"
    // - "the-legend-of-zelda-ocarina-of-time"
    // - "sega-mega-drive"
    "represents": null
  },

  // Ownership/wishlist state.
  // Allowed:
  // - "owned"
  // - "wishlist"
  "ownership": "wishlist",

  // Collection priority.
  /*
   * 1 = Low
   * 2 = Medium
   * 3 = High
   * 4 = Essential
   * 5 = Non-negotiable
   */
  "priority": 4,

  // Why this item belongs in the collection.
  // Should explain collector value, historical value, display value,
  // franchise relevance, direct game tie-in, or preservation value.
  "reason": "Official Zelda history/art/lore book with strong franchise preservation and shelf value.",

  // Optional release/event grouping.
  // Only use actual events, anniversaries, campaigns, or commemorative releases.
  // Examples:
  // - "The Legend of Zelda 25th Anniversary"
  // - "Super Mario Bros. 30th Anniversary"
  // - "Sonic 30th Anniversary"
  "event": "The Legend of Zelda 25th Anniversary",

  // Freeform notes.
  // Use for special physical details, unusual materials, display quirks, bundled contents, or personal context.
  // Examples:
  // - "Includes cloth map."
  // - "Link's scarf from Hyrule Warriors Limited Edition."
  // - "Kirby Otamatone official licensed release."
  // - "Skip pins/keychains unless anniversary/event-exclusive or unusually premium."
  "notes": null
}
```

| Category                  | Include?          | Why                                 |
| ------------------------- | ----------------- | ----------------------------------- |
| Soundtrack CDs            | Yes               | Historical + collectible            |
| Special DVDs              | Yes               | Release artifact                    |
| Artbooks                  | Yes               | Preservation/history                |
| Guides                    | Yes               | Gaming culture artifact             |
| Special LEGO sets         | Yes (selectively) | Display/history                     |
| Steelbooks                | Yes               | Collector release artifact          |
| Collector’s edition boxes | Yes               | Important physical release identity |
| CE extras                 | Yes (selectively) | Directly tied to release            |

Extra:

- Otamatone Kirby Version
- Ultra Detail Figure
- Hero Collector
- Console Heroes Mega Drive cartridge dioramas
