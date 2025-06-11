import { useState, useRef, useEffect, useCallback } from 'react';
import { ProjectItem } from '@/types/portfolio';
import { useToast } from '@/context/ToastContext';

import {
  useDeleteUploadedAudio,
  useDeleteUploadedImage,
  useDeleteUploadedVideo,
  useUploadAudio,
  useUploadImage,
  useUploadVideo,
} from '@/service/query/portfolio.service';
import { STORAGE_KEYS } from '@/components/common/constants';
import { clearStorage, loadFromStorage, saveToStorage } from '@/utils/helper';
import { ProjectFormData } from '@/utils/validation';

export const usePortfolioState = () => {
  const [projects, setProjects] = useState<ProjectItem[]>(() =>
    loadFromStorage(STORAGE_KEYS.PROJECTS, [])
  );

  const [textContent, setTextContent] = useState<string>(() =>
    loadFromStorage(STORAGE_KEYS.TEXT_CONTENT, '')
  );

  const [addingText, setAddingText] = useState<boolean>(() =>
    loadFromStorage(STORAGE_KEYS.ADDING_TEXT, false)
  );

  const [editingTextId, setEditingTextId] = useState<string | null>(() =>
    loadFromStorage(STORAGE_KEYS.EDITING_TEXT_ID, null)
  );

  const [showRearrangeModal, setShowRearrangeModal] = useState(false);
  const [projectTitle, setProjectTitle] = useState<string>(() =>
    loadFromStorage(STORAGE_KEYS.PROJECT_TITLE, '')
  );

  const [insertPosition, setInsertPosition] = useState<number | null>(() =>
    loadFromStorage(STORAGE_KEYS.INSERT_POSITION, null)
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
    loadFromStorage(STORAGE_KEYS.PROJECT_DATA, {
      title: '',
      description: '',
      tags: [],
      categories: [],
      coverImage: '',
      needsFeedback: false,
    })
  );

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
  // Save to localStorage whenever state changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PROJECTS, projects);
  }, [projects]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PROJECT_DATA, projectData);
  }, [projectData]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PROJECT_TITLE, projectTitle);
  }, [projectTitle]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TEXT_CONTENT, textContent);
  }, [textContent]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ADDING_TEXT, addingText);
  }, [addingText]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.EDITING_TEXT_ID, editingTextId);
  }, [editingTextId]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.INSERT_POSITION, insertPosition);
  }, [insertPosition]);

  // Clear storage when project is published or user explicitly wants to start fresh
  const clearPortfolioStorage = useCallback(() => {
    clearStorage();
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
  }, []);

  // Auto-save indicator
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    setLastSaved(new Date());
  }, [projects, projectData, projectTitle, textContent]);

  // Enhanced setters that also update localStorage
  const setProjectsWithStorage = useCallback(
    (newProjects: ProjectItem[] | ((prev: ProjectItem[]) => ProjectItem[])) => {
      setProjects((prev) => {
        const updated =
          typeof newProjects === 'function' ? newProjects(prev) : newProjects;
        saveToStorage(STORAGE_KEYS.PROJECTS, updated);
        return updated;
      });
    },
    []
  );

  const setProjectDataWithStorage = useCallback(
    (
      newData: ProjectFormData | ((prev: ProjectFormData) => ProjectFormData)
    ) => {
      setProjectData((prev) => {
        const updated = typeof newData === 'function' ? newData(prev) : newData;
        saveToStorage(STORAGE_KEYS.PROJECT_DATA, updated);
        return updated;
      });
    },
    []
  );

  const setProjectTitleWithStorage = useCallback((newTitle: string) => {
    setProjectTitle(newTitle);
    saveToStorage(STORAGE_KEYS.PROJECT_TITLE, newTitle);
  }, []);

  return {
    // State
    projects,
    setProjects: setProjectsWithStorage,
    projectData,
    setProjectData: setProjectDataWithStorage,
    projectTitle,
    setProjectTitle: setProjectTitleWithStorage,
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

    // Auto-save info
    lastSaved,
  };
};
