import { formToObject } from "./dom.js";
import {
  clearFieldErrors,
  clientErrors,
  showFieldErrors,
} from "./formErrors.js";
import { showNotice } from "./notice.js";

// Shared create/edit behaviour for the report and space forms.
export function setupEditableForm({
  form,
  heading,
  labels,
  save,
  fill,
  onSaved,
}) {
  const submit = form.querySelector('button[type="submit"]');
  const cancel = form.querySelector('button[type="button"]');

  function reset() {
    form.reset();
    form.elements.id.value = "";
    clearFieldErrors(form);
    heading.textContent = labels.createHeading;
    submit.textContent = labels.createButton;
    cancel.hidden = true;
  }

  function startEdit(item) {
    reset();
    fill(form, item);
    form.elements.id.value = item._id;
    heading.textContent = labels.editHeading;
    submit.textContent = "Save changes";
    cancel.hidden = false;
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    form
      .querySelector("input:not([type=hidden]), select, textarea")
      .focus({ preventScroll: true });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const errors = clientErrors(form);
    if (Object.keys(errors).length) {
      showFieldErrors(form, errors);
      return;
    }

    const { id, ...data } = formToObject(form);
    submit.disabled = true;
    try {
      const saved = await save(id, data);
      reset();
      onSaved(saved, Boolean(id));
    } catch (err) {
      if (err.fieldErrors) showFieldErrors(form, err.fieldErrors);
      showNotice(err.message, "error");
    } finally {
      submit.disabled = false;
    }
  });

  cancel.addEventListener("click", reset);

  return { startEdit, reset };
}
