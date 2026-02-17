// Canvas Connect – Content script
// Injected on PlanitUni pages to bridge chrome.storage ↔ page via window.postMessage

(function () {
  // Listen for status requests from the page
  window.addEventListener('message', (event) => {
    if (event.source !== window) return;

    if (event.data?.type === 'CANVAS_STATUS_REQUEST') {
      // The popup stores everything under canvasState as a single object
      chrome.storage.local.get(['canvasState'], (result) => {
        const s = result.canvasState || {};
        window.postMessage(
          {
            type: 'CANVAS_STATUS_RESPONSE',
            payload: {
              extensionInstalled: true,
              connected: !!s.connected,
              user: s.user?.name || null,
              domain: s.domain || null,
            },
          },
          '*'
        );
      });
    }

    if (event.data?.type === 'CANVAS_PROMPT_LOGIN') {
      const domain = event.data.payload?.domain;
      if (domain) {
        chrome.storage.local.set({ pendingDomain: domain });
      }
    }
  });

  // Announce presence so the page can detect the extension without polling
  window.postMessage(
    { type: 'CANVAS_CONNECT_INSTALLED', payload: { version: '1.0.0' } },
    '*'
  );
})();
