import { Sliders } from 'lucide-react';
import ComingSoonPreview from '../../components/ComingSoonPreview';

const integrations = [
  { name: 'Salesforce', desc: 'Sync competitor data with CRM', connected: true },
  { name: 'Slack', desc: 'Real-time alert notifications', connected: true },
  { name: 'HubSpot', desc: 'Enrich deals with competitive intel', connected: false },
  { name: 'Jira', desc: 'Link feature gaps to backlog items', connected: false },
  { name: 'Google Sheets', desc: 'Export reports to spreadsheets', connected: true },
  { name: 'Zapier', desc: 'Connect to 5,000+ apps', connected: false },
];

export default function IntegrationsPreview() {
  return (
    <ComingSoonPreview
      title="Integrations"
      description="Connect Kompete to the tools your team already uses. Push competitive intelligence into your CRM, messaging, and project management workflows."
      icon={<Sliders size={28} />}
    >
      <div className="preview-integration-grid">
        {integrations.map((intg, i) => (
          <div className="preview-integration-card" key={i}>
            <div className="preview-integration-name">{intg.name}</div>
            <div className="preview-integration-desc">{intg.desc}</div>
            <span className={`preview-btn ${intg.connected ? 'preview-btn-connected' : ''}`}>
              {intg.connected ? 'Connected' : 'Connect'}
            </span>
          </div>
        ))}
      </div>
    </ComingSoonPreview>
  );
}
