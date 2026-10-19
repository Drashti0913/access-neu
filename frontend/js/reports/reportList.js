import { capitalize, el, formatDate } from "../shared/dom.js";

function reportCard(report, actions) {
  const isOpen = report.status === "open";
  const place = [report.location, report.floor].filter(Boolean).join(", ");
  const by = report.reporterName ? ` by ${report.reporterName}` : "";

  return el(
    "li",
    {},
    el(
      "article",
      { className: "card report-card", dataset: { status: report.status } },
      el(
        "div",
        { className: "card-header" },
        el("h3", {}, report.title),
        el(
          "div",
          { className: "badges" },
          el(
            "span",
            { className: `badge badge-${report.status}` },
            capitalize(report.status),
          ),
          el(
            "span",
            { className: `badge badge-severity-${report.severity}` },
            `${capitalize(report.severity)} severity`,
          ),
        ),
      ),
      el(
        "p",
        { className: "card-meta" },
        `${place} · ${capitalize(report.category)}`,
      ),
      el("p", { className: "card-body" }, report.description),
      el(
        "p",
        { className: "card-footnote" },
        `Reported${by} on ${formatDate(report.createdAt)}`,
        report.resolvedAt ? ` · Resolved ${formatDate(report.resolvedAt)}` : "",
      ),
      el(
        "div",
        { className: "card-actions" },
        isOpen &&
          el(
            "button",
            {
              type: "button",
              className: "button button-small",
              onclick: () => actions.onResolve(report),
              "aria-label": `Mark resolved: ${report.title}`,
            },
            "Mark resolved",
          ),
        el(
          "button",
          {
            type: "button",
            className: "button button-small button-secondary",
            onclick: () => actions.onEdit(report),
            "aria-label": `Edit: ${report.title}`,
          },
          "Edit",
        ),
        el(
          "button",
          {
            type: "button",
            className: "button button-small button-danger",
            onclick: () => actions.onDelete(report),
            "aria-label": `Delete: ${report.title}`,
          },
          "Delete",
        ),
      ),
    ),
  );
}

export function renderReports(list, reports, actions) {
  if (!reports.length) {
    list.replaceChildren(
      el("li", { className: "empty" }, "No reports match these filters."),
    );
    return;
  }
  list.replaceChildren(...reports.map((r) => reportCard(r, actions)));
}
