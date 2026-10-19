export function confirmAction(message) {
  const dialog = document.querySelector("#confirm-dialog");
  dialog.querySelector("#confirm-message").textContent = message;
  dialog.returnValue = "";
  dialog.showModal();
  return new Promise((resolve) => {
    dialog.addEventListener(
      "close",
      () => resolve(dialog.returnValue === "confirm"),
      { once: true },
    );
  });
}
