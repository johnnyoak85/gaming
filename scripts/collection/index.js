const DATA_PATHS = {
  games: "./assets/data/games.json",
  hardware: "./assets/data/hardware.json",
  amiibo: "./assets/data/amiibo.json",
};

const SORT_OPTIONS = {
  release: "Release Date",
  name: "Name",
  series: "Series",
};

const MODES_LABEL = {
  solo: "Solo",
  co_op: "Co Op",
  versus: "Versus",
  turn_based: "Turn Based",
  online: "Online",
  party: "Party",
};

const PROGRESS_LABEL = {
  planned: "Planned",
  playing: "Playing",
  paused: "Paused",
  finished: "Finished",
  completed: "Completed",
  dropped: "Dropped",
};

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

const state = {
  games: [],
  hardware: [],
  amiibo: [],
  showOwned: true,
  sortOption: "release",
  filters: {},
  searchQuery: "",
  formatFilter: "physical", // physical | digital | both
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

function isOwned(item) {
  if (item.type === "game") {
    return (item.ownership ?? []).some((o) => !o.wishlist);
  }
  if (item.type === "amiibo") {
    return item.owned !== false;
  }
  // Hardware
  return item.wishlist !== true;
}

function coverUrl(item) {
  const cover = item.cover;
  if (!cover) return null;
  if (cover.startsWith("http")) return cover;
  return `./assets/images/${cover}.png`;
}

function detailUrl(item) {
  const t = item.type;
  if (t === "game") return `detail.html?id=${encodeURIComponent(item.id)}`;
  if (t === "hardware") return `hardware-detail.html?id=${encodeURIComponent(item.id)}`;
  if (t === "amiibo") return `amiibo-detail.html?id=${encodeURIComponent(item.id)}`;
  return "#";
}

function getYear(item) {
  if (!item.release) return null;
  return item.release.slice(0, 4);
}

// ---------------------------------------------------------------------------
// Filter definitions
// ---------------------------------------------------------------------------

// Each filter: { id, label, extract(item) → value(s) to match, appliesTo }
// appliesTo: array of types this filter is relevant for; if item type not in list, filter excludes it.

const FILTER_DEFS = [
  {
    id: "year",
    label: "Year",
    appliesTo: null, // all types
    extract: (item) => getYear(item),
  },
  {
    id: "universe",
    label: "Universe",
    appliesTo: ["game"],
    extract: (item) => item.franchise?.universe || null,
  },
  {
    id: "series",
    label: "Series",
    appliesTo: null,
    extract: (item) => item.franchise?.series || null,
  },
  {
    id: "subseries",
    label: "Subseries",
    appliesTo: null,
    extract: (item) => item.franchise?.subseries || null,
  },
  {
    id: "type",
    label: "Type",
    appliesTo: null,
    extract: (item) => {
      const values = [];
      if (item.type) values.push(item.type.toUpperCase());
      if (item.hardware?.category) values.push(item.hardware.category.toUpperCase());
      if (item.hardware?.form) values.push(item.hardware.form.toUpperCase());
      return values;
    },
  },
  {
    id: "genre",
    label: "Genre",
    appliesTo: ["game"],
    extract: (item) => item.classification?.genres ?? [],
  },
  {
    id: "subgenre",
    label: "Subgenre",
    appliesTo: ["game"],
    extract: (item) => item.classification?.subgenres ?? [],
  },
  {
    id: "theme",
    label: "Theme",
    appliesTo: ["game"],
    extract: (item) => item.classification?.themes ?? [],
  },
  {
    id: "tag",
    label: "Tag",
    appliesTo: ["game"],
    extract: (item) => item.classification?.tags ?? [],
  },
  {
    id: "player_age",
    label: "Player Age",
    appliesTo: ["game"],
    extract: (item) => item.player_age != null ? String(item.player_age) : null,
  },
  {
    id: "players_max",
    label: "Players",
    appliesTo: ["game"],
    extract: (item) => item.playstyle?.players?.max != null ? String(item.playstyle.players.max) : null,
  },
  {
    id: "mode",
    label: "Mode",
    appliesTo: ["game"],
    extract: (item) => (item.playstyle?.modes ?? []).map((m) => MODES_LABEL[m] ?? m),
  },
  {
    id: "company",
    label: "Company",
    appliesTo: ["game", "hardware"],
    extract: (item) => {
      if (item.type === "hardware") return item.company || null;
      return item.companies ?? [];
    },
  },
  {
    id: "progress",
    label: "Progress",
    appliesTo: ["game"],
    extract: (item) => item.progress ? (PROGRESS_LABEL[item.progress] ?? item.progress) : null,
  },
  {
    id: "generation",
    label: "Generation",
    appliesTo: ["hardware"],
    extract: (item) => item.hardware?.generation != null ? String(item.hardware.generation) : null,
  },
  {
    id: "wave",
    label: "Wave",
    appliesTo: ["amiibo"],
    extract: (item) => item.franchise?.wave || null,
  },
  {
    id: "event",
    label: "Event",
    appliesTo: null,
    extract: (item) => item.event || null,
  },
];

// ---------------------------------------------------------------------------
// Filter logic
// ---------------------------------------------------------------------------

function getAllItems() {
  return [...state.games, ...state.hardware, ...state.amiibo];
}

function getOwnedFiltered() {
  const all = getAllItems();
  return all.filter((item) => (state.showOwned ? isOwned(item) : !isOwned(item)));
}

function extractOptions(filterId) {
  const def = FILTER_DEFS.find((f) => f.id === filterId);
  if (!def) return [];

  const items = getOwnedFiltered();
  const values = new Set();

  for (const item of items) {
    if (def.appliesTo && !def.appliesTo.includes(item.type)) continue;
    const val = def.extract(item);
    if (Array.isArray(val)) {
      val.forEach((v) => { if (v) values.add(v); });
    } else if (val) {
      values.add(val);
    }
  }

  return [...values].sort((a, b) => {
    const numA = Number(a);
    const numB = Number(b);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return a.localeCompare(b);
  });
}

function matchesFilter(item, filterId, filterValue) {
  const def = FILTER_DEFS.find((f) => f.id === filterId);
  if (!def) return true;

  // If filter doesn't apply to this type, exclude the item
  if (def.appliesTo && !def.appliesTo.includes(item.type)) return false;

  const val = def.extract(item);
  if (Array.isArray(val)) {
    return val.includes(filterValue);
  }
  return val === filterValue;
}

function getFilteredItems() {
  let items = getOwnedFiltered();

  const activeFilters = Object.entries(state.filters).filter(([, v]) => v);

  if (activeFilters.length) {
    items = items.filter((item) => {
      return activeFilters.every(([filterId, filterValue]) => matchesFilter(item, filterId, filterValue));
    });
  }

  // Search bypasses format filter
  const query = state.searchQuery.trim().toLowerCase();
  if (query) {
    items = items.filter((item) => matchesSearch(item, query));
  } else {
    items = items.filter((item) => matchesFormat(item));
  }

  return items;
}

function matchesFormat(item) {
  const f = state.formatFilter;
  if (f === "both") return true;

  const t = item.type;
  if (t === "game") {
    const formats = (item.ownership ?? [])
      .filter((o) => !o.wishlist)
      .map((o) => o.format);
    return formats.includes(f);
  }
  // Hardware and amiibo are always physical
  return f === "physical";
}

function getSearchableText(item) {
  const parts = [
    item.name,
    item.franchise?.universe,
    item.franchise?.series,
    item.franchise?.subseries,
    item.franchise?.wave,
    item.type,
    item.event,
    item.progress,
    item.company,
    item.hardware?.category,
    item.hardware?.form,
    item.hardware?.generation != null ? String(item.hardware.generation) : null,
    ...(item.classification?.genres ?? []),
    ...(item.classification?.subgenres ?? []),
    ...(item.classification?.themes ?? []),
    ...(item.classification?.tags ?? []),
    ...(item.playstyle?.modes ?? []).map((m) => MODES_LABEL[m] ?? m),
    ...(item.companies ?? []),
    item.player_age != null ? String(item.player_age) : null,
    getYear(item),
  ];
  return parts.filter(Boolean).join(" ").toLowerCase();
}

function matchesSearch(item, query) {
  const text = getSearchableText(item);
  const terms = query.split(/\s+/);
  return terms.every((term) => text.includes(term));
}

// ---------------------------------------------------------------------------
// Sorting
// ---------------------------------------------------------------------------

function sortItems(items) {
  const option = state.sortOption;
  const copy = [...items];

  return copy.sort((a, b) => {
    if (option === "series") {
      const sA = a.franchise?.series ?? "";
      const sB = b.franchise?.series ?? "";
      const cmp = sA.localeCompare(sB);
      if (cmp !== 0) return cmp;
    }

    if (option === "release" || option === "series") {
      const dA = a.release ?? "";
      const dB = b.release ?? "";
      if (dA && dB) {
        const cmp = dA.localeCompare(dB);
        if (cmp !== 0) return cmp;
      } else if (dA) return -1;
      else if (dB) return 1;
    }

    return (a.name ?? "").localeCompare(b.name ?? "");
  });
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

function renderGrid() {
  const container = document.getElementById("card-grid");
  if (!container) return;

  container.classList.remove("visible");

  setTimeout(() => {
    container.innerHTML = "";
    const items = sortItems(getFilteredItems());

    if (!items.length) {
      container.appendChild(el("p", { class: "empty-state" }, "No items match the current filters."));
    } else {
      items.forEach((item) => {
        const cover = coverUrl(item);
        const card = el("a", { href: detailUrl(item), class: "card" }, [
          cover ? el("img", { src: cover, alt: item.name, class: "card-cover" }) : null,
          el("span", { class: "card-name" }, item.name),
        ]);
        container.appendChild(card);
      });
    }

    requestAnimationFrame(() => container.classList.add("visible"));
  }, 200);
}

// ---------------------------------------------------------------------------
// Filter UI
// ---------------------------------------------------------------------------

let filterContainer = null;

function buildFilters() {
  filterContainer = el("div", { class: "filters" });
  rebuildFilterDropdowns();
  return filterContainer;
}

function rebuildFilterDropdowns() {
  filterContainer.innerHTML = "";

  for (const def of FILTER_DEFS) {
    const options = extractOptions(def.id);
    if (!options.length) continue;

    const select = el("select", { "data-filter": def.id, class: "filter-select" });
    select.appendChild(el("option", { value: "" }, def.label));

    for (const opt of options) {
      const option = el("option", { value: opt }, opt);
      if (state.filters[def.id] === opt) option.selected = true;
      select.appendChild(option);
    }

    select.addEventListener("change", () => {
      state.filters[def.id] = select.value || null;
      renderGrid();
    });

    filterContainer.appendChild(select);
  }
}

// ---------------------------------------------------------------------------
// Controls
// ---------------------------------------------------------------------------

function buildControls() {
  const controls = el("div", { class: "controls" });

  const searchInput = el("input", {
    id: "search",
    type: "text",
    placeholder: "Search…",
    class: "search-input",
  });

  let debounceTimer = null;
  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      state.searchQuery = searchInput.value;
      renderGrid();
    }, 250);
  });
  controls.appendChild(searchInput);

  const toggleBtn = el("button", { id: "toggle-owned" }, "Show Wishlist");
  toggleBtn.addEventListener("click", () => {
    state.showOwned = !state.showOwned;
    toggleBtn.textContent = state.showOwned ? "Show Wishlist" : "Show Owned";
    state.filters = {};
    state.searchQuery = "";
    searchInput.value = "";
    rebuildFilterDropdowns();
    renderGrid();
  });
  controls.appendChild(toggleBtn);

  const formatSelect = el("select", { id: "format-filter" });
  for (const [value, label] of Object.entries({ physical: "Physical", digital: "Digital", both: "Both" })) {
    formatSelect.appendChild(el("option", { value }, label));
  }
  formatSelect.value = state.formatFilter;
  formatSelect.addEventListener("change", () => {
    state.formatFilter = formatSelect.value;
    rebuildFilterDropdowns();
    renderGrid();
  });
  controls.appendChild(formatSelect);

  const sortSelect = el("select", { id: "sort-options" });
  for (const [value, label] of Object.entries(SORT_OPTIONS)) {
    sortSelect.appendChild(el("option", { value }, label));
  }
  sortSelect.value = state.sortOption;
  sortSelect.addEventListener("change", () => {
    state.sortOption = sortSelect.value;
    renderGrid();
  });
  controls.appendChild(sortSelect);

  const clearBtn = el("button", { id: "clear-filters" }, "Clear Filters");
  clearBtn.addEventListener("click", () => {
    state.filters = {};
    state.searchQuery = "";
    searchInput.value = "";
    rebuildFilterDropdowns();
    renderGrid();
  });
  controls.appendChild(clearBtn);

  return controls;
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", async () => {
  const main = document.getElementById("collection");

  try {
    const [gamesRes, hardwareRes, amiiboRes] = await Promise.all([
      fetch(DATA_PATHS.games),
      fetch(DATA_PATHS.hardware),
      fetch(DATA_PATHS.amiibo),
    ]);

    state.games = await gamesRes.json();
    state.hardware = await hardwareRes.json();
    state.amiibo = await amiiboRes.json();

    main.innerHTML = "";

    const controls = buildControls();
    const filters = buildFilters();
    const grid = el("div", { id: "card-grid", class: "card-grid" });

    main.appendChild(controls);
    main.appendChild(filters);
    main.appendChild(grid);

    renderGrid();
  } catch (err) {
    main.innerHTML = `<p class="empty-state">Failed to load data: ${err.message}</p>`;
  }
});
