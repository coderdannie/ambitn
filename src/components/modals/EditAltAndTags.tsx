'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Info } from 'lucide-react';
import Image from 'next/image';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';

interface EditAltTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  altText: string;
  setAltText: (text: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  imagePreview?: string;
}

const EditAltTextModal: React.FC<EditAltTextModalProps> = ({
  isOpen,
  onClose,
  onSave,
  altText,
  setAltText,
  tags,
  setTags,
  imagePreview,
}) => {
  const [newTag, setNewTag] = useState('');
  const [showAltTextTip, setShowAltTextTip] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Set character count limit for alt text
  const MAX_ALT_TEXT_LENGTH = 125;

  // Focus the tag input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">Accessibility Information</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Optional image preview */}
            {imagePreview && (
              <div className="p-4 bg-gray-50 flex justify-center">
                <div className="w-32 h-32 rounded overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    width={100}
                    height={100}
                  />
                </div>
              </div>
            )}

            <div className="p-4">
              {/* Alt text section */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    Alt Text
                    <button
                      className="ml-1 text-gray-400 hover:text-blue-500 focus:outline-none"
                      onClick={() => setShowAltTextTip(!showAltTextTip)}
                      aria-label="Alt text information"
                    >
                      <Info size={16} />
                    </button>
                  </label>
                  <span className="text-xs text-gray-500">
                    {altText.length}/{MAX_ALT_TEXT_LENGTH}
                  </span>
                </div>

                {showAltTextTip && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs bg-blue-50 p-2 rounded mb-2 text-blue-800"
                  >
                    Good alt text briefly describes the image content for people
                    using screen readers. Keep it concise but descriptive.
                  </motion.div>
                )}

                <Textarea
                  value={altText}
                  onChange={(e) => {
                    if (e.target.value.length <= MAX_ALT_TEXT_LENGTH) {
                      setAltText(e.target.value);
                    }
                  }}
                  className="w-full p-2 border rounded focus:ring-0  placeholder:text-sm "
                  placeholder="Describe what appears in this image..."
                  rows={3}
                  aria-label="Alt text description"
                />
              </div>

              {/* Tags section */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <div className="flex mb-2">
                  <Input
                    ref={inputRef}
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 p-2 border rounded-l focus:ring-0  placeholder:text-sm"
                    placeholder="Add tag and press Enter"
                  />
                  <button
                    onClick={addTag}
                    className="bg-primary hover:bg-primary text-white px-3 py-2 rounded-r flex items-center"
                    aria-label="Add tag"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 min-h-8">
                  {tags.map((tag) => (
                    <motion.span
                      key={tag}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="inline-flex items-center bg-gray-100 px-2 py-1 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-gray-500 hover:text-red-500 focus:outline-none"
                        aria-label={`Remove tag ${tag}`}
                      >
                        <X size={14} />
                      </button>
                    </motion.span>
                  ))}
                  {tags.length === 0 && (
                    <span className="text-xs text-gray-400 italic">
                      No tags added yet
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-4 bg-gray-50 border-t">
              <button
                onClick={onClose}
                className="px-4 py-2 border flex-1 border-gray-300 hover:bg-gray-50 rounded text-sm font-medium"
              >
                Cancel
              </button>
              <motion.button
                onClick={onSave}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 flex-2 bg-blue-600 !h-[48px] hover:bg-blue-700 secondary-btn text-white rounded text-sm font-medium"
              >
                Save Changes
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditAltTextModal;
