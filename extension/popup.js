const connectBtn = document.getElementById("connectBtn");
const disconnectBtn = document.getElementById("disconnectBtn");
const statusEl = document.getElementById("status");
const statusDot = document.getElementById("statusDot");

connectBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "connect" });
});

disconnectBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "disconnect" });
});

function setButtonForStatus(status) {
  const connectBtnText = connectBtn.querySelector(".btn-text");
  const disconnectBtnText = disconnectBtn.querySelector(".btn-text");

  if (status === "Connected") {
    connectBtn.style.display = "none";
    disconnectBtn.style.display = "flex";
  } else if (status.startsWith("Reconnecting") || status === "Connecting") {
    if (connectBtnText) {
      connectBtnText.textContent =
        status === "Connecting" ? "Connecting..." : "Reconnecting...";
    }
    connectBtn.disabled = true;
    connectBtn.style.display = "flex";
    disconnectBtn.style.display = "none";
  } else {
    if (connectBtnText) {
      connectBtnText.textContent = "Connect";
    }
    connectBtn.disabled = false;
    connectBtn.style.display = "flex";
    disconnectBtn.style.display = "none";
  }
}

function renderStatus(status) {
  let normalized = status === "Disconnected" ? "Disconnected" : status;
  let cssClass = status.toLowerCase();

  // Handle reconnecting status specially
  if (status.startsWith("Reconnecting")) {
    cssClass = "reconnecting";
    normalized = "Reconnecting...";
  } else if (status === "Failed") {
    cssClass = "failed";
    normalized = "Connection failed";
  } else if (status === "Connected") {
    cssClass = "connected";
    normalized = "Connected";
  }

  // Update pill classes
  statusEl.className = `status-pill visually-hidden ${cssClass}`;

  // Update header status dot
  if (statusDot) {
    statusDot.className = `status-dot ${cssClass}`;
    statusDot.setAttribute("title", normalized);
    statusDot.setAttribute("aria-label", normalized);
  }

  // Update status text within the status pill
  const statusText = statusEl.querySelector(".status-text");
  if (statusText) {
    statusText.textContent = normalized;
  }

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

// Add event listeners for secondary action buttons
document.addEventListener("DOMContentLoaded", () => {
  // Test button functionality
  const testBtn = document.querySelector('button[title="Test Connection"]');
  if (testBtn) {
    testBtn.addEventListener("click", testConnection);
  }

  // Logs button functionality
  const logsBtn = document.querySelector('button[title="View Logs"]');
  if (logsBtn) {
    logsBtn.addEventListener("click", viewLogs);
  }

  // Help button functionality
  const helpBtn = document.querySelector(
    'button[title="Help & Documentation"]'
  );
  if (helpBtn) {
    helpBtn.addEventListener("click", showHelp);
  }

  // Footer links functionality
  const docsLink = document.querySelector('a[title="Documentation"]');
  if (docsLink) {
    docsLink.addEventListener("click", (e) => {
      e.preventDefault();
      chrome.tabs.create({
        url: "https://github.com/Rudra78996/mcpX#readme",
        active: true,
      });
    });
  }

  const githubLink = document.querySelector('a[title="GitHub Repository"]');
  if (githubLink) {
    githubLink.addEventListener("click", (e) => {
      e.preventDefault();
      chrome.tabs.create({
        url: "https://github.com/Rudra78996/mcpX",
        active: true,
      });
    });
  }
});

// Test Connection Function
async function testConnection() {
  const testBtn = document.querySelector('button[title="Test Connection"]');
  const testLabel = testBtn.querySelector(".btn-label");
  const originalText = testLabel.textContent;

  // Show testing state
  testLabel.textContent = "Testing...";
  testBtn.disabled = true;

  try {
    // Send test ping to background script
    const startTime = Date.now();
    const response = await new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: "testConnection" }, resolve);
    });
    const responseTime = Date.now() - startTime;

    // Show result
    if (response && response.success) {
      testLabel.textContent = `✓ ${responseTime}ms`;
      setTimeout(() => {
        testLabel.textContent = originalText;
        testBtn.disabled = false;
      }, 2000);
    } else {
      testLabel.textContent = "✗ Failed";
      setTimeout(() => {
        testLabel.textContent = originalText;
        testBtn.disabled = false;
      }, 2000);
    }
  } catch (error) {
    testLabel.textContent = "✗ Error";
    setTimeout(() => {
      testLabel.textContent = originalText;
      testBtn.disabled = false;
    }, 2000);
  }
}

// View Logs Function
function viewLogs() {
  // Open browser console for extension debugging
  if (chrome.tabs) {
    chrome.tabs.create({
      url: "chrome://extensions/?id=" + chrome.runtime.id,
      active: true,
    });
  } else {
    // Fallback: show logs in popup (for testing)
    showLogsOverlay();
  }
}

// Show logs overlay in popup
function showLogsOverlay() {
  // Create logs overlay
  const overlay = document.createElement("div");
  overlay.className = "logs-overlay";
  overlay.innerHTML = `
    <div class="logs-content">
      <div class="logs-header">
        <h3>Connection Logs</h3>
        <button class="close-logs">×</button>
      </div>
      <div class="logs-body">
        <div class="log-entry">
          <span class="log-time">${new Date().toLocaleTimeString()}</span>
          <span class="log-level success">INFO</span>
          <span class="log-message">Extension loaded successfully</span>
        </div>
        <div class="log-entry">
          <span class="log-time">${new Date().toLocaleTimeString()}</span>
          <span class="log-level">${
            statusEl.classList.contains("connected") ? "INFO" : "WARN"
          }</span>
          <span class="log-message">WebSocket ${
            statusEl.classList.contains("connected")
              ? "connected to"
              : "disconnected from"
          } localhost:3000</span>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Close logs when clicking X or overlay
  overlay.querySelector(".close-logs").addEventListener("click", () => {
    document.body.removeChild(overlay);
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      document.body.removeChild(overlay);
    }
  });
}

// Show Help Function
function showHelp() {
  // Open documentation website
  if (chrome.tabs) {
    chrome.tabs.create({
      url: "https://github.com/Rudra78996/mcpX#readme",
      active: true,
    });
  } else {
    // Fallback: show help overlay
    showHelpOverlay();
  }
}

// Show help overlay in popup
function showHelpOverlay() {
  const overlay = document.createElement("div");
  overlay.className = "help-overlay";
  overlay.innerHTML = `
    <div class="help-content">
      <div class="help-header">
        <h3>mcpX Help</h3>
        <button class="close-help">×</button>
      </div>
      <div class="help-body">
        <div class="help-section">
          <h4>🚀 Quick Start</h4>
          <p>1. Click "Connect to Server" to establish WebSocket connection</p>
          <p>2. Server must be running on localhost:3000</p>
          <p>3. Use MCP tools to automate browser actions</p>
        </div>
        <div class="help-section">
          <h4>🔧 Troubleshooting</h4>
          <p>• Ensure server is running: <code>npm start</code></p>
          <p>• Check firewall settings for port 3000</p>
          <p>• Try refreshing the extension</p>
        </div>
        <div class="help-section">
          <h4>📚 Documentation</h4>
          <p><a href="#" class="help-link">GitHub Repository</a></p>
          <p><a href="#" class="help-link">API Documentation</a></p>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Close help when clicking X or overlay
  overlay.querySelector(".close-help").addEventListener("click", () => {
    document.body.removeChild(overlay);
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      document.body.removeChild(overlay);
    }
  });
}
