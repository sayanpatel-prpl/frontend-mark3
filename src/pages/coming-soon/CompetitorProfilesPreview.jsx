import { Target } from 'lucide-react';
import ComingSoonPreview from '../../components/ComingSoonPreview';
import DummyStatGrid from '../../components/coming-soon/DummyStatGrid';

const profiles = [
  {
    initials: 'CA',
    name: 'CompetitorA',
    positioning: 'Enterprise-first platform for large teams',
    threat: 'High',
    threatColor: 'red',
    stats: [
      { label: 'Reviews', value: '1,247' },
      { label: 'Avg Rating', value: '4.2' },
      { label: 'Employees', value: '320' },
      { label: 'Founded', value: '2018' },
    ],
  },
  {
    initials: 'CB',
    name: 'CompetitorB',
    positioning: 'SMB-focused with freemium model',
    threat: 'Medium',
    threatColor: 'amber',
    stats: [
      { label: 'Reviews', value: '892' },
      { label: 'Avg Rating', value: '4.5' },
      { label: 'Employees', value: '180' },
      { label: 'Founded', value: '2020' },
    ],
  },
  {
    initials: 'CC',
    name: 'CompetitorC',
    positioning: 'Developer-centric API-first approach',
    threat: 'Low',
    threatColor: 'green',
    stats: [
      { label: 'Reviews', value: '634' },
      { label: 'Avg Rating', value: '3.8' },
      { label: 'Employees', value: '95' },
      { label: 'Founded', value: '2021' },
    ],
  },
];

export default function CompetitorProfilesPreview() {
  return (
    <ComingSoonPreview
      title="Competitor Profiles"
      description="Comprehensive profiles for each tracked competitor. Company overview, positioning, threat assessment, and key metrics — all in one place."
      icon={<Target size={28} />}
    >
      <div className="preview-profile-grid">
        {profiles.map((p, i) => (
          <div className="preview-profile-card" key={i}>
            <div className="preview-profile-avatar">{p.initials}</div>
            <div className="preview-profile-name">{p.name}</div>
            <div className="preview-profile-desc">{p.positioning}</div>
            <div style={{ margin: '10px 0' }}>
              <span className={`preview-badge preview-badge-${p.threatColor}`}>
                {p.threat} Threat
              </span>
            </div>
            <DummyStatGrid stats={p.stats} />
          </div>
        ))}
      </div>
    </ComingSoonPreview>
  );
}
