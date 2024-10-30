let recorder = null;
let recordedChunks = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startRecording') {
    startRecording(message.tabId);
  } else if (message.action === 'stopRecording') {
    stopRecording();
  }
});

async function startRecording(tabId) {
  try {
    const stream = await chrome.tabs.captureTab(tabId, { format: 'webm' });
    recordedChunks = [];
    
    recorder = new MediaRecorder(stream);
    
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };
    
    recorder.onstop = saveRecording;
    
    recorder.start();
  } catch (error) {
    console.error('Error starting recording:', error);
  }
}

function stopRecording() {
  if (recorder && recorder.state !== 'inactive') {
    recorder.stop();
  }
}

function saveRecording() {
  const blob = new Blob(recordedChunks, { type: 'video/webm' });
  const url = URL.createObjectURL(blob);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  chrome.downloads.download({
    url: url,
    filename: `test-recording-${timestamp}.webm`
  });
  
  recordedChunks = [];
}