// hooks/usePortfolioQueries.ts - Updated with optimistic updates for React Query mutations
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../querykey';
import {
  deleteUploadedVideo,
  deleteUploadedImage,
  uploadImage,
  uploadVideo,
  uploadAudio,
  createProject,
  deleteUploadedAudio,
  getUserAllProjects,
  getUserProject,
  deleteProject,
  editProject,
} from '../api/portfolio.service';
import { useState } from 'react';
import { UploadData, UploadOptions } from '@/types/portfolio';
import { EditProject } from '@/types/project';

// Enhanced delete hooks with optimistic updates
export const useDeleteUploadedVideo = (options = {}) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteUploadedVideo,
    mutationKey: [QUERY_KEYS.DELETE_UPLOADED_VIDEO],
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.GET_USER_ALL_PROJECTS],
      });

      // Snapshot the previous value
      const previousProjects = queryClient.getQueryData([
        QUERY_KEYS.GET_USER_ALL_PROJECTS,
      ]);

      // Optimistically update the cache if you're managing projects in React Query
      // This is optional if you're only using local state

      // Return context object with the snapshotted value
      return { previousProjects };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousProjects) {
        queryClient.setQueryData(
          [QUERY_KEYS.GET_USER_ALL_PROJECTS],
          context.previousProjects
        );
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure data consistency
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_ALL_PROJECTS],
      });
    },
    ...options,
  });

  return { mutate, isPending };
};

export const useDeleteUploadedImage = (options = {}) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteUploadedImage,
    mutationKey: [QUERY_KEYS.DELETE_UPLOADED_IMAGE],
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.GET_USER_ALL_PROJECTS],
      });

      const previousProjects = queryClient.getQueryData([
        QUERY_KEYS.GET_USER_ALL_PROJECTS,
      ]);

      return { previousProjects };
    },
    onError: (err, variables, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(
          [QUERY_KEYS.GET_USER_ALL_PROJECTS],
          context.previousProjects
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_ALL_PROJECTS],
      });
    },
    ...options,
  });

  return { mutate, isPending };
};

export const useDeleteUploadedAudio = (options = {}) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteUploadedAudio,
    mutationKey: [QUERY_KEYS.DELETE_UPLOADED_AUDIO],
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.GET_USER_ALL_PROJECTS],
      });

      const previousProjects = queryClient.getQueryData([
        QUERY_KEYS.GET_USER_ALL_PROJECTS,
      ]);

      return { previousProjects };
    },
    onError: (err, variables, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(
          [QUERY_KEYS.GET_USER_ALL_PROJECTS],
          context.previousProjects
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_ALL_PROJECTS],
      });
    },
    ...options,
  });

  return { mutate, isPending };
};

export const useDeleteProject = (options = {}) => {
  const queryClient = useQueryClient();

  const { mutate, isPending, data } = useMutation({
    mutationFn: deleteProject,
    mutationKey: [QUERY_KEYS.DELETE_PROJECT],
    onMutate: async (projectId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.GET_USER_ALL_PROJECTS],
      });
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.GET_USER_PROJECT_DETAILS, projectId],
      });

      // Snapshot the previous values
      const previousProjects = queryClient.getQueryData([
        QUERY_KEYS.GET_USER_ALL_PROJECTS,
      ]);
      const previousProject = queryClient.getQueryData([
        QUERY_KEYS.GET_USER_PROJECT_DETAILS,
        projectId,
      ]);

      // Optimistically remove the project from the projects list
      queryClient.setQueryData(
        [QUERY_KEYS.GET_USER_ALL_PROJECTS],
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            data:
              old.data?.filter((project: any) => project.id !== projectId) ||
              [],
          };
        }
      );

      // Remove the individual project from cache
      queryClient.removeQueries({
        queryKey: [QUERY_KEYS.GET_USER_PROJECT_DETAILS, projectId],
      });

      return { previousProjects, previousProject, projectId };
    },
    onError: (err, projectId, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousProjects) {
        queryClient.setQueryData(
          [QUERY_KEYS.GET_USER_ALL_PROJECTS],
          context.previousProjects
        );
      }
      if (context?.previousProject) {
        queryClient.setQueryData(
          [QUERY_KEYS.GET_USER_PROJECT_DETAILS, context.projectId],
          context.previousProject
        );
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_ALL_PROJECTS],
      });
    },
    ...options,
  });

  return { mutate, isPending, data };
};

// Keep other hooks unchanged
export const useUploadImage = (options: UploadOptions = {}) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: UploadData) => uploadImage(data, setUploadProgress),
    mutationKey: [QUERY_KEYS.UPLOAD_IMAGE],
    onMutate: () => {
      setIsUploading(true);
      setUploadProgress(0);
      options.onMutate?.();
    },
    onSuccess: (data) => {
      setIsUploading(false);
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 1000);
      options.onSuccess?.(data);
    },
    onError: (error) => {
      setIsUploading(false);
      setUploadProgress(0);
      options.onError?.(error);
    },
    onSettled: options.onSettled,
  });

  return {
    mutate,
    isPending,
    isUploading,
    uploadProgress,
  };
};

export const useUploadVideo = (options: UploadOptions = {}) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: UploadData) => uploadVideo(data, setUploadProgress),
    mutationKey: [QUERY_KEYS.UPLOAD_VIDEO],
    onMutate: () => {
      setIsUploading(true);
      setUploadProgress(0);
      options.onMutate?.();
    },
    onSuccess: (data) => {
      setIsUploading(false);
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 1000);
      options.onSuccess?.(data);
    },
    onError: (error) => {
      setIsUploading(false);
      setUploadProgress(0);
      options.onError?.(error);
    },
    onSettled: options.onSettled,
  });

  return {
    mutate,
    isPending,
    isUploading,
    uploadProgress,
  };
};

export const useUploadAudio = (options: UploadOptions = {}) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: UploadData) => uploadAudio(data, setUploadProgress),
    mutationKey: [QUERY_KEYS.UPLOAD_AUDIO],
    onMutate: () => {
      setIsUploading(true);
      setUploadProgress(0);
      options.onMutate?.();
    },
    onSuccess: (data) => {
      setIsUploading(false);
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 1000);
      options.onSuccess?.(data);
    },
    onError: (error) => {
      setIsUploading(false);
      setUploadProgress(0);
      options.onError?.(error);
    },
    onSettled: options.onSettled,
  });

  return {
    mutate,
    isPending,
    isUploading,
    uploadProgress,
  };
};

export const useCreateProject = (options = {}) => {
  const { mutate, isPending, isError, error, isSuccess, data } = useMutation({
    mutationFn: createProject,
    mutationKey: [QUERY_KEYS.CREATE_PROJECT],
    ...options,
  });

  return {
    mutate,
    isPending,
    isError,
    error,
    isSuccess,
    data,
  };
};

export const useGetUserAllProjects = (
  page = 1,
  limit = '',
  searchTerm = '',
  options = {}
) => {
  const { data, isSuccess, isError, isPending } = useQuery({
    queryKey: [QUERY_KEYS.GET_USER_ALL_PROJECTS, page, limit, searchTerm],
    queryFn: getUserAllProjects,
    ...options,
  });
  return {
    data,
    isSuccess,
    isError,
    isPending,
  };
};

export const useGetUserProjectDetails = (id: string) => {
  const { data, isSuccess, isError, isPending } = useQuery({
    queryKey: [QUERY_KEYS.GET_USER_PROJECT_DETAILS, id],
    queryFn: () => getUserProject(id),
  });

  return {
    data,
    isSuccess,
    isError,
    isPending,
  };
};

export const useEditProject = (options = {}) => {
  const { mutate, isPending } = useMutation({
    mutationFn: (payload: { id: string; data: EditProject }) =>
      editProject(payload.id, payload.data),
    mutationKey: [QUERY_KEYS.EDIT_PROJECT],
    ...options,
  });

  return { mutate, isPending };
};
