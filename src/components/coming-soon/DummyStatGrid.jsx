/**
 * Reusable stat boxes grid for preview pages.
 * @param {{ stats: Array<{ label: string, value: string }> }} props
 */
export default function DummyStatGrid({ stats }) {
  return (
    <div className="dummy-stat-grid">
      {stats.map((s, i) => (
        <div className="dummy-stat-box" key={i}>
          <div className="dummy-stat-value">{s.value}</div>
          <div className="dummy-stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
