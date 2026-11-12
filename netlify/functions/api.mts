import type { Context } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

const STORE_NAME = 'across-data';
const WAITLIST_KEY = 'waitlist';
const SAAS_DEMAND_KEY = 'saas_requests';
const ANALYTICS_KEY = 'analytics';
const VIP_CODES_KEY = 'vip_codes';
const RATE_LIMIT_KEY = 'vip_rate_limits';

const VIP_TTL_MS = 2 * 60 * 1000; // 2 minutes
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT_MAX = 15;

const VALID_TOOLS: Record<string, string> = {
  'converse-qa': 'Across ConverseQA',
  'solo-report': 'Across SoloReport',
  'review-flow': 'Across ReviewFlow',
  'commit-track': 'Across CommitTrack',
  'invoice-verify': 'Across InvoiceVerify',
  'order-hub': 'Across OrderHub',
  'ca-docflow': 'Across CA DocFlow',
  'support-lens': 'Across SupportLens',
};

interface AnalyticsData {
  pageVisits: number;
  toolClicks: Record<string, number>;
  sandboxRuns: Record<string, number>;
  deviceStats: {
    desktop: number;
    mobile: number;
  };
}

interface VipCodeRecord {
  id: string;
  codeHash: string;
  codeMasked: string;
  toolSlug: string;
  toolName: string;
  status: 'Unused' | 'Used' | 'Expired' | 'Revoked';
  createdAt: string;
  expiresAt: string;
  redeemedAt: string | null;
  revokedAt: string | null;
  waitlistId: string | null;
  waitlistContact: string | null;
}

const DEFAULT_ANALYTICS: AnalyticsData = {
  pageVisits: 0,
  toolClicks: {},
  sandboxRuns: {},
  deviceStats: { desktop: 0, mobile: 0 },
};

async function hashVipCode(code: string): Promise<string> {
  const bytes = new TextEncoder().encode(code.trim().toUpperCase());
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function maskVipCode(code: string): string {
  const parts = code.split('-');
  if (parts.length === 4) {
    return `${parts[0]}-${parts[1]}-${parts[2]}-**${parts[3].slice(-2)}`;
  }
  return code.slice(0, 8) + '****';
}

function generateSecureVipCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const randPart = (len: number) => {
    const bytes = new Uint8Array(len);
    crypto.getRandomValues(bytes);
    let out = '';
    for (let i = 0; i < len; i++) {
      out += chars[bytes[i] % chars.length];
    }
    return out;
  };
  return `AC-VIP-${randPart(4)}-${randPart(4)}`;
}

function randomHex(byteLen: number): string {
  const bytes = new Uint8Array(byteLen);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function syncExpiredCodes(codes: VipCodeRecord[]): boolean {
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

function getClientMeta(req: Request, context: Context) {
  const ip =
    context.ip ||
    req.headers.get('x-nf-client-connection-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    'unknown';
  const ua = req.headers.get('user-agent') || '';

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

async function readArray<T = Record<string, unknown>>(store: ReturnType<typeof getStore>, key: string): Promise<T[]> {
  const data = await store.get(key, { type: 'json' });
  return Array.isArray(data) ? (data as T[]) : [];
}

async function readAnalytics(store: ReturnType<typeof getStore>): Promise<AnalyticsData> {
  const data = (await store.get(ANALYTICS_KEY, { type: 'json' })) as Partial<AnalyticsData> | null;
  if (!data) return { ...DEFAULT_ANALYTICS, toolClicks: {}, sandboxRuns: {}, deviceStats: { desktop: 0, mobile: 0 } };
  return {
    pageVisits: data.pageVisits ?? 0,
    toolClicks: data.toolClicks ?? {},
    sandboxRuns: data.sandboxRuns ?? {},
    deviceStats: data.deviceStats ?? { desktop: 0, mobile: 0 },
  };
}

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  let path = url.pathname.replace(/\/+$/, '');
  if (path.startsWith('/.netlify/functions/api')) {
    path = '/api' + path.slice('/.netlify/functions/api'.length);
  }
  const method = req.method.toUpperCase();
  const passcodeEnv = Netlify.env.get('ADMIN_PASSCODE') || 'across2026';

  try {
    const store = getStore({ name: STORE_NAME, consistency: 'strong' });

    // 1. Founder Authentication Gate
    if (path === '/api/admin/auth' && method === 'POST') {
      const { passcode } = (await req.json()) as { passcode?: string };
      if (passcode === passcodeEnv) {
        const token = 'founder_token_' + btoa(Date.now().toString());
        return Response.json({ success: true, token });
      }
      return Response.json({ success: false, error: 'Incorrect Passcode. Access Denied.' }, { status: 401 });
    }

    // 2. Clear Demo / Reset Data
    if (path === '/api/admin/clear-demo' && method === 'POST') {
      const { passcode } = (await req.json()) as { passcode?: string };
      if (passcode !== passcodeEnv) {
        return Response.json({ error: 'Unauthorized passcode' }, { status: 401 });
      }
      await store.setJSON(WAITLIST_KEY, []);
      await store.setJSON(SAAS_DEMAND_KEY, []);
      await store.setJSON(ANALYTICS_KEY, DEFAULT_ANALYTICS);
      return Response.json({ success: true, message: 'All demo data has been purged successfully.' });
    }

    // 3. VIP Code Generation & Status Check
    if (path === '/api/vip-codes/generate' && method === 'POST') {
      const { ip } = getClientMeta(req, context);
      const now = Date.now();
      const rateLimits = ((await store.get(RATE_LIMIT_KEY, { type: 'json' })) as Record<string, number[]>) || {};
      const history = (rateLimits[ip] || []).filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
      if (history.length >= RATE_LIMIT_MAX) {
        return Response.json(
          { error: 'Too many VIP code requests. Please wait a few minutes and try again.' },
          { status: 429 }
        );
      }
      history.push(now);
      rateLimits[ip] = history;
      await store.setJSON(RATE_LIMIT_KEY, rateLimits);

      const { toolSlug } = (await req.json()) as { toolSlug?: string };
      if (!toolSlug || !VALID_TOOLS[toolSlug]) {
        return Response.json({ error: 'Please select a valid Across tool.' }, { status: 400 });
      }

      const vipCodes = await readArray<VipCodeRecord>(store, VIP_CODES_KEY);
      syncExpiredCodes(vipCodes);

      let code = '';
      let codeHash = '';
      for (let attempt = 0; attempt < 10; attempt++) {
        code = generateSecureVipCode();
        codeHash = await hashVipCode(code);
        if (!vipCodes.some((c) => c.codeHash === codeHash)) break;
      }

      const createdAt = new Date(now).toISOString();
      const expiresAt = new Date(now + VIP_TTL_MS).toISOString();
      const record: VipCodeRecord = {
        id: 'vip_' + now + '_' + randomHex(2),
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
        waitlistContact: null,
      };

      vipCodes.unshift(record);
      await store.setJSON(VIP_CODES_KEY, vipCodes);

      return Response.json({
        success: true,
        code,
        toolSlug,
        toolName: record.toolName,
        createdAt,
        expiresAt,
        serverNow: createdAt,
      });
    }

    if (path === '/api/vip-codes/check' && method === 'POST') {
      const { code: rawCode } = (await req.json()) as { code?: string };
      const normalized = String(rawCode || '').trim().toUpperCase();
      if (!normalized) {
        return Response.json({ valid: false, status: 'Invalid' }, { status: 400 });
      }
      const codeHash = await hashVipCode(normalized);
      const vipCodes = await readArray<VipCodeRecord>(store, VIP_CODES_KEY);
      const changed = syncExpiredCodes(vipCodes);
      if (changed) await store.setJSON(VIP_CODES_KEY, vipCodes);

      const record = vipCodes.find((c) => c.codeHash === codeHash);
      if (!record) {
        return Response.json({ valid: false, status: 'Invalid', serverNow: new Date().toISOString() });
      }
      return Response.json({
        valid: record.status === 'Unused',
        status: record.status,
        toolSlug: record.toolSlug,
        toolName: record.toolName,
        createdAt: record.createdAt,
        expiresAt: record.expiresAt,
        serverNow: new Date().toISOString(),
      });
    }

    if (path === '/api/admin/vip-codes' && method === 'GET') {
      if (req.headers.get('x-admin-passcode') !== passcodeEnv) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const vipCodes = await readArray<VipCodeRecord>(store, VIP_CODES_KEY);
      const changed = syncExpiredCodes(vipCodes);
      if (changed) await store.setJSON(VIP_CODES_KEY, vipCodes);

      const stats = {
        total: vipCodes.length,
        unused: vipCodes.filter((c) => c.status === 'Unused').length,
        used: vipCodes.filter((c) => c.status === 'Used').length,
        expired: vipCodes.filter((c) => c.status === 'Expired').length,
        revoked: vipCodes.filter((c) => c.status === 'Revoked').length,
      };
      return Response.json({ codes: vipCodes, stats });
    }

    if (path.startsWith('/api/admin/vip-codes/') && path.endsWith('/revoke') && method === 'POST') {
      if (req.headers.get('x-admin-passcode') !== passcodeEnv) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const id = decodeURIComponent(path.slice('/api/admin/vip-codes/'.length, -'/revoke'.length));
      const vipCodes = await readArray<VipCodeRecord>(store, VIP_CODES_KEY);
      syncExpiredCodes(vipCodes);
      const record = vipCodes.find((c) => c.id === id);
      if (!record) return Response.json({ error: 'Code not found' }, { status: 404 });
      if (record.status !== 'Unused') {
        return Response.json({ error: `Cannot revoke code with status: ${record.status}` }, { status: 400 });
      }
      record.status = 'Revoked';
      record.revokedAt = new Date().toISOString();
      await store.setJSON(VIP_CODES_KEY, vipCodes);
      return Response.json({ success: true, record });
    }

    // 4. SaaS on Demand API
    if (path === '/api/saas-on-demand' && method === 'GET') {
      const data = await readArray(store, SAAS_DEMAND_KEY);
      return Response.json(data);
    }

    if (path === '/api/saas-on-demand' && method === 'POST') {
      const { ip, device } = getClientMeta(req, context);
      const body = (await req.json()) as Record<string, unknown>;
      const requestItem = {
        id: (body.id as string) || 'req_' + Date.now(),
        category: (body.category as string) || 'Custom Internal Tool',
        toolNameIdea: (body.toolNameIdea as string) || 'Custom SaaS Tool',
        description: (body.description as string) || '',
        currentWorkaround: (body.currentWorkaround as string) || '',
        targetUsers: (body.targetUsers as string) || '',
        email: (body.email as string) || null,
        whatsapp: (body.whatsapp as string) || null,
        phone: (body.phone as string) || null,
        instagram: (body.instagram as string) || null,
        device,
        ip,
        status: 'New',
        createdAt: (body.createdAt as string) || new Date().toISOString(),
      };
      const data = await readArray(store, SAAS_DEMAND_KEY);
      data.unshift(requestItem);
      await store.setJSON(SAAS_DEMAND_KEY, data);
      return Response.json({ success: true, requestItem });
    }

    if (path.startsWith('/api/saas-on-demand/')) {
      const id = decodeURIComponent(path.slice('/api/saas-on-demand/'.length));
      if (method === 'PATCH') {
        const { status } = (await req.json()) as { status?: string };
        const data = await readArray<Record<string, unknown> & { id: string; status?: string }>(store, SAAS_DEMAND_KEY);
        const item = data.find((r) => r.id === id);
        if (!item) return Response.json({ error: 'Item not found' }, { status: 404 });
        item.status = status;
        await store.setJSON(SAAS_DEMAND_KEY, data);
        return Response.json({ success: true, item });
      }
      if (method === 'DELETE') {
        const data = await readArray<{ id: string }>(store, SAAS_DEMAND_KEY);
        const filtered = data.filter((r) => r.id !== id);
        await store.setJSON(SAAS_DEMAND_KEY, filtered);
        return Response.json({ success: true });
      }
    }

    // 5. Waitlist API (With Atomic VIP Invitation Code Validation & Redemption)
    if (path === '/api/waitlist' && method === 'GET') {
      const data = await readArray(store, WAITLIST_KEY);
      return Response.json(data);
    }

    if (path === '/api/waitlist' && method === 'POST') {
      const { ip, device } = getClientMeta(req, context);
      const body = (await req.json()) as Record<string, unknown>;
      const toolSlug = String(body.toolSlug || '');
      const rawVipCode = String(body.code || body.vipCode || '').trim().toUpperCase();

      if (!rawVipCode) {
        return Response.json(
          {
            success: false,
            errorCode: 'MISSING_CODE',
            error: 'VIP invitation code is required. Please generate your code to continue.',
          },
          { status: 400 }
        );
      }

      if (!toolSlug || !VALID_TOOLS[toolSlug]) {
        return Response.json(
          {
            success: false,
            errorCode: 'INVALID_TOOL',
            error: 'Please select a valid Across tool for early access.',
          },
          { status: 400 }
        );
      }

      const codeHash = await hashVipCode(rawVipCode);
      const vipCodes = await readArray<VipCodeRecord>(store, VIP_CODES_KEY);
      const expiredChanged = syncExpiredCodes(vipCodes);
      const codeRecord = vipCodes.find((c) => c.codeHash === codeHash);

      if (!codeRecord) {
        if (expiredChanged) await store.setJSON(VIP_CODES_KEY, vipCodes);
        return Response.json(
          {
            success: false,
            errorCode: 'INVALID_CODE',
            error: 'Invalid VIP invitation code. Please check your code and try again.',
          },
          { status: 400 }
        );
      }

      if (codeRecord.status === 'Revoked') {
        if (expiredChanged) await store.setJSON(VIP_CODES_KEY, vipCodes);
        return Response.json(
          {
            success: false,
            errorCode: 'REVOKED_CODE',
            error: 'This invitation code has been revoked. Please generate a new one.',
          },
          { status: 400 }
        );
      }

      if (codeRecord.status === 'Used') {
        if (expiredChanged) await store.setJSON(VIP_CODES_KEY, vipCodes);
        return Response.json(
          {
            success: false,
            errorCode: 'USED_CODE',
            error: 'This invitation code has already been used.',
          },
          { status: 400 }
        );
      }

      if (codeRecord.status === 'Expired' || Date.now() > new Date(codeRecord.expiresAt).getTime()) {
        codeRecord.status = 'Expired';
        await store.setJSON(VIP_CODES_KEY, vipCodes);
        return Response.json(
          {
            success: false,
            errorCode: 'EXPIRED_CODE',
            error: 'Your VIP invitation code has expired. Please generate a new one.',
          },
          { status: 400 }
        );
      }

      if (codeRecord.toolSlug !== toolSlug) {
        if (expiredChanged) await store.setJSON(VIP_CODES_KEY, vipCodes);
        return Response.json(
          {
            success: false,
            errorCode: 'WRONG_TOOL',
            error: `This invitation code is only valid for ${codeRecord.toolName}. Please generate a code for ${VALID_TOOLS[toolSlug]}.`,
          },
          { status: 400 }
        );
      }

      // Atomic distributed lock using Netlify Blobs `onlyIfNew`
      const lockResult = await store.setJSON(
        `vip_lock_${codeHash}`,
        { lockedAt: new Date().toISOString() },
        { onlyIfNew: true }
      );
      if (!lockResult.modified) {
        return Response.json(
          {
            success: false,
            errorCode: 'USED_CODE',
            error: 'This invitation code has already been used.',
          },
          { status: 409 }
        );
      }

      const data = await readArray<Record<string, unknown> & { queueNumber?: number }>(store, WAITLIST_KEY);
      const nextQueue = (data[0]?.queueNumber || data.length || 140) + 1;
      const entryId = (body.id as string) || 'wl_' + Date.now();
      const nowIso = new Date().toISOString();

      const entry = {
        id: entryId,
        name: (body.name as string) || null,
        email: (body.email as string) || null,
        phone: (body.phone as string) || null,
        instagram: (body.instagram as string) || null,
        preferredContact: (body.preferredContact as string) || 'email',
        role: (body.role as string) || 'Other',
        vipCodeMasked: codeRecord.codeMasked,
        toolSlug,
        queueNumber: nextQueue,
        device,
        ip,
        status: 'New',
        createdAt: (body.createdAt as string) || nowIso,
      };

      codeRecord.status = 'Used';
      codeRecord.redeemedAt = nowIso;
      codeRecord.waitlistId = entryId;
      codeRecord.waitlistContact = [body.name, body.email || body.phone || body.instagram].filter(Boolean).join(' • ');

      await store.setJSON(VIP_CODES_KEY, vipCodes);
      data.unshift(entry);
      await store.setJSON(WAITLIST_KEY, data);

      if (entry.toolSlug && entry.toolSlug !== 'all') {
        const analytics = await readAnalytics(store);
        analytics.toolClicks[entry.toolSlug] = (analytics.toolClicks[entry.toolSlug] || 0) + 1;
        await store.setJSON(ANALYTICS_KEY, analytics);
      }

      return Response.json({ success: true, entry, queueNumber: nextQueue, isVip: true });
    }

    if (path.startsWith('/api/waitlist/')) {
      const id = decodeURIComponent(path.slice('/api/waitlist/'.length));
      if (method === 'PATCH') {
        const { status } = (await req.json()) as { status?: string };
        const data = await readArray<Record<string, unknown> & { id: string; status?: string }>(store, WAITLIST_KEY);
        const item = data.find((w) => w.id === id);
        if (!item) return Response.json({ error: 'Item not found' }, { status: 404 });
        item.status = status;
        await store.setJSON(WAITLIST_KEY, data);
        return Response.json({ success: true, item });
      }
      if (method === 'DELETE') {
        const data = await readArray<{ id: string }>(store, WAITLIST_KEY);
        const filtered = data.filter((w) => w.id !== id);
        await store.setJSON(WAITLIST_KEY, filtered);
        return Response.json({ success: true });
      }
    }

    // 6. Telemetry & Analytics API
    if (path === '/api/analytics' && method === 'GET') {
      const [analytics, waitlist, saasRequests] = await Promise.all([
        readAnalytics(store),
        readArray(store, WAITLIST_KEY),
        readArray(store, SAAS_DEMAND_KEY),
      ]);
      return Response.json({
        ...analytics,
        waitlistCount: waitlist.length,
        saasRequestsCount: saasRequests.length,
      });
    }

    if (path === '/api/analytics/event' && method === 'POST') {
      const { type, slug } = (await req.json()) as { type?: string; slug?: string };
      const { device } = getClientMeta(req, context);
      const analytics = await readAnalytics(store);

      if (type === 'visit') {
        analytics.pageVisits++;
        if (device.includes('Mobile')) analytics.deviceStats.mobile++;
        else analytics.deviceStats.desktop++;
      }
      if (type === 'tool_click' && slug) {
        analytics.toolClicks[slug] = (analytics.toolClicks[slug] || 0) + 1;
      }
      if (type === 'sandbox_run' && slug) {
        analytics.sandboxRuns[slug] = (analytics.sandboxRuns[slug] || 0) + 1;
      }

      await store.setJSON(ANALYTICS_KEY, analytics);
      return Response.json({ success: true, analytics });
    }

    return Response.json({ error: 'Not found' }, { status: 404 });
  } catch (err) {
    console.error('[Netlify API Error]', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
};
