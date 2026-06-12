import { loadCatalog } from "./catalog.js";
import { buildHeader, buildHero, cardGrid, erasSection, essentialsSection, section } from "./worlds-common.js";

document.addEventListener("DOMContentLoaded", async () => {
  const main = document.getElementById("list-page");
  const systemId = new URLSearchParams(window.location.search).get("id");

  if (!systemId) {
    main.innerHTML = `<p class="empty-state">No system specified.</p>`;
    return;
  }

  try {
    const catalog = await loadCatalog();
    const system = catalog.find((entry) => entry.id === systemId && entry.type === "system");
    if (!system) {
      main.innerHTML = `<p class="empty-state">System not found.</p>`;
      return;
    }

    const systemRefs = new Set([system.id, system.name, system.id.replace(/-system$/, "")].filter(Boolean));
    const entries = catalog.filter((entry) => systemRefs.has(entry.system));
    const relatedSeries = (system.series ?? [])
      .map((id) => catalog.find((entry) => entry.id === id && entry.type === "series"))
      .filter(Boolean);

    document.title = system.name;
    main.innerHTML = "";
    main.append(...[
      buildHeader("systems.html"),
      buildHero(system, [system.era, system.parent ? `Parent: ${system.parent}` : null]),
      essentialsSection(catalog, system.essentials),
      relatedSeries.length ? section("Related Series", cardGrid(relatedSeries, { by: "name" })) : null,
      entries.length ? section("Entries", cardGrid(entries)) : null,
      erasSection(system.eras)
    ].filter(Boolean));
  } catch (err) {
    main.innerHTML = `<p class="empty-state">Failed to load data: ${err.message}</p>`;
  }
});
