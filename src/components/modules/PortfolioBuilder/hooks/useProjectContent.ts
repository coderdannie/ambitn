import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProjectContent, ProjectItem } from '@/types/portfolio';

export const useProjectContent = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [uploadingProjects, setUploadingProjects] = useState<Set<string>>(
    new Set()
  );
  const [deletingProjects, setDeletingProjects] = useState<Set<string>>(
    new Set()
  );
  const [insertPosition, setInsertPosition] = useState<number | null>(null);

  const moveProject = useCallback((dragIndex: number, hoverIndex: number) => {
    setProjects((prevProjects) => {
      const newProjects = [...prevProjects];
      const [removed] = newProjects.splice(dragIndex, 1);
      newProjects.splice(hoverIndex, 0, removed);
      return newProjects;
    });
  }, []);

  const updateProject = useCallback(
    (id: string, newContent: ProjectContent) => {
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === id ? { ...project, content: newContent } : project
        )
      );
    },
    []
  );

  const cleanupProjectStates = useCallback((id: string) => {
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
  }, []);

  const addProject = useCallback((content: ProjectContent) => {
    setProjects((prevProjects) => [...prevProjects, { id: uuidv4(), content }]);
  }, []);

  const addProjectAtPosition = useCallback(
    (content: ProjectContent, position: number) => {
      setProjects((prevProjects) => {
        const newProjects = [...prevProjects];
        newProjects.splice(position, 0, { id: uuidv4(), content });
        return newProjects;
      });
    },
    []
  );

  return {
    projects,
    setProjects,
    uploadingProjects,
    deletingProjects,
    insertPosition,
    setInsertPosition,
    moveProject,
    updateProject,
    cleanupProjectStates,
    addProject,
    addProjectAtPosition,
  };
};
