'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';
import Select, { StylesConfig, ActionMeta, MultiValue } from 'react-select';
import { MdModeEditOutline } from 'react-icons/md';
import { FaHeart } from 'react-icons/fa6';
import { IoEyeSharp } from 'react-icons/io5';

interface ProjectData {
  title: string;
  description: string;
  tags: string[];
  categories: string[];
  coverImage?: string;
  needsFeedback: boolean;
}

interface PublishProjectModalProps {
  open: boolean;
  onClose: () => void;
  projectData?: ProjectData;
  onPublish?: (data: ProjectData) => void;
  onSaveDraft?: (data: ProjectData) => void;
  setShowCoverModal: (value: boolean) => void;
}

interface TagOption {
  value: string;
  label: string;
}

interface ValidationErrors {
  title: boolean;
  description: boolean;
  tags: boolean;
  categories: boolean;
  coverImage: boolean;
}

const availableCategories = [
  'Graphic Design',
  'Fashion',
  'Mobile',
  'Web Design',
  'Photography',
  'Illustration',
  'Branding',
  'UI/UX',
];

const predefinedTags: TagOption[] = [
  { value: 'design', label: 'Design' },
  { value: 'ui', label: 'UI' },
  { value: 'ux', label: 'UX' },
  { value: 'graphic-design', label: 'Graphic Design' },
  { value: 'illustration', label: 'Illustration' },
  { value: 'branding', label: 'Branding' },
  { value: 'web-design', label: 'Web Design' },
  { value: 'mobile', label: 'Mobile' },
];

const customStyles: StylesConfig<TagOption, true> = {
  control: (provided, state) => ({
    ...provided,
    width: '100%',
    minHeight: '47px',
    color: '#444',
    fontSize: '14px',
    cursor: 'pointer',
    borderRadius: '10px',
    border: state.hasValue ? '1px solid #000' : '1px solid #E2E4EA',
    paddingRight: '16px',
    background: state.hasValue ? '#FFFF' : 'unset',
    boxShadow: 'none', // Removes the blue glow
    '&:hover': {
      borderColor: state.hasValue ? '#000' : '#E2E4EA',
    },
    '&:focus-within': {
      borderColor: state.hasValue ? '#000' : '#E2E4EA',
      boxShadow: 'none',
    },
  }),
  menu: (provided) => ({
    ...provided,
    fontSize: '13px',
    backgroundColor: '#fff',
  }),
  option: (provided, state) => ({
    ...provided,
    color: state.isFocused ? '' : '',
    backgroundColor: state.isFocused ? '#f4f6f8' : '',
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: '#F7FAFC',
    borderRadius: '4px',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: '#333333',
    fontSize: '14px',
  }),
  multiValueRemove: (base) => ({
    ...base,
    ':hover': {
      backgroundColor: '#E0D0F0',
    },
  }),
};

const customStylesError: StylesConfig<TagOption, true> = {
  ...customStyles,
  control: (provided, state) => ({
    ...customStyles.control!(provided, state),
    border: '1px solid #EF4444',
    '&:hover': {
      borderColor: '#EF4444',
    },
    '&:focus-within': {
      borderColor: '#EF4444',
      boxShadow: 'none',
    },
  }),
};

export const PublishProjectModal: React.FC<PublishProjectModalProps> = ({
  open,
  onClose,
  projectData,
  onPublish,
  onSaveDraft,
  setShowCoverModal,
}) => {
  const [formData, setFormData] = useState<ProjectData>({
    title: '',
    description: '',
    tags: [],
    categories: [],
    needsFeedback: false,
    ...projectData,
  });

  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({
    title: false,
    description: false,
    tags: false,
    categories: false,
    coverImage: false,
  });

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);

  // Reset form when modal opens
  useEffect(() => {
    if (open && projectData) {
      setFormData({ ...projectData });
    }
    // Reset errors when modal opens
    setErrors({
      title: false,
      description: false,
      tags: false,
      categories: false,
      coverImage: false,
    });
  }, [open, projectData]);

  const handleTagsChange = (
    newValue: MultiValue<TagOption>,
    actionMeta: ActionMeta<TagOption>
  ) => {
    setFormData((prev) => ({
      ...prev,
      tags: newValue.map((tag) => tag.value),
    }));
    // Clear error when user starts typing
    if (errors.tags) {
      setErrors((prev) => ({ ...prev, tags: false }));
    }
  };

  const handleCreateOption = (inputValue: string) => {
    const newTag = {
      value: inputValue.toLowerCase().replace(/\W/g, '-'),
      label: inputValue,
    };

    if (!formData.tags.includes(newTag.value) && formData.tags.length < 10) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.value],
      }));
      // Clear error when user adds a tag
      if (errors.tags) {
        setErrors((prev) => ({ ...prev, tags: false }));
      }
    }
  };

  const handleCategoryToggle = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((cat) => cat !== category)
        : [...prev.categories, category],
    }));
    // Clear error when user selects a category
    if (errors.categories) {
      setErrors((prev) => ({ ...prev, categories: false }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {
      title: !formData.title.trim(),
      description: !formData.description.trim(),
      tags: formData.tags.length === 0,
      categories: formData.categories.length === 0,
      coverImage: !formData.coverImage,
    };

    setErrors(newErrors);

    // Return true if no errors
    return !Object.values(newErrors).some((error) => error);
  };

  const handlePublish = () => {
    if (validateForm()) {
      onPublish?.(formData);
      onClose();
    }
  };

  const handleSaveDraft = () => {
    onSaveDraft?.(formData);
    onClose();
  };

  const visibleCategories = showMoreCategories
    ? availableCategories
    : availableCategories.slice(0, 6);

  // Convert formData.tags to the format React Select expects
  const selectedTags = formData.tags.map((tag) => {
    const predefined = predefinedTags.find((t) => t.value === tag);
    return predefined || { value: tag, label: tag };
  });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-end px-6 py-2 border-b">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col md:flex-row flex-1 min-h-0">
              {/* Left Side - Preview */}
              <div className="w-full md:flex-1 p-4 md:p-6 bg-gray-50 border-b md:border-b-0 md:border-r overflow-y-auto max-h-[50vh] md:max-h-none">
                <div className="space-y-4">
                  {/* Project Title */}
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      Project Cover(required)
                    </h3>
                  </div>

                  <div className="relative  rounded-md overflow-hidden">
                    <div
                      className={`bg-black rounded-lg overflow-hidden h-[200px] w-full aspect-[4/5] ${
                        errors.coverImage ? 'ring-2 ring-red-500' : ''
                      }`}
                    >
                      {formData.coverImage ? (
                        <>
                          <Image
                            src={formData.coverImage}
                            alt="Project cover"
                            fill
                            className="object-cover overflow-hidden"
                          />
                          {/* Gradient overlay */}
                          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <span className="text-white text-lg font-medium text-center px-4">
                            Project Preview
                          </span>
                        </div>
                      )}

                      {/* Stats overlay - now without background */}
                      <div className="absolute bottom-4 right-4 flex items-center gap-2">
                        <span className="text-white text-sm flex items-center gap-1">
                          <FaHeart className="text-white" /> 0
                        </span>
                        <span className="text-white text-sm flex items-center gap-1">
                          <IoEyeSharp className="text-white" /> 0
                        </span>
                      </div>
                    </div>

                    {/* Cover preview text - now without background */}
                    <div className="absolute bottom-4 left-4 text-white font-semibold">
                      {formData.title || 'Untitled Project'}
                    </div>
                  </div>

                  <button
                    className="text-sm  text-[#718096] border-b border-[#FF8C00] hover:text-blue-700 flex items-center gap-1 pb-1"
                    onClick={() => {
                      setShowCoverModal(true);
                      onClose();
                    }}
                  >
                    <MdModeEditOutline /> Edit Cover Image
                  </button>

                  {errors.coverImage && (
                    <p className="text-red-500 text-sm">
                      This field is required
                    </p>
                  )}
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="flex-2 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                  <div className="space-y-4 md:space-y-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-[#1A202C] mb-2">
                        Project Title
                      </label>
                      <Input
                        value={formData.title}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }));
                          // Clear error when user starts typing
                          if (errors.title) {
                            setErrors((prev) => ({ ...prev, title: false }));
                          }
                        }}
                        placeholder="Enter project title"
                        className={`border
                        focus-visible:ring-0 focus-visible:ring-offset-0 
                        focus-visible:border-1 h-[47px] 
                        px-2 py-1 w-full bg-transparent  ${
                          errors.title
                            ? 'border-red-500 focus-visible:border-red-500'
                            : formData.title
                            ? 'border-[#1A202CE5] '
                            : 'focus-visible:border-[#E2E4EA] '
                        }`}
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm mt-1">
                          This field is required
                        </p>
                      )}
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-[#1A202C] mb-2">
                        Tags <span className="text-gray-500">(Max 10)</span>
                      </label>
                      <Select
                        isMulti
                        options={predefinedTags}
                        value={selectedTags}
                        onChange={handleTagsChange}
                        onCreateOption={handleCreateOption}
                        styles={errors.tags ? customStylesError : customStyles}
                        placeholder="Select or create tags..."
                        isSearchable
                        isClearable
                        noOptionsMessage={() => 'Type to create a new tag'}
                        formatCreateLabel={(inputValue) =>
                          `Create "${inputValue}"`
                        }
                        isValidNewOption={(inputValue) =>
                          inputValue.trim() !== '' &&
                          !formData.tags.includes(
                            inputValue.toLowerCase().replace(/\W/g, '-')
                          ) &&
                          formData.tags.length < 10
                        }
                        components={{
                          DropdownIndicator: () => null,
                          IndicatorSeparator: () => null,
                        }}
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {formData.tags.length}/10 tags
                      </div>
                      {errors.tags && (
                        <p className="text-red-500 text-sm mt-1">
                          This field is required
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-[#1A202C] mb-2">
                        Description
                      </label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }));
                          // Clear error when user starts typing
                          if (errors.description) {
                            setErrors((prev) => ({
                              ...prev,
                              description: false,
                            }));
                          }
                        }}
                        placeholder="Describe your project..."
                        rows={3}
                        className={`border
                          focus-visible:ring-0 focus-visible:ring-offset-0 
                          focus-visible:border-1 h-[47px] 
                          px-2 py-1 w-full bg-transparent  ${
                            errors.description
                              ? 'border-red-500 focus-visible:border-red-500'
                              : formData.description
                              ? 'border-[#1A202CE5] '
                              : 'focus-visible:border-[#E2E4EA] '
                          }`}
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm mt-1">
                          This field is required
                        </p>
                      )}
                    </div>

                    {/* Categories */}
                    <div>
                      <label className="block text-sm font-medium text-[#1A202C] mb-3">
                        Categorize
                      </label>
                      <div
                        className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${
                          errors.categories
                            ? 'p-2 border border-red-500 rounded'
                            : ''
                        }`}
                      >
                        {visibleCategories.map((category) => (
                          <label
                            key={category}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <Checkbox
                              checked={formData.categories.includes(category)}
                              onCheckedChange={() =>
                                handleCategoryToggle(category)
                              }
                            />
                            <span className="text-sm text-gray-700">
                              {category}
                            </span>
                          </label>
                        ))}
                      </div>

                      {availableCategories.length > 6 && (
                        <button
                          onClick={() =>
                            setShowMoreCategories(!showMoreCategories)
                          }
                          className="text-sm text-blue-600 hover:text-blue-700 mt-2"
                        >
                          {showMoreCategories ? 'See less' : 'See more'} →
                        </button>
                      )}
                      {errors.categories && (
                        <p className="text-red-500 text-sm mt-1">
                          This field is required
                        </p>
                      )}
                    </div>

                    {/* Feedback Toggle */}
                    <div className="flex items-center gap-2 py-4 border-t">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          I need feedbacks from other designers
                        </h3>
                      </div>
                      <Switch
                        checked={formData.needsFeedback}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            needsFeedback: checked,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 p-4 md:p-6 border-t bg-gray-50 mt-auto">
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                className="w-full sm:w-auto px-6 py-3 bg-[#F7F5F4] order-2 sm:order-1"
              >
                Save as draft
              </Button>
              <Button
                onClick={handlePublish}
                className="w-full sm:w-auto px-6 py-3 secondary-btn-gradient order-1 sm:order-2"
              >
                Continue
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
