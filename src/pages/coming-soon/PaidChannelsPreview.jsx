import { BarChart3 } from 'lucide-react';
import ComingSoonPreview from '../../components/ComingSoonPreview';
import DummyStatGrid from '../../components/coming-soon/DummyStatGrid';

const adCopy = [
  { company: 'CompetitorA', headline: 'Scale Your Team with Confidence', channel: 'Google Ads', cpc: '$4.20' },
  { company: 'CompetitorB', headline: 'Free Forever — No Credit Card Required', channel: 'Facebook', cpc: '$1.85' },
  { company: 'CompetitorA', headline: 'Enterprise Security, Startup Speed', channel: 'LinkedIn', cpc: '$8.50' },
  { company: 'CompetitorC', headline: 'The API Developers Love', channel: 'Google Ads', cpc: '$3.10' },
];

export default function PaidChannelsPreview() {
  return (
    <ComingSoonPreview
      title="Paid Channels Overview"
      description="Monitor competitor ad spend, campaign strategies, and messaging across paid channels. See where they invest their marketing budget."
      icon={<BarChart3 size={28} />}
    >
      <DummyStatGrid stats={[
        { label: 'Est. Monthly Spend', value: '$42K' },
        { label: 'Active Campaigns', value: '18' },
        { label: 'Primary Channel', value: 'Google' },
        { label: 'Avg CPC', value: '$3.90' },
      ]} />

      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>
          Sample Ad Copy Detected
        </div>
        <table className="preview-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Headline</th>
              <th>Channel</th>
              <th>Est. CPC</th>
            </tr>
          </thead>
          <tbody>
            {adCopy.map((ad, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{ad.company}</td>
                <td style={{ fontStyle: 'italic' }}>"{ad.headline}"</td>
                <td><span className="preview-badge preview-badge-blue">{ad.channel}</span></td>
                <td>{ad.cpc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ComingSoonPreview>
  );
}
