import React, { useState } from 'react';
import { useWaitlist } from '../../context/WaitlistContext';
import { TOOLS } from '../../data/tools';
import { getToolGradient } from '../../utils/toolStyles';

export const WaitlistModal: React.FC = () => {
  const { isOpen, closeWaitlist, selectedToolSlug, submitWaitlist } = useWaitlist();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Solo Consultant / Independent');
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ queueNumber: number; isVip: boolean } | null>(null);

  if (!isOpen) return null;

  const tool = selectedToolSlug && selectedToolSlug !== 'all'
    ? TOOLS.find(t => t.slug === selectedToolSlug)
    : null;

  const title = tool ? tool.name : 'Across SaaS Suite';
  const icon = tool ? tool.icon : '⚡';
  const gradient = getToolGradient(tool?.slug);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      alert('Please enter a valid work email.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await submitWaitlist(email, role, code.trim().toUpperCase());
      setResult({ queueNumber: res.queueNumber, isVip: res.isVip });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setResult(null);
    setEmail('');
    setCode('');
    closeWaitlist();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Mobile Sheet Drag Handle */}
        <div className="mobile-sheet-drag-handle"></div>

        {/* Modal Header (Flex with Close Button - Never Overlaps) */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '18px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: gradient.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              boxShadow: `${gradient.shadow}, inset 0 1px 0 rgba(255,255,255,0.4)`,
              flexShrink: 0
            }}>
              {icon}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink)', margin: 0 }}>
                  {title}
                </h2>
                <span style={{
                  fontSize: '9.5px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  background: '#FEF3C7',
                  color: '#D97706',
                  border: '1px solid #FCD34D',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  whiteSpace: 'nowrap'
                }}>
                  Coming Soon
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--slate)', marginTop: '3px', fontWeight: 600 }}>
                Private Early Access • 100% Free on Public Launch
              </div>
            </div>
          </div>

          {/* Close Button in natural flex flow */}
          <button
            onClick={handleClose}
            aria-label="Close dialog"
            style={{
              background: '#F1F5F9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#64748B',
              flexShrink: 0,
              marginTop: '2px'
            }}
          >
            ✕
          </button>
        </div>

        {!result ? (
          <>
            <div style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '14px',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <p style={{ fontSize: '13px', color: 'var(--slate)', lineHeight: 1.6, marginBottom: '10px' }}>
                This application is currently in closed development. Join the waitlist to receive priority access and lock in your <strong>100% Free Lifetime Tier</strong> on launch.
              </p>
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', fontWeight: 700, color: 'var(--ink)', flexWrap: 'wrap' }}>
                <div>✓ Zero credit card required</div>
                <div>✓ Instant email notification</div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '5px', color: 'var(--ink)' }}>
                  Work Email <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="modal-input"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '5px', color: 'var(--ink)' }}>
                  Your Role / Team
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="modal-select"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '14px',
                    background: '#FFFFFF',
                    outline: 'none'
                  }}
                >
                  <option value="Solo Consultant / Independent">Solo Consultant / Independent</option>
                  <option value="Customer Support Lead">Customer Support & QA Lead</option>
                  <option value="Chartered Accountant (CA) / Tax Practice">Chartered Accountant (CA) / Tax Practice</option>
                  <option value="Finance Operations / AP Manager">Finance Operations / AP Manager</option>
                  <option value="SMB Owner / Founder">SMB Business Owner / Founder</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '5px', color: 'var(--ink)' }}>
                  Early Access Code <span style={{ fontWeight: 500, color: 'var(--slate-light)' }}>(Optional)</span>
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. VIP2026"
                  className="modal-input"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '14px',
                    outline: 'none',
                    letterSpacing: '0.05em'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary btn-shimmer"
                style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '13.5px' }}
              >
                {submitting ? 'Submitting...' : 'Request Early Access — Free ↗'}
              </button>
            </form>
          </>
        ) : (
          <div style={{
            marginTop: '16px',
            padding: '24px',
            background: '#ECFDF5',
            border: '1px solid #A7F3D0',
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🎉</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#065F46', marginBottom: '6px' }}>
              You're on the Priority List!
            </div>
            {result.isVip && (
              <div style={{
                display: 'inline-block',
                background: '#D1FAE5',
                color: '#065F46',
                fontWeight: 800,
                fontSize: '12px',
                padding: '4px 12px',
                borderRadius: '9999px',
                marginBottom: '10px',
                border: '1px solid #A7F3D0'
              }}>
                ⭐ VIP Code Applied — Priority #1 Queue
              </div>
            )}
            <div style={{ fontSize: '13.5px', color: '#047857', lineHeight: 1.6 }}>
              You are <strong>#{result.queueNumber}</strong> on the early access queue. We will email <strong>{email}</strong> the moment {tool ? tool.name : 'the suite'} launches!
            </div>
            <button
              className="btn-outline"
              style={{ marginTop: '18px', padding: '9px 24px', fontSize: '13px', background: '#FFFFFF' }}
              onClick={handleClose}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

