/**
 * Horizontal bar chart for preview pages.
 * @param {{ bars: Array<{ label: string, value: number, color?: string }>, maxValue?: number }} props
 */
export default function DummyBarChart({ bars, maxValue }) {
  const max = maxValue || Math.max(...bars.map(b => b.value));
  const colors = ['#2563EB', '#059669', '#D97706', '#DC2626', '#7C3AED', '#C9A84C'];

  return (
    <div>
      {bars.map((bar, i) => (
        <div className="dummy-bar-row" key={i}>
          <div className="dummy-bar-label">{bar.label}</div>
          <div className="dummy-bar-track">
            <div
              className="dummy-bar-fill"
              style={{
                width: `${Math.max((bar.value / max) * 100, 8)}%`,
                background: bar.color || colors[i % colors.length],
              }}
            />
          </div>
          <div className="dummy-bar-value">{bar.value.toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}
