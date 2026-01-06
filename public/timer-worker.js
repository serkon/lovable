
let intervalId;

self.onmessage = (e) => {
  if (e.data === 'start') {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(() => {
      self.postMessage('tick');
    }, 1000); // Her 1 saniyede bir ana threade mesaj gonder
  } else if (e.data === 'stop') {
    if (intervalId) clearInterval(intervalId);
  }
};

