# Game Schema

```jsonc
{
    // Unique internal identifier.
    // Format: kebab-case.
    "id": "super-mario-bros",

    // Display name.
    "name": "Super Mario Bros.",

    // External URL or local asset key.
    "cover": "https://images.igdb.com/igdb/image/upload/t_cover_big/cob913.webp",

    // Original worldwide release date.
    // Format: YYYY-MM-DD.
    "release": "1985-09-13",

    // One playable work/version.
    // Allowed:
    // - "game"       = standalone playable work
    // - "bundle"     = commercial package containing multiple separate items
    // - "collection" = curated compilation of playable entries
    // - "hardware"   = console, controller, accessory, mini console, etc.
    "type": "game",

    // Franchise grouping information.
    "franchise": {
        // Larger fictional/product universe.
        // Use `null` if irrelevant.
        "universe": "Mario",

        // Main series.
        "series": "Super Mario",

        // More specific branch/subseries.
        // Use `null` if irrelevant.
        "subseries": "Super Mario Bros."
    },

    // Gameplay classification and discovery metadata.
    "classification": {
        // Broad gameplay categories.
        "genres": [
            "Platform"
        ],

        // More specific gameplay classifications.
        "subgenres": [
            "Action Platformer"
        ],

        // Setting, tone, subject matter, or fiction type.
        "themes": [
            "Fantasy"
        ],

        // Flexible personal filtering tags.
        "tags": [
            "Retro",
            "Arcade Style",
            "Precision Platforming"
        ]
    },

    // Recommended age for meaningful appreciation/play.
    // Not an official content rating.
    "player_age": 6,

    // Direct access/ownership/wishlist entries.
    // This answers: "How can I play this, or how do I want to obtain it?"
    "access": [
        {
            // Actual hardware, console family, ecosystem, or device used to play the game.
            // Examples:
            // - "nintendo-entertainment-system"
            // - "nintendo-switch"
            // - "nes-classic-mini"
            // - "nintendo-gamecube"
            "platform": "nintendo-switch",

            // Product, service, collection, bundle, mini console, or source that grants access.
            // This prevents non-platform containers from being misused as `platform`.
            // Examples:
            // - "nintendo-switch-online"
            // - "super-mario-all-stars"
            // - "nes-classic-mini"
            // - "sonic-mega-collection"
            // - null
            "via": "nintendo-switch-online",

            // Access format.
            // Allowed:
            // - "physical"     = owned/wanted as a physical standalone item
            // - "digital"      = owned/wanted as a digital standalone license
            // - "built_in"     = included by default in hardware/mini console
            // - "contained"    = included inside a bundle, collection, or compilation
            // - "injected"     = manually added to compatible hardware/mini console
            // - "reproduction" = reproduction cart/disc/manual/etc.
            "format": "digital",

            // Access status.
            // Allowed:
            // - "owned"        = you own this access path
            // - "wishlist"     = you want this access path
            // - "borrowed"     = temporary access
            // - "subscription" = playable only through active subscription
            // - "unavailable"  = tracked but not currently obtainable/playable
            "status": "subscription",

            // Access-specific notes.
            // Avoid general game notes here.
            "notes": "Switch Online version has save states."
        },
        {
            "platform": "super-nintendo-entertainment-system",
            "via": "super-mario-all-stars",
            "format": "contained",
            "status": "owned",
            "notes": "Playable through owned Super Mario All-Stars release."
        },
        {
            "platform": "nes-classic-mini",
            "via": "nes-classic-mini",
            "format": "injected",
            "status": "owned",
            "notes": "Manually injected into the mini console."
        }
    ],

    // Related versions/ports/remasters/remakes/etc.
    // Use this only when the related entry is essentially the same playable work.
    // Do NOT include self-reference if the only version is itself.
    "versions": [
        {
            // Related game/product ID.
            "source": "super-mario-all-stars-super-mario-bros",

            // Version relationship type.
            // Allowed:
            // - "base"                = source/original version of this same work
            // - "port"                = same game moved to another platform
            // - "enhanced_port"       = port with notable additions/improvements
            // - "remaster"            = same game with technical/audio/visual restoration
            // - "enhanced_remaster"   = remaster with meaningful extra content/features
            // - "remake"              = same game rebuilt while preserving core identity/design
            // - "enhanced_remake"     = remake with meaningful extra content/features
            // - "remix"               = same base game rearranged with altered rules, characters, layouts, or mechanics
            // - "enhanced_remix"      = remix with substantial added content/features
            //
            // Note:
            // Use "remix" / "enhanced_remix" only for cases that are still essentially
            // the same game underneath.
            //
            // Examples:
            // - Super Mario Bros. -> Super Luigi Bros. = remix
            // - Sonic the Hedgehog 2 -> Knuckles in Sonic 2 = remix
            //
            // Do NOT use this for broad reinterpretations or new works.
            // Those belong in `relationships` as "reimagining".
            "format": "remake"
        }
    ],

    // Only present when type is "bundle" or "collection".
    // References playable entries contained inside.
    // Do not duplicate this as a relationship.
    // Example:
    // "contains": [
    //     "super-mario-bros",
    //     "super-mario-bros-the-lost-levels"
    // ],

    // Relationships to OTHER games only.
    // Do not duplicate version/base/port/remake relationships here.
    // Do not use this for simple same-franchise membership.
    "relationships": [
        {
            // Related game ID.
            "source": "super-mario-bros-2",

            // Relationship direction matters.
            //
            // If THIS game came before the source:
            // use "sequel".
            //
            // If THIS game came after the source:
            // use "prequel".
            //
            // Allowed:
            // - "original"                 = source is the original work this derives from
            // - "prequel"                  = source came before this chronologically/release-wise
            // - "sequel"                   = source came after this chronologically/release-wise
            // - "spinoff"                  = source branches from this game/series
            // - "spiritual_successor"      = source is later and strongly inspired by this
            // - "spiritual_predecessor"    = source is earlier and strongly inspired this
            // - "reimagining"              = source is a substantially new reinterpretation
            // - "expansion"                = source expands this game but is treated as a separate entry
            // - "twin_engine"              = source shares engine/structure but is a distinct work
            // - "twin_game"                = source is a paired/sibling release
            "type": "sequel"
        }
    ],

    // How the game can be played.
    "playstyle": {
        "players": {
            // Minimum supported players.
            "min": 1,

            // Maximum supported players.
            "max": 2
        },

        // Allowed:
        // - "solo"
        // - "co_op"
        // - "versus"
        // - "turn_based"
        // - "online"
        // - "party"
        "modes": [
            "solo",
            "co_op"
        ]
    },

    // Companies involved.
    "companies": {
        // Developers.
        "developer": [
            "Nintendo R&D4"
        ],

        // Publishers.
        "publisher": [
            "Nintendo"
        ]
    },

    // Personal play/progress status.
    // Allowed:
    // - "planned"
    // - "playing"
    // - "paused"
    // - "finished"
    // - "completed"
    // - "dropped"
    "progress": "planned",

    // Backlog and play-prioritization metadata.
    // This answers: "Why should I play this, and how soon?"
    "backlog": {
        // Personal play priority.
        // Based on reason, rating, difficulty, estimated hours, personal mood, and current backlog.
        /*
         * 1 = Someday
         * 2 = Later
         * 3 = Soon
         * 4 = Next
         * 5 = Now
         */
        "priority": 5,

        // Player-facing reason.
        // Should explain why this is worth playing.
        // Avoid ownership, access, or version notes.
        "reason": "Genre-defining platformer with historic importance and short completion time.",

        // General quality/recommendation score.
        /*
         * 1 = Avoid
         * 2 = Weak
         * 3 = Good
         * 4 = Strong
         * 5 = Essential
         */
        "rating": 5,

        // Expected difficulty.
        /*
         * 1 = Very easy
         * 2 = Easy
         * 3 = Moderate
         * 4 = Hard
         * 5 = Very hard
         */
        "difficulty": 2,

        // Estimated meaningful completion time in hours.
        "estimated_hours": 5
    },

    // Acquisition and collection-prioritization metadata.
    // This answers: "Why should I procure, keep, upgrade, or wishlist this?"
    "acquisition": {
        // Personal collecting/procurement priority.
        // Based on platform importance, franchise importance, rarity, personal attachment,
        // preservation value, physical shelf value, and overall quality.
        /*
         * 1 = Low
         * 2 = Medium
         * 3 = High
         * 4 = Essential
         * 5 = Non-negotiable
         */
        "priority": 1,

        // Collector-facing reason.
        // Should explain importance to the platform, franchise, personal history,
        // rarity, preservation, or shelf value.
        // Avoid simple access notes like "owned digitally".
        "reason": "",

        // Acquisition-specific notes.
        // Examples:
        // - "Used to own"
        // - "Prefer PAL"
        // - "Only worth cheap"
        // - "Own digitally but want physical"
        // - "Contained in Sonic Mega Collection"
        // - "Reproduction cart acceptable"
        "notes": ""
    },

    // Optional release/event grouping.
    // Examples:
    // - "Year of Luigi"
    // - "Classic NES Series"
    // - "The Legend of Zelda 25th Anniversary"
    "event": null,

    // Freeform personal notes about this entry as a whole.
    // Avoid duplicating access/backlog/acquisition notes unless useful.
    "notes": "Switch Online version has save states."
}
```
