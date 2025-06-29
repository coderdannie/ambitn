// hooks/useProjectOperations.ts - Updated with optimistic updates
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProjectItem, ProjectContent } from '@/types/portfolio';

interface UseProjectOperationsProps {
  projects: ProjectItem[];
  setProjects: React.Dispatch<React.SetStateAction<ProjectItem[]>>;
  setUploadingProjects: React.Dispatch<React.SetStateAction<Set<string>>>;
  setDeletingProjects: React.Dispatch<React.SetStateAction<Set<string>>>;
  deleteUploadedImage: any;
  deleteUploadedVideo: any;
  deleteUploadedAudio: any;
  addToast: (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info'
  ) => void;
}

export const useProjectOperations = ({
  projects,
  setProjects,
  setUploadingProjects,
  setDeletingProjects,
  deleteUploadedImage,
  deleteUploadedVideo,
  deleteUploadedAudio,
  addToast,
}: UseProjectOperationsProps) => {
  const moveProject = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      setProjects((prevProjects) => {
        const newProjects = [...prevProjects];
        const [removed] = newProjects.splice(dragIndex, 1);
        newProjects.splice(hoverIndex, 0, removed);
        return newProjects;
      });
    },
    [setProjects]
  );

  const updateProject = useCallback(
    (id: string, newContent: ProjectContent) => {
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === id ? { ...project, content: newContent } : project
        )
      );
    },
    [setProjects]
  );

  const cleanupProjectStates = useCallback(
    (id: string) => {
      setUploadingProjects((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      setDeletingProjects((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    },
    [setUploadingProjects, setDeletingProjects]
  );

  const removeProject = useCallback(
    (id: string) => {
      const projectToRemove = projects.find((project) => project.id === id);

      if (!projectToRemove) {
        addToast('Project not found', 'error');
        return;
      }

      const needsApiDeletion =
        projectToRemove.content.publicUrl &&
        (projectToRemove.content.type === 'image' ||
          projectToRemove.content.type === 'video' ||
          projectToRemove.content.type === 'audio');

      // Store the current state for potential rollback
      const previousProjects = [...projects];
      const projectIndex = projects.findIndex((p) => p.id === id);

      // OPTIMISTIC UPDATE: Remove project immediately from UI
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== id)
      );

      if (needsApiDeletion) {
        setDeletingProjects((prev) => new Set(prev).add(id));
        const publicId = projectToRemove.content.publicUrl || '';
        const deleteFunction =
          projectToRemove.content.type === 'image'
            ? deleteUploadedImage
            : projectToRemove.content.type === 'video'
            ? deleteUploadedVideo
            : deleteUploadedAudio;

        deleteFunction(
          { publicId },
          {
            onSuccess: () => {
              // API deletion successful - optimistic update was correct
              cleanupProjectStates(id);
            },
            onError: (error: any) => {
              // API deletion failed - rollback the optimistic update
              setProjects(previousProjects);
              addToast(
                `Failed to delete ${projectToRemove.content.type}`,
                'error'
              );
              setDeletingProjects((prev) => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
              });
            },
          }
        );
      } else {
        // No API call needed, just cleanup
        cleanupProjectStates(id);
        addToast('Project deleted successfully', 'success');
      }
    },
    [
      projects,
      deleteUploadedImage,
      deleteUploadedVideo,
      deleteUploadedAudio,
      addToast,
      cleanupProjectStates,
      setDeletingProjects,
      setProjects,
    ]
  );

  const addProject = useCallback(
    (content: ProjectContent): string => {
      const newProjectId = uuidv4();
      const newProject = { id: newProjectId, content };

      setProjects((prevProjects) => [...prevProjects, newProject]);

      return newProjectId;
    },
    [setProjects]
  );

  const addProjectAtPosition = useCallback(
    (content: ProjectContent, position: number): string => {
      const newProjectId = uuidv4();
      const newProject = { id: newProjectId, content };

      setProjects((prevProjects) => {
        const newProjects = [...prevProjects];
        newProjects.splice(position, 0, newProject);
        return newProjects;
      });

      return newProjectId;
    },
    [setProjects]
  );

  return {
    moveProject,
    updateProject,
    removeProject,
    addProject,
    addProjectAtPosition,
  };
};
