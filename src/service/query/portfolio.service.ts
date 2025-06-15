import { useMutation, useQuery } from '@tanstack/react-query';
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
} from '../api/portfolio.service';
import { useState } from 'react';
import { UploadData, UploadOptions } from '@/types/portfolio';

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
      // Reset progress after a delay
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

export const useDeleteUploadedVideo = (options = {}) => {
  const { mutate, isPending } = useMutation({
    mutationFn: deleteUploadedVideo,
    mutationKey: [QUERY_KEYS.DELETE_UPLOADED_VIDEO],
    ...options,
  });
  return { mutate, isPending };
};

export const useDeleteUploadedImage = (options = {}) => {
  const { mutate, isPending } = useMutation({
    mutationFn: deleteUploadedImage,
    mutationKey: [QUERY_KEYS.DELETE_UPLOADED_IMAGE],
    ...options,
  });
  return { mutate, isPending };
};

export const useDeleteUploadedAudio = (options = {}) => {
  const { mutate, isPending } = useMutation({
    mutationFn: deleteUploadedAudio,
    mutationKey: [QUERY_KEYS.DELETE_UPLOADED_AUDIO],
    ...options,
  });
  return { mutate, isPending };
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
    enabled: !!id,
    refetchOnWindowFocus: false,
    queryFn: () => getUserProject(id),
  });

  return {
    data,
    isSuccess,
    isError,
    isPending,
  };
};
