import { getMeta } from "../shared/api.js";
import { confirmAction } from "../shared/confirmDialog.js";
import { fillSelect, formToObject } from "../shared/dom.js";
import { setupEditableForm } from "../shared/editableForm.js";
import { showNotice } from "../shared/notice.js";
import { renderPagination } from "../shared/pagination.js";
import { renderReports } from "./reportList.js";
import {
  deleteReport,
  listReports,
  resolveReport,
  saveReport,
} from "./reportsApi.js";

const form = document.querySelector("#report-form");
const filtersForm = document.querySelector("#report-filters");
const list = document.querySelector("#report-list");
const summary = document.querySelector("#report-summary");
const pagination = document.querySelector("#report-pagination");

const state = { page: 1, filters: {} };

function fillReportForm(target, report) {
  for (const field of [
    "title",
    "location",
    "floor",
    "category",
    "severity",
    "status",
    "description",
    "reporterName",
  ]) {
    target.elements[field].value = report[field] ?? "";
  }
}

const editor = setupEditableForm({
  form,
  heading: document.querySelector("#report-form-title"),
  labels: {
    createHeading: "Report a barrier",
    editHeading: "Edit report",
    createButton: "Submit report",
  },
  save: saveReport,
  fill: fillReportForm,
  onSaved: (report, wasEdit) => {
    showNotice(wasEdit ? "Report updated." : "Thanks! Your report was added.");
    if (!wasEdit) state.page = 1;
    loadReports();
  },
});

const actions = {
  onEdit: (report) => editor.startEdit(report),
  onResolve: async (report) => {
    try {
      await resolveReport(report);
      showNotice(`"${report.title}" marked resolved.`);
      loadReports();
    } catch (err) {
      showNotice(err.message, "error");
    }
  },
  onDelete: async (report) => {
    const ok = await confirmAction(`Delete the report "${report.title}"?`);
    if (!ok) return;
    try {
      await deleteReport(report._id);
      showNotice("Report deleted.");
      loadReports();
    } catch (err) {
      showNotice(err.message, "error");
    }
  },
};

async function loadReports() {
  summary.textContent = "Loading reports...";
  try {
    const data = await listReports({ ...state.filters, page: state.page });
    if (data.total && !data.items.length && state.page > 1) {
      state.page -= 1;
      return loadReports();
    }
    summary.textContent = `${data.total.toLocaleString()} report${data.total === 1 ? "" : "s"} found.`;
    renderReports(list, data.items, actions);
    renderPagination(pagination, data, (page) => {
      state.page = page;
      loadReports();
      list.scrollIntoView({ behavior: "smooth" });
    });
  } catch (err) {
    summary.textContent = "";
    showNotice(err.message, "error");
  }
}

filtersForm.addEventListener("submit", (event) => {
  event.preventDefault();
  state.filters = formToObject(filtersForm);
  state.page = 1;
  loadReports();
});

filtersForm.addEventListener("reset", () => {
  state.filters = {};
  state.page = 1;
  setTimeout(loadReports);
});

async function init() {
  const meta = await getMeta();
  fillSelect(form.elements.location, meta.buildings, "Choose a building");
  fillSelect(
    form.elements.category,
    meta.reportCategories,
    "Choose a category",
  );
  fillSelect(form.elements.severity, meta.reportSeverities, "Choose severity");
  fillSelect(filtersForm.elements.location, meta.buildings, "All buildings");
  fillSelect(
    filtersForm.elements.category,
    meta.reportCategories,
    "All categories",
  );
  fillSelect(filtersForm.elements.status, meta.reportStatuses, "Any status");
  await loadReports();
}

init().catch((err) => showNotice(err.message, "error"));
