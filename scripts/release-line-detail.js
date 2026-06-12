import { loadCatalog } from "./catalog.js";
import { buildHeader, buildHero, cardGrid, el, essentialsSection, section, typedCardGrid } from "./worlds-common.js";

function refsFor(entry) {
  const companies = Array.isArray(entry.companies) ? entry.companies : [];
  return { companies };
}

document.addEventListener("DOMContentLoaded", async () => {
  const main = document.getElementById("list-page");
  const id = new URLSearchParams(window.location.search).get("id");

  if (!id) {
    main.innerHTML = `<p class="empty-state">No release line specified.</p>`;
    return;
  }

  try {
    const catalog = await loadCatalog();
    const releaseLine = catalog.find((entry) => entry.id === id && entry.type === "release_line");
    if (!releaseLine) {
      main.innerHTML = `<p class="empty-state">Release line not found.</p>`;
      return;
    }

    const companies = refsFor(releaseLine).companies
      .map((companyId) => catalog.find((entry) => entry.id === companyId && entry.type === "company"))
      .filter(Boolean);
    const system = releaseLine.system
      ? catalog.find((entry) => entry.id === releaseLine.system && entry.type === "system")
      : null;
    const people = (releaseLine.people ?? [])
      .map((personId) => catalog.find((entry) => entry.id === personId && entry.type === "person"))
      .filter(Boolean);
    const context = [
      system,
      ...companies,
      ...people,
    ].filter(Boolean);
    const entries = catalog.filter((entry) => entry.release_line === releaseLine.id);

    document.title = releaseLine.name;
    main.innerHTML = "";
    main.append(...[
      buildHeader("../index.html"),
      buildHero(releaseLine, [
        releaseLine.category ? `Category: ${releaseLine.category}` : null,
        releaseLine.date ? `Date: ${releaseLine.date}` : null,
      ]),
      context.length ? section("Shelf Context", typedCardGrid(context, { by: "manual" })) : null,
      essentialsSection(catalog, releaseLine.essentials),
      entries.length ? section("Entries", cardGrid(entries)) : null,
      releaseLine.notes ? section("Notes", el("p", {}, releaseLine.notes)) : null,
    ].filter(Boolean));
  } catch (err) {
    main.innerHTML = `<p class="empty-state">Failed to load data: ${err.message}</p>`;
  }
});
