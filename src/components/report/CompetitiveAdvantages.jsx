import Collapsible from './ui/Collapsible';
import stripScores from './utils/stripScores';

export default function CompetitiveAdvantages({ battlecard }) {
  const advantages = battlecard.pricingAdv?.competitiveAdvantages || [];
  if (advantages.length === 0) return null;

  return (
    <Collapsible title="Competitive Advantages">
      <div style={{ background: 'var(--success-light)', borderRadius: 8, padding: '1.25rem' }}>
        {advantages.map((adv, i) => (
          <div key={i} className="advantage-card">
            <div className="advantage-title">{stripScores(adv.advantage)}</div>
            <div className="advantage-proof">{stripScores(adv.evidence)}</div>
            <div className="advantage-caveat">Caveat: {stripScores(adv.caveat)}</div>
          </div>
        ))}
      </div>
    </Collapsible>
  );
}
