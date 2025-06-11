import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProjectContent, MediaType } from '@/types/portfolio';
import { AxiosError } from 'axios';

interface UseMediaUploadProps {
  uploadImage: any;
  uploadVideo: any;
  uploadAudio: any;
  updateProject: (id: string, content: ProjectContent) => void;
  removeProject: (id: string) => void;
  addToast: (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info'
  ) => void;
  setProjects: React.Dispatch<React.SetStateAction<any[]>>;
  setUploadingProjects: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export const useMediaUpload = ({
  uploadImage,
  uploadVideo,
  uploadAudio,
  updateProject,
  removeProject,
  addToast,
  setProjects,
  setUploadingProjects,
}: UseMediaUploadProps) => {
  const handleMediaUpload = useCallback(
    (
      file: File,
      mediaType: MediaType,
      projectId?: string,
      position?: number
    ): Promise<string> => {
      // Return a Promise that resolves with the project ID
      return new Promise((resolve, reject) => {
        const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB
        const MAX_AUDIO_SIZE = 10 * 1024 * 1024; // 10MB

        if (mediaType === 'video' && file.size > MAX_VIDEO_SIZE) {
          const errorMessage = `Video file is too large. Maximum size allowed is 20MB. Your file is ${(
            file.size /
            (1024 * 1024)
          ).toFixed(1)}MB.`;
          addToast(errorMessage, 'error');
          return reject(new Error(errorMessage));
        }

        if (mediaType === 'audio' && file.size > MAX_AUDIO_SIZE) {
          const errorMessage = `Audio file is too large. Maximum size allowed is 10MB. Your file is ${(
            file.size /
            (1024 * 1024)
          ).toFixed(1)}MB.`;
          addToast(errorMessage, 'error');
          return reject(new Error(errorMessage));
        }

        const reader = new FileReader();
        const uploadMutation =
          mediaType === 'image'
            ? uploadImage
            : mediaType === 'video'
            ? uploadVideo
            : uploadAudio;

        const successMessage =
          mediaType === 'image'
            ? 'Image uploaded successfully'
            : mediaType === 'video'
            ? 'Video uploaded successfully'
            : 'Audio uploaded successfully';

        reader.onload = () => {
          const previewUrl =
            mediaType === 'image'
              ? (reader.result as string)
              : URL.createObjectURL(file);

          const tempContent: ProjectContent = {
            type: mediaType,
            data: previewUrl,
            title: file.name.replace(/\.[^/.]+$/, ''),
            isUploading: true,
          };

          let currentProjectId = projectId;

          if (!currentProjectId) {
            currentProjectId = uuidv4();
            const newProject = { id: currentProjectId, content: tempContent };

            if (position !== null && position !== undefined) {
              setProjects((prevProjects) => {
                const newProjects = [...prevProjects];
                newProjects.splice(position, 0, newProject);
                return newProjects;
              });
            } else {
              setProjects((prevProjects) => [...prevProjects, newProject]);
            }
          } else {
            updateProject(currentProjectId, tempContent);
          }

          setUploadingProjects((prev) => new Set(prev).add(currentProjectId!));

          uploadMutation(
            { file },
            {
              onSuccess: (res: any) => {
                addToast(successMessage, 'success');

                const finalContent: ProjectContent = {
                  type: mediaType,
                  data: res?.data?.url,
                  title: file.name.replace(/\.[^/.]+$/, ''),
                  publicUrl: res?.data?.publicId,
                  isUploading: false,
                };

                updateProject(currentProjectId!, finalContent);
                setUploadingProjects((prev) => {
                  const newSet = new Set(prev);
                  newSet.delete(currentProjectId!);
                  return newSet;
                });

                if (mediaType === 'video' || mediaType === 'audio') {
                  URL.revokeObjectURL(previewUrl);
                }

                resolve(currentProjectId!); // Resolve with the project ID
              },
              onError: (error: any) => {
                if (mediaType === 'video' || mediaType === 'audio') {
                  URL.revokeObjectURL(previewUrl);
                }
                removeProject(currentProjectId!);

                const errorMessage =
                  error instanceof AxiosError
                    ? error?.response?.data?.message ||
                      error?.message ||
                      'Upload failed'
                    : 'Upload failed';

                addToast(errorMessage, 'error');
                reject(new Error(errorMessage));
              },
            }
          );
        };

        reader.readAsDataURL(file);
      });
    },
    [
      uploadImage,
      uploadVideo,
      uploadAudio,
      updateProject,
      removeProject,
      addToast,
      setProjects,
      setUploadingProjects,
    ]
  );

  const handleImageUpload = useCallback(
    (file: File, projectId?: string, position?: number) => {
      return handleMediaUpload(file, 'image', projectId, position);
    },
    [handleMediaUpload]
  );

  const handleVideoUpload = useCallback(
    (file: File, projectId?: string, position?: number) => {
      return handleMediaUpload(file, 'video', projectId, position);
    },
    [handleMediaUpload]
  );

  const handleAudioUpload = useCallback(
    (file: File, projectId?: string, position?: number) => {
      return handleMediaUpload(file, 'audio', projectId, position);
    },
    [handleMediaUpload]
  );

  return {
    handleImageUpload,
    handleVideoUpload,
    handleAudioUpload,
    handleMediaUpload,
  };
};
