let intervalId = null;

function updateTimerUI(endTime) {
  clearInterval(intervalId);

  function update() {
    const remaining = endTime - Date.now();
    if (remaining <= 0) {
      clearInterval(intervalId);
      document.getElementById("timer").innerText = "0:00";
      chrome.storage.local.remove("timerEnd");
      return;
    }
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000).toString().padStart(2, '0');
    document.getElementById("timer").innerText = `${mins}:${secs}`;
  }

  update();
  intervalId = setInterval(update, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get("timerEnd", (result) => {
    const endTime = result.timerEnd;
    if (endTime && endTime > Date.now()) {
      updateTimerUI(endTime);
    } else {
      document.getElementById("timer").innerText = "0:00";
    }
  });
});

document.addEventListener('click', function(event) {
  if (event.target.classList.contains('btn')) {
    const val = +event.target.id;
    const input = document.getElementById("inp");
    input.value = (+input.value || 0) + val;
  }
});

document.getElementById("sbmtbutton").onclick = function () {
  const val = +document.getElementById("inp").value;
  if (val <= 0) return;

  const endTime = Date.now() + val * 60000;
  chrome.storage.local.set({ timerEnd: endTime });
  chrome.runtime.sendMessage({ type: "startTimer", minutes: val });
  updateTimerUI(endTime);
};
