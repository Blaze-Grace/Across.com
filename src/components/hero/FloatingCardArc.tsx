import React, { useState, useRef } from 'react';
import { useWaitlist } from '../../context/WaitlistContext';
import { isMobileViewer } from '../../utils/device';

export const FloatingCardArc: React.FC = () => {
  const { openWaitlist, showDesktopOnlyAlert } = useWaitlist();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [activeCard, setActiveCard] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8; // -4deg to +4deg
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleOpenTool = (slug: string) => {
    if (isMobileViewer()) {
      showDesktopOnlyAlert(slug);
      return;
    }
    window.open(`?tool=${slug}`, '_blank');
  };

  const handleCarouselScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const cardWidth = 300;
      const idx = Math.round(scrollLeft / cardWidth);
      setActiveCard(Math.min(Math.max(idx, 0), 4));
    }
  };

  const scrollToCard = (idx: number) => {
    if (carouselRef.current) {
      const cards = carouselRef.current.children;
      if (cards[idx]) {
        (cards[idx] as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        setActiveCard(idx);
      }
    }
  };

  return (
    <>
      {/* ========================================================
          1. DESKTOP 3D FLOATING ARC (PARABOLIC PHYSICS & TILT)
          ======================================================== */}
      <div
        className="hero-arc-wrapper hero-arc-desktop"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1200px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
          transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Card 1: Support QA (converse-qa) */}
        <div
          onClick={() => handleOpenTool('converse-qa')}
          title="Click to view Across ConverseQA"
          className="hero-float-card card-pos-1"
          style={{
            background: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(16px)',
            border: '1.5px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '0 18px 38px -10px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.04)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="pulse-dot" style={{ background: '#6366F1' }}></span>
              <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#6366F1' }}>
                Support QA
              </span>
            </div>
            <span style={{ fontSize: '8.5px', fontWeight: 800, background: '#EEF2FF', color: '#4F46E5', padding: '2px 6px', borderRadius: '4px' }}>
              Live
            </span>
          </div>

          <div>
            <div style={{ fontSize: '25px', fontWeight: 800, letterSpacing: '-0.03em', color: '#18181B', lineHeight: 1.1 }}>
              100% QA
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
              Conversation Coverage
            </div>
            <div style={{ marginTop: '6px', height: '24px' }}>
              <svg viewBox="0 0 160 26" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <defs>
                  <linearGradient id="sqaGradLive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity="0.35"/>
                    <stop offset="100%" stopColor="#6366F1" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path d="M0 20 C30 18, 50 12, 80 10 C110 8, 130 4, 160 2 L160 26 L0 26 Z" fill="url(#sqaGradLive)"/>
                <path d="M0 20 C30 18, 50 12, 80 10 C110 8, 130 4, 160 2" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" className="sparkline-path"/>
                <circle cx="160" cy="2" r="3.5" fill="#6366F1" className="sparkline-dot"/>
              </svg>
            </div>
          </div>

          <div style={{ background: '#ECFDF5', color: '#047857', padding: '5px 9px', borderRadius: '8px', fontSize: '10.5px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span>✓</span> 100% Chats Audited
          </div>
        </div>

        {/* Card 2: Finance OS (invoice-verify) */}
        <div
          onClick={() => handleOpenTool('invoice-verify')}
          title="Click to view Across InvoiceVerify"
          className="hero-float-card card-pos-2"
          style={{
            background: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(16px)',
            border: '1.5px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '0 18px 38px -10px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.04)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0284C7' }}></span>
              <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#64748B' }}>
                Finance OS
              </span>
            </div>
            <span style={{ fontSize: '8.5px', fontWeight: 800, background: '#111111', color: '#C6F64D', padding: '2px 7px', borderRadius: '4px' }}>
              Auto-Match
            </span>
          </div>

          <div>
            <div style={{ fontSize: '25px', fontWeight: 800, letterSpacing: '-0.03em', color: '#18181B', lineHeight: 1.1 }}>
              520k+
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
              Invoices Auto-Matched
            </div>
            <div style={{ marginTop: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', fontWeight: 700, color: '#0284C7', marginBottom: '2px' }}>
                <span>PO Match Accuracy</span>
                <span>100%</span>
              </div>
              <div className="fc-progress-bar">
                <div className="fc-progress-fill" style={{ width: '100%', background: 'linear-gradient(90deg, #38BDF8, #0284C7)' }}></div>
              </div>
            </div>
          </div>

          <div style={{ background: '#F0F9FF', color: '#0369A1', padding: '5px 9px', borderRadius: '8px', fontSize: '10.5px', fontWeight: 700 }}>
            🛡️ 0 Duplicate Charges
          </div>
        </div>

        {/* Card 3 (Centerpiece): Across OS */}
        <div
          onClick={() => openWaitlist('all')}
          title="Click to request Early Access"
          className="hero-float-card card-pos-3 card-center-sky"
          style={{
            background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 45%, #7C3AED 100%)',
            color: '#FFFFFF',
            border: '1.5px solid rgba(255, 255, 255, 0.55)',
            boxShadow: '0 28px 60px -12px rgba(124, 58, 237, 0.45), 0 0 25px rgba(59, 130, 246, 0.35)',
            position: 'absolute',
            overflow: 'hidden'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '14px' }}>⌛</span>
              <span style={{ fontSize: '10.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#FFFFFF' }}>
                Across OS
              </span>
            </div>
            <span style={{ fontSize: '9.5px', fontWeight: 800, background: 'rgba(255,255,255,0.25)', padding: '2px 8px', borderRadius: '9999px' }}>
              Suite
            </span>
          </div>

          <div>
            <div style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              8 SaaS Tools
            </div>
            <div style={{ fontSize: '11.5px', opacity: 0.95, marginTop: '2px', fontWeight: 600 }}>
              Purpose-Built Suite
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '9.5px', marginTop: '6px', opacity: 0.95, fontWeight: 700 }}>
              <span className="pulse-dot" style={{ background: '#BEF264', width: '6px', height: '6px' }}></span>
              <span>Coming Soon • 100% Free</span>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.22)',
            backdropFilter: 'blur(4px)',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '11px',
            fontWeight: 700,
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}>
            <span>⏳</span> Coming Soon
          </div>
        </div>

        {/* Card 4: Operations OS (commit-track) */}
        <div
          onClick={() => handleOpenTool('commit-track')}
          title="Click to view Across CommitTrack"
          className="hero-float-card card-pos-4 card-jet-black"
          style={{
            background: '#111111',
            color: '#FFFFFF',
            border: '1.5px solid rgba(255, 255, 255, 0.14)',
            boxShadow: '0 22px 46px -6px rgba(0, 0, 0, 0.6), 0 8px 18px -2px rgba(0, 0, 0, 0.35)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="pulse-dot" style={{ background: '#C6F64D' }}></span>
              <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#94A3B8' }}>
                Operations OS
              </span>
            </div>
            <span style={{ fontSize: '9px', fontWeight: 800, color: '#C6F64D' }}>
              ⚡ 100%
            </span>
          </div>

          <div>
            <div style={{ fontSize: '25px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              0 Missed
            </div>
            <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px', fontWeight: 600 }}>
              Action Items & Deadlines
            </div>
            <div style={{ marginTop: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', fontWeight: 700, color: '#94A3B8', marginBottom: '2px' }}>
                <span>Tasks Synced</span>
                <span style={{ color: '#C6F64D' }}>100%</span>
              </div>
              <div className="fc-progress-bar">
                <div className="fc-progress-fill" style={{ width: '100%', background: 'var(--lime)' }}></div>
              </div>
            </div>
          </div>

          <div style={{ background: '#1E293B', color: '#C6F64D', padding: '5px 9px', borderRadius: '8px', fontSize: '10.5px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span>⚡</span> Auto-Extracted
          </div>
        </div>

        {/* Card 5: Client Flow (ca-docflow) */}
        <div
          onClick={() => handleOpenTool('ca-docflow')}
          title="Click to view Across CA DocFlow"
          className="hero-float-card card-pos-5"
          style={{
            background: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(16px)',
            border: '1.5px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '0 18px 38px -10px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.04)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444' }}></span>
              <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#64748B' }}>
                Client Flow
              </span>
            </div>
            <span style={{ fontSize: '9.5px', color: '#F59E0B' }}>★★★★★</span>
          </div>

          <div>
            <div style={{ fontSize: '25px', fontWeight: 800, letterSpacing: '-0.03em', color: '#18181B', lineHeight: 1.1 }}>
              10x Faster
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px', fontWeight: 600 }}>
              Client Docs & Follow-ups
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '9px', color: '#475569', fontWeight: 600, marginTop: '6px' }}>
              <span style={{ color: '#059669' }}>✓ WhatsApp Reminders Sent</span>
              <span style={{ color: '#059669' }}>✓ Missing Documents Flagged</span>
            </div>
          </div>

          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '4px 8px', borderRadius: '8px', fontSize: '9.5px', color: '#475569', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span>⏱️</span> &lt; 3 Min Setup
          </div>
        </div>
      </div>

      {/* ========================================================
          2. MOBILE INTERACTIVE CARD CAROUSEL (SWIPEABLE & NATIVE)
          ======================================================== */}
      <div className="hero-mobile-carousel-container">
        <div
          ref={carouselRef}
          onScroll={handleCarouselScroll}
          className="hero-mobile-carousel"
        >
          {/* Mobile Card 1: Across OS (Featured Centerpiece) */}
          <div
            onClick={() => openWaitlist('all')}
            className="hero-mobile-card"
            style={{
              background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 45%, #7C3AED 100%)',
              color: '#FFFFFF',
              border: '1.5px solid rgba(255, 255, 255, 0.55)',
              boxShadow: '0 16px 36px -8px rgba(124, 58, 237, 0.35)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '14px' }}>⌛</span>
                <span style={{ fontSize: '10.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#FFFFFF' }}>
                  Across OS
                </span>
              </div>
              <span style={{ fontSize: '9.5px', fontWeight: 800, background: 'rgba(255,255,255,0.25)', padding: '2px 8px', borderRadius: '9999px' }}>
                Suite
              </span>
            </div>

            <div style={{ margin: '14px 0' }}>
              <div style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                8 SaaS Tools
              </div>
              <div style={{ fontSize: '12px', opacity: 0.95, marginTop: '3px', fontWeight: 600 }}>
                Purpose-Built Workflow Suite
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', marginTop: '6px', opacity: 0.95, fontWeight: 700 }}>
                <span className="pulse-dot" style={{ background: '#BEF264', width: '6px', height: '6px' }}></span>
                <span>Open Early Access • 100% Free</span>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.22)',
              backdropFilter: 'blur(4px)',
              padding: '7px 12px',
              borderRadius: '10px',
              fontSize: '11px',
              fontWeight: 700,
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}>
              <span>⏳</span> Coming Soon • Join Free
            </div>
          </div>

          {/* Mobile Card 2: Support QA */}
          <div
            onClick={() => handleOpenTool('converse-qa')}
            className="hero-mobile-card"
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #E2E8F0'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="pulse-dot" style={{ background: '#6366F1' }}></span>
                <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#6366F1' }}>
                  Support QA
                </span>
              </div>
              <span style={{ fontSize: '9px', fontWeight: 800, background: '#EEF2FF', color: '#4F46E5', padding: '2px 7px', borderRadius: '4px' }}>
                Live Preview
              </span>
            </div>

            <div style={{ margin: '14px 0' }}>
              <div style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.03em', color: '#18181B', lineHeight: 1.1 }}>
                100% QA
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
                Conversation Coverage
              </div>
              <div style={{ marginTop: '8px', height: '22px' }}>
                <svg viewBox="0 0 160 26" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  <path d="M0 20 C30 18, 50 12, 80 10 C110 8, 130 4, 160 2" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                  <circle cx="160" cy="2" r="3.5" fill="#6366F1"/>
                </svg>
              </div>
            </div>

            <div style={{ background: '#ECFDF5', color: '#047857', padding: '6px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span>✓</span> 100% Chats Audited
            </div>
          </div>

          {/* Mobile Card 3: Finance OS */}
          <div
            onClick={() => handleOpenTool('invoice-verify')}
            className="hero-mobile-card"
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #E2E8F0'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0284C7' }}></span>
                <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#64748B' }}>
                  Finance OS
                </span>
              </div>
              <span style={{ fontSize: '9px', fontWeight: 800, background: '#111111', color: '#C6F64D', padding: '2px 7px', borderRadius: '4px' }}>
                Auto-Match
              </span>
            </div>

            <div style={{ margin: '14px 0' }}>
              <div style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.03em', color: '#18181B', lineHeight: 1.1 }}>
                520k+
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
                Invoices Auto-Matched
              </div>
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', fontWeight: 700, color: '#0284C7', marginBottom: '2px' }}>
                  <span>PO Match Accuracy</span>
                  <span>100%</span>
                </div>
                <div className="fc-progress-bar">
                  <div className="fc-progress-fill" style={{ width: '100%', background: 'linear-gradient(90deg, #38BDF8, #0284C7)' }}></div>
                </div>
              </div>
            </div>

            <div style={{ background: '#F0F9FF', color: '#0369A1', padding: '6px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 700 }}>
              🛡️ 0 Duplicate Charges
            </div>
          </div>

          {/* Mobile Card 4: Operations OS */}
          <div
            onClick={() => handleOpenTool('commit-track')}
            className="hero-mobile-card"
            style={{
              background: '#111111',
              color: '#FFFFFF',
              border: '1.5px solid rgba(255, 255, 255, 0.15)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="pulse-dot" style={{ background: '#C6F64D' }}></span>
                <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#94A3B8' }}>
                  Operations OS
                </span>
              </div>
              <span style={{ fontSize: '9px', fontWeight: 800, color: '#C6F64D' }}>
                ⚡ 100% Sync
              </span>
            </div>

            <div style={{ margin: '14px 0' }}>
              <div style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                0 Missed
              </div>
              <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '2px', fontWeight: 600 }}>
                Action Items & Deadlines
              </div>
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', fontWeight: 700, color: '#94A3B8', marginBottom: '2px' }}>
                  <span>Tasks Synced</span>
                  <span style={{ color: '#C6F64D' }}>100%</span>
                </div>
                <div className="fc-progress-bar">
                  <div className="fc-progress-fill" style={{ width: '100%', background: 'var(--lime)' }}></div>
                </div>
              </div>
            </div>

            <div style={{ background: '#1E293B', color: '#C6F64D', padding: '6px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span>⚡</span> Auto-Extracted Tasks
            </div>
          </div>

          {/* Mobile Card 5: Client Flow */}
          <div
            onClick={() => handleOpenTool('ca-docflow')}
            className="hero-mobile-card"
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #E2E8F0'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444' }}></span>
                <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#64748B' }}>
                  Client Flow
                </span>
              </div>
              <span style={{ fontSize: '9.5px', color: '#F59E0B' }}>★★★★★</span>
            </div>

            <div style={{ margin: '14px 0' }}>
              <div style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.03em', color: '#18181B', lineHeight: 1.1 }}>
                10x Faster
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px', fontWeight: 600 }}>
                Client Docs & Follow-ups
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '9.5px', color: '#475569', fontWeight: 600, marginTop: '8px' }}>
                <span style={{ color: '#059669' }}>✓ WhatsApp Reminders Sent</span>
                <span style={{ color: '#059669' }}>✓ Missing Documents Flagged</span>
              </div>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '6px 10px', borderRadius: '10px', fontSize: '11px', color: '#475569', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span>⏱️</span> &lt; 3 Min Setup
            </div>
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="hero-mobile-dots">
          {[0, 1, 2, 3, 4].map((i) => (
            <button
              key={i}
              onClick={() => scrollToCard(i)}
              className={`hero-dot ${activeCard === i ? 'active' : ''}`}
              aria-label={`View workflow slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Carousel Swipe Hint Indicator */}
        <div className="hero-mobile-carousel-hint">
          <span className="hero-swipe-badge">
            👈 Swipe cards to explore 5 live preview dashboards 👉
          </span>
        </div>
      </div>
    </>
  );
};
