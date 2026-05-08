const DATA_PATH = "./data/amiibo.json";
const GAMES_PATH = "./data/games.json";
const IMAGE_BASE = "./images";

let allGames = [];
let allAmiibo = [];

function getGame(id) {
  return allGames.find((g) => g.id === id) ?? null;
}

function getGameName(id) {
  return getGame(id)?.name ?? id;
}

function getGameCover(id) {
  return getGame(id)?.cover ?? null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

function buildPage(amiibo) {
  const img = coverUrl(amiibo.cover);
  const isOwned = amiibo.owned !== false;

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

  const ownershipIcon = isOwned ? "✓" : "⭐";
  const ownershipClass = isOwned ? "ownership-icon owned-icon" : "ownership-icon wishlist-icon";

  // Title with optional number (italic, not bold)
  const titleChildren = [el("h1", {}, amiibo.name)];
  if (amiibo.franchise?.number != null) {
    titleChildren.push(el("span", { class: "amiibo-number" }, `#${amiibo.franchise.number}`));
  }
  titleChildren.push(el("span", { class: ownershipClass }, ownershipIcon));

  const hero = el("div", { class: "hero" }, [
    img
      ? el("img", { src: img, alt: amiibo.name, class: "hero-cover amiibo-cover" })
      : null,
    el("div", { class: "hero-info" }, [
      el("div", { class: "hero-title-row" }, titleChildren),
      el("div", { class: "hero-grid" }, [leftCol, rightCol]),
    ]),
  ]);

  // Wave section — other amiibo in the same wave+series
  const wave = amiibo.franchise?.wave;
  const series = amiibo.franchise?.series;
  const wavemates = wave != null && series
    ? allAmiibo.filter((a) =>
      a.id !== amiibo.id
      && a.franchise?.wave === wave
      && a.franchise?.series === series
    )
    : [];

  const waveSection = wavemates.length
    ? section(
      wave,
      el("div", { class: "variant-gallery" },
        wavemates
          .sort((a, b) => {
            const na = Number(a.franchise?.number) || 0;
            const nb = Number(b.franchise?.number) || 0;
            return na - nb || a.name.localeCompare(b.name);
          })
          .map((w) => {
            const wImg = coverUrl(w.cover);
            const wOwned = w.owned !== false;
            const wIcon = wOwned ? "✓" : "⭐";
            const wIconClass = wOwned ? "variant-icon owned-icon" : "variant-icon wishlist-icon";
            return el("a", { href: `amiibo-detail.html?id=${encodeURIComponent(w.id)}`, class: "hw-card-link" },
              el("div", { class: "variant-card" }, [
                el("span", { class: wIconClass }, wIcon),
                wImg
                  ? el("img", { src: wImg, alt: w.name, class: "variant-cover amiibo-cover" })
                  : null,
                el("p", { class: "variant-label" }, w.name),
                w.franchise?.number != null
                  ? el("p", { class: "variant-event" }, `#${w.franchise.number}`)
                  : null,
              ])
            );
          })
      )
    )
    : null;

  // Functionality — game column as cover+title card
  const funcs = amiibo.functionality ?? [];
  const funcSection = funcs.length
    ? section(
      "Functionality",
      el("div", { class: "func-list" },
        funcs.map((f) => {
          const gameId = f.game;
          const gameName = getGameName(gameId);
          const gameCover = getGameCover(gameId);

          const card = el("a", { href: `detail.html?id=${encodeURIComponent(gameId)}`, class: "func-row" }, [
            gameCover
              ? el("img", { src: gameCover, alt: gameName, class: "func-game-cover" })
              : null,
            el("div", { class: "func-info" }, [
              el("span", { class: "func-game-name" }, gameName),
              el("span", { class: "func-desc" }, f.function ?? "—"),
            ]),
          ]);

          return card;
        })
      )
    )
    : null;

  return [hero, waveSection, funcSection].filter(Boolean);
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
    const [amiiboRes, gamesRes] = await Promise.all([
      fetch(DATA_PATH),
      fetch(GAMES_PATH),
    ]);
    const items = await amiiboRes.json();
    allAmiibo = items;
    allGames = await gamesRes.json();
    const amiibo = items.find((a) => a.id === targetId);

    if (!amiibo) {
      main.innerHTML = `<p class='error'>Amiibo <code>${targetId}</code> not found.</p>`;
      main.classList.remove("loading");
      return;
    }

    document.title = `${amiibo.name} — Amiibo Details`;
    main.innerHTML = "";
    main.classList.remove("loading");
    buildPage(amiibo).forEach((node) => main.appendChild(node));
  } catch (err) {
    main.innerHTML = `<p class='error'>Failed to load amiibo data: ${err.message}</p>`;
    main.classList.remove("loading");
  }
});
