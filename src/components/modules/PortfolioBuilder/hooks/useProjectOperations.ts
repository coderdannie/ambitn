// hooks/useProjectOperations.ts
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
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== id)
      );
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
    [setProjects, setUploadingProjects, setDeletingProjects]
  );

  const removeProject = useCallback(
    (id: string) => {
      const projectToRemove = projects.find((project) => project.id === id);
      const needsApiDeletion =
        projectToRemove?.content.publicUrl &&
        (projectToRemove.content.type === 'image' ||
          projectToRemove.content.type === 'video' ||
          projectToRemove.content.type === 'audio');

      if (needsApiDeletion) {
        setDeletingProjects((prev) => new Set(prev).add(id));
        const publicId = projectToRemove?.content?.publicUrl || '';
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
              // addToast(
              //   `${projectToRemove.content.type} deleted successfully`,
              //   'success'
              // );
              cleanupProjectStates(id);
            },
            onError: (error: any) => {
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
        cleanupProjectStates(id);
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
    ]
  );

  const addProject = useCallback(
    (content: ProjectContent): string => {
      const newProjectId = uuidv4();
      const newProject = { id: newProjectId, content };

      setProjects((prevProjects) => [...prevProjects, newProject]);

      return newProjectId; // Return the project ID
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

      return newProjectId; // Return the project ID
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
