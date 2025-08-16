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

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "connect") {
    if (socket && socket.readyState === WebSocket.OPEN) {
      updatePopupStatus("Connected");
    } else {
      connectToServer();
    }
  }

  if (message.action === "getStatus") {
    sendResponse({ status: getComputedStatus() });
  }
});

function connectToServer() {
  if (
    socket &&
    (socket.readyState === WebSocket.OPEN ||
      socket.readyState === WebSocket.CONNECTING)
  ) {
    return;
  }
  updatePopupStatus("Connecting");
  socket = new WebSocket("ws://localhost:3000");

  socket.onopen = () => {
    console.error("Connected to local WS server");
    updatePopupStatus("Connected");
    socket.send(JSON.stringify({ type: "register", role: "extension" }));
  };

  socket.onmessage = async (event) => {
    const msg = JSON.parse(event.data);
    try {
      console.error("[WS] message received:", msg.type, msg);
    } catch {}
    try {
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
        const targetTabId = Number.isFinite(msg.tabId) ? msg.tabId : undefined;
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
                      el.scrollIntoView({ block: "center", inline: "center" });
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
        const targetTabId = Number.isFinite(msg.tabId) ? msg.tabId : undefined;
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
        const targetTabId = Number.isFinite(msg.tabId) ? msg.tabId : undefined;
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
        const targetTabId = Number.isFinite(msg.tabId) ? msg.tabId : undefined;

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
                    error: chrome.runtime.lastError?.message || "Tab not found",
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
    } catch (err) {
      console.error("Error handling WS message:", err);
    }
  };

  socket.onerror = (err) => {
    console.error("WebSocket error:", err);
    updatePopupStatus("Error");
  };

  socket.onclose = () => {
    console.error("WebSocket closed");
    updatePopupStatus("Disconnected");
  };
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
