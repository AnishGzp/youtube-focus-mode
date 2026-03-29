import { setThemeIcon } from "./icons.js";

export function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function resolveTheme(theme) {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return theme;
}

export function initTheme() {
  chrome.storage.local.get(["app"], ({ app }) => {
    const theme = app?.theme ?? "system";

    const finalTheme = resolveTheme(theme);
    setTheme(finalTheme);
  });

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  mediaQuery.addEventListener("change", () => {
    chrome.storage.local.get(["app"], ({ app }) => {
      const theme = app?.theme ?? "system";

      if (theme === "system") {
        const updatedTheme = resolveTheme(theme);
        setTheme(updatedTheme);
      }
    });
  });
}

export function handleThemeToggle() {
  const iconContainer = document.querySelector(
    ".header_container_right_svg_container",
  );

  if (!iconContainer) return;

  iconContainer.addEventListener("click", () => {
    chrome.storage.local.get(["app"], ({ app }) => {
      const theme = app?.theme ?? "system";

      const currentTheme = resolveTheme(theme);

      const newTheme = currentTheme === "dark" ? "light" : "dark";

      const updatedApp = { ...app, theme: newTheme };

      chrome.storage.local.set({ app: updatedApp });

      document.documentElement.setAttribute("data-theme", newTheme);
      setThemeIcon(newTheme, "header_container_right_svg_container");
    });
  });
}
