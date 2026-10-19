import {
  BUILDINGS,
  REPORT_CATEGORIES,
  REPORT_SEVERITIES,
  REPORT_STATUSES,
} from "../constants.js";
import { collect, pickFilters, readChoice, readText } from "./helpers.js";

export function validateReport(body = {}) {
  return collect({
    title: readText(body, "title", { label: "Title", min: 5, max: 100 }),
    location: readChoice(body, "location", {
      label: "Location",
      choices: BUILDINGS,
    }),
    floor: readText(body, "floor", {
      label: "Floor",
      max: 30,
      required: false,
    }),
    category: readChoice(body, "category", {
      label: "Category",
      choices: REPORT_CATEGORIES,
    }),
    severity: readChoice(body, "severity", {
      label: "Severity",
      choices: REPORT_SEVERITIES,
    }),
    status: readChoice(body, "status", {
      label: "Status",
      choices: REPORT_STATUSES,
    }),
    description: readText(body, "description", {
      label: "Description",
      min: 10,
      max: 1000,
    }),
    reporterName: readText(body, "reporterName", {
      label: "Your name",
      max: 60,
      required: false,
    }),
  });
}

export function reportFilters(query) {
  return pickFilters(query, {
    location: BUILDINGS,
    category: REPORT_CATEGORIES,
    status: REPORT_STATUSES,
    severity: REPORT_SEVERITIES,
    q: null,
  });
}
