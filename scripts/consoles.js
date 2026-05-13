import { loadCatalog, getHardware } from "./catalog.js";

const state = {
  items: [],
  showOwned: true,
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

function isOwned(item) {
  const ownership = item.ownership ?? [];
  return !ownership.some((o) => o.status === 'wishlist');
}

function coverUrl(item) {
  const cover = item.cover;
  if (!cover) return null;
  if (cover.startsWith("http")) return cover;
  return `./images/${cover}.png`;
}

function getFilteredItems() {
  return state.items
    .filter((item) => item.hardware?.category === "console" || item.hardware?.category === "computer")
    .filter((item) => (state.showOwned ? isOwned(item) : !isOwned(item)));
}

function sortItems(items) {
  return [...items].sort((a, b) => {
    const dA = a.release ?? "";
    const dB = b.release ?? "";
    if (dA && dB) {
      const cmp = dA.localeCompare(dB);
      if (cmp !== 0) return cmp;
    }
    return (a.name ?? "").localeCompare(b.name ?? "");
  });
}

function renderGrid() {
  const container = document.getElementById("card-grid");
  if (!container) return;

  container.classList.remove("visible");

  setTimeout(() => {
    container.innerHTML = "";
    const items = sortItems(getFilteredItems());

    if (!items.length) {
      container.appendChild(el("p", { class: "empty-state" }, "No consoles found."));
    } else {
      items.forEach((item) => {
        const cover = coverUrl(item);
        const card = el("a", { href: `hardware-detail.html?id=${encodeURIComponent(item.id)}`, class: "card" }, [
          cover ? el("img", { src: cover, alt: item.name, class: "card-cover" }) : null,
          el("span", { class: "card-name" }, item.name),
        ]);
        container.appendChild(card);
      });
    }

    requestAnimationFrame(() => container.classList.add("visible"));
  }, 200);
}

function buildHeader() {
  const header = el("div", { class: "list-header" });

  const backBtn = el("button", {}, "← Back");
  backBtn.addEventListener("click", () => {
    window.location.href = "./index.html";
  });
  header.appendChild(backBtn);

  const wishlistBtn = el("button", { id: "toggle-wishlist" }, "Show Wishlist");
  wishlistBtn.addEventListener("click", () => {
    state.showOwned = !state.showOwned;
    wishlistBtn.textContent = state.showOwned ? "Show Wishlist" : "Show Owned";
    renderGrid();
  });
  header.appendChild(wishlistBtn);

  return header;
}

document.addEventListener("DOMContentLoaded", async () => {
  const main = document.getElementById("list-page");

  try {
    const catalog = await loadCatalog();
    state.items = getHardware(catalog);

    main.innerHTML = "";

    const header = buildHeader();
    const grid = el("div", { id: "card-grid", class: "card-grid" });

    main.appendChild(header);
    main.appendChild(grid);

    renderGrid();
  } catch (err) {
    main.innerHTML = `<p class="empty-state">Failed to load data: ${err.message}</p>`;
  }
});
