import { DEFAULT_SETTINGS } from "../config/config.js";

export function getSettings() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["app", "features"], (data) => {
      resolve({
        app: data.app || DEFAULT_SETTINGS.app,
        features: data.features || DEFAULT_SETTINGS.features,
      });
    });
  });
}

export function getApp() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["app"], ({ app }) => {
      resolve({
        app: app || DEFAULT_SETTINGS.app,
      });
    });
  });
}

export function getFeatures() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["features"], ({ features }) => {
      resolve({ features: features || DEFAULT_SETTINGS.features });
    });
  });
}

export function updateApp(newApp) {
  chrome.storage.local.get(["app"], ({ app }) => {
    chrome.storage.local.set({
      app: {
        ...app,
        ...newApp,
      },
    });
  });
}

export function setAppEnabled(value) {
  updateApp({ enabled: value });
}

export function updateFeature(feature, updates) {
  chrome.storage.local.get(["features"], ({ features }) => {
    chrome.storage.local.set({
      features: {
        ...features,
        [feature]: {
          ...features?.[feature],
          ...updates,
        },
      },
    });
  });
}

export function toggleFeature(feature) {
  chrome.storage.local.get(["features"], ({ features }) => {
    const current = features?.[feature]?.enabled ?? false;
    updateFeature(feature, { enabled: !current });
  });
}

export function resetSettings() {
  chrome.storage.local.set(DEFAULT_SETTINGS);
}
