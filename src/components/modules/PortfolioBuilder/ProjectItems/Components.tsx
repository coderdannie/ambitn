'use client';

import { ReactNode } from 'react';
import { MdEdit } from 'react-icons/md';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { EditMenuAction } from '@/types/portfolio';

interface EditMenuProps {
  actions: EditMenuAction[];
  isVisible: boolean;
  isDeleting?: boolean;
}

const EditMenu: React.FC<EditMenuProps> = ({
  actions,
  isVisible,
  isDeleting,
}) => {
  if (!isVisible) return null;

  return (
    <div className="absolute top-2 left-2 z-10">
      <Popover>
        <PopoverTrigger className="w-8 h-8 grid place-items-center bg-[#718096] text-white rounded-[12px] shadow-sm transition-all">
          <MdEdit size={18} />
        </PopoverTrigger>
        <PopoverContent className="w-50 p-2" align="start">
          <div className="space-y-2">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                disabled={action.disabled}
                className={`w-full text-left px-3 py-2 text-sm rounded flex gap-2 items-center justify-between${
                  action.label === 'Delete'
                    ? 'text-red-600 hover:bg-gray-100'
                    : 'text-gray-700 hover:bg-gray-100'
                } ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isDeleting && action.label === 'Delete' && (
                  <div className="flex justify-center items-center">
                    <Oval
                      height={20}
                      width={20}
                      color="red"
                      visible={true}
                      ariaLabel="oval-loading"
                      secondaryColor="red"
                      strokeWidth={6}
                      strokeWidthSecondary={6}
                    />
                  </div>
                )}
                <span> {action.label}</span>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default EditMenu;

import React from 'react';
import { Button } from '@/components/ui/button';
import RichTextEditor from '@/components/editor/RichTextEditor';
import { Oval } from 'react-loader-spinner';

interface CaptionEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  placeholder: string;
}

export const CaptionEditor: React.FC<CaptionEditorProps> = ({
  value,
  onChange,
  onSave,
  onCancel,
  placeholder,
}) => {
  return (
    <div className="mt-3 bg-white rounded-lg p-4 border">
      <RichTextEditor
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoFocus
        className="max-w-none"
      />
      <div className="flex justify-end mt-4 gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave}>Save Caption</Button>
      </div>
    </div>
  );
};

interface CaptionDisplayProps {
  caption: string;
}

export const CaptionDisplay: React.FC<CaptionDisplayProps> = ({ caption }) => {
  if (!caption) return null;

  return (
    <div
      className="text-sm italic text-gray-600 mt-2 px-3 border-l-2 border-gray-200"
      dangerouslySetInnerHTML={{ __html: caption }}
    />
  );
};

interface MediaWrapperProps {
  children: ReactNode;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  className?: string;
}

export const MediaWrapper: React.FC<MediaWrapperProps> = ({
  children,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  className = '',
}) => {
  return (
    <div
      className={`w-full ${
        isHovered ? 'ring-1 ring-[#B5D1E3] rounded-lg p-1' : ''
      } ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
};
