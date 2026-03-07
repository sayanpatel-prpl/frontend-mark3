import FeatureReportPageWrapper from '../components/FeatureReportPageWrapper';
import ClaimsAudit from '../components/feature-report/ClaimsAudit';

export default function ClaimsAuditPage() {
  return (
    <FeatureReportPageWrapper showRegenerate>
      {(data, meta) => data.claims_audit && <ClaimsAudit data={data.claims_audit} meta={meta} />}
    </FeatureReportPageWrapper>
  );
}
