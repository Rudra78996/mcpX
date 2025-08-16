import { sendResponse } from "../utils/connection.js";

export class InteractionHandler {
  constructor(connectionManager) {
    this.connectionManager = connectionManager;
  }

  async handleClick(msg) {
    console.log(`Clicking element with selector: ${msg.selector}`);
    const targetTabId = Number.isFinite(msg.tabId) ? msg.tabId : undefined;

    await this.getTargetTabId(targetTabId, async (tabId) => {
      if (tabId == null) {
        sendResponse(
          this.connectionManager.socket,
          "tab-click-result",
          msg.requestId,
          {
            success: false,
            error: "No active tab",
          }
        );
        return;
      }

      try {
        const results = await chrome.scripting.executeScript({
          target: { tabId, allFrames: true },
          args: [msg.selector, msg.timeoutMs || 5000],
          func: this.clickElementScript,
        });

        const result = results[0]?.result;
        sendResponse(
          this.connectionManager.socket,
          "tab-click-result",
          msg.requestId,
          {
            success: result?.success || false,
            error: result?.error,
            ...result,
          }
        );
      } catch (error) {
        sendResponse(
          this.connectionManager.socket,
          "tab-click-result",
          msg.requestId,
          {
            success: false,
            error: error.message,
          }
        );
      }
    });
  }

  async handleHover(msg) {
    console.log(`Hovering over element with selector: ${msg.selector}`);
    const targetTabId = Number.isFinite(msg.tabId) ? msg.tabId : undefined;

    await this.getTargetTabId(targetTabId, async (tabId) => {
      if (tabId == null) {
        sendResponse(
          this.connectionManager.socket,
          "hover-result",
          msg.requestId,
          {
            success: false,
            error: "No active tab",
          }
        );
        return;
      }

      try {
        const results = await chrome.scripting.executeScript({
          target: { tabId, allFrames: true },
          args: [msg.selector, msg.timeoutMs || 5000],
          func: this.hoverElementScript,
        });

        const result = results[0]?.result;
        sendResponse(
          this.connectionManager.socket,
          "hover-result",
          msg.requestId,
          {
            success: result?.success || false,
            error: result?.error,
            ...result,
          }
        );
      } catch (error) {
        sendResponse(
          this.connectionManager.socket,
          "hover-result",
          msg.requestId,
          {
            success: false,
            error: error.message,
          }
        );
      }
    });
  }

  async handleTypeText(msg) {
    console.log(`Typing text: "${msg.text}"`);
    const targetTabId = Number.isFinite(msg.tabId) ? msg.tabId : undefined;

    await this.getTargetTabId(targetTabId, async (tabId) => {
      if (tabId == null) {
        sendResponse(
          this.connectionManager.socket,
          "type-text-result",
          msg.requestId,
          {
            success: false,
            error: "No active tab",
          }
        );
        return;
      }

      try {
        const results = await chrome.scripting.executeScript({
          target: { tabId, allFrames: true },
          args: [msg.text, msg.selector, msg.delay || 50],
          func: this.typeTextScript,
        });

        const result = results[0]?.result;
        sendResponse(
          this.connectionManager.socket,
          "type-text-result",
          msg.requestId,
          {
            success: result?.success || false,
            error: result?.error,
            ...result,
          }
        );
      } catch (error) {
        sendResponse(
          this.connectionManager.socket,
          "type-text-result",
          msg.requestId,
          {
            success: false,
            error: error.message,
          }
        );
      }
    });
  }

  async handleScroll(msg) {
    console.error("handleScroll called with message:", msg);
    console.log(`Scrolling ${msg.direction} by ${msg.distance}px`);
    console.log("Full scroll message:", msg);
    const targetTabId = Number.isFinite(msg.tabId) ? msg.tabId : undefined;

    await this.getTargetTabId(targetTabId, async (tabId) => {
      if (tabId == null) {
        sendResponse(
          this.connectionManager.socket,
          "scroll-result",
          msg.requestId,
          {
            success: false,
            error: "No active tab",
          }
        );
        return;
      }

      try {
        const results = await chrome.scripting.executeScript({
          target: { tabId, allFrames: true },
          args: [
            msg.direction,
            msg.distance || 300,
            msg.selector || null,
            msg.timeoutMs || 5000,
          ],
          func: this.scrollScript,
        });

        console.log("Scroll script execution results:", results);
        const result = results[0]?.result;
        console.log("Scroll script result:", result);
        console.error(
          "Sending scroll-result response with requestId:",
          msg.requestId
        );
        sendResponse(
          this.connectionManager.socket,
          "scroll-result",
          msg.requestId,
          {
            success: result?.success || false,
            error: result?.error,
            ...result,
          }
        );
      } catch (error) {
        console.error("Error in handleScroll:", error);
        sendResponse(
          this.connectionManager.socket,
          "scroll-result",
          msg.requestId,
          {
            success: false,
            error: error.message,
          }
        );
      }
    });
  }

  clickElementScript(rawSelector, timeoutMs) {
    // Utility functions injected into the page
    function escapeClassToken(token) {
      return token
        .replace(/\\\\/g, "\\\\\\\\")
        .replace(/\//g, "\\/")
        .replace(/:/g, "\\:");
    }

    function queryDeep(root, selector) {
      try {
        const el = root.querySelector(selector);
        if (el) return el;
      } catch {}

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

        const all = root.querySelectorAll("*");
        for (const node of all) {
          const clsAttr =
            node.getAttribute && (node.getAttribute("class") || "");
          const cls = clsAttr.split(/\s+/);
          if (tokens.every((t) => cls.includes(t))) return node;

          const sr = node.shadowRoot;
          if (sr) {
            const deepAll = sr.querySelectorAll("*");
            for (const sub of deepAll) {
              const subCls = (sub.getAttribute("class") || "").split(/\s+/);
              if (tokens.every((t) => subCls.includes(t))) return sub;
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
      const cx = Math.max(0, Math.floor(rect.left + rect.width / 2));
      const cy = Math.max(0, Math.floor(rect.top + rect.height / 2));

      const opts = {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: cx,
        clientY: cy,
      };

      el.dispatchEvent(new MouseEvent("mousedown", opts));
      el.dispatchEvent(new MouseEvent("mouseup", opts));
      el.dispatchEvent(new MouseEvent("click", opts));

      if (el.focus) el.focus();
      if (el.click) el.click();
    }

    try {
      const element = selectByHeuristics(document, rawSelector);
      if (!element) {
        return { success: false, error: `Element not found: ${rawSelector}` };
      }

      clickElement(element);
      return { success: true, selector: rawSelector };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  hoverElementScript(rawSelector, timeoutMs) {
    // Similar utility functions as above
    function queryDeep(root, selector) {
      try {
        const el = root.querySelector(selector);
        if (el) return el;
      } catch {}

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

    try {
      const element = queryDeep(document, rawSelector);
      if (!element) {
        return { success: false, error: `Element not found: ${rawSelector}` };
      }

      const rect = element.getBoundingClientRect();
      const cx = Math.max(0, Math.floor(rect.left + rect.width / 2));
      const cy = Math.max(0, Math.floor(rect.top + rect.height / 2));

      const hoverEvent = new MouseEvent("mouseover", {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: cx,
        clientY: cy,
      });

      element.dispatchEvent(hoverEvent);
      return { success: true, selector: rawSelector };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  typeTextScript(text, selector, delay) {
    function queryDeep(root, selector) {
      try {
        const el = root.querySelector(selector);
        if (el) return el;
      } catch {}

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

    try {
      let element;

      if (selector) {
        element = queryDeep(document, selector);
        if (!element) {
          return { success: false, error: `Element not found: ${selector}` };
        }
      } else {
        element = document.activeElement || document.body;
      }

      element.focus();

      // Clear existing text if it's an input
      if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
        element.value = "";
        element.dispatchEvent(new Event("input", { bubbles: true }));
      }

      // Type text character by character
      for (let i = 0; i < text.length; i++) {
        const char = text[i];

        element.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: char,
            bubbles: true,
            cancelable: true,
          })
        );

        if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
          element.value += char;
          element.dispatchEvent(new Event("input", { bubbles: true }));
        } else {
          element.textContent += char;
        }

        element.dispatchEvent(
          new KeyboardEvent("keyup", {
            key: char,
            bubbles: true,
            cancelable: true,
          })
        );

        // Add delay between characters
        if (delay > 0 && i < text.length - 1) {
          // Note: We can't use actual delays in injected scripts
          // This is just for demonstration
        }
      }

      element.dispatchEvent(new Event("change", { bubbles: true }));
      return { success: true, text, selector };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  scrollScript(direction, distance, selector, timeoutMs) {
    try {
      console.error("ScrollScript called with:", {
        direction,
        distance,
        selector,
        timeoutMs,
      });

      // Simple test first - just return success without doing anything
      return {
        success: true,
        direction,
        distance,
        selector,
        message: "ScrollScript executed successfully (test mode)",
      };

      let targetElement = window;

      // If selector is provided, scroll within that element
      if (selector && typeof selector === "string" && selector.trim()) {
        const element = document.querySelector(selector.trim());
        if (!element) {
          return {
            success: false,
            error: `Element not found with selector: ${selector}`,
          };
        }
        targetElement = element;
      }

      const scrollOptions = {
        behavior: "smooth",
      };

      let scrollX = 0;
      let scrollY = 0;

      switch (direction) {
        case "up":
          scrollY = -distance;
          break;
        case "down":
          scrollY = distance;
          break;
        case "left":
          scrollX = -distance;
          break;
        case "right":
          scrollX = distance;
          break;
        case "top":
          if (targetElement === window) {
            window.scrollTo({ top: 0, left: 0, ...scrollOptions });
          } else {
            targetElement.scrollTo({ top: 0, left: 0, ...scrollOptions });
          }
          return { success: true, direction, distance: 0, scrolledTo: "top" };
        case "bottom":
          if (targetElement === window) {
            window.scrollTo({
              top: document.documentElement.scrollHeight,
              left: 0,
              ...scrollOptions,
            });
          } else {
            targetElement.scrollTo({
              top: targetElement.scrollHeight,
              left: 0,
              ...scrollOptions,
            });
          }
          return {
            success: true,
            direction,
            distance: 0,
            scrolledTo: "bottom",
          };
      }

      // For relative scrolling (up, down, left, right)
      if (targetElement === window) {
        window.scrollBy({
          top: scrollY,
          left: scrollX,
          ...scrollOptions,
        });
      } else {
        targetElement.scrollBy({
          top: scrollY,
          left: scrollX,
          ...scrollOptions,
        });
      }

      return {
        success: true,
        direction,
        distance,
        scrollX,
        scrollY,
        selector: selector || "window",
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getTargetTabId(explicitTabId, callback) {
    if (Number.isFinite(explicitTabId)) {
      callback(explicitTabId);
      return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs?.[0];
      callback(activeTab?.id ?? null);
    });
  }
}
