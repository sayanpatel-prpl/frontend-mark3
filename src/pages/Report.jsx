import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { RefreshCw } from 'lucide-react';
import { reportApi } from '../services/api';
import { CollapsibleContext } from '../components/report/ui/CollapsibleContext';
import PillTabs from '../components/report/ui/PillTabs';
import Spinner from '../components/report/ui/Spinner';
import MarketOverview from '../components/report/MarketOverview';
import BattlecardTab from '../components/report/BattlecardTab';
import SelfAssessmentTab from '../components/report/SelfAssessmentTab';

function ReportLanding({ data, onEnter }) {
  const { project, meta, mainCompanyStats, competitors } = data;

  return (
    <div className="landing">
      <div className="landing-content">
        <div className="logo"><span>KO</span>MPETE</div>
        <h1>Competitive Battlecards</h1>
        <p className="landing-subtitle">{project.mainCompany} vs {competitors.length} Competitors</p>
        <div className="landing-meta">
          <div className="landing-meta-item">
            <strong>{meta.totalReviews?.toLocaleString()}</strong>
            Reviews Analyzed
          </div>
          <div className="landing-meta-item">
            <strong>{competitors.length}</strong>
            Competitors Tracked
          </div>
          <div className="landing-meta-item">
            <strong>{mainCompanyStats.avgRating}</strong>
            {project.mainCompany} Rating
          </div>
        </div>
        <button className="btn-primary" onClick={onEnter}>
          View Full Report →
        </button>
      </div>
    </div>
  );
}

export default function Report({ resolvedProjectId }) {
  const { id: paramId } = useParams();
  const projectId = paramId || resolvedProjectId;
  const navigate = useNavigate();
  const printRef = useRef(null);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [battlecardCache, setBattlecardCache] = useState({});
  const [selfAssessmentCache, setSelfAssessmentCache] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [collapseSignal, setCollapseSignal] = useState(0);

  // Pre-generate all battlecards once market overview loads
  const prefetchStarted = useRef(false);

  const loadReport = useCallback((refresh = false) => {
    setLoading(true);
    setError('');

    // Try cached data first (instant), fall back to sync generation
    const fetchData = refresh
      ? reportApi.getMarketOverview(projectId, { refresh })
      : reportApi.getData(projectId).catch(() => reportApi.getMarketOverview(projectId));

    fetchData
      .then((result) => {
        setData(result);

        // Fire off battlecard + self-assessment fetches in background, staggered to avoid 429s
        if (!prefetchStarted.current || refresh) {
          prefetchStarted.current = true;
          (async () => {
            for (let i = 0; i < result.competitors.length; i++) {
              const comp = result.competitors[i];
              reportApi.getBattlecard(projectId, comp.id, comp.threat)
                .then((bcResult) => {
                  setBattlecardCache((prev) => ({ ...prev, [comp.id]: bcResult }));
                })
                .catch(() => {});
              // Stagger by 8s between competitors to reduce OpenAI rate limit pressure
              if (i < result.competitors.length - 1) {
                await new Promise((r) => setTimeout(r, 8000));
              }
            }
          })();
          reportApi.getSelfAssessment(projectId)
            .then((saResult) => { setSelfAssessmentCache(saResult); })
            .catch(() => {});
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [projectId]);

  useEffect(() => { loadReport(); }, [loadReport]);

  const handleCacheBattlecard = useCallback((companyId, result) => {
    setBattlecardCache((prev) => ({ ...prev, [companyId]: result }));
  }, []);

  const handleCacheSelfAssessment = useCallback((result) => {
    setSelfAssessmentCache(result);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);

    if (activeTab === 'overview') {
      // Refresh market overview (threat assessments)
      reportApi.getMarketOverview(projectId, { refresh: true })
        .then((result) => { setData(result); })
        .catch(() => {})
        .finally(() => setRefreshing(false));
    } else if (activeTab === 'self') {
      // Refresh self-assessment
      reportApi.getSelfAssessment(projectId, { refresh: true })
        .then((result) => {
          setSelfAssessmentCache(result);
        })
        .catch(() => {})
        .finally(() => setRefreshing(false));
    } else {
      // Refresh specific battlecard
      const comp = data?.competitors.find((c) => `comp-${c.id}` === activeTab);
      if (comp) {
        // Clear cache so BattlecardTab shows spinner
        setBattlecardCache((prev) => { const next = { ...prev }; delete next[comp.id]; return next; });
        reportApi.getBattlecard(projectId, comp.id, comp.threat, { refresh: true })
          .then((result) => {
            setBattlecardCache((prev) => ({ ...prev, [comp.id]: result }));
          })
          .catch(() => {})
          .finally(() => setRefreshing(false));
      } else {
        setRefreshing(false);
      }
    }
  }, [activeTab, projectId, data]);

  const reactToPrintFn = useReactToPrint({ contentRef: printRef });

  if (loading) {
    return (
      <Spinner
        text="Generating competitive intelligence..."
        subtext="Analyzing reviews and running AI threat assessments"
        steps={[
          'Loading project data',
          'Computing review statistics',
          'Running AI threat analysis',
          'Building market overview',
        ]}
      />
    );
  }

  if (error) {
    return (
      <div style={{ padding: 32 }}>
        <div className="report-error">
          <div className="report-error-title">Failed to load report</div>
          <div className="report-error-desc">{error}</div>
        </div>
        <button className="btn-secondary" onClick={() => navigate('/reports')} style={{ marginTop: 16 }}>
          ← Back to Reports
        </button>
      </div>
    );
  }

  if (!data) return null;

  if (showLanding) {
    return <div className="report-root"><ReportLanding data={data} onEnter={() => setShowLanding(false)} /></div>;
  }

  const tabs = [
    { key: 'overview', label: 'Market Overview' },
    ...data.competitors.map((comp) => ({
      key: `comp-${comp.id}`,
      label: comp.name,
    })),
    {
      key: 'self',
      label: data.project.mainCompany,
      mainCompany: true,
    },
  ];

  const renderActiveTab = () => {
    if (activeTab === 'overview') {
      return <MarketOverview data={data} />;
    }
    if (activeTab === 'self') {
      return (
        <SelfAssessmentTab
          projectId={projectId}
          cache={selfAssessmentCache}
          onCache={handleCacheSelfAssessment}
        />
      );
    }
    const comp = data.competitors.find((c) => `comp-${c.id}` === activeTab);
    if (comp) {
      return (
        <BattlecardTab
          key={comp.id}
          projectId={projectId}
          competitor={comp}
          cache={battlecardCache[comp.id]}
          onCache={handleCacheBattlecard}
        />
      );
    }
    return null;
  };

  return (
    <CollapsibleContext.Provider value={{ expandSignal: 0, collapseSignal }}>
      <div className="report-root report-container" ref={printRef}>
        <div className="report-header">
          <div className="report-logo"><span>KO</span>MPETE</div>
          <div className="report-actions">
            {(() => {
              try {
                const u = JSON.parse(localStorage.getItem('user') || '{}');
                const domain = u.email?.split('@')[1];
                if (domain === 'gmail.com') return (
                  <button
                    className="btn-secondary"
                    onClick={handleRefresh}
                    disabled={refreshing}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
                  >
                    <RefreshCw size={14} className={refreshing ? 'spinning' : ''} />
                    {refreshing ? 'Regenerating...' : 'Regenerate'}
                  </button>
                );
              } catch (_) {}
              return null;
            })()}
            <button className="btn-secondary" onClick={() => reactToPrintFn()}>
              Export PDF
            </button>
          </div>
        </div>

        <PillTabs tabs={tabs} activeKey={activeTab} onChange={setActiveTab} />

        <div className="section">
          {renderActiveTab()}
        </div>

        <footer className="report-footer">
          <div className="footer-logo"><span style={{ color: 'var(--brand-accent)' }}>KO</span>MPETE</div>
          <div className="footer-text">Generated for {data.project.mainCompany}</div>
        </footer>
      </div>
    </CollapsibleContext.Provider>
  );
}
