'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import LoadingOverlay from '@/components/common/Loaders/UploadingLoadingOverlay';
import EditMenu from '../Components';
import { CaptionEditor } from '../Components';
import { CaptionDisplay } from '../Components';
import { MediaWrapper } from '../Components';
import { EditMenuAction } from '@/types/portfolio';

interface ImageContentProps {
  content: any;
  isHovered: boolean;
  setIsHovered: (hovered: boolean) => void;
  isUploadingImg: boolean | undefined;
  uploadImgProgress: number | undefined | void;
  onReplaceImage?: (file: File) => void;
  showCaptionEditor: boolean;
  setShowCaptionEditor: (show: boolean) => void;
  caption: string;
  setCaption: (caption: string) => void;
  saveCaption: () => void;
  editMenuActions: EditMenuAction[];
  isDeleting: boolean;
}

const ImageContent: React.FC<ImageContentProps> = ({
  content,
  isHovered,
  setIsHovered,
  isUploadingImg,
  uploadImgProgress,
  onReplaceImage,
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
    if (file && onReplaceImage) {
      onReplaceImage(file);
    }
  };

  return (
    <MediaWrapper
      isHovered={isHovered}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="overflow-hidden rounded-lg relative group">
        <Image
          src={content.data}
          alt={content.altText || content.title || 'Project image'}
          className={`w-full h-auto max-h-[400px] object-contain transition-opacity ${
            isUploadingImg || content.isUploading ? 'opacity-60' : ''
          }`}
          width={800}
          height={100}
          priority
        />

        {(isUploadingImg || content.isUploading) && (
          <LoadingOverlay uploadProgress={uploadImgProgress || 0} />
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          disabled={isUploadingImg || content.isUploading}
        />

        <EditMenu
          actions={editMenuActions}
          isVisible={isHovered && !isUploadingImg && !content.isUploading}
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
          placeholder="Add a caption for this image..."
        />
      )}
    </MediaWrapper>
  );
};

export default ImageContent;
