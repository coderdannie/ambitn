'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import RichTextEditor from '@/components/editor/RichTextEditor';
import EditMenu from '../Components';
import { EditMenuAction } from '@/types/portfolio';

interface TextContentProps {
  content: any;
  isHovered: boolean;
  setIsHovered: (hovered: boolean) => void;
  isEditing: boolean | undefined;
  textContent: string;
  setTextContent: (content: string) => void;
  onTextDoubleClick?: () => void;
  onCancelEditing?: () => void;
  onSaveEditing?: () => void;
  editMenuActions: EditMenuAction[];
}

const TextContent: React.FC<TextContentProps> = ({
  content,
  isHovered,
  setIsHovered,
  isEditing,
  textContent,
  setTextContent,
  onTextDoubleClick,
  onCancelEditing,
  onSaveEditing,
  editMenuActions,
}) => {
  return (
    <div
      className={`relative group ${
        isHovered && !isEditing ? 'ring-1 ring-[#B5D1E3] rounded-lg p-2' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isEditing ? (
        <div
          dangerouslySetInnerHTML={{ __html: content.data }}
          onDoubleClick={onTextDoubleClick}
          className="cursor-pointer break-words transition-colors p-2 rounded"
        />
      ) : (
        <div className="bg-white rounded-lg p-4 border shadow-sm">
          <RichTextEditor
            value={textContent}
            onChange={setTextContent}
            placeholder="Edit your content here..."
            autoFocus
            className="max-w-none"
          />
          <div className="flex justify-end mt-4 gap-2">
            <Button variant="outline" onClick={onCancelEditing}>
              Cancel
            </Button>
            <Button
              onClick={onSaveEditing}
              disabled={!textContent.trim() || textContent === '<p></p>'}
            >
              Save Changes
            </Button>
          </div>
        </div>
      )}

      <EditMenu actions={editMenuActions} isVisible={isHovered} />
    </div>
  );
};

export default TextContent;
