# Person Schema

> Type: `person` — notable creators, designers, composers, and engineers

A person represents someone worth highlighting for curatorial purposes: game directors, designers, composers, hardware architects, artists. Entries link to people via `people` arrays on games, hardware, companies, and merchandise.

This is the newest taxonomy type — it enables browsing "what did this creator make?" across the entire collection.

---

## Schema

```jsonc
{
    // Unique internal identifier.
    // Format: kebab-case slug.
    // Convention: first-last or romanized name.
    "id": "shigeru-miyamoto",

    // Display name.
    // Preferred public-facing name. Use the most recognized form.
    "name": "Shigeru Miyamoto",

    // Short explanation of who this person is.
    // One or two sentences — role and significance.
    "description": "Creator of Mario and Zelda. Nintendo's most influential game designer and current Representative Director.",

    // Always "person" for this schema.
    "type": "person",

    // Local asset path for portrait/avatar.
    // Format: slug resolved to ./assets/images/people/<slug>.png
    // null if no image available.
    "portrait": "shigeru-miyamoto",

    // Primary roles this person is known for.
    // Array of role enums. List the most notable roles first.
    // Allowed:
    // - "director"      = game director, creative lead
    // - "designer"      = game designer, level designer, system designer
    // - "producer"      = game producer, executive producer
    // - "programmer"    = lead programmer, engine architect
    // - "artist"        = art director, character designer, illustrator
    // - "composer"      = music composer, sound designer
    // - "writer"        = scenario writer, narrative designer
    // - "engineer"      = hardware engineer, system architect
    // - "executive"     = company executive, president, CEO
    "roles": [
        "designer",
        "director",
        "producer"
    ],

    // Companies this person is primarily associated with.
    // Array of company IDs. Links to `company` type documents.
    // List current/most notable affiliation first.
    "companies": [
        "nintendo-company"
    ],

    // Visibility tier on list pages (if a person list page exists).
    // Allowed: "major" | "minor" | "sub"
    //
    // - "major" = legendary creator, always shown (Miyamoto, Kojima, Sakurai)
    // - "minor" = notable creator, shown in expanded view
    // - "sub"   = supporting credit, only shown on detail pages
    "circle": "major",

    // Nationality or primary country.
    // ISO 3166-1 alpha-2 country code.
    "country": "JP",

    // Curated list of essential entries associated with this person.
    // Array of entry IDs (games, hardware, merchandise).
    // Represents "the best work by this creator" — a personal editorial selection.
    "essentials": [
        "super-mario-bros",
        "the-legend-of-zelda-ocarina-of-time",
        "donkey-kong"
    ],

    // Freeform notes.
    // Notable achievements, trivia, or context.
    "notes": "Creator of Mario and Zelda. Representative Director and Fellow at Nintendo."
}
```

---

## Field reference

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `id` | ✓ | string | Kebab-case slug |
| `name` | ✓ | string | Display name |
| `type` | ✓ | string | Always `"person"` |
| `portrait` | — | string \| null | Image slug (→ `./assets/images/people/<slug>.png`) |
| `roles` | ✓ | string[] | Primary roles (director, composer, etc.) |
| `companies` | ✓ | string[] | Company entry IDs |
| `circle` | ✓ | enum | `major` \| `minor` \| `sub` |
| `country` | — | string \| null | ISO 3166-1 alpha-2 code |
| `essentials` | — | string[] | Curated essential entry IDs |
| `notes` | — | string \| null | Freeform notes |

---

## Enums

```
Role:       director | designer | producer | programmer | artist | composer |
            writer | engineer | executive

Circle:     major | minor | sub
```

---

## Design notes

### Why a dedicated person type?
Key creators are powerful curation signals. "Show me everything by Koji Kondo" spans games (compositions), hardware (Game Boy sound chip influence), and merchandise (soundtrack CDs). No other taxonomy type captures this cross-cutting view.

### Why `roles` as an array?
Most notable creators wear multiple hats. Miyamoto is a designer, director, and producer. Sakurai is a designer and director. The array captures all relevant roles without picking just one.

### Why no birth date?
Birth dates are personal information and rarely useful for curation. The collection is about creative works, not biographical data. `country` provides enough geographic context.

### Why `portrait` instead of `cover`?
People aren't "covered" — they have portraits. Different naming signals different image treatment (person photos vs game covers vs hardware product shots).

### Why `circle`?
Same pattern as series and companies. Not every credited person deserves a spot on a hypothetical "creators" list page. `major` = household names in gaming. `minor` = notable contributors you'd recognize. `sub` = important credits that only appear in context (on a game's detail page).

### How people link to entries
People don't reference their works — works reference their people. A game's `people` array lists the key creators. This avoids maintaining a massive list of works on each person entry and keeps the source of truth on the entries themselves.

### Starter list suggestions
High-value entries to create first:

| Person | Roles | Company | Why |
|--------|-------|---------|-----|
| Shigeru Miyamoto | designer, director, producer | Nintendo | Mario, Zelda creator |
| Koji Kondo | composer | Nintendo | Mario/Zelda music |
| Masahiro Sakurai | designer, director | Nintendo | Kirby, Smash Bros |
| Satoru Iwata | programmer, executive | Nintendo, HAL Laboratory | Nintendo president, HAL |
| Gunpei Yokoi | designer, engineer | Nintendo | Game Boy, Metroid |
| Yoshio Sakamoto | director, designer | Nintendo | Metroid |
| Eiji Aonuma | director, producer | Nintendo | Zelda (modern era) |
| Hideo Kojima | designer, director, writer | Konami | Metal Gear |
| Tokuro Fujiwara | designer, director | Capcom | Ghosts 'n Goblins, Mega Man |
| Keiji Inafune | artist, designer, producer | Capcom | Mega Man character design |
| Koji Igarashi | director, producer | Konami | Castlevania (Igavania) |
| Yuji Naka | programmer, director | Sega | Sonic the Hedgehog |
| Hirokazu Tanaka | composer | Nintendo | Metroid, Kid Icarus, Earthbound |
| Nobuo Uematsu | composer | Square | Final Fantasy music |
| Hitoshi Sakimoto | composer | — | FFT, Vagrant Story, Odin Sphere |

---

## Migration notes

| Change | Action needed |
|--------|---------------|
| Create type | Brand new — no existing entries |
| Add to manifest | New entries need manifest.json registration |
| Populate `people` on games | Add person IDs to game entries incrementally |
| Populate `people` on hardware | Add person IDs to hardware entries (designers/engineers) |
| Populate `people` on companies | Add person IDs to company entries |
| Create images directory | `./assets/images/people/` |
