let recording = false;

document.getElementById('startRecord').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.runtime.sendMessage({ action: 'startRecording', tabId: tab.id });
  
  document.getElementById('startRecord').disabled = true;
  document.getElementById('stopRecord').disabled = false;
  document.getElementById('status').textContent = 'Recording...';
  recording = true;
});

document.getElementById('stopRecord').addEventListener('click', async () => {
  chrome.runtime.sendMessage({ action: 'stopRecording' });
  
  document.getElementById('startRecord').disabled = false;
  document.getElementById('stopRecord').disabled = true;
  document.getElementById('status').textContent = 'Recording saved!';
  recording = false;
});