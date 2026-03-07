import FeatureReportPageWrapper from '../components/FeatureReportPageWrapper';
import NewsMomentum from '../components/feature-report/NewsMomentum';

export default function NewsMomentumPage() {
  return (
    <FeatureReportPageWrapper>
      {(data, meta) => data.news_momentum && <NewsMomentum data={data.news_momentum} meta={meta} />}
    </FeatureReportPageWrapper>
  );
}
