const toggleBtn = document.getElementById("toggleBtn");
const statusDiv = document.getElementById("status");

// Load currrent state from storage and update the UI
chrome.storage.local.get("hideShorts", (data) => {
  const isHidden = data.hideShorts || false;

  updateButton(isHidden);
});

// When button is clicked toggle button and send message to content script
toggleBtn.addEventListener("click", () => {
  chrome.storage.local.get("hideShorts", (data) => {
    const newState = !(data.hideShorts || false);
    chrome.storage.local.set({ hideShorts: newState }, () => {
      updateButton(newState);

      // Send message to content to apply change immediately
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (!tab || !tab.url.includes("youtube.com")) {
          // No youtube -> do nothing (state is already saved)
          return;
        }

        chrome.tabs.sendMessage(
          tab.id,
          { action: "toggle", state: newState },
          () => {
            if (chrome.runtime.lastError) {
              // ignore error (no content script loaded)
              console.log("No reciever:", chrome.runtime.lastError.message);
            }
          },
        );
      });
    });
  });
});

function updateButton(isHidden) {
  if (isHidden) {
    toggleBtn.textContent = "ON";
    toggleBtn.classList.remove("off");
    statusDiv.textContent = "Shorts are hidden";
  } else {
    toggleBtn.textContent = "OFF";
    toggleBtn.classList.add("off");
    statusDiv.textContent = "Shorts are visible";
  }
}
