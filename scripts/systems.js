import { loadCatalog, getSystems } from "./catalog.js";

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

function logoUrl(item) {
  const logo = item.logo;
  if (!logo) return null;
  if (logo.startsWith("http")) return logo;
  return `./images/${logo}.png`;
}

function sortItems(items) {
  return [...items].sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
}

function renderGrid(items) {
  const container = document.getElementById("card-grid");
  if (!container) return;

  container.classList.remove("visible");

  setTimeout(() => {
    container.innerHTML = "";
    const sorted = sortItems(items);

    if (!sorted.length) {
      container.appendChild(el("p", { class: "empty-state" }, "No systems found."));
    } else {
      sorted.forEach((item) => {
        const logo = logoUrl(item);
        const card = el("a", { href: `system-detail.html?id=${encodeURIComponent(item.id)}`, class: "card" }, [
          logo ? el("img", { src: logo, alt: item.name, class: "card-cover" }) : el("span", { class: "card-name" }, item.name),
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

  return header;
}

document.addEventListener("DOMContentLoaded", async () => {
  const main = document.getElementById("list-page");

  try {
    const catalog = await loadCatalog();
    const systems = getSystems(catalog);

    main.innerHTML = "";

    const header = buildHeader();
    const grid = el("div", { id: "card-grid", class: "card-grid" });

    main.appendChild(header);
    main.appendChild(grid);

    renderGrid(systems);
  } catch (err) {
    main.innerHTML = `<p class="empty-state">Failed to load data: ${err.message}</p>`;
  }
});
