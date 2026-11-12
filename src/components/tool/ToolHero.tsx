import React from 'react';
import { SaaSTool } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';
import { useWaitlist } from '../../context/WaitlistContext';
import { getToolGradient } from '../../utils/toolStyles';

interface ToolHeroProps {
  tool: SaaSTool;
}

export const ToolHero: React.FC<ToolHeroProps> = ({ tool }) => {
  const { isINR } = useCurrency();
  const { openWaitlist } = useWaitlist();
  const futurePrice = isINR ? `${tool.pricingFutureINR}/month` : `${tool.pricingFutureUSD}/month`;
  const gradient = getToolGradient(tool.slug);

  return (
    <div className="tool-hero-box hero-stagger-1" style={{
      backgroundColor: '#FFFFFF',
      border: '1.5px solid var(--border-light)',
      borderRadius: 'var(--radius-bento)',
      padding: '40px',
      marginBottom: '32px',
      boxShadow: 'var(--shadow-card)'
    }}>
      <div style={{
        width: '54px',
        height: '54px',
        borderRadius: '16px',
        background: gradient.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '26px',
        marginBottom: '18px',
        boxShadow: `${gradient.shadow}, inset 0 1px 0 rgba(255,255,255,0.4)`
      }}>
        {tool.icon}
      </div>

      <div style={{
        fontSize: '11px',
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--blue-primary)',
        marginBottom: '8px'
      }}>
        {tool.category}
      </div>

      <h1 style={{
        fontSize: 'clamp(28px, 4vw, 44px)',
        fontWeight: 800,
        letterSpacing: '-0.03em',
        lineHeight: 1.15,
        color: 'var(--ink)',
        marginBottom: '14px'
      }}>
        {tool.name} — <span style={{ color: 'var(--blue-primary)' }}>{tool.tagline}</span>
      </h1>

      <p style={{ fontSize: '16px', color: 'var(--slate)', lineHeight: 1.6, marginBottom: '10px', maxWidth: '850px' }}>
        {tool.shortDesc}
      </p>

      <p style={{ fontSize: '14px', color: 'var(--slate-light)', lineHeight: 1.6, marginBottom: '28px', maxWidth: '850px' }}>
        {tool.detailDesc}
      </p>

      {/* CTA Row */}
      <div className="tool-hero-cta-group" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
        <button
          className="btn-lime btn-shimmer tool-hero-main-btn"
          onClick={() => openWaitlist(tool.slug)}
          style={{ padding: '13px 26px', fontSize: '14px' }}
        >
          Request Early Access — Free
          <span className="arrow-badge">↗</span>
        </button>

        <div className="tool-hero-badges-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#FEF3C7',
            color: '#D97706',
            border: '1.5px solid #FCD34D',
            padding: '10px 18px',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 700,
            fontSize: '12.5px'
          }}>
            ⏳ Coming Soon
          </span>

          <div style={{
            fontSize: '12.5px',
            fontWeight: 800,
            color: '#059669',
            background: '#ECFDF5',
            border: '1px solid #A7F3D0',
            padding: '10px 16px',
            borderRadius: 'var(--radius-pill)'
          }}>
            100% Free on Launch ($0 / ₹0)
          </div>
        </div>
      </div>

      <div style={{ fontSize: '12px', color: 'var(--slate-light)' }}>
        Currently in Private Development. Planned Future Pricing: <strong>{futurePrice}</strong> once Early Access concludes.
      </div>
    </div>
  );
};

