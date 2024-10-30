let events = [];

function recordEvent(event) {
  const eventData = {
    type: event.type,
    target: {
      tagName: event.target.tagName,
      id: event.target.id,
      className: event.target.className
    },
    timestamp: new Date().toISOString()
  };
  
  if (event.type === 'click') {
    eventData.coordinates = {
      x: event.clientX,
      y: event.clientY
    };
  } else if (event.type === 'input') {
    eventData.value = event.target.value;
  }
  
  events.push(eventData);
}

// Listen for user interactions
document.addEventListener('click', recordEvent, true);
document.addEventListener('input', recordEvent, true);
document.addEventListener('keydown', recordEvent, true);

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === 'getEvents') {
    sendResponse(events);
    events = []; // Clear events after sending
  }
});