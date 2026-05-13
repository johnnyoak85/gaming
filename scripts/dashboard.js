import { loadCatalog } from "./catalog.js";

document.addEventListener("DOMContentLoaded", async () => {
  const status = document.getElementById("index-status");

  try {
    status.textContent = "Loading catalog…";
    await loadCatalog((loaded, total) => {
      status.textContent = `Indexing… ${loaded}/${total}`;
    });
    status.textContent = "✓ Catalog ready";
    setTimeout(() => { status.textContent = ""; }, 2000);
  } catch (err) {
    status.textContent = `Failed to index: ${err.message}`;
  }
});
