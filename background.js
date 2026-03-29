import { DEFAULT_SETTINGS } from "./config/config.js";

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["app", "features"], (data) => {
    const updated = {
      app: {
        ...DEFAULT_SETTINGS.app,
        ...data.app,
      },
      features: {
        ...DEFAULT_SETTINGS.features,
        ...data.features,
      },
    };

    chrome.storage.local.set(updated);
  });
});
