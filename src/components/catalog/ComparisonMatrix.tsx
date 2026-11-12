import React from 'react';
import { TOOLS } from '../../data/tools';
import { useCurrency } from '../../context/CurrencyContext';
import { useWaitlist } from '../../context/WaitlistContext';
import { isMobileViewer } from '../../utils/device';

export const ComparisonMatrix: React.FC = () => {
  const { isINR } = useCurrency();
  const { openWaitlist, showDesktopOnlyAlert } = useWaitlist();

  return (
    <div style={{ marginTop: '24px' }}>
      {/* ========================================================
          1. DESKTOP COMPARISON TABLE (SHOWN ON > 768px)
          ======================================================== */}
      <div className="matrix-desktop-table" style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-card)',
        overflowX: 'auto',
        boxShadow: 'var(--shadow-subtle)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '780px' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748B' }}>
              <th style={{ padding: '16px 20px' }}>Tool & Function</th>
              <th style={{ padding: '16px 20px' }}>Target Customer</th>
              <th style={{ padding: '16px 20px' }}>Replaces Legacy Stack</th>
              <th style={{ padding: '16px 20px' }}>Early Access</th>
              <th style={{ padding: '16px 20px' }}>Future Price</th>
              <th style={{ padding: '16px 20px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: '13px' }}>
            {TOOLS.map((tool, idx) => (
              <tr
                key={tool.slug}
                style={{
                  borderBottom: idx === TOOLS.length - 1 ? 'none' : '1px solid #F1F5F9',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td style={{ padding: '16px 20px', fontWeight: 700, color: 'var(--ink)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{tool.icon}</span>
                    <a href={`?tool=${tool.slug}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                      {tool.name}
                    </a>
                  </div>
                </td>
                <td style={{ padding: '16px 20px', color: 'var(--slate)' }}>
                  {tool.persona}
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {tool.competitors.slice(0, 3).map((comp) => (
                      <span
                        key={comp}
                        style={{
                          fontSize: '10px',
                          textDecoration: 'line-through',
                          color: '#94A3B8',
                          background: '#F1F5F9',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}
                      >
                        {comp}
                      </span>
                    ))}
                  </div>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{
                    background: '#ECFDF5',
                    color: '#047857',
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 800
                  }}>
                    Free ($0 / ₹0)
                  </span>
                </td>
                <td style={{ padding: '16px 20px', fontWeight: 700, color: 'var(--slate)' }}>
                  {isINR ? tool.pricingFutureINR : tool.pricingFutureUSD} /mo
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                  <button
                    onClick={() => openWaitlist(tool.slug)}
                    style={{
                      padding: '6px 12px',
                      fontSize: '11px',
                      fontWeight: 800,
                      borderRadius: '9999px',
                      border: '1px solid #FCD34D',
                      background: '#FFFBEB',
                      color: '#D97706',
                      cursor: 'pointer'
                    }}
                  >
                    Coming Soon ⏳
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ========================================================
          2. MOBILE COMPARISON CARDS (TOUCH-OPTIMIZED <= 768px)
          ======================================================== */}
      <div className="matrix-mobile-cards">
        <div style={{ textAlign: 'center', marginBottom: '14px' }}>
          <span style={{
            fontSize: '11.5px',
            fontWeight: 700,
            color: '#0284C7',
            background: '#F0F9FF',
            border: '1px solid #BAE6FD',
            padding: '5px 12px',
            borderRadius: '9999px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span>⚡</span> Comparison Matrix • Across vs Legacy Bloat
          </span>
        </div>

        <div style={{ display: 'grid', gap: '12px' }}>
          {TOOLS.map((tool) => (
            <div
              key={tool.slug}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                borderRadius: '16px',
                padding: '16px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>{tool.icon}</span>
                  <a
                    href={`?tool=${tool.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (isMobileViewer()) {
                        e.preventDefault();
                        showDesktopOnlyAlert(tool.slug);
                      }
                    }}
                    style={{ textDecoration: 'none', color: 'var(--ink)', fontWeight: 800, fontSize: '15px' }}
                  >
                    {tool.name}
                  </a>
                </div>
                <span style={{
                  background: '#ECFDF5',
                  color: '#047857',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  fontSize: '10.5px',
                  fontWeight: 800
                }}>
                  100% Free
                </span>
              </div>

              <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '8px' }}>
                Built for <strong style={{ color: 'var(--ink)' }}>{tool.persona}</strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap', marginBottom: '12px', fontSize: '11px' }}>
                <span style={{ color: '#94A3B8', fontWeight: 600 }}>Replaces:</span>
                {tool.competitors.slice(0, 3).map((comp) => (
                  <span
                    key={comp}
                    style={{
                      fontSize: '10.5px',
                      textDecoration: 'line-through',
                      color: '#94A3B8',
                      background: '#F1F5F9',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}
                  >
                    {comp}
                  </span>
                ))}
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '10px',
                borderTop: '1px solid #F1F5F9'
              }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>Early Access: <strong style={{ color: '#059669' }}>₹0 / $0</strong></div>
                  <div style={{ fontSize: '10px', color: '#94A3B8' }}>Future: {isINR ? tool.pricingFutureINR : tool.pricingFutureUSD}/mo</div>
                </div>

                <button
                  onClick={() => openWaitlist(tool.slug)}
                  style={{
                    padding: '6px 14px',
                    fontSize: '11px',
                    fontWeight: 800,
                    borderRadius: '9999px',
                    border: '1px solid #FCD34D',
                    background: '#FFFBEB',
                    color: '#D97706',
                    cursor: 'pointer'
                  }}
                >
                  Coming Soon ⏳
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

