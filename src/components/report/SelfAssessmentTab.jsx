import { useState, useEffect } from 'react';
import { reportApi } from '../../services/api';
import Spinner from './ui/Spinner';
import SelfAssessmentHeader from './SelfAssessmentHeader';
import SelfAssessmentBody from './SelfAssessmentBody';

export default function SelfAssessmentTab({ projectId, cache, onCache }) {
  const [data, setData] = useState(cache || null);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState('');

  useEffect(() => {
    if (cache) return;

    let cancelled = false;
    setLoading(true);
    setError('');

    reportApi.getSelfAssessment(projectId)
      .then((result) => {
        if (cancelled) return;
        setData(result);
        onCache(result);
      })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [projectId]);

  if (loading) {
    return (
      <Spinner
        text="Running self-assessment..."
        subtext="AI is analyzing your company's reviews (may take 10-20s)"
      />
    );
  }

  if (error) {
    return (
      <div className="report-error">
        <div className="report-error-title">Failed to load self-assessment</div>
        <div className="report-error-desc">{error}</div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SelfAssessmentHeader mainCompanyStats={data.mainCompanyStats} project={data.project} />
      <SelfAssessmentBody selfAssessment={data.selfAssessment} />
    </div>
  );
}
