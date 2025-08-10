const connectBtn = document.getElementById("connectBtn");
const statusEl = document.getElementById("status");

connectBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "connect" });
});

function setButtonForStatus(status) {
  if (status === "Connected") {
    connectBtn.textContent = "Connected";
    connectBtn.disabled = true;
  } else if (status === "Connecting") {
    connectBtn.textContent = "Connecting…";
    connectBtn.disabled = true;
  } else {
    connectBtn.textContent = "Connect";
    connectBtn.disabled = false;
  }
}

function renderStatus(status) {
  const normalized = status === "Disconnected" ? "Not connected" : status;

  // Update pill text
  statusEl.textContent = ""; // clear
  const dot = document.createElement("span");
  dot.className = "status-dot";
  statusEl.appendChild(dot);
  statusEl.appendChild(document.createTextNode(" " + normalized));

  // Update classes
  statusEl.className = `status-pill ${status.toLowerCase()}`;

  // Sync button state
  setButtonForStatus(status);
}

// Initialize status when popup opens
document.addEventListener("DOMContentLoaded", () => {
  chrome.runtime.sendMessage({ action: "getStatus" }, (response) => {
    renderStatus(response?.status || "Disconnected");
  });
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "status") {
    renderStatus(message.status);
  }
});