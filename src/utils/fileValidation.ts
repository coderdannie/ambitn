export const validateFileSize = (
  file: File,
  mediaType: 'image' | 'video' | 'audio'
): string | null => {
  const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB
  const MAX_AUDIO_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

  const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(1);

  if (mediaType === 'video' && file.size > MAX_VIDEO_SIZE) {
    return `Video file is too large. Maximum size allowed is 20MB. Your file is ${fileSizeInMB}MB.`;
  }

  if (mediaType === 'audio' && file.size > MAX_AUDIO_SIZE) {
    return `Audio file is too large. Maximum size allowed is 10MB. Your file is ${fileSizeInMB}MB.`;
  }

  if (mediaType === 'image' && file.size > MAX_IMAGE_SIZE) {
    return `Image file is too large. Maximum size allowed is 5MB. Your file is ${fileSizeInMB}MB.`;
  }

  return null;
};
