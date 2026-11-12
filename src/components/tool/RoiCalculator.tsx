import React, { useState, useRef } from 'react';
import { SaaSTool } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';
import { trackEvent } from '../../utils/analytics';

interface RoiCalculatorProps {
  tool: SaaSTool;
}

export const RoiCalculator: React.FC<RoiCalculatorProps> = ({ tool }) => {
  const { isINR, formatPrice } = useCurrency();
  const [vol, setVol] = useState<number>(tool.roiDefault);
  const [hours, setHours] = useState<number>(10);
  const trackedSandboxRef = useRef(false);

  const recordSandboxRun = () => {
    if (!trackedSandboxRef.current) {
      trackedSandboxRef.current = true;
      trackEvent('sandbox_run', tool.slug);
    }
  };

  // Compute ROI
  const hoursSavedPerMonth = Math.round(hours * 3.2);
  const ratePerHour = isINR ? tool.roiRatePerHourINR : tool.roiRatePerHourUSD;
  const moneySaved = Math.round(hoursSavedPerMonth * ratePerHour);

  return (
    <div className="roi-calc-box" style={{
      backgroundColor: '#FFFFFF',
      border: '1.5px solid var(--border-light)',
      borderRadius: 'var(--radius-bento)',
      padding: '36px',
      marginBottom: '32px',
      boxShadow: 'var(--shadow-card)'
    }}>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ink)', marginBottom: '6px' }}>
          Interactive Time & Cost ROI Calculator
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--slate)' }}>
          Estimate how many hours and dollars your team saves each month by replacing enterprise bloat with {tool.shortName}.
        </p>
      </div>

      <div className="roi-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '30px',
        alignItems: 'center'
      }}>
        {/* Sliders */}
        <div style={{ display: 'grid', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>
              <span>{tool.roiMetric}</span>
              <span style={{ color: 'var(--blue-primary)', fontWeight: 800 }}>{vol.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={10}
              max={tool.roiMax}
              value={vol}
              onChange={(e) => {
                setVol(parseInt(e.target.value, 10));
                recordSandboxRun();
              }}
              style={{ width: '100%', accentColor: 'var(--blue-primary)' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>
              <span>Manual Hours Spent Per Week</span>
              <span style={{ color: 'var(--blue-primary)', fontWeight: 800 }}>{hours} hrs/wk</span>
            </div>
            <input
              type="range"
              min={2}
              max={40}
              value={hours}
              onChange={(e) => {
                setHours(parseInt(e.target.value, 10));
                recordSandboxRun();
              }}
              style={{ width: '100%', accentColor: 'var(--blue-primary)' }}
            />
          </div>
        </div>

        {/* Results Card */}
        <div style={{
          backgroundColor: '#F8FAFC',
          border: '1.5px solid var(--lime)',
          borderRadius: '18px',
          padding: '24px',
          display: 'grid',
          gap: '16px'
        }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--slate-light)' }}>
              Estimated Monthly Hours Saved
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#059669', letterSpacing: '-0.02em', lineHeight: 1.1, marginTop: '4px' }}>
              {hoursSavedPerMonth} hrs/mo
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--slate-light)' }}>
              Cost Saved vs Legacy Competitors ({isINR ? '₹ INR' : '$ USD'})
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1.1, marginTop: '4px' }}>
              {formatPrice(moneySaved, moneySaved)}/mo
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

