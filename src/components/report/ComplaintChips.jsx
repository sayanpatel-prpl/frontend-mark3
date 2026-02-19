const SEVERITY_CLASSES = { high: 'complaint-high', med: 'complaint-med', low: 'complaint-low' };

export default function ComplaintChips({ chips }) {
  if (!chips?.length) return null;

  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <h4 className="card-title" style={{ fontSize: '0.9375rem' }}>Complaint Themes</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {chips.map((chip) => (
          <span
            key={chip.category}
            className={`complaint-chip ${SEVERITY_CLASSES[chip.severity] || 'complaint-low'}`}
          >
            {chip.shortLabel} {chip.percentage}% ({chip.count})
          </span>
        ))}
      </div>
    </div>
  );
}
