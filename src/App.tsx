import React, { useState, useEffect } from 'react';
import { CurrencyProvider } from './context/CurrencyContext';
import { WaitlistProvider } from './context/WaitlistContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { WaitlistModal } from './components/common/WaitlistModal';
import { DesktopOnlyAlertModal } from './components/common/DesktopOnlyAlertModal';
import { LandingPage } from './pages/LandingPage';
import { ToolDetailPage } from './pages/ToolDetailPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { SaasOnDemandPage } from './pages/SaasOnDemandPage';
import { TOOLS } from './data/tools';
import { trackEvent } from './utils/analytics';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'tool' | 'admin' | 'saas-on-demand'>('landing');
  const [activeToolSlug, setActiveToolSlug] = useState<string | null>(null);

  useEffect(() => {
    const parseUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const view = params.get('view');
      const tool = params.get('tool');

      if (view === 'admin') {
        setCurrentView('admin');
        setActiveToolSlug(null);
        document.title = 'Across Founder Demand Dashboard — Real-time Analytics';
      } else if (view === 'saas-on-demand') {
        setCurrentView('saas-on-demand');
        setActiveToolSlug(null);
        document.title = 'SaaS on Demand — Request Custom Workflow Tools | Across';
      } else if (tool) {
        const found = TOOLS.find(t => t.slug === tool);
        if (found) {
          setCurrentView('tool');
          setActiveToolSlug(found.slug);
          document.title = `${found.name} — Across Early Access`;
        } else {
          setCurrentView('landing');
          setActiveToolSlug(null);
          document.title = 'Across — Streamlined SaaS Workflow Tools for Modern Teams';
        }
      } else {
        setCurrentView('landing');
        setActiveToolSlug(null);
        document.title = 'Across — Streamlined SaaS Workflow Tools for Modern Teams';
      }
    };

    parseUrl();
    const initialView = new URLSearchParams(window.location.search).get('view');
    if (initialView !== 'admin' && !sessionStorage.getItem('across_visit_tracked')) {
      sessionStorage.setItem('across_visit_tracked', '1');
      trackEvent('visit');
    }
    window.addEventListener('popstate', parseUrl);
    return () => window.removeEventListener('popstate', parseUrl);
  }, []);

  const navigateToHome = () => {
    window.history.pushState({}, '', window.location.pathname);
    setCurrentView('landing');
    setActiveToolSlug(null);
    document.title = 'Across — Streamlined SaaS Workflow Tools for Modern Teams';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAdmin = () => {
    window.history.pushState({}, '', '?view=admin');
    setCurrentView('admin');
    setActiveToolSlug(null);
    document.title = 'Across Founder Demand Dashboard — Real-time Analytics';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeTool = activeToolSlug ? TOOLS.find(t => t.slug === activeToolSlug) : null;

  return (
    <CurrencyProvider>
      <WaitlistProvider>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar
            currentView={currentView}
            onNavigateHome={navigateToHome}
            onNavigateAdmin={navigateToAdmin}
          />

          <div style={{ flex: 1 }}>
            {currentView === 'admin' ? (
              <AdminDashboard onBackToLanding={navigateToHome} />
            ) : currentView === 'saas-on-demand' ? (
              <SaasOnDemandPage />
            ) : currentView === 'tool' && activeTool ? (
              <ToolDetailPage tool={activeTool} />
            ) : (
              <LandingPage />
            )}
          </div>

          <Footer />
          <WaitlistModal />
          <DesktopOnlyAlertModal />
        </div>
      </WaitlistProvider>
    </CurrencyProvider>
  );
};
export default App;

