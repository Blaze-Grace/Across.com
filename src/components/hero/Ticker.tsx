import React from 'react';
import { TOOLS } from '../../data/tools';

export const Ticker: React.FC = () => {
  // Duplicate array for seamless infinite marquee loop
  const tickerItems = [...TOOLS, ...TOOLS];

  return (
    <div className="ticker-wrapper">
      <div className="ticker-track">
        {tickerItems.map((t, idx) => (
          <a
            key={`${t.slug}-${idx}`}
            href={`?tool=${t.slug}`}
            className="ticker-item"
            title={`View ${t.name}`}
          >
            <span style={{ fontSize: '15px' }}>{t.icon}</span>
            <span>{t.shortName}</span>
          </a>
        ))}
      </div>
    </div>
  );
};
