import { sendResponse } from "../utils/connection.js";

export class NavigationHandler {
  constructor(connectionManager) {
    this.connectionManager = connectionManager;
  }

  async handleOpenTab(msg) {
    console.log(`Opening tab: ${msg.url}`);
    const active = Boolean(msg.active);

    try {
      const tab = await new Promise((resolve, reject) => {
        chrome.tabs.create({ url: msg.url, active }, (tab) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(tab);
          }
        });
      });

      sendResponse(
        this.connectionManager.socket,
        "open-tab-result",
        msg.requestId,
        {
          success: Boolean(tab && tab.id != null),
          tabId: tab?.id ?? null,
        }
      );
    } catch (error) {
      sendResponse(
        this.connectionManager.socket,
        "open-tab-result",
        msg.requestId,
        {
          success: false,
          error: error.message,
        }
      );
    }
  }

  async handleTabBack(msg) {
    console.log("Going back in tab history");
    const targetTabId = Number.isFinite(msg.tabId) ? msg.tabId : undefined;

    try {
      await this.getTargetTabId(targetTabId, async (tabId) => {
        if (tabId == null) {
          sendResponse(
            this.connectionManager.socket,
            "tab-back-result",
            msg.requestId,
            {
              success: false,
              error: "No active tab",
            }
          );
          return;
        }

        chrome.tabs.goBack(tabId, () => {
          if (chrome.runtime.lastError) {
            sendResponse(
              this.connectionManager.socket,
              "tab-back-result",
              msg.requestId,
              {
                success: false,
                error: chrome.runtime.lastError.message,
              }
            );
          } else {
            sendResponse(
              this.connectionManager.socket,
              "tab-back-result",
              msg.requestId,
              {
                success: true,
                tabId,
              }
            );
          }
        });
      });
    } catch (error) {
      sendResponse(
        this.connectionManager.socket,
        "tab-back-result",
        msg.requestId,
        {
          success: false,
          error: error.message,
        }
      );
    }
  }

  async handleTabForward(msg) {
    console.log("Going forward in tab history");
    const targetTabId = Number.isFinite(msg.tabId) ? msg.tabId : undefined;

    try {
      await this.getTargetTabId(targetTabId, async (tabId) => {
        if (tabId == null) {
          sendResponse(
            this.connectionManager.socket,
            "tab-forward-result",
            msg.requestId,
            {
              success: false,
              error: "No active tab",
            }
          );
          return;
        }

        chrome.tabs.goForward(tabId, () => {
          if (chrome.runtime.lastError) {
            sendResponse(
              this.connectionManager.socket,
              "tab-forward-result",
              msg.requestId,
              {
                success: false,
                error: chrome.runtime.lastError.message,
              }
            );
          } else {
            sendResponse(
              this.connectionManager.socket,
              "tab-forward-result",
              msg.requestId,
              {
                success: true,
                tabId,
              }
            );
          }
        });
      });
    } catch (error) {
      sendResponse(
        this.connectionManager.socket,
        "tab-forward-result",
        msg.requestId,
        {
          success: false,
          error: error.message,
        }
      );
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
