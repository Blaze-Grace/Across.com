import React from 'react';
import { SaaSTool } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';
import { useWaitlist } from '../../context/WaitlistContext';
import { getToolGradient } from '../../utils/toolStyles';
import { isMobileViewer } from '../../utils/device';

interface ToolCardProps {
  tool: SaaSTool;
  index?: number;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, index = 0 }) => {
  const { isINR } = useCurrency();
  const { showDesktopOnlyAlert } = useWaitlist();

  const handleClick = () => {
    if (isMobileViewer()) {
      showDesktopOnlyAlert(tool.slug);
      return;
    }
    window.open(`?tool=${tool.slug}`, '_blank');
  };

  const gradient = getToolGradient(tool.slug);

  return (
    <div
      onClick={handleClick}
      className="suite-card"
      style={{
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        backgroundColor: '#FFFFFF',
        border: '1.5px solid #E2E8F0',
        position: 'relative',
        minWidth: 0,
        maxWidth: '100%',
        boxSizing: 'border-box',
        animationDelay: `${Math.min(index * 55, 360)}ms`,
        ['--card-accent' as string]: gradient.accent,
        ['--card-glow' as string]: gradient.shadow
      }}
    >
      {/* Top Header & Body Container */}
      <div style={{ minWidth: 0, width: '100%' }}>
        {/* App Header: Squircle Icon + App Info + Status Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '12px',
          minWidth: 0,
          width: '100%'
        }}>
          {/* App Squircle Icon with Brand Gradient */}
          <div
            className="card-icon"
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: gradient.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              boxShadow: `0 8px 18px -2px ${gradient.shadow}, inset 0 1.5px 1px rgba(255, 255, 255, 0.45)`,
              flexShrink: 0
            }}
          >
            {tool.icon}
          </div>

          {/* Title & Metadata Column */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '6px',
              marginBottom: '3px',
              minWidth: 0
            }}>
              <h3
                className="card-title"
                style={{
                  fontSize: '16.5px',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: 'var(--ink)',
                  margin: 0,
                  lineHeight: 1.25,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  flex: 1,
                  minWidth: 0
                }}
              >
                {tool.name}
              </h3>

              {/* Status Badge */}
              <span style={{
                fontSize: '10.5px',
                fontWeight: 700,
                color: '#047857',
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                padding: '2px 8px',
                borderRadius: '9999px',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}>
                100% Free
              </span>
            </div>

            {/* Category & Persona Subtitle */}
            <div style={{
              fontSize: '12px',
              color: '#64748B',
              fontWeight: 600,
              lineHeight: 1.35,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minWidth: 0
            }}>
              <span style={{ color: 'var(--blue-primary)', fontWeight: 700 }}>{tool.filterCategory}</span>
              <span style={{ margin: '0 5px', opacity: 0.4 }}>•</span>
              <span>{tool.persona}</span>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <p style={{
          fontSize: '13px',
          color: 'var(--slate)',
          lineHeight: 1.5,
          marginBottom: '12px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {tool.tagline}
        </p>

        {/* Replaces Stack Callout */}
        {tool.competitors && tool.competitors.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 10px',
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
            marginBottom: '14px',
            fontSize: '11px',
            color: '#475569',
            minWidth: 0,
            overflow: 'hidden'
          }}>
            <span style={{ fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
              <span style={{ color: '#F59E0B' }}>⚡</span> Replaces:
            </span>
            <span style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: '#64748B',
              flex: 1,
              minWidth: 0
            }}>
              {tool.competitors.slice(0, 3).map((comp, idx) => (
                <span key={comp}>
                  <span style={{ textDecoration: 'line-through', opacity: 0.85 }}>{comp}</span>
                  {idx < Math.min(tool.competitors.length, 3) - 1 ? ' • ' : ''}
                </span>
              ))}
            </span>
          </div>
        )}
      </div>

      {/* Footer Pricing & CTA Button */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '12px',
        borderTop: '1px solid #F1F5F9',
        gap: '8px',
        minWidth: 0
      }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#059669', letterSpacing: '-0.02em' }}>
              {isINR ? '₹0' : '$0'}
            </span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>/ mo</span>
            <span style={{
              fontSize: '11px',
              color: '#94A3B8',
              textDecoration: 'line-through',
              marginLeft: '2px'
            }}>
              {isINR ? tool.pricingFutureINR : tool.pricingFutureUSD}
            </span>
          </div>
          <div style={{ fontSize: '10px', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: '6px' }}>🟢</span> 100% Free on Launch
          </div>
        </div>

        <button
          className="btn-primary btn-explore"
          style={{
            padding: '8px 14px',
            fontSize: '11.5px',
            fontWeight: 700,
            borderRadius: '9999px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            flexShrink: 0,
            whiteSpace: 'nowrap'
          }}
        >
          Explore Tool <span className="btn-arrow" style={{ transition: 'transform 0.2s ease' }}>↗</span>
        </button>
      </div>
    </div>
  );
};
