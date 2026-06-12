import { loadCatalog } from "./catalog.js";

const DATA_PATH = "./assets/data/";
const IMAGE_ROOT = "./assets/images";

const HARDWARE_CATEGORY = {
  console: "Console",
  controller: "Controller",
  accessory: "Accessory",
  computer: "Computer",
  peripheral: "Peripheral",
  adapter: "Adapter",
  storage: "Storage",
  cable: "Cable",
};

const HARDWARE_FORM = {
  home: "Home",
  handheld: "Handheld",
  hybrid: "Hybrid",
  mini: "Mini",
  dedicated: "Dedicated",
  plug_and_play: "Plug & Play",
  add_on: "Add-on",
  standard: "Standard",
  special: "Special",
};

const HARDWARE_ERA = {
  primitive: "Primitive",
  classic: "Classic",
  "8-bit": "8-bit",
  "16-bit": "16-bit",
  "32-bit": "32-bit",
  "128-bit": "128-bit",
  "720p": "720p",
  "1080p": "1080p",
  "4k": "4K",
};

const ACCESS_FORMAT = {
  physical: { label: "Physical", icon: "🏷️" },
  digital: { label: "Digital", icon: "☁️" },
  injected: { label: "Injected", icon: "🧩" },
  reproduction: { label: "Reproduction", icon: "🃏" },
  contained: { label: "Contained", icon: "📦" },
  built_in: { label: "Built In", icon: "🕹️" },
};

const STATUS_ICON = {
  owned: { label: "Owned", icon: "🏷️" },
  wishlist: { label: "Wishlist", icon: "🤍" },
  borrowed: { label: "Borrowed", icon: "↔️" },
  unavailable: { label: "Unavailable", icon: "🚫" },
};

let catalogPromise = null;
const entryCache = {};

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value == null) continue;
    if (key === "class") node.className = value;
    else if (key.startsWith("on") && typeof value === "function") node.addEventListener(key.slice(2), value);
    else node.setAttribute(key, value);
  }
  for (const child of [children].flat()) {
    if (child == null) continue;
    node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return node;
}

function section(title, ...content) {
  const filtered = content.filter(Boolean);
  if (!filtered.length) return null;
  return el("section", { class: "detail-section curator-section" }, [
    el("h2", {}, title),
    ...filtered,
  ]);
}

function field(label, value) {
  if (value == null || value === "") return null;
  return el("div", { class: "field" }, [
    el("span", { class: "field-label" }, label),
    el("span", { class: "field-value" }, value),
  ]);
}

function imageFolder(type) {
  switch (type) {
    case "hardware": return "hardware";
    case "amiibo": return "amiibo";
    case "system": return "system";
    case "series": return "series";
    case "company": return "company";
    case "event": return "events";
    case "person": return "person";
    case "release_line": return "release-line";
    default: return "game";
  }
}

function imageUrl(entryOrCover, type = "hardware") {
  const image = typeof entryOrCover === "string"
    ? entryOrCover
    : entryOrCover?.cover ?? entryOrCover?.logo ?? entryOrCover?.portrait;
  if (!image) return null;
  if (image.startsWith("http")) return image;
  const folder = typeof entryOrCover === "string" ? imageFolder(type) : imageFolder(entryOrCover.type);
  return `${IMAGE_ROOT}/${folder}/${image}.png`;
}

function detailUrl(entryOrType, id) {
  const type = typeof entryOrType === "string" ? entryOrType : entryOrType?.type;
  const entryId = encodeURIComponent(id ?? entryOrType?.id);
  switch (type) {
    case "hardware": return `pages/hardware-detail.html?id=${entryId}`;
    case "amiibo": return `pages/amiibo-detail.html?id=${entryId}`;
    case "system": return `pages/system-detail.html?id=${entryId}`;
    case "series": return `pages/series-detail.html?id=${entryId}`;
    case "company": return `pages/company-detail.html?id=${entryId}`;
    case "event": return `pages/event-detail.html?id=${entryId}`;
    case "person": return `pages/person-detail.html?id=${entryId}`;
    case "release_line": return `pages/release-line-detail.html?id=${entryId}`;
    default: return `pages/game-detail.html?id=${entryId}`;
  }
}

async function loadCatalogOnce() {
  if (!catalogPromise) catalogPromise = loadCatalog();
  return catalogPromise;
}

async function loadEntry(id) {
  if (!id) return null;
  if (entryCache[id]) return entryCache[id];
  try {
    const res = await fetch(`${DATA_PATH}${id}.json`);
    if (!res.ok) return null;
    entryCache[id] = await res.json();
    return entryCache[id];
  } catch {
    return null;
  }
}

function hardwareInfo(hw) {
  return hw.hardware ?? hw;
}

function hardwareCategory(hw) {
  return hardwareInfo(hw).category ?? hw.category;
}

function hardwareForm(hw) {
  return hardwareInfo(hw).form ?? hw.form;
}

function isConsoleLike(hw) {
  return ["console", "computer"].includes(hardwareCategory(hw)) || hardwareForm(hw) === "add_on";
}

function compatibleWith(hw) {
  const info = hardwareInfo(hw);
  return info.compatible_with ?? hw.compatible_with ?? [];
}

function primaryFor(hw) {
  const info = hardwareInfo(hw);
  return info.primary_for ?? hw.primary_for ?? [];
}

function compatibleFamilies(hw) {
  const info = hardwareInfo(hw);
  return [
    ...(info.compatible_families ?? []),
    ...compatibleWith(hw),
    ...compatibleWith(hw).map((id) => id.replace(/-system$/, "")),
  ];
}

function primaryFamily(hw) {
  const info = hardwareInfo(hw);
  return info.primary_family ?? hw.id;
}

function ownershipRecords(hw) {
  if (Array.isArray(hw.ownership)) return hw.ownership;
  if (Array.isArray(hw.variants)) return hw.variants;
  if (typeof hw.ownership === "string") return [{ status: hw.ownership }];
  return [];
}

function hasStatus(hw, status) {
  return ownershipRecords(hw).some((record) => record.status === status);
}

function ownedVariants(hw) {
  return (hw.variants ?? []).filter((variant) => variant.status === "owned");
}

function wishlistedVariants(hw) {
  return (hw.variants ?? []).filter((variant) => variant.status === "wishlist");
}

function sortByName(items) {
  return [...items].sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
}

function releaseValue(item) {
  return item?.release ?? "9999-99-99";
}

function sortCardItemsByRelease(items) {
  return [...items].sort((a, b) => {
    const releaseCmp = releaseValue(a.entry).localeCompare(releaseValue(b.entry));
    if (releaseCmp !== 0) return releaseCmp;
    return (a.entry?.name ?? a.name ?? "").localeCompare(b.entry?.name ?? b.name ?? "");
  });
}

function cardItem(node, entry, name) {
  return { node, entry, name };
}

function fallbackName(slug) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

async function findTaxonomyEntry(id, type) {
  if (!id) return null;
  const catalog = await loadCatalogOnce();
  const suffix = type === "company" ? "-company" : type === "series" ? "-series" : type === "system" ? "-system" : type === "event" ? "-event" : "";
  const slug = id.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const candidates = new Set([id, slug, suffix && `${slug}${suffix}`].filter(Boolean));

  return catalog.find((entry) =>
    entry.type === type &&
    (candidates.has(entry.id) || entry.name === id)
  ) ?? null;
}

async function taxonomyLogoCard(id, type, label) {
  if (!id) return null;
  const entry = await findTaxonomyEntry(id, type);
  const name = entry?.name ?? fallbackName(id);
  const logo = entry ? imageUrl(entry) : null;
  const targetId = entry?.id ?? id;
  const children = [
    el("span", { class: "taxonomy-label" }, label),
    logo
      ? el("img", {
        src: logo,
        alt: name,
        loading: "lazy",
        onerror: (event) => {
          event.currentTarget.replaceWith(el("strong", {}, name));
        },
      })
      : el("strong", {}, name),
  ];

  if (!entry && ["event", "person", "release_line"].includes(type)) {
    return el("div", { class: "taxonomy-logo-card" }, children);
  }
  return el("a", { class: "taxonomy-logo-card", href: detailUrl(type, targetId) }, children);
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr + "T00:00:00");
  if (isNaN(date)) return dateStr;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function timeDistance(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr + "T00:00:00");
  if (isNaN(date)) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffMs = today - date;
  const past = diffMs >= 0;
  const earlier = past ? date : today;
  const later = past ? today : date;
  let years = later.getFullYear() - earlier.getFullYear();
  const passedAnniv = later.getMonth() > earlier.getMonth() ||
    (later.getMonth() === earlier.getMonth() && later.getDate() >= earlier.getDate());
  if (!passedAnniv) years--;
  if (years >= 1) return past ? `${years} year${years === 1 ? "" : "s"} ago` : `in ${years} year${years === 1 ? "" : "s"}`;
  let months = (later.getFullYear() - earlier.getFullYear()) * 12 + later.getMonth() - earlier.getMonth();
  if (later.getDate() < earlier.getDate()) months--;
  if (months >= 1) return past ? `${months} month${months === 1 ? "" : "s"} ago` : `in ${months} month${months === 1 ? "" : "s"}`;
  const days = Math.round(Math.abs(diffMs) / 86400000);
  if (days === 0) return "Today";
  return past ? `${days} day${days === 1 ? "" : "s"} ago` : `in ${days} day${days === 1 ? "" : "s"}`;
}

function isAnniversary(dateStr) {
  if (!dateStr) return false;
  const date = new Date(dateStr + "T00:00:00");
  if (isNaN(date)) return false;
  const today = new Date();
  return today.getMonth() === date.getMonth() && today.getDate() === date.getDate();
}

function releaseLine(dateStr) {
  if (!dateStr) return null;
  return [formatDate(dateStr), timeDistance(dateStr)].filter(Boolean).join(" · ") + (isAnniversary(dateStr) ? " 🎂" : "");
}

function iconTip(icon, label) {
  return el("span", { class: "icon-tip", title: label, "aria-label": label }, icon);
}

function accessIcons(formats) {
  const icons = formats
    .map((format) => ACCESS_FORMAT[format])
    .filter(Boolean)
    .map((entry) => iconTip(entry.icon, entry.label));
  if (!icons.length) return null;
  return el("span", { class: "access-icon-tags", "aria-label": "Access formats" }, icons);
}

function ownershipIcons(hw) {
  const statuses = [...new Set(ownershipRecords(hw).map((record) => record.status).filter(Boolean))];
  const icons = statuses
    .map((status) => STATUS_ICON[status])
    .filter(Boolean)
    .map((entry) => iconTip(entry.icon, entry.label));
  return icons.length ? el("span", { class: "access-icon-tags", "aria-label": "Ownership status" }, icons) : null;
}

function entryCard(entry, meta, options = {}) {
  const name = options.name ?? entry?.name ?? fallbackName(options.fallbackId ?? "");
  const cover = options.cover ?? (entry ? imageUrl(entry) : null);
  const href = options.href ?? (entry ? detailUrl(entry) : null);
  const card = el("div", { class: "variant-card shelf-card" }, [
    cover
      ? el("img", { src: cover, alt: name, class: "variant-cover", loading: "lazy" })
      : el("div", { class: "variant-cover placeholder" }, name),
    el("p", { class: "variant-label" }, name),
    meta ? el("p", { class: "variant-event" }, meta) : null,
  ]);
  return href ? el("a", { href, class: "hw-card-link" }, card) : card;
}

function gameCard(game) {
  return cardItem(entryCard(game), game);
}

function variantCard(hw, variant, statusLabel) {
  const cover = imageUrl(variant.cover ?? hw.cover, "hardware");
  return cardItem(entryCard(null, statusLabel, {
    name: variant.name ?? hw.name,
    cover,
    href: detailUrl(hw),
    fallbackId: hw.id,
  }), hw, variant.name ?? hw.name);
}

function hardwareCard(hw, statusLabel) {
  return cardItem(entryCard(hw, statusLabel), hw);
}

async function hardwareReferenceCard(id) {
  const entry = await loadEntry(id);
  if (entry?.type === "hardware") return hardwareCard(entry);

  const system = await findTaxonomyEntry(id, "system");
  if (system) return cardItem(entryCard(system), system);

  return cardItem(entryCard(null, null, {
    name: fallbackName(id),
    fallbackId: id,
  }), null, fallbackName(id));
}

function tabbedShelf(tabs) {
  const visibleTabs = tabs.filter((tab) => tab.items.length);
  if (!visibleTabs.length) return null;

  const wrapper = el("div", { class: "tabbed-shelf" });
  const tabBar = el("div", { class: "tab-bar" });
  const gallery = el("div", { class: "variant-gallery shelf-gallery" });

  function renderTab(index) {
    const tab = visibleTabs[index];
    tabBar.querySelectorAll(".tab-btn").forEach((button, buttonIndex) => {
      button.classList.toggle("active", buttonIndex === index);
    });
    gallery.innerHTML = "";
    const items = tab.preserveOrder ? tab.items : sortCardItemsByRelease(tab.items);
    items.forEach((item) => gallery.appendChild(item.node ?? item));
  }

  visibleTabs.forEach((tab, index) => {
    const button = el("button", { class: `tab-btn${index === 0 ? " active" : ""}`, type: "button" }, tab.label);
    button.addEventListener("click", () => renderTab(index));
    tabBar.appendChild(button);
  });

  wrapper.appendChild(tabBar);
  wrapper.appendChild(gallery);
  renderTab(0);
  return wrapper;
}

function matchesHardwarePlatform(access, hw, options = {}) {
  const ownIds = new Set([hw.id, primaryFamily(hw), hw.system].filter(Boolean));
  const compatIds = new Set(compatibleFamilies(hw));
  if (options.compatible) return compatIds.has(access.platform);
  return ownIds.has(access.platform);
}

function matchesCompatibleGame(access, game, hw) {
  const compatIds = new Set(compatibleFamilies(hw));
  return compatIds.has(access.platform) || compatIds.has(game.system);
}

function firstMatchingAccess(game, predicate) {
  return (game.access ?? []).find(predicate) ?? null;
}

async function buildGamesSection(games, hw) {
  const ownedPhysical = [];
  const ownedDigital = [];
  const compatible = [];
  const injected = [];
  const wishlistPhysical = [];
  const wishlistDigital = [];
  const containedById = new Map();
  const containsIds = hw.contains ?? [];
  const hasContainedList = ["console", "computer"].includes(hardwareCategory(hw)) && containsIds.length > 0;

  for (const game of games) {
    const physicalAccess = firstMatchingAccess(game, (access) =>
      matchesHardwarePlatform(access, hw) && access.status === "owned" && access.format === "physical"
    );
    if (physicalAccess) ownedPhysical.push(gameCard(game));

    const digitalAccess = firstMatchingAccess(game, (access) =>
      matchesHardwarePlatform(access, hw) && access.status === "owned" && access.format === "digital"
    );
    if (digitalAccess) ownedDigital.push(gameCard(game));

    const compatibleAccess = firstMatchingAccess(game, (access) =>
      matchesCompatibleGame(access, game, hw) && access.status === "owned" && access.format === "physical"
    );
    if (compatibleAccess) compatible.push(gameCard(game));

    if (hasContainedList && containsIds.includes(game.id)) {
      containedById.set(game.id, gameCard(game));
    }

    const injectedAccess = firstMatchingAccess(game, (access) =>
      matchesHardwarePlatform(access, hw) && access.status === "owned" && access.format === "injected"
    );
    if (injectedAccess) injected.push(gameCard(game));

    const wishlistPhysicalAccess = firstMatchingAccess(game, (access) =>
      matchesHardwarePlatform(access, hw) && access.status === "wishlist" && access.format === "physical"
    );
    if (wishlistPhysicalAccess) wishlistPhysical.push(gameCard(game));

    const wishlistDigitalAccess = firstMatchingAccess(game, (access) =>
      matchesHardwarePlatform(access, hw) && access.status === "wishlist" && access.format === "digital"
    );
    if (wishlistDigitalAccess) wishlistDigital.push(gameCard(game));
  }

  const contained = [];
  if (hasContainedList) {
    for (const id of containsIds) {
      if (containedById.has(id)) {
        contained.push(containedById.get(id));
        continue;
      }

      const game = await loadEntry(id);
      if (game) contained.push(gameCard(game));
      else contained.push(cardItem(entryCard(null, null, {
        name: fallbackName(id),
        href: `pages/game-detail.html?id=${encodeURIComponent(id)}`,
        fallbackId: id,
      }), null, fallbackName(id)));
    }
  }

  const gamesTabs = tabbedShelf([
    { label: "Physical", items: ownedPhysical },
    { label: "Digital", items: ownedDigital },
    { label: "Compatible", items: compatible },
    { label: "Contained", items: contained, preserveOrder: true },
    { label: "Injected", items: injected },
  ]);

  const wishlistTabs = [
    { label: "Physical", items: wishlistPhysical },
    { label: "Digital", items: wishlistDigital },
  ];

  return {
    games: gamesTabs ? section("Games", gamesTabs) : null,
    wishlistGames: wishlistTabs,
  };
}

function buildPeripheralSections(hardware, hw) {
  const primaryTargetIds = new Set([hw.id, hw.system, primaryFamily(hw)].filter(Boolean));
  const compatibleTargetIds = new Set([hw.id, hw.system].filter(Boolean));
  const primaryItems = hardware.filter((item) =>
    item.id !== hw.id &&
    !isConsoleLike(item) &&
    primaryFor(item).some((id) => primaryTargetIds.has(id))
  );
  const compatibleItems = hardware.filter((item) =>
    item.id !== hw.id &&
    !isConsoleLike(item) &&
    compatibleWith(item).some((id) => compatibleTargetIds.has(id))
  );

  const ownedControllers = [];
  const ownedOthers = [];
  const compatibleControllers = [];
  const compatibleOthers = [];
  const wishlistControllers = [];
  const wishlistAccessories = [];

  for (const item of sortByName(primaryItems)) {
    const category = hardwareCategory(item);
    const owned = hasStatus(item, "owned");
    const wishlisted = hasStatus(item, "wishlist");

    if (owned && category === "controller") {
      const variants = ownedVariants(item);
      if (variants.length) ownedControllers.push(...variants.map((variant) => variantCard(item, variant)));
      else ownedControllers.push(hardwareCard(item));
    } else if (owned) {
      ownedOthers.push(hardwareCard(item));
    }

    if (wishlisted && category === "controller") {
      const variants = wishlistedVariants(item);
      if (variants.length) wishlistControllers.push(...variants.map((variant) => variantCard(item, variant)));
      else wishlistControllers.push(hardwareCard(item));
    } else if (wishlisted && category === "accessory") {
      wishlistAccessories.push(hardwareCard(item));
    }
  }

  for (const item of sortByName(compatibleItems)) {
    const category = hardwareCategory(item);
    if (!hasStatus(item, "owned")) continue;

    if (category === "controller") {
      const variants = ownedVariants(item);
      if (variants.length) compatibleControllers.push(...variants.map((variant) => variantCard(item, variant)));
      else compatibleControllers.push(hardwareCard(item));
    } else {
      compatibleOthers.push(hardwareCard(item));
    }
  }

  const peripheralsTabs = tabbedShelf([
    { label: "Controllers", items: ownedControllers },
    { label: "Others", items: ownedOthers },
    { label: "Compatible Controllers", items: compatibleControllers },
    { label: "Compatible Others", items: compatibleOthers },
  ]);

  const wishlistTabs = [
    { label: "Controllers", items: wishlistControllers },
    { label: "Accessories", items: wishlistAccessories },
  ];

  return {
    peripherals: peripheralsTabs ? section("Peripherals", peripheralsTabs) : null,
    wishlistPeripherals: wishlistTabs,
  };
}

async function buildShelfContext(hw) {
  const companyIds = Array.isArray(hw.companies)
    ? hw.companies
    : [
      ...(hw.companies?.manufacturer ?? []),
      ...(hw.companies?.publisher ?? []),
    ];

  const cards = await Promise.all([
    taxonomyLogoCard(hw.system, "system", "System"),
    taxonomyLogoCard(hw.release_line, "release_line", "Release Line"),
    taxonomyLogoCard(hw.franchise?.series, "series", "Series"),
    taxonomyLogoCard(hw.franchise?.subseries, "series", "Subseries"),
    taxonomyLogoCard(hw.event, "event", "Event"),
    ...(hw.people ?? []).map((personId) => taxonomyLogoCard(personId, "person", "Person")),
    ...companyIds.map((companyId) => taxonomyLogoCard(companyId, "company", "Company")),
  ]);

  return section("Shelf Context", el("div", { class: "taxonomy-logo-grid" }, cards.filter(Boolean)));
}

function buildHero(hw) {
  const info = hardwareInfo(hw);
  const cover = imageUrl(hw);
  const category = HARDWARE_CATEGORY[hardwareCategory(hw)] ?? hardwareCategory(hw);
  const form = HARDWARE_FORM[info.form ?? hw.form] ?? info.form ?? hw.form;
  const era = HARDWARE_ERA[info.era ?? hw.era] ?? info.era ?? hw.era;
  const generation = info.generation ?? hw.generation;
  const formats = hasStatus(hw, "owned") ? ["physical"] : [];

  return el("div", { class: "hero curator-hero-detail" }, [
    cover ? el("img", { src: cover, alt: hw.name, class: "hero-cover" }) : null,
    el("div", { class: "hero-info" }, [
      el("span", { class: "kicker" }, hw.type ?? "Hardware"),
      el("div", { class: "hero-title-row" }, [
        el("h1", {}, hw.name),
        accessIcons(formats) ?? ownershipIcons(hw),
      ]),
      hw.description ? el("p", { class: "hero-summary" }, hw.description) : null,
      el("div", { class: "info-grid hero-facts" }, [
        field("Release", releaseLine(hw.release)),
        field("Category", category),
        field("Form", form),
        field("Era", era),
        field("Generation", generation),
      ]),
    ]),
  ]);
}

function buildVariantsSection(hw) {
  const variants = hw.variants ?? [];
  if (variants.length < 2) return null;
  return section(
    "Variants",
    el("div", { class: "variant-gallery shelf-gallery" },
      variants.map((variant) => {
        const status = STATUS_ICON[variant.status];
        return variantCard(hw, variant, status ? `${status.icon} ${status.label}` : variant.status).node;
      })
    )
  );
}

async function buildSupportSections(hw) {
  if (["console", "computer"].includes(hardwareCategory(hw))) return [];

  const primaryCards = await Promise.all(primaryFor(hw).map(hardwareReferenceCard));
  const compatibleCards = hardwareForm(hw) === "add_on"
    ? []
    : await Promise.all(compatibleWith(hw).map(hardwareReferenceCard));

  return [
    primaryCards.length
      ? section("Primary For", el("div", { class: "variant-gallery shelf-gallery" },
        sortCardItemsByRelease(primaryCards.filter(Boolean)).map((item) => item.node)
      ))
      : null,
    compatibleCards.length
      ? section("Compatible With", el("div", { class: "variant-gallery shelf-gallery" },
        sortCardItemsByRelease(compatibleCards.filter(Boolean)).map((item) => item.node)
      ))
      : null,
  ].filter(Boolean);
}



function buildNotesSection(hw) {
  return section(
    "Notes",
    hw.event ? field("Event", hw.event) : null,
    hw.notes ? el("p", { class: "notes-text" }, hw.notes) : null
  );
}

async function buildPage(hw) {
  const catalog = await loadCatalogOnce();
  const games = sortByName(catalog.filter((entry) => entry.type === "game"));
  const hardware = sortByName(catalog.filter((entry) => entry.type === "hardware"));
  const gameSections = await buildGamesSection(games, hw);
  const peripheralSections = buildPeripheralSections(hardware, hw);
  const wishlistSectionTabs = tabbedShelf([
    ...gameSections.wishlistGames,
    ...peripheralSections.wishlistPeripherals,
  ]);
  const supportSections = await buildSupportSections(hw);

  return [
    buildHero(hw),
    await buildShelfContext(hw),
    buildVariantsSection(hw),
    ...supportSections,
    gameSections.games,
    peripheralSections.peripherals,
    wishlistSectionTabs ? section("Wishlist", wishlistSectionTabs) : null,
    buildNotesSection(hw),
  ].filter(Boolean);
}

document.addEventListener("DOMContentLoaded", async () => {
  const main = document.getElementById("detail");
  const params = new URLSearchParams(window.location.search);
  const targetId = params.get("id");

  if (!targetId) {
    main.innerHTML = "<p class='error'>No hardware ID provided. Use <code>?id=hardware-slug</code>.</p>";
    main.classList.remove("loading");
    return;
  }

  try {
    const hw = await loadEntry(targetId);
    if (!hw) {
      main.innerHTML = `<p class='error'>Hardware <code>${targetId}</code> not found.</p>`;
      main.classList.remove("loading");
      return;
    }

    document.title = `${hw.name} - Hardware Details`;
    main.innerHTML = "";
    main.classList.remove("loading");
    const pageNodes = await buildPage(hw);
    pageNodes.forEach((node) => main.appendChild(node));
  } catch (err) {
    main.innerHTML = `<p class='error'>Failed to load hardware data: ${err.message}</p>`;
    main.classList.remove("loading");
  }
});
