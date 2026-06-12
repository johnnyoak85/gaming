import { loadCatalog } from "./catalog.js";
import { buildHeader, buildHero, cardGrid, el, section, typedCardGrid } from "./worlds-common.js";

document.addEventListener("DOMContentLoaded", async () => {
  const main = document.getElementById("list-page");
  const id = new URLSearchParams(window.location.search).get("id");

  if (!id) {
    main.innerHTML = `<p class="empty-state">No event specified.</p>`;
    return;
  }

  try {
    const catalog = await loadCatalog();
    const event = catalog.find((entry) => entry.id === id && entry.type === "event");
    if (!event) {
      main.innerHTML = `<p class="empty-state">Event not found.</p>`;
      return;
    }

    const refs = new Set([event.id, event.name].filter(Boolean));
    const series = (event.franchise ?? [])
      .map((seriesId) => catalog.find((entry) => entry.id === seriesId && entry.type === "series"))
      .filter(Boolean);
    const companies = (event.companies ?? [])
      .map((companyId) => catalog.find((entry) => entry.id === companyId && entry.type === "company"))
      .filter(Boolean);
    const systems = (event.systems ?? [])
      .map((systemId) => catalog.find((entry) => entry.id === systemId && entry.type === "system"))
      .filter(Boolean);
    const people = (event.people ?? [])
      .map((personId) => catalog.find((entry) => entry.id === personId && entry.type === "person"))
      .filter(Boolean);
    const context = [
      ...systems,
      ...series,
      ...companies,
      ...people,
    ];
    const entries = catalog.filter((entry) => refs.has(entry.event));

    document.title = event.name;
    main.innerHTML = "";
    main.append(...[
      buildHeader("../index.html"),
      buildHero(event, [
        event.category ? `Category: ${event.category}` : null,
        event.date ? `Start: ${event.date}` : null,
        event.end_date ? `End: ${event.end_date}` : null,
      ]),
      context.length ? section("Shelf Context", typedCardGrid(context, { by: "manual" })) : null,
      entries.length ? section("Entries", cardGrid(entries)) : null,
      event.notes ? section("Notes", el("p", {}, event.notes)) : null,
    ].filter(Boolean));
  } catch (err) {
    main.innerHTML = `<p class="empty-state">Failed to load data: ${err.message}</p>`;
  }
});
