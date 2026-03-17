import { Package } from 'lucide-react';
import ComingSoonPreview from '../../components/ComingSoonPreview';

const gaps = [
  { name: 'Native Mobile App', competitor: 'CompetitorA' },
  { name: 'AI Auto-Tagging', competitor: 'CompetitorB' },
  { name: 'Custom Workflows', competitor: 'CompetitorC' },
  { name: 'Bulk Import API', competitor: 'CompetitorA' },
  { name: 'Audit Trail', competitor: 'CompetitorB' },
];

const advantages = [
  { name: 'Real-time Collaboration', competitor: 'All' },
  { name: 'Advanced Permissions', competitor: 'CompetitorA, B' },
  { name: 'White-Label Support', competitor: 'CompetitorC' },
  { name: 'Webhook Integrations', competitor: 'CompetitorA' },
  { name: 'Multi-Tenant Architecture', competitor: 'All' },
];

export default function GapAnalysisPreview() {
  return (
    <ComingSoonPreview
      title="Feature & Integration Gap Analysis"
      description="Identify where competitors outpace you and where you hold the advantage. Automatically surfaces feature gaps and strengths from product data and review analysis."
      icon={<Package size={28} />}
    >
      <div className="preview-two-col">
        <div className="preview-card" style={{ borderLeft: '3px solid var(--danger, #DC2626)' }}>
          <div className="preview-card-title">
            <span style={{ color: 'var(--danger, #DC2626)' }}>Your Gaps</span>
          </div>
          {gaps.map((g, i) => (
            <div className="preview-card-item" key={i}>
              {g.name}
              <div className="preview-card-item-sub">Offered by {g.competitor}</div>
            </div>
          ))}
        </div>
        <div className="preview-card" style={{ borderLeft: '3px solid var(--success, #059669)' }}>
          <div className="preview-card-title">
            <span style={{ color: 'var(--success, #059669)' }}>Your Advantages</span>
          </div>
          {advantages.map((a, i) => (
            <div className="preview-card-item" key={i}>
              {a.name}
              <div className="preview-card-item-sub">Ahead of {a.competitor}</div>
            </div>
          ))}
        </div>
      </div>
    </ComingSoonPreview>
  );
}
