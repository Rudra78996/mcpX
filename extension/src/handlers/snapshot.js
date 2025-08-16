import { sendResponse } from "../utils/connection.js";

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

export class SnapshotHandler {
  constructor(connectionManager) {
    this.connectionManager = connectionManager;
  }

  async handleSnapshot(msg) {
    console.log(`Received snapshot request for: ${msg.url}`);

    try {
      const domSnapshot = await this.takeSnapshotOfURL(
        msg.url,
        msg.includeInteractive
      );
      sendResponse(
        this.connectionManager.socket,
        "snapshot-result",
        msg.requestId,
        {
          result: domSnapshot,
        }
      );
    } catch (error) {
      sendResponse(
        this.connectionManager.socket,
        "snapshot-result",
        msg.requestId,
        {
          result: { error: error.message },
        }
      );
    }
  }

  async takeSnapshotOfURL(url, includeInteractive = true) {
    return new Promise((resolve, reject) => {
      // Try to find existing tab with the URL first
      chrome.tabs.query({ url: url }, (existingTabs) => {
        if (existingTabs.length > 0) {
          this.captureTabSnapshot(existingTabs[0].id, includeInteractive)
            .then(resolve)
            .catch(reject);
          return;
        }

        // Create new tab if none exists
        chrome.tabs.create({ url: url, active: false }, (tab) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }

          // Wait for tab to load
          const listener = (tabId, changeInfo) => {
            if (tabId === tab.id && changeInfo.status === "complete") {
              chrome.tabs.onUpdated.removeListener(listener);

              this.captureTabSnapshot(tab.id, includeInteractive)
                .then((snapshot) => {
                  // Close the tab after capturing
                  chrome.tabs.remove(tab.id);
                  resolve(snapshot);
                })
                .catch((error) => {
                  chrome.tabs.remove(tab.id);
                  reject(error);
                });
            }
          };

          chrome.tabs.onUpdated.addListener(listener);

          // Timeout after 30 seconds
          setTimeout(() => {
            chrome.tabs.onUpdated.removeListener(listener);
            chrome.tabs.remove(tab.id);
            reject(new Error("Tab loading timeout"));
          }, 30000);
        });
      });
    });
  }

  async captureTabSnapshot(tabId, includeInteractive = true) {
    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId, allFrames: false },
        args: [includeInteractive, INTERACTIVE_ROLES],
        func: this.snapshotScript,
      });

      return results[0]?.result || { error: "No result from snapshot script" };
    } catch (error) {
      return { error: error.message };
    }
  }

  snapshotScript(includeInteractive, interactiveRoles) {
    try {
      const snapshot = {
        url: window.location.href,
        title: document.title,
        dom: document.documentElement.outerHTML,
        timestamp: Date.now(),
        interactiveElements: [],
      };

      if (includeInteractive) {
        snapshot.interactiveElements =
          this.extractInteractiveElements(interactiveRoles);
      }

      return snapshot;
    } catch (error) {
      return { error: error.message };
    }
  }

  extractInteractiveElements(interactiveRoles) {
    const elements = [];
    const visited = new Set();

    // Find all potentially interactive elements
    const candidates = document.querySelectorAll(
      [
        "a",
        "button",
        "input",
        "select",
        "textarea",
        "option",
        "[role]",
        "[onclick]",
        "[onmousedown]",
        "[onmouseup]",
        "[tabindex]",
        "[contenteditable]",
        ".btn",
        ".button",
        ".click",
        ".clickable",
        ".interactive",
      ].join(",")
    );

    candidates.forEach((el) => {
      if (visited.has(el)) return;
      visited.add(el);

      try {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const style = window.getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden") return;

        const element = {
          selector: this.generateSelector(el),
          tag: el.tagName.toLowerCase(),
          text: this.getElementText(el),
          role: el.getAttribute("role") || this.inferRole(el),
          type: el.type || null,
          placeholder: el.placeholder || null,
          value: el.value || null,
          coordinates: {
            x: Math.round(rect.left + rect.width / 2),
            y: Math.round(rect.top + rect.height / 2),
          },
        };

        // Only include if it seems interactive
        if (this.isLikelyInteractive(el, element.role, interactiveRoles)) {
          elements.push(element);
        }
      } catch (e) {
        // Skip elements that cause errors
      }
    });

    return elements.slice(0, 100); // Limit to avoid too much data
  }

  generateSelector(element) {
    // Try ID first
    if (element.id) {
      return `#${element.id}`;
    }

    // Try unique class combination
    if (element.className) {
      const classes = element.className
        .trim()
        .split(/\s+/)
        .filter((c) => c);
      if (classes.length > 0) {
        const selector = "." + classes.join(".");
        if (document.querySelectorAll(selector).length === 1) {
          return selector;
        }
      }
    }

    // Try attribute selectors
    const attributes = ["data-testid", "data-id", "name", "aria-label"];
    for (const attr of attributes) {
      const value = element.getAttribute(attr);
      if (value) {
        const selector = `[${attr}="${value}"]`;
        if (document.querySelectorAll(selector).length === 1) {
          return selector;
        }
      }
    }

    // Fall back to nth-child
    let selector = element.tagName.toLowerCase();
    let parent = element.parentElement;
    let current = element;

    while (parent && document.querySelectorAll(selector).length > 1) {
      const siblings = Array.from(parent.children).filter(
        (el) => el.tagName === current.tagName
      );
      const index = siblings.indexOf(current) + 1;

      selector = `${parent.tagName.toLowerCase()} > ${current.tagName.toLowerCase()}:nth-child(${index})`;
      current = parent;
      parent = parent.parentElement;
    }

    return selector;
  }

  getElementText(element) {
    // Get meaningful text from element
    const text = (
      element.textContent ||
      element.innerText ||
      element.getAttribute("aria-label") ||
      element.getAttribute("title") ||
      element.getAttribute("alt") ||
      element.value ||
      element.placeholder ||
      ""
    ).trim();

    return text.length > 100 ? text.substring(0, 100) + "..." : text;
  }

  inferRole(element) {
    const tag = element.tagName.toLowerCase();
    const type = element.type;

    switch (tag) {
      case "button":
        return "button";
      case "a":
        return "link";
      case "input":
        switch (type) {
          case "button":
          case "submit":
          case "reset":
            return "button";
          case "checkbox":
            return "checkbox";
          case "radio":
            return "radio";
          case "text":
          case "email":
          case "password":
          case "search":
          default:
            return "textbox";
        }
      case "textarea":
        return "textbox";
      case "select":
        return "combobox";
      case "option":
        return "option";
      default:
        if (
          element.hasAttribute("onclick") ||
          element.hasAttribute("onmousedown") ||
          element.style.cursor === "pointer"
        ) {
          return "button";
        }
        return null;
    }
  }

  isLikelyInteractive(element, role, interactiveRoles) {
    // Check explicit role
    if (role && interactiveRoles.includes(role)) return true;

    // Check tag name
    const tag = element.tagName.toLowerCase();
    if (["a", "button", "input", "select", "textarea"].includes(tag))
      return true;

    // Check for event handlers
    if (
      element.hasAttribute("onclick") ||
      element.hasAttribute("onmousedown") ||
      element.hasAttribute("onmouseup")
    )
      return true;

    // Check CSS cursor
    const style = window.getComputedStyle(element);
    if (style.cursor === "pointer") return true;

    // Check for interactive classes
    const className = element.className || "";
    const interactiveClassPatterns = [
      /\bbtn\b/,
      /\bbutton\b/,
      /\bclick\b/,
      /\binteractive\b/,
    ];
    if (interactiveClassPatterns.some((pattern) => pattern.test(className)))
      return true;

    return false;
  }
}
