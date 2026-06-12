import { loadCatalog } from "./catalog.js";

const DATA_PATH = "./assets/data/";
const IMAGE_ROOT = "./assets/images";

let catalogPromise = null;
const entryCache = {};

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

function imageFolder(type) {
  switch (type) {
    case "amiibo": return "amiibo";
    case "company": return "company";
    case "event": return "events";
    case "hardware": return "hardware";
    case "person": return "person";
    case "release_line": return "release-line";
    case "series": return "series";
    case "system": return "system";
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

async function loadCatalogOnce() {
  if (!catalogPromise) catalogPromise = loadCatalog();
  return catalogPromise;
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

function fallbackName(slug) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
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

async function contextCard(id, type, label) {
  if (!id) return null;
  const entry = await findTaxonomyEntry(id, type);
  const name = entry?.name ?? fallbackName(id);
  const logo = entry ? imageUrl(entry) : null;
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
  return el("a", { class: "taxonomy-logo-card", href: detailUrl(type, entry?.id ?? id) }, children);
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
  const passedAnniv = later.getMonth() > earlier.getMonth() ||
    (later.getMonth() === earlier.getMonth() && later.getDate() >= earlier.getDate());
  if (!passedAnniv) years--;
  if (years >= 1) return past ? `${years} year${years === 1 ? "" : "s"} ago` : `in ${years} year${years === 1 ? "" : "s"}`;
  let months = (later.getFullYear() - earlier.getFullYear()) * 12 + later.getMonth() - earlier.getMonth();
  if (later.getDate() < earlier.getDate()) months--;
  if (months >= 1) return past ? `${months} month${months === 1 ? "" : "s"} ago` : `in ${months} month${months === 1 ? "" : "s"}`;
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
  return [formatDate(dateStr), timeDistance(dateStr)].filter(Boolean).join(" · ") + (isAnniversary(dateStr) ? " 🎂" : "");
}

function ownershipIcon(ownership) {
  if (ownership === "wishlist") return el("span", { class: "access-icon-tags" }, [
    el("span", { class: "icon-tip", title: "Wishlist", "aria-label": "Wishlist" }, "🤍"),
  ]);
  if (ownership === "owned") return el("span", { class: "access-icon-tags" }, [
    el("span", { class: "icon-tip", title: "Owned", "aria-label": "Owned" }, "🏷️"),
  ]);
  return null;
}

function entryCard(entry, meta, fallbackId) {
  const name = entry?.name ?? fallbackName(fallbackId);
  const cover = entry ? imageUrl(entry) : null;
  const href = entry ? detailUrl(entry) : null;
  const card = el("div", { class: "variant-card shelf-card" }, [
    cover
      ? el("img", { src: cover, alt: name, class: "variant-cover", loading: "lazy" })
      : el("div", { class: "variant-cover placeholder" }, name),
    el("p", { class: "variant-label" }, name),
    meta ? el("p", { class: "variant-event" }, meta) : null,
  ]);
  return href ? el("a", { href, class: "hw-card-link" }, card) : card;
}

async function buildShelfContext(amiibo) {
  const cards = await Promise.all([
    contextCard(amiibo.release_line, "release_line", "Release Line"),
    contextCard(amiibo.franchise?.series, "series", "Series"),
    contextCard(amiibo.franchise?.subseries, "series", "Subseries"),
    contextCard(amiibo.event, "event", "Event"),
    ...(amiibo.people ?? []).map((personId) => contextCard(personId, "person", "Person")),
  ]);

  return section("Shelf Context", el("div", { class: "taxonomy-logo-grid" }, cards.filter(Boolean)));
}

function buildHero(amiibo) {
  const cover = imageUrl(amiibo);
  const number = amiibo.amiibo?.number != null ? `#${amiibo.amiibo.number}` : null;

  return el("div", { class: "hero curator-hero-detail" }, [
    cover ? el("img", { src: cover, alt: amiibo.name, class: "hero-cover amiibo-cover" }) : null,
    el("div", { class: "hero-info" }, [
      el("span", { class: "kicker" }, amiibo.type ?? "Amiibo"),
      el("div", { class: "hero-title-row" }, [
        el("h1", {}, amiibo.name),
        ownershipIcon(amiibo.ownership),
      ]),
      el("div", { class: "info-grid hero-facts" }, [
        field("Release", releaseLine(amiibo.release)),
        field("Number", number),
        field("Wave", amiibo.amiibo?.wave),
        field("Ownership", amiibo.ownership ? amiibo.ownership[0].toUpperCase() + amiibo.ownership.slice(1) : null),
      ]),
    ]),
  ]);
}

async function buildFunctionalitySection(amiibo) {
  const functionality = amiibo.functionality ?? [];
  if (!functionality.length) return null;

  const rows = await Promise.all(functionality.map(async (item) => {
    const game = await loadEntry(item.game);
    return el("a", { href: `pages/game-detail.html?id=${encodeURIComponent(item.game)}`, class: "func-row shelf-func-row" }, [
      game && imageUrl(game)
        ? el("img", { src: imageUrl(game), alt: game.name, class: "func-game-cover", loading: "lazy" })
        : el("div", { class: "func-game-cover placeholder" }, ""),
      el("div", { class: "func-info" }, [
        el("span", { class: "func-game-name" }, game?.name ?? fallbackName(item.game)),
        el("span", { class: "func-desc" }, item.effect ?? "-"),
      ]),
    ]);
  }));

  return section("Functionality", el("div", { class: "func-list" }, rows));
}

async function buildWaveSection(amiibo) {
  const wave = amiibo.amiibo?.wave;
  if (!wave) return null;

  const catalog = await loadCatalogOnce();
  const waveMates = catalog
    .filter((entry) => entry.type === "amiibo" && entry.id !== amiibo.id && entry.amiibo?.wave === wave)
    .sort((a, b) => {
      const numA = Number(a.amiibo?.number ?? 9999);
      const numB = Number(b.amiibo?.number ?? 9999);
      if (numA !== numB) return numA - numB;
      return (a.release ?? "").localeCompare(b.release ?? "") || a.name.localeCompare(b.name);
    });

  if (!waveMates.length) return null;
  return section(wave, el("div", { class: "variant-gallery shelf-gallery" },
    waveMates.map((entry) => entryCard(entry, entry.amiibo?.number ? `#${entry.amiibo.number}` : null))
  ));
}

function buildNotesSection(amiibo) {
  return section(
    "Notes",
    amiibo.notes ? el("p", { class: "notes-text" }, amiibo.notes) : null
  );
}

async function buildPage(amiibo) {
  return [
    buildHero(amiibo),
    await buildShelfContext(amiibo),
    await buildFunctionalitySection(amiibo),
    await buildWaveSection(amiibo),
    buildNotesSection(amiibo),
  ].filter(Boolean);
}

document.addEventListener("DOMContentLoaded", async () => {
  const main = document.getElementById("detail");
  const params = new URLSearchParams(window.location.search);
  const targetId = params.get("id");

  if (!targetId) {
    main.innerHTML = "<p class='error'>No amiibo ID provided. Use <code>?id=amiibo-slug</code>.</p>";
    main.classList.remove("loading");
    return;
  }

  try {
    const amiibo = await loadEntry(targetId);
    if (!amiibo) {
      main.innerHTML = `<p class='error'>Amiibo <code>${targetId}</code> not found.</p>`;
      main.classList.remove("loading");
      return;
    }

    document.title = `${amiibo.name} - Amiibo Details`;
    main.innerHTML = "";
    main.classList.remove("loading");
    const pageNodes = await buildPage(amiibo);
    pageNodes.forEach((node) => main.appendChild(node));
  } catch (err) {
    main.innerHTML = `<p class='error'>Failed to load amiibo data: ${err.message}</p>`;
    main.classList.remove("loading");
  }
});
