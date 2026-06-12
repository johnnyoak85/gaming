import { loadCatalog } from "./catalog.js";
import { buildHeader, buildHero, cardGrid, erasSection, essentialsSection, section } from "./worlds-common.js";

document.addEventListener("DOMContentLoaded", async () => {
  const main = document.getElementById("list-page");
  const companyId = new URLSearchParams(window.location.search).get("id");

  if (!companyId) {
    main.innerHTML = `<p class="empty-state">No company specified.</p>`;
    return;
  }

  try {
    const catalog = await loadCatalog();
    const company = catalog.find((entry) => entry.id === companyId && entry.type === "company");
    if (!company) {
      main.innerHTML = `<p class="empty-state">Company not found.</p>`;
      return;
    }

    const refs = new Set([company.id, company.name].filter(Boolean));
    const entries = catalog.filter((entry) => {
      const companies = entry.companies;
      if (Array.isArray(companies)) return companies.some((companyRef) => refs.has(companyRef));
      return [
        ...(companies?.developer ?? []),
        ...(companies?.publisher ?? []),
        ...(companies?.manufacturer ?? []),
      ].some((companyRef) => refs.has(companyRef));
    });
    const contains = (company.contains ?? [])
      .map((id) => catalog.find((entry) => entry.id === id && entry.type === "company"))
      .filter(Boolean);

    document.title = company.name;
    main.innerHTML = "";
    main.append(...[
      buildHeader("companies.html"),
      buildHero(company, [
        company.country ? `Country: ${company.country}` : null,
        company.founded ? `Founded: ${company.founded}` : null,
        company.defunct ? `Defunct: ${company.defunct}` : null,
      ]),
      contains.length ? section("Related Companies", cardGrid(contains, { by: "name" })) : null,
      essentialsSection(catalog, company.essentials),
      entries.length ? section("Entries", cardGrid(entries)) : null,
      erasSection(company.eras)
    ].filter(Boolean));
  } catch (err) {
    main.innerHTML = `<p class="empty-state">Failed to load data: ${err.message}</p>`;
  }
});
