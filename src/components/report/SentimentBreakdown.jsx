export default function SentimentBreakdown({ stats }) {
  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <h4 className="card-title" style={{ fontSize: '0.9375rem' }}>Sentiment Breakdown</h4>
      <div className="sentiment-bars">
        <div className="sentiment-bar-row">
          <span className="sentiment-bar-label">Positive ({stats.positivePercent}%)</span>
          <div className="sentiment-bar-track">
            <div className="sentiment-bar-fill" style={{ width: `${stats.positivePercent}%`, background: 'var(--success)' }} />
          </div>
        </div>
        <div className="sentiment-bar-row">
          <span className="sentiment-bar-label">Neutral ({stats.neutralPercent}%)</span>
          <div className="sentiment-bar-track">
            <div className="sentiment-bar-fill" style={{ width: `${stats.neutralPercent}%`, background: 'var(--warning)' }} />
          </div>
        </div>
        <div className="sentiment-bar-row">
          <span className="sentiment-bar-label">Negative ({stats.negativePercent}%)</span>
          <div className="sentiment-bar-track">
            <div className="sentiment-bar-fill" style={{ width: `${stats.negativePercent}%`, background: 'var(--danger)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
