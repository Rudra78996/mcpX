let socket = null;

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "connect") {
    connectToServer();
  }
});

function connectToServer() {
  socket = new WebSocket("ws://localhost:3000");

  socket.onopen = () => {
    console.error("Connected to local WS server");
    updatePopupStatus("Connected");
    socket.send(JSON.stringify({ type: "register", role: "extension" }));
  };

  socket.onmessage = async (event) => {
    const msg = JSON.parse(event.data);

    if (msg.type === "snapshot" && msg.url) {
      console.error(`Received snapshot request for: ${msg.url}`);
      const domSnapshot = await takeSnapshotOfURL(msg.url);
      socket.send(JSON.stringify({
        type: "snapshot-result",
        requestId: msg.requestId,
        result: domSnapshot
      }));
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
  chrome.runtime.sendMessage({ action: "status", status });
}

async function takeSnapshotOfURL(url) {
  return new Promise((resolve) => {
    chrome.tabs.create({ url, active: false }, (tab) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          func: () => document.documentElement.outerHTML
        },
        (results) => {
          const snapshot = results?.[0]?.result || "";
          chrome.tabs.remove(tab.id);
          resolve(snapshot);
        }
      );
    });
  });
}
