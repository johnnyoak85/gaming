
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
