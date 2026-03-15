/**
 * Color-coded heatmap grid table for preview pages.
 * Uses existing heat-* CSS classes.
 * @param {{ columns: string[], rows: Array<{ label: string, values: Array<{ text: string, level: 'high'|'med'|'low'|'neg' }> }> }} props
 */
export default function DummyHeatmap({ columns, rows }) {
  return (
    <table className="dummy-heatmap">
      <thead>
        <tr>
          <th>Category</th>
          {columns.map((col, i) => (
            <th key={i}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri}>
            <td>{row.label}</td>
            {row.values.map((cell, ci) => (
              <td key={ci} className={`heat-cell heat-${cell.level}`}>
                {cell.text}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
