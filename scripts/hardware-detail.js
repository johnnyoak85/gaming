const DATA_PATH = "./data/hardware.json";
const GAMES_PATH = "./data/games.json";
const IMAGE_BASE = "./images";

// ---------------------------------------------------------------------------
// Enum maps
// ---------------------------------------------------------------------------

const HARDWARE_CATEGORY = {
  console: "Console",
  controller: "Controller",
  accessory: "Accessory",
  computer: "Computer",
};

const HARDWARE_FORM = {
  home: "Home",
  handheld: "Handheld",
  hybrid: "Hybrid",
  dedicated: "Dedicated",
  controller: "Controller",
  accessory: "Accessory",
};

// ---------------------------------------------------------------------------
// Data helpers
// ---------------------------------------------------------------------------

let allHardware = [];

function getHardwareName(id) {
  const hw = allHardware.find((h) => h.id === id);
  return hw?.name ?? id;
}

function platformMatchesHardware(platform, hwId, hwName) {
  return platform === hwId
    || platform === hwName
    || platform.endsWith(hwName);
}

function getFamilyIds(hwId) {
  const hw = allHardware.find((h) => h.id === hwId);
  const family = hw?.hardware?.family;
  // Collect IDs: either this hw belongs to a family, or other hw point to this one as their family
  const ids = new Set([hwId]);

  if (family) {
    ids.add(family);
    allHardware.forEach((h) => {
      if (h.hardware?.family === family) ids.add(h.id);
    });
  }

  // Also include hardware that lists this hwId as their family
  allHardware.forEach((h) => {
    if (h.hardware?.family === hwId) ids.add(h.id);
  });

  return [...ids];
}

function findGamesForHardware(games, hwId, hwName, wishlist = false) {
  const familyIds = getFamilyIds(hwId);
  const hw = allHardware.find((h) => h.id === hwId);
  const isMain = hw?.main === true;
  const family = hw?.hardware?.family;
  // Check if another family member is the main one
  const familyHasMain = family
    ? allHardware.some((h) => h.hardware?.family === family && h.main === true)
    : allHardware.some((h) => h.hardware?.family === hwId && h.main === true);

  return games.filter((game) =>
    (game.ownership ?? []).some((o) => {
      if (!o.platform) return false;
      if (o.format === "injection") return false;
      if (wishlist ? o.wishlist !== true : o.wishlist) return false;
      if (!platformMatchesHardware(o.platform, hwId, hwName) && !familyIds.includes(o.platform)) return false;

      // For digital games in a family with a main console, only show on main
      if (o.format === "digital" && familyHasMain && !isMain) return false;

      return true;
    })
  );
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

function buildPage(hw, games) {
  const mainCover = coverUrl(hw.cover);
  const hwInfo = hw.hardware ?? {};

  const categoryLabel = HARDWARE_CATEGORY[hwInfo.category] ?? hwInfo.category;
  const formLabel = HARDWARE_FORM[hwInfo.form] ?? hwInfo.form;
  const typeLine = [categoryLabel, formLabel].filter(Boolean).join(" · ");

  const isWishlist = hw.wishlist === true;

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
    hw.company ? el("p", { class: "hero-detail" }, hw.company) : null,
  ]);

  const ownershipIcon = isWishlist ? "⭐" : "✓";

  const hero = el("div", { class: "hero" }, [
    mainCover
      ? el("img", { src: mainCover, alt: `${hw.name}`, class: "hero-cover" })
      : null,
    el("div", { class: "hero-info" }, [
      el("div", { class: "hero-title-row" }, [
        el("h1", {}, hw.name),
        el("span", { class: isWishlist ? "ownership-icon wishlist-icon" : "ownership-icon owned-icon" }, ownershipIcon),
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

  // Compatible with (controller/accessory → consoles)
  const compatWith = hwInfo.compatible_with ?? [];
  const compatWithItems = compatWith
    .map((id) => allHardware.find((h) => h.id === id))
    .filter(Boolean);
  const compatWithSection = compatWithItems.length
    ? section("Compatible With", hwCardGallery(compatWithItems))
    : null;

  // Compatible controllers (console → controllers that list this console)
  const compatControllers = allHardware.filter((other) =>
    (other.hardware?.compatible_with ?? []).includes(hw.id)
  );
  const controllersSection = compatControllers.length
    ? section("Compatible Controllers", hwCardGallery(compatControllers))
    : null;

  // Variants gallery — only shown when there are 2+ variants
  const variantSection = variants.length >= 2
    ? section(
      "Variants",
      el(
        "div",
        { class: "variant-gallery" },
        variants.map((v) => {
          const img = coverUrl(v.cover);
          const vWishlist = v.wishlist === true;
          const vIcon = vWishlist ? "⭐" : "✓";
          const vIconClass = vWishlist ? "variant-icon wishlist-icon" : "variant-icon owned-icon";
          return el("div", { class: "variant-card" }, [
            el("span", { class: vIconClass }, vIcon),
            img
              ? el("img", { src: img, alt: v.name ?? hw.name, class: "variant-cover" })
              : null,
            v.name
              ? el("p", { class: "variant-label" }, v.name)
              : null,
            v.event
              ? el("p", { class: "variant-event" }, v.event)
              : null,
          ]);
        })
      )
    )
    : null;

  // Games available on this hardware (with owned/wishlist toggle)
  const gamesSection = buildGamesSection(games, hw);

  // Games injected into this hardware
  const injectedSection = buildInjectedSection(games, hw);

  const notesSection = hw.notes
    ? section("Notes", el("p", { class: "notes-text" }, hw.notes))
    : null;

  // Generation section — other hardware in the same generation
  const generation = hwInfo.generation;
  const genMates = generation != null
    ? allHardware.filter((other) =>
      other.id !== hw.id
      && other.hardware?.generation === generation
      && other.hardware?.category === 'console'
    )
    : [];
  const generationSection = genMates.length
    ? section(
      `Generation ${generation}`,
      hwCardGallery(genMates)
    )
    : null;

  return [hero, variantSection, compatWithSection, controllersSection, gamesSection, injectedSection, generationSection, notesSection].filter(Boolean);
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
    const [hwRes, gamesRes] = await Promise.all([
      fetch(DATA_PATH),
      fetch(GAMES_PATH),
    ]);
    const items = (await hwRes.json()).flat();
    allHardware = items;
    const games = await gamesRes.json();
    const hw = items.find((h) => h.id === targetId);

    if (!hw) {
      main.innerHTML = `<p class='error'>Hardware <code>${targetId}</code> not found.</p>`;
      main.classList.remove("loading");
      return;
    }

    document.title = `${hw.name} — Hardware Details`;
    main.innerHTML = "";
    main.classList.remove("loading");
    buildPage(hw, games).forEach((node) => main.appendChild(node));
  } catch (err) {
    main.innerHTML = `<p class='error'>Failed to load hardware data: ${err.message}</p>`;
    main.classList.remove("loading");
  }
});
