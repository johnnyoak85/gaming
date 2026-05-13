import { loadCatalog, getAmiibo } from "./catalog.js";

const AMIIBO_SOLO_PATH = "./data/";
const GAMES_SOLO_PATH = "./data/";
const IMAGE_BASE = "./images";

let gameCache = {};
let amiiboIndex = null;

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

async function loadAmiiboIndex() {
  if (amiiboIndex) return amiiboIndex;
  const catalog = await loadCatalog();
  amiiboIndex = { entries: getAmiibo(catalog) };
  return amiiboIndex;
}

async function getGameName(id) {
  const game = await loadGame(id);
  return game?.name ?? id;
}

async function getGameCover(id) {
  const game = await loadGame(id);
  return game?.cover ?? null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const WISHLIST_LEVEL = {
  1: { emoji: "🤍", label: "Low" },
  2: { emoji: "🩷", label: "Medium" },
  3: { emoji: "💛", label: "High" },
  4: { emoji: "🧡", label: "Essential" },
  5: { emoji: "❤️", label: "Non-negotiable" },
};

function coverUrl(cover) {
  if (!cover) return null;
  if (cover.startsWith("http")) return cover;
  return `${IMAGE_BASE}/${cover}.png`;
}

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

function field(label, value) {
  if (value == null || value === "") return null;
  return el("div", { class: "field" }, [
    el("span", { class: "field-label" }, label),
    el("span", { class: "field-value" }, String(value)),
  ]);
}

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function ordinalSuffix(day) {
  if (day >= 11 && day <= 13) return "th";
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr + "T00:00:00");
  if (isNaN(date)) return dateStr;
  const day = date.getDate();
  return `${day}${ordinalSuffix(day)} of ${MONTHS[date.getMonth()]}, ${date.getFullYear()}`;
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

// ---------------------------------------------------------------------------
// Page builder
// ---------------------------------------------------------------------------

async function buildPage(amiibo) {
  const img = coverUrl(amiibo.cover);
  const isOwned = amiibo.ownership === 'owned';
  const isWishlist = amiibo.ownership === 'wishlist';
  const wishlistLevel = isWishlist ? (amiibo.acquisition?.priority ?? 1) : null;
  const wlInfo = wishlistLevel != null ? WISHLIST_LEVEL[wishlistLevel] : null;

  const ownershipIcon = wlInfo ? wlInfo.emoji : "🏷️";
  const ownershipTip = wlInfo ? `Wishlist: ${wlInfo.label}` : "Owned";
  const ownershipClass = isOwned ? "ownership-icon owned-icon" : "ownership-icon wishlist-icon";

  const leftCol = el("div", { class: "hero-col" }, [
    amiibo.release
      ? el("p", { class: "release-date" }, releaseLine(amiibo.release))
      : null,
    amiibo.franchise?.series
      ? el("p", { class: "hero-detail" }, [
        amiibo.franchise.series,
        amiibo.franchise.subseries ? ` · ${amiibo.franchise.subseries}` : "",
      ])
      : null,
    amiibo.event
      ? el("p", { class: "hero-detail hero-event" }, `Part of ${amiibo.event}`)
      : null,
    amiibo.notes
      ? el("p", { class: "hero-detail hero-notes" }, amiibo.notes)
      : null,
  ]);

  const rightCol = el("div", { class: "hero-col" });

  // Title with optional number (italic, not bold)
  const titleChildren = [el("h1", {}, amiibo.name)];
  if (amiibo.amiibo?.number != null) {
    titleChildren.push(el("span", { class: "amiibo-number" }, `#${amiibo.amiibo.number}`));
  }
  titleChildren.push(el("span", { class: ownershipClass, title: ownershipTip }, ownershipIcon));

  const hero = el("div", { class: "hero" }, [
    img
      ? el("img", { src: img, alt: amiibo.name, class: "hero-cover amiibo-cover" })
      : null,
    el("div", { class: "hero-info" }, [
      el("div", { class: "hero-title-row" }, titleChildren),
      el("div", { class: "hero-grid" }, [leftCol, rightCol]),
    ]),
  ]);

  // Note: Wave section requires all amiibo entries to be loaded
  // For now, this is deferred until a full amiibo index is available

  // Functionality — game column as cover+title card  
  let funcSection = null;
  const funcs = amiibo.functionality ?? [];
  if (funcs.length > 0) {
    const funcCards = await Promise.all(
      funcs.map(async (f) => {
        const gameId = f.game;
        const gameName = await getGameName(gameId);
        const gameCover = await getGameCover(gameId);

        return el("a", { href: `detail.html?id=${encodeURIComponent(gameId)}`, class: "func-row" }, [
          gameCover
            ? el("img", { src: gameCover, alt: gameName, class: "func-game-cover" })
            : null,
          el("div", { class: "func-info" }, [
            el("span", { class: "func-game-name" }, gameName),
            el("span", { class: "func-desc" }, f.effect ?? "—"),
          ]),
        ]);
      })
    );
    funcSection = section("Functionality", el("div", { class: "func-list" }, funcCards));
  }

  // Wave section - other amiibo in the same wave
  let waveSection = null;
  const wave = amiibo.amiibo?.wave;
  if (wave) {
    const amiiboIndexData = await loadAmiiboIndex();
    if (amiiboIndexData?.entries) {
      const waveMates = amiiboIndexData.entries.filter((other) =>
        other.id !== amiibo.id &&
        other.amiibo?.wave === wave
      );
      if (waveMates.length > 0) {
        waveSection = section(
          `${wave}`,
          el("div", { class: "variant-gallery" },
            waveMates
              .sort((a, b) => (a.amiibo?.number ?? 999) - (b.amiibo?.number ?? 999))
              .map((am) => {
                const img = coverUrl(am.cover);
                const numStr = am.amiibo?.number ? `#${am.amiibo.number}` : "";
                return el("a", { href: `amiibo-detail.html?id=${encodeURIComponent(am.id)}`, class: "hw-card-link" },
                  el("div", { class: "variant-card" }, [
                    img
                      ? el("img", { src: img, alt: am.name, class: "variant-cover" })
                      : null,
                    el("p", { class: "variant-label" }, am.name),
                    numStr ? el("p", { class: "variant-event" }, numStr) : null,
                  ])
                );
              })
          )
        );
      }
    }
  }

  return [hero, funcSection, waveSection].filter(Boolean);
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

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
    // Load single amiibo entry instead of entire array
    const amiiboRes = await fetch(`${AMIIBO_SOLO_PATH}${targetId}.json`);
    if (!amiiboRes.ok) {
      main.innerHTML = `<p class='error'>Amiibo <code>${targetId}</code> not found.</p>`;
      main.classList.remove("loading");
      return;
    }

    const amiibo = await amiiboRes.json();

    document.title = `${amiibo.name} — Amiibo Details`;
    main.innerHTML = "";
    main.classList.remove("loading");
    const pageNodes = await buildPage(amiibo);
    pageNodes.forEach((node) => main.appendChild(node));
  } catch (err) {
    main.innerHTML = `<p class='error'>Failed to load amiibo data: ${err.message}</p>`;
    main.classList.remove("loading");
  }
});
