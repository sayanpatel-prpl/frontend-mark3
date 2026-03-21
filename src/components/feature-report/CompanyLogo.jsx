import { useState, useEffect } from 'react';

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
  'paycor': 'paycor.com',
  'paychex': 'paychex.com',
  'adp': 'adp.com',
  'highradius': 'highradius.com',
  'rippling': 'rippling.com',
  'paylocity': 'paylocity.com',
  'deel': 'deel.com',
  'hibob': 'hibob.com',
  'versapay': 'versapay.com',
  'billtrust': 'billtrust.com',
  'esker': 'esker.com',
  'quadient': 'quadient.com',
};

// In-memory logo cache shared across all CompanyLogo instances
const logoCache = {};
let cacheLoaded = false;
let cachePromise = null;

async function loadLogoCache() {
  if (cacheLoaded) return;
  if (cachePromise) return cachePromise;

  cachePromise = (async () => {
    try {
      const tenantId = localStorage.getItem('activeTenantId') || '';
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const res = await fetch(`${baseUrl}/tenant/${tenantId}/companies`, {
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id || '',
        },
      });
      if (res.ok) {
        const data = await res.json();
        // API returns flat array of companies
        const companies = Array.isArray(data) ? data
          : Array.isArray(data.companies) ? data.companies
          : Array.isArray(data.data) ? data.data
          : [];
        companies.forEach(c => {
          if (c.logo_url) {
            logoCache[(c.name || '').toLowerCase()] = c.logo_url;
          }
        });
        console.log(`[CompanyLogo] Cached ${Object.keys(logoCache).length} logos from DB`);
      }
    } catch (err) {
      console.warn('[CompanyLogo] Failed to load logo cache:', err.message);
    }
    cacheLoaded = true;
  })();
  return cachePromise;
}

function getClearbitUrl(name) {
  const lower = (name || '').toLowerCase();
  for (const [key, domain] of Object.entries(DOMAIN_MAP)) {
    if (lower.includes(key)) return `https://logo.clearbit.com/${domain}`;
  }
  const guess = lower.replace(/[^a-z0-9]/g, '') + '.com';
  return `https://logo.clearbit.com/${guess}`;
}

export default function CompanyLogo({ name, logoUrl, size = 20 }) {
  const [propError, setPropError] = useState(false);
  const [cacheError, setCacheError] = useState(false);
  const [clearbitError, setClearbitError] = useState(false);
  const [cachedUrl, setCachedUrl] = useState(() => logoCache[(name || '').toLowerCase()] || null);
  const [cacheReady, setCacheReady] = useState(cacheLoaded);

  useEffect(() => {
    if (!cacheLoaded) {
      loadLogoCache().then(() => {
        const url = logoCache[(name || '').toLowerCase()];
        if (url) setCachedUrl(url);
        setCacheReady(true);
      });
    } else {
      const url = logoCache[(name || '').toLowerCase()];
      if (url) setCachedUrl(url);
      setCacheReady(true);
    }
  }, [name]);

  const imgStyle = { width: size, height: size, borderRadius: 4, objectFit: 'contain', flexShrink: 0 };

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

  // 1. Try explicit logoUrl prop
  if (logoUrl && !propError) {
    return <img src={logoUrl} alt={name} style={imgStyle} onError={() => setPropError(true)} />;
  }

  // 2. Try cached logo from DB
  if (cachedUrl && !cacheError) {
    return <img src={cachedUrl} alt={name} style={imgStyle} onError={() => setCacheError(true)} />;
  }

  // 3. Fallback to Clearbit (only if cache is loaded and had nothing)
  if (cacheReady && !clearbitError) {
    return <img src={getClearbitUrl(name)} alt={name} style={imgStyle} onError={() => setClearbitError(true)} />;
  }

  // 4. Letter fallback
  return fallback;
}
