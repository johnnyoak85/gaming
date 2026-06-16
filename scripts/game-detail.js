import { loadCatalog } from "./catalog.js";

const DATA_PATH = "./assets/data/";
const IMAGE_ROOT = "./assets/images";

const MODES = {
  solo: "Solo",
  co_op: "Co-op",
  versus: "Versus",
  turn_based: "Turn-based",
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

const ACCESS_STATUS = {
  owned: "Owned",
  wishlist: "Wishlist",
  borrowed: "Borrowed",
  subscription: "Subscription",
  unavailable: "Unavailable",
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
  enhanced_version: "Enhanced Version",
};

const RELATIONSHIP_TYPES = {
  original: "Original",
  prequel: "Prequel",
  sequel: "Sequel",
  spinoff: "Spinoff",
  spiritual_successor: "Spiritual Successor",
  spiritual_predecessor: "Spiritual Predecessor",
  reimagining: "Reimagining",
  expansion: "Expansion",
  twin_engine: "Twin Engine",
  twin_game: "Twin Game",
  adaptation: "Adaptation",
  enhanced_compilation: "Enhanced Compilation",
};

const PRIORITY = {
  5: { label: "Critical", color: "priority-critical" },
  4: { label: "High", color: "priority-high" },
  3: { label: "Medium", color: "priority-medium" },
  2: { label: "Low", color: "priority-low" },
  1: { label: "Backlog", color: "priority-backlog" },
};

let catalogPromise = null;
const entryCache = {};

function enumLabel(map, key) {
  if (key == null) return null;
  return map[key] ?? key;
}

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value == null) continue;
    if (key === "class") node.className = value;
    else if (key.startsWith("on") && typeof value === "function") node.addEventListener(key.slice(2), value);
    else node.setAttribute(key, value);
  }
  for (const child of [children].flat()) {
    if (child == null) continue;
    node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return node;
}

function section(title, ...content) {
  const filtered = content.filter(Boolean);
  if (!filtered.length) return null;
  return el("section", { class: "detail-section curator-section" }, [
    el("h2", {}, title),
    ...filtered,
  ]);
}

function field(label, value) {
  if (value == null || value === "") return null;
  return el("div", { class: "field" }, [
    el("span", { class: "field-label" }, label),
    el("span", { class: "field-value" }, value),
  ]);
}

function chips(items) {
  const filtered = items.filter(Boolean);
  if (!filtered.length) return null;
  return el("div", { class: "chips" }, filtered.map((item) =>
    typeof item === "string" ? el("span", { class: "chip" }, item) : item
  ));
}

function repeatedIcon(n, icon, label) {
  if (n == null) return null;
  return el("span", { class: "metric-icons", title: `${label}: ${n}/5` },
    Array.from({ length: n }, () => el("span", { "aria-hidden": "true" }, icon))
  );
}

function stars(n) {
  return repeatedIcon(n, "⭐", "Rating");
}

function skulls(n) {
  return repeatedIcon(n, "💀", "Difficulty");
}

function imageFolder(type) {
  switch (type) {
    case "hardware": return "hardware";
    case "amiibo": return "amiibo";
    case "system": return "system";
    case "series": return "series";
    case "company": return "company";
    case "event": return "event";
    case "person": return "person";
    case "release_line": return "release-line";
    default: return "game";
  }
}

function imageUrl(entry) {
  const image = entry?.cover ?? entry?.logo ?? entry?.portrait;
  if (!image) return null;
  if (image.startsWith("http")) return image;
  return `${IMAGE_ROOT}/${imageFolder(entry.type)}/${image}.png`;
}

function detailUrl(entryOrType, id) {
  const type = typeof entryOrType === "string" ? entryOrType : entryOrType?.type;
  const entryId = encodeURIComponent(id ?? entryOrType?.id);
  switch (type) {
    case "hardware": return `pages/hardware-detail.html?id=${entryId}`;
    case "amiibo": return `pages/amiibo-detail.html?id=${entryId}`;
    case "system": return `pages/system-detail.html?id=${entryId}`;
    case "series": return `pages/series-detail.html?id=${entryId}`;
    case "company": return `pages/company-detail.html?id=${entryId}`;
    case "event": return `pages/event-detail.html?id=${entryId}`;
    case "person": return `pages/person-detail.html?id=${entryId}`;
    case "release_line": return `pages/release-line-detail.html?id=${entryId}`;
    default: return `pages/game-detail.html?id=${entryId}`;
  }
}

async function loadEntry(id) {
  if (!id) return null;
  if (entryCache[id]) return entryCache[id];
  try {
    const res = await fetch(`${DATA_PATH}${id}.json`);
    if (!res.ok) return null;
    entryCache[id] = await res.json();
    return entryCache[id];
  } catch {
    return null;
  }
}

async function loadCatalogOnce() {
  if (!catalogPromise) catalogPromise = loadCatalog();
  return catalogPromise;
}

async function findTaxonomyEntry(id, type) {
  if (!id) return null;
  const catalog = await loadCatalogOnce();
  const suffix = type === "company" ? "-company" : type === "series" ? "-series" : type === "system" ? "-system" : type === "event" ? "-event" : "";
  const slug = id.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const candidates = new Set([id, slug, suffix && `${slug}${suffix}`].filter(Boolean));

  return catalog.find((entry) =>
    entry.type === type &&
    (candidates.has(entry.id) || entry.name === id)
  ) ?? null;
}

function fallbackName(slug) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

async function taxonomyLogoCard(id, type, label) {
  if (!id) return null;
  const entry = await findTaxonomyEntry(id, type);
  const name = entry?.name ?? fallbackName(id);
  const logo = entry ? imageUrl(entry) : null;
  const targetId = entry?.id ?? id;
  const children = [
    el("span", { class: "taxonomy-label" }, label),
    logo
      ? el("img", {
        src: logo,
        alt: name,
        loading: "lazy",
        onerror: (event) => {
          event.currentTarget.replaceWith(el("strong", {}, name));
        },
      })
      : el("strong", {}, name),
  ];

  if (!entry && ["event", "person", "release_line"].includes(type)) {
    return el("div", { class: "taxonomy-logo-card" }, children);
  }
  return el("a", { class: "taxonomy-logo-card", href: detailUrl(type, targetId) }, children);
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr + "T00:00:00");
  if (isNaN(date)) return dateStr;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
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
  const passedAnniversary =
    later.getMonth() > earlier.getMonth() ||
    (later.getMonth() === earlier.getMonth() && later.getDate() >= earlier.getDate());
  if (!passedAnniversary) years--;

  if (years >= 1) {
    return past ? `${years} year${years === 1 ? "" : "s"} ago` : `in ${years} year${years === 1 ? "" : "s"}`;
  }

  let months =
    (later.getFullYear() - earlier.getFullYear()) * 12 +
    later.getMonth() -
    earlier.getMonth();
  if (later.getDate() < earlier.getDate()) months--;

  if (months >= 1) {
    return past ? `${months} month${months === 1 ? "" : "s"} ago` : `in ${months} month${months === 1 ? "" : "s"}`;
  }

  const days = Math.round(Math.abs(diffMs) / 86400000);
  if (days === 0) return "Today";
  return past ? `${days} day${days === 1 ? "" : "s"} ago` : `in ${days} day${days === 1 ? "" : "s"}`;
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
  return [
    formatDate(dateStr),
    timeDistance(dateStr),
  ].filter(Boolean).join(" · ") + (isAnniversary(dateStr) ? " 🎂" : "");
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

function priorityBadge(value) {
  if (value == null) return null;
  const entry = PRIORITY[value];
  if (!entry) return null;
  return el("span", { class: `priority-badge ${entry.color}`, title: `Backlog priority: ${entry.label} (${value}/5)` }, entry.label);
}

function heroAccessBadges(access) {
  const formats = new Set(access.map((item) => item.format).filter(Boolean));
  const icons = [
    formats.has("physical") ? { icon: "🏷️", label: "Physical" } : null,
    formats.has("digital") ? { icon: "☁️", label: "Digital" } : null,
    formats.has("injected") ? { icon: "🧩", label: "Injected" } : null,
    formats.has("reproduction") ? { icon: "🃏", label: "Reproduction" } : null,
    formats.has("contained") ? { icon: "📦", label: "Contained" } : null,
    formats.has("built_in") ? { icon: "🕹️", label: "Built In" } : null,
  ].filter(Boolean);

  if (!icons.length) return null;
  return el("span", { class: "access-icon-tags", "aria-label": "Access formats" },
    icons.map((item) => el("span", { class: "icon-tip", title: item.label, "aria-label": item.label }, item.icon))
  );
}

function entryCard(entry, meta, fallbackId) {
  const name = entry?.name ?? fallbackName(fallbackId);
  const cover = entry ? imageUrl(entry) : null;
  const url = entry ? detailUrl(entry) : null;
  const card = el("div", { class: "variant-card shelf-card" }, [
    cover
      ? el("img", { src: cover, alt: name, class: "variant-cover", loading: "lazy" })
      : el("div", { class: "variant-cover placeholder" }, name),
    el("p", { class: "variant-label" }, name),
    meta ? el("p", { class: "variant-event" }, meta) : null,
  ]);
  return url ? el("a", { href: url, class: "hw-card-link" }, card) : card;
}

async function accessCard(access) {
  const source = await loadEntry(access.via ?? access.platform);
  const platform = access.platform ? await loadEntry(access.platform) : null;
  const meta = [
    enumLabel(ACCESS_FORMAT, access.format),
    enumLabel(ACCESS_STATUS, access.status),
    platform?.name && source?.id !== platform.id ? platform.name : null,
  ].filter(Boolean).join(" · ");

  return entryCard(source, meta, access.via ?? access.platform);
}

async function linkedEntryGallery(items, labelMap, title) {
  if (!items?.length) return null;
  const cards = await Promise.all(items.map(async (item) => {
    const sourceId = typeof item === "string" ? item : item.source;
    const entry = await loadEntry(sourceId);
    const meta = typeof item === "string" || !labelMap ? null : enumLabel(labelMap, item.format ?? item.type);
    return entryCard(entry, meta, sourceId);
  }));
  return section(title, el("div", { class: "variant-gallery shelf-gallery" }, cards.filter(Boolean)));
}

async function buildContextSection(game) {
  const companyIds = Array.isArray(game.companies)
    ? game.companies
    : [
      ...(game.companies?.developer ?? []),
      ...(game.companies?.publisher ?? []),
    ];
  const cards = await Promise.all([
    taxonomyLogoCard(game.system, "system", "System"),
    taxonomyLogoCard(game.release_line, "release_line", "Release Line"),
    taxonomyLogoCard(game.franchise?.series, "series", "Series"),
    taxonomyLogoCard(game.franchise?.subseries, "series", "Subseries"),
    taxonomyLogoCard(game.event, "event", "Event"),
    ...(game.people ?? []).map((personId) => taxonomyLogoCard(personId, "person", "Person")),
    ...companyIds.map((companyId) => taxonomyLogoCard(companyId, "company", "Company")),
  ]);

  return section(
    "Shelf Context",
    el("div", { class: "taxonomy-logo-grid" }, cards.filter(Boolean))
  );
}

function buildClassificationSection(game) {
  const classification = game.classification ?? {};
  return section(
    "Classification",
    chips([
      ...(classification.genres ?? []),
      ...(classification.subgenres ?? []),
      ...(classification.themes ?? []),
    ])
  );
}

function buildPlaySection(game) {
  const playstyle = game.playstyle ?? {};
  const players = playstyle.players
    ? `${playstyle.players.min}-${playstyle.players.max} players`
    : null;
  const modes = playstyle.modes?.map((mode) => enumLabel(MODES, mode)).filter(Boolean).join(" · ");

  return section(
    "Play Profile",
    el("div", { class: "info-grid" }, [
      field("Progress", statusLabel(game.progress)),
      field("Player age", game.player_age != null ? `${game.player_age}+` : null),
      field("Players", players),
      field("Modes", modes),
    ])
  );
}

function buildBacklogSection(game) {
  const backlog = game.backlog;
  if (!backlog) return null;
  return section(
    "Backlog",
    el("div", { class: "info-grid" }, [
      field("Priority", backlog.priority != null ? priorityBadge(backlog?.priority) : null),
      field("Rating", stars(backlog.rating)),
      field("Difficulty", skulls(backlog.difficulty)),
      field("Estimated time", backlog.estimated_hours != null ? `${backlog.estimated_hours}h` : null),
    ]),
    backlog.reason ? el("p", { class: "notes-text" }, backlog.reason) : null
  );
}

function buildAcquisitionSection(game) {
  const acquisition = game.acquisition;
  if (!acquisition?.priority && !acquisition?.reason && !acquisition?.notes) return null;
  return section(
    "Acquisition",
    el("div", { class: "info-grid" }, [
      field("Priority", acquisition.priority != null ? `${acquisition.priority}/5` : null),
      field("Reason", acquisition.reason),
      field("Notes", acquisition.notes),
    ])
  );
}

async function buildAccessSections(game) {
  const access = game.access ?? [];
  if (!access.length) return [];
  const owned = access.filter((item) => item.status !== "wishlist");
  const wishlist = access.filter((item) => item.status === "wishlist");
  const sections = [];

  if (owned.length) {
    const cards = await Promise.all(owned.map(accessCard));
    sections.push(section("Access", el("div", { class: "variant-gallery shelf-gallery" }, cards.filter(Boolean))));
  }

  if (wishlist.length) {
    const cards = await Promise.all(wishlist.map(accessCard));
    sections.push(section("Wishlist Access", el("div", { class: "variant-gallery shelf-gallery" }, cards.filter(Boolean))));
  }

  return sections.filter(Boolean);
}

function buildDetailsSection(game) {
  return section(
    "Notes",
    game.notes ? el("p", { class: "notes-text" }, game.notes) : null
  );
}

async function buildPage(game) {
  const cover = imageUrl(game);
  const access = game.access ?? [];
  const backlog = game.backlog;

  const hero = el("div", { class: "hero curator-hero-detail" }, [
    cover ? el("img", { src: cover, alt: `${game.name} cover`, class: "hero-cover" }) : null,
    el("div", { class: "hero-info" }, [
      el("span", { class: "kicker" }, game.type ?? "Game"),
      el("div", { class: "hero-title-row" }, [
        el("h1", {}, game.name),
        heroAccessBadges(access),
      ]),
      game.description ? el("p", { class: "hero-summary" }, game.description) : null,
      // el("div", { class: "hero-badges" }, [
      //   priorityBadge(backlog?.priority),
      //   el("span", { class: "status-badge", title: `Play status: ${statusLabel(game.progress)}` }, statusLabel(game.progress)),
      // ]),
      el("div", { class: "info-grid hero-facts" }, [
        field("Release", releaseLine(game.release)),
      ]),
    ]),
  ]);

  const accessSections = await buildAccessSections(game);

  return [
    hero,
    await buildContextSection(game),
    buildClassificationSection(game),
    buildPlaySection(game),
    buildBacklogSection(game),
    buildAcquisitionSection(game),
    ...accessSections,
    await linkedEntryGallery(game.contains ?? [], null, "Contains"),
    await linkedEntryGallery((game.versions ?? []).filter((item) => item.source !== game.id), VERSIONS_FORMAT, "Versions"),
    await linkedEntryGallery(game.relationships ?? [], RELATIONSHIP_TYPES, "Relationships"),
    buildDetailsSection(game),
  ].filter(Boolean);
}

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
    const game = await loadEntry(targetId);
    if (!game) {
      main.innerHTML = `<p class='error'>Game <code>${targetId}</code> not found.</p>`;
      main.classList.remove("loading");
      return;
    }

    document.title = `${game.name} - Game Details`;
    main.innerHTML = "";
    main.classList.remove("loading");
    const pageNodes = await buildPage(game);
    pageNodes.forEach((node) => main.appendChild(node));
  } catch (err) {
    main.innerHTML = `<p class='error'>Failed to load game data: ${err.message}</p>`;
    main.classList.remove("loading");
  }
});
