import FeatureReportPageWrapper from '../components/FeatureReportPageWrapper';
import IntegrationMatrix from '../components/feature-report/IntegrationMatrix';

export default function IntegrationCoveragePage() {
  return (
    <FeatureReportPageWrapper>
      {(data, meta) => data.integration_matrix && <IntegrationMatrix data={data.integration_matrix} meta={meta} />}
    </FeatureReportPageWrapper>
  );
}
