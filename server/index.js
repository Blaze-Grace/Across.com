import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
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
const VIP_CODES_FILE = path.join(DATA_DIR, 'vip_codes.json');

const VALID_TOOLS = {
  'converse-qa': 'Across ConverseQA',
  'solo-report': 'Across SoloReport',
  'review-flow': 'Across ReviewFlow',
  'commit-track': 'Across CommitTrack',
  'invoice-verify': 'Across InvoiceVerify',
  'order-hub': 'Across OrderHub',
  'ca-docflow': 'Across CA DocFlow',
  'support-lens': 'Across SupportLens'
};

const VIP_TTL_MS = 2 * 60 * 1000; // 2 minutes
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT_MAX = 15;
const vipRateLimitMap = new Map();
const redeemingLocks = new Set();

function hashVipCode(code) {
  return crypto.createHash('sha256').update(String(code).trim().toUpperCase()).digest('hex');
}

function maskVipCode(code) {
  const parts = code.split('-');
  if (parts.length === 4) {
    return `${parts[0]}-${parts[1]}-${parts[2]}-**${parts[3].slice(-2)}`;
  }
  return code.slice(0, 8) + '****';
}

function generateSecureVipCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const randPart = (len) => {
    const bytes = crypto.randomBytes(len);
    let out = '';
    for (let i = 0; i < len; i++) {
      out += chars[bytes[i] % chars.length];
    }
    return out;
  };
  return `AC-VIP-${randPart(4)}-${randPart(4)}`;
}

function syncExpiredCodes(codes) {
  const now = Date.now();
  let changed = false;
  for (const c of codes) {
    if (c.status === 'Unused' && now > new Date(c.expiresAt).getTime()) {
      c.status = 'Expired';
      changed = true;
    }
  }
  return changed;
}

// Initialize storage files if missing with clean empty data (Zero Demo Data)
if (!fs.existsSync(WAITLIST_FILE)) {
  fs.writeFileSync(WAITLIST_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(VIP_CODES_FILE)) {
  fs.writeFileSync(VIP_CODES_FILE, JSON.stringify([], null, 2));
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
  let codeHash = null;
  try {
    const { ip, device } = getClientMeta(req);
    const body = req.body || {};
    const toolSlug = body.toolSlug;
    const rawVipCode = String(body.code || body.vipCode || '').trim().toUpperCase();

    if (!rawVipCode) {
      return res.status(400).json({
        success: false,
        errorCode: 'MISSING_CODE',
        error: 'VIP invitation code is required. Please generate your code to continue.'
      });
    }

    if (!toolSlug || !VALID_TOOLS[toolSlug]) {
      return res.status(400).json({
        success: false,
        errorCode: 'INVALID_TOOL',
        error: 'Please select a valid Across tool for early access.'
      });
    }

    codeHash = hashVipCode(rawVipCode);
    if (redeemingLocks.has(codeHash)) {
      return res.status(409).json({
        success: false,
        errorCode: 'USED_CODE',
        error: 'This invitation code has already been used.'
      });
    }
    redeemingLocks.add(codeHash);

    const vipCodes = JSON.parse(fs.readFileSync(VIP_CODES_FILE, 'utf-8'));
    const expiredChanged = syncExpiredCodes(vipCodes);
    const codeRecord = vipCodes.find((c) => c.codeHash === codeHash);

    if (!codeRecord) {
      if (expiredChanged) fs.writeFileSync(VIP_CODES_FILE, JSON.stringify(vipCodes, null, 2));
      return res.status(400).json({
        success: false,
        errorCode: 'INVALID_CODE',
        error: 'Invalid VIP invitation code. Please check your code and try again.'
      });
    }

    if (codeRecord.status === 'Revoked') {
      if (expiredChanged) fs.writeFileSync(VIP_CODES_FILE, JSON.stringify(vipCodes, null, 2));
      return res.status(400).json({
        success: false,
        errorCode: 'REVOKED_CODE',
        error: 'This invitation code has been revoked. Please generate a new one.'
      });
    }

    if (codeRecord.status === 'Used') {
      if (expiredChanged) fs.writeFileSync(VIP_CODES_FILE, JSON.stringify(vipCodes, null, 2));
      return res.status(400).json({
        success: false,
        errorCode: 'USED_CODE',
        error: 'This invitation code has already been used.'
      });
    }

    if (codeRecord.status === 'Expired' || Date.now() > new Date(codeRecord.expiresAt).getTime()) {
      codeRecord.status = 'Expired';
      fs.writeFileSync(VIP_CODES_FILE, JSON.stringify(vipCodes, null, 2));
      return res.status(400).json({
        success: false,
        errorCode: 'EXPIRED_CODE',
        error: 'Your VIP invitation code has expired. Please generate a new one.'
      });
    }

    if (codeRecord.toolSlug !== toolSlug) {
      if (expiredChanged) fs.writeFileSync(VIP_CODES_FILE, JSON.stringify(vipCodes, null, 2));
      return res.status(400).json({
        success: false,
        errorCode: 'WRONG_TOOL',
        error: `This invitation code is only valid for ${codeRecord.toolName}. Please generate a code for ${VALID_TOOLS[toolSlug]}.`
      });
    }

    const data = JSON.parse(fs.readFileSync(WAITLIST_FILE, 'utf-8'));
    const nextQueue = (data[0] ? (data[0].queueNumber || data.length) : 140) + 1;
    const entryId = body.id || 'wl_' + Date.now();
    const nowIso = new Date().toISOString();

    const entry = {
      id: entryId,
      name: body.name || null,
      email: body.email || null,
      phone: body.phone || null,
      instagram: body.instagram || null,
      preferredContact: body.preferredContact || 'email',
      role: body.role || 'Other',
      vipCodeMasked: codeRecord.codeMasked,
      toolSlug,
      queueNumber: nextQueue,
      device,
      ip,
      status: 'New',
      createdAt: body.createdAt || nowIso
    };

    // Atomic redemption + waitlist write
    codeRecord.status = 'Used';
    codeRecord.redeemedAt = nowIso;
    codeRecord.waitlistId = entryId;
    codeRecord.waitlistContact = [body.name, body.email || body.phone || body.instagram].filter(Boolean).join(' • ');

    fs.writeFileSync(VIP_CODES_FILE, JSON.stringify(vipCodes, null, 2));
    data.unshift(entry);
    fs.writeFileSync(WAITLIST_FILE, JSON.stringify(data, null, 2));

    // Update analytics
    const analytics = JSON.parse(fs.readFileSync(ANALYTICS_FILE, 'utf-8'));
    if (entry.toolSlug && entry.toolSlug !== 'all') {
      analytics.toolClicks[entry.toolSlug] = (analytics.toolClicks[entry.toolSlug] || 0) + 1;
    }
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(analytics, null, 2));

    console.log(`[Waitlist] VIP Signup #${nextQueue} for ${toolSlug} (${codeRecord.codeMasked})`);
    res.json({ success: true, entry, queueNumber: nextQueue, isVip: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save waitlist entry' });
  } finally {
    if (codeHash) redeemingLocks.delete(codeHash);
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
// VIP INVITATION CODE GENERATOR & ADMIN MANAGEMENT API
// ========================================================
app.post('/api/vip-codes/generate', (req, res) => {
  try {
    const { ip } = getClientMeta(req);
    const now = Date.now();
    const history = (vipRateLimitMap.get(ip) || []).filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
    if (history.length >= RATE_LIMIT_MAX) {
      return res.status(429).json({ error: 'Too many VIP code requests. Please wait a few minutes and try again.' });
    }
    history.push(now);
    vipRateLimitMap.set(ip, history);

    const { toolSlug } = req.body || {};
    if (!toolSlug || !VALID_TOOLS[toolSlug]) {
      return res.status(400).json({ error: 'Please select a valid Across tool.' });
    }

    const vipCodes = JSON.parse(fs.readFileSync(VIP_CODES_FILE, 'utf-8'));
    syncExpiredCodes(vipCodes);

    let code = '';
    let codeHash = '';
    for (let attempt = 0; attempt < 10; attempt++) {
      code = generateSecureVipCode();
      codeHash = hashVipCode(code);
      if (!vipCodes.some((c) => c.codeHash === codeHash)) break;
    }

    const createdAt = new Date(now).toISOString();
    const expiresAt = new Date(now + VIP_TTL_MS).toISOString();

    const record = {
      id: 'vip_' + now + '_' + crypto.randomBytes(2).toString('hex'),
      codeHash,
      codeMasked: maskVipCode(code),
      toolSlug,
      toolName: VALID_TOOLS[toolSlug],
      status: 'Unused',
      createdAt,
      expiresAt,
      redeemedAt: null,
      revokedAt: null,
      waitlistId: null,
      waitlistContact: null
    };

    vipCodes.unshift(record);
    fs.writeFileSync(VIP_CODES_FILE, JSON.stringify(vipCodes, null, 2));

    res.json({
      success: true,
      code,
      toolSlug,
      toolName: record.toolName,
      createdAt,
      expiresAt,
      serverNow: createdAt
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate VIP code' });
  }
});

app.post('/api/vip-codes/check', (req, res) => {
  try {
    const rawCode = String(req.body?.code || '').trim().toUpperCase();
    if (!rawCode) {
      return res.status(400).json({ valid: false, status: 'Invalid' });
    }
    const codeHash = hashVipCode(rawCode);
    const vipCodes = JSON.parse(fs.readFileSync(VIP_CODES_FILE, 'utf-8'));
    const changed = syncExpiredCodes(vipCodes);
    if (changed) fs.writeFileSync(VIP_CODES_FILE, JSON.stringify(vipCodes, null, 2));

    const record = vipCodes.find((c) => c.codeHash === codeHash);
    if (!record) {
      return res.json({ valid: false, status: 'Invalid', serverNow: new Date().toISOString() });
    }
    return res.json({
      valid: record.status === 'Unused',
      status: record.status,
      toolSlug: record.toolSlug,
      toolName: record.toolName,
      createdAt: record.createdAt,
      expiresAt: record.expiresAt,
      serverNow: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify code status' });
  }
});

app.get('/api/admin/vip-codes', (req, res) => {
  const passcode = req.headers['x-admin-passcode'];
  if (passcode !== ADMIN_PASSCODE) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const vipCodes = JSON.parse(fs.readFileSync(VIP_CODES_FILE, 'utf-8'));
    const changed = syncExpiredCodes(vipCodes);
    if (changed) fs.writeFileSync(VIP_CODES_FILE, JSON.stringify(vipCodes, null, 2));

    const stats = {
      total: vipCodes.length,
      unused: vipCodes.filter((c) => c.status === 'Unused').length,
      used: vipCodes.filter((c) => c.status === 'Used').length,
      expired: vipCodes.filter((c) => c.status === 'Expired').length,
      revoked: vipCodes.filter((c) => c.status === 'Revoked').length
    };
    res.json({ codes: vipCodes, stats });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load VIP codes' });
  }
});

app.post('/api/admin/vip-codes/:id/revoke', (req, res) => {
  const passcode = req.headers['x-admin-passcode'];
  if (passcode !== ADMIN_PASSCODE) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const vipCodes = JSON.parse(fs.readFileSync(VIP_CODES_FILE, 'utf-8'));
    syncExpiredCodes(vipCodes);
    const record = vipCodes.find((c) => c.id === req.params.id);
    if (!record) return res.status(404).json({ error: 'Code not found' });
    if (record.status !== 'Unused') {
      return res.status(400).json({ error: `Cannot revoke code with status: ${record.status}` });
    }
    record.status = 'Revoked';
    record.revokedAt = new Date().toISOString();
    fs.writeFileSync(VIP_CODES_FILE, JSON.stringify(vipCodes, null, 2));
    res.json({ success: true, record });
  } catch (err) {
    res.status(500).json({ error: 'Failed to revoke code' });
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
