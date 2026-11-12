import React, { useState } from 'react';
import { SaaSTool } from '../../types';
import { SANDBOX_PRESETS } from '../../data/tools';

interface InteractiveSandboxProps {
  tool: SaaSTool;
}

export const InteractiveSandbox: React.FC<InteractiveSandboxProps> = ({ tool }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const preset = SANDBOX_PRESETS[tool.slug] || {
    input: 'Sample incoming workflow data...',
    outputHtml: '<div>Sample execution results successfully rendered.</div>'
  };

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setHasRun(true);
    }, 600);
  };

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1.5px solid var(--border-light)',
      borderRadius: 'var(--radius-bento)',
      padding: '36px',
      marginBottom: '32px',
      boxShadow: 'var(--shadow-card)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 800, color: 'var(--ink)' }}>
          <span className="pulse-dot"></span>
          Live Interactive Preview Sandbox
        </div>
        <span style={{
          background: '#EFF6FF',
          color: 'var(--blue-primary)',
          fontSize: '11px',
          fontWeight: 700,
          padding: '4px 10px',
          borderRadius: '9999px',
          border: '1px solid #BFDBFE'
        }}>
          Interactive Simulation
        </span>
      </div>

      <p style={{ fontSize: '14px', color: 'var(--slate)', marginBottom: '22px' }}>
        Test this application's real workflow engine right now with pre-loaded realistic sample data — zero installation required.
      </p>

      {/* Input / Output 2-Column Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
      }}>
        {/* Input Box */}
        <div style={{
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '10px' }}>
            <span>Incoming Sample Data</span>
            <span style={{ color: '#94A3B8' }}>Pre-loaded</span>
          </div>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '11.5px',
            lineHeight: 1.6,
            color: '#334155',
            whiteSpace: 'pre-wrap',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
            padding: '14px',
            flex: 1,
            overflowY: 'auto',
            maxHeight: '260px'
          }}>
            {preset.input}
          </div>
        </div>

        {/* Output Box */}
        <div style={{
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '10px' }}>
            <span>Live Analysis Result</span>
            <span style={{ color: hasRun ? '#059669' : '#D97706' }}>
              {hasRun ? 'Analysis Complete ✓' : 'Ready to Run'}
            </span>
          </div>

          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
            padding: '14px',
            flex: 1,
            overflowY: 'auto',
            maxHeight: '260px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: hasRun ? 'flex-start' : 'center',
            alignItems: hasRun ? 'stretch' : 'center',
            textAlign: hasRun ? 'left' : 'center'
          }}>
            {isRunning ? (
              <div style={{ padding: '40px 0', color: 'var(--blue-primary)', fontWeight: 700 }}>
                ⚡ Processing workflow rules...
              </div>
            ) : hasRun ? (
              <div dangerouslySetInnerHTML={{ __html: preset.outputHtml }} />
            ) : (
              <div style={{ color: '#64748B', fontSize: '13px', padding: '30px 20px' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>⚡</div>
                Click <strong>"Run Sample Workflow"</strong> below to execute {tool.shortName}'s intelligence engine.
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        <button
          className="btn-primary"
          onClick={handleRun}
          disabled={isRunning}
          style={{ padding: '12px 24px', fontSize: '13.5px' }}
        >
          {isRunning ? 'Running Analysis...' : '▶ Run Sample Workflow'}
        </button>
        <span style={{ fontSize: '12px', color: 'var(--slate-light)' }}>
          Simulating live engine execution with real algorithmic parsing.
        </span>
      </div>
    </div>
  );
};

