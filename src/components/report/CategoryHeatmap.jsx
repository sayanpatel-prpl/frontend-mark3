const heatClass = (score) => {
  if (score == null) return '';
  if (score >= 60) return 'heat-high';
  if (score >= 20) return 'heat-med';
  if (score >= -20) return 'heat-low';
  return 'heat-neg';
};

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
      <div style={{ padding: '1rem 1.5rem 0' }}>
        <span className="card-title">Category Net Sentiment Heatmap</span>
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
