import { loadCatalog } from "./catalog.js";

let catalog = [];

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

function getDetailUrl(item) {
  const id = encodeURIComponent(item.id);
  switch (item.type) {
    case "game":
    case "collection":
    case "bundle":
      return `pages/game-detail.html?id=${id}`;
    case "hardware":
      return `pages/hardware-detail.html?id=${id}`;
    case "amiibo":
      return `pages/amiibo-detail.html?id=${id}`;
    case "system":
      return `pages/system-detail.html?id=${id}`;
    case "series":
      return `pages/series-detail.html?id=${id}`;
    case "company":
      return `pages/company-detail.html?id=${id}`;
    case "event":
      return `pages/event-detail.html?id=${id}`;
    case "person":
      return `pages/person-detail.html?id=${id}`;
    case "release_line":
      return `pages/release-line-detail.html?id=${id}`;
    default:
      return null;
  }
}

function getImageSubfolder(type) {
  switch (type) {
    case "amiibo": return "amiibo";
    case "company": return "company";
    case "game":
    case "collection":
    case "bundle": return "game";
    case "hardware": return "hardware";
    case "event": return "events";
    case "person": return "person";
    case "release_line": return "release-line";
    case "series": return "series";
    case "system": return "system";
    default: return "game";
  }
}

function getCoverSrc(item) {
  const cover = item.cover ?? item.logo ?? item.portrait;
  if (!cover) return null;
  if (cover.startsWith("http")) return cover;
  return `./assets/images/${getImageSubfolder(item.type)}/${cover}.png`;
}

function isOwnedPhysicalGame(entry) {
  return Array.isArray(entry.access) && entry.access.some((access) =>
    access.status === "owned" && access.format === "physical"
  );
}

function getHardwareOwnership(entry) {
  if (Array.isArray(entry.ownership)) return entry.ownership;
  if (Array.isArray(entry.variants)) return entry.variants;
  if (typeof entry.ownership === "string") return [{ status: entry.ownership }];
  return [];
}

function isOwnedHardware(entry) {
  return getHardwareOwnership(entry).some((ownership) => ownership.status === "owned");
}

function isConsoleHardware(entry) {
  return (entry.hardware?.category ?? entry.category) === "console";
}

function isPlayableHardware(entry) {
  return ["console", "computer"].includes(entry.hardware?.category ?? entry.category);
}

function isOwnedAmiibo(entry) {
  const ownership = entry.ownership;
  if (Array.isArray(ownership)) return ownership.some((item) => item.status === "owned");
  return ownership === "owned";
}

function randomItems(items, count) {
  return [...items]
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}

function collectionStats() {
  const ownedPhysicalGames = catalog.filter((entry) => entry.type === "game" && isOwnedPhysicalGame(entry));
  const ownedConsoles = catalog.filter((entry) =>
    entry.type === "hardware" && isConsoleHardware(entry) && isOwnedHardware(entry)
  );
  const ownedAmiibo = catalog.filter((entry) => entry.type === "amiibo" && isOwnedAmiibo(entry));

  return { ownedPhysicalGames, ownedConsoles, ownedAmiibo };
}

function buildHero(stats) {
  return el("section", { class: "curator-hero" }, [
    el("div", { class: "intro-panel" }, [
      el("span", { class: "kicker" }, "Curated collection database"),
      el("h1", {}, "Gaming Shelf"),
      el("p", {}, "A personal archive of games, hardware, amiibo, and the worlds that connect them. Built as a shelf first: owned pieces, wishlisted gaps, and collection context all in one place."),
      el("div", { class: "button-row" }, [
        el("a", { class: "button", href: "./pages/games.html" }, "Browse Games"),
        el("a", { class: "button secondary", href: "./pages/wishlist.html" }, "View Wishlist"),
      ]),
    ]),
    el("aside", { class: "stats-panel", "aria-label": "Collection statistics" }, [
      el("a", { class: "stat", href: "./pages/games.html" }, [
        el("strong", {}, String(stats.ownedPhysicalGames.length)),
        el("span", {}, "Physical games owned"),
      ]),
      el("a", { class: "stat", href: "./pages/hardware.html" }, [
        el("strong", {}, String(stats.ownedConsoles.length)),
        el("span", {}, "Consoles owned"),
      ]),
      el("a", { class: "stat", href: "./pages/amiibo.html" }, [
        el("strong", {}, String(stats.ownedAmiibo.length)),
        el("span", {}, "Amiibo owned"),
      ]),
    ]),
  ]);
}

function itemCard(item) {
  const url = getDetailUrl(item);
  const cover = getCoverSrc(item);
  const tag = url ? "a" : "div";
  const attrs = url ? { class: "case", href: url } : { class: "case" };

  return el(tag, attrs, [
    cover
      ? el("img", { src: cover, alt: item.name ?? item.id, loading: "lazy" })
      : el("div", { class: "case-placeholder" }, item.name ?? item.id),
    el("strong", { class: "case-title" }, item.name ?? item.id),
    el("span", { class: "case-meta" }, item.type),
  ]);
}

function shelfSection(title, subtitle, items) {
  return el("section", { class: "shelf-block" }, [
    el("div", { class: "section-title" }, [
      el("h2", {}, title),
      el("span", {}, subtitle),
    ]),
    el("div", { class: "shelf" },
      items.length
        ? items.map(itemCard)
        : el("p", { class: "empty-state" }, `No ${title.toLowerCase()} found.`)
    ),
  ]);
}

function field(label, value) {
  if (value == null || value === "") return null;
  return el("div", { class: "field" }, [
    el("span", {}, label),
    String(value),
  ]);
}

function buildDetailCard(item) {
  if (!item) return null;

  const cover = getCoverSrc(item);
  const releaseYear = item.release?.slice(0, 4);
  const typeLabel = {
    amiibo: "Amiibo detail",
    game: "Game detail",
    hardware: "Hardware detail",
  }[item.type] ?? "Collection detail";
  const details = item.type === "hardware"
    ? [
      field("Release", releaseYear),
      field("Category", item.hardware?.category ?? item.category),
      field("Form", item.hardware?.form ?? item.form),
      field("Era", item.hardware?.era ?? item.era),
      field("Priority", item.acquisition?.priority ? `${item.acquisition.priority}/5` : null),
    ]
    : item.type === "amiibo"
      ? [
        field("Release", releaseYear),
        field("Series", item.franchise?.series),
        field("Wave", item.amiibo?.wave),
        field("Number", item.amiibo?.number != null ? `#${item.amiibo.number}` : null),
      ]
      : [
        field("Release", releaseYear),
        field("System", item.system),
        field("Series", item.franchise?.series),
        field("Progress", item.progress),
        field("Priority", item.backlog?.priority ? `${item.backlog.priority}/5` : null),
      ];

  return el("article", { class: "detail-card" }, [
    cover
      ? el("img", { src: cover, alt: item.name, loading: "lazy" })
      : el("div", { class: "detail-placeholder" }, item.name),
    el("div", {}, [
      el("span", { class: "kicker" }, typeLabel),
      el("h2", {}, item.name),
      item.description ? el("p", {}, item.description) : null,
      el("div", { class: "field-grid" }, details),
      el("a", { class: "button", href: getDetailUrl(item) }, "Open Detail"),
    ]),
  ]);
}

function logoTile(item) {
  const url = getDetailUrl(item);
  const logo = getCoverSrc(item);
  return el("a", { class: "logo-tile", href: url }, [
    logo
      ? el("img", {
        src: logo,
        alt: item.name,
        loading: "lazy",
        onerror: (event) => {
          event.currentTarget.replaceWith(el("span", {}, item.name));
        },
      })
      : el("span", {}, item.name),
  ]);
}

function taxonomyGroup(title, items) {
  return el("section", { class: "taxonomy-group" }, [
    el("h3", {}, title),
    el("div", { class: "logo-row" },
      items.length
        ? items.map(logoTile)
        : el("p", { class: "empty-state compact" }, `No ${title.toLowerCase()} found.`)
    ),
  ]);
}

function buildTaxonomyCard() {
  const visible = (entry) => entry.circle == null || entry.circle === "major" || entry.circle === "minor";
  const systems = randomItems(catalog.filter((entry) => entry.type === "system"), 3);
  const companies = randomItems(catalog.filter((entry) => entry.type === "company" && visible(entry)), 3);
  const series = randomItems(catalog.filter((entry) => entry.type === "series" && visible(entry)), 3);

  return el("article", { class: "taxonomy-card" }, [
    el("span", { class: "kicker" }, "Taxonomy browser"),
    el("h2", {}, "Worlds"),
    taxonomyGroup("Systems", systems),
    taxonomyGroup("Companies", companies),
    taxonomyGroup("Series", series),
  ]);
}

function buildFeatureGrid(featureItems) {
  return el("section", {}, [
    el("div", { class: "section-title" }, [
      el("h2", {}, "Featured from the archive"),
      el("span", {}, "Fresh picks on every visit"),
    ]),
    el("div", { class: "feature-grid" }, [
      buildDetailCard(randomItems(featureItems, 1)[0]),
      buildTaxonomyCard(),
    ]),
  ]);
}

function renderDashboard() {
  const main = document.getElementById("dashboard");
  const stats = collectionStats();
  const ownedHardware = catalog.filter((entry) => entry.type === "hardware" && isOwnedHardware(entry));
  const featureItems = [
    ...stats.ownedPhysicalGames,
    ...stats.ownedAmiibo,
    ...ownedHardware.filter(isPlayableHardware),
  ];

  main.innerHTML = "";
  main.appendChild(el("div", { class: "dashboard-view" }, [
    buildHero(stats),
    shelfSection("Games", "Random owned physical games", randomItems(stats.ownedPhysicalGames, 5)),
    shelfSection("Hardware", "Random owned hardware", randomItems(ownedHardware, 5)),
    shelfSection("Amiibo", "Random owned amiibo", randomItems(stats.ownedAmiibo, 5)),
    buildFeatureGrid(featureItems),
  ]));
}

document.addEventListener("DOMContentLoaded", async () => {
  const main = document.getElementById("dashboard");
  main.innerHTML = `<p class="index-status">Loading catalog...</p>`;

  try {
    catalog = await loadCatalog((loaded, total) => {
      main.innerHTML = `<p class="index-status">Indexing... ${loaded}/${total}</p>`;
    });
    renderDashboard();
  } catch (err) {
    main.innerHTML = `<p class="index-status">Failed to load: ${err.message}</p>`;
  }
});
