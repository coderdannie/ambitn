import { useState, useRef, useEffect, useCallback } from 'react';
import { ContentType, ProjectItem } from '@/types/portfolio';
import { useToast } from '@/context/ToastContext';

import {
  useDeleteUploadedAudio,
  useDeleteUploadedImage,
  useDeleteUploadedVideo,
  useGetUserProjectDetails,
  useUploadAudio,
  useUploadImage,
  useUploadVideo,
} from '@/service/query/portfolio.service';
import { STORAGE_KEYS } from '@/components/common/constants';
import { clearStorage, loadFromStorage, saveToStorage } from '@/utils/helper';
import { ProjectFormData } from '@/utils/validation';
import { useSearchParams } from 'next/navigation';

// Helper function to transform API content to ProjectItem format
const transformContentToProjectItems = (contents: any[]): ProjectItem[] => {
  return contents
    .map((content) => {
      const projectItem: ProjectItem = {
        id: content._id,
        content: {
          type: content.type.toLowerCase() as ContentType, // Convert 'TEXT' to 'text', etc.
          id: content._id,
        },
      };

      switch (content.type) {
        case 'TEXT':
          projectItem.content = {
            ...projectItem.content,
            data: content.text.body || '',
          };
          break;
        case 'IMAGE':
          projectItem.content = {
            ...projectItem.content,
            data: content.image.url,
            altText: content.image.alt || '',
            caption: content.image.caption || '',
            tags: content.image.tags || '',
          };
          break;
        case 'VIDEO':
          projectItem.content = {
            ...projectItem.content,
            data: content.video.url,
            caption: content.video.caption || '',
            tags: content.video.tags,
            altText: content.video.alt || '',
            // If you have thumbnail in your ProjectContent interface, add it here
            // thumbnail: content.video.thumbnail || '',
          };
          break;
        case 'AUDIO':
          projectItem.content = {
            ...projectItem.content,
            publicUrl: content.audio.url,
            title: content.audio.title || '',
            caption: content.audio.caption || '',
            tags: content.audio.tags,
            altText: content.audio.alt || '',
            // If you have duration in your ProjectContent interface, add it here
            // duration: content.audio.duration || 0,
          };
          break;
        default:
          return null;
      }

      return projectItem;
    })
    .filter(Boolean) as ProjectItem[];
};

export const usePortfolioState = () => {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project_id');
  const isEditMode = Boolean(projectId);

  // Track if this is initial load to avoid premature lastSaved
  const isInitialLoad = useRef(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Initialize states based on edit mode
  const [projects, setProjects] = useState<ProjectItem[]>(() =>
    isEditMode ? [] : loadFromStorage(STORAGE_KEYS.PROJECTS, [])
  );

  console.log(projects);

  const [textContent, setTextContent] = useState<string>(() =>
    isEditMode ? '' : loadFromStorage(STORAGE_KEYS.TEXT_CONTENT, '')
  );

  const [addingText, setAddingText] = useState<boolean>(() =>
    isEditMode ? false : loadFromStorage(STORAGE_KEYS.ADDING_TEXT, false)
  );

  const [editingTextId, setEditingTextId] = useState<string | null>(() =>
    isEditMode ? null : loadFromStorage(STORAGE_KEYS.EDITING_TEXT_ID, null)
  );

  const [showRearrangeModal, setShowRearrangeModal] = useState(false);

  const [projectTitle, setProjectTitle] = useState<string>(() =>
    isEditMode ? '' : loadFromStorage(STORAGE_KEYS.PROJECT_TITLE, '')
  );

  const [insertPosition, setInsertPosition] = useState<number | null>(() =>
    isEditMode ? null : loadFromStorage(STORAGE_KEYS.INSERT_POSITION, null)
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
    isEditMode
      ? {
          title: '',
          description: '',
          tags: [],
          categories: [],
          coverImage: '',
          needsFeedback: false,
        }
      : loadFromStorage(STORAGE_KEYS.PROJECT_DATA, {
          title: '',
          description: '',
          tags: [],
          categories: [],
          coverImage: '',
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
  console.log('data', data);
  // Effect to populate state from API data in edit mode
  useEffect(() => {
    if (isEditMode && data && !isDataLoaded) {
      // Transform API data to match your state structure
      const transformedProjects = transformContentToProjectItems(
        data.contents || []
      );

      // Set project data
      setProjectData({
        title: data.title || '',
        description: data.description || '',
        tags: data.tags || [],
        categories: [], // Assuming categories aren't in the API response
        coverImage: data.coverImage?.url || '',
        needsFeedback: data.needFeedBacks || false,
      });

      // Set projects (content items)
      setProjects(transformedProjects);

      // Set project title (assuming it's the same as the main title)
      setProjectTitle(data.title || '');

      // Mark data as loaded to prevent re-initialization
      setIsDataLoaded(true);
    }
  }, [data, isEditMode, isDataLoaded, addToast]);

  // localStorage auto-save effect (only for non-edit mode)
  useEffect(() => {
    // Skip for edit mode or if data hasn't been loaded yet in edit mode
    if (isEditMode && !isDataLoaded) return;

    // Skip saving and lastSaved update on initial load
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    // Check if there's meaningful content to save
    const hasContent =
      projects.length > 0 ||
      projectData.title.trim() !== '' ||
      projectData.description.trim() !== '' ||
      projectTitle.trim() !== '' ||
      textContent.trim() !== '' ||
      addingText ||
      editingTextId !== null ||
      insertPosition !== null;

    // Only save to localStorage in create mode (not edit mode)
    if (!isEditMode) {
      saveToStorage(STORAGE_KEYS.PROJECTS, projects);
      saveToStorage(STORAGE_KEYS.PROJECT_DATA, projectData);
      saveToStorage(STORAGE_KEYS.PROJECT_TITLE, projectTitle);
      saveToStorage(STORAGE_KEYS.TEXT_CONTENT, textContent);
      saveToStorage(STORAGE_KEYS.ADDING_TEXT, addingText);
      saveToStorage(STORAGE_KEYS.EDITING_TEXT_ID, editingTextId);
      saveToStorage(STORAGE_KEYS.INSERT_POSITION, insertPosition);
    }

    // Update lastSaved if there's actual content (for both modes)
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
    isDataLoaded,
  ]);

  // Clear storage when project is published or user explicitly wants to start fresh
  const clearPortfolioStorage = useCallback(() => {
    if (!isEditMode) {
      clearStorage();
    }

    // Reset state to initial values
    setProjects([]);
    setProjectData({
      title: '',
      description: '',
      tags: [],
      categories: [],
      coverImage: '',
      needsFeedback: false,
    });
    setProjectTitle('');
    setTextContent('');
    setAddingText(false);
    setEditingTextId(null);
    setInsertPosition(null);
    setLastSaved(null);
    setIsDataLoaded(false);
  }, [isEditMode]);

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
    isEditMode,
    isDataLoaded,

    // Auto-save info
    lastSaved,
  };
};
