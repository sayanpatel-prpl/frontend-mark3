import { useParams } from 'react-router-dom';
import useProject from '../hooks/useProject';
import useFeatureReportData from '../hooks/useFeatureReportData';
import MessagingPlaybook from '../components/feature-report/MessagingPlaybook';
import Spinner from '../components/report/ui/Spinner';
import { RefreshCw } from 'lucide-react';

export default function MessagingPlaybookPage() {
  const { id: paramId } = useParams();
  const { projectId: resolvedId } = useProject();
  const projectId = paramId || resolvedId;

  const { data, loading, status, statusLabel, error, refreshing, refresh, loadReport } = useFeatureReportData(projectId);

  if (!projectId || loading) {
    return <Spinner text="Loading messaging playbook..." subtext="Checking for cached report data" />;
  }

  if (!data && status && status !== 'failed') {
    return (
      <Spinner
        text={statusLabel || 'Generating report...'}
        subtext="This may take 20-40 minutes for the first generation. Subsequent loads will be instant."
      />
    );
  }

  if (error) {
    return (
      <div style={{ padding: 32 }}>
        <div className="report-error">
          <div className="report-error-title">Failed to load messaging playbook</div>
          <div className="report-error-desc">{error}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button className="btn-primary" onClick={() => loadReport()}>Retry</button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Normalize LLM data
  let playbook = data.messaging_playbook;
  if (playbook && !Array.isArray(playbook) && typeof playbook === 'object') {
    const found = Object.values(playbook).find(v => Array.isArray(v));
    playbook = found || [];
  }

  const { meta } = data;

  return (
    <div className="report-root report-container" style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ color: 'var(--navy)', fontSize: '1.6rem', marginBottom: 4 }}>Competitor Messaging Playbook</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>
            How competitors position themselves and how to counter their messaging
          </p>
        </div>
        <button
          className="btn-secondary"
          onClick={refresh}
          disabled={refreshing}
          style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
        >
          <RefreshCw size={14} className={refreshing ? 'spinning' : ''} />
          {refreshing ? 'Regenerating...' : 'Regenerate'}
        </button>
      </div>

      {playbook?.length > 0
        ? <MessagingPlaybook data={playbook} meta={meta} />
        : <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem', color: 'var(--gray-400)' }}>
            <p style={{ fontSize: '1rem', fontWeight: 500 }}>Messaging playbook data not yet available</p>
            <p style={{ fontSize: '0.85rem' }}>Generate the feature report first, then this page will populate automatically.</p>
          </div>
      }
    </div>
  );
}
