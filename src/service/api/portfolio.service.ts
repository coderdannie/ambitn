import * as API from '../url';
import axiosInstance, { uploadInstance } from '../axiosInstance';
import {
  CreateProjectPayload,
  getUserAllProjectResponse,
  UploadBody,
} from '@/types/portfolio';
import { EditProject, ProjectResponse } from '@/types/project';

export const uploadImage = async (
  body: UploadBody,
  onProgress?: (progress: number) => void
): Promise<any> => {
  // Convert base64 to File if needed
  let fileToUpload: File;

  if (typeof body.file === 'string') {
    // Handle base64 string
    const response = await fetch(body.file);
    const blob = await response.blob();
    fileToUpload = new File([blob], 'image.jpg', { type: blob.type });
  } else {
    fileToUpload = body.file;
  }

  // Create FormData for file upload
  const formData = new FormData();
  formData.append('file', fileToUpload);

  // Use your existing uploadInstance with progress tracking
  const res = await uploadInstance.post(API.UPLOAD_IMAGE, formData, {
    onUploadProgress: (progressEvent: any) => {
      if (progressEvent.total) {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress?.(progress);
      }
    },
  });

  return res.data;
};

export const uploadVideo = async (
  body: UploadBody,
  onProgress?: (progress: number) => void
): Promise<any> => {
  let fileToUpload: File;

  if (typeof body.file === 'string') {
    // Handle base64 string
    const response = await fetch(body.file);
    const blob = await response.blob();
    fileToUpload = new File([blob], 'video.mp4', { type: blob.type });
  } else {
    fileToUpload = body.file;
  }

  // Create FormData for file upload
  const formData = new FormData();
  formData.append('file', fileToUpload);

  // Upload with progress tracking
  const res = await uploadInstance.post(API.UPLOAD_VIDEO, formData, {
    onUploadProgress: (progressEvent: any) => {
      if (progressEvent.total) {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress?.(progress);
      }
    },
  });

  return res.data;
};

export const uploadAudio = async (
  body: UploadBody,
  onProgress?: (progress: number) => void
): Promise<any> => {
  let fileToUpload: File;

  if (typeof body.file === 'string') {
    // Handle base64 string
    const response = await fetch(body.file);
    const blob = await response.blob();
    fileToUpload = new File([blob], 'audio.mp3', {
      type: blob.type || 'audio/mpeg',
    });
  } else {
    fileToUpload = body.file;
  }

  // Create FormData for file upload
  const formData = new FormData();
  formData.append('file', fileToUpload);

  // Upload with progress tracking
  const res = await uploadInstance.post(API.UPLOAD_AUDIO, formData, {
    onUploadProgress: (progressEvent: any) => {
      if (progressEvent.total) {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress?.(progress);
      }
    },
  });

  return res.data;
};

export const deleteUploadedVideo = async (body: {
  publicId: string | undefined;
}) => {
  const res = await axiosInstance.delete(API.DELETE_UPLOADED_VIDEO, {
    data: body,
  });
  return res.data;
};

export const deleteUploadedImage = async (body: { publicId: string }) => {
  const res = await axiosInstance.delete(API.DELETE_UPLOADED_IMAGE, {
    data: body,
  });
  return res.data;
};

export const deleteUploadedAudio = async (body: { publicId: string }) => {
  const res = await axiosInstance.delete(API.DELETE_UPLOADED_AUDIO, {
    data: body,
  });
  return res.data;
};
export const createProject = async (
  payload: CreateProjectPayload
): Promise<any> => {
  const res = await axiosInstance.post(API.CREATE_PROJECT, payload);
  return res.data;
};

export const getUserAllProjects = async ({
  queryKey,
}): Promise<getUserAllProjectResponse> => {
  const [, page, limit, searchTerm] = queryKey;

  const params = new URLSearchParams();

  if (page) params.append('page', page);
  if (limit) params.append('limit', limit);
  if (searchTerm) params.append('searchTerm', searchTerm);

  const res = await axiosInstance.get<getUserAllProjectResponse>(
    `${`${API.GET_USER_ALL_PROJECTS}/all`}?${params.toString()}`
  );
  return res.data;
};

export const getUserProject = async (id: string): Promise<ProjectResponse> => {
  const res = await axiosInstance.get<{ data: ProjectResponse }>(
    `${API.GET_USER_ALL_PROJECTS}/${id}`
  );
  return res.data.data;
};

export const deleteProject = async (id: string) => {
  if (!id) throw new Error('ID is required');
  const res = await axiosInstance.delete(API.DELETE_PROJECT(id));
  return res.data;
};

export const editProject = async (id: string, data: EditProject) => {
  const res = await axiosInstance.put(API.EDIT_PROJECT(id), data);
  return res.data;
};
