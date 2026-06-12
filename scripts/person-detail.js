import { loadCatalog } from "./catalog.js";
import { buildHeader, buildHero, cardGrid, el, essentialsSection, section, typedCardGrid } from "./worlds-common.js";

document.addEventListener("DOMContentLoaded", async () => {
  const main = document.getElementById("list-page");
  const id = new URLSearchParams(window.location.search).get("id");

  if (!id) {
    main.innerHTML = `<p class="empty-state">No person specified.</p>`;
    return;
  }

  try {
    const catalog = await loadCatalog();
    const person = catalog.find((entry) => entry.id === id && entry.type === "person");
    if (!person) {
      main.innerHTML = `<p class="empty-state">Person not found.</p>`;
      return;
    }

    const refs = new Set([person.id, person.name].filter(Boolean));
    const companies = (person.companies ?? [])
      .map((companyId) => catalog.find((entry) => entry.id === companyId && entry.type === "company"))
      .filter(Boolean);
    const systems = (person.systems ?? [])
      .map((systemId) => catalog.find((entry) => entry.id === systemId && entry.type === "system"))
      .filter(Boolean);
    const people = (person.people ?? [])
      .map((personId) => catalog.find((entry) => entry.id === personId && entry.type === "person"))
      .filter(Boolean);
    const context = [
      ...systems,
      ...companies,
      ...people,
    ];
    const entries = catalog.filter((entry) =>
      Array.isArray(entry.people) && entry.people.some((personRef) => refs.has(personRef))
    );

    document.title = person.name;
    main.innerHTML = "";
    main.append(...[
      buildHeader("../index.html"),
      buildHero(person, [
        person.roles?.length ? `Roles: ${person.roles.join(", ")}` : null,
        person.country ? `Country: ${person.country}` : null,
        person.circle ? `Circle: ${person.circle}` : null,
      ]),
      context.length ? section("Shelf Context", typedCardGrid(context, { by: "manual" })) : null,
      essentialsSection(catalog, person.essentials),
      entries.length ? section("Entries", cardGrid(entries)) : null,
      person.notes ? section("Notes", el("p", {}, person.notes)) : null,
    ].filter(Boolean));
  } catch (err) {
    main.innerHTML = `<p class="empty-state">Failed to load data: ${err.message}</p>`;
  }
});
