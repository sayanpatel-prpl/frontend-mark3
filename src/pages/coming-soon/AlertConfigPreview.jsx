import { Bell } from 'lucide-react';
import ComingSoonPreview from '../../components/ComingSoonPreview';

const alerts = [
  { trigger: 'Competitor pricing change detected', channel: 'Slack + Email', frequency: 'Instant', on: true },
  { trigger: 'New negative review (< 3 stars)', channel: 'Email', frequency: 'Daily digest', on: true },
  { trigger: 'New competitor job posting', channel: 'Slack', frequency: 'Weekly', on: false },
  { trigger: 'Website content change', channel: 'Email', frequency: 'Instant', on: true },
];

export default function AlertConfigPreview() {
  return (
    <ComingSoonPreview
      title="Alert Configuration"
      description="Set up custom alerts for competitive signals that matter. Choose triggers, delivery channels, and frequency — never miss an important move."
      icon={<Bell size={28} />}
    >
      {alerts.map((a, i) => (
        <div className="preview-alert-card" key={i}>
          <div className="preview-alert-info">
            <div className="preview-alert-title">{a.trigger}</div>
            <div className="preview-alert-meta">
              <span className="preview-badge preview-badge-blue" style={{ marginRight: 6 }}>{a.channel}</span>
              <span style={{ color: 'var(--gray-400)' }}>{a.frequency}</span>
            </div>
          </div>
          <div className={`preview-toggle ${a.on ? 'on' : ''}`} />
        </div>
      ))}
    </ComingSoonPreview>
  );
}
