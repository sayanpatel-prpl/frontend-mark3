import { Globe } from 'lucide-react';
import ComingSoonPreview from '../../components/ComingSoonPreview';
import DummyBarChart from '../../components/coming-soon/DummyBarChart';

const trafficBars = [
  { label: 'CompetitorA', value: 245000, color: '#2563EB' },
  { label: 'Your Company', value: 182000, color: '#C9A84C' },
  { label: 'CompetitorB', value: 156000, color: '#059669' },
  { label: 'CompetitorC', value: 89000, color: '#D97706' },
];

const seoData = [
  { company: 'CompetitorA', da: 72, keyword: 'project management software', trend: 'Stable' },
  { company: 'Your Company', da: 58, keyword: 'competitive intelligence', trend: 'Growing' },
  { company: 'CompetitorB', da: 64, keyword: 'team collaboration tool', trend: 'Growing' },
  { company: 'CompetitorC', da: 41, keyword: 'developer workflow', trend: 'Declining' },
];

export default function WebsiteTrafficPreview() {
  return (
    <ComingSoonPreview
      title="Website Traffic & SEO"
      description="Estimate competitor website traffic, domain authority, and SEO positioning. Identify content gaps and keyword opportunities."
      icon={<Globe size={28} />}
    >
      <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Estimated Monthly Visits
      </div>
      <DummyBarChart bars={trafficBars} />

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>
          SEO Comparison
        </div>
        <table className="preview-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Domain Authority</th>
              <th>Top Keyword</th>
              <th>Traffic Trend</th>
            </tr>
          </thead>
          <tbody>
            {seoData.map((r, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{r.company}</td>
                <td>{r.da}</td>
                <td>{r.keyword}</td>
                <td>
                  <span className={`preview-badge ${r.trend === 'Growing' ? 'preview-badge-green' : r.trend === 'Declining' ? 'preview-badge-red' : 'preview-badge-blue'}`}>
                    {r.trend}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ComingSoonPreview>
  );
}
