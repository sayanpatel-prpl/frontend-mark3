import { Users } from 'lucide-react';
import ComingSoonPreview from '../../components/ComingSoonPreview';
import DummyBarChart from '../../components/coming-soon/DummyBarChart';

const bars = [
  { label: 'Engineering', value: 42, color: '#2563EB' },
  { label: 'Sales', value: 28, color: '#059669' },
  { label: 'Marketing', value: 15, color: '#D97706' },
  { label: 'Product', value: 12, color: '#7C3AED' },
  { label: 'Customer Success', value: 8, color: '#DC2626' },
  { label: 'Design', value: 5, color: '#C9A84C' },
];

const notable = [
  { role: 'VP of AI/ML', company: 'CompetitorA', inference: 'Likely building AI features', type: 'amber' },
  { role: 'Head of Enterprise Sales', company: 'CompetitorB', inference: 'Moving upmarket', type: 'blue' },
  { role: 'Director of Partnerships', company: 'CompetitorA', inference: 'Expanding ecosystem', type: 'purple' },
  { role: 'Staff Security Engineer', company: 'CompetitorC', inference: 'Compliance push', type: 'green' },
];

export default function HiringIntelPreview() {
  return (
    <ComingSoonPreview
      title="Hiring Intelligence"
      description="Monitor competitor hiring patterns to infer strategic direction. Open roles reveal product roadmap signals, market expansion plans, and organizational priorities."
      icon={<Users size={28} />}
    >
      <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Open Roles by Department (All Competitors)
      </div>
      <DummyBarChart bars={bars} />

      <div className="preview-card" style={{ marginTop: 20 }}>
        <div className="preview-card-title">Notable Roles & Inferences</div>
        {notable.map((n, i) => (
          <div className="preview-card-item" key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <strong>{n.role}</strong>
              <div className="preview-card-item-sub">{n.company}</div>
            </div>
            <span className={`preview-badge preview-badge-${n.type}`}>{n.inference}</span>
          </div>
        ))}
      </div>
    </ComingSoonPreview>
  );
}
