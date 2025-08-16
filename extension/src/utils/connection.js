// WebSocket connection utilities
export class ConnectionManager {
  constructor() {
    this.socket = null;
    this.connectionStatus = "Disconnected";
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  connect(url = "ws://localhost:3000") {
    if (
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    this.updateStatus("Connecting");
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.error("Connected to local WS server");
      this.updateStatus("Connected");
      this.reconnectAttempts = 0;
      this.socket.send(JSON.stringify({ type: "register", role: "extension" }));
    };

    this.socket.onmessage = (event) => {
      this.handleMessage(event);
    };

    this.socket.onclose = () => {
      console.error("Disconnected from WS server");
      this.updateStatus("Disconnected");
      this.attemptReconnect();
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.updateStatus("Error");
    };
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.error(`Reconnection attempt ${this.reconnectAttempts}`);
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  updateStatus(status) {
    this.connectionStatus = status;
    this.updatePopupStatus(status);
  }

  updatePopupStatus(status) {
    // Send message to popup if it's open
    try {
      chrome.runtime.sendMessage({ action: "status", status });
    } catch (e) {
      // Popup might not be open
    }
  }

  getComputedStatus() {
    if (!this.socket) return "Disconnected";
    switch (this.socket.readyState) {
      case WebSocket.OPEN:
        return "Connected";
      case WebSocket.CONNECTING:
        return "Connecting";
      case WebSocket.CLOSING:
        return "Disconnecting";
      case WebSocket.CLOSED:
        return "Disconnected";
      default:
        return "Unknown";
    }
  }

  send(data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
      return true;
    }
    return false;
  }

  handleMessage(event) {
    // This will be overridden by the background script
    console.log("Received message:", event.data);
  }
}

export function sendResponse(socket, type, requestId, data) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(
      JSON.stringify({
        type,
        requestId,
        ...data,
      })
    );
  }
}
