import { request } from "./shared/api.js";

async function loadCounts() {
  const [reports, spaces] = await Promise.all([
    request("/api/reports?status=open&limit=1"),
    request("/api/spaces?limit=1"),
  ]);
  document.querySelector("#open-report-count").textContent =
    reports.total.toLocaleString();
  document.querySelector("#space-count").textContent =
    spaces.total.toLocaleString();
}

loadCounts().catch((err) => console.error("Could not load counts", err));
