// ---- featureStyle ----
const featureStyle = {
  shorts: `
    ytd-reel-shelf-renderer { display: none !important; }
    ytd-rich-item-renderer:has(a[href^="/shorts/"]),
    ytd-video-renderer:has(a[href^="/shorts/"]),
    ytd-grid-video-renderer:has(a[href^="/shorts/"]) { display: none !important; }
    ytd-reel-item-renderer { display: none !important; }
    a[href^="/shorts/"] { display: none !important; }
    a[title="Shorts"] { display: none !important; }
  `,
  comments: `ytd-comments { display: none !important; }`,
  recommendations: `#related { display: none !important; }`,
};

// ---- styleEngine ----
const STYLE_PREFIX = "yt-focus-";

function applyStyle(feature, css) {
  const id = STYLE_PREFIX + feature;
  if (document.getElementById(id)) return;

  const style = document.createElement("style");
  style.id = id;
  style.textContent = css;

  document.head.appendChild(style);
}

function removeStyle(feature) {
  document.getElementById(STYLE_PREFIX + feature)?.remove();
}

// ---- features ----
function handleFeature(feature, enabled) {
  const css = featureStyle[feature];
  if (css) {
    enabled ? applyStyle(feature, css) : removeStyle(feature);
  }
}

// ---- storage ----
const DEFAULT_SETTINGS = {
  app: { enabled: false, theme: "system" },
  features: {
    shorts: { enabled: false },
    comments: { enabled: false },
    recommendations: { enabled: false },
    blockShorts: { enabled: false },
  },
};

function getSettingsForContent() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["app", "features"], (data) => {
      resolve({
        app: data.app || DEFAULT_SETTINGS.app,
        features: data.features || DEFAULT_SETTINGS.features,
      });
    });
  });
}

window.__ytFocus = window.__ytFocus || {
  shortsInterval: null,
  currentFeatures: {},
};

function handleShortsRedirect(enabled) {
  if (!enabled) return;

  if (
    location.pathname === "/shorts" ||
    location.pathname.startsWith("/shorts/")
  ) {
    window.location.replace("/");
  }
}

// ---- main ----
async function applyAll() {
  const { app, features } = await getSettingsForContent();

  if (!app.enabled) {
    Object.keys(featureStyle).forEach((feature) => {
      removeStyle(feature);
    });
    if (globalThis.__ytFocus?.shortsInterval) {
      clearInterval(globalThis.__ytFocus.shortsInterval);
      globalThis.__ytFocus.shortsInterval = null;
    }
    return;
  }

  window.__ytFocus.currentFeatures = features;

  Object.entries(features).forEach(([feature, config]) => {
    handleFeature(feature, config.enabled);
  });

  if (window.__ytFocus.shortsInterval) {
    clearInterval(window.__ytFocus.shortsInterval);
    window.__ytFocus.shortsInterval = null;
  }

  if (window.__ytFocus.currentFeatures.blockShorts.enabled) {
    handleShortsRedirect(true);

    window.__ytFocus.shortsInterval = setInterval(() => {
      handleShortsRedirect(true);
    }, 800);
  }
}

applyAll();

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local") applyAll();
});
