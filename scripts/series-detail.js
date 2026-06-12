import { loadCatalog } from "./catalog.js";
import { buildHeader, buildHero, cardGrid, erasSection, essentialsSection, section } from "./worlds-common.js";

document.addEventListener("DOMContentLoaded", async () => {
  const main = document.getElementById("list-page");
  const seriesId = new URLSearchParams(window.location.search).get("id");

  if (!seriesId) {
    main.innerHTML = `<p class="empty-state">No series specified.</p>`;
    return;
  }

  try {
    const catalog = await loadCatalog();
    const series = catalog.find((entry) => entry.id === seriesId && entry.type === "series");
    if (!series) {
      main.innerHTML = `<p class="empty-state">Series not found.</p>`;
      return;
    }

    const refs = new Set([series.id, series.name].filter(Boolean));
    const entries = catalog.filter((entry) =>
      refs.has(entry.franchise?.universe) ||
      refs.has(entry.franchise?.series) ||
      refs.has(entry.franchise?.subseries)
    );
    const subseries = (series.contains ?? [])
      .map((id) => catalog.find((entry) => entry.id === id && entry.type === "series"))
      .filter(Boolean);
    const companies = (series.companies ?? [])
      .map((id) => catalog.find((entry) => entry.id === id && entry.type === "company"))
      .filter(Boolean);

    document.title = series.name;
    main.innerHTML = "";
    main.append(...[
      buildHeader("series.html"),
      buildHero(series, [series.circle ? `Circle: ${series.circle}` : null]),
      companies.length ? section("Companies", cardGrid(companies, { by: "name" })) : null,
      subseries.length ? section("Subseries", cardGrid(subseries, { by: "name" })) : null,
      essentialsSection(catalog, series.essentials),
      entries.length ? section("Entries", cardGrid(entries)) : null,
      erasSection(series.eras)
    ].filter(Boolean));
  } catch (err) {
    main.innerHTML = `<p class="empty-state">Failed to load data: ${err.message}</p>`;
  }
});
