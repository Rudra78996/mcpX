document.getElementById("connectBtn").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "connect" });
});
