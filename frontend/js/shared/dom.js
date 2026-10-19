// Small helper for building elements without innerHTML, so user text is never parsed as HTML.
export function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null || value === false) continue;
    if (key === "className") node.className = value;
    else if (key === "dataset") Object.assign(node.dataset, value);
    else if (key.startsWith("on")) node.addEventListener(key.slice(2), value);
    else node.setAttribute(key, value === true ? "" : value);
  }
  node.append(
    ...children
      .flat()
      .filter((c) => c !== null && c !== undefined && c !== false && c !== ""),
  );
  return node;
}

export function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function fillSelect(select, values, placeholder) {
  const options = values.map((v) => el("option", { value: v }, capitalize(v)));
  if (placeholder) options.unshift(el("option", { value: "" }, placeholder));
  select.replaceChildren(...options);
}

export function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formToObject(form) {
  const data = {};
  for (const [key, value] of new FormData(form)) {
    if (key in data) {
      data[key] = [].concat(data[key], value);
    } else {
      data[key] = value;
    }
  }
  return data;
}
