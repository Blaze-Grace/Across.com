import React from 'react';
import { SaaSTool } from '../../types';

interface ToolBentoProps {
  tool: SaaSTool;
}

export const ToolBento: React.FC<ToolBentoProps> = ({ tool }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '24px',
      marginBottom: '48px'
    }}>
      {/* Card 1: Core Capabilities */}
      <div
        className="bento-card"
        data-reveal=""
        style={{
          backgroundColor: '#FFFFFF',
          border: '1.5px solid var(--border-light)',
          borderRadius: 'var(--radius-card)',
          padding: '30px',
          boxShadow: 'var(--shadow-subtle)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '9px', background: 'linear-gradient(135deg, #4F46E5 0%, #38BDF8 100%)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', boxShadow: '0 6px 14px -4px rgba(79, 70, 229, 0.35)' }}>✦</div>
          <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--ink)' }}>Core Capabilities Checklist</h3>
        </div>

        <ul style={{ listStyle: 'none', display: 'grid', gap: '12px', fontSize: '13.5px', color: 'var(--slate)' }}>
          {tool.features.map((feat, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <span style={{ color: 'var(--blue-primary)', fontWeight: 800 }}>✦</span>
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Card 2: Problem & Market Gap */}
      <div
        className="bento-card reveal-delay-1"
        data-reveal=""
        style={{
          backgroundColor: '#FFFFFF',
          border: '1.5px solid var(--border-light)',
          borderRadius: 'var(--radius-card)',
          padding: '30px',
          boxShadow: 'var(--shadow-subtle)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '9px', background: 'linear-gradient(135deg, #0EA5E9 0%, #2563EB 100%)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', boxShadow: '0 6px 14px -4px rgba(14, 165, 233, 0.35)' }}>🔍</div>
          <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--ink)' }}>Problem & Market Gap</h3>
        </div>

        <p style={{ fontSize: '13.5px', color: 'var(--slate)', lineHeight: 1.6, marginBottom: '14px' }}>
          {tool.problem}
        </p>

        <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>
          Why teams love {tool.shortName}:
        </div>
        <p style={{ fontSize: '13px', color: 'var(--slate-light)', lineHeight: 1.5 }}>
          {tool.shortDesc}
        </p>
      </div>

      {/* Card 3: Competitor Replacement & Pricing */}
      <div
        className="bento-card reveal-delay-2"
        data-reveal=""
        style={{
          gridColumn: '1 / -1',
          backgroundColor: '#FFFFFF',
          border: '1.5px solid var(--border-light)',
          borderRadius: 'var(--radius-card)',
          padding: '30px',
          boxShadow: 'var(--shadow-subtle)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '9px', background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', boxShadow: '0 6px 14px -4px rgba(124, 58, 237, 0.35)' }}>💡</div>
          <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--ink)' }}>Replaces Legacy Competitors & Future Pricing</h3>
        </div>

        <p style={{ fontSize: '13.5px', color: 'var(--slate)', marginBottom: '14px' }}>
          Stop paying thousands for bloated enterprise subscriptions. {tool.shortName} directly replaces:
        </p>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {tool.competitors.map((comp) => (
            <span
              key={comp}
              style={{
                fontSize: '11.5px',
                textDecoration: 'line-through',
                color: '#94A3B8',
                background: '#F1F5F9',
                padding: '4px 10px',
                borderRadius: '6px',
                fontWeight: 600
              }}
            >
              {comp}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ background: '#F8FAFC', padding: '12px 18px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--slate-light)', textTransform: 'uppercase' }}>Current Early Access</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#059669', marginTop: '2px' }}>Free ($0 / ₹0)</div>
          </div>
          <div style={{ background: '#F8FAFC', padding: '12px 18px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--slate-light)', textTransform: 'uppercase' }}>Future INR Price</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--ink)', marginTop: '2px' }}>{tool.pricingFutureINR}/mo</div>
          </div>
          <div style={{ background: '#F8FAFC', padding: '12px 18px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--slate-light)', textTransform: 'uppercase' }}>Future USD Price</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--ink)', marginTop: '2px' }}>{tool.pricingFutureUSD}/mo</div>
          </div>
        </div>
      </div>
    </div>
  );
};

