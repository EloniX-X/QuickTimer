chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "startTimer") {
    chrome.alarms.create("quicktimer", { delayInMinutes: message.minutes });
    sendResponse({ status: "alarm set" });
  }
  return true;
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "quicktimer") {
    chrome.storage.local.remove("timerEnd");
    chrome.notifications.create({
      type: "basic",
      iconUrl: "sound.png",
      title: "Timer Done!",
      message: "Time's up!"
    });
    await ensureOffscreenDocument();
    chrome.runtime.sendMessage({ type: "playSound" });
  }
});

async function ensureOffscreenDocument() {
  if (await chrome.offscreen.hasDocument()) return;
  await chrome.offscreen.createDocument({
    url: chrome.runtime.getURL("offscreen.html"),
    reasons: ["AUDIO_PLAYBACK"],
    justification: "Play alarm sound when timer ends."
  });
}
