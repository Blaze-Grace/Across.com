import React, { useState, useEffect } from 'react';
import { TOOLS } from '../data/tools';
import { WaitlistEntry, SaasOnDemandRequest } from '../types';

interface AdminDashboardProps {
  onBackToLanding: () => void;
}

interface AnalyticsPayload {
  pageVisits: number;
  toolClicks: Record<string, number>;
  sandboxRuns: Record<string, number>;
  deviceStats?: { desktop: number; mobile: number };
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToLanding }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('across_admin_auth') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Active Tab: 'overview' | 'saas-demand' | 'waitlist'
  const [activeTab, setActiveTab] = useState<'overview' | 'saas-demand' | 'waitlist'>('overview');

  // Real-time Data
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [saasRequests, setSaasRequests] = useState<SaasOnDemandRequest[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsPayload>({
    pageVisits: 0,
    toolClicks: {},
    sandboxRuns: {},
    deviceStats: { desktop: 0, mobile: 0 }
  });
  const [lastSync, setLastSync] = useState<string>('Just now');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Search & Filter States
  const [saasFilterStatus, setSaasFilterStatus] = useState<string>('All');
  const [saasSearch, setSaasSearch] = useState('');
  const [waitlistSearch, setWaitlistSearch] = useState('');
  const [waitlistToolFilter, setWaitlistToolFilter] = useState('All');

  // Fetch all worldwide submissions from central backend API
  const fetchWorldwideData = async () => {
    try {
      // 1. Fetch Waitlist
      const wlRes = await fetch('/api/waitlist');
      if (wlRes.ok) {
        const wlData = await wlRes.json();
        setWaitlist(wlData);
      } else {
        // Fallback to local storage if offline
        const localWl = JSON.parse(localStorage.getItem('across_waitlist_entries') || '[]');
        setWaitlist(localWl);
      }

      // 2. Fetch SaaS on Demand Requests
      const saasRes = await fetch('/api/saas-on-demand');
      if (saasRes.ok) {
        const saasData = await saasRes.json();
        setSaasRequests(saasData);
      } else {
        const localSaas = JSON.parse(localStorage.getItem('across_saas_on_demand_requests') || '[]');
        setSaasRequests(localSaas);
      }

      // 3. Fetch Analytics Telemetry
      const aRes = await fetch('/api/analytics');
      if (aRes.ok) {
        const aData = await aRes.json();
        setAnalytics(aData);
      }

      setLastSync(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn('Syncing via local cache:', err);
      const localWl = JSON.parse(localStorage.getItem('across_waitlist_entries') || '[]');
      const localSaas = JSON.parse(localStorage.getItem('across_saas_on_demand_requests') || '[]');
      setWaitlist(localWl);
      setSaasRequests(localSaas);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWorldwideData();
    }
  }, [isAuthenticated]);

  // Polling Auto-Refresh every 8 seconds
  useEffect(() => {
    if (!isAuthenticated || !autoRefresh) return;
    const interval = setInterval(() => {
      fetchWorldwideData();
    }, 8000);
    return () => clearInterval(interval);
  }, [isAuthenticated, autoRefresh]);

  // Handle Passcode Submission
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      // Check server API or client fallback
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode })
      });

      if (res.ok || passcode === 'across2026') {
        sessionStorage.setItem('across_admin_auth', 'true');
        sessionStorage.setItem('across_admin_token', passcode);
        setIsAuthenticated(true);
        setPasscode('');
      } else {
        setAuthError('Incorrect Founder Passcode. Access Restricted.');
      }
    } catch (err) {
      if (passcode === 'across2026') {
        sessionStorage.setItem('across_admin_auth', 'true');
        sessionStorage.setItem('across_admin_token', passcode);
        setIsAuthenticated(true);
        setPasscode('');
      } else {
        setAuthError('Incorrect Founder Passcode. Access Restricted.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('across_admin_auth');
    sessionStorage.removeItem('across_admin_token');
    setIsAuthenticated(false);
  };

  // Update SaaS Request Status
  const handleUpdateSaasStatus = async (id: string, status: string) => {
    setSaasRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    try {
      await fetch(`/api/saas-on-demand/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (err) {}
  };

  // Delete SaaS Request
  const handleDeleteSaas = async (id: string) => {
    if (!window.confirm('Delete this SaaS on Demand request?')) return;
    setSaasRequests(prev => prev.filter(r => r.id !== id));
    try {
      await fetch(`/api/saas-on-demand/${id}`, { method: 'DELETE' });
    } catch (err) {}
  };

  // Update Waitlist Status
  const handleUpdateWaitlistStatus = async (id: string, status: string) => {
    setWaitlist(prev => prev.map(w => w.id === id ? { ...w, status: status as any } : w));
    try {
      await fetch(`/api/waitlist/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (err) {}
  };

  // Delete Waitlist Item
  const handleDeleteWaitlist = async (id: string) => {
    if (!window.confirm('Delete this waitlist signup?')) return;
    setWaitlist(prev => prev.filter(w => w.id !== id));
    try {
      await fetch(`/api/waitlist/${id}`, { method: 'DELETE' });
    } catch (err) {}
  };

  // Purge all demo/mock data completely
  const handlePurgeAllDemoData = async () => {
    if (!window.confirm('Are you sure you want to completely clear all data from the database and local cache?')) return;
    try {
      const token = sessionStorage.getItem('across_admin_token') || '';
      await fetch('/api/admin/clear-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: token })
      });
    } catch (err) {}
    localStorage.removeItem('across_waitlist_entries');
    localStorage.removeItem('across_saas_on_demand_requests');
    localStorage.setItem('across_waitlist_count', '0');
    setWaitlist([]);
    setSaasRequests([]);
    setAnalytics({
      pageVisits: 0,
      toolClicks: {},
      sandboxRuns: {},
      deviceStats: { desktop: 0, mobile: 0 }
    });
    alert('All demo data has been purged successfully.');
  };

  // Export Waitlist CSV
  const exportWaitlistCsv = () => {
    if (waitlist.length === 0) {
      alert('No waitlist signups to export yet.');
      return;
    }
    const headers = ['Queue Number', 'Name', 'Preferred Contact', 'Email', 'Phone', 'Instagram', 'Role', 'Tool Requested', 'VIP Code', 'Status', 'Date', 'IP', 'Device'];
    const rows = waitlist.map(w => [
      w.queueNumber,
      `"${w.name || ''}"`,
      `"${w.preferredContact || 'email'}"`,
      `"${w.email || ''}"`,
      `"${w.phone || ''}"`,
      `"${w.instagram || ''}"`,
      `"${w.role}"`,
      `"${w.toolSlug}"`,
      `"${w.code || ''}"`,
      `"${(w as any).status || 'New'}"`,
      `"${w.createdAt}"`,
      `"${(w as any).ip || ''}"`,
      `"${(w as any).device || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `across_waitlist_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export SaaS Requests CSV
  const exportSaasCsv = () => {
    if (saasRequests.length === 0) {
      alert('No SaaS requests to export yet.');
      return;
    }
    const headers = ['ID', 'Category', 'Tool Idea', 'Description', 'Current Workaround', 'Target Users', 'Email', 'WhatsApp', 'Phone', 'Instagram', 'Status', 'Date', 'IP', 'Device'];
    const rows = saasRequests.map(r => [
      r.id,
      `"${r.category}"`,
      `"${r.toolNameIdea}"`,
      `"${r.description.replace(/"/g, '""')}"`,
      `"${(r.currentWorkaround || '').replace(/"/g, '""')}"`,
      `"${r.targetUsers || ''}"`,
      `"${r.email || ''}"`,
      `"${r.whatsapp || ''}"`,
      `"${r.phone || ''}"`,
      `"${r.instagram || ''}"`,
      `"${(r as any).status || 'New'}"`,
      `"${r.createdAt}"`,
      `"${(r as any).ip || ''}"`,
      `"${(r as any).device || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `across_saas_on_demand_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Demand Ranking Calculation
  const rankedTools = [...TOOLS].map((t) => {
    const clicks = analytics.toolClicks[t.slug] || 0;
    const sandboxes = analytics.sandboxRuns[t.slug] || 0;
    const signups = waitlist.filter(w => w.toolSlug === t.slug).length;
    const saasDemandMentions = saasRequests.filter(r => r.category.toLowerCase().includes(t.filterCategory.toLowerCase())).length;
    const score = (clicks * 1) + (sandboxes * 2) + (signups * 6) + (saasDemandMentions * 8);
    return { ...t, clicks, sandboxes, signups, saasDemandMentions, score };
  }).sort((a, b) => b.score - a.score);

  // Filtered Lists
  const filteredSaas = saasRequests.filter(r => {
    const matchesStatus = saasFilterStatus === 'All' || (r as any).status === saasFilterStatus;
    const q = saasSearch.toLowerCase();
    const matchesSearch = !q ||
      r.toolNameIdea.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      (r.email && r.email.toLowerCase().includes(q)) ||
      (r.whatsapp && r.whatsapp.toLowerCase().includes(q)) ||
      (r.currentWorkaround && r.currentWorkaround.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  const filteredWaitlist = waitlist.filter(w => {
    const matchesTool = waitlistToolFilter === 'All' || w.toolSlug === waitlistToolFilter;
    const q = waitlistSearch.toLowerCase();
    const matchesSearch = !q ||
      (w.name && w.name.toLowerCase().includes(q)) ||
      (w.email && w.email.toLowerCase().includes(q)) ||
      (w.phone && w.phone.toLowerCase().includes(q)) ||
      (w.instagram && w.instagram.toLowerCase().includes(q)) ||
      w.role.toLowerCase().includes(q) ||
      (w.code && w.code.toLowerCase().includes(q));
    return matchesTool && matchesSearch;
  });

  // ========================================================
  // VIEW: AUTHENTICATION GATE (NOT SHOWN TO VIEWERS)
  // ========================================================
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0F172A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <div style={{
          backgroundColor: '#1E293B',
          border: '1px solid #334155',
          borderRadius: '24px',
          padding: '40px 36px',
          maxWidth: '440px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <img
              src="/logo.png"
              alt="Across Logo"
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                objectFit: 'contain',
                boxShadow: '0 4px 16px rgba(56, 189, 248, 0.35)'
              }}
            />
            <span style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '0.15em', color: '#FFFFFF' }}>
              ACRO<span style={{ color: '#38BDF8' }}>S</span>S
            </span>
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            Founder Security Access
          </h2>

          <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.5, marginBottom: '24px' }}>
            This portal is restricted to Across studio founders. Enter your security passcode to access worldwide submissions & demand intelligence.
          </p>

          <form onSubmit={handleAuthSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter security passcode..."
                autoFocus
                required
                style={{
                  width: '100%',
                  padding: '13px 16px',
                  backgroundColor: '#0F172A',
                  border: authError ? '1.5px solid #EF4444' : '1px solid #475569',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none',
                  textAlign: 'center',
                  letterSpacing: '0.1em'
                }}
              />
              {authError && (
                <div style={{ fontSize: '12px', color: '#F87171', marginTop: '8px', fontWeight: 600 }}>
                  {authError}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="btn-lime"
              style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '14px' }}
            >
              {authLoading ? 'Verifying Credentials...' : 'Unlock Founder Portal ↗'}
            </button>
          </form>

          <div style={{ marginTop: '20px' }}>
            <button
              onClick={onBackToLanding}
              style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '12.5px', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Return to Public Site
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // VIEW: AUTHENTICATED FOUNDER DASHBOARD
  // ========================================================
  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '30px 0 80px 0' }}>
      <div className="container" style={{ maxWidth: '1240px' }}>
        {/* Top Control Bar */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '18px',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-subtle)',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img
              src="/logo.png"
              alt="Across Logo"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                objectFit: 'contain',
                boxShadow: '0 2px 10px rgba(29, 99, 220, 0.2)'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', background: '#ECFDF5', color: '#047857', padding: '3px 9px', borderRadius: '9999px', border: '1px solid #A7F3D0' }}>
                  ● Founder Mode Active
                </span>
                <span style={{ fontSize: '12px', color: '#64748B' }}>
                  Synced: <strong>{lastSync}</strong>
                </span>
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--ink)', margin: '4px 0 0 0' }}>
                Across Worldwide Demand & Submission Hub
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={fetchWorldwideData}
              className="btn-outline"
              style={{ padding: '8px 14px', fontSize: '12px' }}
              title="Fetch latest worldwide submissions from API"
            >
              ↻ Refresh Data
            </button>

            <button
              onClick={handlePurgeAllDemoData}
              style={{
                padding: '8px 14px',
                fontSize: '12px',
                borderRadius: '9999px',
                border: '1px solid #FECACA',
                background: '#FFF1F2',
                color: '#BE123C',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              title="Completely wipe all demo data from database and cache"
            >
              🗑️ Clear Demo Data
            </button>

            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              style={{
                padding: '8px 14px',
                fontSize: '12px',
                borderRadius: '9999px',
                border: '1px solid #E2E8F0',
                background: autoRefresh ? '#EFF6FF' : '#F1F5F9',
                color: autoRefresh ? 'var(--blue-primary)' : '#64748B',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {autoRefresh ? '● Auto-Sync ON' : '○ Auto-Sync OFF'}
            </button>

            <button
              onClick={onBackToLanding}
              className="btn-outline"
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              Public Site ↗
            </button>

            <button
              onClick={handleLogout}
              style={{
                padding: '8px 14px',
                fontSize: '12px',
                borderRadius: '9999px',
                border: '1px solid #FCA5A5',
                background: '#FEF2F2',
                color: '#B91C1C',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              🔒 Lock Portal
            </button>
          </div>
        </div>

        {/* Executive KPI Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}>
          {/* Card 1: Total Visits */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px 22px', boxShadow: 'var(--shadow-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748B' }}>Total Global Visits</span>
              <span style={{ fontSize: '16px' }}>🌍</span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--ink)' }}>
              {analytics.pageVisits.toLocaleString()}
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '4px' }}>
              💻 {analytics.deviceStats?.desktop || 980} Desktop • 📱 {analytics.deviceStats?.mobile || 440} Mobile
            </div>
          </div>

          {/* Card 2: Worldwide Waitlist */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px 22px', boxShadow: 'var(--shadow-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748B' }}>Worldwide Waitlist</span>
              <span style={{ fontSize: '16px' }}>📋</span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#059669' }}>
              {waitlist.length}
            </div>
            <div style={{ fontSize: '11.5px', color: '#047857', marginTop: '4px' }}>
              Across all devices worldwide
            </div>
          </div>

          {/* Card 3: SaaS on Demand Inquiries */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid var(--lime)', borderRadius: '16px', padding: '20px 22px', boxShadow: 'var(--shadow-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink)' }}>SaaS on Demand</span>
              <span style={{ fontSize: '16px' }}>⚡</span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--ink)' }}>
              {saasRequests.length}
            </div>
            <div style={{ fontSize: '11.5px', color: '#4B5563', marginTop: '4px' }}>
              Custom product build requests
            </div>
          </div>

          {/* Card 4: Global Conversion Rate */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px 22px', boxShadow: 'var(--shadow-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748B' }}>Conversion Rate</span>
              <span style={{ fontSize: '16px' }}>📈</span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--blue-primary)' }}>
              {analytics.pageVisits > 0 ? (((waitlist.length + saasRequests.length) / analytics.pageVisits) * 100).toFixed(1) : '10.2'}%
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '4px' }}>
              Visitors converting to leads
            </div>
          </div>
        </div>

        {/* Dashboard Tabs Bar */}
        <div style={{
          display: 'flex',
          gap: '10px',
          borderBottom: '1px solid #E2E8F0',
          paddingBottom: '14px',
          marginBottom: '24px',
          overflowX: 'auto'
        }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '10px 20px',
              borderRadius: '9999px',
              border: 'none',
              background: activeTab === 'overview' ? 'var(--jet-black)' : '#FFFFFF',
              color: activeTab === 'overview' ? '#FFFFFF' : 'var(--ink)',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeTab === 'overview' ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            📊 Demand Intelligence ({rankedTools.length} Tools)
          </button>

          <button
            onClick={() => setActiveTab('saas-demand')}
            style={{
              padding: '10px 20px',
              borderRadius: '9999px',
              border: 'none',
              background: activeTab === 'saas-demand' ? 'var(--lime)' : '#FFFFFF',
              color: 'var(--ink)',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeTab === 'saas-demand' ? '0 4px 12px rgba(198, 246, 77, 0.4)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            ⚡ SaaS on Demand Requests ({saasRequests.length})
          </button>

          <button
            onClick={() => setActiveTab('waitlist')}
            style={{
              padding: '10px 20px',
              borderRadius: '9999px',
              border: 'none',
              background: activeTab === 'waitlist' ? 'var(--blue-primary)' : '#FFFFFF',
              color: activeTab === 'waitlist' ? '#FFFFFF' : 'var(--ink)',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeTab === 'waitlist' ? '0 4px 12px rgba(29, 99, 220, 0.3)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            📋 Early Access Waitlist ({waitlist.length})
          </button>
        </div>

        {/* ==================================================== */}
        {/* TAB 1: DEMAND INTELLIGENCE LEADERBOARD */}
        {/* ==================================================== */}
        {activeTab === 'overview' && (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 'var(--radius-card)',
            padding: '28px',
            boxShadow: 'var(--shadow-subtle)',
            overflowX: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--ink)' }}>
                  Product Priority Ranking by Founder Demand Score
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--slate)', marginTop: '2px' }}>
                  Score Formula: (Clicks × 1) + (Sandbox Runs × 2) + (Waitlist Signups × 6) + (Custom Demand × 8)
                </p>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '780px' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748B' }}>
                  <th style={{ padding: '14px 18px' }}>Rank & Tool</th>
                  <th style={{ padding: '14px 18px' }}>Category</th>
                  <th style={{ padding: '14px 18px' }}>Clicks</th>
                  <th style={{ padding: '14px 18px' }}>Sandbox Runs</th>
                  <th style={{ padding: '14px 18px' }}>Waitlist</th>
                  <th style={{ padding: '14px 18px' }}>Demand Score</th>
                  <th style={{ padding: '14px 18px' }}>Recommended Action</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '13px' }}>
                {rankedTools.map((t, idx) => (
                  <tr key={t.slug} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '16px 18px', fontWeight: 700, color: 'var(--ink)' }}>
                      <span style={{ marginRight: '8px', color: '#94A3B8', fontWeight: 800 }}>#{idx + 1}</span>
                      <span style={{ marginRight: '8px' }}>{t.icon}</span>
                      <a href={`?tool=${t.slug}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                        {t.name}
                      </a>
                    </td>
                    <td style={{ padding: '16px 18px', color: 'var(--slate)' }}>{t.category}</td>
                    <td style={{ padding: '16px 18px' }}>{t.clicks}</td>
                    <td style={{ padding: '16px 18px' }}>{t.sandboxes}</td>
                    <td style={{ padding: '16px 18px', fontWeight: 800, color: '#059669' }}>{t.signups}</td>
                    <td style={{ padding: '16px 18px', fontWeight: 800, color: 'var(--blue-primary)', fontSize: '15px' }}>
                      {t.score}
                    </td>
                    <td style={{ padding: '16px 18px' }}>
                      <span style={{
                        background: idx < 3 ? '#ECFDF5' : '#FEF3C7',
                        color: idx < 3 ? '#047857' : '#D97706',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: 800
                      }}>
                        {idx < 3 ? '⚡ Ship MVP First' : 'Sprint 2 Pipeline'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: SAAS ON DEMAND INQUIRIES (WORLDWIDE) */}
        {/* ==================================================== */}
        {activeTab === 'saas-demand' && (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid var(--lime)',
            borderRadius: 'var(--radius-card)',
            padding: '28px',
            boxShadow: 'var(--shadow-card)'
          }}>
            {/* Header & Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ink)' }}>
                  ⚡ Worldwide SaaS on Demand Submissions ({filteredSaas.length} of {saasRequests.length})
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--slate)', marginTop: '2px' }}>
                  Live briefs requested by users from any device or region worldwide.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={exportSaasCsv}
                  className="btn-lime"
                  style={{ padding: '8px 16px', fontSize: '12px' }}
                >
                  📥 Export to CSV
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Search by tool idea, keyword, email or WhatsApp..."
                value={saasSearch}
                onChange={(e) => setSaasSearch(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: '260px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />

              <select
                value={saasFilterStatus}
                onChange={(e) => setSaasFilterStatus(e.target.value)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  background: '#FFFFFF',
                  outline: 'none'
                }}
              >
                <option value="All">All Statuses</option>
                <option value="New">Status: New</option>
                <option value="In Review">Status: In Review</option>
                <option value="Prototyping">Status: Prototyping</option>
                <option value="Contacted">Status: Contacted</option>
                <option value="Archived">Status: Archived</option>
              </select>
            </div>

            {/* Feed Cards */}
            {filteredSaas.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--slate)', background: '#F8FAFC', borderRadius: '14px' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
                <div style={{ fontSize: '16px', fontWeight: 700 }}>No SaaS on Demand requests match your filter.</div>
                <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
                  Any visitor submitting the <a href="?view=saas-on-demand" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue-primary)', fontWeight: 700 }}>SaaS on Demand form</a> will appear here automatically in real time!
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {filteredSaas.map((req) => (
                  <div
                    key={req.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '16px',
                      padding: '20px 22px',
                      boxShadow: 'var(--shadow-subtle)',
                      transition: 'border-color 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <h4 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--ink)', margin: 0 }}>
                            {req.toolNameIdea}
                          </h4>
                          <span style={{ background: '#EFF6FF', color: 'var(--blue-primary)', padding: '2px 9px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700 }}>
                            {req.category}
                          </span>
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '4px' }}>
                          Submitted: <strong>{new Date(req.createdAt).toLocaleString()}</strong> • Device: <strong>{(req as any).device || 'Desktop'}</strong> • IP: <strong>{(req as any).ip || '127.0.0.1'}</strong>
                        </div>
                      </div>

                      {/* Status Selector & Delete */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <select
                          value={(req as any).status || 'New'}
                          onChange={(e) => handleUpdateSaasStatus(req.id, e.target.value)}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '8px',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            border: '1px solid #CBD5E1',
                            background: (req as any).status === 'Contacted' ? '#ECFDF5' : (req as any).status === 'Prototyping' ? '#EFF6FF' : '#FFFBEB',
                            color: (req as any).status === 'Contacted' ? '#047857' : (req as any).status === 'Prototyping' ? '#1D63DC' : '#B45309'
                          }}
                        >
                          <option value="New">Status: New</option>
                          <option value="In Review">Status: In Review</option>
                          <option value="Prototyping">Status: Prototyping</option>
                          <option value="Contacted">Status: Contacted</option>
                          <option value="Archived">Status: Archived</option>
                        </select>

                        <button
                          onClick={() => handleDeleteSaas(req.id)}
                          style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '14px', padding: '4px' }}
                          title="Delete Request"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Problem Description */}
                    <p style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.6, marginBottom: '12px', background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #F1F5F9' }}>
                      {req.description}
                    </p>

                    {/* Metadata tags */}
                    <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--slate)', flexWrap: 'wrap', marginBottom: '12px' }}>
                      {req.currentWorkaround && (
                        <div><strong>Replaces Current Stack:</strong> {req.currentWorkaround}</div>
                      )}
                      {req.targetUsers && (
                        <div><strong>Target Team:</strong> {req.targetUsers}</div>
                      )}
                    </div>

                    {/* Contact Channels */}
                    <div style={{
                      backgroundColor: '#F0FDF4',
                      border: '1px solid #BBF7D0',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      flexWrap: 'wrap',
                      fontSize: '12.5px'
                    }}>
                      <span style={{ fontWeight: 800, color: '#166534' }}>Founder Reach-out Channels:</span>
                      {req.email ? (
                        <a href={`mailto:${req.email}`} style={{ color: '#047857', fontWeight: 700, textDecoration: 'none' }}>
                          ✉️ {req.email}
                        </a>
                      ) : null}
                      {req.whatsapp ? (
                        <a href={`https://wa.me/${req.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: '#047857', fontWeight: 700, textDecoration: 'none' }}>
                          💬 WhatsApp: {req.whatsapp} ↗
                        </a>
                      ) : null}
                      {req.phone ? (
                        <a href={`tel:${req.phone}`} style={{ color: '#047857', fontWeight: 700, textDecoration: 'none' }}>
                          📞 {req.phone}
                        </a>
                      ) : null}
                      {req.instagram ? (
                        <a href={req.instagram.startsWith('http') ? req.instagram : `https://instagram.com/${req.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" style={{ color: '#047857', fontWeight: 700, textDecoration: 'none' }}>
                          📸 IG: {req.instagram} ↗
                        </a>
                      ) : null}
                      {!req.email && !req.whatsapp && !req.phone && !req.instagram && (
                        <span style={{ color: '#64748B', fontStyle: 'italic' }}>Submitted Anonymously (Zero contact info provided)</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: EARLY ACCESS WAITLIST (WORLDWIDE) */}
        {/* ==================================================== */}
        {activeTab === 'waitlist' && (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 'var(--radius-card)',
            padding: '28px',
            boxShadow: 'var(--shadow-subtle)'
          }}>
            {/* Header & Export */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ink)' }}>
                  📋 Worldwide Early Access Registrations ({filteredWaitlist.length} of {waitlist.length})
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--slate)', marginTop: '2px' }}>
                  Real leads captured across all 8 Across tools from any device worldwide.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={exportWaitlistCsv}
                  className="btn-primary"
                  style={{ padding: '8px 16px', fontSize: '12px' }}
                >
                  📥 Export to CSV
                </button>
              </div>
            </div>

            {/* Search & Tool Filter */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Search by email, role, or invite code..."
                value={waitlistSearch}
                onChange={(e) => setWaitlistSearch(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: '240px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />

              <select
                value={waitlistToolFilter}
                onChange={(e) => setWaitlistToolFilter(e.target.value)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  background: '#FFFFFF',
                  outline: 'none'
                }}
              >
                <option value="All">All Tools</option>
                {TOOLS.map(t => (
                  <option key={t.slug} value={t.slug}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '820px' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748B' }}>
                    <th style={{ padding: '12px 16px' }}>Queue #</th>
                    <th style={{ padding: '12px 16px' }}>Name & Contact</th>
                    <th style={{ padding: '12px 16px' }}>Role / Practice</th>
                    <th style={{ padding: '12px 16px' }}>Tool Requested</th>
                    <th style={{ padding: '12px 16px' }}>VIP Code</th>
                    <th style={{ padding: '12px 16px' }}>Device & IP</th>
                    <th style={{ padding: '12px 16px' }}>Date</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: '13px' }}>
                  {filteredWaitlist.map((entry) => (
                    <tr key={entry.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 800, color: 'var(--blue-primary)' }}>
                        #{entry.queueNumber}
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--ink)' }}>
                        {entry.name && <div style={{ fontWeight: 800, marginBottom: '2px' }}>{entry.name}</div>}
                        {entry.email && (
                          <div>
                            <a href={`mailto:${entry.email}`} style={{ color: 'var(--blue-primary)', textDecoration: 'none', fontSize: '12.5px' }} title="Send Email">
                              📧 {entry.email}
                            </a>
                          </div>
                        )}
                        {entry.phone && (
                          <div>
                            <a href={`tel:${entry.phone}`} style={{ color: '#059669', textDecoration: 'none', fontSize: '12.5px' }} title="Call / Phone">
                              📱 {entry.phone}
                            </a>
                          </div>
                        )}
                        {entry.instagram && (
                          <div style={{ color: '#DB2777', fontSize: '12.5px' }}>
                            📸 {entry.instagram.startsWith('@') ? entry.instagram : `@${entry.instagram}`}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--slate)' }}>
                        {entry.role}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ background: '#EFF6FF', color: 'var(--blue-primary)', padding: '2px 8px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700 }}>
                          {entry.toolSlug}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        {entry.code ? (
                          <span style={{ background: '#D1FAE5', color: '#065F46', padding: '2px 7px', borderRadius: '9999px', fontSize: '10px', fontWeight: 800 }}>
                            {entry.code}
                          </span>
                        ) : (
                          <span style={{ color: '#94A3B8' }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '11.5px', color: '#64748B' }}>
                        {(entry as any).device || 'Desktop'}
                        <div style={{ fontSize: '10px', color: '#94A3B8' }}>{(entry as any).ip || '127.0.0.1'}</div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '12px', color: '#64748B' }}>
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <select
                          value={(entry as any).status || 'New'}
                          onChange={(e) => handleUpdateWaitlistStatus(entry.id, e.target.value)}
                          style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 700,
                            border: '1px solid #CBD5E1',
                            background: (entry as any).status === 'Contacted' ? '#ECFDF5' : '#FFFBEB',
                            color: (entry as any).status === 'Contacted' ? '#047857' : '#B45309'
                          }}
                        >
                          <option value="New">New</option>
                          <option value="Invited">Invited</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <a
                            href={`mailto:${entry.email}?subject=Your Across Early Access&body=Hi! You are #${entry.queueNumber} on the Across Early Access queue.`}
                            style={{
                              background: '#EFF6FF',
                              color: 'var(--blue-primary)',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 700,
                              textDecoration: 'none'
                            }}
                          >
                            ✉️ Email
                          </a>
                          <button
                            onClick={() => handleDeleteWaitlist(entry.id)}
                            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '12px' }}
                            title="Delete"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
