<<<<<<< HEAD

💿 physical
☁️ digital
🧩 injection
🃏 reproduction
🤍 wishlist (white heart)
📦 contained
🕹️ built_in

❤️ Non-negotiable
🧡 Essential
💛 High
🩷 Medium
🤍 Low

---

If an hardware entry is console and has `hardware.family`, the Games section should show all game entries in which `ownership.platform` are equal to `family`.
Likewise, if game `ownership.platform` is part of a `family` in hardware, show all consoles that apply in Platforms section.

Inside every detail page, the symbols that appear should have a tooltip:
    - `ownership[].format: physical` 💿 => Physical
    - `ownership[].format: digital` ☁️ => Digital
    - `ownership[].format: reproduction` 🃏 => Reproduction cart
    - `ownership[].format: injection` 🧩 => Injected in a Mini console
    - `relationships[].type: contained` 📦 => Contained in a collection or
    bundle
    - `ownership[].wishlist: true` 🤍 => Wishlisted`

If `ownership[].format: injection`, then, in the console:
    - Check previous changes related to injection, they are extremely wrong and should be reversed.
    - Under the "Games" section, add a new section called "Injected"
    - Injected games should appear here instead of the games section

Games are not showing all consoles available, they are just showing what's inside `ownership`.
Also, games should only show platforms of the same family that have entries.
Examples:
    - `nintendo-dsi` => show `nintendo-dsi-xl`, hide `nintendo-dsi`
    - `nintendo-3ds` => show `new-nintendo-3ds-xl` and `nintendo-2ds`, hide `nintendo-3ds`

If there are multiple entries of the same family and one of them has `main: true`, then show digital games on that one only.
Same thing for digital game entry, show only `main: true` console.

---

Now we need to align the scripts.

1. Get the code ready for the new schema formats
2. Get it ready for single entries instead of lists
3. Consider lazy loading jsons (?)

---

I need a new page: Systems
This page should have a dashboard card entry
It should list every entry of `type` `system`, in the same as the other lists, a card based list with logo (no need for the name since it will be contained in the logo)
Every entry should be clickable, upon clicking, it should have a header with the logo followed by a list of every entry that contains `system` === the `id` of the system entry.
||||||| parent of df938e2 (Restructure project folders)
=======

💿 physical
☁️ digital
🧩 injection
🃏 reproduction
🤍 wishlist (white heart)
📦 contained
🕹️ built_in

❤️ Non-negotiable
🧡 Essential
💛 High
🩷 Medium
🤍 Low

---

If an hardware entry is console and has `hardware.family`, the Games section should show all game entries in which `ownership.platform` are equal to `family`.
Likewise, if game `ownership.platform` is part of a `family` in hardware, show all consoles that apply in Platforms section.

Inside every detail page, the symbols that appear should have a tooltip:
    - `ownership[].format: physical` 💿 => Physical
    - `ownership[].format: digital` ☁️ => Digital
    - `ownership[].format: reproduction` 🃏 => Reproduction cart
    - `ownership[].format: injection` 🧩 => Injected in a Mini console
    - `relationships[].type: contained` 📦 => Contained in a collection or
    bundle
    - `ownership[].wishlist: true` 🤍 => Wishlisted`

If `ownership[].format: injection`, then, in the console:
    - Check previous changes related to injection, they are extremely wrong and should be reversed.
    - Under the "Games" section, add a new section called "Injected"
    - Injected games should appear here instead of the games section

Games are not showing all consoles available, they are just showing what's inside `ownership`.
Also, games should only show platforms of the same family that have entries.
Examples:
    - `nintendo-dsi` => show `nintendo-dsi-xl`, hide `nintendo-dsi`
    - `nintendo-3ds` => show `new-nintendo-3ds-xl` and `nintendo-2ds`, hide `nintendo-3ds`

If there are multiple entries of the same family and one of them has `main: true`, then show digital games on that one only.
Same thing for digital game entry, show only `main: true` console.

---

Now we need to align the scripts.

1. Get the code ready for the new schema formats
2. Get it ready for single entries instead of lists
3. Consider lazy loading jsons (?)

---

---

New dashboard:

Collection

- Games
- Hardware
- Amiibo
- Wishlist

Play

- Backlog
- Playing
- Completed
- Dropped

Taxonomy

- Systems
- Series
- Companies

Curation

- Gaps
- Preservation
- Recommendations
- Priority Lists

---

Here's what I'm thinking then:

`type: game`:
`entry.companies`: turns to a string array that contains what's inside `developers`

`type: hardware`
`entry.hardware`:
    - `system` now lives here
    - `primary_family` should be `system`
    - `compatible_families` turns to `compatible`
    - `compatible_with` turns to `peripherals`

The others stay the same, despite whatever you are saying, I believe they are solid as they are.

---

`type: game`:
`entry.companies`: turns to a string array that contains what's inside `developers`

Developers are now Companies instead.
Series and Companies pages should only list `major` and `minor` entries.
Upon clicking on an entry, it shows a subheard with all the `sub` entries. Then it shows all entries as follows:

- Series (in order)
  - `hardware.franchises.series` = `major`/`minor`, `game.franchises.subseries` = `sub`
  - `game.franchises.series` = `major`/`minor`, `game.franchises.subseries` = `sub`
  - `amiibo.franchises.series` = `major`/`minor`, `game.franchises.subseries` = `sub`

- Developers (in order)
  - `system.companies`:  an array, has to include the id of `company`, after the database update, `game.companies` includes `company.id`
  - `series.companies`:
  - `game.companies.developer`, an array, has to include the id of `company`, after the database update, `game.companies` includes `company.id`

---

Alright, that's good then. Sounds good. Now my question is, what owns what? How should I connect the documents?

I've been doing it as follows:

- `type: game`:
  - `id`
  - `franchise`:
    - `universe`: probably useless
    - `series` connects to `type: series`, `circle: major/minor`
    - `subseries`: connects to `type: series`, `circle: sub`
  - `system`: connects to `type: system`
  - `access`: array
    - `platform`: connects to `type: hardware`
    - `via`: connects to `type: collection/bundle`
    - `format`: identifies if `physical`, `digital`, `built_in`, `injected`, `contained`
    - `status`: identifies if `owned` or `wishlisted`, can be `borrowed` as well
  - `versions`: array
    - `source`: connects to other games
    - `type`: identifies the type of connection between the games, `remix`, `remake`, `port`, etc.
  - `relationships`: array
    - `source`: connects to other games
    - `type`: identifies the type of connection between the games, `sequel`, `prequel`, etc.
  - `companies`
    - `developer`: string array for some reason, connects to `type: developer`
    - `publisher`: string array for some reason, probably useless
  - `progress`: will be useful for the backlog page
  - `event`: For anniversary releases and other stuff, will eventually have it's own page as well.
- `type: hardware`
  - `id`
  - `franchise`
    - `series` connects to `type: series`, `circle: major/minor`
    - `subseries`: connects to `type: series`, `circle: sub`
  - `system`: connects to `type: system`
  - `companies`
    - `manufacturer`: string array for some reason, connects to `type: developer`
    - `publisher`: string array for some reason, probably useless
  - `hardware`
    - `primary_family`: filter's games by system, legacy
    - `compatible_families`: other compatible systems, legacy
    - `generation`: groups hardware by generation, legacy
    - `era`: groups hardware by era
    - `compatible_with`: for controllers and accessories
  - `ownership`: lists multiple units, variants, etc
    - `variant`: name of the variant
    - `status`: owned, wishlisted, etc
  - `contains`: list of game id's, for Mini Consoles.
  - `event`: For anniversary releases and other stuff, will eventually have it's own page as well.
- `type: amiibo`
  - `id`
  - `franchise`
    - `series` connects to `type: series`, `circle: major/minor`
    - `subseries`: connects to `type: series`, `circle: sub`
  - `amiibo`:
    - `number`: for smash releases
    - `wave`: to group amiibos from the same wave
  - `ownership`: owned, wishlisted, etc
  - `functionality`
    - `game`: links to the game via id
    - `effect`: what it does
  - `event`: For anniversary releases and other stuff, will eventually have it's own page as well.
- `type: system`
  - `id`
- `type: series`
  - `id`
  - `circle`: `major`, `minor`, `sub`
  - `contains`: string array linking to other series
- `type: developer`
  - `id`
  - `circle`: `major`, `minor`, `sub`
  - `contains`: string array linking to other developers

There are other, mostly informational only properties (for now) that I did not list. My main concern is, am I linking these correctly? Or should I add a string array to more effectly link shit to eachother?

For example:

- A `developer` has `series`, `games`, `hardware`, `systems`
- A `system` has `games`, `hardware`
- A `series` has `games`, `hardware` (rarely), `amiibos`
- A `game` has `developer`, `system`, `hardware`, `series`
- An `hardware` has `developer` (via `manufacturer` for now), `system`, `games`
- An `amiibo` has `series`

`developer`, `system` and `series` are for filtering only. There are pages for them with filtered entries.
`game`, `hardware` and `amiibo` have detail pages, which show connections to other types of media.

----

New dashboard, has these button cards:

- Collection
- Taxonomy
- Play (dud for now)

Upon opening Collection has these card buttons

- Games: List of currently owned games (`format: physical/digital`)
- Hardware: List of currently owned hardware
- Amiibo: List of currently owned Amiibo
- Wishlist: Has 3 tabs, Games, Hardware, Amiibo. Each tab lists entries with `status: wishlist`

Upon opening Taxonomy has these card buttons

- Companies
- Systems
- Series

Then, each of those, upon opening list their own entries logos (nothing else).

Upon opening Companies has these card buttons

- Systems: Opens a filtered list of systems belonging to that company
- Hardware: Opens a filtered list of hardware belonging to that company
- Series: Opens a filtered list of series belonging to that company
- Games: Opens a filtered list of games belonging to that company

Upon opening Systems has these card buttons

- Hardware: Opens a filtered list of hardware belonging to that system
- Games: Opens a filtered list of games belonging to that system

Upon opening Series has these card buttons

- Hardware: Opens a filtered list of hardware belonging to that series
- Games: Opens a filtered list of games belonging to that series
- Amiibo: Opens a filtered list of amiibo belonging to that series

Entries of type `system`, `hardware`, `series` and `games` either have or will have a `companies` array. If they don't, don't worry about it, it will be corrected by hand.
Entries of type `hardware`, and `games` either have or will have a `system` property. If they don't, don't worry about it, it will be corrected by hand.
Entries of type `hardware`, `games` and `amiibo` either have or will have a `series` property. If they don't, don't worry about it, it will be corrected by hand.

New dashboard on `index.html`. Save old dashboard as `temp.html`.

---

Alright, good effort.
Here's what you fucked up:

## Collection

- Games are not listing
- Hardware is not listing
- Clicking Amiibos does nothing
- Wishlist
  - Games are not listing
  - Hardware is listing but does not show images on cards. Cards are not clickable.
  - Amiibo is not listing
  - Clicking hardware and then amiibo, still lists hardware
- Taxonomy
  - Companies are not listing
  - Systems is listing but does not show images on cards
    - Hardware is listing without images. Cards are not clickable.
    - Games is listing normally. Cards are not clickable.
  - Series is listing but does not show images on cards
    - Games are not listing.

Then, after solving those issues.

- Inside each Company, System and Series, instead of card buttons, use tabs instead.

---
I specifically told you that:
Collection -> Games should show games that are `owned`. It, instead is showing EVERYTHING. As expected, you probably took the lazy route and assumed "if not wishlisted, then owned", which is untrue and you would have noticed if you weren't lazy.
Collection -> Hardware is not showing the images. Again, most likely because you decided to be lazy and did not notice that some images are actually contained inside the `images` folder.
Collection -> Amiibos shows everything. The images appear cut because you decided by yourself that every card should have the same size, thus the images look disgusting now because you are cutting them vertically and/or horizontally.

Taxonomy -> Companies is still not showing anything. It should show entries of type `company`
Taxonomy -> Systems is fine but, if a tab has no entries, don't show it at all. If neither have it, don't show anything.
Taxonomy -> Series is also fine but, same issue as Systems: if a tab has no entries, don't show it at all. If neither have it, don't show anything.

No cards are clickable. For the third time, cards should be clickable so I can navigate to the detail pages.
>>>>>>> df938e2 (Restructure project folders)
