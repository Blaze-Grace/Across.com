import React, { useState, useEffect } from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { useWaitlist } from '../../context/WaitlistContext';

interface NavbarProps {
  currentView?: 'landing' | 'tool' | 'admin' | 'saas-on-demand' | 'vip-access';
  onNavigateHome?: () => void;
  onNavigateAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView = 'landing', onNavigateHome, onNavigateAdmin }) => {
  const { currency, setCurrency } = useCurrency();
  const { openWaitlist } = useWaitlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(maxScroll > 0 ? Math.min(100, Math.max(0, (y / maxScroll) * 100)) : 0);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Secret founder shortcut: Pressing Ctrl+Shift+A opens admin portal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (onNavigateAdmin) onNavigateAdmin();
        else window.location.href = '?view=admin';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNavigateAdmin]);

  // Secret logo click: 3 clicks on logo within 2 seconds opens admin portal
  const handleLogoClick = (e: React.MouseEvent) => {
    if (e.detail === 3) {
      e.preventDefault();
      if (onNavigateAdmin) onNavigateAdmin();
      else window.location.href = '?view=admin';
      return;
    }
    if (onNavigateHome) {
      e.preventDefault();
      onNavigateHome();
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: scrolled ? '1px solid rgba(203, 213, 225, 0.85)' : '1px solid rgba(226, 232, 240, 0.7)',
      boxShadow: scrolled ? '0 8px 28px -8px rgba(15, 23, 42, 0.08)' : 'none',
      transition: 'all 0.25s ease'
    }}>
      <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }} aria-hidden="true" />
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px'
      }}>
        {/* Brand & Currency Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <a
            href="/"
            onClick={handleLogoClick}
            title="Across"
            style={{
              textDecoration: 'none',
              fontSize: '22px',
              fontWeight: 800,
              letterSpacing: '0.15em',
              color: 'var(--ink)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <img
              src="/logo.png"
              alt="Across Logo"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                objectFit: 'contain',
                boxShadow: '0 2px 8px rgba(29, 99, 220, 0.2)'
              }}
            />
            <span>ACRO<span style={{ color: 'var(--blue-primary)' }}>S</span>S</span>
          </a>

          {/* Dual-Currency Pill (Desktop) */}
          <div className="nav-currency-desktop" style={{
            display: 'inline-flex',
            backgroundColor: '#F1F5F9',
            padding: '3px',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: 700,
            border: '1px solid #E2E8F0'
          }}>
            <button
              onClick={() => setCurrency('INR')}
              style={{
                border: 'none',
                background: currency === 'INR' ? '#FFFFFF' : 'transparent',
                color: currency === 'INR' ? '#18181B' : '#64748B',
                padding: '4px 9px',
                borderRadius: '9999px',
                cursor: 'pointer',
                fontWeight: 700,
                boxShadow: currency === 'INR' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              🇮🇳 INR (₹)
            </button>
            <button
              onClick={() => setCurrency('USD')}
              style={{
                border: 'none',
                background: currency === 'USD' ? '#FFFFFF' : 'transparent',
                color: currency === 'USD' ? '#18181B' : '#64748B',
                padding: '4px 9px',
                borderRadius: '9999px',
                cursor: 'pointer',
                fontWeight: 700,
                boxShadow: currency === 'USD' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              🌍 USD ($)
            </button>
          </div>
        </div>

        {/* Center Nav Links (Desktop) */}
        <nav className="nav-links-desktop">
          <a href="#suite" style={{ textDecoration: 'none', fontSize: '14px', fontWeight: 600, color: '#4B5563', transition: 'color 0.15s ease' }}>SaaS Suite</a>
          <a href="#benefits" style={{ textDecoration: 'none', fontSize: '14px', fontWeight: 600, color: '#4B5563', transition: 'color 0.15s ease' }}>Benefits</a>
          <a href="#pricing" style={{ textDecoration: 'none', fontSize: '14px', fontWeight: 600, color: '#4B5563', transition: 'color 0.15s ease' }}>Pricing</a>
          <a href="#about" style={{ textDecoration: 'none', fontSize: '14px', fontWeight: 600, color: '#4B5563', transition: 'color 0.15s ease' }}>About</a>
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Mobile Quick Currency Toggle (1-tap switch right in mobile header) */}
          <div className="nav-currency-mobile">
            <button
              onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
              title={`Active: ${currency}. Tap to switch currency`}
              aria-label="Toggle currency"
            >
              <span className="curr-flag">{currency === 'INR' ? '🇮🇳 ₹' : '🌍 $'}</span>
              <span className="curr-code">{currency}</span>
            </button>
          </div>

          {/* SaaS on Demand button (Desktop) */}
          <a
            href="?view=saas-on-demand"
            target="_blank"
            rel="noopener noreferrer"
            title="Request a custom SaaS tool built on demand"
            className="nav-action-desktop"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--lime)',
              color: 'var(--ink)',
              padding: '8px 16px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(198, 246, 77, 0.45)',
              transition: 'all 0.15s ease'
            }}
          >
            <span>⚡</span> SaaS on Demand <span style={{ fontSize: '11px', fontWeight: 800 }}>↗</span>
          </a>

          <button
            className="btn-primary nav-action-desktop btn-shimmer"
            onClick={() => openWaitlist('all')}
            style={{ padding: '9px 18px', fontSize: '13px', boxShadow: '0 4px 14px rgba(29, 99, 220, 0.35)' }}
          >
            Get Early Access ↗
          </button>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Touch-Optimized for Mobile Customers & Viewers) */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        {/* Mobile Currency Selector */}
        <div className="mobile-currency-bar">
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>Currency:</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setCurrency('INR')}
              style={{
                border: 'none',
                background: currency === 'INR' ? 'var(--ink)' : '#FFFFFF',
                color: currency === 'INR' ? '#FFFFFF' : 'var(--ink)',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
              }}
            >
              🇮🇳 INR (₹)
            </button>
            <button
              onClick={() => setCurrency('USD')}
              style={{
                border: 'none',
                background: currency === 'USD' ? 'var(--ink)' : '#FFFFFF',
                color: currency === 'USD' ? '#FFFFFF' : 'var(--ink)',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
              }}
            >
              🌍 USD ($)
            </button>
          </div>
        </div>

        {/* Action 1: Get Early Access */}
        <button
          className="btn-primary"
          onClick={() => {
            setMobileMenuOpen(false);
            openWaitlist('all');
          }}
          style={{
            width: '100%',
            justifyContent: 'center',
            padding: '13px',
            fontSize: '14px',
            borderRadius: '12px'
          }}
        >
          🎉 Get Early Access (100% Free) ↗
        </button>

        {/* Action 2: SaaS on Demand */}
        <a
          href="?view=saas-on-demand"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            backgroundColor: 'var(--lime)',
            color: 'var(--ink)',
            padding: '12px',
            borderRadius: '12px',
            fontWeight: 800,
            textDecoration: 'none',
            fontSize: '14px'
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          ⚡ SaaS on Demand (Request Tool) ↗
        </a>

        <div style={{ borderTop: '1px solid #E2E8F0', margin: '4px 0' }}></div>

        {/* Navigation Links */}
        <a href="#suite" style={{ textDecoration: 'none', color: 'var(--ink)', fontWeight: 700, padding: '10px 4px', fontSize: '15px' }} onClick={() => setMobileMenuOpen(false)}>
          📦 SaaS Suite Directory
        </a>
        <a href="#benefits" style={{ textDecoration: 'none', color: 'var(--ink)', fontWeight: 700, padding: '10px 4px', fontSize: '15px' }} onClick={() => setMobileMenuOpen(false)}>
          ✨ Benefits & Architecture
        </a>
        <a href="#pricing" style={{ textDecoration: 'none', color: 'var(--ink)', fontWeight: 700, padding: '10px 4px', fontSize: '15px' }} onClick={() => setMobileMenuOpen(false)}>
          💎 100% Free Early Access Pricing
        </a>
        <a href="#about" style={{ textDecoration: 'none', color: 'var(--ink)', fontWeight: 700, padding: '10px 4px', fontSize: '15px' }} onClick={() => setMobileMenuOpen(false)}>
          🏢 About Across Studio
        </a>
      </div>

      {/* Backdrop for closing mobile drawer on outside click */}
      {mobileMenuOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
};
