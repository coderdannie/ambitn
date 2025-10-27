// components/modules/PortfolioBuilder/hooks/usePortfolioState.ts

import { useState, useRef, useEffect, useCallback } from "react";
import { ContentType, ProjectItem } from "@/types/portfolio";
import { useToast } from "@/context/ToastContext";
import { useGlobalContext } from "@/context/appContext";
import {
  useDeleteUploadedAudio,
  useDeleteUploadedImage,
  useDeleteUploadedVideo,
  useGetUserProjectDetails,
  useUploadAudio,
  useUploadImage,
  useUploadVideo,
} from "@/service/query/portfolio.service";
import { STORAGE_KEYS } from "@/components/common/constants";
import { clearStorage, loadFromStorage, saveToStorage } from "@/utils/helper";
import { ProjectFormData } from "@/utils/validation";
// IMPORTANT: useSearchParams is still imported here
import { useSearchParams } from "next/navigation";
import {
  transformAICaseStudyToProjects,
  isAICaseStudyEdit,
} from "@/utils/aiCaseStudyTransformer";

// Helper function to transform API content to ProjectItem format (keep this)
const transformContentToProjectItems = (contents: any[]): ProjectItem[] => {
  return contents
    .map((content) => {
      const projectItem: ProjectItem = {
        id: content._id,
        content: {
          type: content.type.toLowerCase() as ContentType,
          id: content._id,
        },
      };

      switch (content.type) {
        case "TEXT":
          projectItem.content = {
            ...projectItem.content,
            data: content.text.body || "",
          };
          break;
        case "IMAGE":
          projectItem.content = {
            ...projectItem.content,
            data: content.image.url,
            altText: content.image.alt || "",
            caption: content.image.caption || "",
            tags: content.image.tags || "",
          };
          break;
        case "VIDEO":
          projectItem.content = {
            ...projectItem.content,
            data: content.video.url,
            caption: content.video.caption || "",
            tags: content.video.tags,
            altText: content.video.alt || "",
          };
          break;
        case "AUDIO":
          projectItem.content = {
            ...projectItem.content,
            publicUrl: content.audio.url,
            title: content.audio.title || "",
            caption: content.audio.caption || "",
            tags: content.audio.tags,
            altText: content.audio.alt || "",
          };
          break;
        default:
          return null;
      }

      return projectItem;
    })
    .filter(Boolean) as ProjectItem[];
};

// --- NEW HOOK: ISOLATES useSearchParams() CALL ---
export const useURLParams = () => {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project_id");
  const isAIEdit = isAICaseStudyEdit(searchParams);

  // Get AI case study data from global context
  const { previewData: contextPreviewData } = useGlobalContext();

  const previewData =
    contextPreviewData ||
    (() => {
      if (typeof window !== "undefined" && isAIEdit) {
        try {
          const stored = localStorage.getItem("ai_case_study_preview");
          return stored ? JSON.parse(stored) : null;
        } catch (error) {
          console.error("Error loading preview from localStorage:", error);
          return null;
        }
      }
      return null;
    })();

  return { projectId, isAIEdit, previewData };
};
// ----------------------------------------------------

// --- MODIFIED HOOK: ACCEPTS PARAMS AS ARGUMENTS ---
export const usePortfolioState = (params: {
  projectId: string | null;
  isAIEdit: boolean;
  previewData: any;
}) => {
  const { projectId, isAIEdit, previewData } = params;

  const isEditMode = Boolean(projectId);

  // NOTE: The console logs below are necessary to keep the logic consistent with the original
  console.log("isAiEdit", isAIEdit);
  console.log("previewData", previewData);

  // Track if this is initial load to avoid premature lastSaved
  const isInitialLoad = useRef(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Initialize states based on edit mode
  const [projects, setProjects] = useState<ProjectItem[]>(() =>
    isEditMode || isAIEdit ? [] : loadFromStorage(STORAGE_KEYS.PROJECTS, [])
  );

  const [textContent, setTextContent] = useState<string>(() =>
    isEditMode || isAIEdit ? "" : loadFromStorage(STORAGE_KEYS.TEXT_CONTENT, "")
  );

  const [addingText, setAddingText] = useState<boolean>(() =>
    isEditMode || isAIEdit
      ? false
      : loadFromStorage(STORAGE_KEYS.ADDING_TEXT, false)
  );

  const [editingTextId, setEditingTextId] = useState<string | null>(() =>
    isEditMode || isAIEdit
      ? null
      : loadFromStorage(STORAGE_KEYS.EDITING_TEXT_ID, null)
  );

  const [showRearrangeModal, setShowRearrangeModal] = useState(false);

  const [projectTitle, setProjectTitle] = useState<string>(() =>
    isEditMode || isAIEdit
      ? ""
      : loadFromStorage(STORAGE_KEYS.PROJECT_TITLE, "")
  );

  const [insertPosition, setInsertPosition] = useState<number | null>(() =>
    isEditMode || isAIEdit
      ? null
      : loadFromStorage(STORAGE_KEYS.INSERT_POSITION, null)
  );

  const [uploadingProjects, setUploadingProjects] = useState<Set<string>>(
    new Set()
  );
  const [deletingProjects, setDeletingProjects] = useState<Set<string>>(
    new Set()
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [projectData, setProjectData] = useState<ProjectFormData>(() =>
    isEditMode || isAIEdit
      ? {
          title: "",
          description: "",
          tags: [],
          categories: [],
          coverImage: "",
          needsFeedback: false,
        }
      : loadFromStorage(STORAGE_KEYS.PROJECT_DATA, {
          title: "",
          description: "",
          tags: [],
          categories: [],
          coverImage: "",
          needsFeedback: false,
        })
  );

  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const editorRef = useRef<HTMLDivElement | null>(null);
  const { addToast } = useToast();

  // Upload mutations
  const { mutate: uploadImage, uploadProgress: imageUploadProgress } =
    useUploadImage();
  const { mutate: uploadVideo, uploadProgress: videoUploadProgress } =
    useUploadVideo();
  const { mutate: uploadAudio, uploadProgress: audioUploadProgress } =
    useUploadAudio();
  const { mutate: deleteUploadedImage } = useDeleteUploadedImage();
  const { mutate: deleteUploadedVideo } = useDeleteUploadedVideo();
  const { mutate: deleteUploadedAudio } = useDeleteUploadedAudio();

  const { data, isPending: isLoadingDetails } = useGetUserProjectDetails(
    projectId as string
  );

  // Effect to populate state from AI case study data (REMOVED redundant hook)
  useEffect(() => {
    if (isAIEdit && previewData && !isDataLoaded) {
      try {
        console.log("Loading AI case study data:", previewData);

        // Transform AI case study data to projects
        const { projects: transformedProjects, title } =
          transformAICaseStudyToProjects(
            previewData.content?.data || previewData.content
          );

        console.log("Transformed projects:", transformedProjects);

        // Set the transformed projects
        setProjects(transformedProjects);
        setProjectTitle(title);

        // Set project data with defaults
        setProjectData({
          title,
          description: previewData.content?.data?.projectOverview || "",
          tags: [],
          categories: [],
          coverImage:
            previewData.content?.data?.imageUrls?.[0]?.url ||
            (transformedProjects.find((p) => p.content.type === "image")
              ?.content.data as string) ||
            "",
          needsFeedback: false,
        });

        // Mark data as loaded
        setIsDataLoaded(true);
        addToast("AI case study loaded for editing", "success");
      } catch (error) {
        console.error("Error loading AI case study:", error);
        addToast("Error loading case study data", "error");
      }
    }
  }, [isAIEdit, previewData, isDataLoaded, addToast]);

  // Effect to populate state from API data in regular edit mode
  useEffect(() => {
    if (isEditMode && !isAIEdit && data && !isDataLoaded) {
      const transformedProjects = transformContentToProjectItems(
        data.contents || []
      );

      setProjectData({
        title: data.title || "",
        description: data.description || "",
        tags: data.tags || [],
        categories: [],
        coverImage: data.coverImage?.url || "",
        needsFeedback: data.needFeedBacks || false,
      });

      setProjects(transformedProjects);
      setProjectTitle(data.title || "");
      setIsDataLoaded(true);
    }
  }, [data, isEditMode, isAIEdit, isDataLoaded]);

  // localStorage auto-save effect
  useEffect(() => {
    // Skip for edit mode or AI edit mode, or if data hasn't been loaded yet
    if ((isEditMode || isAIEdit) && !isDataLoaded) return;

    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    const hasContent =
      projects.length > 0 ||
      projectData.title.trim() !== "" ||
      projectData.description.trim() !== "" ||
      projectTitle.trim() !== "" ||
      textContent.trim() !== "" ||
      addingText ||
      editingTextId !== null ||
      insertPosition !== null;

    // Only save to localStorage in create mode
    if (!isEditMode && !isAIEdit) {
      // NOTE: Changed from (isAIEdit) to (!isAIEdit) if you want to save during AI edit
      saveToStorage(STORAGE_KEYS.PROJECTS, projects);
      saveToStorage(STORAGE_KEYS.PROJECT_DATA, projectData);
      saveToStorage(STORAGE_KEYS.PROJECT_TITLE, projectTitle);
      saveToStorage(STORAGE_KEYS.TEXT_CONTENT, textContent);
      saveToStorage(STORAGE_KEYS.ADDING_TEXT, addingText);
      saveToStorage(STORAGE_KEYS.EDITING_TEXT_ID, editingTextId);
      saveToStorage(STORAGE_KEYS.INSERT_POSITION, insertPosition);
    }

    if (hasContent) {
      setLastSaved(new Date());
    }
  }, [
    projects,
    projectData,
    projectTitle,
    textContent,
    addingText,
    editingTextId,
    insertPosition,
    isEditMode,
    isAIEdit,
    isDataLoaded,
  ]);

  const clearPortfolioStorage = useCallback(() => {
    if (!isEditMode && !isAIEdit) {
      clearStorage();
    }

    setProjects([]);
    setProjectData({
      title: "",
      description: "",
      tags: [],
      categories: [],
      coverImage: "",
      needsFeedback: false,
    });
    setProjectTitle("");
    setTextContent("");
    setAddingText(false);
    setEditingTextId(null);
    setInsertPosition(null);
    setLastSaved(null);
    setIsDataLoaded(false);
  }, [isEditMode, isAIEdit]);

  return {
    // State
    projects,
    setProjects,
    projectData,
    setProjectData,
    projectTitle,
    setProjectTitle,
    textContent,
    setTextContent,
    addingText,
    setAddingText,
    editingTextId,
    setEditingTextId,
    insertPosition,
    setInsertPosition,
    showRearrangeModal,
    setShowRearrangeModal,
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
    showPreview,
    setShowPreview,
    imageUploadProgress,
    videoUploadProgress,
    audioUploadProgress,
    editorRef,

    // Functions
    uploadImage,
    uploadVideo,
    uploadAudio,
    deleteUploadedImage,
    deleteUploadedVideo,
    deleteUploadedAudio,
    addToast,
    clearPortfolioStorage,
    isLoadingDetails,

    // Edit mode specific
    isEditMode: isEditMode || isAIEdit,
    isDataLoaded,
    isAIEdit,

    // Auto-save info
    lastSaved,
  };
};
