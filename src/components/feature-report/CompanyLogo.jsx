import { useState } from 'react';

// Known domain mappings for common SaaS companies
const DOMAIN_MAP = {
  'anaplan': 'anaplan.com',
  'onestream': 'onestream.com',
  'blackline': 'blackline.com',
  'workday': 'workday.com',
  'oracle': 'oracle.com',
  'sap': 'sap.com',
  'salesforce': 'salesforce.com',
  'netsuite': 'netsuite.com',
  'workiva': 'workiva.com',
  'planful': 'planful.com',
  'vena': 'venasolutions.com',
  'board': 'board.com',
  'jedox': 'jedox.com',
  'adaptive insights': 'adaptiveinsights.com',
  'pigment': 'pigment.com',
  'datarails': 'datarails.com',
};

function getClearbitUrl(name) {
  const lower = (name || '').toLowerCase();
  for (const [key, domain] of Object.entries(DOMAIN_MAP)) {
    if (lower.includes(key)) return `https://logo.clearbit.com/${domain}`;
  }
  // Guess domain from company name
  const guess = lower.replace(/[^a-z0-9]/g, '') + '.com';
  return `https://logo.clearbit.com/${guess}`;
}

export default function CompanyLogo({ name, logoUrl, size = 20 }) {
  const [imgError, setImgError] = useState(false);
  const [clearbitError, setClearbitError] = useState(false);

  const fallback = (
    <span style={{
      width: size, height: size, borderRadius: 4, flexShrink: 0,
      background: '#2B7AE8', color: '#fff',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.5, fontWeight: 700,
    }}>
      {(name || '?')[0].toUpperCase()}
    </span>
  );

  // Try logo_url first
  if (logoUrl && !imgError) {
    return (
      <img
        src={logoUrl}
        alt={name}
        style={{ width: size, height: size, borderRadius: 4, objectFit: 'contain', flexShrink: 0 }}
        onError={() => setImgError(true)}
      />
    );
  }

  // Fallback to Clearbit
  if (!clearbitError) {
    return (
      <img
        src={getClearbitUrl(name)}
        alt={name}
        style={{ width: size, height: size, borderRadius: 4, objectFit: 'contain', flexShrink: 0 }}
        onError={() => setClearbitError(true)}
      />
    );
  }

  return fallback;
}
