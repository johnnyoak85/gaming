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

function getCoverSrc(item) {
  if (!item.cover) return null;
  if (item.cover.startsWith("http")) return item.cover;
  return `./assets/images/${item.cover}.png`;
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
        ? el("img", { class: "logo-img", src: `./assets/images/${item.logo}.png`, alt: item.name })
        : el("div", { class: "logo-img placeholder" }, item.name),
    ]);
    grid.appendChild(card);
  }
  if (!items.length) grid.appendChild(el("p", { class: "empty-state" }, "No entries found."));
  container.appendChild(grid);
  return container;
}

function tabbedEntryList(tabs, backFn, title) {
  const visibleTabs = tabs.filter((tab) => tab.items().length > 0);
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
  const content = el("div", { class: "tab-content" });

  function showTab(idx) {
    tabBar.querySelectorAll(".tab-btn").forEach((b, i) => b.classList.toggle("active", i === idx));
    const items = visibleTabs[idx].items();
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

  visibleTabs.forEach((tab, idx) => {
    const btn = el("button", { class: "tab-btn" + (idx === 0 ? " active" : ""), onclick: () => showTab(idx) }, tab.label);
    tabBar.appendChild(btn);
  });

  container.appendChild(tabBar);
  container.appendChild(content);
  showTab(0);
  return container;
}

// --- Data helpers ---

function isOwned(entry) {
  const t = entry.type;
  if (t === "game") {
    const access = entry.access;
    if (!Array.isArray(access)) return false;
    return access.some((a) => a.status === "owned");
  }
  if (t === "hardware") {
    const ownership = entry.ownership;
    if (!ownership) return false;
    if (Array.isArray(ownership)) return ownership.some((o) => o.status === "owned");
    return ownership === "owned";
  }
  if (t === "amiibo") {
    const ownership = entry.ownership;
    if (!ownership) return false;
    if (Array.isArray(ownership)) return ownership.some((o) => o.status === "owned");
    return ownership === "owned";
  }
  return false;
}

function isWishlist(entry) {
  const t = entry.type;
  if (t === "game") {
    const access = entry.access;
    if (!Array.isArray(access)) return false;
    return access.some((a) => a.status === "wishlist");
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

function getOwned(type) {
  return catalog.filter((e) => e.type === type && isOwned(e));
}

function getWishlist(type) {
  return catalog.filter((e) => e.type === type && isWishlist(e));
}

function getByType(type) {
  return catalog.filter((e) => e.type === type);
}

function filterByCompany(type, companyId) {
  return catalog.filter((e) => {
    if (e.type !== type) return false;
    const companies = e.companies;
    if (Array.isArray(companies)) return companies.includes(companyId);
    return false;
  });
}

function filterBySystem(type, systemId) {
  return catalog.filter((e) => e.type === type && e.system === systemId);
}

function filterBySeries(type, seriesName) {
  return catalog.filter((e) => {
    if (e.type !== type) return false;
    const franchise = e.franchise;
    if (!franchise) return false;
    return franchise.universe === seriesName || franchise.series === seriesName || franchise.subseries === seriesName;
  });
}

// --- Views ---

function showHome() {
  render(cardGrid([
    { label: "Library", action: () => showCollection() },
    { label: "Worlds", action: () => showTaxonomy() },
    { label: "Journey", disabled: true },
  ]));
}

function showCollection() {
  render(cardGrid([
    { label: "Games", action: () => showOwnedGames() },
    { label: "Hardware", action: () => showOwnedHardware() },
    { label: "Amiibo", action: () => showOwnedAmiibo() },
    { label: "Wishlist", action: () => showWishlist() },
  ], showHome));
}

function showOwnedGames() {
  render(entryList(getOwned("game"), showCollection, "Games"));
}

function showOwnedHardware() {
  render(entryList(getOwned("hardware"), showCollection, "Hardware"));
}

function showOwnedAmiibo() {
  render(entryList(getOwned("amiibo"), showCollection, "Amiibo"));
}

function showWishlist() {
  render(tabbedEntryList([
    { label: "Games", items: () => getWishlist("game") },
    { label: "Hardware", items: () => getWishlist("hardware") },
    { label: "Amiibo", items: () => getWishlist("amiibo") },
  ], showCollection, "Wishlist"));
}

function showTaxonomy() {
  render(cardGrid([
    { label: "Companies", action: () => showCompanies() },
    { label: "Systems", action: () => showSystems() },
    { label: "Series", action: () => showSeriesList() },
  ], showHome));
}

function showCompanies() {
  const companies = getByType("company");
  render(logoList(companies, (c) => showCompanyDetail(c), showTaxonomy, "Companies"));
}

function showSystems() {
  const systems = getByType("system");
  render(logoList(systems, (s) => showSystemDetail(s), showTaxonomy, "Systems"));
}

function showSeriesList() {
  const series = getByType("series");
  render(logoList(series, (s) => showSeriesDetail(s), showTaxonomy, "Series"));
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
