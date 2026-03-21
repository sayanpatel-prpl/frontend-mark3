import { theme } from 'antd';
import { AlertTriangle } from 'lucide-react';

export default function ComingSoonPreview({ title, description, icon, children }) {
  const { token } = theme.useToken();

  return (
    <div className="report-root">
      <div className="report-container">
        <div className="preview-banner">
          <AlertTriangle size={16} style={{ color: '#C9A84C', flexShrink: 0 }} />
          <span className="preview-banner-label">Sample Preview</span>
          <span style={{ fontSize: 12 }}>— illustrative data only, not from your competitive landscape</span>
        </div>

        {/* Header */}
        <div className="preview-header">
          <div className="preview-header-icon">
            {icon}
          </div>
          <div className="preview-header-text">
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
        </div>

        {/* Content */}
        <div className="preview-content">
          {children}
        </div>
      </div>
    </div>
  );
}
