chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "playSound") {
    const audio = new Audio(chrome.runtime.getURL("alarm.mp3"));
    audio.play();
    sendResponse({ success: true });
  }
});
