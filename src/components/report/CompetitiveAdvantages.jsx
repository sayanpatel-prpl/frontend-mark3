import Collapsible from './ui/Collapsible';

export default function CompetitiveAdvantages({ battlecard }) {
  const advantages = battlecard.pricingAdv?.competitiveAdvantages || [];
  if (advantages.length === 0) return null;

  return (
    <Collapsible title="Competitive Advantages">
      <div style={{ background: 'linear-gradient(135deg, var(--success-light) 0%, #A7F3D0 100%)', borderRadius: 8, padding: '1.25rem' }}>
        {advantages.map((adv, i) => (
          <div key={i} className="advantage-card">
            <div className="advantage-title">{adv.advantage}</div>
            <div className="advantage-proof">{adv.evidence}</div>
            <div className="advantage-caveat">Caveat: {adv.caveat}</div>
          </div>
        ))}
      </div>
    </Collapsible>
  );
}
