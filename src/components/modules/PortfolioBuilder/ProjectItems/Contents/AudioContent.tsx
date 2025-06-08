// components/ProjectItem/AudioContent.tsx
'use client';

import React, { useRef } from 'react';
import { IoMusicalNotesOutline } from 'react-icons/io5';
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
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Handle audio file replacement logic here
  };

  return (
    <MediaWrapper
      isHovered={isHovered}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative group">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <IoMusicalNotesOutline className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{content.title}</h3>
              <p className="text-sm text-gray-500">Audio file</p>
            </div>
          </div>
        </div>

        <audio controls className="w-full" preload="metadata">
          <source src={content.data} />
          Your browser does not support the audio element.
        </audio>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="audio/*"
          className="hidden"
        />

        <EditMenu actions={editMenuActions} isVisible={isHovered} />
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
