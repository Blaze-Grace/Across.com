import React, { createContext, useContext, useState } from 'react';
import { Currency } from '../types';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  isINR: boolean;
  formatPrice: (amountINR: number, amountUSD: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    return (localStorage.getItem('across_currency') as Currency) || 'INR';
  });

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('across_currency', c);
  };

  const isINR = currency === 'INR';

  const formatPrice = (amountINR: number, amountUSD: number) => {
    return isINR ? `₹${amountINR.toLocaleString('en-IN')}` : `$${amountUSD.toLocaleString('en-US')}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, isINR, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

