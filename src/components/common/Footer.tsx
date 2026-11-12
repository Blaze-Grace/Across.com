import React from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { useWaitlist } from '../../context/WaitlistContext';

export const Footer: React.FC = () => {
  const { isINR } = useCurrency();
  const { openWaitlist } = useWaitlist();

  return (
    <footer style={{
      backgroundColor: '#0F172A',
      color: '#94A3B8',
      padding: '70px 0 35px 0',
      borderTop: '1px solid #1E293B'
    }}>
      <div className="container">
        <div className="footer-grid">
          {/* Brand Col */}
          <div className="footer-brand-col">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '22px',
              fontWeight: 800,
              letterSpacing: '0.15em',
              color: '#FFFFFF',
              marginBottom: '14px'
            }}>
              <img
                src="/logo.png"
                alt="Across Logo"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  objectFit: 'contain',
                  boxShadow: '0 2px 8px rgba(56, 189, 248, 0.3)'
                }}
              />
              <span>ACRO<span style={{ color: '#38BDF8' }}>S</span>S</span>
            </div>
            <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#94A3B8', marginBottom: '16px' }}>
              A software product studio building focused, lightweight, high-ROI workflow SaaS applications for SMBs, solo consultants, CA firms, finance teams, and support leaders.
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(56, 189, 248, 0.1)',
              color: '#38BDF8',
              padding: '6px 12px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 700
            }}>
              <span>●</span> 100% Free During Open Early Access
            </div>
          </div>

          {/* Tools Group (Side-by-Side 2-column on mobile) */}
          <div className="footer-tools-group">
            {/* Suite Col 1 */}
            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
                Support & Analytics
              </h4>
              <ul style={{ listStyle: 'none', display: 'grid', gap: '9px', fontSize: '13px', padding: 0 }}>
                <li><a href="?tool=converse-qa" className="footer-link">Across ConverseQA</a></li>
                <li><a href="?tool=solo-report" className="footer-link">Across SoloReport</a></li>
                <li><a href="?tool=review-flow" className="footer-link">Across ReviewFlow</a></li>
                <li><a href="?tool=support-lens" className="footer-link">Across SupportLens</a></li>
              </ul>
            </div>

            {/* Suite Col 2 */}
            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
                Finance & Ops
              </h4>
              <ul style={{ listStyle: 'none', display: 'grid', gap: '9px', fontSize: '13px', padding: 0 }}>
                <li><a href="?tool=commit-track" className="footer-link">Across CommitTrack</a></li>
                <li><a href="?tool=invoice-verify" className="footer-link">Across InvoiceVerify</a></li>
                <li><a href="?tool=order-hub" className="footer-link">Across OrderHub</a></li>
                <li><a href="?tool=ca-docflow" className="footer-link">Across CA DocFlow</a></li>
              </ul>
            </div>
          </div>

          {/* Studio Col */}
          <div className="footer-studio-col">
            <h4 style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
              About Across
            </h4>
            <ul style={{ listStyle: 'none', display: 'grid', gap: '9px', fontSize: '13px', padding: 0 }}>
              <li><a href="#about" className="footer-link">Product Manifesto</a></li>
              <li><a href="#pricing" className="footer-link">Transparent Pricing Cap ({isINR ? '₹399+' : '$6+'})</a></li>
              <li>
                <button
                  onClick={() => openWaitlist('all')}
                  className="footer-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit', textAlign: 'left' }}
                >
                  Request Early Access
                </button>
              </li>
              <li>
                <a
                  href="?view=saas-on-demand"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--lime)', textDecoration: 'none', fontWeight: 700 }}
                >
                  ⚡ SaaS on Demand (Request Custom Tool) ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #1E293B',
          paddingTop: '25px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '12px'
        }}>
          <div>© {new Date().getFullYear()} Across Inc. Built for modern SMBs, consultants & operators.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span>Zero Contracts</span>
            <span>No Credit Card</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{
                background: '#1E293B',
                border: '1px solid #334155',
                color: '#CBD5E1',
                borderRadius: '9999px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
