import { Plug } from 'lucide-react';
import ComingSoonPreview from '../../components/ComingSoonPreview';
import DummyTimeline from '../../components/coming-soon/DummyTimeline';

const events = [
  { date: 'Mar 10, 2026', title: 'CompetitorA + Salesforce', desc: 'New native CRM integration announced at Dreamforce', color: '#2563EB', tag: 'Integration', tagColor: '#2563EB' },
  { date: 'Mar 3, 2026', title: 'CompetitorB + Deloitte', desc: 'Strategic consulting partnership for enterprise rollouts', color: '#7C3AED', tag: 'Strategic', tagColor: '#7C3AED' },
  { date: 'Feb 22, 2026', title: 'CompetitorA + AWS Marketplace', desc: 'Now available for procurement through AWS Marketplace', color: '#059669', tag: 'Reseller', tagColor: '#059669' },
  { date: 'Feb 15, 2026', title: 'CompetitorC + Zapier', desc: '50+ new automation triggers and actions', color: '#2563EB', tag: 'Integration', tagColor: '#2563EB' },
  { date: 'Feb 8, 2026', title: 'CompetitorB + Accenture', desc: 'Joint go-to-market in EMEA financial services', color: '#7C3AED', tag: 'Strategic', tagColor: '#7C3AED' },
  { date: 'Jan 28, 2026', title: 'CompetitorC + HubSpot', desc: 'Bi-directional sync with HubSpot CRM', color: '#2563EB', tag: 'Integration', tagColor: '#2563EB' },
];

export default function PartnershipsPreview() {
  return (
    <ComingSoonPreview
      title="Partnerships & Announcements"
      description="Track competitor partnership announcements, integration launches, and strategic alliances. Understand their ecosystem strategy as it unfolds."
      icon={<Plug size={28} />}
    >
      <DummyTimeline items={events} />
    </ComingSoonPreview>
  );
}
