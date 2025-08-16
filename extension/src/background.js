import { ConnectionManager } from "./utils/connection.js";
import { NavigationHandler } from "./handlers/navigation.js";
import { InteractionHandler } from "./handlers/interaction.js";
import { UtilityHandler } from "./handlers/utility.js";
import { SnapshotHandler } from "./handlers/snapshot.js";

class ExtensionManager {
  constructor() {
    this.connectionManager = new ConnectionManager();
    this.navigationHandler = new NavigationHandler(this.connectionManager);
    this.interactionHandler = new InteractionHandler(this.connectionManager);
    this.utilityHandler = new UtilityHandler(this.connectionManager);
    this.snapshotHandler = new SnapshotHandler(this.connectionManager);

    this.setupEventListeners();
    this.setupMessageHandler();
  }

  setupEventListeners() {
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.action === "connect") {
        if (
          this.connectionManager.socket &&
          this.connectionManager.socket.readyState === WebSocket.OPEN
        ) {
          this.connectionManager.updatePopupStatus("Connected");
        } else {
          this.connectionManager.connect();
        }
      }

      if (message.action === "getStatus") {
        sendResponse({ status: this.connectionManager.getComputedStatus() });
      }
    });
  }

  setupMessageHandler() {
    this.connectionManager.handleMessage = async (event) => {
      const msg = JSON.parse(event.data);

      try {
        console.error("[WS] message received:", msg.type, msg);
      } catch {}

      try {
        if (msg.type === "registered" && msg.role === "extension") {
          console.error("[WS] Registered ACK from server");
          return;
        }

        console.error("About to route message type:", msg.type);
        // Route messages to appropriate handlers
        switch (msg.type) {
          // Navigation
          case "open-tab":
            await this.navigationHandler.handleOpenTab(msg);
            break;
          case "tab-back":
            await this.navigationHandler.handleTabBack(msg);
            break;
          case "tab-forward":
            await this.navigationHandler.handleTabForward(msg);
            break;

          // Interaction
          case "tab-click":
            await this.interactionHandler.handleClick(msg);
            break;
          case "hover":
            await this.interactionHandler.handleHover(msg);
            break;
          case "type-text":
            await this.interactionHandler.handleTypeText(msg);
            break;
          case "scroll":
            console.error(
              "Background.js routing scroll message to interactionHandler"
            );
            console.error(
              "InteractionHandler exists:",
              !!this.interactionHandler
            );
            console.error(
              "handleScroll method exists:",
              !!this.interactionHandler?.handleScroll
            );
            await this.interactionHandler.handleScroll(msg);
            console.error("handleScroll method completed");
            break;

          // Utility
          case "wait":
            await this.utilityHandler.handleWait(msg);
            break;
          case "press-key":
            await this.utilityHandler.handlePressKey(msg);
            break;
          case "screenshot":
            await this.utilityHandler.handleScreenshot(msg);
            break;
          case "console-logs":
            await this.utilityHandler.handleConsoleLogs(msg);
            break;

          // Snapshot
          case "snapshot":
            await this.snapshotHandler.handleSnapshot(msg);
            break;

          default:
            console.warn("Unknown message type:", msg.type);
        }
      } catch (error) {
        console.error("Error handling message:", error);
        console.error("Error stack:", error.stack);
      }
    };
  }

  // Auto-connect on startup
  initialize() {
    console.log("Extension manager initialized");
    // Auto-connect after a short delay
    setTimeout(() => {
      this.connectionManager.connect();
    }, 1000);
  }
}

// Initialize the extension manager
const extensionManager = new ExtensionManager();
extensionManager.initialize();
