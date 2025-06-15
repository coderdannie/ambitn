import { Suspense } from 'react';
import PreviewPageContent from './PreviewPageContent';
import LoadingOverlay from '@/components/common/Loaders/LoadingOverlay';

const PreviewPage = () => {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      <PreviewPageContent />
    </Suspense>
  );
};

export default PreviewPage;
