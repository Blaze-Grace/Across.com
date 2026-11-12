import React from 'react';
import { FloatingCardArc } from './FloatingCardArc';
import { Ticker } from './Ticker';

export const Hero: React.FC = () => {
  return (
    <section
      className="hero-section bg-dot-grid"
      style={{
        position: 'relative',
        backgroundColor: '#FFFFFF',
        backgroundImage: `
          radial-gradient(ellipse 900px 500px at 50% -80px, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.08), transparent 75%),
          radial-gradient(circle 400px at 85% 150px, rgba(6, 182, 212, 0.07), transparent 70%),
          radial-gradient(circle 400px at 15% 200px, rgba(168, 85, 247, 0.06), transparent 70%),
          radial-gradient(rgba(148, 163, 184, 0.18) 1.2px, transparent 1.2px)
        `,
        backgroundSize: '100% 100%, 100% 100%, 100% 100%, 28px 28px',
        paddingTop: '44px',
        paddingBottom: '12px',
        overflow: 'hidden'
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Social Proof Eyebrow Badge */}
        <div className="hero-stagger-1" style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div className="hero-social-proof" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(226, 232, 240, 0.95)',
            padding: '7px 18px',
            borderRadius: '9999px',
            fontSize: '12.5px',
            fontWeight: 700,
            boxShadow: '0 4px 20px -2px rgba(37, 99, 235, 0.1), 0 2px 6px rgba(0,0,0,0.04)',
            maxWidth: '100%'
          }}>
            {/* Live Green Radar Dot */}
            <span className="radar-dot" style={{ marginRight: '2px' }}></span>

            {/* Micro Avatars */}
            <div style={{ display: 'flex', marginRight: '2px', flexShrink: 0 }}>
              <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'linear-gradient(135deg, #38BDF8, #2563EB)', color: '#fff', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>A</span>
              <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'linear-gradient(135deg, #A855F7, #EC4899)', color: '#fff', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginLeft: '-4px' }}>K</span>
              <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginLeft: '-4px' }}>R</span>
            </div>

            <span style={{ color: 'var(--ink)' }}>
              Open Early Access • <strong style={{ color: 'var(--blue-primary)', fontWeight: 800 }}>8 SaaS Tools 100% Free</strong>
            </span>
          </div>
        </div>

        {/* Display Headline with Iridescent Gradient */}
        <h1 className="hero-headline hero-stagger-2" style={{
          fontSize: 'clamp(34px, 5.8vw, 70px)',
          fontWeight: 800,
          lineHeight: 1.08,
          letterSpacing: '-0.035em',
          textAlign: 'center',
          color: 'var(--ink)',
          maxWidth: '920px',
          margin: '0 auto 18px auto',
          padding: '0 8px'
        }}>
          Transform How You<br />
          <span className="hero-gradient-text">Run Your Operations</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle hero-stagger-3" style={{
          fontSize: '17.5px',
          color: '#475569',
          maxWidth: '680px',
          margin: '0 auto 26px auto',
          textAlign: 'center',
          lineHeight: 1.6,
          letterSpacing: '-0.01em'
        }}>
          Streamline support QA, client reporting, review responses, invoice matching, order tracking, and CA document collection — all openly free to use right now.
        </p>

        {/* Hero Action Buttons */}
        <div className="hero-action-buttons hero-stagger-4">
          <a
            href="#suite"
            className="btn-primary hero-btn-primary btn-shimmer"
            style={{
              boxShadow: '0 10px 25px -4px rgba(29, 99, 220, 0.4), 0 0 15px rgba(37, 99, 235, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            Explore All 8 Free Tools
            <span style={{ fontSize: '13px', marginLeft: '4px' }}>↓</span>
          </a>

          <div className="hero-btn-secondary-group">
            {/* SaaS on Demand button */}
            <a
              href="?view=saas-on-demand"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-lime hero-btn-lime"
              style={{
                boxShadow: '0 6px 18px -3px rgba(198, 246, 77, 0.45)'
              }}
            >
              <span>⚡</span> SaaS on Demand
              <span className="arrow-badge">↗</span>
            </a>

            <a
              href="#about"
              className="btn-glass hero-btn-glass"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid #CBD5E1'
              }}
            >
              How It Works
              <span className="arrow-badge" style={{ background: 'var(--jet-black)', color: '#FFFFFF', fontWeight: 800 }}>↗</span>
            </a>
          </div>
        </div>

        {/* Star Rating Proof */}
        <div className="hero-stagger-5" style={{ textAlign: 'center', fontSize: '12.5px', color: '#475569', fontWeight: 600, marginBottom: '28px' }}>
          <span style={{ color: '#F59E0B' }}>★★★★★</span> Rated 4.9/5 by 4,900+ modern teams • 100% Free Open Early Access
        </div>

        {/* 3D Floating Card Arc */}
        <div className="hero-stagger-6">
          <FloatingCardArc />
        </div>
      </div>

      {/* Atmospheric Sleek Aurora Horizon (Replaces Cartoon Clouds) */}
      <div className="aurora-horizon" aria-hidden="true">
        <div className="aurora-beam"></div>
        <div className="aurora-glow"></div>
        <div className="horizon-gradient"></div>
      </div>

      {/* Product Ticker */}
      <Ticker />
    </section>
  );
};
