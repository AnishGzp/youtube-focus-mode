// content.js
const STYLE_ID = "yt-shorts-hide-style";

function getHideStyle() {
  return `
    /* Hide the Shorts shelf on homepage */
    ytd-reel-shelf-renderer {
      display: none !important;
    }

    /* Hide any rich item that contains a Shorts link (homepage, search) */
    ytd-rich-item-renderer:has(a[href^="/shorts/"]),
    ytd-video-renderer:has(a[href^="/shorts/"]),
    ytd-grid-video-renderer:has(a[href^="/shorts/"]) {
      display: none !important;
    }

    /* Hide individual reel items (used in some layouts) */
    ytd-reel-item-renderer {
      display: none !important;
    }

    /* Hide any link that points to a Shorts video (catches all) */
    a[href^="/shorts/"] {
      display: none !important;
    }

    /* Hide the "Shorts" link in the sidebar */
    a[title="Shorts"] {
      display: none !important;
    }
  `;
}

function setShortsHidden(hide) {
  const existing = document.getElementById(STYLE_ID);
  if (hide) {
    if (!existing) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = getHideStyle();
      document.head.appendChild(style);
    }
  } else {
    existing?.remove();
  }
}

function redirectShorts() {
  if (location.pathname.startsWith("/shorts")) {
    window.location.replace("/");
  }
}

function init() {
  chrome.storage.local.get("hideShorts", (data) => {
    const hide = data.hideShorts || false;

    setShortsHidden(hide);
    if (hide) {
      redirectShorts();
    }
  });
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggle") {
    setShortsHidden(request.state);
    if (request.state) {
      redirectShorts();
    }
  }
});

// Handle YouTube SPA navigation
let lastUrl = location.href;

setInterval(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    chrome.storage.local.get("hideShorts", (data) => {
      if (data.hideShorts) {
        setShortsHidden(true);
        redirectShorts();
      }
    });
  }
}, 800);

init();
