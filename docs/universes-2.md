# Universes

## Major

- Castlevania
- Super Mario
- Final Fantasy
- United Galaxy Space Force
- Pac-Man
- The Legend of Zelda
- Metal Gear
- Pokémon
- Mega Man
- Kirby
- Metroid
- Street Fighter
- Fire Emblem
- Mana
- Ghosts 'n Goblins
- Gradius

## Minor

- Kid Icarus
- Punch-Out!!
- F-Zero
- Star Fox
- EarthBound
- Shantae
- Ninja Gaiden
- Contra
- Bomberman
- Kunio-kun

## Sub

- Donkey Kong
- Dr. Mario
- Mega Man X
- Yoshi
- Wario Land
- Mario Kart

## Platform Series

- PlayStation
- Xbox
- Game Boy
- Nintendo DS
- Nintendo Switch
- PC Engine
- Mega Drive
- Dreamcast

## More

- Breath of Fire
- Chrono
- Prince of Persia
- Blaster Master

Also, should I include companies?

- Nintendo
- Capcom
- Square
- Quintet
- Namco

---

The idea: Have pages in my gaming collection page where I can navigate through gaming series and another for gaming developers. I click those and I'm presented with games from that series/developer.
Starting with NES, let's define groupings by Major, Minor and Sub. This is for gaming series and developers. Discarded is for series so minor that there's no point in listing them (unless you manage to come up with better separations for these)

- Major: List first, larger
- Minor: List after, smaller
- Sub: List under major/minor

## Major

- Super Mario *
  - Super Mario Bros.
  - Mario Bros. *
  - Dr. Mario *
  - Donkey Kong *
- The Legend of Zelda *
- Metroid *
- Kirby *
- Mega Man *
- Castlevania *
- Contra *
- Final Fantasy *
- Fire Emblem *
- Bomberman *
- Pac-Man *
- United Galaxy Space Force *
  - Galaxian
- Gradius
- Ghosts 'n Goblins *
  - Gargoyle's Quest
- Double Dragon
- Bubble Bobble
  - Puzzle Bobble
  - Rainbow Islands

### Developers

- Nintendo *
  - HAL Laboratory *
  - Intelligent Systems *
  - APE
- Square Enix *
  - Square *
  - Enix *
- Bandai Namco *
  - Namco *
- Capcom *
- Konami *
- Taito *
- SNK *
- Hudson Soft
- Koei Tecmo
  - Tecmo
- SNK *

## Minor

- Kid Icarus
- Punch-Out!!
- Blaster Master
- EarthBound
- StarTropics
- Kunio-kun
- Ninja Gaiden
- Excitebike
- Balloon Fight
- Ice Climber

### Developers

- Technos
- Sunsoft

## Sub

### Developers

- HAL Laboratory
- APE
- Intelligent Systems

## Discarded

- Balloon Fight
- Excitebike
- Ice Climber
- StarTropics
- Crystalis
- Little Samsom

### Developers

- Takeru

---

Do you agree? Feel free to re-organize and justify.

Kunio-kun: Major?
Metal Gear: Major

Cool, let's create1 documents for these.
Here's a `system` document:

```json
{
    "id": "wiiware",
    "type": "system",
    "name": "WiiWare",
    "logo": "wiiware-logo"
}
```

I believe the `series` and `developer` documents can be similar, but we have to connect others. Perhaps like this:

```json
{
    "id": "super-mario-series",
    "type": "series",
    "name": "Super Mario",
    "logo": "super-mario-logo",
    "contains": [
        "super-mario-bros-series",
        "mario-bros-series",
        "dr-mario-series",
        "donkey-kong-series"
    ]
}
```

```json
{
    "id": "square-enix-developer",
    "type": "developer",
    "name": "Square Enix",
    "logo": "square-enix-logo",
    "contains": [
        "square-developer",
        "enix-developer"
    ]
}
```

---

There are two new types of document:

- `series`
- `developer`

- These can be of 3 kinds of circles: `major`, `minor`, `sub`. (There currently are no `minor` circles, but there will).
- I want pages for these similar to what we did for `systems`.
- The pages should `major` first and `minor` second. Feel free to create two lists or just organize an array like this.
- Under the header, add a sub header, this sub header will be a list of the series inside `contains`, these are the `sub` circles.

For `series`:

- When clicked, opens a page with all entries that have `universe` === `series` `id`.

For `developer`

- When clicked, opens a page with all entries that have `companies.developer.includes(entry.id)`.
