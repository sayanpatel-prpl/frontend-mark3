import { FileText } from 'lucide-react';
import ComingSoonPreview from '../../components/ComingSoonPreview';

export default function WeeklyDigestPreview() {
  return (
    <ComingSoonPreview
      title="Weekly Digest"
      description="Automated weekly email summarizing the most important competitive signals. Top moves, review trends, and action items — delivered to your inbox every Monday."
      icon={<FileText size={28} />}
    >
      <div className="preview-email">
        <div className="preview-email-header">
          <div className="preview-email-subject">Kompete Weekly Digest — Mar 10-14, 2026</div>
          <div className="preview-email-date">Delivered Monday, Mar 15, 2026 at 8:00 AM</div>
        </div>
        <div className="preview-email-body">
          <div className="preview-email-section">
            <div className="preview-email-section-title">Top Signals This Week</div>
            <div className="preview-email-item">CompetitorA raised enterprise pricing by 15%</div>
            <div className="preview-email-item">CompetitorB launched native Slack integration</div>
            <div className="preview-email-item">CompetitorC received 12 new G2 reviews (avg 2.8 stars)</div>
          </div>
          <div className="preview-email-section">
            <div className="preview-email-section-title">Competitor Moves</div>
            <div className="preview-email-item">CompetitorA posted 3 new job listings (AI/ML focus)</div>
            <div className="preview-email-item">CompetitorB published case study with Fortune 500 client</div>
          </div>
          <div className="preview-email-section">
            <div className="preview-email-section-title">Action Items</div>
            <div className="preview-email-item">Update battle cards for CompetitorA pricing change</div>
            <div className="preview-email-item">Target CompetitorC churners — satisfaction declining</div>
            <div className="preview-email-item">Review CompetitorB's Slack integration for feature parity</div>
          </div>
        </div>
      </div>
    </ComingSoonPreview>
  );
}
