import FeatureReportPageWrapper from '../components/FeatureReportPageWrapper';
import FAQIntelligence from '../components/feature-report/FAQIntelligence';

export default function FAQIntelligencePage() {
  return (
    <FeatureReportPageWrapper>
      {(data) => data.faq_intelligence && <FAQIntelligence data={data.faq_intelligence} />}
    </FeatureReportPageWrapper>
  );
}
