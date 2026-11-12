import React from 'react';
import { Zap, Target, Wallet, RefreshCw, TrendingUp, Handshake } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

export const BenefitsSection: React.FC = () => {
  const { isINR } = useCurrency();

  const benefits = [
    {
      Icon: Zap,
      title: 'Instant Setup',
      desc: 'Go from sign-up to working workflow in minutes. No complex onboarding, no implementation consultants, no sales calls.',
      gradient: 'linear-gradient(135deg, #2563EB, #38BDF8)',
      shadow: 'rgba(37, 99, 235, 0.35)'
    },
    {
      Icon: Target,
      title: 'Purpose-Built Focus',
      desc: 'Each tool does one job exceptionally well. No feature bloat, no confusing menus, no paying for things you never use.',
      gradient: 'linear-gradient(135deg, #7C3AED, #A855F7)',
      shadow: 'rgba(124, 58, 237, 0.35)'
    },
    {
      Icon: Wallet,
      title: 'SMB-Friendly Pricing',
      desc: `100% free right now during Early Access. Future pricing starts at ${isINR ? '₹399/mo' : '$6/mo'} — designed for lean teams.`,
      gradient: 'linear-gradient(135deg, #059669, #10B981)',
      shadow: 'rgba(16, 185, 129, 0.35)'
    },
    {
      Icon: RefreshCw,
      title: 'Replace Bloated Software',
      desc: 'Ditch overpriced enterprise subscriptions. Each Across tool directly replaces specific enterprise competitors.',
      gradient: 'linear-gradient(135deg, #E11D48, #FB7185)',
      shadow: 'rgba(225, 29, 72, 0.35)'
    },
    {
      Icon: TrendingUp,
      title: 'High ROI Workflows',
      desc: 'Every feature is built to save hours and prevent costly mistakes. Measurable ROI from day one of use.',
      gradient: 'linear-gradient(135deg, #D97706, #F59E0B)',
      shadow: 'rgba(245, 158, 11, 0.35)'
    },
    {
      Icon: Handshake,
      title: 'Direct Founder Access',
      desc: 'Early Access gives you direct influence over feature roadmaps. Talk straight to the people building your tools.',
      gradient: 'linear-gradient(135deg, #0D9488, #06B6D4)',
      shadow: 'rgba(13, 148, 136, 0.35)'
    }
  ];

  return (
    <section className="section-pad-lg" id="benefits" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="container">
        <div className="text-center" data-reveal style={{ marginBottom: '50px' }}>
          <div className="eyebrow">BENEFITS</div>
          <h2 className="section-title">Why teams choose Across</h2>
          <p className="section-subtitle">Purpose-built tools that respect your time, budget, and workflow.</p>
        </div>

        <div className="benefits-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {benefits.map((b, i) => {
            const IconComp = b.Icon;
            return (
              <div
                key={i}
                data-reveal
                className={`benefit-card ${i % 3 === 1 ? 'reveal-delay-1' : i % 3 === 2 ? 'reveal-delay-2' : ''}`}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid var(--border-light)',
                  borderRadius: 'var(--radius-card)',
                  padding: '26px 24px',
                  boxShadow: 'var(--shadow-subtle)',
                  cursor: 'default',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <div className="benefit-header" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  marginBottom: '14px'
                }}>
                  <div
                    className="benefit-icon"
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '13px',
                      background: b.gradient,
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 6px 16px -2px ${b.shadow}, inset 0 1px 1px rgba(255,255,255,0.45)`,
                      flexShrink: 0
                    }}
                  >
                    <IconComp size={20} strokeWidth={2.2} />
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--ink)', margin: 0, letterSpacing: '-0.02em' }}>
                    {b.title}
                  </h3>
                </div>
                <p style={{ fontSize: '13.5px', color: 'var(--slate)', lineHeight: 1.55, margin: 0 }}>
                  {b.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
