import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import CompanyLogo from './CompanyLogo';
import WhatToDoNext from './WhatToDoNext';

/* ─── Row-aligned table: each row = message #N across all companies ─── */
function AlignedSection({ title, subtitle, companies, logoMap, getItems, renderItem, emptyLabel }) {
  const maxItems = Math.max(...companies.map(c => (getItems(c) || []).length), 0);
  if (maxItems === 0) return null;

  return (
    <div className="card" style={{ padding: 20, marginBottom: 14 }}>
      <h3 className="section-title" style={{ marginBottom: subtitle ? 2 : 12 }}>{title}</h3>
      {subtitle && <p style={{ color: 'var(--gray-500)', fontSize: '0.78rem', marginBottom: 14 }}>{subtitle}</p>}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', tableLayout: 'fixed' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--gray-200)' }}>
              <th style={{ width: 28, padding: '8px 4px' }} />
              {companies.map((comp, i) => (
                <th key={i} style={{ textAlign: 'left', padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CompanyLogo name={comp.company} logoUrl={logoMap[comp.company]} size={20} />
                    <span style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '0.82rem' }}>{comp.company}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxItems }, (_, rowIdx) => (
              <tr key={rowIdx} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                <td style={{ padding: '10px 4px', textAlign: 'center', verticalAlign: 'top' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 20, height: 20, borderRadius: '50%',
                    background: 'var(--gray-100)', color: 'var(--gray-400)',
                    fontSize: '0.68rem', fontWeight: 700,
                  }}>{rowIdx + 1}</span>
                </td>
                {companies.map((comp, ci) => {
                  const items = getItems(comp) || [];
                  const item = items[rowIdx];
                  return (
                    <td key={ci} style={{
                      padding: '10px 12px', verticalAlign: 'top', height: 1,
                      borderRight: ci < companies.length - 1 ? '1px solid var(--gray-100)' : 'none',
                    }}>
                      {item ? (
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                          <div style={{ flex: 1 }}>{renderItem(item, comp, false)}</div>
                          {renderItem(item, comp, true)}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--gray-200)', fontSize: '0.78rem' }}>—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Single-row section (tagline, value prop, persona) ─── */
function SingleRowSection({ title, subtitle, companies, logoMap, renderCell }) {
  return (
    <div className="card" style={{ padding: 20, marginBottom: 14 }}>
      <h3 className="section-title" style={{ marginBottom: subtitle ? 2 : 12 }}>{title}</h3>
      {subtitle && <p style={{ color: 'var(--gray-500)', fontSize: '0.78rem', marginBottom: 14 }}>{subtitle}</p>}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', tableLayout: 'fixed' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--gray-200)' }}>
              {companies.map((comp, i) => (
                <th key={i} style={{ textAlign: 'left', padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CompanyLogo name={comp.company} logoUrl={logoMap[comp.company]} size={20} />
                    <span style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '0.82rem' }}>{comp.company}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {companies.map((comp, i) => (
                <td key={i} style={{
                  padding: '14px 12px', verticalAlign: 'top', height: 1,
                  borderRight: i < companies.length - 1 ? '1px solid var(--gray-100)' : 'none',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {renderCell(comp)}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Inline source reference — pushes to bottom of flex parent ─── */
function SourceRef({ src }) {
  if (!src) return <div style={{ marginTop: 'auto' }} />;
  return (
    <div style={{ fontSize: '0.65rem', color: 'var(--gray-400)', marginTop: 'auto', paddingTop: 6, fontStyle: 'normal' }}>
      {src}
    </div>
  );
}

/* ─── Highlight key claim (numbers, percentages, specifics) ─── */
function ClaimText({ text }) {
  if (!text) return null;
  // Bold numbers, percentages, and specific metrics
  const parts = text.split(/(\d+[\d,.]*%?|\$[\d,.]+[KMB]?)/g);
  return (
    <span>
      {parts.map((part, i) =>
        /\d/.test(part)
          ? <strong key={i} style={{ color: 'var(--navy)', fontWeight: 800 }}>{part}</strong>
          : <span key={i}>{part}</span>
      )}
    </span>
  );
}


export default function MessagingPlaybook({ data, meta }) {
  if (!data || data.length === 0) return null;

  const allCompanies = [meta?.main_company, ...(meta?.competitors || [])].filter(Boolean);
  const logoMap = {};
  for (const c of allCompanies) {
    logoMap[c.name] = c.logo_url;
  }

  const hasValueProp = data.some(d => d.value_prop);
  const hasCounter = data.some(d => d.counter_strategy || d.counter_points?.length > 0);
  const hasPersona = data.some(d => d.target_persona);

  const empty = <span style={{ color: 'var(--gray-200)', fontSize: '0.78rem' }}>—</span>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ── WHAT TO DO NEXT — shared component ── */}
      {hasCounter && (() => {
        const mainName = (meta?.main_company?.name || '').toLowerCase();
        const competitors = data.filter(comp => comp.company.toLowerCase() !== mainName);
        return <WhatToDoNext counterData={competitors} logoMap={logoMap} />;
      })()}

      {/* ── TAGLINE ── */}
      <SingleRowSection title="Tagline" subtitle="Exact homepage headline"
        companies={data} logoMap={logoMap}
        renderCell={(comp) => {
          const text = comp.tagline || comp.positioning;
          const src = comp.tagline_source || comp.positioning_source;
          if (!text) return <>{empty}<SourceRef /></>;
          return (
            <>
              <div style={{ flex: 1, fontSize: '0.92rem', color: 'var(--navy)', lineHeight: 1.4, fontWeight: 600 }}>
                <ClaimText text={text} />
              </div>
              <SourceRef src={src} />
            </>
          );
        }}
      />

      {/* ── VALUE PROPOSITION ── */}
      {hasValueProp && (
        <SingleRowSection title="Value Proposition" subtitle="Core offering description"
          companies={data} logoMap={logoMap}
          renderCell={(comp) => {
            if (!comp.value_prop) return <>{empty}<SourceRef /></>;
            return (
              <>
                <div style={{ flex: 1, fontSize: '0.85rem', color: 'var(--gray-700)', lineHeight: 1.5 }}>
                  <ClaimText text={comp.value_prop} />
                </div>
                <SourceRef src={comp.value_prop_source} />
              </>
            );
          }}
        />
      )}

      {/* ── TARGET PERSONA ── */}
      {hasPersona && (
        <SingleRowSection title="Target Persona" subtitle="Who each competitor speaks to"
          companies={data} logoMap={logoMap}
          renderCell={(comp) => {
            if (!comp.target_persona) return empty;
            return (
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--navy)' }}>{comp.target_persona}</div>
                {comp.target_segment && <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: 2 }}>{comp.target_segment}</div>}
              </div>
            );
          }}
        />
      )}

      {/* ── KEY MESSAGES — row-aligned ── */}
      <AlignedSection
        title="Key Messages"
        subtitle="Core messaging points — numbers and specific claims highlighted"
        companies={data} logoMap={logoMap}
        getItems={(comp) => {
          const msgs = comp.key_messages_detailed || (comp.key_messages || []).map(m => ({ text: m }));
          return msgs;
        }}
        renderItem={(m, comp, sourceOnly) => {
          const text = typeof m === 'string' ? m : m.text;
          const src = typeof m === 'string' ? null : m.source;
          if (sourceOnly) return <SourceRef src={src} />;
          return (
            <div style={{ fontSize: '0.82rem', color: 'var(--gray-700)', lineHeight: 1.5 }}>
              <ClaimText text={text} />
            </div>
          );
        }}
      />

      {/* ── PAIN POINTS TARGETED — row-aligned ── */}
      <AlignedSection
        title="Pain Points Targeted"
        subtitle="Customer problems each competitor addresses"
        companies={data} logoMap={logoMap}
        getItems={(comp) => {
          return comp.pain_points_detailed || (comp.pain_points_targeted || []).map(p => ({ text: p }));
        }}
        renderItem={(p, comp, sourceOnly) => {
          const text = typeof p === 'string' ? p : p.text;
          const msg = typeof p === 'string' ? null : p.addressed_by;
          if (sourceOnly) return msg ? <div style={{ fontSize: '0.68rem', color: 'var(--gray-400)', fontStyle: 'italic', marginTop: 2 }}>→ "{msg}"</div> : null;
          return (
            <div style={{ fontSize: '0.82rem', color: 'var(--gray-700)', lineHeight: 1.4 }}>
              <ClaimText text={text} />
            </div>
          );
        }}
      />

    </div>
  );
}
