import { Swords } from 'lucide-react';
import ComingSoonPreview from '../../components/ComingSoonPreview';
import DummyStatGrid from '../../components/coming-soon/DummyStatGrid';

export default function BattleCardsPreview() {
  return (
    <ComingSoonPreview
      title="Battle Cards"
      description="AI-generated battle cards for your sales team. Each card includes competitor stats, engagement guidance, and objection handlers — updated weekly from live data."
      icon={<Swords size={28} />}
    >
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
          vs. CompetitorA
        </div>
        <DummyStatGrid stats={[
          { label: 'Win Rate', value: '62%' },
          { label: 'Avg Deal Size', value: '$24K' },
          { label: 'Threat Level', value: 'High' },
          { label: 'Deals Lost', value: '14' },
        ]} />
      </div>

      <div className="preview-two-col">
        <div className="preview-card" style={{ borderLeft: '3px solid var(--success, #059669)' }}>
          <div className="preview-card-title" style={{ color: 'var(--success)' }}>Engage When...</div>
          <div className="preview-card-item">Customer needs enterprise SSO</div>
          <div className="preview-card-item">Deal involves multi-region deployment</div>
          <div className="preview-card-item">They mention integration requirements</div>
        </div>
        <div className="preview-card" style={{ borderLeft: '3px solid var(--danger, #DC2626)' }}>
          <div className="preview-card-title" style={{ color: 'var(--danger)' }}>Walk Away When...</div>
          <div className="preview-card-item">Price is the only evaluation criteria</div>
          <div className="preview-card-item">They need native mobile-first solution</div>
          <div className="preview-card-item">Under 10 seats and self-serve required</div>
        </div>
      </div>

      <div className="preview-card" style={{ marginTop: 16 }}>
        <div className="preview-card-title">Objection Handlers</div>
        <div className="preview-card-item">
          <strong>"CompetitorA is cheaper"</strong>
          <div className="preview-card-item-sub">True for base tier. Compare total cost with SSO, API access, and support SLA included in our Pro plan.</div>
        </div>
        <div className="preview-card-item">
          <strong>"They have a mobile app"</strong>
          <div className="preview-card-item-sub">Our responsive web app works on all devices. Native app is on our Q3 roadmap with offline sync.</div>
        </div>
        <div className="preview-card-item">
          <strong>"Bigger customer base"</strong>
          <div className="preview-card-item-sub">We focus on mid-market. Our NPS is 72 vs their 41 — smaller but more satisfied customer base.</div>
        </div>
      </div>
    </ComingSoonPreview>
  );
}
