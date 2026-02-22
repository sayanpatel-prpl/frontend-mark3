import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { RefreshCw } from 'lucide-react';
import { featureReportApi } from '../services/api';
import FeatureMatrix from '../components/feature-report/FeatureMatrix';
import GapAnalysis from '../components/feature-report/GapAnalysis';
import ClaimsAudit from '../components/feature-report/ClaimsAudit';
import IntegrationMatrix from '../components/feature-report/IntegrationMatrix';
import SocialProofScorecard from '../components/feature-report/SocialProofScorecard';
import MessagingPlaybook from '../components/feature-report/MessagingPlaybook';
import FAQIntelligence from '../components/feature-report/FAQIntelligence';
import NewsMomentum from '../components/feature-report/NewsMomentum';
import Spinner from '../components/report/ui/Spinner';

const STATUS_LABELS = {
  classifying: 'Classifying product pages...',
  comparing: 'Comparing features across competitors...',
  generating: 'Generating report sections...',
};

export default function FeatureReport() {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const printRef = useRef(null);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const pollRef = useRef(null);

  const loadReport = useCallback((refresh = false) => {
    setLoading(true);
    setError('');

    featureReportApi.generate(projectId, refresh)
      .then((result) => {
        if (result.status === 'generating' || result.status === 'classifying' || result.status === 'comparing') {
          // Generation started, begin polling
          setStatus(result.status);
          setLoading(false);
          startPolling();
        } else if (result.feature_matrix) {
          // Cached result returned
          setData(result);
          setStatus('success');
          setLoading(false);
        } else {
          setLoading(false);
          startPolling();
        }
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [projectId]);

  const startPolling = useCallback(() => {
    clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const statusRes = await featureReportApi.getStatus(projectId);
        setStatus(statusRes.status);

        if (statusRes.status === 'success') {
          clearInterval(pollRef.current);
          const reportData = await featureReportApi.getData(projectId);
          setData(reportData);
        } else if (statusRes.status === 'failed') {
          clearInterval(pollRef.current);
          setError(statusRes.error_message || 'Report generation failed');
        }
      } catch (_) {}
    }, 3000);
  }, [projectId]);

  useEffect(() => {
    loadReport();
    return () => clearInterval(pollRef.current);
  }, [loadReport]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setData(null);
    setStatus(null);
    featureReportApi.generate(projectId, true)
      .then(() => {
        setRefreshing(false);
        startPolling();
      })
      .catch((err) => {
        setError(err.message);
        setRefreshing(false);
      });
  }, [projectId, startPolling]);

  const reactToPrintFn = useReactToPrint({ contentRef: printRef });

  if (loading) {
    return (
      <Spinner
        text="Loading feature report..."
        subtext="Checking for cached report data"
        steps={['Loading project data', 'Checking cache']}
      />
    );
  }

  // In-progress states
  if (!data && status && status !== 'failed') {
    return (
      <Spinner
        text={STATUS_LABELS[status] || 'Generating feature report...'}
        subtext="This may take 20-40 minutes for the first generation. Subsequent loads will be instant."
        steps={[
          'Classifying product pages',
          'Comparing features across competitors',
          'Generating claims audit',
          'Building integration matrix',
          'Analyzing social proof',
          'Creating messaging playbook',
          'Mining FAQ intelligence',
          'Tracking news & momentum',
        ]}
      />
    );
  }

  if (error) {
    return (
      <div style={{ padding: 32 }}>
        <div className="report-error">
          <div className="report-error-title">Failed to generate feature report</div>
          <div className="report-error-desc">{error}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button className="btn-secondary" onClick={() => navigate('/feature-reports')}>
            Back to Reports
          </button>
          <button className="btn-primary" onClick={() => { setError(''); loadReport(); }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { meta } = data;

  return (
    <div className="report-root report-container" ref={printRef}>
      <div className="report-header">
        <div className="report-logo"><span>KO</span>MPETE</div>
        <div className="report-actions">
          <button
            className="btn-secondary"
            onClick={handleRefresh}
            disabled={refreshing}
            style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
          >
            <RefreshCw size={14} className={refreshing ? 'spinning' : ''} />
            {refreshing ? 'Regenerating...' : 'Regenerate'}
          </button>
          <button className="btn-secondary" onClick={() => reactToPrintFn()}>
            Export PDF
          </button>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--navy)', fontSize: '1.8rem', marginBottom: 4 }}>
          Feature Intelligence Report
        </h1>
        <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>
          {meta.main_company?.name} vs {meta.competitors?.length} Competitors
          &nbsp;&bull;&nbsp;
          {meta.main_features_count} features &bull; {meta.total_comparisons} comparisons
        </p>
      </div>

      <div className="section">
        <FeatureMatrix data={data.feature_matrix} meta={meta} />
        <GapAnalysis data={data.gap_analysis} />
        <ClaimsAudit data={data.claims_audit} meta={meta} />
        <IntegrationMatrix data={data.integration_matrix} meta={meta} />
        <SocialProofScorecard data={data.social_proof} />
        <MessagingPlaybook data={data.messaging_playbook} meta={meta} />
        <FAQIntelligence data={data.faq_intelligence} />
        <NewsMomentum data={data.news_momentum} meta={meta} />
      </div>

      <footer className="report-footer">
        <div className="footer-logo"><span style={{ color: 'var(--brand-accent)' }}>KO</span>MPETE</div>
        <div className="footer-text">Feature Intelligence Report &bull; {meta.main_company?.name}</div>
      </footer>
    </div>
  );
}
