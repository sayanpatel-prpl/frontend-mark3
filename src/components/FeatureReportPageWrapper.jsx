import { useState, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import useProject from '../hooks/useProject';
import useFeatureReportData from '../hooks/useFeatureReportData';
import { featureReportApi } from '../services/api';
import Spinner from './report/ui/Spinner';

export default function FeatureReportPageWrapper({ children, showRegenerate = false }) {
  const { projectId, loading: projectLoading, error: projectError } = useProject();
  const { data, loading, status, statusLabel, error, loadReport } = useFeatureReportData(projectId);
  const [regenerating, setRegenerating] = useState(false);

  const handleRegenerate = useCallback(() => {
    if (!projectId || regenerating) return;
    setRegenerating(true);
    featureReportApi.regenerateSection(projectId)
      .then(() => {
        // Start polling for the new report
        loadReport();
      })
      .catch((err) => {
        console.error('Regenerate failed:', err);
      })
      .finally(() => setRegenerating(false));
  }, [projectId, regenerating, loadReport]);

  if (projectLoading || loading) {
    return (
      <Spinner
        text="Loading report data..."
        subtext="Checking for cached report data"
        steps={['Loading project data', 'Checking cache']}
      />
    );
  }

  if (!data && status && status !== 'failed') {
    return (
      <Spinner
        text={statusLabel || 'Regenerating section...'}
        subtext="Only re-running updated sections. This should be quick."
        steps={[
          'Loading cached sections',
          'Regenerating updated sections',
        ]}
      />
    );
  }

  if (projectError || error) {
    return (
      <div style={{ padding: 32 }}>
        <div className="report-error">
          <div className="report-error-title">Failed to load report data</div>
          <div className="report-error-desc">{projectError || error}</div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Normalize LLM data: if a section value is an object instead of an array,
  // extract the first array value found inside it
  const normalizedData = { ...data };
  const arrayKeys = ['claims_audit', 'integration_matrix', 'social_proof', 'messaging_playbook', 'faq_intelligence', 'news_momentum', 'gap_analysis', 'feature_matrix'];
  for (const key of arrayKeys) {
    const val = normalizedData[key];
    if (val && !Array.isArray(val) && typeof val === 'object') {
      const found = Object.values(val).find(v => Array.isArray(v));
      normalizedData[key] = found || [];
    }
  }

  return (
    <div className="report-root report-container">
      <div className="report-header">
        <div className="report-logo"><span>KO</span>MPETE</div>
        {showRegenerate && (
          <div className="report-actions">
            <button
              className="btn-secondary"
              onClick={handleRegenerate}
              disabled={regenerating}
              style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
            >
              <RefreshCw size={14} className={regenerating ? 'spinning' : ''} />
              {regenerating ? 'Regenerating...' : 'Regenerate'}
            </button>
          </div>
        )}
      </div>
      {children(normalizedData, normalizedData.meta)}
      <footer className="report-footer">
        <div className="footer-logo"><span style={{ color: 'var(--brand-accent)' }}>KO</span>MPETE</div>
        <div className="footer-text">Feature Intelligence Report &bull; {data.meta?.main_company?.name}</div>
      </footer>
    </div>
  );
}
