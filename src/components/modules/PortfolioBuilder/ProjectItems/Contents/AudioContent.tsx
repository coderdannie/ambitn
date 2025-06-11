// components/ProjectItem/AudioContent.tsx
'use client';

import React, { useRef } from 'react';
import LoadingOverlay from '@/components/common/Loaders/UploadingLoadingOverlay';
import EditMenu from '../Components';
import { CaptionEditor } from '../Components';
import { CaptionDisplay } from '../Components';
import { MediaWrapper } from '../Components';
import { EditMenuAction } from '@/types/portfolio';

interface AudioContentProps {
  content: any;
  isHovered: boolean;
  setIsHovered: (hovered: boolean) => void;
  showCaptionEditor: boolean;
  setShowCaptionEditor: (show: boolean) => void;
  caption: string;
  setCaption: (caption: string) => void;
  saveCaption: () => void;
  editMenuActions: EditMenuAction[];
  isUploadingAudio: boolean | undefined;
  uploadProgress: number | undefined | void;
  onReplaceAudio?: (file: File) => void;
  isDeleting?: boolean;
}

const AudioContent: React.FC<AudioContentProps> = ({
  content,
  isHovered,
  setIsHovered,
  showCaptionEditor,
  setShowCaptionEditor,
  caption,
  setCaption,
  saveCaption,
  editMenuActions,
  isUploadingAudio,
  uploadProgress,
  onReplaceAudio,
  isDeleting,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onReplaceAudio) {
      onReplaceAudio(file);
    }
  };

  return (
    <MediaWrapper
      isHovered={isHovered}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative group">
        <div
          className={`relative w-full ${
            isUploadingAudio || content.isUploading ? ' min-h-[180px]' : ''
          }`}
        >
          <audio
            controls
            className={`w-full ${
              isUploadingAudio || content.isUploading ? 'opacity-60' : ''
            }`}
            preload="metadata"
          >
            <source src={content.data} />
            Your browser does not support the audio element.
          </audio>

          {(isUploadingAudio || content.isUploading) && (
            <LoadingOverlay uploadProgress={uploadProgress || 0} />
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="audio/*"
          className="hidden"
          disabled={isUploadingAudio || content.isUploading}
        />

        <EditMenu
          actions={editMenuActions}
          isVisible={isHovered && !isUploadingAudio && !content.isUploading}
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
          placeholder="Add a caption for this audio..."
        />
      )}
    </MediaWrapper>
  );
};

export default AudioContent;
