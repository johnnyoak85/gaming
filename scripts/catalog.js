const SOLO_PATH = "./assets/data/";
const MANIFEST_PATH = "./assets/data/manifest.json";
const CACHE_KEY = "gaming_catalog";
const CACHE_VERSION_KEY = "gaming_catalog_version";

// Version is based on manifest length — changes when entries are added/removed
async function getManifest() {
  const res = await fetch(MANIFEST_PATH);
  return res.json();
}

async function fetchEntry({ id, file }) {
  try {
    const name = file || id;
    const res = await fetch(`${SOLO_PATH}${name}.json`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function getCachedCatalog(manifestLength) {
  try {
    const version = localStorage.getItem(CACHE_VERSION_KEY);
    if (version !== String(manifestLength)) return null;
    const data = localStorage.getItem(CACHE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function cacheCatalog(catalog, manifestLength) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(catalog));
    localStorage.setItem(CACHE_VERSION_KEY, String(manifestLength));
  } catch {
    // localStorage full or unavailable — continue without cache
  }
}

export async function loadCatalog(onProgress) {
  const manifest = await getManifest();

  // Check cache
  const cached = getCachedCatalog(manifest.length);
  if (cached) return cached;

  // Fetch all entries in parallel batches
  const catalog = [];
  const batchSize = 50;
  for (let i = 0; i < manifest.length; i += batchSize) {
    const batch = manifest.slice(i, i + batchSize);
    const results = await Promise.all(batch.map((m) => fetchEntry(m)));
    for (const entry of results) {
      if (entry) catalog.push(entry);
    }
    if (onProgress) onProgress(Math.min(i + batchSize, manifest.length), manifest.length);
  }

  cacheCatalog(catalog, manifest.length);
  return catalog;
}

export function invalidateCache() {
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(CACHE_VERSION_KEY);
}

export function getGames(catalog) {
  return catalog.filter((e) => e.type === "game");
}

export function getHardware(catalog) {
  return catalog.filter((e) => e.type === "hardware");
}

export function getAmiibo(catalog) {
  return catalog.filter((e) => e.type === "amiibo");
}

export function getSystems(catalog) {
  return catalog.filter((e) => e.type === "system");
}

export function getSeries(catalog) {
  return catalog.filter((e) => e.type === "series");
}

export function getCompanies(catalog) {
  return catalog.filter((e) => e.type === "company");
}
