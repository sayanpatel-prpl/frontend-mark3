import { CreditCard } from 'lucide-react';
import ComingSoonPreview from '../../components/ComingSoonPreview';
import DummyStatGrid from '../../components/coming-soon/DummyStatGrid';

const plans = [
  { name: 'Free', competitors: '2', reports: '5/mo', signals: 'Weekly', price: '$0' },
  { name: 'Pro', competitors: '10', reports: 'Unlimited', signals: 'Real-time', price: '$79/mo' },
  { name: 'Enterprise', competitors: 'Unlimited', reports: 'Unlimited', signals: 'Real-time + API', price: 'Custom' },
];

export default function AccountPreview() {
  return (
    <ComingSoonPreview
      title="Account"
      description="Manage your subscription, billing, and usage. View plan details, upgrade options, and track how your team uses Kompete."
      icon={<CreditCard size={28} />}
    >
      <DummyStatGrid stats={[
        { label: 'Current Plan', value: 'Pro' },
        { label: 'Competitors', value: '6 / 10' },
        { label: 'Reports This Month', value: '23' },
      ]} />

      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>
          Plan Comparison
        </div>
        <table className="preview-table">
          <thead>
            <tr>
              <th>Feature</th>
              {plans.map((p, i) => <th key={i}>{p.name}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 600 }}>Competitors</td>
              {plans.map((p, i) => <td key={i}>{p.competitors}</td>)}
            </tr>
            <tr>
              <td style={{ fontWeight: 600 }}>Reports</td>
              {plans.map((p, i) => <td key={i}>{p.reports}</td>)}
            </tr>
            <tr>
              <td style={{ fontWeight: 600 }}>Signal Delivery</td>
              {plans.map((p, i) => <td key={i}>{p.signals}</td>)}
            </tr>
            <tr>
              <td style={{ fontWeight: 600 }}>Price</td>
              {plans.map((p, i) => <td key={i} style={{ fontWeight: 700, color: 'var(--brand-accent)' }}>{p.price}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </ComingSoonPreview>
  );
}
