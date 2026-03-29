import { setThemeIcon } from "../utils/icons.js";
import { handleThemeToggle, initTheme, resolveTheme } from "../utils/theme.js";
import {
  initFeatureToggles,
  loadFeatureStates,
} from "./controllers/featureToggle.js";
import { initGlobalToggle } from "./controllers/globalToggle.js";

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  updateUI();
  handleThemeToggle();
  initGlobalToggle();
  initFeatureToggles();
  loadFeatureStates();
});

function updateUI() {
  chrome.storage.local.get(["app"], ({ app }) => {
    const theme = app?.theme ?? "system";

    const finalTheme = resolveTheme(theme);

    setThemeIcon(finalTheme, "header_container_right_svg_container");
  });
}
