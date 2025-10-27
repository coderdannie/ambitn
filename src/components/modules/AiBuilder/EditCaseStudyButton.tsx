"use client";

import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context/appContext";
import { Edit } from "lucide-react";

interface EditCaseStudyButtonProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
}

export const EditCaseStudyButton = ({
  className = "",
  variant = "default",
}: EditCaseStudyButtonProps) => {
  const router = useRouter();
  const { previewData, setShowPreview } = useGlobalContext();

  const handleEdit = () => {
    if (!previewData) {
      console.error("No preview data available");
      return;
    }

    // Close the preview modal/view
    setShowPreview(false);

    // Navigate to portfolio builder with AI source indicator
    router.push("/portfolio-builder?source=ai-case-study");
  };

  const variantStyles = {
    default: "bg-blue-600 hover:bg-blue-700 text-white",
    outline: "border border-gray-300 hover:bg-gray-50 text-gray-700",
    ghost: "hover:bg-gray-100 text-gray-700",
  };

  return (
    <button
      onClick={handleEdit}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-lg 
        font-medium transition-colors
        ${variantStyles[variant]}
        ${className}
      `}
    >
      <Edit className="w-4 h-4" />
      Edit Case Study
    </button>
  );
};

// Alternative: Full-width edit banner
export const EditCaseStudyBanner = () => {
  const router = useRouter();
  const { setShowPreview } = useGlobalContext();

  const handleEdit = () => {
    setShowPreview(false);
    router.push("/portfolio-builder?source=ai-case-study");
  };

  return (
    <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          <span className="text-sm text-blue-900 font-medium">
            AI-Generated Case Study Preview
          </span>
        </div>
        <button
          onClick={handleEdit}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
        >
          <Edit className="w-4 h-4" />
          Edit & Customize
        </button>
      </div>
    </div>
  );
};
