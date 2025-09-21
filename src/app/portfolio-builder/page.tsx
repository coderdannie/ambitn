"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import PortfolioHeader from "@/components/modules/PortfolioBuilder/ProjectHeader";
import ProjectsList from "@/components/modules/PortfolioBuilder/ProjectLists";
import AddContentPanel from "@/components/modules/PortfolioBuilder/AddContentPanel";
import ReorderModal from "@/components/modals/ReorderModal";
import AddContentDrawer from "@/components/modals/AddContentDrawer";
import { PublishProjectModal } from "@/components/modals/PublishProjectModal";
import { CoverPhotoModal } from "@/components/modals/CoverPhotoModal";
import { usePortfolioState } from "@/components/modules/PortfolioBuilder/hooks/usePortfolioState";
import { useProjectOperations } from "@/components/modules/PortfolioBuilder/hooks/useProjectOperations";
import { useMediaUpload } from "@/components/modules/PortfolioBuilder/hooks/useMediaUpload";
import { ProjectContent, ProjectItem } from "@/types/portfolio";
import { ProjectFormData } from "@/utils/validation";
import { useScrollToContent } from "@/components/modules/PortfolioBuilder/hooks/useToScrollContent";
import LoadingOverlay from "@/components/common/Loaders/LoadingOverlay";
import ProjectSidebar from "@/components/Layouts/AuthLayout/ProjectSidebar";
import Header from "@/components/Layouts/AuthLayout/Header";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { IoMdArrowBack } from "react-icons/io";

const PortfolioBuilder = () => {
  const router = useRouter();

  const {
    projects,
    setProjects,
    textContent,
    setTextContent,
    addingText,
    setAddingText,
    editingTextId,
    setEditingTextId,
    showRearrangeModal,
    setShowRearrangeModal,
    projectTitle,
    setProjectTitle,
    insertPosition,
    setInsertPosition,
    uploadingProjects,
    setUploadingProjects,
    deletingProjects,
    setDeletingProjects,
    isDrawerOpen,
    setIsDrawerOpen,
    open,
    setOpen,
    showCoverModal,
    setShowCoverModal,
    projectData,
    setProjectData,
    editorRef,
    uploadImage,
    uploadVideo,
    uploadAudio,
    deleteUploadedImage,
    deleteUploadedVideo,
    deleteUploadedAudio,
    imageUploadProgress,
    videoUploadProgress,
    audioUploadProgress,
    addToast,
    clearPortfolioStorage,
    lastSaved,
    isLoadingDetails,
    isEditMode,
  } = usePortfolioState();

  const {
    moveProject,
    updateProject,
    removeProject,
    addProject,
    addProjectAtPosition,
  } = useProjectOperations({
    projects,
    setProjects,
    setUploadingProjects,
    setDeletingProjects,
    deleteUploadedImage,
    deleteUploadedVideo,
    deleteUploadedAudio,
    addToast,
  });

  const { scrollToNewContent, scrollToProjectItem, scrollToPosition } =
    useScrollToContent();

  const { handleImageUpload, handleVideoUpload, handleAudioUpload } =
    useMediaUpload({
      uploadImage,
      uploadVideo,
      uploadAudio,
      updateProject,
      removeProject,
      addToast,
      setProjects,
      setUploadingProjects,
    });

  // Check if there are unsaved changes
  const hasUnsavedChanges = projects?.length > 0 || projectTitle.trim() !== "";

  // Auto-update cover image when projects change
  useEffect(() => {
    const firstImage = projects?.find((p) => p?.content?.type === "image")
      ?.content.data;

    // Only update if there's no manually set cover image or if the current cover is empty
    if (
      firstImage &&
      (!projectData.coverImage || projectData.coverImage === "")
    ) {
      setProjectData((prev) => ({
        ...prev,
        coverImage: firstImage as string,
      }));
    }

    // If there are no images and cover was auto-set, clear it
    if (!firstImage && projectData.coverImage && projectImages.length === 0) {
      setProjectData((prev) => ({
        ...prev,
        coverImage: "",
      }));
    }
  }, [projects, projectData.coverImage, setProjectData]);

  // Effects
  useEffect(() => {
    const html = document.documentElement;
    if (open || showCoverModal) {
      html.style.overflow = "hidden";
    } else {
      html.style.overflow = "";
    }
    return () => {
      html.style.overflow = "";
    };
  }, [open, showCoverModal]);

  // Handle page leave warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Handle form changes (memoized to prevent unnecessary re-renders)
  const handleFormChange = useCallback(
    (data: ProjectFormData) => {
      setProjectData(data);
    },
    [setProjectData]
  );

  // Handle preview navigation
  const handlePreview = useCallback(() => {
    // Save current state to localStorage before navigating
    router.push("/portfolio/preview");
  }, [router]);

  // Handle publish
  const handlePublish = useCallback(
    async (data: ProjectFormData) => {
      try {
        console.log("Publishing project:", data);

        // Ensure cover image is set to first image if not manually selected
        const finalData = {
          ...data,
          coverImage:
            data.coverImage ||
            projects.find((p) => p.content.type === "image")?.content.data ||
            "",
        };

        // Your publish logic here
        // const response = await fetch('/api/projects', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     ...finalData,
        //     projects,
        //     title: projectTitle,
        //   }),
        // });

        // if (response.ok) {
        //   const result = await response.json();
        //   addToast('Project published successfully!', 'success');
        //   clearPortfolioStorage(); // Clear localStorage after successful publish
        //   router.push(`/portfolio/${result.id}`);
        // }

        // For demo purposes:

        // clearPortfolioStorage();
        setOpen(false);
      } catch (error) {
        console.error("Error publishing project:", error);
        addToast("Error publishing project. Please try again.", "error");
      }
    },
    [projects, projectTitle, addToast, clearPortfolioStorage, router]
  );

  // Handle save draft
  const handleSaveDraft = useCallback(
    (data: ProjectFormData) => {
      console.log("Saving draft:", data);

      // Ensure cover image is set to first image if not manually selected
      const finalData = {
        ...data,
        coverImage:
          data.coverImage ||
          projects.find((p) => p.content.type === "image")?.content.data ||
          "",
      };

      setProjectData(finalData);
      addToast("Draft saved successfully!", "success");
      setOpen(false);
    },
    [setProjectData, addToast, projects]
  );

  // Handle click outside for text editor
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (
        addingText &&
        editorRef.current &&
        !editorRef.current.contains(target) &&
        !target.closest("[data-tippy-root]") &&
        !target.closest(".ProseMirror") &&
        !target.closest('[role="dialog"]') &&
        !target.closest('[role="menu"]') &&
        !target.closest('[role="listbox"]') &&
        !target.closest(".dropdown-menu") &&
        !target.closest("[data-radix-collection-item]") &&
        !target.closest("[data-radix-popper-content-wrapper]") &&
        !target.closest('[data-state="open"]') &&
        !target.closest('button[role="combobox"]') &&
        !target.closest('div[role="combobox"]') &&
        !target.closest(".lucide") &&
        !target.closest("svg") &&
        !target.closest("[data-editor-toolbar]") &&
        !target.hasAttribute("data-state") &&
        !target.parentElement?.hasAttribute("data-state") &&
        !target.closest('[class*="editor"]') &&
        !target.closest('[class*="toolbar"]') &&
        !target.closest('[class*="dropdown"]') &&
        !target.closest('[class*="select"]') &&
        !target.closest('[class*="toggle"]')
      ) {
        handleAddText();
      }
    };

    const handleMouseDown = (event: MouseEvent) => {
      setTimeout(() => {
        handleClickOutside(event);
      }, 150);
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [addingText, textContent]);

  // Media upload handlers
  const handleImageSelected = async (file: File) => {
    try {
      const projectId = await handleImageUpload(
        file,
        undefined,
        insertPosition !== null ? insertPosition : undefined
      );

      // Scroll to the newly added item after a short delay
      setTimeout(() => {
        scrollToProjectItem(projectId, { delay: 300 });
      }, 500);

      setInsertPosition(null);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleVideoSelected = async (file: File) => {
    try {
      const projectId = await handleVideoUpload(
        file,
        undefined,
        insertPosition !== null ? insertPosition : undefined
      );

      setTimeout(() => {
        scrollToProjectItem(projectId, { delay: 300 });
      }, 500);

      setInsertPosition(null);
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  const handleAudioSelected = async (file: File) => {
    try {
      const projectId = await handleAudioUpload(
        file,
        undefined,
        insertPosition !== null ? insertPosition : undefined
      );

      setTimeout(() => {
        scrollToProjectItem(projectId, { delay: 300 });
      }, 500);

      setInsertPosition(null);
    } catch (error) {
      console.error("Error uploading audio:", error);
    }
  };

  const handleReplaceImage = useCallback(
    async (file: File, projectId: string) => {
      try {
        await handleImageUpload(file, projectId);
        scrollToProjectItem(projectId, { delay: 300 });
      } catch (error) {
        console.error("Error replacing image:", error);
      }
    },
    [handleImageUpload, scrollToProjectItem]
  );

  const handleReplaceVideo = useCallback(
    async (file: File, projectId: string) => {
      try {
        await handleVideoUpload(file, projectId);
        scrollToProjectItem(projectId, { delay: 300 });
      } catch (error) {
        console.error("Error replacing video:", error);
      }
    },
    [handleVideoUpload, scrollToProjectItem]
  );

  const handleReplaceAudio = useCallback(
    async (file: File, projectId: string) => {
      try {
        await handleAudioUpload(file, projectId);
        scrollToProjectItem(projectId, { delay: 300 });
      } catch (error) {
        console.error("Error replacing audio:", error);
      }
    },
    [handleAudioUpload, scrollToProjectItem]
  );

  const handleAddText = () => {
    const cleanContent = textContent.replace(/<p><\/p>/g, "").trim();
    if (cleanContent && cleanContent !== "<p></p>") {
      if (editingTextId) {
        updateProject(editingTextId, {
          type: "text",
          data: textContent,
          title: "Text Block",
        });
        // Scroll to the edited item
        scrollToProjectItem(editingTextId, { delay: 200 });
      } else {
        const content: ProjectContent = {
          type: "text",
          data: textContent,
          title: "Text Block",
        };

        if (insertPosition !== null) {
          const newProjectId = addProjectAtPosition(content, insertPosition);
          // Scroll to the newly added item
          if (newProjectId) {
            setTimeout(() => {
              scrollToProjectItem(newProjectId, { delay: 200 });
            }, 100);
          }
        } else {
          const newProjectId = addProject(content);
          // Only scroll if we have a valid project ID
          if (newProjectId) {
            setTimeout(() => {
              scrollToProjectItem(newProjectId, { delay: 200 });
            }, 100);
          }
        }
        setInsertPosition(null);
      }
      setTextContent("");
    }

    // Always reset the text editor state, regardless of content
    setAddingText(false);
    setEditingTextId(null);
  };

  const handleSaveReorder = (newProjects: ProjectItem[]) => {
    setProjects(newProjects);
  };

  const getUploadProgress = (contentType: string) => {
    return contentType === "image"
      ? imageUploadProgress
      : contentType === "video"
      ? videoUploadProgress
      : audioUploadProgress;
  };

  const projectImages = projects
    ?.filter((p) => p.content?.type === "image" && p.content.data)
    .map((p) => p.content.data as string);

  // Replace the existing handleUploadCover function in PortfolioBuilder component

  const handleUploadCover = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Create a temporary preview for immediate display
      const reader = new FileReader();
      reader.onload = () => {
        const previewUrl = reader.result as string;

        // Set temporary preview
        setProjectData((prev) => ({
          ...prev,
          coverImage: previewUrl,
        }));
      };
      reader.readAsDataURL(file);

      // Use the actual upload mutation
      uploadImage(
        { file },
        {
          onSuccess: (res: any) => {
            const uploadedUrl = res?.data?.url;

            // Update with the actual uploaded URL
            setProjectData((prev) => ({
              ...prev,
              coverImage: uploadedUrl,
            }));

            addToast("Cover photo uploaded successfully!", "success");
            resolve(uploadedUrl);
          },
          onError: (error: any) => {
            // Revert to previous cover image on error
            setProjectData((prev) => ({
              ...prev,
              coverImage: projectData.coverImage, // Revert to previous
            }));

            const errorMessage =
              error?.response?.data?.message ||
              error?.message ||
              "Cover photo upload failed";
            addToast(errorMessage, "error");
            reject(new Error(errorMessage));
          },
        }
      );
    });
  };

  useEffect(() => {
    if (!addingText && !editingTextId && textContent === "") {
      if (insertPosition !== null) {
        // Scroll to the text editor position that was just added
        scrollToNewContent(`text-editor-${insertPosition}`, { delay: 300 });
      } else if (projects.length > 0) {
        // Scroll to the last item if added at the end
        scrollToProjectItem(projects[projects.length - 1].id, { delay: 300 });
      }
    }
  }, [
    addingText,
    editingTextId,
    insertPosition,
    projects,
    scrollToNewContent,
    scrollToProjectItem,
    textContent,
  ]);

  useEffect(() => {
    if (uploadingProjects.size > 0) {
      const lastUploaded = Array.from(uploadingProjects).pop();
      if (lastUploaded) {
        const project = projects.find((p) => p.id === lastUploaded);
        if (project) {
          scrollToProjectItem(project.id, { delay: 500 });
        }
      }
    }
  }, [uploadingProjects, projects, scrollToProjectItem]);

  useEffect(() => {
    if (editingTextId) {
      scrollToProjectItem(editingTextId, { delay: 100 });
    }
  }, [editingTextId, scrollToProjectItem]);

  if (isLoadingDetails) {
    <LoadingOverlay />;
  }
  return (
    <div className="flex h-screen">
      <ProjectSidebar>
        <AddContentPanel
          handleImageSelected={handleImageSelected}
          setAddingText={(adding) => {
            if (adding) {
              setTextContent("");
              setInsertPosition(null);
            }
            setAddingText(adding);
          }}
          handleVideoSelected={handleVideoSelected}
          handleAudioSelected={handleAudioSelected}
          setTextContent={setTextContent}
        />
      </ProjectSidebar>
      <div className="flex-1 flex flex-col min-w-0 relative overflow-auto">
        <Header />
        <main
          className={cn(
            "flex-1 pb-6 max-w-[1377px] relative w-full pt-24",
            "pt-5 " // Removed -z-10
          )}
        >
          {projects.length === 0 ? (
            <div className="h-full">
              <button className="flex items-center gap-2  ml-8">
                <IoMdArrowBack />{" "}
                <span className="text-sm font-medium">Back</span>
              </button>
              <div className="grid place-items-center pt-[120px]">
                <Image
                  src="/assets/empty.png"
                  alt="empty state"
                  width={500}
                  height={500}
                />
                <div className="text-center">
                  <h3 className="font-medium">Nothing to Display</h3>
                  <p className="text-sm text-[#656565]">Add content</p>
                </div>
              </div>
            </div>
          ) : (
            <section className="grid mt-4  gap-8 mx-auto px-4">
              <div className="">
                {/* Auto-save indicator */}
                {!isEditMode && hasUnsavedChanges && lastSaved && (
                  <div className="mb-1 text-sm text-gray-500">
                    Last saved: {lastSaved.toLocaleTimeString()}
                  </div>
                )}

                <PortfolioHeader
                  projectTitle={projectTitle}
                  setProjectTitle={setProjectTitle}
                  setIsDrawerOpen={setIsDrawerOpen}
                  onPreview={handlePreview}
                  setOpen={setOpen}
                  hasUnsavedChanges={hasUnsavedChanges}
                  onClearStorage={clearPortfolioStorage}
                />

                <ProjectsList
                  projects={projects}
                  moveProject={moveProject}
                  updateProject={updateProject}
                  removeProject={removeProject}
                  setShowRearrangeModal={setShowRearrangeModal}
                  textContent={textContent}
                  setTextContent={setTextContent}
                  addingText={addingText}
                  setAddingText={setAddingText}
                  editingTextId={editingTextId}
                  setEditingTextId={setEditingTextId}
                  insertPosition={insertPosition}
                  setInsertPosition={setInsertPosition}
                  deletingProjects={deletingProjects}
                  uploadingProjects={uploadingProjects}
                  imageUploadProgress={imageUploadProgress}
                  videoUploadProgress={videoUploadProgress}
                  getUploadProgress={getUploadProgress}
                  onImageSelected={handleImageSelected}
                  onVideoSelected={handleVideoSelected}
                  onAudioSelected={handleAudioSelected}
                  onReplaceImage={handleReplaceImage}
                  onReplaceVideo={handleReplaceVideo}
                  onReplaceAudio={handleReplaceAudio}
                  onAddText={handleAddText}
                  editorRef={editorRef as React.RefObject<HTMLDivElement>}
                />
              </div>

              <ReorderModal
                isOpen={showRearrangeModal}
                onClose={() => setShowRearrangeModal(false)}
                projects={projects}
                onSave={handleSaveReorder}
              />

              <AddContentDrawer
                isOpen={isDrawerOpen}
                onClose={() => {
                  setIsDrawerOpen(false);
                  setInsertPosition(null);
                }}
                setAddingText={(adding) => {
                  if (adding) {
                    setTextContent("");
                  }
                  setAddingText(adding);
                }}
                handleImageSelected={handleImageSelected}
                handleVideoSelected={handleVideoSelected}
                setTextContent={setTextContent}
                onAudioAdd={() => console.log("Audio clicked")}
                onEmbedAdd={() => console.log("Embed clicked")}
                onSocialLinksAdd={() => console.log("Social links clicked")}
              />

              <PublishProjectModal
                open={open}
                onClose={() => setOpen(false)}
                defaultValues={{
                  ...projectData,
                  coverImage:
                    projectData.coverImage ||
                    projects?.find((p) => p?.content?.type === "image")?.content
                      .data ||
                    "",
                }}
                onPublish={handlePublish}
                onSaveDraft={handleSaveDraft}
                setShowCoverModal={setShowCoverModal}
                onFormChange={handleFormChange}
              />

              <CoverPhotoModal
                open={showCoverModal}
                setOpen={setOpen}
                onClose={() => setShowCoverModal(false)}
                images={projectImages}
                currentCover={
                  projectData.coverImage ||
                  projects?.find((p) => p?.content?.type === "image")?.content
                    .data ||
                  ""
                }
                onSelect={(imageUrl) => {
                  setProjectData((prev) => ({ ...prev, coverImage: imageUrl }));
                }}
                onUpload={handleUploadCover}
                uploadProgress={imageUploadProgress}
                isUploading={false}
              />
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default PortfolioBuilder;
