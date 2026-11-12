import type { Context } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

const STORE_NAME = 'across-data';
const WAITLIST_KEY = 'waitlist';
const SAAS_DEMAND_KEY = 'saas_requests';
const ANALYTICS_KEY = 'analytics';

interface AnalyticsData {
  pageVisits: number;
  toolClicks: Record<string, number>;
  sandboxRuns: Record<string, number>;
  deviceStats: {
    desktop: number;
    mobile: number;
  };
}

const DEFAULT_ANALYTICS: AnalyticsData = {
  pageVisits: 0,
  toolClicks: {},
  sandboxRuns: {},
  deviceStats: { desktop: 0, mobile: 0 },
};

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
    const store = getStore(STORE_NAME);

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

    // 3. SaaS on Demand API
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

    // 4. Waitlist API
    if (path === '/api/waitlist' && method === 'GET') {
      const data = await readArray(store, WAITLIST_KEY);
      return Response.json(data);
    }

    if (path === '/api/waitlist' && method === 'POST') {
      const { ip, device } = getClientMeta(req, context);
      const body = (await req.json()) as Record<string, unknown>;
      const data = await readArray<Record<string, unknown> & { queueNumber?: number }>(store, WAITLIST_KEY);
      const nextQueue = (data[0]?.queueNumber || data.length || 140) + 1;

      const entry = {
        id: (body.id as string) || 'wl_' + Date.now(),
        name: (body.name as string) || null,
        email: (body.email as string) || null,
        phone: (body.phone as string) || null,
        instagram: (body.instagram as string) || null,
        preferredContact: (body.preferredContact as string) || 'email',
        role: (body.role as string) || 'Other',
        code: (body.code as string) || null,
        toolSlug: (body.toolSlug as string) || 'all',
        queueNumber: nextQueue,
        device,
        ip,
        status: 'New',
        createdAt: (body.createdAt as string) || new Date().toISOString(),
      };
      data.unshift(entry);
      await store.setJSON(WAITLIST_KEY, data);

      if (entry.toolSlug && entry.toolSlug !== 'all') {
        const analytics = await readAnalytics(store);
        analytics.toolClicks[entry.toolSlug] = (analytics.toolClicks[entry.toolSlug] || 0) + 1;
        await store.setJSON(ANALYTICS_KEY, analytics);
      }

      return Response.json({ success: true, entry, queueNumber: nextQueue });
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

    // 5. Telemetry & Analytics API
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

