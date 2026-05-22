import { loadCatalog, getGames, getHardware } from "./catalog.js";

const HARDWARE_SOLO_PATH = "./assets/data/";
const GAMES_SOLO_PATH = "./assets/data/";
const IMAGE_BASE = "./images";

// ---------------------------------------------------------------------------
// Enum maps
// ---------------------------------------------------------------------------

const WISHLIST_LEVEL = {
  1: { emoji: "🤍", label: "Low" },
  2: { emoji: "🩷", label: "Medium" },
  3: { emoji: "💛", label: "High" },
  4: { emoji: "🧡", label: "Essential" },
  5: { emoji: "❤️", label: "Non-negotiable" },
};

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

// ---------------------------------------------------------------------------
// Lazy loaders
// ---------------------------------------------------------------------------

let hwCache = {};
let gameCache = {};
let gamesIndex = null;
let hardwareIndex = null;

async function loadHardware(id) {
  if (hwCache[id]) return hwCache[id];
  try {
    const res = await fetch(`${HARDWARE_SOLO_PATH}${id}.json`);
    if (!res.ok) return null;
    hwCache[id] = await res.json();
    return hwCache[id];
  } catch (e) {
    return null;
  }
}

async function loadGame(id) {
  if (gameCache[id]) return gameCache[id];
  try {
    const res = await fetch(`${GAMES_SOLO_PATH}${id}.json`);
    if (!res.ok) return null;
    gameCache[id] = await res.json();
    return gameCache[id];
  } catch (e) {
    return null;
  }
}

async function loadGamesIndex() {
  if (gamesIndex) return gamesIndex;
  const catalog = await loadCatalog();
  gamesIndex = { entries: getGames(catalog) };
  return gamesIndex;
}

async function loadHardwareIndex() {
  if (hardwareIndex) return hardwareIndex;
  const catalog = await loadCatalog();
  hardwareIndex = { entries: getHardware(catalog) };
  return hardwareIndex;
}

// ---------------------------------------------------------------------------
// Render helpers
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

function section(title, ...content) {
  const filtered = content.filter(Boolean);
  if (!filtered.length) return null;
  return el("section", { class: "detail-section" }, [
    el("h2", {}, title),
    ...filtered,
  ]);
}

function chips(items) {
  if (!items?.length) return null;
  return el(
    "div",
    { class: "chips" },
    items.map((t) => {
      if (typeof t === "string") return el("span", { class: "chip" }, t);
      return t;
    })
  );
}

function field(label, value) {
  if (value == null || value === "") return null;
  return el("div", { class: "field" }, [
    el("span", { class: "field-label" }, label),
    el("span", { class: "field-value" }, String(value)),
  ]);
}

function coverUrl(name) {
  if (!name) return null;
  if (name.startsWith("http")) return name;
  return `${IMAGE_BASE}/${name}.png`;
}

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function ordinalSuffix(day) {
  if (day >= 11 && day <= 13) return "th";
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr + "T00:00:00");
  if (isNaN(date)) return dateStr;
  const day = date.getDate();
  return `${day}${ordinalSuffix(day)} of ${MONTHS[date.getMonth()]}, ${date.getFullYear()}`;
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
  const passedAnniv =
    later.getMonth() > earlier.getMonth() ||
    (later.getMonth() === earlier.getMonth() &&
      later.getDate() >= earlier.getDate());
  if (!passedAnniv) years--;

  if (years >= 1) {
    const u = `year${years === 1 ? "" : "s"}`;
    return past ? `${years} ${u} ago` : `in ${years} ${u}`;
  }

  let months =
    (later.getFullYear() - earlier.getFullYear()) * 12 +
    later.getMonth() -
    earlier.getMonth();
  if (later.getDate() < earlier.getDate()) months--;

  if (months >= 1) {
    const u = `month${months === 1 ? "" : "s"}`;
    return past ? `${months} ${u} ago` : `in ${months} ${u}`;
  }

  const days = Math.round(Math.abs(diffMs) / 86400000);
  if (days === 0) return "Today";
  const u = `day${days === 1 ? "" : "s"}`;
  return past ? `${days} ${u} ago` : `in ${days} ${u}`;
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
  const formatted = formatDate(dateStr);
  const ago = timeDistance(dateStr);
  const cake = isAnniversary(dateStr) ? " 🎂" : "";
  const parts = [formatted];
  if (ago) parts.push(ago);
  return parts.join(" · ") + cake;
}

// ---------------------------------------------------------------------------
// Games section with toggle
// ---------------------------------------------------------------------------

function findInjectedGamesForHardware(games, hwId, hwName) {
  const familyIds = getFamilyIds(hwId);

  return games.filter((game) =>
    (game.ownership ?? []).some((o) => {
      if (!o.platform || o.format !== "injection") return false;
      return platformMatchesHardware(o.platform, hwId, hwName) || familyIds.includes(o.platform);
    })
  );
}

function buildInjectedSection(games, hw) {
  const injected = findInjectedGamesForHardware(games, hw.id, hw.name);
  if (!injected.length) return null;

  const sectionEl = el("section", { class: "detail-section" });
  sectionEl.appendChild(el("h2", {}, "Injected"));

  const gallery = el("div", { class: "variant-gallery" });
  injected
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((g) => {
      const img = g.cover ?? null;
      const card = el("a", { href: `detail.html?id=${encodeURIComponent(g.id)}`, class: "hw-card-link" },
        el("div", { class: "variant-card" }, [
          img ? el("img", { src: img, alt: g.name, class: "variant-cover" }) : null,
          el("p", { class: "variant-label" }, g.name),
        ])
      );
      gallery.appendChild(card);
    });

  sectionEl.appendChild(gallery);
  return sectionEl;
}

function buildGamesSection(games, hw) {
  let showWishlist = false;

  const ownedGames = findGamesForHardware(games, hw.id, hw.name, false);
  const wishlistGames = findGamesForHardware(games, hw.id, hw.name, true);

  if (!ownedGames.length && !wishlistGames.length) return null;

  const sectionEl = el("section", { class: "detail-section" });

  const titleRow = el("div", { class: "section-title-row" });
  const title = el("h2", {}, "Games");
  titleRow.appendChild(title);

  const toggleBtn = wishlistGames.length
    ? el("button", { class: "games-toggle-btn" }, "Show Wishlist")
    : null;

  if (toggleBtn) titleRow.appendChild(toggleBtn);
  sectionEl.appendChild(titleRow);

  const gallery = el("div", { class: "variant-gallery" });
  sectionEl.appendChild(gallery);

  function renderGamesList() {
    gallery.innerHTML = "";
    const list = showWishlist ? wishlistGames : ownedGames;

    if (!list.length) {
      gallery.appendChild(el("p", { class: "empty-hint" }, showWishlist ? "No wishlisted games." : "No owned games."));
      return;
    }

    list
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((g) => {
        const img = g.cover ?? null;
        const card = el("a", { href: `detail.html?id=${encodeURIComponent(g.id)}`, class: "hw-card-link" },
          el("div", { class: "variant-card" }, [
            img
              ? el("img", { src: img, alt: g.name, class: "variant-cover" })
              : null,
            el("p", { class: "variant-label" }, g.name),
          ])
        );
        gallery.appendChild(card);
      });
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      showWishlist = !showWishlist;
      toggleBtn.textContent = showWishlist ? "Show Owned" : "Show Wishlist";
      renderGamesList();
    });
  }

  renderGamesList();
  return sectionEl;
}

// ---------------------------------------------------------------------------
// Page builder
// ---------------------------------------------------------------------------

async function buildPage(hw) {
  const mainCover = coverUrl(hw.cover);
  const hwInfo = hw.hardware ?? {};

  const categoryLabel = HARDWARE_CATEGORY[hwInfo.category] ?? hwInfo.category;
  const formLabel = HARDWARE_FORM[hwInfo.form] ?? hwInfo.form;
  const typeLine = [categoryLabel, formLabel].filter(Boolean).join(" · ");

  // Determine variant display for the hero
  const variants = hw.variants ?? [];
  const singleVariant = variants.length === 1 ? variants[0] : null;
  const singleVariantName = singleVariant?.name ?? null;

  const leftCol = el("div", { class: "hero-col" }, [
    hw.release
      ? el("p", { class: "release-date" }, releaseLine(hw.release))
      : null,
    hw.franchise?.series
      ? el("p", { class: "hero-detail" }, [
        hw.franchise.series,
        hw.franchise.subseries ? ` · ${hw.franchise.subseries}` : "",
      ])
      : null,
    typeLine ? el("p", { class: "hero-detail" }, typeLine) : null,
    hw.event
      ? el("p", { class: "hero-detail hero-event" }, `Part of ${hw.event}`)
      : null,
    singleVariantName
      ? el("p", { class: "hero-detail" }, `Variant: ${singleVariantName}`)
      : null,
  ]);

  const rightCol = el("div", { class: "hero-col" }, [
    hw.companies?.publisher?.length || hw.companies?.manufacturer?.length
      ? el("p", { class: "hero-detail" }, [
        ...(hw.companies?.publisher ?? []),
        ...(hw.companies?.manufacturer ?? [])
      ].filter(Boolean).join(" · "))
      : null,
  ]);

  const ownership = hw.ownership ?? [];
  const isWishlist = ownership.some((o) => o.status === 'wishlist');
  const wishlistLevel = isWishlist ? (hw.acquisition?.priority ?? 1) : null;
  const wlInfo = wishlistLevel != null ? WISHLIST_LEVEL[wishlistLevel] : null;

  const ownershipEmoji = wlInfo ? wlInfo.emoji : "🏷️";
  const ownershipTip = wlInfo ? `Wishlist: ${wlInfo.label}` : "Owned";

  const hero = el("div", { class: "hero" }, [
    mainCover
      ? el("img", { src: mainCover, alt: `${hw.name}`, class: "hero-cover" })
      : null,
    el("div", { class: "hero-info" }, [
      el("div", { class: "hero-title-row" }, [
        el("h1", {}, hw.name),
        el("span", { class: isWishlist ? "ownership-icon wishlist-icon" : "ownership-icon owned-icon", title: ownershipTip }, ownershipEmoji),
      ]),
      el("div", { class: "hero-grid" }, [leftCol, rightCol]),
    ]),
  ]);

  // Reusable hardware card gallery
  function hwCardGallery(items) {
    return el(
      "div",
      { class: "variant-gallery" },
      items.map((item) => {
        const img = coverUrl(item.cover);
        return el("a", { href: `hardware-detail.html?id=${encodeURIComponent(item.id)}`, class: "hw-card-link" },
          el("div", { class: "variant-card" }, [
            img
              ? el("img", { src: img, alt: item.name, class: "variant-cover" })
              : null,
            el("p", { class: "variant-label" }, item.name),
          ])
        );
      })
    );
  }

  // Compatible with (controller/accessory → consoles) - async load
  let compatWithSection = null;
  const compatWith = hwInfo.compatible_with ?? [];
  if (compatWith.length > 0) {
    const compatWithItems = [];
    for (const id of compatWith) {
      const item = await loadHardware(id);
      if (item) compatWithItems.push(item);
    }
    if (compatWithItems.length) {
      compatWithSection = section("Compatible With", hwCardGallery(compatWithItems));
    }
  }

  // Compatible controllers - async load
  let controllersSection = null;
  const hwIndexData = await loadHardwareIndex();
  if (hwIndexData?.entries) {
    const compatControllers = hwIndexData.entries.filter((other) =>
      other.id !== hw.id &&
      (other.hardware?.compatible_with ?? []).includes(hw.id)
    );
    if (compatControllers.length > 0) {
      const controllerItems = [];
      for (const item of compatControllers) {
        const full = await loadHardware(item.id);
        if (full) controllerItems.push(full);
      }
      if (controllerItems.length) {
        controllersSection = section("Compatible Controllers", hwCardGallery(controllerItems));
      }
    }
  }

  // Variants gallery — only shown when there are 2+ variants
  const variantSection = variants.length >= 2
    ? section(
      "Variants",
      el(
        "div",
        { class: "variant-gallery" },
        variants.map((v) => {
          const img = coverUrl(v.cover ?? hw.cover);
          return el("div", { class: "variant-card" }, [
            img
              ? el("img", { src: img, alt: v.name ?? hw.name, class: "variant-cover" })
              : null,
            v.name
              ? el("p", { class: "variant-label" }, v.name)
              : null,
          ]);
        })
      )
    )
    : null;

  // Games section - load games matching primary_family
  let gamesSection = null;
  let injectedSection = null;
  const gamesIndexData = await loadGamesIndex();
  if (gamesIndexData?.entries) {
    const primaryFamily = hwInfo.primary_family ?? hw.id;
    const compatFamilies = hwInfo.compatible_families ?? [];

    const matchesPrimary = (a) => a.platform === primaryFamily;
    const matchesCompat = (a) => compatFamilies.includes(a.platform);

    const isRegularGame = (a) => a.format !== 'contained' && a.format !== 'injected';

    const ownedGames = gamesIndexData.entries.filter((g) =>
      g.access?.some((a) => matchesPrimary(a) && a.status === 'owned' && isRegularGame(a))
    );
    const wishlistGames = gamesIndexData.entries.filter((g) =>
      g.access?.some((a) => matchesPrimary(a) && a.status === 'wishlist' && isRegularGame(a))
    );
    const compatOwnedGames = compatFamilies.length ? gamesIndexData.entries.filter((g) =>
      g.access?.some((a) => matchesCompat(a) && a.status === 'owned' && isRegularGame(a))
    ) : [];
    const compatWishlistGames = compatFamilies.length ? gamesIndexData.entries.filter((g) =>
      g.access?.some((a) => matchesCompat(a) && a.status === 'wishlist' && isRegularGame(a))
    ) : [];
    const injectedGames = gamesIndexData.entries.filter((g) =>
      g.access?.some((a) => matchesPrimary(a) && a.format === 'injected' && a.status === 'owned')
    );

    const hasGames = ownedGames.length || wishlistGames.length || compatOwnedGames.length || compatWishlistGames.length;
    if (hasGames) {
      let showWishlist = false;
      let showCompat = false;
      const sectionEl = el("section", { class: "detail-section" });

      const titleRow = el("div", { class: "section-title-row" });
      const title = el("h2", {}, "Games");
      titleRow.appendChild(title);

      const toggleBtn = (wishlistGames.length || compatWishlistGames.length)
        ? el("button", { class: "games-toggle-btn" }, "Show Wishlist")
        : null;

      const compatBtn = compatFamilies.length
        ? el("button", { class: "games-toggle-btn" }, "Show Compatible")
        : null;

      if (toggleBtn) titleRow.appendChild(toggleBtn);
      if (compatBtn) titleRow.appendChild(compatBtn);
      sectionEl.appendChild(titleRow);

      const gallery = el("div", { class: "variant-gallery" });
      sectionEl.appendChild(gallery);

      function renderGamesList() {
        gallery.innerHTML = "";
        let list;
        if (showCompat) {
          list = showWishlist ? compatWishlistGames : compatOwnedGames;
        } else {
          list = showWishlist ? wishlistGames : ownedGames;
        }

        if (!list.length) {
          const msg = showCompat
            ? (showWishlist ? "No compatible wishlisted games." : "No compatible owned games.")
            : (showWishlist ? "No wishlisted games." : "No owned games.");
          gallery.appendChild(el("p", { class: "empty-hint" }, msg));
          return;
        }

        list
          .sort((a, b) => a.name.localeCompare(b.name))
          .forEach((g) => {
            const img = g.cover ?? null;
            const card = el("a", { href: `detail.html?id=${encodeURIComponent(g.id)}`, class: "hw-card-link" },
              el("div", { class: "variant-card" }, [
                img
                  ? el("img", { src: img, alt: g.name, class: "variant-cover" })
                  : null,
                el("p", { class: "variant-label" }, g.name),
              ])
            );
            gallery.appendChild(card);
          });
      }

      if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
          showWishlist = !showWishlist;
          toggleBtn.textContent = showWishlist ? "Show Owned" : "Show Wishlist";
          renderGamesList();
        });
      }

      if (compatBtn) {
        compatBtn.addEventListener("click", () => {
          showCompat = !showCompat;
          compatBtn.textContent = showCompat ? "Show Primary" : "Show Compatible";
          renderGamesList();
        });
      }

      renderGamesList();
      gamesSection = sectionEl;
    }

    // Injected games section
    if (injectedGames.length) {
      injectedSection = section(
        "Injected Games",
        el("div", { class: "variant-gallery" },
          injectedGames
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((g) => {
              const img = g.cover ?? null;
              return el("a", { href: `detail.html?id=${encodeURIComponent(g.id)}`, class: "hw-card-link" },
                el("div", { class: "variant-card" }, [
                  img
                    ? el("img", { src: img, alt: g.name, class: "variant-cover" })
                    : null,
                  el("p", { class: "variant-label" }, g.name),
                ])
              );
            })
        )
      );
    }
  }

  const notesSection = hw.notes
    ? section("Notes", el("p", { class: "notes-text" }, hw.notes))
    : null;

  // Era section - other consoles from the same era
  let eraSection = null;
  const era = hwInfo.era;
  if (era && hwInfo.category === 'console') {
    if (hwIndexData?.entries) {
      const eraMates = hwIndexData.entries.filter((other) =>
        other.id !== hw.id
        && other.hardware?.era === era
        && other.hardware?.category === 'console'
      );
      if (eraMates.length > 0) {
        const eraMateItems = [];
        for (const item of eraMates) {
          const full = await loadHardware(item.id);
          if (full) eraMateItems.push(full);
        }
        if (eraMateItems.length) {
          const eraLabel = HARDWARE_ERA[era] ?? era;
          eraSection = section(
            `${eraLabel} Era`,
            hwCardGallery(eraMateItems)
          );
        }
      }
    }
  }

  return [hero, variantSection, compatWithSection, controllersSection, gamesSection, injectedSection, eraSection, notesSection].filter(Boolean);
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

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
    // Load single hardware entry instead of entire array
    const hwRes = await fetch(`${HARDWARE_SOLO_PATH}${targetId}.json`);
    if (!hwRes.ok) {
      main.innerHTML = `<p class='error'>Hardware <code>${targetId}</code> not found.</p>`;
      main.classList.remove("loading");
      return;
    }

    const hw = await hwRes.json();

    document.title = `${hw.name} — Hardware Details`;
    main.innerHTML = "";
    main.classList.remove("loading");
    const pageNodes = await buildPage(hw);
    pageNodes.forEach((node) => main.appendChild(node));
  } catch (err) {
    main.innerHTML = `<p class='error'>Failed to load hardware data: ${err.message}</p>`;
    main.classList.remove("loading");
  }
});
