import React, { createContext, useContext, useState } from 'react';
import { WaitlistEntry } from '../types';
import confetti from 'canvas-confetti';

interface WaitlistContextType {
  isOpen: boolean;
  selectedToolSlug: string | null;
  openWaitlist: (toolSlug?: string) => void;
  closeWaitlist: () => void;
  submitWaitlist: (email: string, role: string, code?: string) => Promise<{ success: boolean; queueNumber: number; isVip: boolean }>;
  waitlistCount: number;
  isDesktopAlertOpen: boolean;
  desktopAlertToolSlug: string | null;
  showDesktopOnlyAlert: (toolSlug?: string) => void;
  closeDesktopOnlyAlert: () => void;
}

const WaitlistContext = createContext<WaitlistContextType | undefined>(undefined);

export const WaitlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedToolSlug, setSelectedToolSlug] = useState<string | null>(null);
  const [isDesktopAlertOpen, setIsDesktopAlertOpen] = useState(false);
  const [desktopAlertToolSlug, setDesktopAlertToolSlug] = useState<string | null>(null);
  const [waitlistCount, setWaitlistCount] = useState<number>(() => {
    return parseInt(localStorage.getItem('across_waitlist_count') || '0', 10);
  });

  const showDesktopOnlyAlert = (toolSlug?: string) => {
    setDesktopAlertToolSlug(toolSlug && toolSlug !== 'all' ? toolSlug : null);
    setIsDesktopAlertOpen(true);
  };

  const closeDesktopOnlyAlert = () => {
    setIsDesktopAlertOpen(false);
  };

  const openWaitlist = (toolSlug?: string) => {
    setSelectedToolSlug(toolSlug || null);
    setIsOpen(true);
  };

  const closeWaitlist = () => {
    setIsOpen(false);
  };

  const submitWaitlist = async (email: string, role: string, code?: string) => {
    const isVip = code === 'ACROSSVIP' || code === 'EARLYACCESS';
    let assignedQueue = waitlistCount + 1;

    const entry: WaitlistEntry = {
      id: 'wl_' + Date.now(),
      email,
      role,
      code,
      toolSlug: selectedToolSlug || 'all',
      queueNumber: assignedQueue,
      createdAt: new Date().toISOString()
    };

    // Forward to central backend API for worldwide persistence
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.queueNumber) {
          assignedQueue = data.queueNumber;
        }
      }
    } catch (e) {
      console.warn('API unreachable, saving locally:', e);
    }

    setWaitlistCount(assignedQueue);
    localStorage.setItem('across_waitlist_count', assignedQueue.toString());

    // Save locally in cache
    const existing: WaitlistEntry[] = JSON.parse(localStorage.getItem('across_waitlist_entries') || '[]');
    existing.unshift({ ...entry, queueNumber: assignedQueue });
    localStorage.setItem('across_waitlist_entries', JSON.stringify(existing));

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    return { success: true, queueNumber: assignedQueue, isVip };
  };

  return (
    <WaitlistContext.Provider
      value={{
        isOpen,
        selectedToolSlug,
        openWaitlist,
        closeWaitlist,
        submitWaitlist,
        waitlistCount,
        isDesktopAlertOpen,
        desktopAlertToolSlug,
        showDesktopOnlyAlert,
        closeDesktopOnlyAlert
      }}
    >
      {children}
    </WaitlistContext.Provider>
  );
};

export const useWaitlist = () => {
  const context = useContext(WaitlistContext);
  if (!context) {
    throw new Error('useWaitlist must be used within a WaitlistProvider');
  }
  return context;
};

