import { BarChart3 } from 'lucide-react';
import ComingSoonPreview from '../../components/ComingSoonPreview';
import DummyHeatmap from '../../components/coming-soon/DummyHeatmap';

const columns = ['Your Company', 'CompetitorA', 'CompetitorB', 'CompetitorC'];

const rows = [
  {
    label: 'Ease of Use',
    values: [
      { text: '4.6', level: 'high' },
      { text: '3.8', level: 'med' },
      { text: '4.4', level: 'high' },
      { text: '3.2', level: 'low' },
    ],
  },
  {
    label: 'Customer Support',
    values: [
      { text: '4.3', level: 'high' },
      { text: '4.1', level: 'high' },
      { text: '3.5', level: 'med' },
      { text: '2.8', level: 'neg' },
    ],
  },
  {
    label: 'Value for Money',
    values: [
      { text: '4.0', level: 'high' },
      { text: '3.6', level: 'med' },
      { text: '4.2', level: 'high' },
      { text: '3.9', level: 'med' },
    ],
  },
  {
    label: 'Feature Set',
    values: [
      { text: '4.4', level: 'high' },
      { text: '4.5', level: 'high' },
      { text: '3.7', level: 'med' },
      { text: '4.1', level: 'high' },
    ],
  },
  {
    label: 'Reliability',
    values: [
      { text: '4.2', level: 'high' },
      { text: '3.4', level: 'low' },
      { text: '4.3', level: 'high' },
      { text: '3.0', level: 'neg' },
    ],
  },
  {
    label: 'Onboarding',
    values: [
      { text: '3.8', level: 'med' },
      { text: '3.1', level: 'low' },
      { text: '4.5', level: 'high' },
      { text: '2.9', level: 'neg' },
    ],
  },
];

export default function ReviewHeatmapsPreview() {
  return (
    <ComingSoonPreview
      title="Review Heat Maps"
      description="Visual comparison of competitor strengths and weaknesses across review categories. Instantly spot where you lead and where you lag."
      icon={<BarChart3 size={28} />}
    >
      <DummyHeatmap columns={columns} rows={rows} />
    </ComingSoonPreview>
  );
}
