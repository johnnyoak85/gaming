const GAMES_SOLO_PATH = "./assets/data/";
const HARDWARE_SOLO_PATH = "./assets/data/";
const AMIIBO_SOLO_PATH = "./assets/data/";
const IMAGE_BASE = "./assets/images/game";

// ---------------------------------------------------------------------------
// Enum maps
// ---------------------------------------------------------------------------

const MODES = {
  solo: "Solo",
  co_op: "Co Op",
  versus: "Versus",
  turn_based: "Turn Based",
  online: "Online",
  party: "Party",
};

const ACCESS_FORMAT = {
  physical: "Physical",
  digital: "Digital",
  built_in: "Built-in",
  contained: "Contained",
  injected: "Injected",
  reproduction: "Reproduction",
};

const VERSIONS_FORMAT = {
  base: "Base",
  port: "Port",
  enhanced_port: "Enhanced Port",
  remaster: "Remaster",
  enhanced_remaster: "Enhanced Remaster",
  remake: "Remake",
  enhanced_remake: "Enhanced Remake",
  remix: "Remix",
  enhanced_remix: "Enhanced Remix",
  regional_variant: "Regional Variant",
  demake: "Demake",
  enhanced_version: "Enhanced Version"
};

const RELATIONSHIP_TYPES = {
  base: "Base",
  original: "Original",
  prequel: "Prequel",
  sequel: "Sequel",
  spinoff: "Spinoff",
  reimagining: "Reimagining",
  spiritual_successor: "Spiritual Successor",
  spiritual_predecessor: "Spiritual Predecessor",
  expansion: "Expansion",
  twin_engine: "Twin Engine",
  twin_game: "Twin Game",
  adaptation: "Adaptation",
  enhanced_compilation: "Enhanced Compilation"
};

function enumLabel(map, key) {
  if (key == null) return "—";
  return map[key] ?? key;
}

// ---------------------------------------------------------------------------
// Data helpers
// ---------------------------------------------------------------------------

let hwCache = {};
let gameCache = {};
let amiiboCache = {};

function getCover(game) {
  if (!game.cover) return null;
  if (game.cover.startsWith("http")) return game.cover;
  return `${IMAGE_BASE}/${game.cover}.png`;
}

function getPlayerAge(game) {
  return game.player_age ?? null;
}

function coverUrl(name) {
  if (!name) return null;
  if (name.startsWith("http")) return name;
  return `./assets/images/hardware/${name}.png`;
}

async function loadGame(id) {
  if (gameCache[id]) return gameCache[id];
  try {
    const res = await fetch(`${GAMES_SOLO_PATH}${id}.json`);
    if (!res.ok) return null;
    gameCache[id] = await res.json();
    return gameCache[id];
  } catch (e) {
    return null;
  }
}

async function loadHardware(id) {
  if (hwCache[id]) return hwCache[id];
  try {
    const res = await fetch(`${HARDWARE_SOLO_PATH}${id}.json`);
    if (!res.ok) return null;
    hwCache[id] = await res.json();
    return hwCache[id];
  } catch (e) {
    return null;
  }
}

async function loadAmiibo(id) {
  if (amiiboCache[id]) return amiiboCache[id];
  try {
    const res = await fetch(`${AMIIBO_SOLO_PATH}${id}.json`);
    if (!res.ok) return null;
    amiiboCache[id] = await res.json();
    return amiiboCache[id];
  } catch (e) {
    return null;
  }
}

async function loadEntry(id) {
  const hw = await loadHardware(id);
  if (hw) return hw;
  const game = await loadGame(id);
  if (game) return game;
  return null;
}

function isHardwareWishlisted(hw) {
  const ownership = hw.ownership ?? [];
  if (!ownership.length) return false;
  return ownership.every((o) => o.status === "wishlist");
}

function entryDetailPage(entry) {
  if (entry.type === "hardware") return "hardware-detail.html";
  return "detail.html";
}

function entryCover(entry) {
  if (entry.type === "hardware") return coverUrl(entry.cover);
  return getCover(entry);
}

let manifestCache = null;

async function findFamilyMembers(hw) {
  const family = hw.hardware?.primary_family;
  if (!family) return [hw];

  try {
    if (!manifestCache) {
      const res = await fetch("./assets/data/manifest.json");
      if (!res.ok) return [hw];
      manifestCache = await res.json();
    }
    const hwIds = manifestCache
      .filter((e) => e.type === "hardware")
      .map((e) => e.id);

    const members = await Promise.all(
      hwIds.map(async (id) => {
        const entry = await loadHardware(id);
        if (!entry) return null;
        if (entry.hardware?.primary_family !== family) return null;
        if (entry.hardware?.category !== "console") return null;
        return entry;
      })
    );
    const result = members.filter(Boolean);
    return result.length > 0 ? result : [hw];
  } catch {
    return [hw];
  }
}

const PRIORITY = {
  5: { label: "Critical", color: "priority-critical" },
  4: { label: "High", color: "priority-high" },
  3: { label: "Medium", color: "priority-medium" },
  2: { label: "Low", color: "priority-low" },
  1: { label: "Backlog", color: "priority-backlog" },
};

const WISHLIST_LEVEL = {
  1: { emoji: "🤍", label: "Low" },
  2: { emoji: "🩷", label: "Medium" },
  3: { emoji: "💛", label: "High" },
  4: { emoji: "🧡", label: "Essential" },
  5: { emoji: "❤️", label: "Non-negotiable" },
};

function priorityBadge(value) {
  if (value == null) return null;
  const entry = PRIORITY[value];
  if (!entry) return null;
  return el("span", { class: `priority-badge ${entry.color}` }, entry.label);
}

// ---------------------------------------------------------------------------
// Render helpers
// ---------------------------------------------------------------------------

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null) continue;
    node.setAttribute(k, v);
  }
  for (const child of [].concat(children)) {
    if (child == null) continue;
    node.append(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return node;
}

function section(title, ...content) {
  const filtered = content.filter(Boolean);
  if (!filtered.length) return null;
  return el("section", { class: "detail-section" }, [
    el("h2", {}, title),
    ...filtered,
  ]);
}

function chips(items) {
  if (!items?.length) return null;
  return el(
    "div",
    { class: "chips" },
    items.map((t) => el("span", { class: "chip" }, t))
  );
}

function field(label, value) {
  if (value == null || value === "") return null;
  return el("div", { class: "field" }, [
    el("span", { class: "field-label" }, label),
    el("span", { class: "field-value" }, String(value)),
  ]);
}

function stars(n, icon = "⭐") {
  if (n == null) return null;
  return icon.repeat(n);
}

function skulls(n) {
  return stars(n, "💀");
}

function formatHours(h) {
  if (h == null) return null;
  return `${h}h`;
}

function ordinalSuffix(day) {
  if (day >= 11 && day <= 13) return "th";
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDate(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr + "T00:00:00");
  if (isNaN(date)) return dateStr;

  const day = date.getDate();
  const month = MONTHS[date.getMonth()];
  const year = date.getFullYear();

  return `${day}${ordinalSuffix(day)} of ${month}, ${year}`;
}

function timeDistance(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr + "T00:00:00");
  if (isNaN(date)) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffMs = today - date;
  const past = diffMs >= 0;
  const earlier = past ? date : today;
  const later = past ? today : date;

  let years = later.getFullYear() - earlier.getFullYear();
  const passedAnniv =
    later.getMonth() > earlier.getMonth() ||
    (later.getMonth() === earlier.getMonth() &&
      later.getDate() >= earlier.getDate());
  if (!passedAnniv) years--;

  if (years >= 1) {
    const u = `year${years === 1 ? "" : "s"}`;
    return past ? `${years} ${u} ago` : `in ${years} ${u}`;
  }

  let months =
    (later.getFullYear() - earlier.getFullYear()) * 12 +
    later.getMonth() -
    earlier.getMonth();
  if (later.getDate() < earlier.getDate()) months--;

  if (months >= 1) {
    const u = `month${months === 1 ? "" : "s"}`;
    return past ? `${months} ${u} ago` : `in ${months} ${u}`;
  }

  const days = Math.round(Math.abs(diffMs) / 86400000);
  if (days === 0) return "Today";
  const u = `day${days === 1 ? "" : "s"}`;
  return past ? `${days} ${u} ago` : `in ${days} ${u}`;
}

function isAnniversary(dateStr) {
  if (!dateStr) return false;
  const date = new Date(dateStr + "T00:00:00");
  if (isNaN(date)) return false;

  const today = new Date();
  return today.getMonth() === date.getMonth() && today.getDate() === date.getDate();
}

function releaseLine(dateStr) {
  if (!dateStr) return null;
  const formatted = formatDate(dateStr);
  const ago = timeDistance(dateStr);
  const cake = isAnniversary(dateStr) ? " 🎂" : "";
  const parts = [formatted];
  if (ago) parts.push(ago);
  return parts.join(" · ") + cake;
}

function statusLabel(status) {
  const map = {
    planned: "📋 Planned",
    playing: "🎮 Playing",
    paused: "⏸️ Paused",
    finished: "✅ Finished",
    completed: "🏆 Completed",
    dropped: "❌ Dropped",
  };
  return map[status] ?? status ?? "Unknown";
}

// ---------------------------------------------------------------------------
// Page builder
// ---------------------------------------------------------------------------

async function buildPage(game) {
  const cover = getCover(game);

  const classif = game.classification;
  const backlog = game.backlog;

  const genreLine = [
    ...(classif?.genres ?? []),
    ...(classif?.subgenres ?? []),
  ].join(" · ") || null;

  const themeLine = (classif?.themes ?? []).join(" · ") || null;

  const ageValue = getPlayerAge(game);
  const ps = game.playstyle;
  const playersLine = ps?.players ? `👤 ${ps.players.min}–${ps.players.max}` : null;
  const modesLine = ps?.modes?.length
    ? ps.modes.map((m) => enumLabel(MODES, m)).join(" · ")
    : null;

  // Access status (replaces ownership)
  const access = game.access ?? [];
  const isWishlisted = access.some((a) => a.status === 'wishlist');
  const formats = new Set(access.filter((a) => a.status !== 'wishlist').map((a) => a.format).filter(Boolean));
  const ownershipClass = isWishlisted ? "ownership-icon wishlist-icon" : "ownership-icon owned-icon";

  const wishlistLevel = isWishlisted ? (game.acquisition?.priority ?? 1) : null;
  const wlInfo = wishlistLevel != null ? WISHLIST_LEVEL[wishlistLevel] : null;

  const iconEntries = [
    wlInfo ? { emoji: wlInfo.emoji, tip: `Wishlist: ${wlInfo.label}` } : null,
    formats.has("physical") ? { emoji: "🏷️", tip: "Physical" } : null,
    formats.has("digital") ? { emoji: "☁️", tip: "Digital" } : null,
    formats.has("injected") ? { emoji: "🧩", tip: "Injection" } : null,
    formats.has("reproduction") ? { emoji: "🃏", tip: "Reproduction" } : null,
    formats.has("contained") ? { emoji: "📦", tip: "Contained" } : null,
    formats.has("built_in") ? { emoji: "🕹️", tip: "Built In" } : null,
  ].filter(Boolean);

  // Franchise line: universe · series · subseries
  const franchiseParts = [
    game.franchise?.universe,
    game.franchise?.series,
    game.franchise?.subseries,
  ].filter(Boolean);
  const franchiseLine = franchiseParts.length ? franchiseParts.join(" · ") : null;

  // Companies line
  const companyParts = game.companies ?? [];
  const companiesLine = companyParts.length ? companyParts.join(" · ") : null;

  const leftCol = el("div", { class: "hero-col" }, [
    game.release
      ? el("p", { class: "release-date" }, releaseLine(game.release))
      : null,
    franchiseLine ? el("p", { class: "hero-detail" }, franchiseLine) : null,
    genreLine ? el("p", { class: "hero-detail" }, genreLine) : null,
    themeLine ? el("p", { class: "hero-detail" }, themeLine) : null,
    companiesLine ? el("p", { class: "hero-detail" }, companiesLine) : null,
  ]);

  const rightCol = el("div", { class: "hero-col" }, [
    backlog?.priority != null || game.progress
      ? el("div", { class: "hero-badges" }, [
        priorityBadge(backlog?.priority),
        el("span", { class: "status-badge" }, statusLabel(game.progress)),
      ])
      : null,
    backlog?.reason ? el("p", { class: "hero-detail hero-reason" }, backlog.reason) : null,
    backlog?.rating != null ? el("p", { class: "hero-detail" }, `Rating ${stars(backlog.rating)}`) : null,
    backlog?.difficulty != null ? el("p", { class: "hero-detail" }, `Difficulty: ${skulls(backlog.difficulty)}`) : null,
    backlog?.estimated_hours != null ? el("p", { class: "hero-detail" }, `Time to beat: ~${formatHours(backlog.estimated_hours)}`) : null,
    ageValue != null ? el("p", { class: "hero-detail" }, `Age ${ageValue}+`) : null,
    playersLine ? el("p", { class: "hero-detail" }, playersLine) : null,
    modesLine ? el("p", { class: "hero-detail" }, modesLine) : null,
  ]);

  const hero = el("div", { class: "hero" }, [
    cover ? el("img", { src: cover, alt: `${game.name} cover`, class: "hero-cover" }) : null,
    el("div", { class: "hero-info" }, [
      el("div", { class: "hero-title-row" }, [
        el("h1", {}, game.name),
        el("span", { class: ownershipClass }, iconEntries.map((i) => el("span", { title: i.tip, class: "icon-tip" }, i.emoji))),
      ]),
      el("div", { class: "hero-grid" }, [leftCol, rightCol]),
    ]),
  ]);

  // Access section - show each access entry
  let accessSection = null;
  let wishlistAccessSection = null;
  if (access.length > 0) {
    // Deduplicate: per console, first occurrence wins
    const seenPlatforms = new Set();
    const dedupedAccess = [];
    for (const a of access) {
      const key = a.platform ?? "";
      if (key && seenPlatforms.has(key)) continue;
      if (key) seenPlatforms.add(key);
      dedupedAccess.push(a);
    }

    const ownedCards = [];
    const wishlistCards = [];
    const shownHwIds = new Set();

    for (const a of dedupedAccess) {
      const targetId = a.via ?? a.platform;
      if (!targetId) continue;

      // Wishlisted access entries go to Wishlist Access
      if (a.status === "wishlist") {
        const entry = await loadEntry(targetId);
        if (!entry) continue;
        const card = el("div", { class: "variant-card" }, [
          entryCover(entry) ? el("img", { src: entryCover(entry), alt: entry.name, class: "variant-cover" }) : null,
          el("p", { class: "variant-label" }, entry.name),
          el("p", { class: "variant-event" }, enumLabel(ACCESS_FORMAT, a.format)),
        ]);
        wishlistCards.push(el("a", { href: `${entryDetailPage(entry)}?id=${encodeURIComponent(targetId)}`, class: "hw-card-link" }, card));
        continue;
      }

      const entry = await loadEntry(targetId);
      if (!entry) continue;

      // If hardware, expand family members
      if (entry.type === "hardware") {
        const familyMembers = await findFamilyMembers(entry);
        for (const member of familyMembers) {
          if (shownHwIds.has(member.id)) continue;
          shownHwIds.add(member.id);
          // Wishlisted hardware goes to Wishlist Access
          const targetList = isHardwareWishlisted(member) ? wishlistCards : ownedCards;
          const cover = coverUrl(member.cover);
          const card = el("div", { class: "variant-card" }, [
            cover ? el("img", { src: cover, alt: member.name, class: "variant-cover" }) : null,
            el("p", { class: "variant-label" }, member.name),
            el("p", { class: "variant-event" }, enumLabel(ACCESS_FORMAT, a.format)),
          ]);
          targetList.push(el("a", { href: `hardware-detail.html?id=${encodeURIComponent(member.id)}`, class: "hw-card-link" }, card));
        }
      } else {
        // Non-hardware (collection, bundle, game)
        const cover = getCover(entry);
        const card = el("div", { class: "variant-card" }, [
          cover ? el("img", { src: cover, alt: entry.name, class: "variant-cover" }) : null,
          el("p", { class: "variant-label" }, entry.name),
          el("p", { class: "variant-event" }, enumLabel(ACCESS_FORMAT, a.format)),
        ]);
        ownedCards.push(el("a", { href: `detail.html?id=${encodeURIComponent(targetId)}`, class: "hw-card-link" }, card));
      }
    }

    if (ownedCards.length > 0) {
      accessSection = section(
        "Access",
        el("div", { class: "variant-gallery" }, ownedCards)
      );
    }
    if (wishlistCards.length > 0) {
      wishlistAccessSection = section(
        "Wishlist Access",
        el("div", { class: "variant-gallery" }, wishlistCards)
      );
    }
  }

  // Contains (bundles/collections) - async load
  let containsSection = null;
  const containsIds = game.contains ?? [];
  if (containsIds.length > 0) {
    const containsCards = await Promise.all(
      containsIds.map(async (id) => {
        const contained = await loadGame(id);
        const cName = contained?.name ?? id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        const cCover = contained ? getCover(contained) : null;

        const card = el("div", { class: "variant-card" }, [
          cCover
            ? el("img", { src: cCover, alt: cName, class: "variant-cover" })
            : null,
          el("p", { class: "variant-label" }, cName),
        ]);

        if (contained) {
          return el("a", { href: `detail.html?id=${encodeURIComponent(id)}`, class: "hw-card-link" }, card);
        }
        return card;
      })
    );
    if (containsCards.length > 0) {
      containsSection = section(
        "Contains",
        el("div", { class: "variant-gallery" }, containsCards.filter(Boolean))
      );
    }
  }

  // Versions (was Availability)
  let versionsSection = null;
  const gameId = game.id;
  const avail = (game.versions ?? []).filter((a) => a.source !== gameId);
  if (avail.length > 0) {
    const versionCards = await Promise.all(
      avail.map(async (a) => {
        const sourceId = a.source;
        const sourceGame = await loadGame(sourceId);
        const sourceName = sourceGame?.name ?? sourceId;
        const sourceCover = sourceGame?.cover ?? null;

        const card = el("div", { class: "variant-card" }, [
          sourceCover
            ? el("img", { src: sourceCover, alt: sourceName, class: "variant-cover" })
            : null,
          el("p", { class: "variant-label" }, sourceName),
          // TODO: Remove format from versions
          el("p", { class: "variant-event" }, enumLabel(VERSIONS_FORMAT, a.format || a.type)),
        ]);

        return el("a", { href: `detail.html?id=${encodeURIComponent(sourceId)}`, class: "hw-card-link" }, card);
      })
    );
    versionsSection = section(
      "Versions",
      el("div", { class: "variant-gallery" }, versionCards.filter(Boolean))
    );
  }

  // Relationships
  let relationshipsSection = null;
  const rels = game.relationships ?? [];
  if (rels.length > 0) {
    const relationshipCards = await Promise.all(
      rels.map(async (r) => {
        const sourceId = r.source;
        const sourceGame = await loadGame(sourceId);
        const sourceName = sourceGame?.name ?? sourceId;
        const sourceCover = sourceGame?.cover ?? null;

        const card = el("div", { class: "variant-card" }, [
          sourceCover
            ? el("img", { src: sourceCover, alt: sourceName, class: "variant-cover" })
            : null,
          el("p", { class: "variant-label" }, sourceName),
          el("p", { class: "variant-event" }, enumLabel(RELATIONSHIP_TYPES, r.type)),
        ]);

        return el("a", { href: `detail.html?id=${encodeURIComponent(sourceId)}`, class: "hw-card-link" }, card);
      })
    );
    relationshipsSection = section(
      "Relationships",
      el("div", { class: "variant-gallery" }, relationshipCards.filter(Boolean))
    );
  }

  const tagsSection = classif?.tags?.length
    ? section("Tags", chips(classif.tags))
    : null;

  // Compatible Amiibo - lazy load as needed
  const amiiboSection = null; // TODO: implement async amiibo loading

  // Details section (event + notes)
  const detailsSection = (game.event || game.notes)
    ? section(
      "Details",
      game.event ? field("Event", game.event) : null,
      game.notes ? el("p", { class: "notes-text" }, game.notes) : null
    )
    : null;

  return [
    hero,
    accessSection,
    wishlistAccessSection,
    containsSection,
    versionsSection,
    relationshipsSection,
    detailsSection,
    amiiboSection,
    tagsSection,
  ].filter(Boolean);
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", async () => {
  const main = document.getElementById("detail");
  const params = new URLSearchParams(window.location.search);
  const targetId = params.get("id");

  if (!targetId) {
    main.innerHTML = "<p class='error'>No game ID provided. Use <code>?id=game-slug</code>.</p>";
    main.classList.remove("loading");
    return;
  }

  try {
    // Load single game entry instead of entire array
    const gameRes = await fetch(`${GAMES_SOLO_PATH}${targetId}.json`);
    if (!gameRes.ok) {
      main.innerHTML = `<p class='error'>Game <code>${targetId}</code> not found.</p>`;
      main.classList.remove("loading");
      return;
    }

    const game = await gameRes.json();

    document.title = `${game.name} — Game Details`;
    main.innerHTML = "";
    main.classList.remove("loading");
    const pageNodes = await buildPage(game);
    pageNodes.forEach((node) => main.appendChild(node));
  } catch (err) {
    main.innerHTML = `<p class='error'>Failed to load game data: ${err.message}</p>`;
    main.classList.remove("loading");
  }
});
