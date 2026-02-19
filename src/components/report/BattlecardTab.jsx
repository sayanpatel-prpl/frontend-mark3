import { useState, useEffect } from 'react';
import { reportApi } from '../../services/api';
import Spinner from './ui/Spinner';
import BattlecardHeader from './BattlecardHeader';
import SentimentBreakdown from './SentimentBreakdown';
import ComplaintChips from './ComplaintChips';
import StrengthsWeaknesses from './StrengthsWeaknesses';
import LandmineQuestions from './LandmineQuestions';
import ReviewPatterns from './ReviewPatterns';
import PricingIntelligence from './PricingIntelligence';
import CompetitiveAdvantages from './CompetitiveAdvantages';
import TrendAnalysis from './TrendAnalysis';
import WorstReviews from './WorstReviews';

export default function BattlecardTab({ projectId, competitor, cache, onCache }) {
  const [data, setData] = useState(cache || null);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState('');

  useEffect(() => {
    if (cache) return;

    let cancelled = false;
    setLoading(true);
    setError('');

    reportApi.getBattlecard(projectId, competitor.id, competitor.threat)
      .then((result) => {
        if (cancelled) return;
        setData(result);
        onCache(competitor.id, result);
      })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [projectId, competitor.id]);

  if (loading) {
    return (
      <Spinner
        text={`Loading battlecard for ${competitor.name}...`}
        subtext="Running AI analysis (may take 10-20s)"
      />
    );
  }

  if (error) {
    return (
      <div className="report-error">
        <div className="report-error-title">Failed to load battlecard</div>
        <div className="report-error-desc">{error}</div>
      </div>
    );
  }

  if (!data) return null;

  const comp = data.comp;
  const { battlecard } = comp;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <BattlecardHeader comp={comp} />
      <SentimentBreakdown stats={comp.stats} />
      <ComplaintChips chips={comp.complaintChips} />
      <StrengthsWeaknesses battlecard={battlecard} />
      <LandmineQuestions battlecard={battlecard} />
      <ReviewPatterns battlecard={battlecard} />
      <PricingIntelligence comp={comp} battlecard={battlecard} />
      <CompetitiveAdvantages battlecard={battlecard} />
      <TrendAnalysis comp={comp} />
      <WorstReviews comp={comp} />
    </div>
  );
}
