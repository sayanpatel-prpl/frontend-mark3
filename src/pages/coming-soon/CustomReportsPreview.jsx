import { ClipboardCheck } from 'lucide-react';
import ComingSoonPreview from '../../components/ComingSoonPreview';

const sections = [
  { label: 'Executive Summary', checked: true },
  { label: 'Feature Comparison', checked: true },
  { label: 'Pricing Analysis', checked: false },
  { label: 'Review Sentiment', checked: true },
  { label: 'Market Signals', checked: false },
  { label: 'Hiring Trends', checked: false },
  { label: 'Strategic Recommendations', checked: true },
];

const previewSections = [
  { title: 'Executive Summary', content: '3 key takeaways from the competitive landscape this quarter...' },
  { title: 'Feature Comparison', content: 'Matrix of 24 features across 4 competitors with gap analysis...' },
  { title: 'Strategic Recommendations', content: '5 prioritized actions based on current competitive dynamics...' },
];

export default function CustomReportsPreview() {
  return (
    <ComingSoonPreview
      title="Custom Reports"
      description="Build tailored competitive reports by selecting the sections that matter most. Share with stakeholders or schedule automated delivery."
      icon={<ClipboardCheck size={28} />}
    >
      <div className="preview-builder">
        <div className="preview-builder-panel">
          <div className="preview-builder-panel-title">Select Sections</div>
          {sections.map((s, i) => (
            <div className="preview-checkbox-item" key={i}>
              <div className={`preview-checkbox ${s.checked ? 'checked' : ''}`} />
              {s.label}
            </div>
          ))}
        </div>
        <div className="preview-builder-panel">
          <div className="preview-builder-panel-title">Report Preview</div>
          {previewSections.map((s, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', marginBottom: 2 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-500)', lineHeight: 1.5 }}>{s.content}</div>
            </div>
          ))}
        </div>
      </div>
    </ComingSoonPreview>
  );
}
