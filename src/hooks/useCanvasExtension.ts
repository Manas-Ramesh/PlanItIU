'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface CanvasExtensionState {
  extensionInstalled: boolean;
  connected: boolean;
  user: string | null;
  loading: boolean;
}

/** How long to wait on first load before deciding the extension isn't there. */
const INITIAL_TIMEOUT_MS = 2000;
/** How often to re-poll the extension for connection changes. */
const POLL_INTERVAL_MS = 3000;

export function useCanvasExtension() {
  const [state, setState] = useState<CanvasExtensionState>({
    extensionInstalled: false,
    connected: false,
    user: null,
    loading: true,
  });
  const detectedRef = useRef(false);

  useEffect(() => {
    let initialTimer: ReturnType<typeof setTimeout> | null = null;
    let pollTimer: ReturnType<typeof setInterval> | null = null;

    function handleMessage(event: MessageEvent) {
      if (event.source !== window) return;

      if (event.data?.type === 'CANVAS_CONNECT_INSTALLED') {
        // Extension announced itself — ask for full status
        detectedRef.current = true;
        window.postMessage({ type: 'CANVAS_STATUS_REQUEST' }, '*');
        return;
      }

      if (event.data?.type === 'CANVAS_STATUS_RESPONSE') {
        detectedRef.current = true;
        if (initialTimer) {
          clearTimeout(initialTimer);
          initialTimer = null;
        }
        const payload = event.data.payload;
        setState({
          extensionInstalled: true,
          connected: !!payload?.connected,
          user: payload?.user ?? null,
          loading: false,
        });
      }
    }

    window.addEventListener('message', handleMessage);

    // Initial request
    window.postMessage({ type: 'CANVAS_STATUS_REQUEST' }, '*');

    // If no response after timeout, mark as not installed
    initialTimer = setTimeout(() => {
      if (!detectedRef.current) {
        setState({ extensionInstalled: false, connected: false, user: null, loading: false });
      }
    }, INITIAL_TIMEOUT_MS);

    // Keep polling so we pick up connection changes (user clicks extension, logs into Canvas, etc.)
    pollTimer = setInterval(() => {
      window.postMessage({ type: 'CANVAS_STATUS_REQUEST' }, '*');
    }, POLL_INTERVAL_MS);

    return () => {
      window.removeEventListener('message', handleMessage);
      if (initialTimer) clearTimeout(initialTimer);
      if (pollTimer) clearInterval(pollTimer);
    };
  }, []);

  const promptCanvasLogin = useCallback((domain: string) => {
    window.postMessage({ type: 'CANVAS_PROMPT_LOGIN', payload: { domain } }, '*');
  }, []);

  return { ...state, promptCanvasLogin };
}
