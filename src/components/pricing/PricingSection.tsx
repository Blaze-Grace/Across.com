import React from 'react';
import { Sparkles, Check, ArrowUpRight, ArrowDown } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { useWaitlist } from '../../context/WaitlistContext';

export const PricingSection: React.FC = () => {
  const { isINR } = useCurrency();
  const { openWaitlist } = useWaitlist();

  return (
    <section
      className="section-pad-lg bg-dot-grid"
      id="pricing"
      style={{
        backgroundColor: '#F8FAFC',
        backgroundImage: `
          radial-gradient(ellipse 700px 350px at 50% 25%, rgba(59, 130, 246, 0.12), rgba(139, 92, 246, 0.08), transparent 75%),
          radial-gradient(rgba(148, 163, 184, 0.15) 1.2px, transparent 1.2px)
        `,
        backgroundSize: '100% 100%, 28px 28px',
        position: 'relative'
      }}
    >
      <div className="container">
        <div className="text-center" data-reveal style={{ marginBottom: '44px' }}>
          <div className="eyebrow">Pricing</div>
          <h2 className="section-title">Simple, transparent pricing</h2>
          <p className="section-subtitle">Every Across tool is completely free during Open Early Access. No tricks.</p>
        </div>

        <div className="pricing-box reveal-delay-1" data-reveal style={{
          maxWidth: '560px',
          margin: '0 auto',
          backgroundColor: '#FFFFFF',
          border: '1.5px solid rgba(226, 232, 240, 0.95)',
          borderRadius: 'var(--radius-bento)',
          padding: '48px 40px',
          boxShadow: '0 24px 48px -12px rgba(15, 23, 42, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.9)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Top Gradient Highlight Strip */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 50%, #06B6D4 100%)'
          }} />

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            background: 'linear-gradient(135deg, #ECFDF5 0%, #EFF6FF 100%)',
            color: '#047857',
            border: '1px solid #A7F3D0',
            padding: '6px 16px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 800,
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)'
          }}>
            <span className="radar-dot" style={{ width: '6px', height: '6px' }}></span>
            <Sparkles size={13} strokeWidth={2.3} />
            <span>Open Early Access Lifetime Tier</span>
          </div>

          <div style={{
            fontSize: '56px',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: 'var(--ink)',
            lineHeight: 1,
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <span style={{ color: '#059669' }}>{isINR ? '₹0' : '$0'}</span>
            <span style={{ fontSize: '18px', fontWeight: 600, color: '#64748B' }}>/ mo</span>
            <span style={{
              fontSize: '17px',
              color: '#94A3B8',
              textDecoration: 'line-through',
              fontWeight: 600
            }}>
              {isINR ? '₹1,999/mo' : '$29/mo'}
            </span>
          </div>

          <p style={{ fontSize: '14px', color: 'var(--slate)', lineHeight: 1.6, marginBottom: '28px' }}>
            All 8 SaaS applications are 100% free on launch.
            No credit card required. No enterprise contracts. Lock in your free lifetime tier.
          </p>

          <ul style={{
            listStyle: 'none',
            textAlign: 'left',
            display: 'grid',
            gap: '12px',
            fontSize: '13.5px',
            color: 'var(--ink)',
            fontWeight: 600,
            marginBottom: '32px',
            padding: '0 4px'
          }}>
            {[
              'Priority access to all 8 workflow tools on launch',
              '100% Free Lifetime Tier locked in permanently',
              'No credit card or payment info required ever',
              'Direct influence on product roadmaps & features',
              'Direct feedback channel to product founders'
            ].map((text, idx) => (
              <li key={idx} className="pricing-check-item" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  width: '21px',
                  height: '21px',
                  borderRadius: '50%',
                  background: '#ECFDF5',
                  color: '#059669',
                  border: '1px solid #A7F3D0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Check size={12} strokeWidth={3} />
                </span>
                <span>{text}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => openWaitlist('all')}
            className="btn-primary btn-shimmer"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '15px',
              fontSize: '14.5px',
              fontWeight: 800,
              borderRadius: '12px',
              boxShadow: '0 10px 25px -4px rgba(29, 99, 220, 0.4), 0 0 15px rgba(37, 99, 235, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <Sparkles size={16} strokeWidth={2.2} />
            <span>Claim Free Lifetime Access</span>
            <ArrowUpRight size={16} strokeWidth={2.4} />
          </button>

          <a
            href="#suite"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              marginTop: '14px',
              fontSize: '12px',
              color: '#64748B',
              fontWeight: 700,
              textDecoration: 'none'
            }}
          >
            <ArrowDown size={13} strokeWidth={2.3} />
            <span>Or browse all 8 tool details</span>
          </a>

          <p style={{ fontSize: '11.5px', color: 'var(--slate-light)', marginTop: '16px' }}>
            After Early Access, single tools start as low as {isINR ? '₹399/mo' : '$6/mo'} — always transparent and SMB-friendly.
          </p>
        </div>
      </div>
    </section>
  );
};
