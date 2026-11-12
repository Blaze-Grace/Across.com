import React from 'react';
import { Monitor, X, AlertCircle, ExternalLink } from 'lucide-react';
import { useWaitlist } from '../../context/WaitlistContext';
import { TOOLS } from '../../data/tools';
import { getToolGradient } from '../../utils/toolStyles';

export const DesktopOnlyAlertModal: React.FC = () => {
  const { isDesktopAlertOpen, desktopAlertToolSlug, closeDesktopOnlyAlert } = useWaitlist();

  if (!isDesktopAlertOpen) return null;

  const tool = desktopAlertToolSlug
    ? TOOLS.find((t) => t.slug === desktopAlertToolSlug)
    : null;
  const gradient = getToolGradient(tool?.slug);

  return (
    <div
      className="modal-overlay"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="desktop-only-alert-title"
      onClick={closeDesktopOnlyAlert}
    >
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="mobile-sheet-drag-handle"></div>

        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: tool ? gradient.bg : 'linear-gradient(135deg, #2563EB, #4F46E5)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              boxShadow: `${tool ? gradient.shadow : '0 8px 18px -2px rgba(37, 99, 235, 0.35)'}, inset 0 1px 0 rgba(255,255,255,0.4)`,
              flexShrink: 0
            }}>
              {tool ? tool.icon : <Monitor size={22} strokeWidth={2.2} />}
            </div>

            <div style={{ minWidth: 0 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: '#FEF2F2',
                color: '#DC2626',
                border: '1px solid #FECACA',
                padding: '2px 9px',
                borderRadius: '9999px',
                fontSize: '10.5px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '4px'
              }}>
                <AlertCircle size={12} strokeWidth={2.5} />
                <span>Desktop Only</span>
              </div>
              <h3
                id="desktop-only-alert-title"
                style={{
                  fontSize: '18px',
                  fontWeight: 800,
                  color: 'var(--ink)',
                  letterSpacing: '-0.02em',
                  margin: 0
                }}
              >
                {tool ? tool.name : 'Across Application'}
              </h3>
            </div>
          </div>

          <button
            onClick={closeDesktopOnlyAlert}
            aria-label="Close alert"
            style={{
              background: '#F1F5F9',
              border: 'none',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#475569',
              flexShrink: 0
            }}
          >
            <X size={16} strokeWidth={2.4} />
          </button>
        </div>

        <div style={{
          background: '#FFFBEB',
          border: '1.5px solid #FDE68A',
          borderRadius: '14px',
          padding: '14px 16px',
          marginBottom: '18px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            background: '#FEF3C7',
            color: '#D97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '2px'
          }}>
            <Monitor size={17} strokeWidth={2.2} />
          </div>
          <p style={{
            fontSize: '13.5px',
            lineHeight: 1.55,
            color: '#78350F',
            fontWeight: 600,
            margin: 0
          }}>
            This application is for desktop use and cannot run on a mobile phone. Please open Across on a PC or laptop to install and run this tool.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={closeDesktopOnlyAlert}
            className="btn-primary btn-shimmer"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '13px',
              fontSize: '14px',
              borderRadius: '12px'
            }}
          >
            Got It
          </button>

          {tool && (
            <a
              href={`?tool=${tool.slug}`}
              onClick={closeDesktopOnlyAlert}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '12.5px',
                fontWeight: 700,
                color: 'var(--blue-primary)',
                textDecoration: 'none',
                padding: '6px'
              }}
            >
              <span>Read {tool.shortName} Overview Anyway</span>
              <ExternalLink size={13} strokeWidth={2.3} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

