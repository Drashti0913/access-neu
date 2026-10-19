export function clearFieldErrors(form) {
  for (const p of form.querySelectorAll("[data-error-for]")) p.textContent = "";
  for (const input of form.querySelectorAll("[aria-invalid]")) {
    input.removeAttribute("aria-invalid");
  }
}

export function showFieldErrors(form, errors) {
  clearFieldErrors(form);
  let first;
  for (const [field, message] of Object.entries(errors)) {
    const slot = form.querySelector(`[data-error-for="${field}"]`);
    if (slot) slot.textContent = message;
    const input = form.elements[field];
    const target = input instanceof RadioNodeList ? input[0] : input;
    if (target) {
      target.setAttribute("aria-invalid", "true");
      first ??= target;
    }
  }
  first?.focus();
}

// Uses the browser's built-in constraint checks (required, minlength...) before calling the API.
export function clientErrors(form) {
  const errors = {};
  for (const input of form.elements) {
    if (input.name && !input.validity.valid && !(input.name in errors)) {
      errors[input.name] = input.validationMessage;
    }
  }
  return errors;
}
