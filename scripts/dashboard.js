import { loadCatalog } from "./catalog.js";

let catalog = [];

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  for (const child of [children].flat()) {
    if (!child) continue;
    node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return node;
}

function render(content) {
  const main = document.getElementById("dashboard");
  main.innerHTML = "";
  main.appendChild(content);
}

function getDetailUrl(item) {
  const id = encodeURIComponent(item.id);
  switch (item.type) {
    case "game": return `detail.html?id=${id}`;
    case "hardware": return `hardware-detail.html?id=${id}`;
    case "amiibo": return `amiibo-detail.html?id=${id}`;
    case "system": return `system-detail.html?id=${id}`;
    case "series": return `series-detail.html?id=${id}`;
    case "company": return `developer-detail.html?id=${id}`;
    default: return null;
  }
}

function getImageSubfolder(type) {
  switch (type) {
    case "game": return "game";
    case "hardware": return "hardware";
    case "amiibo": return "amiibo";
    case "series": return "series";
    case "system": return "system";
    case "company": return "company";
    default: return "game";
  }
}

function getCoverSrc(item) {
  if (!item.cover) return null;
  if (item.cover.startsWith("http")) return item.cover;
  const folder = getImageSubfolder(item.type);
  return `./assets/images/${folder}/${item.cover}.png`;
}

function cardGrid(cards, backFn) {
  const container = el("div", { class: "dashboard-view" });
  if (backFn) {
    const backBtn = el("button", { class: "back-btn", onclick: backFn }, "← Back");
    container.appendChild(backBtn);
  }
  const grid = el("div", { class: "dashboard-grid" });
  for (const card of cards) {
    const cls = "dashboard-card" + (card.disabled ? " disabled" : "");
    const cardEl = el("div", { class: cls, onclick: card.disabled ? null : card.action }, [
      el("span", { class: "dashboard-card-label" }, card.label),
    ]);
    grid.appendChild(cardEl);
  }
  container.appendChild(grid);
  return container;
}

function entryList(items, backFn, title) {
  const container = el("div", { class: "dashboard-view" });
  if (backFn) {
    const backBtn = el("button", { class: "back-btn", onclick: backFn }, "← Back");
    container.appendChild(backBtn);
  }
  if (title) container.appendChild(el("h2", { class: "list-title" }, title));
  const list = el("div", { class: "entry-list" });
  for (const item of items) {
    const coverSrc = getCoverSrc(item);
    const url = getDetailUrl(item);
    const cardInner = [
      coverSrc
        ? el("img", { class: "entry-cover", src: coverSrc, alt: item.name, loading: "lazy" })
        : el("div", { class: "entry-cover placeholder" }),
      el("span", { class: "entry-name" }, item.name),
    ];
    const card = url
      ? el("a", { class: "entry-card", href: url }, cardInner)
      : el("div", { class: "entry-card" }, cardInner);
    list.appendChild(card);
  }
  if (!items.length) list.appendChild(el("p", { class: "empty-state" }, "No entries found."));
  container.appendChild(list);
  return container;
}

function logoList(items, onClickItem, backFn, title) {
  const container = el("div", { class: "dashboard-view" });
  if (backFn) {
    const backBtn = el("button", { class: "back-btn", onclick: backFn }, "← Back");
    container.appendChild(backBtn);
  }
  if (title) container.appendChild(el("h2", { class: "list-title" }, title));
  const grid = el("div", { class: "logo-grid" });
  for (const item of items) {
    const card = el("div", { class: "logo-card", onclick: () => onClickItem(item) }, [
      item.logo
        ? el("img", { class: "logo-img", src: `./assets/images/${getImageSubfolder(item.type)}/${item.logo}.png`, alt: item.name })
        : el("div", { class: "logo-img placeholder" }, item.name),
    ]);
    grid.appendChild(card);
  }
  if (!items.length) grid.appendChild(el("p", { class: "empty-state" }, "No entries found."));
  container.appendChild(grid);
  return container;
}

function tabbedEntryList(tabs, backFn, title) {
  const visibleTabs = tabs.filter((tab) => {
    if (tab.subtabs) return tab.subtabs.some((st) => tab.itemsFn(st).length > 0);
    return tab.items().length > 0;
  });
  if (!visibleTabs.length) {
    const container = el("div", { class: "dashboard-view" });
    if (backFn) container.appendChild(el("button", { class: "back-btn", onclick: backFn }, "← Back"));
    if (title) container.appendChild(el("h2", { class: "list-title" }, title));
    container.appendChild(el("p", { class: "empty-state" }, "No entries found."));
    return container;
  }

  const container = el("div", { class: "dashboard-view" });
  if (backFn) {
    const backBtn = el("button", { class: "back-btn", onclick: backFn }, "← Back");
    container.appendChild(backBtn);
  }
  if (title) container.appendChild(el("h2", { class: "list-title" }, title));

  const tabBar = el("div", { class: "tab-bar" });
  const subTabBar = el("div", { class: "tab-bar sub-tab-bar" });
  const content = el("div", { class: "tab-content" });

  function renderList(items) {
    content.innerHTML = "";
    const list = el("div", { class: "entry-list" });
    for (const item of items) {
      const coverSrc = getCoverSrc(item);
      const url = getDetailUrl(item);
      const cardInner = [
        coverSrc
          ? el("img", { class: "entry-cover", src: coverSrc, alt: item.name, loading: "lazy" })
          : el("div", { class: "entry-cover placeholder" }),
        el("span", { class: "entry-name" }, item.name),
      ];
      const card = url
        ? el("a", { class: "entry-card", href: url }, cardInner)
        : el("div", { class: "entry-card" }, cardInner);
      list.appendChild(card);
    }
    content.appendChild(list);
  }

  function showTab(idx) {
    tabBar.querySelectorAll(".tab-btn").forEach((b, i) => b.classList.toggle("active", i === idx));
    const tab = visibleTabs[idx];

    if (tab.subtabs) {
      subTabBar.innerHTML = "";
      subTabBar.style.display = "";
      tab.subtabs.forEach((st, si) => {
        const btn = el("button", {
          class: "tab-btn sub" + (si === 0 ? " active" : ""),
          onclick: () => {
            subTabBar.querySelectorAll(".tab-btn").forEach((b, i) => b.classList.toggle("active", i === si));
            renderList(tab.itemsFn(st));
          },
        }, st.charAt(0).toUpperCase() + st.slice(1));
        subTabBar.appendChild(btn);
      });
      renderList(tab.itemsFn(tab.subtabs[0]));
    } else {
      subTabBar.innerHTML = "";
      subTabBar.style.display = "none";
      renderList(tab.items());
    }
  }

  visibleTabs.forEach((tab, idx) => {
    const btn = el("button", { class: "tab-btn" + (idx === 0 ? " active" : ""), onclick: () => showTab(idx) }, tab.label);
    tabBar.appendChild(btn);
  });

  container.appendChild(tabBar);
  container.appendChild(subTabBar);
  container.appendChild(content);
  showTab(0);
  return container;
}

// --- Data helpers ---

const CATEGORY_ORDER = { computer: 0, console: 0, controller: 1, accessory: 2, peripheral: 3, adapter: 4, storage: 5, cable: 6 };

function sortByRelease(items) {
  return [...items].sort((a, b) => (a.release ?? "").localeCompare(b.release ?? ""));
}

function sortHardware(items) {
  return [...items].sort((a, b) => {
    const relCmp = (a.release ?? "").localeCompare(b.release ?? "");
    if (relCmp !== 0) return relCmp;
    const catA = CATEGORY_ORDER[a.hardware?.category] ?? 99;
    const catB = CATEGORY_ORDER[b.hardware?.category] ?? 99;
    return catA - catB;
  });
}

function sortGamesForWorlds(items) {
  return [...items].sort((a, b) => {
    const relCmp = (a.release ?? "").localeCompare(b.release ?? "");
    if (relCmp !== 0) return relCmp;
    const access = a.access ?? [];
    const accessB = b.access ?? [];
    const aContained = access.some((x) => x.format === "contained") ? 1 : 0;
    const bContained = accessB.some((x) => x.format === "contained") ? 1 : 0;
    return aContained - bContained;
  });
}

function dedupe(items) {
  const seen = new Set();
  return items.filter((e) => {
    if (seen.has(e.id)) return false;
    seen.add(e.id);
    return true;
  });
}

function isOwnedGame(entry) {
  const access = entry.access;
  if (!Array.isArray(access)) return false;
  return access.some((a) => a.format === "physical" && a.status === "owned");
}

function isOwnedHardware(entry) {
  const ownership = entry.ownership;
  if (!ownership) return false;
  if (Array.isArray(ownership)) return ownership.some((o) => o.status === "owned");
  return ownership === "owned";
}

function isOwnedAmiibo(entry) {
  const ownership = entry.ownership;
  if (!ownership) return false;
  if (Array.isArray(ownership)) return ownership.some((o) => o.status === "owned");
  return ownership === "owned";
}

function isWishlistGame(entry, format) {
  const access = entry.access;
  if (!Array.isArray(access)) return false;
  return access.some((a) => a.status === "wishlist" && a.format === format);
}

function isWishlist(entry) {
  const t = entry.type;
  if (t === "game") {
    const access = entry.access;
    if (!Array.isArray(access)) return false;
    return access.some((a) => a.status === "wishlist" && (a.format === "physical" || a.format === "digital"));
  }
  if (t === "hardware") {
    const ownership = entry.ownership;
    if (!ownership) return false;
    if (Array.isArray(ownership)) return ownership.some((o) => o.status === "wishlist");
    return ownership === "wishlist";
  }
  if (t === "amiibo") {
    const ownership = entry.ownership;
    if (!ownership) return false;
    if (Array.isArray(ownership)) return ownership.some((o) => o.status === "wishlist");
    return ownership === "wishlist";
  }
  return false;
}

function getOwnedGames() {
  return sortByRelease(catalog.filter((e) => e.type === "game" && isOwnedGame(e)));
}

function getOwnedHardware() {
  const items = dedupe(catalog.filter((e) => e.type === "hardware" && isOwnedHardware(e)));
  return sortHardware(items);
}

function getOwnedAmiibo() {
  return sortByRelease(catalog.filter((e) => e.type === "amiibo" && isOwnedAmiibo(e)));
}

function getWishlistGames(format) {
  return sortByRelease(catalog.filter((e) => e.type === "game" && isWishlistGame(e, format)));
}

function getWishlistHardware() {
  const items = dedupe(catalog.filter((e) => e.type === "hardware" && isWishlist(e)));
  return sortHardware(items);
}

function getWishlistAmiibo() {
  return sortByRelease(catalog.filter((e) => e.type === "amiibo" && isWishlist(e)));
}

function getByType(type) {
  return sortByRelease(catalog.filter((e) => e.type === type));
}

function filterByCompany(type, companyId) {
  const items = catalog.filter((e) => {
    if (e.type !== type) return false;
    const companies = e.companies;
    if (Array.isArray(companies)) return companies.includes(companyId);
    return false;
  });
  if (type === "hardware") return sortHardware(dedupe(items));
  if (type === "game") return sortGamesForWorlds(items);
  return sortByRelease(items);
}

function filterBySystem(type, systemId) {
  const items = catalog.filter((e) => e.type === type && e.system === systemId);
  if (type === "hardware") return sortHardware(dedupe(items));
  if (type === "game") return sortGamesForWorlds(items);
  return sortByRelease(items);
}

function filterBySeries(type, seriesName) {
  const items = catalog.filter((e) => {
    if (e.type !== type) return false;
    const franchise = e.franchise;
    if (!franchise) return false;
    return franchise.universe === seriesName || franchise.series === seriesName || franchise.subseries === seriesName;
  });
  if (type === "hardware") return sortHardware(dedupe(items));
  if (type === "game") return sortGamesForWorlds(items);
  return sortByRelease(items);
}

// --- Views ---

function showHome() {
  const container = el("div", { class: "dashboard-view" });

  const sections = [
    {
      title: "Library",
      cards: [
        { label: "Games", icon: "./assets/icons/games.png", action: () => showOwnedGames() },
        { label: "Hardware", icon: "./assets/icons/hardware.png", action: () => showOwnedHardware() },
        { label: "Amiibo", icon: "./assets/icons/amiibo.png", action: () => showOwnedAmiibo() },
        { label: "Wishlist", action: () => showWishlist() },
      ],
    },
    {
      title: "Worlds",
      cards: [
        { label: "Companies", icon: "./assets/icons/companies.png", action: () => showCompanies() },
        { label: "Systems", icon: "./assets/icons/systems.png", action: () => showSystems() },
        { label: "Series", icon: "./assets/icons/series.png", action: () => showSeriesList() },
      ],
    },
    {
      title: "Play",
      cards: [],
    },
  ];

  for (const section of sections) {
    const sectionEl = el("div", { class: "home-section" });
    sectionEl.appendChild(el("h2", { class: "home-section-title" }, section.title));
    const grid = el("div", { class: "home-section-cards" });
    if (section.cards.length) {
      for (const card of section.cards) {
        const children = [];
        if (card.icon) {
          children.push(el("img", { class: "home-card-icon", src: card.icon, alt: card.label }));
        }
        children.push(el("span", { class: "home-card-label" }, card.label));
        grid.appendChild(
          el("div", { class: "home-section-card", onclick: card.action }, children)
        );
      }
    } else {
      grid.appendChild(el("span", { class: "empty-state" }, "Coming soon"));
    }
    sectionEl.appendChild(grid);
    container.appendChild(sectionEl);
  }

  render(container);
}

function showOwnedGames() {
  render(entryList(getOwnedGames(), showHome, "Games"));
}

function showOwnedHardware() {
  render(entryList(getOwnedHardware(), showHome, "Hardware"));
}

function showOwnedAmiibo() {
  render(entryList(getOwnedAmiibo(), showHome, "Amiibo"));
}

function showWishlist() {
  render(tabbedEntryList([
    { label: "Games", subtabs: ["physical", "digital"], itemsFn: (format) => getWishlistGames(format) },
    { label: "Hardware", items: () => getWishlistHardware() },
    { label: "Amiibo", items: () => getWishlistAmiibo() },
  ], showHome, "Wishlist"));
}

function showCompanies() {
  const companies = getByType("company");
  render(logoList(companies, (c) => showCompanyDetail(c), showHome, "Companies"));
}

function showSystems() {
  const systems = getByType("system");
  render(logoList(systems, (s) => showSystemDetail(s), showHome, "Systems"));
}

function showSeriesList() {
  const series = getByType("series");
  render(logoList(series, (s) => showSeriesDetail(s), showHome, "Series"));
}

function showCompanyDetail(company) {
  render(tabbedEntryList([
    { label: "Systems", items: () => filterByCompany("system", company.id) },
    { label: "Hardware", items: () => filterByCompany("hardware", company.id) },
    { label: "Series", items: () => filterByCompany("series", company.id) },
    { label: "Games", items: () => filterByCompany("game", company.id) },
  ], showCompanies, company.name));
}

function showSystemDetail(system) {
  render(tabbedEntryList([
    { label: "Hardware", items: () => filterBySystem("hardware", system.id) },
    { label: "Games", items: () => filterBySystem("game", system.id) },
  ], showSystems, system.name));
}

function showSeriesDetail(series) {
  render(tabbedEntryList([
    { label: "Hardware", items: () => filterBySeries("hardware", series.name) },
    { label: "Games", items: () => filterBySeries("game", series.name) },
    { label: "Amiibo", items: () => filterBySeries("amiibo", series.name) },
  ], showSeriesList, series.name));
}

// --- Init ---

document.addEventListener("DOMContentLoaded", async () => {
  const main = document.getElementById("dashboard");
  main.innerHTML = `<p class="index-status">Loading catalog…</p>`;

  try {
    catalog = await loadCatalog((loaded, total) => {
      main.innerHTML = `<p class="index-status">Indexing… ${loaded}/${total}</p>`;
    });
    showHome();
  } catch (err) {
    main.innerHTML = `<p class="index-status">Failed to load: ${err.message}</p>`;
  }
});
