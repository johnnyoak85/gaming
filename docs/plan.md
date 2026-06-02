You are very close. The main issue is that **Library** and **Worlds** are currently mixing three different jobs:

1. **Inventory** — what you own / want / played.
2. **Discovery / browsing** — systems, companies, series, people, eras.
3. **Curation** — essentials, highlights, recommended paths.

I would split the information architecture around that.

---

# Proposed top-level structure

```md
Library
- Collection
- Wishlist
- Backlog / Play

Worlds
- Systems
- Companies
- Series
- People
- Events

Curator
- Essentials
- Playlists / Paths
- Spotlights

Database / Metadata
- Tags
- Eras
- Release lines
- Regions
- Formats
- Sources
```

The important change is this:

**Essentials should not be hidden inside Worlds.**
They are a curation layer that can *reference* Worlds entries.

**Metadata should not be a visible “fun” section unless needed.**
It should mostly support the other pages.

---

# Library

## Collection

Your current problem is that Collection is just becoming:

> huge list of games
> huge list of hardware
> huge list of stuff

That is database browsing, not collection browsing.

I would make **Collection** a dashboard with cards:

```md
Collection
- Games
- Hardware
- Amiibo
- Merchandise
- Physical Library
- Digital Library
- Recently Added
- Collection Gaps
```

Then each card opens a filtered view.

For example:

```md
Collection / Games
- By system
- By series
- By company
- By ownership format
- Recently added
- Unplayed owned games
```

So the first page should not be a table. It should be a **collection hub**.

---

## Wishlist

Yes, absolutely: **Wishlist should be its own page**.

URL-wise:

```txt
/wishlist
/wishlist/systems
/wishlist/system/nintendo-switch
/wishlist/collectibles/amiibo
/wishlist/collectibles/merchandise
```

You said there should be 3 cards, but listed only 2:

```md
- Systems
- Collectibles
```

I think the missing third card should be:

```md
- Priority Picks
```

So the Wishlist landing page becomes:

```md
Wishlist
- Priority Picks
- Systems
- Collectibles
```

### Wishlist rules

Your rules make sense:

```md
Wishlist should include:
- Physical games
- Hardware
- Amiibo
- Merchandise

Wishlist should exclude:
- Digital-only games
- Digital versions of games
- Services / subscriptions
```

Digital wishlist can exist elsewhere, but not here. Maybe:

```md
Play / Digital Watchlist
```

or

```md
Library / Digital Wishlist
```

But for your “shareable collector wishlist”, yes, keep it physical-only.

### Wishlist / Systems

This should only show systems that actually have wishlisted items.

Example:

```md
Wishlist / Systems

Nintendo Switch
- Games: 12
- Hardware: 1
- Accessories: 2

Nintendo 3DS
- Games: 5
- Hardware: 0
- Accessories: 1

PlayStation 2
- Games: 8
- Hardware: 0
```

Then inside a system:

```md
Wishlist / Systems / Nintendo Switch

Physical Games
Hardware
Accessories
```

### Wishlist / Collectibles

```md
Wishlist / Collectibles

Amiibo
Merchandise
```

Inside Amiibo:

```md
Amiibo
- By series
- By character
- By priority
```

Inside Merchandise:

```md
Merchandise
- Books
- Soundtracks
- Figurines
- Misc
```

---

# Worlds

Worlds should be your “romantic database”. Not just taxonomy, but the place where gaming history is organized.

```md
Worlds
- Systems
- Companies
- Series
- People
- Events
```

This is where things like “Nintendo”, “NES”, “Sonic”, “Igarashi”, “Year of Luigi”, “Nintendo Selects”, etc. live.

---

# Worlds / Companies

Your proposed structure is good.

```md
Companies
- Major
- Minor
```

Each section organized by foundation date makes sense because it gives the page a historical flow.

Example:

```md
Major
- Nintendo — 1889
- Sega — 1960
- Capcom — 1979
- Square — 1983
- Enix — 1975

Minor
- Hudson Soft — 1973
- Compile — 1982
- Treasure — 1992
```

But I would be careful with the labels **Major** and **Minor**. They are useful internally, but a bit harsh visually.

Possible nicer labels:

```md
Pillars
Studios
```

or:

```md
Major Houses
Notable Studios
```

Given your “Concierge of Gaming” vibe, I like:

```md
Houses
Studios
```

So:

```md
Companies
- Houses
- Studios
```

Where **Houses** are the big historical entities: Nintendo, Sega, Capcom, Konami, Square Enix, Namco, etc.

And **Studios** are smaller or more specialized: Treasure, Camelot, Quintet, Compile, WayForward, etc.

### Sub-companies

Correct:

> Sub companies only appear inside their parent company.

So no top-level duplicate mess.

Example:

```md
Square Enix
- Subsidiaries / Legacy Houses
  - Square
  - Enix
  - Taito
  - Eidos
```

You can still tag games with Square or Enix specifically, but browsing-wise they live under Square Enix.

---

## Single Company page

Suggested structure:

```md
Company: Capcom

Overview
- Founded
- Country
- Known for
- Status
- Parent company, if any

Subsidiaries / Related Studios
- If applicable

Eras
- Arcade Rise
- NES / Home Console Breakout
- CPS Arcade Era
- PlayStation Experimentation
- Modern Revival

Essentials
- Curated essential games

Games
- Organized by company era

Hardware
- If applicable

People
- Key people connected to this company

Events
- Anniversaries, collections, major company milestones

Metadata
- Tags, notes, sources, aliases
```

I would not make “Games” the first thing. For Worlds, the first thing should be identity/history.

---

# Worlds / Systems

Your structure is good:

```md
Systems
- By gaming era
```

Example:

```md
Early Home Era
- Atari 2600
- Intellivision
- ColecoVision

8-bit Console Era
- Famicom / NES
- Master System
- PC Engine

16-bit Console Era
- Mega Drive
- SNES
- Neo Geo

3D Transition Era
- Saturn
- PlayStation
- Nintendo 64
```

This is much nicer than a flat system list.

## Single System page

Your proposed sections are right:

```md
System: Nintendo Entertainment System

Overview
- Released
- Manufacturer
- Region notes
- Generation / era
- Identity blurb

Hardware
- Console models
- Controllers
- Accessories
- Revisions

System Eras
- Black Box / Launch Era
- Expansion Era
- Late Mastery Era

Games
- Organized by system era

Essentials
- Essential games for this system

Series
- Major series represented on this system

Companies
- Major companies represented on this system

Metadata
- Region, media, compatibility, notes
```

The key improvement: **system eras should be first-class metadata**, not just text sections.

Example:

```ts
systemEras: [
  {
    name: "Launch / Black Box Era",
    startYear: 1985,
    endYear: 1986,
  },
  {
    name: "Expansion Era",
    startYear: 1987,
    endYear: 1989,
  },
  {
    name: "Late Mastery Era",
    startYear: 1990,
    endYear: 1994,
  }
]
```

Then games can reference the era:

```ts
systemEra: "late-mastery"
```

---

# Worlds / Series

Your structure is also good:

```md
Series
- Major
- Minor
```

But again, maybe nicer labels:

```md
Series
- Pillars
- Cult & Companion Series
```

Or simply:

```md
Series
- Major Series
- Notable Series
```

Organizing by start date is excellent because it creates historical flow.

Example:

```md
Major Series
- Mario — 1981 / 1985
- Zelda — 1986
- Metroid — 1986
- Castlevania — 1986
- Mega Man — 1987
- Sonic — 1991

Notable Series
- Shantae — 2002
- Blaster Master Zero — 2017
```

### Sub-series

Correct:

> Sub series only appear inside their parent series.

Example:

```md
Mario
- Super Mario
- Mario Kart
- Paper Mario
- Mario Party
- Mario & Luigi
```

Do not show Paper Mario as a top-level series unless the user searches for it.

---

## Single Series page

Your proposed layout is nearly right. I would do:

```md
Series: Castlevania

Overview
- Started
- Creator / company
- Genre identity
- Status
- Main appeal

Subseries
- Classicvania
- Igavania
- Lords of Shadow

Eras
- Classic Era
- Exploration Era
- Reboot Era
- Collection / Revival Era

Essentials
- Essential entries in the series

Games
- Organized by series era
- Or launch date if no eras exist

Hardware
- If meaningful

Amiibo / Collectibles
- If they exist

People
- Important creators

Events
- Anniversaries, collections, major milestones

Metadata
- Aliases, regions, notes, tags
```

I would **not** always organize games by launch date. Use this rule:

```md
If the series has meaningful eras:
- Organize by series era

If the series does not have meaningful eras:
- Organize by launch date
```

For Sonic, Castlevania, Final Fantasy, Zelda, Mario, Mega Man, etc., eras matter.

For smaller series, launch date is enough.

---

# Worlds / People

This one should exist, but it should be lightweight. It should not become LinkedIn for game developers.

Suggested structure:

```md
People
- Creators
- Artists
- Composers
- Producers / Directors
- Designers
```

Or more romantic:

```md
People
- Visionaries
- Craftspeople
- Composers
- Artists
```

I would avoid overcomplicating this. People pages should mostly answer:

> Why does this person matter to my collection?

## Single Person page

```md
Person: Koji Igarashi

Overview
- Role
- Known for
- Active years
- Main companies

Associated Series
- Castlevania
- Bloodstained

Associated Games
- Organized by role or date

Essentials
- Essential works connected to this person

Companies
- Konami
- ArtPlay

Events
- Relevant milestones

Metadata
- Aliases, notes, sources
```

This becomes very useful for people like:

```md
Shigeru Miyamoto
Gunpei Yokoi
Koji Kondo
Yuji Naka
Naoto Ohshima
Koji Igarashi
Hideo Kojima
Keiji Inafune
Akira Toriyama
Yuzo Koshiro
Nobuo Uematsu
```

---

# Worlds / Events

Events should be for historical/curatorial groupings, not personal events.

Examples:

```md
Year of Luigi
Super Mario Bros. 35th Anniversary
Nintendo Switch 2 Launch
Konami 50th Anniversary
Sega Ages
Nintendo Selects
Player's Choice
Classic NES Series
Capcom Arcade Stadium
Mega Man 30th Anniversary
```

But there are actually two types here:

## 1. Historical Events

```md
- Nintendo Switch 2 Launch
- Super Mario Bros. 35th Anniversary
- Year of Luigi
- Konami 50th Anniversary
```

## 2. Release Lines

```md
- Nintendo Selects
- Player's Choice
- Greatest Hits
- Sega Ages
- Classic NES Series
- Super Mario Advance
- Sega 3D Classics
```

I would make both live under Events, but give them a `type`.

```ts
type: "anniversary" | "launch" | "campaign" | "release-line" | "collection" | "promotion"
```

## Events page

```md
Events
- Historical Events
- Release Lines
- Collections
- Anniversaries
```

## Single Event page

```md
Event: Super Mario Bros. 35th Anniversary

Overview
- Date range
- Type
- Related company
- Related series

Associated Games
- Games released / rereleased / promoted during the event

Associated Hardware
- If applicable

Associated Collectibles
- If applicable

Essentials
- Best things from this event, if useful

Metadata
- Notes, sources, regions
```

---

# Where Essentials should live

This is the big one.

Do **not** make Essentials just a boolean and do **not** make it only a section inside each entry.

You need both:

## 1. A property on relationships

Example:

```ts
{
  gameId: "super-metroid",
  worldEntryId: "snes",
  relationType: "system",
  essential: true,
  essentialTier: "core"
}
```

Why relationship-level?

Because a game can be:

```md
Essential for SNES
Essential for Metroid
Essential for Nintendo
Not necessarily essential for “1994”
```

So “essential” depends on the context.

Super Metroid is essential for:

```md
- SNES
- Metroid
- Nintendo
- 16-bit era
```

But that does not mean it is essential for every possible page it appears on.

## 2. A Curator / Essentials page

Top-level:

```md
Curator / Essentials
- By system
- By series
- By company
- By era
- By person
- By event
```

Then every Worlds entry can have an Essentials section powered by the same data.

Example:

```md
System: SNES
- Essentials

Series: Castlevania
- Essentials

Company: Capcom
- Essentials
```

But the actual data is centralized.

### Essential tiers

I would use a small tier system:

```ts
essentialTier: "core" | "recommended" | "deep-cut"
```

Displayed as:

```md
Core Essentials
Recommended
Deep Cuts
```

This fits your curator vibe extremely well.

---

# Where Metadata should live

Metadata should mostly be invisible until needed.

I would add a collapsed section at the bottom of every Worlds entry:

```md
Metadata
- Aliases
- Tags
- Dates
- Regions
- Related entries
- Sources
- Notes
```

But I would also create a private/admin-ish Metadata area:

```md
Database
- Tags
- Eras
- Release Lines
- Regions
- Formats
- Sources
- Relationship Types
```

This is not really for browsing. It is for maintaining consistency.

So:

```md
Worlds = public romantic layer
Database = maintenance layer
```

---

# Suggested final version of your draft

```md
# Information Architecture

## Library

### Collection

Collection should be a hub, not a giant list.

Sections:
- Games
- Hardware
- Amiibo
- Merchandise
- Physical Library
- Digital Library
- Recently Added
- Collection Gaps

Game and hardware lists should be browsable by:
- System
- Series
- Company
- Format
- Ownership status
- Recently added

### Wishlist

Wishlist should be its own shareable page.

Rules:
- Shows only physical wishlisted items
- Includes physical games, hardware, amiibo, merchandise
- Excludes digital-only games and digital releases

Landing cards:
- Priority Picks
- Systems
- Collectibles

Systems:
- Shows only systems with wishlisted physical games, hardware, or accessories

Collectibles:
- Amiibo
- Merchandise

---

## Worlds

### Companies

Sections:
- Houses / Major Companies
- Studios / Minor Companies

Rules:
- Organized by foundation date
- Subsidiaries only appear inside their parent company

Single Company:
- Overview
- Subsidiaries, if any
- Company Eras
- Essentials
- Games, organized by company era
- Hardware, if relevant
- People
- Events
- Metadata

### Systems

Sections:
- Organized by gaming era

Single System:
- Overview
- Hardware
- System Eras
- Essentials
- Games, organized by system era
- Series
- Companies
- Metadata

### Series

Sections:
- Major Series
- Notable Series

Rules:
- Organized by start date
- Subseries only appear inside their parent series

Single Series:
- Overview
- Subseries, if any
- Series Eras
- Essentials
- Games, organized by series era if available, otherwise launch date
- Hardware, if relevant
- Amiibo / Collectibles, if relevant
- People
- Events
- Metadata

### People

Sections:
- Creators
- Designers
- Artists
- Composers
- Producers / Directors

Single Person:
- Overview
- Associated Series
- Associated Games
- Essentials
- Companies
- Events
- Metadata

### Events

Sections:
- Historical Events
- Anniversaries
- Launches
- Campaigns
- Release Lines
- Collections

Single Event:
- Overview
- Associated Games
- Associated Hardware
- Associated Collectibles
- Essentials, if relevant
- Related Companies
- Related Series
- Metadata
```

---

# Data model implication

The most important backend change is this:

```md
Do not store curation only inside games.
Store curation on relationships.
```

So instead of only:

```ts
game.essential = true
```

You want something closer to:

```ts
{
  sourceType: "system",
  sourceId: "snes",
  targetType: "game",
  targetId: "super-metroid",
  relationshipType: "released-on",
  essential: true,
  essentialTier: "core",
  sortOrder: 1
}
```

This lets Super Metroid be essential for SNES, Metroid, Nintendo, and 16-bit gaming separately.

That is the correct structure for your “Concierge of Gaming” style. It lets the same database power collection views, historical views, and curated views without duplicating entries.
