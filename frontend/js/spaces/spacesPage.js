import { getMeta } from "../shared/api.js";
import { confirmAction } from "../shared/confirmDialog.js";
import { capitalize, el, fillSelect, formToObject } from "../shared/dom.js";
import { setupEditableForm } from "../shared/editableForm.js";
import { showNotice } from "../shared/notice.js";
import { renderPagination } from "../shared/pagination.js";
import { renderSpaces } from "./spaceList.js";
import { deleteSpace, listSpaces, saveSpace } from "./spacesApi.js";

const form = document.querySelector("#space-form");
const filtersForm = document.querySelector("#space-filters");
const list = document.querySelector("#space-list");
const summary = document.querySelector("#space-summary");
const pagination = document.querySelector("#space-pagination");

const state = { page: 1, filters: {} };

function fillSpaceForm(target, space) {
  for (const field of [
    "name",
    "building",
    "floor",
    "noiseLevel",
    "lighting",
    "capacity",
    "hours",
    "notes",
    "addedBy",
  ]) {
    target.elements[field].value = space[field] ?? "";
  }
  for (const box of target.querySelectorAll('input[name="features"]')) {
    box.checked = space.features.includes(box.value);
  }
}

function renderFeatureCheckboxes(features) {
  const boxes = features.map((feature) =>
    el(
      "label",
      {},
      el("input", { type: "checkbox", name: "features", value: feature }),
      ` ${capitalize(feature)}`,
    ),
  );
  document.querySelector("#space-features").replaceChildren(...boxes);
}

const editor = setupEditableForm({
  form,
  heading: document.querySelector("#space-form-title"),
  labels: {
    createHeading: "Add a quiet space",
    editHeading: "Edit space",
    createButton: "Add space",
  },
  save: saveSpace,
  fill: fillSpaceForm,
  onSaved: (space, wasEdit) => {
    showNotice(wasEdit ? "Space updated." : `"${space.name}" was added.`);
    if (!wasEdit) state.page = 1;
    loadSpaces();
  },
});

const actions = {
  onEdit: (space) => editor.startEdit(space),
  onDelete: async (space) => {
    const ok = await confirmAction(`Delete "${space.name}" from the guide?`);
    if (!ok) return;
    try {
      await deleteSpace(space._id);
      showNotice("Space deleted.");
      loadSpaces();
    } catch (err) {
      showNotice(err.message, "error");
    }
  },
};

async function loadSpaces() {
  summary.textContent = "Loading spaces...";
  try {
    const data = await listSpaces({ ...state.filters, page: state.page });
    if (data.total && !data.items.length && state.page > 1) {
      state.page -= 1;
      return loadSpaces();
    }
    summary.textContent = `${data.total.toLocaleString()} space${data.total === 1 ? "" : "s"} found.`;
    renderSpaces(list, data.items, actions);
    renderPagination(pagination, data, (page) => {
      state.page = page;
      loadSpaces();
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
  loadSpaces();
});

filtersForm.addEventListener("reset", () => {
  state.filters = {};
  state.page = 1;
  setTimeout(loadSpaces);
});

async function init() {
  const meta = await getMeta();
  fillSelect(form.elements.building, meta.buildings, "Choose a building");
  fillSelect(form.elements.noiseLevel, meta.noiseLevels, "Choose noise level");
  fillSelect(form.elements.lighting, meta.lightingTypes, "Choose lighting");
  renderFeatureCheckboxes(meta.spaceFeatures);
  fillSelect(filtersForm.elements.building, meta.buildings, "All buildings");
  fillSelect(
    filtersForm.elements.noiseLevel,
    meta.noiseLevels,
    "Any noise level",
  );
  fillSelect(filtersForm.elements.lighting, meta.lightingTypes, "Any lighting");
  fillSelect(filtersForm.elements.feature, meta.spaceFeatures, "Any feature");
  await loadSpaces();
}

init().catch((err) => showNotice(err.message, "error"));
