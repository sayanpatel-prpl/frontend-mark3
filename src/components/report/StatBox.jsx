export default function StatBox({ title, value, suffix, valueStyle }) {
  return (
    <div className="stat-box">
      <div className="stat-box-title">{title}</div>
      <div className="stat-box-value" style={valueStyle}>
        {value}{suffix && <span className="stat-box-suffix">{suffix}</span>}
      </div>
    </div>
  );
}
