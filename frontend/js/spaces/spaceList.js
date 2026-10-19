import { capitalize, el, formatDate } from "../shared/dom.js";

function spaceCard(space, actions) {
  const place = [space.building, space.floor].filter(Boolean).join(", ");
  const by = space.addedBy ? `Added by ${space.addedBy} · ` : "";

  return el(
    "li",
    {},
    el(
      "article",
      { className: "card space-card" },
      el(
        "div",
        { className: "card-header" },
        el("h3", {}, space.name),
        el(
          "div",
          { className: "badges" },
          el(
            "span",
            {
              className: `badge badge-noise-${space.noiseLevel.replace(" ", "-")}`,
            },
            capitalize(space.noiseLevel),
          ),
          el(
            "span",
            { className: "badge" },
            `${capitalize(space.lighting)} light`,
          ),
        ),
      ),
      el("p", { className: "card-meta" }, place),
      el(
        "dl",
        { className: "space-details" },
        el("dt", {}, "Hours"),
        el("dd", {}, space.hours),
        el("dt", {}, "Seats"),
        el("dd", {}, String(space.capacity)),
      ),
      space.features.length > 0 &&
        el(
          "ul",
          { className: "feature-tags", "aria-label": "Features" },
          space.features.map((f) => el("li", {}, f)),
        ),
      space.notes && el("p", { className: "card-body" }, space.notes),
      el(
        "p",
        { className: "card-footnote" },
        `${by}Updated ${formatDate(space.updatedAt)}`,
      ),
      el(
        "div",
        { className: "card-actions" },
        el(
          "button",
          {
            type: "button",
            className: "button button-small button-secondary",
            onclick: () => actions.onEdit(space),
            "aria-label": `Edit: ${space.name}`,
          },
          "Edit",
        ),
        el(
          "button",
          {
            type: "button",
            className: "button button-small button-danger",
            onclick: () => actions.onDelete(space),
            "aria-label": `Delete: ${space.name}`,
          },
          "Delete",
        ),
      ),
    ),
  );
}

export function renderSpaces(list, spaces, actions) {
  if (!spaces.length) {
    list.replaceChildren(
      el("li", { className: "empty" }, "No spaces match these filters."),
    );
    return;
  }
  list.replaceChildren(...spaces.map((s) => spaceCard(s, actions)));
}
