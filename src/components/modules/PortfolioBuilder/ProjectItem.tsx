'use client';

import React, { useRef, useState } from 'react';
import { ProjectItemProps } from '@/types/portfolio';
import { useToast } from '@/context/ToastContext';
import EditAltTextModal from '@/components/modals/EditAltAndTags';
import ImageContent from './ProjectItems/Contents/ImageContent';
import VideoContent from './ProjectItems/Contents/VideoContent';
import TextContent from './ProjectItems/Contents/TextContent';
import AudioContent from './ProjectItems/Contents/AudioContent';
import { EditMenuAction } from '@/types/portfolio';

const ProjectItem: React.FC<ProjectItemProps> = ({
  id,
  content,
  index,
  moveProject,
  updateProject,
  removeProject,
  setShowRearrangeModal,
  onTextDoubleClick,
  onEditClick,
  onCancelEditing,
  onSaveEditing,
  setTextContent,
  textContent,
  isEditing,
  className = 'relative p-4 bg-white rounded-lg transition-all',
  isUploadingImg,
  uploadImgProgress,
  onReplaceImage,
  isUploadingVideo,
  uploadVideoProgress,
  onReplaceVideo,
  isDeleting,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showAltTextEditor, setShowAltTextEditor] = useState(false);
  const [altText, setAltText] = useState(content.altText || '');
  const [tags, setTags] = useState(content.tags || []);
  const [caption, setCaption] = useState(content.caption || '');
  const [showCaptionEditor, setShowCaptionEditor] = useState(false);
  const { addToast } = useToast();

  console.log(isDeleting);
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const saveAltText = () => {
    updateProject(id, {
      ...content,
      altText,
      tags,
    });
    setShowAltTextEditor(false);
  };

  const saveCaption = () => {
    updateProject(id, {
      ...content,
      caption,
    });
    setShowCaptionEditor(false);
  };

  const handleReplaceFile = (file: File) => {
    const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB in bytes

    if (file.type.startsWith('image/')) {
      onReplaceImage?.(file);
    } else if (file.type.startsWith('video/')) {
      if (file.size > MAX_VIDEO_SIZE) {
        addToast(
          `Video file is too large. Maximum size allowed is 20MB. Your file is ${(
            file.size /
            (1024 * 1024)
          ).toFixed(1)}MB.`,
          'success'
        );
        return;
      }
      onReplaceVideo?.(file);
    }
  };

  // Create edit menu actions based on content type
  const createEditMenuActions = (): EditMenuAction[] => {
    const baseActions: EditMenuAction[] = [
      {
        label: 'Rearrange Order',
        onClick: () => setShowRearrangeModal(true),
      },
    ];

    // Add content-specific actions
    if (content.type === 'image') {
      baseActions.push({
        label: 'Replace Image',
        onClick: triggerFileInput,
        disabled: isUploadingImg || content.isUploading,
      });
    } else if (content.type === 'video') {
      baseActions.push({
        label: 'Replace Video',
        onClick: triggerFileInput,
        disabled: isUploadingVideo || content.isUploading,
      });
    } else if (content.type === 'audio') {
      baseActions.push({
        label: 'Replace Audio',
        onClick: triggerFileInput,
      });
    } else if (content.type === 'text') {
      baseActions.push({
        label: 'Edit Text',
        onClick: () => {
          setTextContent(content.data);
          onEditClick?.();
        },
      });
    }

    // Add common actions for media types
    if (content.type !== 'text') {
      baseActions.push({
        label: 'Edit Alt Text & Tags',
        onClick: () => setShowAltTextEditor(true),
      });
      baseActions.push({
        label: content.caption ? 'Edit Caption' : 'Add Caption',
        onClick: () => setShowCaptionEditor(!showCaptionEditor),
      });
    }

    // Add delete action
    baseActions.push({
      label: 'Delete',
      onClick: () => removeProject(id),
      disabled: isUploadingImg || content.isUploading || isUploadingVideo,
      variant: 'danger',
    });

    return baseActions;
  };

  const editMenuActions = createEditMenuActions();

  const renderContent = () => {
    switch (content.type) {
      case 'image':
        return (
          <ImageContent
            content={content}
            isHovered={isHovered}
            setIsHovered={setIsHovered}
            isUploadingImg={isUploadingImg}
            uploadImgProgress={uploadImgProgress}
            onReplaceImage={handleReplaceFile}
            showCaptionEditor={showCaptionEditor}
            setShowCaptionEditor={setShowCaptionEditor}
            caption={caption}
            setCaption={setCaption}
            saveCaption={saveCaption}
            editMenuActions={editMenuActions}
            isDeleting={isDeleting}
          />
        );
      case 'video':
        return (
          <VideoContent
            content={content}
            isHovered={isHovered}
            setIsHovered={setIsHovered}
            isUploadingVideo={isUploadingVideo}
            uploadVideoProgress={uploadVideoProgress}
            onReplaceVideo={handleReplaceFile}
            showCaptionEditor={showCaptionEditor}
            setShowCaptionEditor={setShowCaptionEditor}
            caption={caption}
            setCaption={setCaption}
            saveCaption={saveCaption}
            editMenuActions={editMenuActions}
            isDeleting={isDeleting}
          />
        );
      case 'text':
        return (
          <TextContent
            content={content}
            isHovered={isHovered}
            setIsHovered={setIsHovered}
            isEditing={isEditing}
            textContent={textContent}
            setTextContent={setTextContent}
            onTextDoubleClick={onTextDoubleClick}
            onCancelEditing={onCancelEditing}
            onSaveEditing={onSaveEditing}
            editMenuActions={editMenuActions}
          />
        );
      case 'audio':
        return (
          <AudioContent
            content={content}
            isHovered={isHovered}
            setIsHovered={setIsHovered}
            showCaptionEditor={showCaptionEditor}
            setShowCaptionEditor={setShowCaptionEditor}
            caption={caption}
            setCaption={setCaption}
            saveCaption={saveCaption}
            editMenuActions={editMenuActions}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div ref={ref} className={className}>
      {renderContent()}
      <EditAltTextModal
        isOpen={showAltTextEditor}
        onClose={() => setShowAltTextEditor(false)}
        onSave={saveAltText}
        altText={altText}
        setAltText={setAltText}
        tags={tags}
        setTags={setTags}
      />
    </div>
  );
};

export default ProjectItem;
