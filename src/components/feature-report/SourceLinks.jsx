function deriveLabel(url) {
  try {
    const u = new URL(url);
    const segments = u.pathname.replace(/\/$/, '').split('/').filter(Boolean);
    if (segments.length > 0) {
      const last = segments[segments.length - 1];
      return last.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }
    return u.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

export default function SourceLinks({ sources }) {
  if (!sources || sources.length === 0) return null;

  const items = sources.map(s => {
    if (typeof s === 'string') {
      return { url: s, label: deriveLabel(s) };
    }
    return { url: s.url, label: s.label || s.title || s.source_title || deriveLabel(s.url) };
  }).filter(s => s.url);

  if (items.length === 0) return null;

  return (
    <div style={{
      marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(43, 122, 232, 0.15)',
    }}>
      <div style={{
        fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.05em', color: '#5B9BF0', marginBottom: 4,
      }}>Sources</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {items.map((s, i) => (
          <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={{
            fontSize: '0.72rem', color: '#2B7AE8', textDecoration: 'none',
            padding: '3px 8px', borderRadius: 4,
            background: '#EBF4FF', border: '1px solid #BFDBFE',
            maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis',
            whiteSpace: 'nowrap', display: 'inline-block',
            transition: 'background 0.15s',
          }}
          onMouseOver={e => e.currentTarget.style.background = '#DBEAFE'}
          onMouseOut={e => e.currentTarget.style.background = '#EBF4FF'}
          title={s.url}>
            {s.label}
          </a>
        ))}
      </div>
    </div>
  );
}
