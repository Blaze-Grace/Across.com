import React from 'react';
import { Zap, ShieldCheck } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

export const AboutBento: React.FC = () => {
  const { isINR } = useCurrency();

  return (
    <section className="section-pad-lg" id="about" style={{ backgroundColor: 'var(--bg-pure)' }}>
      <div className="container">
        <div className="text-center" data-reveal style={{ marginBottom: '50px' }}>
          <div className="eyebrow">ABOUT ACROSS</div>

          {/* Editorial statement with inline icon pills */}
          <h2 style={{
            fontSize: 'clamp(24px, 4.5vw, 46px)',
            fontWeight: 800,
            lineHeight: 1.25,
            letterSpacing: '-0.03em',
            color: 'var(--ink)',
            maxWidth: '850px',
            margin: '0 auto',
            padding: '0 4px'
          }}>
            A software product studio dedicated to building{' '}
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: 'var(--sky-horizon)',
              verticalAlign: 'middle',
              margin: '0 4px',
              boxShadow: '0 2px 8px rgba(56, 189, 248, 0.4)',
              transition: 'transform 0.2s ease'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FFFFFF' }}></span>
            </span>
            {' '}simpler and{' '}
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: 'var(--lime)',
              verticalAlign: 'middle',
              margin: '0 4px',
              boxShadow: '0 2px 8px rgba(198, 246, 77, 0.5)',
              transition: 'transform 0.2s ease'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#111111' }}></span>
            </span>
            {' '}more affordable SaaS for modern teams
          </h2>
        </div>

        {/* Asymmetric 4-Panel Bento Grid */}
        <div className="bento-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          alignItems: 'stretch'
        }}>
          {/* Card 1: 8+ Tools (Royal Aurora Gradient) */}
          <div
            className="bento-card"
            data-reveal
            style={{
              background: 'linear-gradient(145deg, #1E40AF 0%, #3B82F6 45%, #06B6D4 100%)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-bento)',
              padding: '36px 30px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 20px 40px -10px rgba(30, 64, 175, 0.45)',
              minHeight: '340px',
              cursor: 'default',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-45px',
              right: '-45px',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.22) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.22)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}>
              <Zap size={20} strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ fontSize: '58px', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }}>
                8+
              </div>
              <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '12px', opacity: 0.95 }}>
                Purpose-Built SaaS Tools
              </div>
              <p style={{ fontSize: '13px', opacity: 0.9, marginTop: '8px', lineHeight: 1.55 }}>
                Workflow applications replacing bloated enterprise software with focused, high-ROI alternatives.
              </p>
            </div>
          </div>

          {/* Card 2: 100% Free Commitment */}
          <div
            className="bento-card reveal-delay-1"
            data-reveal
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid var(--border-light)',
              borderRadius: 'var(--radius-bento)',
              padding: '36px 30px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-card)',
              minHeight: '340px',
              cursor: 'default'
            }}
          >
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0', padding: '4px 11px', borderRadius: '9999px', fontSize: '11px', fontWeight: 800, marginBottom: '10px' }}>
                <ShieldCheck size={13} strokeWidth={2.4} />
                <span>Verified Zero-Cost Guarantee</span>
              </div>
              <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--slate-light)' }}>
                Commitment to Measurable Value
              </div>
              <div style={{ fontSize: '38px', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--ink)', margin: '8px 0' }}>
                100% Free
              </div>
              <div style={{ display: 'flex', gap: '4px', marginTop: '10px' }}>
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'linear-gradient(135deg, #38BDF8, #2563EB)', color: '#fff', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>S</span>
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'linear-gradient(135deg, #F43F5E, #E11D48)', color: '#fff', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>M</span>
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#fff', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>A</span>
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>R</span>
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366F1, #4F46E5)', color: '#fff', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>K</span>
              </div>
            </div>

            <p style={{
              fontSize: '15.5px',
              fontWeight: 500,
              color: 'var(--ink)',
              fontStyle: 'normal',
              lineHeight: 1.6,
              borderTop: '1px solid #F1F5F9',
              paddingTop: '18px',
              letterSpacing: '-0.01em'
            }}>
              "Every Across application is openly free to use right now while we scale with early users — no credit card or enterprise contracts required."
            </p>
          </div>

          {/* Column 3: Split Stack */}
          <div
            className="reveal-delay-2"
            data-reveal
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            {/* Card 3: 10x Faster Deployment (Cutting-edge Dark Card with Speed Benchmark) */}
            <div
              className="bento-card"
              style={{
                background: '#090D16',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-bento)',
                padding: '24px 24px',
                border: '1.5px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.5)',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'default'
              }}
            >
              <div>
                <div style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, color: '#FFFFFF' }}>
                  10x Faster <span style={{ color: 'var(--lime)', fontSize: '22px' }}>⚡</span>
                </div>
                <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px' }}>
                  Zero setup bloat — go from problem to live workflow in minutes.
                </p>
              </div>

              {/* High-Tech Benchmark Comparison */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '14px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', padding: '6px 10px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8' }}>
                  <span>Legacy Enterprise</span>
                  <span style={{ color: '#F87171', fontWeight: 700 }}>6 Months ⏳</span>
                </div>
                <div style={{ background: 'rgba(198, 246, 77, 0.12)', border: '1px solid rgba(198, 246, 77, 0.3)', borderRadius: '8px', padding: '6px 10px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#FFFFFF' }}>
                  <span style={{ fontWeight: 700 }}>Across Automation</span>
                  <span style={{ color: 'var(--lime)', fontWeight: 800 }}>≤ 3 Minutes ⚡</span>
                </div>
              </div>
            </div>

            {/* Card 4: Future Pricing Cap (Jet Black) */}
            <div
              className="bento-card"
              style={{
                background: 'var(--jet-black)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-bento)',
                padding: '22px 24px',
                border: '1.5px solid rgba(255, 255, 255, 0.14)',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'default'
              }}
            >
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--slate-light)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Future Pricing Cap
                </div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
                  Transparent SMB Guarantee
                </div>
              </div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--lime)', letterSpacing: '-0.03em' }}>
                {isINR ? '₹399+' : '$6+'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
