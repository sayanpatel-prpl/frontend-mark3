import { Trophy } from 'lucide-react';
import ComingSoonPreview from '../../components/ComingSoonPreview';

const advantages = [
  {
    title: 'Superior Integration Ecosystem',
    proof: '"The number of native integrations blew us away — we connected our entire stack in under a day." — G2 Review',
    caveat: 'CompetitorB is rapidly expanding their marketplace; gap may narrow by Q4.',
  },
  {
    title: 'Enterprise-Grade Security',
    proof: 'SOC 2 Type II certified since 2024. Only vendor in the space with HIPAA compliance.',
    caveat: 'CompetitorA announced SOC 2 certification in progress.',
  },
  {
    title: 'Real-Time Collaboration',
    proof: '"The live editing feature is a game-changer for our distributed team." — Capterra Review',
    caveat: 'Feature parity with CompetitorC on basic co-editing, but we lead on conflict resolution.',
  },
  {
    title: 'Flexible Pricing Model',
    proof: 'Only vendor offering true per-seat pricing without feature gating. 3 competitors require enterprise tier for API access.',
    caveat: 'CompetitorB recently launched a free tier that undercuts our entry price.',
  },
];

export default function CompetitiveAdvantagesPreview() {
  return (
    <ComingSoonPreview
      title="Competitive Advantages"
      description="AI-identified advantages backed by review evidence and market data. Each advantage includes proof points and competitive caveats to keep your positioning honest."
      icon={<Trophy size={28} />}
    >
      <div style={{ display: 'grid', gap: 12 }}>
        {advantages.map((a, i) => (
          <div className="preview-card" key={i}>
            <div className="preview-card-title">
              <Trophy size={14} style={{ color: 'var(--brand-accent)' }} />
              {a.title}
            </div>
            <div style={{ fontSize: 13, color: 'var(--gray-700)', fontStyle: 'italic', marginBottom: 8 }}>
              {a.proof}
            </div>
            <div style={{ fontSize: 12, color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontWeight: 600 }}>Caveat:</span> {a.caveat}
            </div>
          </div>
        ))}
      </div>
    </ComingSoonPreview>
  );
}
