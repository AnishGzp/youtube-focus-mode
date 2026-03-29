import { getApp, setAppEnabled } from "../../utils/storage.js";

export async function initGlobalToggle() {
  const toggle = document.getElementById("mainToggle");
  if (!toggle) return;

  const { app } = await getApp();

  toggle.checked = app.enabled;

  applyAppState(app.enabled);

  toggle.addEventListener("change", () => {
    const enabled = toggle.checked;

    setAppEnabled(enabled);
    applyAppState(enabled);
    updateStatusText(enabled);
  });
}

function applyAppState(enabled) {
  const featureToggles = document.querySelectorAll(".toggleInput");

  featureToggles.forEach((el) => {
    if (el.id !== "mainToggle") {
      el.disabled = !enabled;
    }
  });

  const container = document.querySelector(".main_container");
  if (container) {
    container.style.opacity = enabled ? 1 : 0.5;
    container.style.pointerEvents = enabled ? "auto" : "none";
  }
}

function updateStatusText(enabled) {
  const text = document.querySelector(".header_footer p");
  if (!text) return;

  text.textContent = enabled
    ? "Active — filtering YouTube"
    : "Paused — YouTube is normal";
}
