import { Building2 } from 'lucide-react';
import ComingSoonPreview from '../../components/ComingSoonPreview';

const orgs = [
  {
    company: 'CompetitorA',
    people: [
      { name: 'Sarah Chen', role: 'CEO', indent: false },
      { name: 'Mark Johnson', role: 'CTO', indent: true },
      { name: 'Lisa Park', role: 'VP Engineering', indent: true },
      { name: 'David Kim', role: 'VP Sales', indent: true },
      { name: 'Rachel Green', role: 'VP Marketing', indent: true },
    ],
    change: 'New CTO appointed Feb 2026 (prev: Director of Eng at Google)',
  },
  {
    company: 'CompetitorB',
    people: [
      { name: 'James Wright', role: 'CEO & Co-Founder', indent: false },
      { name: 'Ana Martinez', role: 'CPO', indent: true },
      { name: 'Tom Baker', role: 'CRO', indent: true },
      { name: 'Emily Ross', role: 'VP Customer Success', indent: true },
    ],
    change: 'CRO hire in Jan 2026 signals enterprise push',
  },
  {
    company: 'CompetitorC',
    people: [
      { name: 'Robert Lee', role: 'CEO', indent: false },
      { name: 'Karen White', role: 'CTO & Co-Founder', indent: true },
      { name: 'Amit Patel', role: 'VP Product', indent: true },
      { name: 'Diana Cruz', role: 'VP Operations', indent: true },
    ],
    change: 'VP Product joined from Stripe in Dec 2025',
  },
];

export default function OrgStructurePreview() {
  return (
    <ComingSoonPreview
      title="Organisation Structure"
      description="Map competitor leadership teams and track executive changes. Leadership transitions often signal strategic pivots before they become public."
      icon={<Building2 size={28} />}
    >
      {orgs.map((org, i) => (
        <div className="preview-org-card" key={i}>
          <div className="preview-org-company">{org.company}</div>
          {org.people.map((p, pi) => (
            <div key={pi} className={`preview-org-person ${p.indent ? 'preview-org-person-indent' : ''}`}>
              <span>{p.name}</span>
              <span className="preview-org-role">{p.role}</span>
            </div>
          ))}
          <div className="preview-org-change">{org.change}</div>
        </div>
      ))}
    </ComingSoonPreview>
  );
}
