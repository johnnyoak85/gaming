# Amiibo

```jsonc
{
  // Unique internal identifier.
  // Format: kebab-case.
  "id": "simon-amiibo",

  // Display name.
  // Usually the character/figure name as shown on the Amiibo box.
  "name": "Simon",

  // External URL or local asset key.
  "cover": "https://amiibo.life/assets/figures/amiibo/super-smash-bros/simon-1badba282be11580382e6158ffdede8767068157f7d4a2c18edc577030fb280c.png",

  // Original release date.
  // Format: YYYY-MM-DD.
  "release": "2019-11-08",

  // Entry type.
  // For this schema, always "amiibo".
  "type": "amiibo",

  // Amiibo line/franchise grouping.
  "franchise": {
    // Amiibo product line.
    // Examples:
    // - "Super Smash Bros."
    // - "Super Mario"
    // - "The Legend of Zelda"
    // - "Animal Crossing"
    "series": "Super Smash Bros.",

    // Character origin or represented sub-franchise.
    // Use null if irrelevant or same as series.
    // Examples:
    // - "Castlevania"
    // - "Metroid"
    // - "The Legend of Zelda"
    "subseries": "Castlevania"
  },

  // Amiibo-specific collection metadata.
  "amiibo": {
    // Official/personal number within the Amiibo line.
    // Use null if the line is not numbered or you do not care.
    "number": 78,

    // Release wave or collector grouping.
    // Useful for sorting and display.
    "wave": "Super Smash Bros. Wave 16"
  },

  // Ownership state.
  // Allowed:
  // - "owned"
  // - "wishlist"
  "ownership": "owned",

  // Lightweight per-game functionality.
  // This answers:
  // - On the Amiibo page: "What does this Amiibo do?"
  // - On the game page: "Which Amiibo work with this game?"
  "functionality": [
    {
      // Game ID.
      "game": "super-smash-bros-ultimate",

      // Human-readable effect.
      // Keep this simple; no need to overclassify.
      "effect": "Battle and train up a computer-controlled Figure Player of the character."
    }
  ],

  // Optional release/event grouping.
  // Only use actual events, anniversaries, campaigns, or special commemorative releases.
  //
  // Examples:
  // - "The Legend of Zelda 30th Anniversary"
  // - "The Legend of Zelda 35th Anniversary"
  // - "Super Mario Bros. 30th Anniversary"
  //
  // Do NOT use normal game launches as events.
  "event": null,

  // Freeform notes for physical oddities, special materials, size differences,
  // unusual construction, visual effects, or anything personally relevant.
  //
  // Examples:
  // - "Glows in the dark."
  // - "Larger than normal; flexible legs allow the pose to change."
  // - "Larger than normal; has transparent details."
  "notes": null
}
```
