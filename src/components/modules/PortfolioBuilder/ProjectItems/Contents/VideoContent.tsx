'use client';

import React, { useRef } from 'react';
import LoadingOverlay from '@/components/common/Loaders/UploadingLoadingOverlay';
import EditMenu from '../Components';
import { CaptionEditor } from '../Components';
import { CaptionDisplay } from '../Components';
import { MediaWrapper } from '../Components';
import { EditMenuAction } from '@/types/portfolio';

interface VideoContentProps {
  content: any;
  isHovered: boolean;
  setIsHovered: (hovered: boolean) => void;
  isUploadingVideo: boolean | undefined;
  uploadVideoProgress: number | undefined;
  onReplaceVideo?: (file: File) => void;
  showCaptionEditor: boolean;
  setShowCaptionEditor: (show: boolean) => void;
  caption: string;
  setCaption: (caption: string) => void;
  saveCaption: () => void;
  editMenuActions: EditMenuAction[];
  isDeleting: boolean;
}

const VideoContent: React.FC<VideoContentProps> = ({
  content,
  isHovered,
  setIsHovered,
  isUploadingVideo,
  uploadVideoProgress,
  onReplaceVideo,
  showCaptionEditor,
  setShowCaptionEditor,
  caption,
  setCaption,
  saveCaption,
  editMenuActions,
  isDeleting,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onReplaceVideo) {
      onReplaceVideo(file);
    }
  };

  return (
    <MediaWrapper
      isHovered={isHovered}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-0 pb-[56.25%] group overflow-hidden rounded-lg">
        <iframe
          src={content.data}
          className={`absolute inset-0 w-full h-full rounded-lg transition-opacity ${
            isUploadingVideo || content.isUploading ? 'opacity-60' : ''
          }`}
          allowFullScreen
          title={content.altText || content.title || 'Project video'}
        />

        {(isUploadingVideo || content.isUploading) && (
          <LoadingOverlay uploadProgress={uploadVideoProgress || 0} />
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="video/*"
          className="hidden"
          disabled={isUploadingVideo || content.isUploading}
        />

        <EditMenu
          actions={editMenuActions}
          isVisible={isHovered && !isUploadingVideo && !content.isUploading}
          isDeleting={isDeleting}
        />
      </div>

      <CaptionDisplay caption={content.caption} />

      {showCaptionEditor && (
        <CaptionEditor
          value={caption}
          onChange={setCaption}
          onSave={saveCaption}
          onCancel={() => setShowCaptionEditor(false)}
          placeholder="Add a caption for this video..."
        />
      )}
    </MediaWrapper>
  );
};

export default VideoContent;
