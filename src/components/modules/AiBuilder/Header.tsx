"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Eye, Edit, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGlobalContext } from "@/context/appContext";
import { TbEdit } from "react-icons/tb";
import { EditCaseStudyButton } from "./EditCaseStudyButton";

const Header = () => {
  const router = useRouter();
  const { showPreview, setShowPreview, previewData } = useGlobalContext();

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

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  return (
    <header
      className={`h-[80px] border-b border-[#E4E4E4] sticky top-0 left-0 w-full flex items-center justify-between px-[30px] z-30 bg-white`}
    >
      <div className="flex items-center gap-4">
        {showPreview && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClosePreview}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Back
          </Button>
        )}
      </div>
      {showPreview && (
        <div className="flex gap-2 items-center bg-[#F7FAFC] p-[8px] rounded-md">
          {" "}
          <Button
            variant="outline"
            onClick={() => router.push(`/preview/${previewData?.id}`)}
            className="gap-2 py-3 px-2"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleEdit}
            className="gap-2 bg-transparent text-primary"
          >
            <TbEdit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      )}
      {showPreview && (
        <div className="flex items-center gap-3">
          <Button
            variant="default"
            size="sm"
            className="secondary-btn-gradient grid place-items-center !h-[44px]"
          >
            Continue to publish
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
