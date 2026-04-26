document.getElementById("save-btn").addEventListener("click", () => {
  const apiKey = document.getElementById("api-key").value;
  chrome.storage.local.set({ openrouter_api_key: apiKey }, () => {
    const status = document.getElementById("status");
    status.textContent = "✅ Saved successfully!";
    status.style.color = "#00ba7c";
    setTimeout(() => { status.textContent = ""; }, 2000);
  });
});

// Load existing key
chrome.storage.local.get(["openrouter_api_key"], (result) => {
  if (result.openrouter_api_key) {
    document.getElementById("api-key").value = result.openrouter_api_key;
  }
});
