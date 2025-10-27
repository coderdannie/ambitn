import { Suspense } from "react";
import PortfolioBuilderContent from "@/components/modules/PortfolioBuilder/PortfolioBuilderContent";
import LoadingOverlay from "@/components/common/Loaders/LoadingOverlay"; // Assuming path

// This is the Server Component page structure.
const PortfolioBuilder = () => {
  return (
    // The Suspense boundary catches the client-side hook usage
    <Suspense fallback={<LoadingOverlay />}>
      <PortfolioBuilderContent />
    </Suspense>
  );
};

export default PortfolioBuilder;
