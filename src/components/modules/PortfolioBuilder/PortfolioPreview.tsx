"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ProjectItem } from "@/types/portfolio";
import { ProjectFormData } from "@/utils/validation";
import Image from "next/image";
import { usePortfolioState } from "./hooks/usePortfolioState";
import PublishingModal from "@/components/modals/PublishingModal";

interface PortfolioPreviewProps {
  projects: ProjectItem[];
  projectData: ProjectFormData;
  projectTitle: string;
  onBackToEdit: () => void;
  handlePublishClick: () => void;
  handleModalPublish: () => void;
  handleModalClose: () => void;
  isModalOpen: boolean;
  isPending: boolean;
  // --- ADDED REQUIRED PROP ---
  clearPortfolioStorage: () => void;
}

const PortfolioPreview = ({
  projects,
  projectData,
  projectTitle,
  onBackToEdit,
  handlePublishClick,
  handleModalPublish,
  handleModalClose,
  isModalOpen,
  isPending,
  clearPortfolioStorage,
}: PortfolioPreviewProps) => {
  return (
    <>
      <div className="flex mb-6 justify-between items-center">
        <Button
          variant="outline"
          onClick={onBackToEdit}
          className="flex items-center gap-2 px-4 py-4 h-[44px] text-gray-600 hover:text-gray-800 transition-colors border-[#1A202C] "
        >
          Back to Edit
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="bg-[#F7F5F4] px-4 grid place-items-center h-[44px]"
            onClick={() => {
              clearPortfolioStorage();
            }}
          >
            Cancel
          </Button>
          <Button
            className="secondary-btn-gradient px-4 grid place-items-center !h-[44px]"
            onClick={handlePublishClick}
            disabled={isPending}
          >
            {isPending ? "processing" : "Publish"}
          </Button>
        </div>
      </div>
      <div className="w-full bg-[#F8F7F766] py-[14px] px-6 rounded-[24px]">
        {/* Preview Header with Back Button */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <h1 className="text-lg md:text-xl lg:text-2xl font-semibold text-primary px-6">
            {projectData.title || projectTitle || "Untitled Project"} Preview
          </h1>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Preview Content - Portfolio items */}
        <div className="space-y-4 mb-8">
          {projects.map((project) => (
            <div key={project.id} className="w-full">
              {project.content.type === "image" && (
                <div className="overflow-hidden rounded-lg relative group">
                  <Image
                    src={project.content.data || ""}
                    alt={
                      project.content.altText ||
                      project.content.title ||
                      "Project image"
                    }
                    className="w-full h-auto max-h-[400px] object-contain"
                    width={800}
                    height={100}
                  />
                  {project.content.caption && (
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: project.content.caption,
                      }}
                    />
                  )}
                </div>
              )}
              {project.content.type === "video" && (
                <div className="overflow-hidden rounded-lg relative group">
                  <video
                    src={project.content.data}
                    controls
                    className="w-full h-auto max-h-[400px] object-contain"
                  />
                  {project.content.caption && (
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: project.content.caption,
                      }}
                    />
                  )}
                </div>
              )}
              {project.content.type === "audio" && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <audio
                    src={project.content.data}
                    controls
                    className="w-full"
                  />
                  {project.content.caption && (
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: project.content.caption,
                      }}
                    />
                  )}
                </div>
              )}
              {project.content.type === "text" && (
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: project.content.data || "",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Preview Metadata Section */}
        <div className="border-t pt-6">
          {/* Tags Section */}
          {projectData?.tags && projectData?.tags.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {projectData?.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Categories Section */}
          {projectData?.categories && projectData?.categories.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {projectData?.categories.map((category, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description Section */}
          {projectData?.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {projectData?.description}
              </p>
            </div>
          )}

          {/* Feedback Request Banner */}
          <div className="flex items-center gap-2 py-4 border-t">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                I need feedbacks from other designers
              </h3>
            </div>

            <Switch checked={projectData?.needsFeedback} />
          </div>
        </div>
      </div>
      <PublishingModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        isPending={isPending}
        onPublish={handleModalPublish}
      />
    </>
  );
};

export default PortfolioPreview;
