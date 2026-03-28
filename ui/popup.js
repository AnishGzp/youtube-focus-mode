import { setThemeIcon } from "../utils/icons.js";
import { handleThemeToggle, initTheme } from "../utils/theme.js";

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  updateUI();
  handleThemeToggle();
});

function updateUI() {
  chrome.storage.local.get(["theme"], ({ theme = "system" }) => {
    const finalTheme =
      theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme;

    setThemeIcon(finalTheme, "header_container_right_svg_container");
  });
}
