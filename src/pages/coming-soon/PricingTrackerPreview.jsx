import { DollarSign } from 'lucide-react';
import ComingSoonPreview from '../../components/ComingSoonPreview';

const competitors = [
  {
    name: 'CompetitorA',
    plans: [
      { name: 'Starter', price: '$29/mo' },
      { name: 'Pro', price: '$79/mo' },
      { name: 'Enterprise', price: 'Custom' },
    ],
    updated: 'Mar 2, 2026',
  },
  {
    name: 'CompetitorB',
    plans: [
      { name: 'Free', price: '$0' },
      { name: 'Growth', price: '$49/mo' },
      { name: 'Scale', price: '$149/mo' },
    ],
    updated: 'Feb 28, 2026',
  },
  {
    name: 'CompetitorC',
    plans: [
      { name: 'Basic', price: '$19/mo' },
      { name: 'Business', price: '$99/mo' },
      { name: 'Enterprise', price: '$249/mo' },
    ],
    updated: 'Mar 5, 2026',
  },
];

export default function PricingTrackerPreview() {
  return (
    <ComingSoonPreview
      title="Pricing Tracker"
      description="Track competitor pricing changes over time. Get alerts when competitors adjust their plans, add new tiers, or change feature packaging."
      icon={<DollarSign size={28} />}
    >
      <div className="preview-pricing-grid">
        {competitors.map((c, i) => (
          <div className="preview-pricing-card" key={i}>
            <div className="preview-pricing-name">{c.name}</div>
            {c.plans.map((p, pi) => (
              <div key={pi} style={{ marginTop: pi === 0 ? 12 : 16 }}>
                <div className="preview-pricing-plan">{p.name}</div>
                <div className="preview-pricing-amount">{p.price}</div>
              </div>
            ))}
            <div className="preview-pricing-updated">Last updated: {c.updated}</div>
          </div>
        ))}
      </div>
    </ComingSoonPreview>
  );
}
