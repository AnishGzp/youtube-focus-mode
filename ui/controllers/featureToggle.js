import { getFeatures, updateFeature } from "../../utils/storage.js";

const mapping = {
  shortsToggle: "shorts",
  commentsToggle: "comments",
  suggestedVideosToggle: "recommendations",
  sidebarToggle: "sidebar",
  blockShortsToggle: "blockShorts",
};

export function initFeatureToggles() {
  Object.entries(mapping).forEach(([id, feature]) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener("change", () => {
      updateFeature(feature, { enabled: el.checked });
    });
  });
}

export async function loadFeatureStates() {
  const { features } = await getFeatures();

  Object.entries(mapping).forEach(([id, feature]) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.checked = features?.[feature]?.enabled ?? false;
  });
}
