import React, { createContext, useContext, useState } from 'react';
import { WaitlistEntry } from '../types';
import confetti from 'canvas-confetti';

export interface WaitlistSubmissionPayload {
  name: string;
  email?: string;
  phone?: string;
  instagram?: string;
  preferredContact: 'email' | 'phone' | 'instagram';
  role: string;
  code: string;
  toolSlug?: string;
}

export interface WaitlistSubmissionResult {
  success: boolean;
  queueNumber?: number;
  isVip?: boolean;
  error?: string;
  errorCode?: string;
}

interface WaitlistContextType {
  isOpen: boolean;
  selectedToolSlug: string | null;
  openWaitlist: (toolSlug?: string) => void;
  closeWaitlist: () => void;
  submitWaitlist: (payload: WaitlistSubmissionPayload) => Promise<WaitlistSubmissionResult>;
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

  const submitWaitlist = async ({
    name,
    email,
    phone,
    instagram,
    preferredContact,
    role,
    code,
    toolSlug
  }: WaitlistSubmissionPayload): Promise<WaitlistSubmissionResult> => {
    const resolvedToolSlug = toolSlug || (selectedToolSlug && selectedToolSlug !== 'all' ? selectedToolSlug : 'converse-qa');
    const normalizedCode = code.trim().toUpperCase();

    if (!normalizedCode) {
      return {
        success: false,
        errorCode: 'MISSING_CODE',
        error: 'VIP invitation code is required. Please generate your code to continue.'
      };
    }

    const entry: WaitlistEntry = {
      id: 'wl_' + Date.now(),
      name: name.trim(),
      email: email?.trim() || undefined,
      phone: phone?.trim() || undefined,
      instagram: instagram?.trim() || undefined,
      preferredContact,
      role,
      code: normalizedCode,
      toolSlug: resolvedToolSlug,
      queueNumber: waitlistCount + 1,
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          errorCode: data.errorCode || 'VALIDATION_ERROR',
          error: data.error || 'Unable to verify VIP invitation code.'
        };
      }

      const assignedQueue = data.queueNumber || waitlistCount + 1;
      setWaitlistCount(assignedQueue);
      localStorage.setItem('across_waitlist_count', assignedQueue.toString());

      const existing: WaitlistEntry[] = JSON.parse(localStorage.getItem('across_waitlist_entries') || '[]');
      existing.unshift({ ...entry, queueNumber: assignedQueue });
      localStorage.setItem('across_waitlist_entries', JSON.stringify(existing));

      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {}

      return { success: true, queueNumber: assignedQueue, isVip: true };
    } catch {
      return {
        success: false,
        errorCode: 'NETWORK_ERROR',
        error: 'Server unreachable. Please ensure the backend is connected and try again.'
      };
    }
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

