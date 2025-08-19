const INTERACTIVE_ROLES = [
  "button",
  "link",
  "textbox",
  "checkbox",
  "combobox",
  "radio",
  "slider",
  "switch",
  "menuitem",
  "tab",
  "listbox",
  "option",
  "searchbox",
  "textarea",
  "progressbar",
  "spinbutton",
];

let socket = null;
let connectionStatus = "Disconnected";
let reconnectAttempts = 0;
let maxReconnectAttempts = 10;
let reconnectDelay = 1000; // Start with 1 second
let heartbeatInterval = null;
let isManualDisconnect = false;

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "connect") {
    if (socket && socket.readyState === WebSocket.OPEN) {
      updatePopupStatus("Connected");
    } else {
      connectToServer();
    }
  }

  if (message.action === "disconnect") {
    disconnect();
  }

  if (message.action === "getStatus") {
    sendResponse({ status: getComputedStatus() });
  }

  if (message.action === "testConnection") {
    testConnection().then((result) => {
      sendResponse(result);
    });
    return true; // Keep message channel open for async response
  }
});

// Test connection function
async function testConnection() {
  try {
    // Test WebSocket connection
    if (socket && socket.readyState === WebSocket.OPEN) {
      // Send ping message to test actual connectivity
      const testMessage = {
        id: "test-" + Date.now(),
        type: "ping",
        timestamp: Date.now(),
      };

      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          resolve({ success: false, error: "Timeout" });
        }, 5000);

        const messageHandler = (event) => {
          try {
            const response = JSON.parse(event.data);
            if (response.type === "pong" && response.id === testMessage.id) {
              clearTimeout(timeout);
              socket.removeEventListener("message", messageHandler);
              resolve({
                success: true,
                responseTime: Date.now() - testMessage.timestamp,
              });
            }
          } catch (e) {
            // Ignore parsing errors for other messages
          }
        };

        socket.addEventListener("message", messageHandler);
        socket.send(JSON.stringify(testMessage));
      });
    } else {
      // Test server connectivity without WebSocket
      const isServerReachable = await testServerConnectivity();
      return {
        success: isServerReachable,
        error: isServerReachable
          ? "WebSocket not connected"
          : "Server unreachable",
      };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function testServerConnectivity() {
  try {
    const response = await fetch("http://localhost:3000/health", {
      method: "GET",
      timeout: 3000,
    });
    return response.ok;
  } catch (error) {
    console.error("Server connectivity test failed:", error);
    return false;
  }
}

function connectToServer() {
  if (
    socket &&
    (socket.readyState === WebSocket.OPEN ||
      socket.readyState === WebSocket.CONNECTING)
  ) {
    return;
  }

  isManualDisconnect = false;
  updatePopupStatus("Connecting");

  try {
    socket = new WebSocket("ws://localhost:3000");

    // Set connection timeout
    const connectionTimeout = setTimeout(() => {
      if (socket && socket.readyState === WebSocket.CONNECTING) {
        console.error("Connection timeout, closing socket");
        socket.close();
        scheduleReconnect();
      }
    }, 5000); // 5 second timeout

    socket.onopen = () => {
      clearTimeout(connectionTimeout);
      console.error("Connected to local WS server");

      // Reset reconnection attempts on successful connection
      reconnectAttempts = 0;
      reconnectDelay = 1000;

      updatePopupStatus("Connected");
      socket.send(JSON.stringify({ type: "register", role: "extension" }));

      // Start heartbeat
      startHeartbeat();
    };

    socket.onmessage = async (event) => {
      const msg = JSON.parse(event.data);
      try {
        console.error("[WS] message received:", msg.type, msg);
      } catch {}
      try {
        // Handle heartbeat messages
        if (msg.type === "ping") {
          socket.send(
            JSON.stringify({ type: "pong", timestamp: msg.timestamp })
          );
          return;
        }

        if (msg.type === "pong") {
          // Server responded to our ping - connection is alive
          console.log("Received pong from server");
          return;
        }

        if (msg.type === "registered" && msg.role === "extension") {
          try {
            console.error("[WS] Registered ACK from server");
          } catch {}
          return;
        }
        if (msg.type === "snapshot" && msg.url) {
          console.error(`Received snapshot request for: ${msg.url}`);
          const domSnapshot = await takeSnapshotOfURL(msg.url);
          socket.send(
            JSON.stringify({
              type: "snapshot-result",
              requestId: msg.requestId,
              result: domSnapshot,
            })
          );
          return;
        }

        if (msg.type === "open-tab" && msg.url) {
          console.log(`Opening tab: ${msg.url}`);
          const active = Boolean(msg.active);
          chrome.tabs.create({ url: msg.url, active }, (tab) => {
            socket.send(
              JSON.stringify({
                type: "open-tab-result",
                requestId: msg.requestId,
                success: Boolean(tab && tab.id != null),
                tabId: tab?.id ?? null,
              })
            );
          });
          return;
        }

        if (msg.type === "tab-click" && msg.selector) {
          console.log(`Clicking element with selector: ${msg.selector}`);
          const targetTabId = Number.isFinite(msg.tabId)
            ? msg.tabId
            : undefined;
          getTargetTabId(targetTabId, async (tabId) => {
            if (tabId == null) {
              socket.send(
                JSON.stringify({
                  type: "tab-click-result",
                  requestId: msg.requestId,
                  success: false,
                  error: "No active tab",
                })
              );
              console.error("No active tab to click on");
              return;
            }
            try {
              chrome.scripting.executeScript(
                {
                  target: { tabId, allFrames: true },
                  args: [msg.selector, msg.timeoutMs || 2000],
                  func: (rawSelector, timeoutMs) => {
                    function escapeClassToken(token) {
                      return token
                        .replace(/\\\\/g, "\\\\\\\\")
                        .replace(/\//g, "\\/")
                        .replace(/:/g, "\\:");
                    }
                    function queryDeep(root, selector) {
                      // Try native first
                      try {
                        const el = root.querySelector(selector);
                        if (el) return el;
                      } catch {}
                      // Traverse shadow roots
                      const walker = document.createTreeWalker(
                        root,
                        NodeFilter.SHOW_ELEMENT,
                        null
                      );
                      let node = walker.currentNode;
                      while (node) {
                        const sr = node.shadowRoot;
                        if (sr) {
                          try {
                            const el = sr.querySelector(selector);
                            if (el) return el;
                          } catch {}
                        }
                        node = walker.nextNode();
                      }
                      return null;
                    }
                    function selectByHeuristics(root, sel) {
                      const direct = queryDeep(root, sel);
                      if (direct) return direct;
                      const tokens = sel.trim().split(/\s+/).filter(Boolean);
                      if (tokens.length > 1 && !/[#>\[\.]/.test(sel)) {
                        const classSelector = tokens
                          .map((t) => "." + escapeClassToken(t))
                          .join("");
                        const deep = queryDeep(root, classSelector);
                        if (deep) return deep;
                        // Fallback: contains all class tokens
                        const all = root.querySelectorAll("*");
                        for (const node of all) {
                          // search also within shadow roots shallowly
                          const clsAttr =
                            node.getAttribute &&
                            (node.getAttribute("class") || "");
                          const cls = clsAttr.split(/\s+/);
                          if (tokens.every((t) => cls.includes(t))) return node;
                          const sr = node.shadowRoot;
                          if (sr) {
                            const deepAll = sr.querySelectorAll("*");
                            for (const sub of deepAll) {
                              const subCls = (
                                sub.getAttribute("class") || ""
                              ).split(/\s+/);
                              if (tokens.every((t) => subCls.includes(t)))
                                return sub;
                            }
                          }
                        }
                      }
                      return null;
                    }
                    function clickElement(el) {
                      try {
                        el.scrollIntoView({
                          block: "center",
                          inline: "center",
                        });
                      } catch {}
                      const rect = el.getBoundingClientRect();
                      const cx = Math.max(
                        0,
                        Math.floor(rect.left + rect.width / 2)
                      );
                      const cy = Math.max(
                        0,
                        Math.floor(rect.top + rect.height / 2)
                      );
                      const opts = {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        clientX: cx,
                        clientY: cy,
                      };
                      try {
                        el.dispatchEvent(new PointerEvent("pointerdown", opts));
                      } catch {}
                      try {
                        el.dispatchEvent(new MouseEvent("mousedown", opts));
                      } catch {}
                      try {
                        el.dispatchEvent(new PointerEvent("pointerup", opts));
                      } catch {}
                      try {
                        el.dispatchEvent(new MouseEvent("mouseup", opts));
                      } catch {}
                      try {
                        el.dispatchEvent(new MouseEvent("click", opts));
                      } catch {}
                    }
                    function waitForElement(sel, deadlineTs) {
                      return new Promise((resolve) => {
                        function poll() {
                          const el = selectByHeuristics(document, sel);
                          if (el) return resolve(el);
                          if (Date.now() > deadlineTs) return resolve(null);
                          setTimeout(poll, 100);
                        }
                        poll();
                      });
                    }
                    return (async () => {
                      const deadline =
                        Date.now() + Math.max(0, Number(timeoutMs) || 0);
                      const el = await waitForElement(rawSelector, deadline);
                      if (!el)
                        return { success: false, error: "Element not found" };
                      clickElement(el);
                      return { success: true };
                    })();
                  },
                },
                (results) => {
                  const best = (results || [])
                    .map((r) => r && r.result)
                    .find((r) => r && r.success);
                  const result = best ||
                    results?.[0]?.result || { success: false };
                  socket.send(
                    JSON.stringify({
                      type: "tab-click-result",
                      requestId: msg.requestId,
                      ...result,
                    })
                  );
                }
              );
            } catch (e) {
              socket.send(
                JSON.stringify({
                  type: "tab-click-result",
                  requestId: msg.requestId,
                  success: false,
                  error: String(e),
                })
              );
              console.error("Error executing click script:", e);
            }
          });
          return;
        }

        if (msg.type === "tab-back") {
          const targetTabId = Number.isFinite(msg.tabId)
            ? msg.tabId
            : undefined;
          getTargetTabId(targetTabId, async (tabId) => {
            if (tabId == null) {
              socket.send(
                JSON.stringify({
                  type: "tab-back-result",
                  requestId: msg.requestId,
                  success: false,
                  error: "No active tab",
                })
              );
              return;
            }
            try {
              await goBack(tabId);
              socket.send(
                JSON.stringify({
                  type: "tab-back-result",
                  requestId: msg.requestId,
                  success: true,
                })
              );
            } catch (e) {
              socket.send(
                JSON.stringify({
                  type: "tab-back-result",
                  requestId: msg.requestId,
                  success: false,
                  error: String(e),
                })
              );
            }
          });
          console.error("Back request received");
          return;
        }

        if (msg.type === "tab-forward") {
          const targetTabId = Number.isFinite(msg.tabId)
            ? msg.tabId
            : undefined;
          getTargetTabId(targetTabId, async (tabId) => {
            if (tabId == null) {
              socket.send(
                JSON.stringify({
                  type: "tab-forward-result",
                  requestId: msg.requestId,
                  success: false,
                  error: "No active tab",
                })
              );
              return;
            }
            try {
              await goForward(tabId);
              socket.send(
                JSON.stringify({
                  type: "tab-forward-result",
                  requestId: msg.requestId,
                  success: true,
                })
              );
            } catch (e) {
              socket.send(
                JSON.stringify({
                  type: "tab-forward-result",
                  requestId: msg.requestId,
                  success: false,
                  error: String(e),
                })
              );
            }
          });
          return;
        }

        if (msg.type === "screenshot") {
          console.log("Screenshot request received:", msg);
          const targetTabId = Number.isFinite(msg.tabId)
            ? msg.tabId
            : undefined;

          const takeScreenshotOfTab = (tabId) => {
            try {
              // First, ensure the tab is active and get its window info
              chrome.tabs.get(tabId, (tab) => {
                if (chrome.runtime.lastError || !tab) {
                  socket.send(
                    JSON.stringify({
                      type: "screenshot-result",
                      requestId: msg.requestId,
                      success: false,
                      error:
                        chrome.runtime.lastError?.message || "Tab not found",
                    })
                  );
                  return;
                }

                // Make sure the tab is active in its window for capturing
                chrome.tabs.update(tabId, { active: true }, () => {
                  if (chrome.runtime.lastError) {
                    socket.send(
                      JSON.stringify({
                        type: "screenshot-result",
                        requestId: msg.requestId,
                        success: false,
                        error: chrome.runtime.lastError.message,
                      })
                    );
                    return;
                  }

                  // Small delay to ensure tab is fully active
                  setTimeout(() => {
                    const format = msg.format === "jpeg" ? "jpeg" : "png";
                    const quality = msg.quality || 90;

                    const options = {
                      format: format,
                    };

                    if (format === "jpeg") {
                      options.quality = quality;
                    }

                    // Capture from the specific window where the tab is located
                    chrome.tabs.captureVisibleTab(
                      tab.windowId,
                      options,
                      (dataUrl) => {
                        if (chrome.runtime.lastError) {
                          console.error(
                            "captureVisibleTab error:",
                            chrome.runtime.lastError
                          );
                          socket.send(
                            JSON.stringify({
                              type: "screenshot-result",
                              requestId: msg.requestId,
                              success: false,
                              error: chrome.runtime.lastError.message,
                            })
                          );
                          return;
                        }

                        if (!dataUrl) {
                          socket.send(
                            JSON.stringify({
                              type: "screenshot-result",
                              requestId: msg.requestId,
                              success: false,
                              error: "No screenshot data received",
                            })
                          );
                          return;
                        }

                        // Convert data URL to base64 string (remove the data:image/png;base64, prefix)
                        const base64Data = dataUrl.split(",")[1];

                        socket.send(
                          JSON.stringify({
                            type: "screenshot-result",
                            requestId: msg.requestId,
                            success: true,
                            screenshot: base64Data,
                            format: format,
                          })
                        );
                      }
                    );
                  }, 100); // 100ms delay
                });
              });
            } catch (e) {
              console.error("Screenshot error:", e);
              socket.send(
                JSON.stringify({
                  type: "screenshot-result",
                  requestId: msg.requestId,
                  success: false,
                  error: String(e),
                })
              );
            }
          };

          if (targetTabId) {
            takeScreenshotOfTab(targetTabId);
          } else {
            getTargetTabId(targetTabId, (tabId) => {
              if (tabId == null) {
                socket.send(
                  JSON.stringify({
                    type: "screenshot-result",
                    requestId: msg.requestId,
                    success: false,
                    error: "No active tab",
                  })
                );
                return;
              }
              takeScreenshotOfTab(tabId);
            });
          }
          return;
        }

        if (msg.type === "scroll") {
          console.log("🟡 Background.js: Scroll request received:", msg);
          const targetTabId = Number.isFinite(msg.tabId)
            ? msg.tabId
            : undefined;

          const performScroll = async (tabId) => {
            try {
              console.log("🟡 Background.js: Performing scroll on tab:", tabId);

              // Import the interaction handler
              const interactionModule = await import(
                "./src/handlers/interaction.js"
              );
              const result = await interactionModule.handleScroll(
                {
                  direction: msg.direction,
                  distance: msg.distance,
                  selector: msg.selector,
                  timeoutMs: msg.timeoutMs,
                },
                tabId
              );

              console.log("🟢 Background.js: Scroll completed:", result);
              socket.send(
                JSON.stringify({
                  type: "scroll-result",
                  requestId: msg.requestId,
                  success: true,
                  result: result,
                })
              );
            } catch (error) {
              console.error("🔴 Background.js: Scroll error:", error);
              socket.send(
                JSON.stringify({
                  type: "scroll-result",
                  requestId: msg.requestId,
                  success: false,
                  error: error.message || String(error),
                })
              );
            }
          };

          if (targetTabId) {
            performScroll(targetTabId);
          } else {
            getTargetTabId(targetTabId, (tabId) => {
              if (tabId == null) {
                socket.send(
                  JSON.stringify({
                    type: "scroll-result",
                    requestId: msg.requestId,
                    success: false,
                    error: "No active tab",
                  })
                );
                return;
              }
              performScroll(tabId);
            });
          }
          return;
        }
      } catch (err) {
        console.error("Error handling WS message:", err);
      }
    };

    socket.onerror = (err) => {
      clearTimeout(connectionTimeout);
      console.error("WebSocket error:", err);
      updatePopupStatus("Error");
      stopHeartbeat();
    };

    socket.onclose = (event) => {
      clearTimeout(connectionTimeout);
      console.error("WebSocket closed:", event.code, event.reason);
      updatePopupStatus("Disconnected");
      stopHeartbeat();

      // Only attempt reconnection if it wasn't a manual disconnect
      if (!isManualDisconnect) {
        scheduleReconnect();
      }
    };
  } catch (error) {
    console.error("Error creating WebSocket:", error);
    updatePopupStatus("Error");
    scheduleReconnect();
  }
}

async function scheduleReconnect() {
  if (reconnectAttempts >= maxReconnectAttempts) {
    console.error("Max reconnection attempts reached");
    updatePopupStatus("Failed");
    return;
  }

  reconnectAttempts++;
  const delay = Math.min(
    reconnectDelay * Math.pow(2, reconnectAttempts - 1),
    30000
  ); // Max 30 seconds

  console.log(
    `Reconnecting in ${delay}ms (attempt ${reconnectAttempts}/${maxReconnectAttempts})`
  );
  updatePopupStatus(
    `Reconnecting... (${reconnectAttempts}/${maxReconnectAttempts})`
  );

  setTimeout(async () => {
    if (!isManualDisconnect) {
      // Test server connectivity before attempting WebSocket connection
      const serverAvailable = await testServerConnectivity();
      if (!serverAvailable) {
        console.log("Server not available, scheduling another attempt");
        scheduleReconnect();
        return;
      }
      connectToServer();
    }
  }, delay);
}

function startHeartbeat() {
  stopHeartbeat(); // Clear any existing heartbeat

  heartbeatInterval = setInterval(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      try {
        socket.send(JSON.stringify({ type: "ping", timestamp: Date.now() }));
      } catch (err) {
        console.error("Error sending heartbeat:", err);
        stopHeartbeat();
        scheduleReconnect();
      }
    } else {
      stopHeartbeat();
      if (!isManualDisconnect) {
        scheduleReconnect();
      }
    }
  }, 30000); // Send ping every 30 seconds
}

function stopHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
}

function disconnect() {
  isManualDisconnect = true;
  stopHeartbeat();
  if (socket) {
    socket.close();
    socket = null;
  }
  updatePopupStatus("Disconnected");
}

function updatePopupStatus(status) {
  connectionStatus = status;
  chrome.runtime.sendMessage({ action: "status", status });
}

function getComputedStatus() {
  if (socket) {
    switch (socket.readyState) {
      case WebSocket.CONNECTING:
        return "Connecting";
      case WebSocket.OPEN:
        return "Connected";
      case WebSocket.CLOSING:
        return "Closing";
      case WebSocket.CLOSED:
        return "Disconnected";
      default:
        return connectionStatus;
    }
  }
  return connectionStatus;
}

// Try to connect on startup/installation
try {
  chrome.runtime.onStartup.addListener(() => {
    try {
      console.error("[BG] onStartup: attempting connection");
    } catch {}
    connectToServer();
  });
  chrome.runtime.onInstalled.addListener(() => {
    try {
      console.error("[BG] onInstalled: attempting connection");
    } catch {}
    connectToServer();
  });
  // Also attempt immediate connect when service worker loads
  connectToServer();
} catch {}

async function takeSnapshotOfURL(url) {
  return new Promise((resolve) => {
    chrome.tabs.create({ url, active: false }, (tab) => {
      if (!tab.id) {
        resolve([]);
        return;
      }

      // Wait a bit for the page to load before taking snapshot
      setTimeout(() => {
        // Attach debugger
        chrome.debugger.attach({ tabId: tab.id }, "1.3", async () => {
          console.log("Debugger attached for snapshot");

          // Step 1: Get full accessibility tree
          chrome.debugger.sendCommand(
            { tabId: tab.id },
            "Accessibility.getFullAXTree",
            {},
            async (axTree) => {
              if (!axTree?.nodes) {
                chrome.debugger.detach({ tabId: tab.id });
                chrome.tabs.remove(tab.id);
                resolve([]);
                return;
              }

              let results = [];

              for (const node of axTree.nodes) {
                // Filter only meaningful interactive elements
                if (
                  node.role?.value &&
                  INTERACTIVE_ROLES.includes(node.role.value)
                ) {
                  const backendId = node.backendDOMNodeId;
                  if (!backendId) continue;

                  // Step 2: Describe the DOM node
                  await new Promise((nodeResolve) => {
                    chrome.debugger.sendCommand(
                      { tabId: tab.id },
                      "DOM.describeNode",
                      { backendNodeId: backendId },
                      (desc) => {
                        if (desc?.node) {
                          const elem = {
                            role: node.role.value,
                            name: node.name?.value || "",
                            tag: desc.node.nodeName.toLowerCase(),
                            attributes: {},
                          };

                          // Extract attributes
                          if (desc.node.attributes) {
                            for (
                              let i = 0;
                              i < desc.node.attributes.length;
                              i += 2
                            ) {
                              elem.attributes[desc.node.attributes[i]] =
                                desc.node.attributes[i + 1];
                            }
                          }

                          results.push(elem);
                        }
                        nodeResolve();
                      }
                    );
                  });
                }
              }

              console.log("Clean AX Snapshot:", results);

              // Detach debugger and cleanup
              chrome.debugger.detach({ tabId: tab.id });
              chrome.tabs.remove(tab.id);
              resolve(results);
            }
          );
        });
      }, 2000); // Wait 2 seconds for page to load
    });
  });
}

function getTargetTabId(preferredTabId, callback) {
  if (preferredTabId != null) {
    callback(preferredTabId);
    return;
  }
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs?.[0]?.id;
    callback(tabId);
  });
}

function goBack(tabId) {
  return new Promise((resolve, reject) => {
    try {
      chrome.scripting.executeScript(
        { target: { tabId }, func: () => window.history.back() },
        () => {
          const err = chrome.runtime.lastError;
          if (err) reject(err);
          else resolve(undefined);
        }
      );
    } catch (e) {
      reject(e);
    }
  });
}

function goForward(tabId) {
  return new Promise((resolve, reject) => {
    try {
      chrome.scripting.executeScript(
        { target: { tabId }, func: () => window.history.forward() },
        () => {
          const err = chrome.runtime.lastError;
          if (err) reject(err);
          else resolve(undefined);
        }
      );
    } catch (e) {
      reject(e);
    }
  });
}
