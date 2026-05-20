# Hardware Schema

```jsonc
{
  // Unique internal identifier.
  // Format: kebab-case.
  "id": "game-boy-advance-sp",

  // Display name.
  "name": "Game Boy Advance SP",

  // External URL or local asset key.
  "cover": "game-boy-advance-sp",

  // Original release date.
  // Prefer first relevant release date for your collection context.
  // Format: YYYY-MM-DD.
  "release": "2003-03-23",

  // Entry type.
  // For this schema, always "hardware".
  "type": "hardware",

  // Franchise/product family grouping.
  "franchise": {
    // Larger product line.
    // Examples:
    // - "Game Boy"
    // - "PlayStation"
    // - "Xbox"
    // - "Wii"
    // - "Intellivision"
    "series": "Game Boy",

    // More specific branch/model family.
    // Use null if irrelevant.
    // Examples:
    // - "Game Boy Advance"
    // - "Nintendo DS"
    // - "PlayStation Classic"
    "subseries": "Game Boy Advance"
  },

  // Companies involved with the hardware.
  "companies": {
    // Company or companies that manufactured the hardware.
    "manufacturer": [
      "Nintendo"
    ],

    // Company or companies that published/distributed/marketed the hardware.
    // Often same as manufacturer.
    "publisher": [
      "Nintendo"
    ]
  },

  // Hardware-specific classification.
  "hardware": {
    // What the hardware is.
    // Allowed:
    // - "console"    = playable game system
    // - "computer"   = home computer / microcomputer
    // - "controller" = primary input device
    // - "accessory"  = simple/passive add-on
    // - "peripheral" = active/specialized device that adds a distinct capability
    // - "adapter"    = compatibility/connectivity bridge
    // - "storage"    = memory card, VMU, SD card, etc.
    // - "cable"      = cable or connector
    "category": "console",

    // Physical/functional form.
    // Allowed:
    // - "home"          = traditional home console
    // - "handheld"      = portable console
    // - "hybrid"        = both handheld and docked/home use
    // - "mini"          = modern mini/replica console
    // - "dedicated"     = fixed-purpose hardware with built-in software
    // - "plug_and_play" = TV plug-and-play device
    // - "add_on"        = expansion hardware attached to another system
    // - "standard"      = default form for controllers/accessories
    // - "special"       = unusual/specialized form
    "form": "handheld",

    // Main software family this hardware represents.
    // This is used for display grouping.
    //
    // Games matching this family are considered "for this console".
    //
    // Example:
    // A GBA SP has primary_family "game-boy-advance",
    // so GBA games appear as native/primary games.
    "primary_family": "game-boy-advance",

    // Additional software families this hardware can play.
    // These are shown separately as backwards-compatible or secondary libraries.
    //
    // Example:
    // A GBA SP can play GB and GBC games, but they are not "for" the GBA SP.
    "compatible_families": [
      "game-boy",
      "game-boy-color"
    ],

    // Console generation where meaningful.
    // Use null for novelty hardware, controllers, accessories, or devices where generation is not useful.
    "generation": 6,

    // 
    // Allowed:
    // - "primitive" = Pong, early Atari
    // - "classic"   = Atari 2600 / Intellivision
    // - "8-bit"     = NES, Master System, C64, Spectrum
    // - "16-bit"    = SNES, Mega Drive, PC Engine, Neo Geo
    // - "32-bit"    = PS1, Saturn, late arcades
    // - "128-bit"   = Dreamcast, PS2, GameCube, Xbox
    // - "720p"      = PS3/360/Wii
    // - "1080p"     = PS4/Xbone/Switch
    // - "4k"        = PS5/Switch 2
    "era": "32-bit",

    // Hardware this item is directly compatible with.
    // Mostly useful for controllers, accessories, adapters, storage, cables, and peripherals.
    //
    // Examples:
    // - Wii Remote Plus compatible with Wii and Wii U
    // - Nunchuk compatible with Wii Remote and Wii Remote Plus
    // - GameCube Controller Adapter compatible with Wii U and Switch
    //
    // Use [] if not applicable.
    "compatible_with": []
  },

  // Physical variants, colors, editions, or bundles.
  // Use this when variant identity matters for collecting.
  "variants": [
    {
      // Variant display name.
      "name": "Platinum",

      // Variant-specific cover/local asset.
      "cover": "game-boy-advance-sp-platinum",

      // Optional event/anniversary tie-in for this specific variant.
      // Use null if irrelevant.
      "event": null,

      // Optional variant notes.
      "notes": null
    }
  ],

  // Hardware ownership/wishlist records.
  // Hardware does not use the game-style `access` model.
  // This answers: "Do I own/want this hardware, and in what form/variant?"
  "ownership": [
    {
      // Variant owned or wanted.
      // Should match a variant name when relevant.
      // Use null if variant does not matter.
      "variant": "Platinum",

      // Ownership status.
      // Allowed:
      // - "owned"       = currently owned
      // - "wishlist"    = wanted
      // - "borrowed"    = temporary access
      // - "unavailable" = tracked but not currently obtainable/relevant
      "status": "owned",

      // Ownership-specific notes.
      // Examples:
      // - "Used to own"
      // - "Missing charger"
      // - "Includes box"
      // - "Third-party shell"
      // - "Battery replaced"
      "notes": null
    }
  ],

  // Acquisition and collection-prioritization metadata.
  // This answers: "Why should I procure, keep, upgrade, or wishlist this hardware?"
  "acquisition": {
    // Personal collecting/procurement priority.
    // Based on platform importance, library relevance, nostalgia, rarity,
    // hardware usefulness, display value, and compatibility value.
    /*
     * 1 = Low
     * 2 = Medium
     * 3 = High
     * 4 = Essential
     * 5 = Non-negotiable
     */
    "priority": 5,

    // Collector-facing reason.
    // Should explain why this hardware matters to your collection.
    "reason": "Preferred compact model for playing Game Boy Advance games while retaining Game Boy and Game Boy Color compatibility.",

    // Acquisition-specific notes.
    // Examples:
    // - "Prefer PAL/EUR model"
    // - "Only worth cheap"
    // - "Need charger"
    // - "Want boxed eventually"
    // - "Already own original model, upgrade only"
    "notes": null
  },

  // Optional built-in or included software.
  // Use for mini consoles, dedicated consoles, plug-and-play devices,
  // anniversary handhelds, or hardware with games included by default.
  //
  // Do not use this for backwards compatibility.
  //
  // Example:
  // "contains": [
  //   "the-legend-of-zelda",
  //   "zelda-ii-the-adventure-of-link"
  // ],
  "contains": [],

  // Optional release/event grouping.
  // Examples:
  // - "The Legend of Zelda 35th Anniversary"
  // - "The Legend of Zelda 25th Anniversary"
  // - "Nintendo Classic Mini"
  "event": null,

  // Freeform notes about the hardware entry as a whole.
  // Avoid duplicating ownership/acquisition/variant notes unless useful.
  "notes": null
}
```
