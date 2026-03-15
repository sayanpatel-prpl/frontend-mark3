import { Activity } from 'lucide-react';
import ComingSoonPreview from '../../components/ComingSoonPreview';
import DummyTimeline from '../../components/coming-soon/DummyTimeline';

const events = [
  { date: '12 min ago', title: 'CompetitorA published new pricing page', desc: 'Enterprise tier increased by 15%', color: '#DC2626', tag: 'Pricing', tagColor: '#DC2626' },
  { date: '1h ago', title: 'CompetitorB mentioned in TechCrunch', desc: 'Series C funding announcement — $45M raised', color: '#2563EB', tag: 'News', tagColor: '#2563EB' },
  { date: '3h ago', title: 'New G2 review for CompetitorC', desc: '2-star review citing poor API documentation', color: '#D97706', tag: 'Review', tagColor: '#D97706' },
  { date: '5h ago', title: 'CompetitorA job posting: Head of AI', desc: 'Signal: investing in AI-powered features', color: '#059669', tag: 'Hiring', tagColor: '#059669' },
  { date: '8h ago', title: 'CompetitorB website copy change detected', desc: 'New tagline: "The all-in-one platform for modern teams"', color: '#7C3AED', tag: 'Content', tagColor: '#7C3AED' },
  { date: '12h ago', title: 'CompetitorC + Slack integration launched', desc: 'Native Slack app now available on their marketplace', color: '#2563EB', tag: 'Product', tagColor: '#2563EB' },
  { date: '1d ago', title: 'CompetitorA Capterra reviews spike', desc: '12 new reviews in 24h (avg is 3/week)', color: '#D97706', tag: 'Review', tagColor: '#D97706' },
  { date: '1d ago', title: 'CompetitorB blog: "Why we rebuilt our API"', desc: 'Technical deep-dive suggesting major platform overhaul', color: '#7C3AED', tag: 'Content', tagColor: '#7C3AED' },
];

export default function LiveFeedPreview() {
  return (
    <ComingSoonPreview
      title="Live Feed"
      description="Real-time stream of competitive signals across all monitored sources. Every pricing change, review, news mention, and product update — as it happens."
      icon={<Activity size={28} />}
    >
      <DummyTimeline items={events} />
    </ComingSoonPreview>
  );
}
