import { loadCatalog } from "./catalog.js";

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

function logoUrl(logo) {
  if (!logo) return null;
  if (logo.startsWith("http")) return logo;
  return `./assets/images/company/${logo}.png`;
}

function coverUrl(entry) {
  const cover = entry.cover;
  if (!cover) return null;
  if (cover.startsWith("http")) return cover;
  return `./assets/images/game/${cover}.png`;
}

function sortByRelease(items) {
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

function getDetailHref(entry) {
  if (entry.type === "hardware") return `hardware-detail.html?id=${encodeURIComponent(entry.id)}`;
  if (entry.type === "amiibo") return `amiibo-detail.html?id=${encodeURIComponent(entry.id)}`;
  return `detail.html?id=${encodeURIComponent(entry.id)}`;
}

document.addEventListener("DOMContentLoaded", async () => {
  const main = document.getElementById("list-page");
  const params = new URLSearchParams(window.location.search);
  const devId = params.get("id");

  if (!devId) {
    main.innerHTML = `<p class="empty-state">No developer specified.</p>`;
    return;
  }

  try {
    const catalog = await loadCatalog();

    const developer = catalog.find((e) => e.id === devId && e.type === "developer");
    if (!developer) {
      main.innerHTML = `<p class="empty-state">Developer not found.</p>`;
      return;
    }

    const entries = catalog.filter((e) => {
      return Array.isArray(e.companies) && e.companies.includes(devId);
    });

    document.title = developer.name;
    main.innerHTML = "";

    const header = el("div", { class: "list-header" });

    const backBtn = el("button", {}, "← Back");
    backBtn.addEventListener("click", () => {
      window.location.href = "./developers.html";
    });
    header.appendChild(backBtn);

    main.appendChild(header);

    const logo = logoUrl(developer.logo);
    if (logo) {
      const heroImg = el("img", { src: logo, alt: developer.name, class: "system-hero-logo" });
      main.appendChild(heroImg);
    }

    const grid = el("div", { id: "card-grid", class: "card-grid" });
    main.appendChild(grid);

    setTimeout(() => {
      const sorted = sortByRelease(entries);

      if (!sorted.length) {
        grid.appendChild(el("p", { class: "empty-state" }, "No entries found for this developer."));
      } else {
        sorted.forEach((entry) => {
          const cover = coverUrl(entry);
          const card = el("a", { href: getDetailHref(entry), class: "card" }, [
            cover ? el("img", { src: cover, alt: entry.name, class: "card-cover" }) : null,
            el("span", { class: "card-name" }, entry.name),
          ]);
          grid.appendChild(card);
        });
      }

      requestAnimationFrame(() => grid.classList.add("visible"));
    }, 200);
  } catch (err) {
    main.innerHTML = `<p class="empty-state">Failed to load data: ${err.message}</p>`;
  }
});
