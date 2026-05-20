# 🎮 Game Collector Profile — “Pragmatic Physical Curator” (v2 FINAL)

## 🧠 Core Identity

A **pragmatic, system-driven game collector** focused on:

* Physical media first
* High-quality **historical representation**
* Structured, intentional collecting (not completionism for its own sake)

Collection spans all **4 gaming pillars**:

* Home Consoles
* Handhelds
* PCs / Home Computers
* Arcade

---

## 🧩 Core Rules

### 1. 📦 Physical-First Policy

* Strong preference for **physical games**
* Digital allowed only when:

  * No physical release exists
  * Content is DLC/expansion
  * Original hardware is not owned

---

### 2. 🕹️ Platform Legitimacy Rule

Collect physical games only for:

* Consoles currently owned
* Consoles previously owned

Owned platforms include:

* Nintendo GameCube, Wii, Wii U, Nintendo Switch (+ Switch 2)
* Game Boy Color, Game Boy Advance, Nintendo 3DS
* Xbox 360, PlayStation 3
* Dreamcast
* Mini systems (NES, SNES, Mega Drive, PlayStation)

For non-owned systems:

* Prefer **mini consoles or curated replicas**
* Avoid original hardware ecosystems that require expensive game collecting

---

### 3. 🌍 Region Policy (Strict)

Priority order:

1. **PAL (default)**
2. **NTSC-U (only if exclusive)**
3. ❌ **NTSC-J (never collected)**

---

### 4. 📦 Condition & Format Rules

* Cartridge-based systems → **loose cartridges preferred**
* Disc-based systems (GC onward) → **complete boxed copies required**
* No interest in cardboard box preservation (e.g. NES, SNES)

---

### 5. 💰 Budget Strategy

* Primary: **Value hunter**
* Secondary: **Selective completionist**

Meaning:

* Wait for good deals
* Pay premium only when:

  * Filling an important gap
  * Completing a meaningful series subset

---

## 🏛️ Collection Structure

### A. 🎯 Per-Platform Strategy

Each platform is curated with:

#### 1. Core Library (Mandatory)

* Defining titles
* Genre representatives
* Technical showcases

#### 2. Extended Library (Selective)

* Personal interest
* Critically relevant additions

#### 3. Series Layer (Overrides rules)

* Games added to maintain series continuity

---

### B. 🔁 Duplication Logic

Multiple versions are allowed when:

* Part of a **tracked series**
* Versions are:

  * Historically meaningful
  * Technically distinct
* Already owned → may expand backward or forward

Example behavior:

* The Legend of Zelda: Twilight Princess → GC, Wii, Wii U versions coexist
* The Legend of Zelda: Breath of the Wild → Wii U + Switch coexist

---

### C. 🔄 Re-release Policy

Remakes / remasters:

* **Coexist** when:

  * Series is actively collected
* Otherwise:

  * Prefer best version available
  * Avoid redundant duplication

---

## 🧬 Series Priority System

### 🔥 High-Priority (Extensive Collection)

* The Legend of Zelda
* Super Mario
* Metroid
* Kirby
* Paper Mario
* Mario & Luigi
* Wario
* Luigi's Mansion

### ⚖️ Medium-Priority (Selective Coverage)

* Sonic the Hedgehog
* Dragon Ball
* Castlevania
* Yoshi
* Tenchu
* Soulcalibur
* Bayonetta

---

## 🧱 Platform Inclusion Logic

### ✅ Include if

* Historically relevant
* Strong or unique library
* Adds meaningful diversity

### ❌ Skip if

* Weak or redundant ecosystem
  *(example: Game Gear)*

---

## 🕹️ Hardware Strategy

Priority order:

1. Original hardware (if owned historically)
2. Official mini consoles
3. Custom curated systems

---

### 🧪 Custom Systems (Explicitly Supported)

* MS-DOS Mini
* MSX Mini

Used to:

* Cover missing PC/computer eras
* Provide curated, high-value experiences

---

## 🕹️ Arcade Strategy

* Prefer **mini arcade systems** over original boards
* Examples of target platforms:

  * Astro City Mini
  * Egret II Mini
  * Neo Geo MVSX

---

## 🎯 Decision Engine (How to Evaluate a Game)

When considering a purchase:

1. Does it improve **platform representation**?
2. Does it support a **tracked series**?
3. Is it **historically meaningful**?
4. Is this the **best version available**?
5. Does it justify **cost vs value**?

---

## 🚫 Anti-Goals

* No full-set completionism
* No rarity-driven purchases
* No expensive legacy ecosystems (e.g. Atari carts)
* No NTSC-J collecting
* No redundant versions outside series context

---

# 🧾 Short Version (for prompts)

If you need something compact to paste into other LLMs:

```
Pragmatic physical game collector. Prefers physical media; digital only if no alternative. Collects only for owned/ex-owned consoles; otherwise uses mini systems or custom builds. Defaults to PAL, accepts NTSC-U exclusives, never NTSC-J. Cartridge loose preferred; disc-based must be boxed.

Focus is curated representation per platform (not full sets), with strong emphasis on Nintendo series (Zelda, Mario, Metroid, etc.). Allows duplicates only for series or meaningful version differences.

Value hunter with selective completionism. Skips weak platforms. Covers all 4 gaming pillars (console, handheld, PC, arcade), including custom MS-DOS/MSX builds and arcade minis.

Decision criteria: representation, series relevance, historical value, best version, price justification.
```

---

# 🧱 JSON Version (LLM-friendly)

If you want to plug this into systems:

```json
{
  "collector_type": "pragmatic_physical_curator",
  "physical_priority": true,
  "digital_policy": {
    "allowed_when": ["no_physical", "dlc", "no_hardware"]
  },
  "region_policy": {
    "preferred": "PAL",
    "allowed": ["NTSC-U_if_exclusive"],
    "excluded": ["NTSC-J"]
  },
  "condition_policy": {
    "cartridge": "loose_preferred",
    "disc": "boxed_required"
  },
  "budget_strategy": {
    "type": "value_hunter",
    "exceptions": "selective_completionism"
  },
  "platform_rules": {
    "collect_if_owned": true,
    "otherwise": ["mini_console", "custom_system"]
  },
  "series_priority": {
    "high": ["Zelda", "Mario", "Metroid", "Kirby", "Paper Mario", "Mario & Luigi", "Wario", "Luigi's Mansion"],
    "medium": ["Sonic", "Dragon Ball", "Castlevania", "Yoshi", "Tenchu", "Soulcalibur", "Bayonetta"]
  },
  "duplication_policy": {
    "allowed_when": ["series", "meaningful_differences", "historical_value"]
  },
  "pillars": ["console", "handheld", "pc", "arcade"],
  "arcade_preference": "mini_cabinets",
  "custom_systems": ["MS-DOS Mini", "MSX Mini"],
  "decision_criteria": [
    "platform_representation",
    "series_relevance",
    "historical_significance",
    "best_version",
    "price_value"
  ],
  "anti_goals": [
    "full_set_completion",
    "rarity_driven",
    "expensive_legacy_collecting",
    "ntsc_j_collecting"
  ]
}
```
