'use client';

import React, { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ProjectItemProps, DropItem } from '@/types/portfolio';
import { ItemTypes } from '@/components/common/constants';
import Image from 'next/image';
import { MdEdit } from 'react-icons/md';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import RichTextEditor from '@/components/editor/RichTextEditor';
import EditAltTextModal from '@/components/modals/EditAltAndTags';
import { Button } from '@/components/ui/button';

const ProjectItem: React.FC<ProjectItemProps> = ({
  id,
  content,
  index,
  moveProject,
  updateProject,
  removeProject,
  setShowRearrangeModal,
  onTextClick,
  setTextContent,
  textContent,
  className = 'relative p-4 bg-white rounded-lg transition-all',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showAltTextEditor, setShowAltTextEditor] = useState(false);
  const [altText, setAltText] = useState(content.altText || '');
  const [tags, setTags] = useState(content.tags || []);
  const [caption, setCaption] = useState(content.caption || '');
  const [showCaptionEditor, setShowCaptionEditor] = useState(false);
  const [showTextEditor, setShowTextEditor] = useState(false);

  // const [{ isDragging }, drag] = useDrag({
  //   type: ItemTypes.PROJECT,
  //   item: { id, index },
  //   collect: (monitor) => ({
  //     isDragging: monitor.isDragging(),
  //   }),
  // });

  // const [, drop] = useDrop({
  //   accept: ItemTypes.PROJECT,
  //   hover(item: DropItem, monitor) {
  //     if (!ref.current) return;
  //     const dragIndex = item.index;
  //     const hoverIndex = index;
  //     if (dragIndex === hoverIndex) return;

  //     const hoverBoundingRect = ref.current.getBoundingClientRect();
  //     const hoverMiddleY =
  //       (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
  //     const clientOffset = monitor.getClientOffset();
  //     const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

  //     if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
  //     if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

  //     moveProject(dragIndex, hoverIndex);
  //     item.index = hoverIndex;
  //   },
  // });

  const handleReplaceFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      updateProject(id, {
        ...content,
        data: reader.result as string,
        title: file.name.replace(/\.[^/.]+$/, ''),
      });
    };

    if (content.type === 'image') {
      reader.readAsDataURL(file);
    } else if (content.type === 'video') {
      reader.readAsDataURL(file);
    }
  };

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

  const saveText = () => {
    updateProject(id, {
      ...content,
      data: textContent,
    });
    setShowTextEditor(false);
  };

  // drag(drop(ref));

  const renderContent = () => {
    switch (content.type) {
      case 'image':
        return (
          <div
            className={`w-full ${
              isHovered ? 'ring-1 ring-[#B5D1E3] rounded-lg p-1' : ''
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="overflow-hidden rounded-lg relative group">
              <Image
                src={content.data}
                alt={content.altText || content.title || 'Project image'}
                className="w-full h-auto max-h-[400px] object-contain"
                width={800}
                height={100}
                priority
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleReplaceFile}
                accept="image/*"
                className="hidden"
              />
              {isHovered && (
                <div className="absolute top-2 left-2">
                  <Popover>
                    <PopoverTrigger className="w-8 h-8 grid place-items-center bg-[#718096] text-white rounded-[12px] shadow-sm transition-all">
                      <MdEdit size={18} />
                    </PopoverTrigger>
                    <PopoverContent className="w-50 p-2" align="start">
                      <div className="space-y-2">
                        <button
                          onClick={() => setShowRearrangeModal(true)}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        >
                          Rearrange Order
                        </button>
                        <button
                          onClick={triggerFileInput}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        >
                          Replace Image
                        </button>
                        <button
                          onClick={() => setShowAltTextEditor(true)}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        >
                          Edit Alt Text & Tags
                        </button>
                        <button
                          onClick={() =>
                            setShowCaptionEditor(!showCaptionEditor)
                          }
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        >
                          {content.caption ? 'Edit Caption' : 'Add Caption'}
                        </button>
                        <button
                          onClick={() => removeProject(id)}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>

            {content.caption && !showCaptionEditor && (
              <div
                className="text-sm italic text-gray-600 mt-2 px-3 border-l-2 border-gray-200"
                dangerouslySetInnerHTML={{ __html: content.caption }}
              />
            )}

            {showCaptionEditor && (
              <div className="mt-3 bg-white rounded-lg p-4 border">
                <RichTextEditor
                  value={caption}
                  onChange={setCaption}
                  placeholder="Add a caption for this image..."
                  autoFocus
                  className="max-w-none"
                />
                <div className="flex justify-end mt-4 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowCaptionEditor(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={saveCaption}>Save Caption</Button>
                </div>
              </div>
            )}
          </div>
        );
      case 'video':
        return (
          <div
            className={`w-full ${
              isHovered ? 'ring-1 ring-[#B5D1E3] rounded-lg p-1' : ''
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative w-full h-0 pb-[56.25%] group overflow-hidden rounded-lg">
              <iframe
                src={content.data}
                className="absolute inset-0 w-full h-full rounded-lg"
                allowFullScreen
                title={content.altText || content.title || 'Project video'}
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleReplaceFile}
                accept="video/*"
                className="hidden"
              />
              {isHovered && (
                <div className="absolute top-2 left-2 z-10">
                  <Popover>
                    <PopoverTrigger className="w-8 h-8 grid place-items-center bg-[#718096] text-white rounded-[12px] shadow-sm transition-all">
                      <MdEdit size={18} />
                    </PopoverTrigger>
                    <PopoverContent className="w-50 p-2" align="start">
                      <div className="space-y-2">
                        <button
                          onClick={() => setShowRearrangeModal(true)}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        >
                          Rearrange Order
                        </button>
                        <button
                          onClick={triggerFileInput}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        >
                          Replace Video
                        </button>
                        <button
                          onClick={() => setShowAltTextEditor(true)}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        >
                          Edit Alt Text & Tags
                        </button>
                        <button
                          onClick={() =>
                            setShowCaptionEditor(!showCaptionEditor)
                          }
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        >
                          {content.caption ? 'Edit Caption' : 'Add Caption'}
                        </button>
                        <button
                          onClick={() => removeProject(id)}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>

            {content.caption && !showCaptionEditor && (
              <div
                className="text-sm italic text-gray-600 mt-2 px-3 border-l-2 border-gray-200"
                dangerouslySetInnerHTML={{ __html: content.caption }}
              />
            )}

            {showCaptionEditor && (
              <div className="mt-3 bg-white rounded-lg p-4 border">
                <RichTextEditor
                  value={caption}
                  onChange={setCaption}
                  placeholder="Add a caption for this video..."
                  autoFocus
                  className="max-w-none"
                />
                <div className="flex justify-end mt-4 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowCaptionEditor(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={saveCaption}>Save Caption</Button>
                </div>
              </div>
            )}
          </div>
        );
      case 'text':
        return (
          <div
            className={`relative group ${
              isHovered ? 'ring-1 ring-[#B5D1E3] rounded-lg p-2' : ''
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {!showTextEditor && (
              <div
                dangerouslySetInnerHTML={{ __html: content.data }}
                onClick={() => {
                  setTextContent(content.data);
                  setShowTextEditor(true);
                }}
                className="cursor-pointer break-words"
              />
            )}

            {showTextEditor && (
              <div className="bg-white rounded-lg p-4 border">
                <RichTextEditor
                  value={textContent}
                  onChange={setTextContent}
                  placeholder="Write your content here..."
                  autoFocus
                  className="max-w-none"
                />
                <div className="flex justify-end mt-4 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowTextEditor(false);
                      setTextContent(content.data);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={saveText}
                    disabled={!textContent.trim() || textContent === '<p></p>'}
                  >
                    Save
                  </Button>
                </div>
              </div>
            )}

            {isHovered && !showTextEditor && (
              <div className="absolute top-1 left-1">
                <Popover>
                  <PopoverTrigger className="w-8 h-8 grid place-items-center bg-[#718096] text-white rounded-[12px] shadow-sm transition-all">
                    <MdEdit size={18} />
                  </PopoverTrigger>
                  <PopoverContent className="w-50 p-2" align="start">
                    <div className="space-y-2">
                      <button
                        onClick={() => setShowRearrangeModal(true)}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      >
                        Rearrange Order
                      </button>
                      <button
                        onClick={() => {
                          setTextContent(content.data);
                          setShowTextEditor(true);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      >
                        Edit Text
                      </button>
                      <button
                        onClick={() => removeProject(id)}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={ref}
      // className={`${className} ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
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
