import { ShoppingCart, Wrench, Headphones, TrendingUp } from 'lucide-react';
import Collapsible from './ui/Collapsible';

const PATTERN_CONFIG = {
  buyerJourney: { label: 'Buyer Journey', Icon: ShoppingCart, color: 'var(--azure)' },
  implementationReality: { label: 'Implementation Reality', Icon: Wrench, color: 'var(--warning)' },
  supportExperience: { label: 'Support Experience', Icon: Headphones, color: 'var(--success)' },
  valueRealization: { label: 'Value Realization', Icon: TrendingUp, color: 'var(--data-purple)' },
};

export default function ReviewPatterns({ battlecard }) {
  const patterns = battlecard.patterns?.reviewPatterns;
  if (!patterns) return null;

  const entries = Object.entries(PATTERN_CONFIG).filter(([key]) => patterns[key]);

  return (
    <Collapsible title="Review Patterns">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {entries.map(([key, { label, Icon, color }]) => (
          <div key={key} style={{ padding: '1rem', background: 'var(--gray-50)', borderRadius: 8, borderTop: `3px solid ${color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Icon size={16} style={{ color, flexShrink: 0 }} />
              <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--gray-900)', margin: 0 }}>{label}</h4>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--gray-700)', lineHeight: 1.6, margin: 0 }}>{patterns[key]}</p>
          </div>
        ))}
      </div>
    </Collapsible>
  );
}
