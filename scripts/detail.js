const DATA_PATH = "./data/games.json";
const HARDWARE_PATH = "./data/hardware.json";
const AMIIBO_PATH = "./data/amiibo.json";

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

const OWNERSHIP_FORMAT = {
  physical: "Physical",
  digital: "Digital",
};

const VERSIONS_FORMAT = {
  base: "Base",
  port: "Port",
  enhanced_port: "Enhanced Port",
  remaster: "Remaster",
  enhanced_remaster: "Enhanced Remaster",
  remake: "Remake",
  enhanced_remake: "Enhanced Remake",
  reimagining: "Reimagining",
  expansion: "Expansion",
  remix: "Remix",
  enhanced_remix: "Enhanced Remix"
};

const RELATIONSHIP_TYPES = {
  original: "Original",
  prequel: "Prequel",
  sequel: "Sequel",
  spinoff: "Spinoff",
  reimagining: "Reimagining",
  spiritual_successor: "Spiritual Successor",
  spiritual_predecessor: "Spiritual Predecessor",
  contains: "Contains",
  contained: "Contained In",
  remix: "Remix",
  expansion: "Expansion",
  twin_engine: "Twin Engine",
  twin_game: "Twin Game"
};

const TYPES = {
  game: "Game",
  game_collection: "Game Collection",
};

function enumLabel(map, key) {
  if (key == null) return "—";
  return map[key] ?? key;
}

// ---------------------------------------------------------------------------
// Data helpers
// ---------------------------------------------------------------------------

let allGames = [];
let allHardware = [];
let allAmiibo = [];

function getGameId(game) {
  return game.id;
}

function getGameName(id) {
  const game = allGames.find((g) => getGameId(g) === id);
  return game?.name ?? id;
}

function getCover(game) {
  return game.cover ?? null;
}

function getPlayerAge(game) {
  return game.player_age ?? null;
}

function coverUrl(name) {
  if (!name) return null;
  if (name.startsWith("http")) return name;
  return `./images/${name}.png`;
}

function findHardwareByPlatform(platform) {
  if (!platform) return null;
  return allHardware.find((h) => h.id === platform)
    ?? allHardware.find((h) => h.name === platform)
    ?? allHardware.find((h) => platform.endsWith(h.name))
    ?? null;
}

function findFamilyHardware(platform) {
  const hw = findHardwareByPlatform(platform);
  if (!hw) return [];
  // Find hardware entries whose family points to this platform
  const children = allHardware.filter((h) => h.hardware?.family === hw.id);
  return children;
}

const PRIORITY = {
  5: { label: "Critical", color: "priority-critical" },
  4: { label: "High", color: "priority-high" },
  3: { label: "Medium", color: "priority-medium" },
  2: { label: "Low", color: "priority-low" },
  1: { label: "Backlog", color: "priority-backlog" },
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

function buildPage(game) {
  const cover = getCover(game);

  const classif = game.classification;
  const plan = game.planning;

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

  // Ownership status
  const owns = game.ownership ?? [];
  const contained = (game.relationships ?? []).filter(entry => entry?.type === 'contained');
  const isWishlisted = owns.some((o) => o.wishlist);
  const formats = new Set(owns.filter((o) => !o.wishlist).map((o) => o.format).filter(Boolean));
  const ownershipClass = isWishlisted ? "ownership-icon wishlist-icon" : "ownership-icon owned-icon";
  const iconEntries = [
    isWishlisted ? { emoji: "🤍", tip: "Wishlisted" } : null,
    formats.has("physical") ? { emoji: "💿", tip: "Physical" } : null,
    formats.has("digital") ? { emoji: "☁️", tip: "Digital" } : null,
    formats.has("reproduction") ? { emoji: "🃏", tip: "Reproduction cart" } : null,
    formats.has("injection") ? { emoji: "🧩", tip: "Injected in a Mini console" } : null,
    contained.length ? { emoji: "📦", tip: "Contained in a collection or bundle" } : null,
  ].filter(Boolean);

  // Franchise line: universe · series · subseries
  const franchiseParts = [
    game.franchise?.universe,
    game.franchise?.series,
    game.franchise?.subseries,
  ].filter(Boolean);
  const franchiseLine = franchiseParts.length ? franchiseParts.join(" · ") : null;

  // Companies line: publisher · developer
  const companies = game.companies;
  const companyParts = [
    ...(companies?.publisher ?? []),
    ...(companies?.developer ?? []),
  ].filter(Boolean);
  const companiesLine = companyParts.length ? [...new Set(companyParts)].join(" · ") : null;

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
    plan?.priority != null || game.progress
      ? el("div", { class: "hero-badges" }, [
        priorityBadge(plan?.priority),
        el("span", { class: "status-badge" }, statusLabel(game.progress)),
      ])
      : null,
    plan?.reason ? el("p", { class: "hero-detail hero-reason" }, plan.reason) : null,
    plan?.rating != null ? el("p", { class: "hero-detail" }, `Rating ${stars(plan.rating)}`) : null,
    plan?.difficulty != null ? el("p", { class: "hero-detail" }, `Difficulty: ${skulls(plan.difficulty)}`) : null,
    plan?.estimated_hours != null ? el("p", { class: "hero-detail" }, `Time to beat: ~${formatHours(plan.estimated_hours)}`) : null,
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

  // Platforms — show family members instead of the platform itself when available
  const seenPlatformIds = new Set();
  const ownershipCards = [];

  owns.forEach((o) => {
    const hw = findHardwareByPlatform(o.platform);
    if (!hw) return;

    const familyMembers = findFamilyHardware(o.platform);
    const isDigital = o.format === "digital";

    if (familyMembers.length) {
      // Family members exist — show them instead of the platform itself
      let toShow = familyMembers;
      if (isDigital) {
        const mainMember = familyMembers.find((h) => h.main === true);
        if (mainMember) toShow = [mainMember];
      }
      toShow.forEach((fhw) => {
        if (seenPlatformIds.has(fhw.id)) return;
        seenPlatformIds.add(fhw.id);

        const fCover = coverUrl(fhw.cover);
        const fCard = el("div", { class: "variant-card" }, [
          fCover ? el("img", { src: fCover, alt: fhw.name, class: "variant-cover" }) : null,
          el("p", { class: "variant-label" }, fhw.name),
        ]);
        ownershipCards.push(el("a", { href: `hardware-detail.html?id=${encodeURIComponent(fhw.id)}`, class: "hw-card-link" }, fCard));
      });
    } else {
      // No family members — show the platform itself
      if (seenPlatformIds.has(hw.id)) return;
      seenPlatformIds.add(hw.id);

      const hwCover = coverUrl(hw.cover);
      const card = el("div", { class: "variant-card" }, [
        hwCover ? el("img", { src: hwCover, alt: hw.name, class: "variant-cover" }) : null,
        el("p", { class: "variant-label" }, hw.name),
      ]);
      ownershipCards.push(el("a", { href: `hardware-detail.html?id=${encodeURIComponent(hw.id)}`, class: "hw-card-link" }, card));
    }
  });
  const ownershipSection = ownershipCards.length
    ? section(
      "Platforms",
      el("div", { class: "variant-gallery" }, ownershipCards)
    )
    : null;

  // Contains (bundles/collections)
  const containsIds = game.contains ?? [];
  const containsCards = containsIds.map((id) => {
    const contained = allGames.find((g) => getGameId(g) === id);
    const cName = contained?.name ?? id;
    const cCover = contained?.cover ?? null;

    const card = el("div", { class: "variant-card" }, [
      cCover
        ? el("img", { src: cCover, alt: cName, class: "variant-cover" })
        : null,
      el("p", { class: "variant-label" }, cName),
    ]);

    return el("a", { href: `detail.html?id=${encodeURIComponent(id)}`, class: "hw-card-link" }, card);
  });
  const containsSection = containsCards.length
    ? section(
      "Contains",
      el("div", { class: "variant-gallery" }, containsCards)
    )
    : null;

  // Versions (was Availability)
  const gameId = getGameId(game);
  const avail = (game.versions ?? []).filter((a) => a.source !== gameId);
  const versionCards = avail.map((a) => {
    const sourceId = a.source;
    const sourceGame = allGames.find((g) => getGameId(g) === sourceId);
    const sourceName = sourceGame?.name ?? sourceId;
    const sourceCover = sourceGame?.cover ?? null;

    const card = el("div", { class: "variant-card" }, [
      sourceCover
        ? el("img", { src: sourceCover, alt: sourceName, class: "variant-cover" })
        : null,
      el("p", { class: "variant-label" }, sourceName),
      el("p", { class: "variant-event" }, enumLabel(VERSIONS_FORMAT, a.format)),
    ]);

    return el("a", { href: `detail.html?id=${encodeURIComponent(sourceId)}`, class: "hw-card-link" }, card);
  });
  const versionsSection = versionCards.length
    ? section(
      "Versions",
      el("div", { class: "variant-gallery" }, versionCards)
    )
    : null;

  // Relationships
  const rels = game.relationships ?? [];
  const relationshipCards = rels.map((r) => {
    const sourceId = r.source;
    const sourceGame = allGames.find((g) => getGameId(g) === sourceId);
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
  });
  const relationshipsSection = relationshipCards.length
    ? section(
      "Relationships",
      el("div", { class: "variant-gallery" }, relationshipCards)
    )
    : null;

  const tagsSection = classif?.tags?.length
    ? section("Tags", chips(classif.tags))
    : null;

  // Compatible Amiibo
  const compatibleAmiibo = allAmiibo.filter((a) =>
    (a.functionality ?? []).some((f) => f.game === game.id)
  );
  const amiiboSection = compatibleAmiibo.length
    ? section(
      "Compatible Amiibo",
      el("div", { class: "variant-gallery" },
        compatibleAmiibo
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((a) => {
            const img = coverUrl(a.cover);
            const func = (a.functionality ?? []).find((f) => f.game === game.id);
            return el("a", { href: `amiibo-detail.html?id=${encodeURIComponent(a.id)}`, class: "hw-card-link" },
              el("div", { class: "variant-card" }, [
                img ? el("img", { src: img, alt: a.name, class: "variant-cover" }) : null,
                el("p", { class: "variant-label" }, a.name),
                func?.function ? el("p", { class: "variant-sublabel" }, func.function) : null,
              ])
            );
          })
      )
    )
    : null;

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
    ownershipSection,
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
    const [gamesRes, hwRes, amiiboRes] = await Promise.all([
      fetch(DATA_PATH),
      fetch(HARDWARE_PATH),
      fetch(AMIIBO_PATH),
    ]);
    const games = await gamesRes.json();
    allGames = games;
    allHardware = (await hwRes.json()).flat();
    allAmiibo = await amiiboRes.json();
    const game = games.find((g) => getGameId(g) === targetId);

    if (!game) {
      main.innerHTML = `<p class='error'>Game <code>${targetId}</code> not found.</p>`;
      main.classList.remove("loading");
      return;
    }

    document.title = `${game.name} — Game Details`;
    main.innerHTML = "";
    main.classList.remove("loading");
    buildPage(game).forEach((node) => main.appendChild(node));
  } catch (err) {
    main.innerHTML = `<p class='error'>Failed to load game data: ${err.message}</p>`;
    main.classList.remove("loading");
  }
});
