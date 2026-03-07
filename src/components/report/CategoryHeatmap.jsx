import { useState, useCallback } from 'react';
import { Info } from 'lucide-react';

const heatClass = (score) => {
  if (score == null) return '';
  if (score >= 60) return 'heat-high';
  if (score >= 20) return 'heat-med';
  if (score >= -20) return 'heat-low';
  return 'heat-neg';
};

function InfoTooltip({ text }) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const handleEnter = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({ top: rect.top - 8, left: rect.left + rect.width / 2 });
    setShow(true);
  }, []);

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', marginLeft: 6, cursor: 'help' }}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setShow(false)}
    >
      <Info size={14} style={{ color: 'var(--gray-400)' }} />
      {show && (
        <div style={{
          position: 'fixed',
          top: pos.top,
          left: pos.left,
          transform: 'translate(-50%, -100%)',
          background: '#0F1219',
          color: '#fff',
          padding: '10px 14px',
          borderRadius: 8,
          fontSize: '0.75rem',
          lineHeight: 1.6,
          width: 320,
          zIndex: 9999,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          pointerEvents: 'none',
        }}>
          {text}
        </div>
      )}
    </span>
  );
}

export default function CategoryHeatmap({ competitors, mainCompanyStats, categoryColumns, categoryLabels, project }) {
  const rows = [
    {
      key: 'main',
      name: project.mainCompany,
      isMain: true,
      scores: mainCompanyStats.categoryScores || {},
    },
    ...competitors.map((c) => ({
      key: c.id,
      name: c.name,
      isMain: false,
      scores: c.stats.categoryScores || {},
    })),
  ];

  return (
    <div className="card" style={{ overflow: 'auto', marginBottom: '1.5rem' }}>
      <div style={{ padding: '1rem 1.5rem 0', display: 'flex', alignItems: 'center' }}>
        <span className="card-title" style={{ marginBottom: 0 }}>Category Net Sentiment Heatmap</span>
        <InfoTooltip text="Each number is a Net Sentiment Score calculated as: (% positive reviews - % negative reviews) for that category. Scores range from -100 (all negative) to +100 (all positive). A score of 60+ is strong, 20-59 is moderate, -20 to 19 is weak, and below -20 is critical." />
      </div>
      <div style={{ padding: '1rem 1.5rem' }}>
        <table className="comparison-matrix">
          <thead>
            <tr>
              <th>Company</th>
              {categoryColumns.map((col) => (
                <th key={col}>{categoryLabels[col]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key}>
                <td className="matrix-name">
                  {row.name}{row.isMain ? ' (You)' : ''}
                </td>
                {categoryColumns.map((col) => {
                  const score = row.scores[col];
                  return (
                    <td key={col} className={`heat-cell ${heatClass(score)}`}>
                      {score != null ? score : '-'}
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
