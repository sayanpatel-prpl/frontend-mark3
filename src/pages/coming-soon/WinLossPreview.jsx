import { AlertTriangle } from 'lucide-react';
import ComingSoonPreview from '../../components/ComingSoonPreview';
import DummyStatGrid from '../../components/coming-soon/DummyStatGrid';

const whyUs = [
  'Integration depth with existing tools',
  'Faster onboarding (avg 3 days vs 2 weeks)',
  'Dedicated CSM for mid-market accounts',
  'Superior reporting & analytics',
];

const whyThem = [
  'Lower entry price point',
  'Native mobile app availability',
  'Brand recognition in enterprise segment',
  'Longer track record / larger customer base',
];

const triggers = [
  { signal: 'Competitor raises prices', action: 'Reach out to churned prospects', type: 'green' },
  { signal: 'New feature launch by CompetitorA', action: 'Update battle cards, brief sales', type: 'amber' },
  { signal: 'Negative review spike for CompetitorB', action: 'Target their unhappy customers', type: 'green' },
];

export default function WinLossPreview() {
  return (
    <ComingSoonPreview
      title="Win/Loss Signals"
      description="Understand why deals are won or lost against specific competitors. Track switching triggers and competitive dynamics from CRM data and review signals."
      icon={<AlertTriangle size={28} />}
    >
      <DummyStatGrid stats={[
        { label: 'Overall Win Rate', value: '58%' },
        { label: 'Deals Analyzed', value: '142' },
        { label: 'Top Competitor', value: 'CompA' },
        { label: 'Avg Cycle (Days)', value: '34' },
      ]} />

      <div className="preview-two-col" style={{ marginBottom: 16 }}>
        <div className="preview-card" style={{ borderLeft: '3px solid var(--success)' }}>
          <div className="preview-card-title" style={{ color: 'var(--success)' }}>Why They Choose You</div>
          {whyUs.map((r, i) => (
            <div className="preview-card-item" key={i}>{r}</div>
          ))}
        </div>
        <div className="preview-card" style={{ borderLeft: '3px solid var(--danger)' }}>
          <div className="preview-card-title" style={{ color: 'var(--danger)' }}>Why They Choose Competitors</div>
          {whyThem.map((r, i) => (
            <div className="preview-card-item" key={i}>{r}</div>
          ))}
        </div>
      </div>

      <div className="preview-card">
        <div className="preview-card-title">Switching Triggers</div>
        {triggers.map((t, i) => (
          <div className="preview-card-item" key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className={`preview-badge preview-badge-${t.type === 'green' ? 'green' : 'amber'}`}>{t.signal}</span>
            <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>&rarr;</span>
            <span>{t.action}</span>
          </div>
        ))}
      </div>
    </ComingSoonPreview>
  );
}
