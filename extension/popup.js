const $ = id => document.getElementById(id);

let state = {
  connected: false,
  domain: null,
  server: 'http://localhost:3002', // Demo server
  user: null
};

// Load saved state
chrome.storage.local.get(['canvasState'], (result) => {
  if (result.canvasState) {
    state = { ...state, ...result.canvasState };
    $('domain').value = state.domain || '';
    $('server').value = state.server || 'http://localhost:3002';
    if (state.connected) {
      verifyConnection();
    }
  }
});

function saveState() {
  chrome.storage.local.set({ canvasState: state });
}

function updateUI() {
  const status = $('status');
  const statusText = $('status-text');
  const setupSection = $('setup-section');
  const connectedSection = $('connected-section');

  if (state.connected && state.user) {
    status.className = 'status connected';
    statusText.textContent = 'Connected to Canvas';
    setupSection.classList.add('hidden');
    connectedSection.classList.remove('hidden');
    $('user-name').textContent = state.user.name || 'Unknown';
    $('user-email').textContent = state.user.email || '';
  } else {
    status.className = 'status disconnected';
    statusText.textContent = 'Not connected';
    setupSection.classList.remove('hidden');
    connectedSection.classList.add('hidden');
  }
}

function showError(msg) {
  const error = $('error');
  error.textContent = msg;
  error.classList.remove('hidden');
  setTimeout(() => error.classList.add('hidden'), 5000);
}

function showLoading(msg) {
  $('status').className = 'status loading';
  $('status-text').textContent = msg || 'Loading...';
}

// Get Canvas session cookie
async function getCanvasCookie(domain) {
  return new Promise((resolve) => {
    chrome.cookies.get({
      url: `https://${domain}`,
      name: 'canvas_session'
    }, (cookie) => {
      resolve(cookie ? cookie.value : null);
    });
  });
}

// Connect to Canvas
async function connect() {
  const domain = $('domain').value.trim();
  const server = $('server').value.trim();

  if (!domain) {
    showError('Enter your Canvas domain');
    return;
  }

  if (!domain.includes('instructure.com')) {
    showError('Domain must be *.instructure.com');
    return;
  }

  showLoading('Getting session...');

  const cookie = await getCanvasCookie(domain);

  if (!cookie) {
    showError('Not logged into Canvas. Log in first, then try again.');
    updateUI();
    return;
  }

  showLoading('Connecting to server...');

  try {
    const res = await fetch(`${server}/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domain,
        cookie: `canvas_session=${cookie}`
      })
    });

    const data = await res.json();

    if (data.success && data.user) {
      state = {
        connected: true,
        domain,
        server,
        user: data.user
      };
      saveState();
      updateUI();
    } else {
      throw new Error(data.error || 'Connection failed');
    }

  } catch (err) {
    showError('Failed: ' + err.message);
    updateUI();
  }
}

async function verifyConnection() {
  showLoading('Verifying...');

  try {
    const res = await fetch(`${state.server}/health`);
    const data = await res.json();

    if (data.connected && data.user) {
      state.user = { name: data.user };
      state.connected = true;
    } else {
      // Try to reconnect
      const cookie = await getCanvasCookie(state.domain);
      if (cookie) {
        await connect();
        return;
      }
      state.connected = false;
    }
  } catch {
    state.connected = false;
  }

  saveState();
  updateUI();
}

function disconnect() {
  fetch(`${state.server}/disconnect`, { method: 'POST' }).catch(() => {});
  state = {
    connected: false,
    domain: state.domain,
    server: state.server,
    user: null
  };
  saveState();
  updateUI();
}

function openDemo() {
  chrome.tabs.create({ url: state.server });
}

// Event listeners
$('connect-btn').addEventListener('click', connect);
$('disconnect-btn').addEventListener('click', disconnect);
$('refresh-btn').addEventListener('click', verifyConnection);
$('demo-btn')?.addEventListener('click', openDemo);

updateUI();
