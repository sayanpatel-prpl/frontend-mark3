import Collapsible from './ui/Collapsible';

export default function PricingIntelligence({ comp, battlecard }) {
  const pricing = comp.pricingStats;
  const sentiment = battlecard.pricingAdv?.pricingSentiment;

  if (!pricing) return null;

  return (
    <Collapsible title="Pricing Intelligence">
      <div className="pricing-grid">
        <div className="pricing-block">
          <div className="pricing-block-label">Pricing Mentions</div>
          <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy)' }}>
            {pricing.mentionPercent}%
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
            {pricing.mentionCount?.toLocaleString()} of {pricing.totalReviews?.toLocaleString()} reviews
          </p>
        </div>
        <div className="pricing-block">
          <div className="pricing-block-label">Negative</div>
          <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--danger)' }}>
            {pricing.negativePercent}%
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
            of pricing mentions
          </p>
        </div>
        <div className="pricing-block">
          <div className="pricing-block-label">Positive</div>
          <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--success)' }}>
            {pricing.positivePercent}%
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
            of pricing mentions
          </p>
        </div>
      </div>
      {sentiment && (
        <div className="pricing-sentiment-bar">
          <div className="pricing-block-label">Overall Pricing Sentiment</div>
          <p style={{ fontSize: '0.875rem', color: 'var(--gray-700)', marginTop: '0.5rem' }}>{sentiment}</p>
        </div>
      )}
    </Collapsible>
  );
}
