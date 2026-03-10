import FeatureReportPageWrapper from '../components/FeatureReportPageWrapper';
import SocialProofScorecard from '../components/feature-report/SocialProofScorecard';

export default function CustomerRecognitionPage() {
  return (
    <FeatureReportPageWrapper>
      {(data) => data.social_proof && <SocialProofScorecard data={data.social_proof} />}
    </FeatureReportPageWrapper>
  );
}
