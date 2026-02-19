import StatBox from './StatBox';
import ComparisonMatrix from './ComparisonMatrix';
import QuarterlyTrendChart from './QuarterlyTrendChart';
import CategoryHeatmap from './CategoryHeatmap';
import ThreatCards from './ThreatCards';

export default function MarketOverview({ data }) {
  const { project, meta, mainCompanyStats, competitors, categoryLabels, categoryColumns, quarterlyTrend } = data;

  return (
    <div>
      <h2 className="section-main-title">Market Overview</h2>
      <p className="section-subtitle">
        Competitive landscape analysis across {meta.competitorCount} competitors and {meta.totalReviews?.toLocaleString()} reviews
      </p>

      <div className="stat-grid">
        <StatBox title="Total Reviews" value={meta.totalReviews?.toLocaleString()} />
        <StatBox title="Competitors Tracked" value={meta.competitorCount} />
        <StatBox title={`${project.mainCompany} Rating`} value={mainCompanyStats.avgRating} />
        <StatBox title="Market Avg Rating" value={meta.marketAvgRating} />
      </div>

      <ComparisonMatrix competitors={competitors} mainCompanyStats={mainCompanyStats} project={project} />

      <QuarterlyTrendChart quarterlyTrend={quarterlyTrend} />

      <CategoryHeatmap
        competitors={competitors}
        mainCompanyStats={mainCompanyStats}
        categoryColumns={categoryColumns}
        categoryLabels={categoryLabels}
        project={project}
      />

      <div style={{ marginTop: '2rem' }}>
        <h3 className="section-main-title" style={{ fontSize: '1.25rem' }}>Threat Assessment</h3>
        <p className="section-subtitle">AI-generated threat analysis for each competitor</p>
        <ThreatCards competitors={competitors} />
      </div>
    </div>
  );
}
