import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Check, Copy, Clock, AlertTriangle, RefreshCw, ShieldCheck, ArrowLeft } from 'lucide-react';
import { TOOLS } from '../data/tools';
import { getToolGradient } from '../utils/toolStyles';

interface GeneratedVipState {
  code: string;
  toolSlug: string;
  toolName: string;
  expiresAt: string;
  serverOffsetMs: number;
  expired: boolean;
}

const STORAGE_KEY = 'across_active_vip_code';

export const VipGeneratorPage: React.FC = () => {
  const [selectedSlug, setSelectedSlug] = useState<string>(TOOLS[0].slug);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [generated, setGenerated] = useState<GeneratedVipState | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(120);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  const computeRemainingSeconds = (expiresAtIso: string, serverOffsetMs: number) => {
    const serverNowMs = Date.now() + serverOffsetMs;
    const diffMs = new Date(expiresAtIso).getTime() - serverNowMs;
    return Math.max(0, Math.ceil(diffMs / 1000));
  };

  // Sync active code with server on mount/refresh so reload or device clock changes cannot extend expiry
  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    let parsed: { code: string; toolSlug: string; toolName: string; expiresAt: string } | null = null;
    try {
      parsed = JSON.parse(raw);
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
      return;
    }
    if (!parsed?.code) return;

    setSelectedSlug(parsed.toolSlug);

    fetch('/api/vip-codes/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: parsed.code }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (!data || data.status === 'Invalid' || data.status === 'Used' || data.status === 'Revoked') {
          sessionStorage.removeItem(STORAGE_KEY);
          return;
        }
        const serverOffsetMs = data.serverNow ? new Date(data.serverNow).getTime() - Date.now() : 0;
        const rem = computeRemainingSeconds(data.expiresAt, serverOffsetMs);
        const isExp = data.status === 'Expired' || rem <= 0;
        setSecondsLeft(isExp ? 0 : rem);
        setGenerated({
          code: parsed!.code,
          toolSlug: data.toolSlug || parsed!.toolSlug,
          toolName: data.toolName || parsed!.toolName,
          expiresAt: data.expiresAt,
          serverOffsetMs,
          expired: isExp,
        });
      })
      .catch(() => {
        sessionStorage.removeItem(STORAGE_KEY);
      });
  }, []);

  // Real-time countdown synced to server offset
  useEffect(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (!generated || generated.expired) return;

    const tick = () => {
      const rem = computeRemainingSeconds(generated.expiresAt, generated.serverOffsetMs);
      setSecondsLeft(rem);
      if (rem <= 0) {
        setGenerated((prev) => (prev ? { ...prev, expired: true } : prev));
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    };

    tick();
    timerRef.current = window.setInterval(tick, 500);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [generated]);

  const handleGenerate = async () => {
    if (!selectedSlug) return;
    setGenerating(true);
    setError('');
    setCopied(false);
    try {
      const res = await fetch('/api/vip-codes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolSlug: selectedSlug }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Could not generate VIP code. Please try again.');
        return;
      }

      const serverOffsetMs = data.serverNow ? new Date(data.serverNow).getTime() - Date.now() : 0;
      const rem = computeRemainingSeconds(data.expiresAt, serverOffsetMs);

      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          code: data.code,
          toolSlug: data.toolSlug,
          toolName: data.toolName,
          expiresAt: data.expiresAt,
        })
      );

      setSecondsLeft(rem);
      setGenerated({
        code: data.code,
        toolSlug: data.toolSlug,
        toolName: data.toolName,
        expiresAt: data.expiresAt,
        serverOffsetMs,
        expired: rem <= 0,
      });
    } catch {
      setError('Unable to connect to the server. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleReset = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setGenerated(null);
    setCopied(false);
    setError('');
  };

  const handleCopy = async () => {
    if (!generated || generated.expired) return;
    try {
      await navigator.clipboard.writeText(generated.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = generated.code;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const secs = String(secondsLeft % 60).padStart(2, '0');
  const progressPct = Math.max(0, Math.min(100, (secondsLeft / 120) * 100));
  const selectedTool = TOOLS.find((t) => t.slug === selectedSlug) || TOOLS[0];

  return (
    <div
      className="bg-dot-grid"
      style={{
        backgroundColor: '#F8FAFC',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: `
          radial-gradient(ellipse 900px 460px at 50% -60px, rgba(37, 99, 235, 0.16), rgba(124, 58, 237, 0.09), transparent 75%),
          radial-gradient(rgba(148, 163, 184, 0.16) 1.2px, transparent 1.2px)
        `,
        backgroundSize: '100% 100%, 28px 28px',
      }}
    >
      {/* Dedicated VIP Portal Top Bar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'rgba(255, 255, 255, 0.86)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.85)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '66px',
            gap: '12px',
          }}
        >
          <a
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '9px',
              textDecoration: 'none',
            }}
          >
            <img src="/logo.png" alt="Across Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
            <span style={{ fontWeight: 800, fontSize: '17px', letterSpacing: '0.14em', color: 'var(--ink)' }}>
              ACROSS
            </span>
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #EFF6FF, #F5F3FF)',
                color: '#4F46E5',
                border: '1px solid #C7D2FE',
                padding: '3px 9px',
                borderRadius: '9999px',
                letterSpacing: '0.03em',
              }}
            >
              VIP PORTAL
            </span>
          </a>

          <a
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12.5px',
              fontWeight: 700,
              color: 'var(--slate)',
              textDecoration: 'none',
              padding: '7px 13px',
              borderRadius: '9999px',
              border: '1px solid #E2E8F0',
              background: '#FFFFFF',
            }}
          >
            <ArrowLeft size={14} strokeWidth={2.3} />
            <span>Back to Platform</span>
          </a>
        </div>
      </header>

      <main style={{ flex: 1, padding: '44px 0 72px 0' }}>
        <div className="container" style={{ maxWidth: '1080px' }}>
          {/* Hero Header */}
          <div className="text-center" style={{ marginBottom: '36px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                padding: '6px 15px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 800,
                color: 'var(--blue-primary)',
                marginBottom: '14px',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.08)',
              }}
            >
              <Sparkles size={14} strokeWidth={2.4} />
              <span>Single-Use • 2-Minute Invitation Pass</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(30px, 5vw, 50px)',
                fontWeight: 800,
                letterSpacing: '-0.035em',
                color: 'var(--ink)',
                marginBottom: '12px',
                lineHeight: 1.08,
              }}
            >
              Get Your VIP Access
            </h1>

            <p
              style={{
                fontSize: '16px',
                color: 'var(--slate)',
                maxWidth: '580px',
                margin: '0 auto',
                lineHeight: 1.6,
              }}
            >
              Choose the tool you want early access to and generate your exclusive invitation code.
            </p>
          </div>

          {/* Result Area OR Tool Selection */}
          {generated ? (
            <div
              style={{
                maxWidth: '500px',
                margin: '0 auto',
                backgroundColor: '#FFFFFF',
                border: generated.expired ? '1.5px solid #FECACA' : '1.5px solid rgba(203, 213, 225, 0.9)',
                borderRadius: '26px',
                padding: '34px 28px',
                boxShadow: '0 28px 60px -14px rgba(15, 23, 42, 0.14)',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: generated.expired
                    ? 'linear-gradient(90deg, #EF4444, #F97316)'
                    : 'linear-gradient(90deg, #2563EB, #7C3AED, #06B6D4)',
                }}
              />

              {generated.expired ? (
                <>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '16px',
                      background: '#FEF2F2',
                      color: '#DC2626',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px auto',
                      border: '1px solid #FECACA',
                    }}
                  >
                    <AlertTriangle size={26} strokeWidth={2.2} />
                  </div>

                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#DC2626', marginBottom: '10px' }}>
                    Code Expired
                  </h2>

                  <p style={{ fontSize: '14px', color: 'var(--slate)', marginBottom: '24px', lineHeight: 1.55 }}>
                    Your 2-minute window has ended. Generate a fresh VIP code to continue.
                  </p>

                  <button
                    onClick={handleReset}
                    className="btn-primary btn-shimmer"
                    style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '14.5px', borderRadius: '12px' }}
                  >
                    <RefreshCw size={16} strokeWidth={2.3} />
                    <span>Generate New Code</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Countdown Pill */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '7px',
                      padding: '6px 15px',
                      borderRadius: '9999px',
                      background: secondsLeft <= 30 ? '#FEF2F2' : '#EFF6FF',
                      color: secondsLeft <= 30 ? '#DC2626' : 'var(--blue-primary)',
                      border: secondsLeft <= 30 ? '1px solid #FECACA' : '1px solid #BFDBFE',
                      fontSize: '13.5px',
                      fontWeight: 800,
                      marginBottom: '16px',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    <Clock size={14} strokeWidth={2.5} />
                    <span>{mins}:{secs} remaining</span>
                  </div>

                  {/* Animated Progress Bar */}
                  <div
                    style={{
                      width: '100%',
                      height: '6px',
                      background: '#F1F5F9',
                      borderRadius: '9999px',
                      overflow: 'hidden',
                      marginBottom: '20px',
                    }}
                  >
                    <div
                      style={{
                        width: `${progressPct}%`,
                        height: '100%',
                        background:
                          secondsLeft <= 30
                            ? 'linear-gradient(90deg, #EF4444, #F97316)'
                            : 'linear-gradient(90deg, #2563EB, #7C3AED)',
                        transition: 'width 0.45s linear',
                      }}
                    />
                  </div>

                  {/* Prominent Code Box */}
                  <div
                    style={{
                      background: 'linear-gradient(145deg, #0F172A 0%, #1E293B 100%)',
                      color: '#FFFFFF',
                      borderRadius: '16px',
                      padding: '24px 16px',
                      marginBottom: '16px',
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                      fontSize: 'clamp(20px, 5vw, 28px)',
                      fontWeight: 800,
                      letterSpacing: '0.09em',
                      userSelect: 'all',
                      border: '1px solid rgba(255,255,255,0.12)',
                      boxShadow: '0 14px 30px -8px rgba(15, 23, 42, 0.35)',
                    }}
                  >
                    {generated.code}
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={handleCopy}
                    className="btn-primary btn-shimmer"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      padding: '14px',
                      fontSize: '14.5px',
                      borderRadius: '12px',
                      marginBottom: '14px',
                    }}
                  >
                    {copied ? <Check size={17} strokeWidth={2.6} /> : <Copy size={17} strokeWidth={2.2} />}
                    <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
                  </button>

                  {/* Expiration Warning */}
                  <div
                    style={{
                      fontSize: '12.5px',
                      fontWeight: 700,
                      color: '#92400E',
                      background: '#FFFBEB',
                      border: '1px solid #FDE68A',
                      borderRadius: '10px',
                      padding: '10px 12px',
                    }}
                  >
                    Valid once for {generated.toolName}. Expires in 2 minutes.
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              {/* 8 Tools Single-Selection Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(245px, 1fr))',
                  gap: '16px',
                  marginBottom: '28px',
                }}
              >
                {TOOLS.map((tool) => {
                  const isSelected = selectedSlug === tool.slug;
                  const gradient = getToolGradient(tool.slug);
                  return (
                    <button
                      key={tool.slug}
                      type="button"
                      onClick={() => setSelectedSlug(tool.slug)}
                      className="bento-card"
                      style={{
                        textAlign: 'left',
                        background: isSelected
                          ? 'linear-gradient(180deg, #FFFFFF 0%, #EFF6FF 100%)'
                          : '#FFFFFF',
                        border: isSelected ? '2px solid var(--blue-primary)' : '1.5px solid #E2E8F0',
                        borderRadius: '20px',
                        padding: '20px',
                        cursor: 'pointer',
                        boxShadow: isSelected
                          ? '0 16px 34px -10px rgba(37, 99, 235, 0.25)'
                          : 'var(--shadow-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <div
                          style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '14px',
                            background: gradient.bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '22px',
                            boxShadow: `${gradient.shadow}, inset 0 1px 0 rgba(255,255,255,0.4)`,
                          }}
                        >
                          {tool.icon}
                        </div>

                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            border: isSelected ? 'none' : '1.5px solid #CBD5E1',
                            background: isSelected ? 'var(--blue-primary)' : '#F8FAFC',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {isSelected && <Check size={14} strokeWidth={3} />}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '15.5px', fontWeight: 800, color: 'var(--ink)', marginBottom: '5px', letterSpacing: '-0.02em' }}>
                          {tool.name}
                        </div>
                        <p
                          style={{
                            fontSize: '12.5px',
                            color: 'var(--slate)',
                            lineHeight: 1.5,
                            margin: 0,
                          }}
                        >
                          {tool.tagline}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {error && (
                <div
                  style={{
                    maxWidth: '520px',
                    margin: '0 auto 16px auto',
                    background: '#FEF2F2',
                    border: '1px solid #FECACA',
                    color: '#DC2626',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    fontSize: '13px',
                    fontWeight: 700,
                    textAlign: 'center',
                  }}
                >
                  {error}
                </div>
              )}

              <div style={{ textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={generating || !selectedSlug}
                  className="btn-primary btn-shimmer"
                  style={{
                    padding: '16px 36px',
                    fontSize: '15.5px',
                    fontWeight: 800,
                    borderRadius: '9999px',
                    boxShadow: '0 14px 32px -6px rgba(37, 99, 235, 0.38)',
                  }}
                >
                  <Sparkles size={17} strokeWidth={2.3} />
                  <span>{generating ? 'Generating VIP Code...' : 'Generate VIP Code'}</span>
                </button>
                <div
                  style={{
                    marginTop: '14px',
                    fontSize: '12.5px',
                    color: 'var(--slate)',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <ShieldCheck size={14} color="#059669" />
                  <span>Selected: <strong style={{ color: 'var(--ink)' }}>{selectedTool.name}</strong> • Valid for 2 minutes</span>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};
