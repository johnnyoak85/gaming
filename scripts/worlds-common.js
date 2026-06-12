export function el(tag, attrs = {}, children = []) {
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

export function imageUrl(entry) {
  const image = entry?.cover ?? entry?.logo ?? entry?.portrait;
  if (!image) return null;
  if (image.startsWith("http")) return image;
  const folder = {
    amiibo: "amiibo",
    company: "company",
    event: "events",
    hardware: "hardware",
    person: "person",
    release_line: "release-line",
    series: "series",
    system: "system",
  }[entry.type] ?? "game";
  return `./assets/images/${folder}/${image}.png`;
}

export function detailHref(entry) {
  if (entry.type === "hardware") return `pages/hardware-detail.html?id=${encodeURIComponent(entry.id)}`;
  if (entry.type === "amiibo") return `pages/amiibo-detail.html?id=${encodeURIComponent(entry.id)}`;
  if (entry.type === "system") return `pages/system-detail.html?id=${encodeURIComponent(entry.id)}`;
  if (entry.type === "series") return `pages/series-detail.html?id=${encodeURIComponent(entry.id)}`;
  if (entry.type === "company") return `pages/company-detail.html?id=${encodeURIComponent(entry.id)}`;
  if (entry.type === "event") return `pages/event-detail.html?id=${encodeURIComponent(entry.id)}`;
  if (entry.type === "person") return `pages/person-detail.html?id=${encodeURIComponent(entry.id)}`;
  if (entry.type === "release_line") return `pages/release-line-detail.html?id=${encodeURIComponent(entry.id)}`;
  return `pages/game-detail.html?id=${encodeURIComponent(entry.id)}`;
}

export function sortByRelease(items) {
  return [...items].sort((a, b) => {
    const releaseCmp = (a.release ?? "9999-99-99").localeCompare(b.release ?? "9999-99-99");
    if (releaseCmp !== 0) return releaseCmp;
    return (a.name ?? "").localeCompare(b.name ?? "");
  });
}

export function sortByName(items) {
  return [...items].sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
}

export function typeLabel(type) {
  return {
    amiibo: "Amiibo",
    bundle: "Bundle",
    collection: "Collection",
    company: "Company",
    event: "Event",
    game: "Game",
    hardware: "Hardware",
    person: "Person",
    release_line: "Release Line",
    series: "Series",
    system: "System",
  }[type] ?? type;
}

export function section(title, ...content) {
  const filtered = content.filter(Boolean);
  if (!filtered.length) return null;
  return el("section", { class: "world-section" }, [
    el("h2", {}, title),
    ...filtered,
  ]);
}

export function buildHeader(backHref = "../index.html") {
  const header = el("div", { class: "list-header" });
  const backBtn = el("button", { type: "button" }, "← Back");
  backBtn.addEventListener("click", () => {
    window.location.href = backHref;
  });
  header.appendChild(backBtn);
  return header;
}

export function buildHero(entry, meta = []) {
  const logo = imageUrl(entry);
  return el("section", { class: "world-hero" }, [
    logo ? el("img", {
      src: logo,
      alt: entry.name,
      class: "world-hero-logo",
      onerror: (event) => event.currentTarget.remove(),
    }) : null,
    el("h1", {}, entry.name),
    entry.description ? el("p", {}, entry.description) : null,
    meta.filter(Boolean).length
      ? el("div", { class: "world-meta" }, meta.filter(Boolean).map((item) => el("span", { class: "world-pill" }, item)))
      : null,
  ]);
}

export function card(entry) {
  return typedCard(entry, { showType: false });
}

export function typedCard(entry, { showType = true } = {}) {
  const image = imageUrl(entry);
  return el("a", { href: detailHref(entry), class: `card ${["system", "series", "company", "event", "person", "release_line"].includes(entry.type) ? "logo-card" : ""}` }, [
    image ? el("img", {
      src: image,
      alt: entry.name,
      class: "card-cover",
      loading: "lazy",
      onerror: (event) => event.currentTarget.remove(),
    }) : null,
    showType ? el("span", { class: "card-type" }, typeLabel(entry.type)) : null,
    el("span", { class: "card-name" }, entry.name),
  ]);
}

export function cardGrid(items, { by = "release" } = {}) {
  const sorted = by === "manual" ? items : by === "name" ? sortByName(items) : sortByRelease(items);
  return el("div", { class: "card-grid visible" }, sorted.map(card));
}

export function typedCardGrid(items, { by = "name" } = {}) {
  const sorted = by === "manual" ? items : by === "name" ? sortByName(items) : sortByRelease(items);
  return el("div", { class: "card-grid visible" }, sorted.map((entry) => typedCard(entry)));
}

export function essentialsSection(catalog, ids) {
  if (!ids?.length) return null;
  const byId = new Map(catalog.map((entry) => [entry.id, entry]));
  const items = ids.map((id) => byId.get(id)).filter(Boolean);
  return items.length ? section("Essentials", cardGrid(items, { by: "manual" })) : null;
}

export function erasSection(eras) {
  if (!eras?.length) return null;
  return section("Eras", el("div", { class: "era-list" }, eras.map((era) =>
    el("article", { class: "era-card" }, [
      el("h3", {}, era.title),
      era.start_year || era.end_year
        ? el("p", {}, [era.start_year, era.end_year].filter(Boolean).join("–"))
        : null,
      era.description ? el("p", {}, era.description) : null,
    ])
  )));
}
