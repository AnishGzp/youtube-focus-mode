import { svgIcons } from "../config/svgIcons.js";

export function setThemeIcon(icon, className) {
  const el = document.querySelector(`.${className}`);
  if (!el) return;
  el.innerHTML = svgIcons[icon];
}
