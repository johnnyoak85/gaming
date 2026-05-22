import { loadCatalog } from "./catalog.js";

function getImageSubfolder(type) {
  switch (type) {
    case "game":
    case "game_collection": return "game";
    case "hardware": return "hardware";
    case "amiibo": return "amiibo";
    default: return "game";
  }
}

const WISHLIST_LEVEL = {
  1: { emoji: "🤍", label: "Low" },
  2: { emoji: "🩷", label: "Medium" },
  3: { emoji: "💛", label: "High" },
  4: { emoji: "🧡", label: "Essential" },
  5: { emoji: "❤️", label: "Non-negotiable" },
};

const DETAIL_PAGE = {
  game: "detail.html",
  game_collection: "detail.html",
  hardware: "hardware-detail.html",
  amiibo: "amiibo-detail.html",
};

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

function coverUrl(item) {
  const cover = item.cover;
  if (!cover) return null;
  if (cover.startsWith("http")) return cover;
  const folder = getImageSubfolder(item.type);
  return `./assets/images/${folder}/${cover}.png`;
}

function detailUrl(item) {
  const page = DETAIL_PAGE[item.type] ?? "detail.html";
  return `${page}?id=${encodeURIComponent(item.id)}`;
}

function renderGroup(priority, items, container) {
  const level = WISHLIST_LEVEL[priority] ?? { emoji: "❓", label: "Unset" };
  const heading = el("h2", { class: "priority-heading" }, `${level.emoji} ${level.label}`);
  container.appendChild(heading);

  const grid = el("div", { class: "card-grid visible" });
  items
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((item) => {
      const cover = coverUrl(item);
      const card = el("a", { href: detailUrl(item), class: "card" }, [
        cover ? el("img", { src: cover, alt: item.name, class: "card-cover" }) : null,
        el("span", { class: "card-name" }, item.name),
      ]);
      grid.appendChild(card);
    });

  container.appendChild(grid);
}

function buildHeader() {
  const header = el("div", { class: "list-header" });

  const backBtn = el("button", {}, "← Back");
  backBtn.addEventListener("click", () => {
    window.location.href = "./index.html";
  });
  header.appendChild(backBtn);

  return header;
}

document.addEventListener("DOMContentLoaded", async () => {
  const main = document.getElementById("list-page");

  try {
    const catalog = await loadCatalog();

    // Build wishlist from catalog: physical wishlist only
    const items = [];
    for (const entry of catalog) {
      const t = entry.type;
      const acq = entry.acquisition || {};
      const priority = acq.priority || 0;

      if (t === "game") {
        const access = entry.access || [];
        if (access.some((a) => a.status === "wishlist" && a.format === "physical")) {
          items.push({ id: entry.id, name: entry.name, cover: entry.cover, type: t, priority, reason: acq.reason });
        }
      } else if (t === "hardware") {
        const ownership = entry.ownership || [];
        if (ownership.some((o) => o.status === "wishlist")) {
          items.push({ id: entry.id, name: entry.name, cover: entry.cover, type: t, priority, reason: acq.reason });
        }
      } else if (t === "amiibo") {
        if (entry.ownership === "wishlist") {
          items.push({ id: entry.id, name: entry.name, cover: entry.cover, type: t, priority, reason: acq.reason });
        }
      }
    }

    main.innerHTML = "";

    const header = buildHeader();
    main.appendChild(header);

    const content = el("div", { class: "wishlist-content" });

    // Group by priority, descending (5 → 1, then 0/unset last)
    const grouped = {};
    for (const item of items) {
      const p = item.priority || 0;
      if (!grouped[p]) grouped[p] = [];
      grouped[p].push(item);
    }

    const priorities = Object.keys(grouped)
      .map(Number)
      .sort((a, b) => b - a);

    // Move 0 (unset) to end
    const unsetIdx = priorities.indexOf(0);
    if (unsetIdx !== -1) {
      priorities.splice(unsetIdx, 1);
      priorities.push(0);
    }

    for (const p of priorities) {
      renderGroup(p, grouped[p], content);
    }

    main.appendChild(content);
  } catch (err) {
    main.innerHTML = `<p class="empty-state">Failed to load data: ${err.message}</p>`;
  }
});
