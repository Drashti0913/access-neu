import { el } from "./dom.js";

export function renderPagination(container, { page, limit, total }, onChange) {
  const pages = Math.max(1, Math.ceil(total / limit));
  if (pages === 1) {
    container.replaceChildren();
    return;
  }

  const prev = el(
    "button",
    {
      type: "button",
      className: "button button-secondary",
      disabled: page <= 1,
      onclick: () => onChange(page - 1),
    },
    "Previous",
  );
  const next = el(
    "button",
    {
      type: "button",
      className: "button button-secondary",
      disabled: page >= pages,
      onclick: () => onChange(page + 1),
    },
    "Next",
  );
  const label = el(
    "span",
    { className: "page-label" },
    `Page ${page} of ${pages}`,
  );
  container.replaceChildren(prev, label, next);
}
