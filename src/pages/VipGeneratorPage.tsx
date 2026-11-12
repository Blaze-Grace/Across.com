import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Check, Copy, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
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

  // Re-sync with server on mount/refresh so page reload or device clock changes cannot reset expiry
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
      // Clipboard fallback
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

  return (
    <div
      className="bg-dot-grid"
      style={{
        backgroundColor: '#F8FAFC',
        minHeight: 'calc(100vh - 80px)',
        padding: '48px 0 84px 0',
        backgroundImage: `
          radial-gradient(ellipse 800px 420px at 50% -40px, rgba(37, 99, 235, 0.14), rgba(124, 58, 237, 0.08), transparent 75%),
          radial-gradient(rgba(148, 163, 184, 0.16) 1.2px, transparent 1.2px)
        `,
        backgroundSize: '100% 100%, 28px 28px',
      }}
    >
      <div className="container" style={{ maxWidth: '1040px' }}>
        {/* Header */}
        <div className="text-center" style={{ marginBottom: '38px' }}>
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
            <span>VIP Early Access Pass</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(30px, 4.5vw, 48px)',
              fontWeight: 800,
              letterSpacing: '-0.035em',
              color: 'var(--ink)',
              marginBottom: '12px',
              lineHeight: 1.1,
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
              maxWidth: '520px',
              margin: '0 auto',
              backgroundColor: '#FFFFFF',
              border: generated.expired ? '1.5px solid #FECACA' : '1.5px solid #CBD5E1',
              borderRadius: 'var(--radius-bento)',
              padding: '36px 28px',
              boxShadow: '0 24px 50px -12px rgba(15, 23, 42, 0.12)',
              textAlign: 'center',
            }}
          >
            {generated.expired ? (
              <>
                <div
                  style={{
                    width: '54px',
                    height: '54px',
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

                <p style={{ fontSize: '14px', color: 'var(--slate)', marginBottom: '24px' }}>
                  This VIP invitation code is no longer valid. Generate a fresh code below.
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
                {/* Essential Countdown Bar */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    background: secondsLeft <= 30 ? '#FEF2F2' : '#EFF6FF',
                    color: secondsLeft <= 30 ? '#DC2626' : 'var(--blue-primary)',
                    border: secondsLeft <= 30 ? '1px solid #FECACA' : '1px solid #BFDBFE',
                    fontSize: '13px',
                    fontWeight: 800,
                    marginBottom: '20px',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  <Clock size={14} strokeWidth={2.5} />
                  <span>Expires in {mins}:{secs}</span>
                </div>

                {/* Progress Bar */}
                <div
                  style={{
                    width: '100%',
                    height: '6px',
                    background: '#F1F5F9',
                    borderRadius: '9999px',
                    overflow: 'hidden',
                    marginBottom: '22px',
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

                {/* Prominent Code Display */}
                <div
                  style={{
                    background: '#0F172A',
                    color: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '22px 16px',
                    marginBottom: '18px',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                    fontSize: 'clamp(20px, 5vw, 28px)',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    userSelect: 'all',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)',
                  }}
                >
                  {generated.code}
                </div>

                {/* Copy Control */}
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

                {/* Clear Expiration Warning */}
                <div
                  style={{
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: '#B45309',
                    background: '#FFFBEB',
                    border: '1px solid #FDE68A',
                    borderRadius: '10px',
                    padding: '10px 12px',
                  }}
                >
                  Single-use code for {generated.toolName}. Expires automatically in 2 minutes.
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
                gridTemplateColumns: 'repeat(auto-fill, minmax(235px, 1fr))',
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
                      backgroundColor: '#FFFFFF',
                      border: isSelected ? '2px solid var(--blue-primary)' : '1.5px solid #E2E8F0',
                      borderRadius: '18px',
                      padding: '20px',
                      cursor: 'pointer',
                      boxShadow: isSelected
                        ? '0 14px 30px -8px rgba(37, 99, 235, 0.25)'
                        : 'var(--shadow-subtle)',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '13px',
                          background: gradient.bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '21px',
                          boxShadow: `${gradient.shadow}, inset 0 1px 0 rgba(255,255,255,0.4)`,
                        }}
                      >
                        {tool.icon}
                      </div>

                      <div
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          border: isSelected ? 'none' : '1.5px solid #CBD5E1',
                          background: isSelected ? 'var(--blue-primary)' : '#F8FAFC',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {isSelected && <Check size={13} strokeWidth={3} />}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '15.5px', fontWeight: 800, color: 'var(--ink)', marginBottom: '4px' }}>
                        {tool.name}
                      </div>
                      <p
                        style={{
                          fontSize: '12.5px',
                          color: 'var(--slate)',
                          lineHeight: 1.5,
                          margin: 0,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
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
                  padding: '15px 34px',
                  fontSize: '15px',
                  fontWeight: 800,
                  borderRadius: '9999px',
                  boxShadow: '0 12px 28px -6px rgba(37, 99, 235, 0.35)',
                }}
              >
                <Sparkles size={17} strokeWidth={2.3} />
                <span>{generating ? 'Generating VIP Code...' : 'Generate VIP Code'}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

