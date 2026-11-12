import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Secret Founder Passcode
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'across2026';

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const WAITLIST_FILE = path.join(DATA_DIR, 'waitlist.json');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');
const SAAS_DEMAND_FILE = path.join(DATA_DIR, 'saas_requests.json');

// Initialize storage files if missing with clean empty data (Zero Demo Data)
if (!fs.existsSync(WAITLIST_FILE)) {
  fs.writeFileSync(WAITLIST_FILE, JSON.stringify([], null, 2));
}

if (!fs.existsSync(SAAS_DEMAND_FILE)) {
  fs.writeFileSync(SAAS_DEMAND_FILE, JSON.stringify([], null, 2));
}

if (!fs.existsSync(ANALYTICS_FILE)) {
  fs.writeFileSync(ANALYTICS_FILE, JSON.stringify({
    pageVisits: 0,
    toolClicks: {},
    sandboxRuns: {},
    deviceStats: {
      desktop: 0,
      mobile: 0
    }
  }, null, 2));
}

// Helper: Extract client IP & device metadata
function getClientMeta(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? forwarded.split(',')[0].trim() : req.socket.remoteAddress || '127.0.0.1';
  const ua = req.headers['user-agent'] || '';

  let device = 'Desktop';
  if (/mobile|android|iphone|ipad|phone/i.test(ua)) {
    device = /ipad|tablet/i.test(ua) ? 'Tablet' : 'Mobile';
  }
  if (/windows/i.test(ua)) device += ' (Windows)';
  else if (/macintosh|mac os x/i.test(ua)) device += ' (macOS)';
  else if (/android/i.test(ua)) device += ' (Android)';
  else if (/iphone|ios/i.test(ua)) device += ' (iOS)';
  else if (/linux/i.test(ua)) device += ' (Linux)';

  return { ip, device };
}

// ========================================================
// FOUNDER AUTHENTICATION GATE
// ========================================================
app.post('/api/admin/auth', (req, res) => {
  const { passcode } = req.body;
  if (passcode === ADMIN_PASSCODE) {
    const token = 'founder_token_' + Buffer.from(Date.now().toString()).toString('base64');
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, error: 'Incorrect Passcode. Access Denied.' });
  }
});

// ========================================================
// SAAS ON DEMAND INQUIRIES API (WORLDWIDE CAPTURE)
// ========================================================
app.get('/api/saas-on-demand', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(SAAS_DEMAND_FILE, 'utf-8'));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read requests' });
  }
});

app.post('/api/saas-on-demand', (req, res) => {
  try {
    const { ip, device } = getClientMeta(req);
    const body = req.body;

    const requestItem = {
      id: body.id || 'req_' + Date.now(),
      category: body.category || 'Custom Internal Tool',
      toolNameIdea: body.toolNameIdea || 'Custom SaaS Tool',
      description: body.description || '',
      currentWorkaround: body.currentWorkaround || '',
      targetUsers: body.targetUsers || '',
      email: body.email || null,
      whatsapp: body.whatsapp || null,
      phone: body.phone || null,
      instagram: body.instagram || null,
      device,
      ip,
      status: 'New',
      createdAt: body.createdAt || new Date().toISOString()
    };

    const data = JSON.parse(fs.readFileSync(SAAS_DEMAND_FILE, 'utf-8'));
    data.unshift(requestItem);
    fs.writeFileSync(SAAS_DEMAND_FILE, JSON.stringify(data, null, 2));

    console.log(`[SaaS on Demand] New submission from ${ip} (${device}): ${requestItem.toolNameIdea}`);
    res.json({ success: true, requestItem });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save SaaS request' });
  }
});

app.patch('/api/saas-on-demand/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const data = JSON.parse(fs.readFileSync(SAAS_DEMAND_FILE, 'utf-8'));
    const item = data.find(r => r.id === id);
    if (item) {
      item.status = status;
      fs.writeFileSync(SAAS_DEMAND_FILE, JSON.stringify(data, null, 2));
      res.json({ success: true, item });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update request' });
  }
});

app.delete('/api/saas-on-demand/:id', (req, res) => {
  try {
    const { id } = req.params;
    let data = JSON.parse(fs.readFileSync(SAAS_DEMAND_FILE, 'utf-8'));
    data = data.filter(r => r.id !== id);
    fs.writeFileSync(SAAS_DEMAND_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

// ========================================================
// EARLY ACCESS WAITLIST API (WORLDWIDE CAPTURE)
// ========================================================
app.get('/api/waitlist', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(WAITLIST_FILE, 'utf-8'));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read waitlist' });
  }
});

app.post('/api/waitlist', (req, res) => {
  try {
    const { ip, device } = getClientMeta(req);
    const body = req.body;

    const data = JSON.parse(fs.readFileSync(WAITLIST_FILE, 'utf-8'));
    const nextQueue = (data[0] ? (data[0].queueNumber || data.length) : 140) + 1;

    const entry = {
      id: body.id || 'wl_' + Date.now(),
      email: body.email,
      role: body.role || 'Other',
      code: body.code || null,
      toolSlug: body.toolSlug || 'all',
      queueNumber: nextQueue,
      device,
      ip,
      status: 'New',
      createdAt: body.createdAt || new Date().toISOString()
    };

    data.unshift(entry);
    fs.writeFileSync(WAITLIST_FILE, JSON.stringify(data, null, 2));

    // Update analytics
    const analytics = JSON.parse(fs.readFileSync(ANALYTICS_FILE, 'utf-8'));
    if (entry.toolSlug && entry.toolSlug !== 'all') {
      analytics.toolClicks[entry.toolSlug] = (analytics.toolClicks[entry.toolSlug] || 0) + 1;
    }
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(analytics, null, 2));

    console.log(`[Waitlist] New signup from ${ip} (${device}): ${entry.email} (Queue #${nextQueue})`);
    res.json({ success: true, entry, queueNumber: nextQueue });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save waitlist entry' });
  }
});

app.patch('/api/waitlist/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const data = JSON.parse(fs.readFileSync(WAITLIST_FILE, 'utf-8'));
    const item = data.find(w => w.id === id);
    if (item) {
      item.status = status;
      fs.writeFileSync(WAITLIST_FILE, JSON.stringify(data, null, 2));
      res.json({ success: true, item });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update waitlist item' });
  }
});

app.delete('/api/waitlist/:id', (req, res) => {
  try {
    const { id } = req.params;
    let data = JSON.parse(fs.readFileSync(WAITLIST_FILE, 'utf-8'));
    data = data.filter(w => w.id !== id);
    fs.writeFileSync(WAITLIST_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

// ========================================================
// TELEMETRY & ANALYTICS API
// ========================================================
app.get('/api/analytics', (req, res) => {
  try {
    const analytics = JSON.parse(fs.readFileSync(ANALYTICS_FILE, 'utf-8'));
    const waitlist = JSON.parse(fs.readFileSync(WAITLIST_FILE, 'utf-8'));
    const saasRequests = JSON.parse(fs.readFileSync(SAAS_DEMAND_FILE, 'utf-8'));

    res.json({
      ...analytics,
      waitlistCount: waitlist.length,
      saasRequestsCount: saasRequests.length
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read analytics' });
  }
});

app.post('/api/analytics/event', (req, res) => {
  try {
    const { type, slug } = req.body;
    const { device } = getClientMeta(req);
    const analytics = JSON.parse(fs.readFileSync(ANALYTICS_FILE, 'utf-8'));

    if (type === 'visit') {
      analytics.pageVisits++;
      if (device.includes('Mobile')) {
        analytics.deviceStats.mobile++;
      } else {
        analytics.deviceStats.desktop++;
      }
    }
    if (type === 'tool_click' && slug) analytics.toolClicks[slug] = (analytics.toolClicks[slug] || 0) + 1;
    if (type === 'sandbox_run' && slug) analytics.sandboxRuns[slug] = (analytics.sandboxRuns[slug] || 0) + 1;

    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(analytics, null, 2));
    res.json({ success: true, analytics });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// ========================================================
// PURGE / RESET DEMO DATA ENDPOINT
// ========================================================
app.post('/api/admin/clear-demo', (req, res) => {
  try {
    const { passcode } = req.body;
    if (passcode !== ADMIN_PASSCODE) {
      return res.status(401).json({ error: 'Unauthorized passcode' });
    }
    fs.writeFileSync(WAITLIST_FILE, JSON.stringify([], null, 2));
    fs.writeFileSync(SAAS_DEMAND_FILE, JSON.stringify([], null, 2));
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify({
      pageVisits: 0,
      toolClicks: {},
      sandboxRuns: {},
      deviceStats: { desktop: 0, mobile: 0 }
    }, null, 2));
    res.json({ success: true, message: 'All demo data has been purged successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to purge data' });
  }
});

// ========================================================
// STATIC SERVING OF PRODUCTION BUILD (UNIFIED FULL-STACK)
// ========================================================
const DIST_DIR = path.join(__dirname, '..', 'dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get('*', (req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Across Full-Stack OS Server running on http://0.0.0.0:${PORT}`);
});
