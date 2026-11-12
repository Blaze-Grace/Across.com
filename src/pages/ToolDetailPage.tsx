import React from 'react';
import { SaaSTool } from '../types';
import { TOOLS } from '../data/tools';
import { ToolHero } from '../components/tool/ToolHero';
import { RoiCalculator } from '../components/tool/RoiCalculator';
import { ToolBento } from '../components/tool/ToolBento';
import { useWaitlist } from '../context/WaitlistContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { getToolGradient } from '../utils/toolStyles';

interface ToolDetailPageProps {
  tool: SaaSTool;
}

export const ToolDetailPage: React.FC<ToolDetailPageProps> = ({ tool }) => {
  const { openWaitlist } = useWaitlist();
  const otherTools = TOOLS.filter(t => t.slug !== tool.slug);
  useScrollReveal(tool.slug);

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Breadcrumb Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          fontSize: '13px',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div>
            <a href="/" style={{ color: 'var(--blue-primary)', textDecoration: 'none', fontWeight: 600 }}>Across Suite</a>
            <span style={{ margin: '0 8px', color: '#94A3B8' }}>/</span>
            <span style={{ color: 'var(--ink)', fontWeight: 700 }}>{tool.name}</span>
          </div>

          <div style={{
            fontSize: '11px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            background: '#ECFDF5',
            color: '#047857',
            padding: '4px 10px',
            borderRadius: '9999px',
            border: '1px solid #A7F3D0'
          }}>
            🎉 100% Free in Open Early Access
          </div>
        </div>

        {/* Product Hero */}
        <ToolHero tool={tool} />

        {/* Interactive ROI Calculator */}
        <RoiCalculator tool={tool} />

        {/* Structured Product Breakdown */}
        <ToolBento tool={tool} />

        {/* Explore Other Tools */}
        <div data-reveal="" style={{ marginTop: '60px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: '20px' }}>
            Explore Other Across Tools
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '16px'
          }}>
            {otherTools.map((t) => {
              const gradient = getToolGradient(t.slug);
              return (
                <a
                  key={t.slug}
                  href={`?tool=${t.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bento-card"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-light)',
                    borderRadius: '16px',
                    padding: '18px 20px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    boxShadow: 'var(--shadow-subtle)'
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '11px',
                    background: gradient.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    flexShrink: 0,
                    boxShadow: `${gradient.shadow}, inset 0 1px 0 rgba(255,255,255,0.4)`
                  }}>
                    {t.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--ink)' }}>{t.shortName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--slate-light)' }}>{t.category}</div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky Mobile Conversion Bar (Pinned at bottom on phones) */}
      <div className="tool-mobile-sticky-bar">
        <div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--ink)' }}>{tool.shortName}</div>
          <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>100% Free on Launch</div>
        </div>
        <button
          onClick={() => openWaitlist(tool.slug)}
          className="btn-lime"
          style={{ padding: '9px 18px', fontSize: '12.5px', fontWeight: 800 }}
        >
          Free Access ↗
        </button>
      </div>
    </div>
  );
};

