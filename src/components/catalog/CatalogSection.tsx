import React, { useState } from 'react';
import { Zap, Sparkles, Clock, ShieldCheck } from 'lucide-react';
import { TOOLS } from '../../data/tools';
import { ToolCard } from './ToolCard';
import { ComparisonMatrix } from './ComparisonMatrix';

export const CatalogSection: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'cards' | 'matrix'>('cards');

  const categories = [
    { label: 'All Applications', value: 'All', count: 8 },
    { label: 'Support QA', value: 'Support QA', count: 2 },
    { label: 'Finance', value: 'Finance', count: 1 },
    { label: 'Consultants', value: 'Consultants', count: 1 },
    { label: 'Reputation', value: 'Reputation', count: 1 },
    { label: 'Execution', value: 'Execution', count: 1 },
    { label: 'Operations', value: 'Operations', count: 1 },
    { label: 'CA & Tax', value: 'CA & Tax', count: 1 }
  ];

  const filteredTools = TOOLS.filter((tool) => {
    const matchesCategory = selectedCategory === 'All' || tool.filterCategory === selectedCategory;
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      tool.name.toLowerCase().includes(q) ||
      tool.tagline.toLowerCase().includes(q) ||
      tool.category.toLowerCase().includes(q) ||
      tool.persona.toLowerCase().includes(q) ||
      tool.competitors.some(c => c.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="section-pad-lg" id="suite" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="container">
        <div className="text-center" data-reveal style={{ marginBottom: '40px' }}>
          <div className="eyebrow">SaaS Suite Directory</div>
          <h2 className="section-title">
            Comprehensive workflow tools<br />and intelligent automation
          </h2>
          <p className="section-subtitle">
            Replace bloated enterprise software with fast, high-ROI workflow applications.
            All 8 tools are currently in private development and will be 100% free on launch.
          </p>
        </div>

        {/* Catalog Micro-Stats Ribbon */}
        <div className="catalog-stats-ribbon" data-reveal style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '36px'
        }}>
          <div className="bento-card" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.08)' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'linear-gradient(135deg, #2563EB, #0284C7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 6px 14px -2px rgba(37, 99, 235, 0.38), inset 0 1px 0 rgba(255,255,255,0.35)', color: '#fff' }}>
              <Zap size={18} strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--ink)' }}>8 SaaS Tools</div>
              <div style={{ fontSize: '11px', color: 'var(--slate-light)', fontWeight: 600 }}>Purpose-Built Suite</div>
            </div>
          </div>

          <div className="bento-card" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.08)' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'linear-gradient(135deg, #059669, #10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 6px 14px -2px rgba(16, 185, 129, 0.38), inset 0 1px 0 rgba(255,255,255,0.35)', color: '#fff' }}>
              <Sparkles size={18} strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--ink)' }}>100% Free</div>
              <div style={{ fontSize: '11px', color: 'var(--slate-light)', fontWeight: 600 }}>Zero Lock-In • ₹0</div>
            </div>
          </div>

          <div className="bento-card" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 14px rgba(6, 182, 212, 0.08)' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'linear-gradient(135deg, #0284C7, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 6px 14px -2px rgba(6, 182, 212, 0.38), inset 0 1px 0 rgba(255,255,255,0.35)', color: '#fff' }}>
              <Clock size={18} strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--ink)' }}>≤ 3 Min</div>
              <div style={{ fontSize: '11px', color: 'var(--slate-light)', fontWeight: 600 }}>Instant Cloud Setup</div>
            </div>
          </div>

          <div className="bento-card" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 14px rgba(124, 58, 237, 0.08)' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 6px 14px -2px rgba(124, 58, 237, 0.38), inset 0 1px 0 rgba(255,255,255,0.35)', color: '#fff' }}>
              <ShieldCheck size={18} strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--ink)' }}>Zero Contracts</div>
              <div style={{ fontSize: '11px', color: 'var(--slate-light)', fontWeight: 600 }}>No Card Required</div>
            </div>
          </div>
        </div>

        {/* Search & View Mode Row */}
        <div className="catalog-search-row" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          {/* Search Box */}
          <div className="catalog-search-input-wrapper" style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none' }}>🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tools, capabilities, or replaced apps..."
              className="catalog-search-input"
              style={{
                width: '100%',
                padding: search ? '12px 40px 12px 42px' : '12px 18px 12px 42px',
                borderRadius: '9999px',
                border: '1px solid #CBD5E1',
                fontSize: '13.5px',
                backgroundColor: '#FFFFFF',
                outline: 'none',
                boxShadow: 'var(--shadow-subtle)',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#3B82F6';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.14)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#CBD5E1';
                e.currentTarget.style.boxShadow = 'var(--shadow-subtle)';
              }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Clear search"
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  border: 'none',
                  background: '#E2E8F0',
                  color: '#475569',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Mode Switcher */}
          <div className="catalog-view-mode-bar" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
              Showing {filteredTools.length} of 8 applications
            </div>
            <div style={{ background: '#E2E8F0', padding: '3px', borderRadius: '8px', display: 'flex', gap: '2px' }}>
              <button
                onClick={() => setViewMode('cards')}
                style={{
                  border: 'none',
                  background: viewMode === 'cards' ? '#FFFFFF' : 'transparent',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                ⊞ Cards
              </button>
              <button
                onClick={() => setViewMode('matrix')}
                style={{
                  border: 'none',
                  background: viewMode === 'matrix' ? '#FFFFFF' : 'transparent',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                ☰ Matrix
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills with Horizontal Touch Scrolling */}
        <div className="catalog-filter-pills-row" style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: '8px',
          marginBottom: '24px'
        }}>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              style={{
                border: selectedCategory === cat.value ? 'none' : '1px solid #CBD5E1',
                backgroundColor: selectedCategory === cat.value ? 'var(--jet-black)' : '#FFFFFF',
                color: selectedCategory === cat.value ? '#FFFFFF' : 'var(--ink)',
                padding: '7px 16px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {cat.label} <span style={{ opacity: 0.6, fontSize: '10px', marginLeft: '4px' }}>{cat.count}</span>
            </button>
          ))}
        </div>

        {/* Content View */}
        {viewMode === 'cards' ? (
          filteredTools.length > 0 ? (
            <div className="catalog-cards-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {filteredTools.map((tool, index) => (
                <ToolCard key={tool.slug} tool={tool} index={index} />
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '44px 20px',
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              maxWidth: '480px',
              margin: '0 auto'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔍</div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--ink)', marginBottom: '6px' }}>
                No applications match your search
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--slate)', marginBottom: '18px', lineHeight: 1.5 }}>
                We couldn't find anything matching "{search}". Try searching another keyword or reset the filter.
              </p>
              <button
                onClick={() => { setSearch(''); setSelectedCategory('All'); }}
                className="btn-primary"
                style={{ padding: '8px 20px', fontSize: '12px', borderRadius: '9999px' }}
              >
                Reset Filters
              </button>
            </div>
          )
        ) : (
          <ComparisonMatrix />
        )}
      </div>
    </section>
  );
};

