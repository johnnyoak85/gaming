import { loadCatalog, getCompanies } from "./catalog.js";

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
  return `./assets/images/${logo}.png`;
}

function sortByName(items) {
  return [...items].sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
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

function renderCircleSection(circle, allDevs) {
  const section = el("div", { class: "circle-section" });

  const logo = logoUrl(circle);
  const heading = el("div", { class: "circle-heading" }, [
    logo ? el("img", { src: logo, alt: circle.name, class: "circle-logo" }) : el("h2", {}, circle.name),
  ]);
  section.appendChild(heading);

  const contains = circle.contains ?? [];
  if (contains.length) {
    const subList = el("div", { class: "circle-sub-list" });
    for (const subId of contains) {
      const sub = allDevs.find((d) => d.id === subId);
      const name = sub ? sub.name : subId;
      const subLogo = sub ? logoUrl(sub) : null;
      const link = el("a", { href: `developer-detail.html?id=${encodeURIComponent(subId)}`, class: "circle-sub-link" }, [
        subLogo ? el("img", { src: subLogo, alt: name, class: "circle-sub-logo" }) : el("span", {}, name),
      ]);
      subList.appendChild(link);
    }
    section.appendChild(subList);
  }

  return section;
}

document.addEventListener("DOMContentLoaded", async () => {
  const main = document.getElementById("list-page");

  try {
    const catalog = await loadCatalog();
    const allDevs = getCompanies(catalog);

    const majors = sortByName(allDevs.filter((d) => d.circle === "major"));
    const minors = sortByName(allDevs.filter((d) => d.circle === "minor"));

    main.innerHTML = "";

    const header = buildHeader();
    main.appendChild(header);

    const container = el("div", { class: "circles-container" });

    for (const circle of [...majors, ...minors]) {
      container.appendChild(renderCircleSection(circle, allDevs));
    }

    main.appendChild(container);
  } catch (err) {
    main.innerHTML = `<p class="empty-state">Failed to load data: ${err.message}</p>`;
  }
});
