import { sendResponse } from "../utils/connection.js";

export class UtilityHandler {
  constructor(connectionManager) {
    this.connectionManager = connectionManager;
  }

  async handleWait(msg) {
    console.log(`Waiting for ${msg.type}: ${msg.value}`);
    const targetTabId = Number.isFinite(msg.tabId) ? msg.tabId : undefined;

    try {
      switch (msg.type) {
        case "time":
          await this.waitForTime(msg.value);
          sendResponse(
            this.connectionManager.socket,
            "wait-result",
            msg.requestId,
            {
              success: true,
              type: msg.type,
              value: msg.value,
            }
          );
          break;

        case "element":
          await this.waitForElement(
            msg.value,
            targetTabId,
            msg.timeout || 30000
          );
          sendResponse(
            this.connectionManager.socket,
            "wait-result",
            msg.requestId,
            {
              success: true,
              type: msg.type,
              value: msg.value,
            }
          );
          break;

        case "navigation":
          await this.waitForNavigation(
            msg.value,
            targetTabId,
            msg.timeout || 30000
          );
          sendResponse(
            this.connectionManager.socket,
            "wait-result",
            msg.requestId,
            {
              success: true,
              type: msg.type,
              value: msg.value,
            }
          );
          break;

        default:
          sendResponse(
            this.connectionManager.socket,
            "wait-result",
            msg.requestId,
            {
              success: false,
              error: `Unknown wait type: ${msg.type}`,
            }
          );
      }
    } catch (error) {
      sendResponse(
        this.connectionManager.socket,
        "wait-result",
        msg.requestId,
        {
          success: false,
          error: error.message,
        }
      );
    }
  }

  async handlePressKey(msg) {
    console.log(`Pressing key: ${msg.key}`);
    const targetTabId = Number.isFinite(msg.tabId) ? msg.tabId : undefined;

    await this.getTargetTabId(targetTabId, async (tabId) => {
      if (tabId == null) {
        sendResponse(
          this.connectionManager.socket,
          "press-key-result",
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
          args: [msg.key, msg.modifiers || {}],
          func: this.pressKeyScript,
        });

        const result = results[0]?.result;
        sendResponse(
          this.connectionManager.socket,
          "press-key-result",
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
          "press-key-result",
          msg.requestId,
          {
            success: false,
            error: error.message,
          }
        );
      }
    });
  }

  async handleScreenshot(msg) {
    console.log("Taking screenshot");
    const targetTabId = Number.isFinite(msg.tabId) ? msg.tabId : undefined;

    await this.getTargetTabId(targetTabId, async (tabId) => {
      if (tabId == null) {
        sendResponse(
          this.connectionManager.socket,
          "screenshot-result",
          msg.requestId,
          {
            success: false,
            error: "No active tab",
          }
        );
        return;
      }

      try {
        const options = {
          format: msg.format || "png",
          quality: msg.quality || 90,
        };

        let dataUrl;
        if (msg.fullPage) {
          // For full page screenshots, we need to handle this differently
          dataUrl = await chrome.tabs.captureVisibleTab(null, options);
        } else {
          dataUrl = await chrome.tabs.captureVisibleTab(null, options);
        }

        sendResponse(
          this.connectionManager.socket,
          "screenshot-result",
          msg.requestId,
          {
            success: true,
            dataUrl: dataUrl,
            format: msg.format || "png",
          }
        );
      } catch (error) {
        sendResponse(
          this.connectionManager.socket,
          "screenshot-result",
          msg.requestId,
          {
            success: false,
            error: error.message,
          }
        );
      }
    });
  }

  async handleConsoleLogs(msg) {
    console.log("Getting console logs");
    const targetTabId = Number.isFinite(msg.tabId) ? msg.tabId : undefined;

    await this.getTargetTabId(targetTabId, async (tabId) => {
      if (tabId == null) {
        sendResponse(
          this.connectionManager.socket,
          "console-logs-result",
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
          target: { tabId, allFrames: false },
          args: [
            msg.levels || ["log", "info", "warn", "error"],
            msg.since,
            msg.limit || 100,
          ],
          func: this.getConsoleLogsScript,
        });

        const result = results[0]?.result;
        sendResponse(
          this.connectionManager.socket,
          "console-logs-result",
          msg.requestId,
          {
            success: result?.success || false,
            logs: result?.logs || [],
            error: result?.error,
          }
        );
      } catch (error) {
        sendResponse(
          this.connectionManager.socket,
          "console-logs-result",
          msg.requestId,
          {
            success: false,
            error: error.message,
            logs: [],
          }
        );
      }
    });
  }

  async waitForTime(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  async waitForElement(selector, tabId, timeout) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      const checkElement = async () => {
        try {
          const results = await chrome.scripting.executeScript({
            target: {
              tabId: tabId || (await this.getActiveTabId()),
              allFrames: true,
            },
            args: [selector],
            func: (sel) => {
              return document.querySelector(sel) !== null;
            },
          });

          if (results[0]?.result) {
            resolve();
          } else if (Date.now() - startTime > timeout) {
            reject(
              new Error(`Element "${selector}" not found within ${timeout}ms`)
            );
          } else {
            setTimeout(checkElement, 500);
          }
        } catch (error) {
          reject(error);
        }
      };

      checkElement();
    });
  }

  async waitForNavigation(urlPattern, tabId, timeout) {
    return new Promise((resolve, reject) => {
      const targetTabId = tabId || null;
      let resolved = false;

      const timer = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          reject(
            new Error(
              `Navigation to "${urlPattern}" not detected within ${timeout}ms`
            )
          );
        }
      }, timeout);

      const listener = (tabIdUpdated, changeInfo, tab) => {
        if (resolved) return;

        if (tabIdUpdated === targetTabId || targetTabId === null) {
          if (changeInfo.status === "complete" && tab.url) {
            const regex = new RegExp(urlPattern);
            if (regex.test(tab.url)) {
              resolved = true;
              clearTimeout(timer);
              chrome.tabs.onUpdated.removeListener(listener);
              resolve();
            }
          }
        }
      };

      chrome.tabs.onUpdated.addListener(listener);
    });
  }

  pressKeyScript(key, modifiers) {
    try {
      const element = document.activeElement || document.body;

      const keyboardEventOptions = {
        key: key,
        bubbles: true,
        cancelable: true,
        ctrlKey: modifiers.ctrl || false,
        altKey: modifiers.alt || false,
        shiftKey: modifiers.shift || false,
        metaKey: modifiers.meta || false,
      };

      element.dispatchEvent(new KeyboardEvent("keydown", keyboardEventOptions));
      element.dispatchEvent(
        new KeyboardEvent("keypress", keyboardEventOptions)
      );
      element.dispatchEvent(new KeyboardEvent("keyup", keyboardEventOptions));

      return { success: true, key, modifiers };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  getConsoleLogsScript(levels, since, limit) {
    // This is a basic implementation - in reality, you'd need to set up
    // console log capture when the page loads
    try {
      // For now, return empty logs as we can't retroactively capture console logs
      // In a real implementation, you'd need to inject a content script early
      // that captures console logs
      return {
        success: true,
        logs: [],
        message:
          "Console log capture not implemented - would need early content script injection",
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

  async getActiveTabId() {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        resolve(tabs?.[0]?.id ?? null);
      });
    });
  }
}
