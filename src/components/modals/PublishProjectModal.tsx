'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';
import CreatableSelect from 'react-select/creatable';
import { StylesConfig, ActionMeta, MultiValue } from 'react-select';
import { MdModeEditOutline } from 'react-icons/md';
import { FaHeart } from 'react-icons/fa6';
import { IoEyeSharp } from 'react-icons/io5';
import { useForm, Controller } from 'react-hook-form';
import { ProjectFormData, projectSchema } from '@/utils/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

// Validation Schema

interface PublishProjectModalProps {
  open: boolean;
  onClose: () => void;
  defaultValues?: Partial<ProjectFormData>;
  onPublish?: (data: ProjectFormData) => void;
  onSaveDraft?: (data: ProjectFormData) => void;
  setShowCoverModal: (value: boolean) => void;
  onFormChange?: (data: ProjectFormData) => void; // Callback to parent for state management
}

interface TagOption {
  value: string;
  label: string;
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
    boxShadow: 'none',
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
  defaultValues,
  onPublish,
  onSaveDraft,
  setShowCoverModal,
  onFormChange,
}) => {
  const [showMoreCategories, setShowMoreCategories] = React.useState(false);
  const router = useRouter();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
    setValue,
    getValues,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      tags: [],
      categories: [],
      coverImage: '',
      needsFeedback: false,
      ...defaultValues,
    },
    mode: 'onChange', // Validate on change for real-time feedback
  });

  // Watch all form values for real-time updates
  const watchedValues = watch();

  // Only send form data to parent on specific actions, not on every change
  const notifyParentOfChange = () => {
    if (onFormChange && open) {
      onFormChange(getValues());
    }
  };

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

  // Reset form when modal opens with new default values
  useEffect(() => {
    if (open) {
      reset({
        title: '',
        description: '',
        tags: [],
        categories: [],
        coverImage: '',
        needsFeedback: false,
        ...defaultValues,
      });
    }
  }, [open, defaultValues, reset]);

  const handleTagsChange = (
    newValue: MultiValue<TagOption>,
    actionMeta: ActionMeta<TagOption>
  ) => {
    const tagsArray = Array.isArray(newValue) ? newValue : [];
    setValue(
      'tags',
      tagsArray.map((tag) => tag.value),
      { shouldValidate: true }
    );
    notifyParentOfChange();
  };

  const handleCreateOption = (inputValue: string) => {
    const currentTags = getValues('tags');
    const newTagValue = inputValue.toLowerCase().replace(/\W/g, '-');

    if (!currentTags.includes(newTagValue) && currentTags.length < 10) {
      setValue('tags', [...currentTags, newTagValue], { shouldValidate: true });
      notifyParentOfChange();
    }
  };

  const handleCategoryToggle = (category: string) => {
    const currentCategories = getValues('categories');
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter((cat) => cat !== category)
      : [...currentCategories, category];

    setValue('categories', newCategories, { shouldValidate: true });
    notifyParentOfChange();
  };

  const onSubmitPublish = (data: ProjectFormData) => {
    onPublish?.(data);
    router.push('/portfolio/preview');
  };

  const handleSaveDraft = () => {
    const currentData = getValues();
    onSaveDraft?.(currentData);
    onClose();
  };

  const visibleCategories = showMoreCategories
    ? availableCategories
    : availableCategories.slice(0, 6);

  // Convert tags to the format React Select expects
  const selectedTags =
    watchedValues.tags?.map((tag) => {
      const predefined = predefinedTags.find((t) => t.value === tag);
      return predefined || { value: tag, label: tag };
    }) || [];

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

            <form
              onSubmit={handleSubmit(onSubmitPublish)}
              className="flex flex-col md:flex-row flex-1 min-h-0"
            >
              {/* Left Side - Preview */}
              <div className="w-full md:flex-1 p-4 md:p-6 bg-gray-50 border-b md:border-b-0 md:border-r overflow-y-auto max-h-[50vh] md:max-h-none">
                <div className="space-y-4">
                  {/* Project Title */}
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      Project Cover (required)
                    </h3>
                  </div>

                  <div className="relative rounded-md overflow-hidden">
                    <div
                      className={`bg-black rounded-lg overflow-hidden h-[200px] w-full aspect-[4/5] ${
                        errors.coverImage ? 'ring-2 ring-red-500' : ''
                      }`}
                    >
                      {watchedValues.coverImage ? (
                        <>
                          <Image
                            src={watchedValues.coverImage}
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

                      {/* Stats overlay */}
                      <div className="absolute bottom-4 right-4 flex items-center gap-2">
                        <span className="text-white text-sm flex items-center gap-1">
                          <FaHeart className="text-white" /> 0
                        </span>
                        <span className="text-white text-sm flex items-center gap-1">
                          <IoEyeSharp className="text-white" /> 0
                        </span>
                      </div>
                    </div>

                    {/* Cover preview text */}
                    <div className="absolute bottom-4 left-4 text-white font-semibold">
                      {watchedValues.title || 'Untitled Project'}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="text-sm text-[#718096] border-b border-[#FF8C00] hover:text-blue-700 flex items-center gap-1 pb-1"
                    onClick={() => {
                      setShowCoverModal(true);
                      onClose();
                    }}
                  >
                    <MdModeEditOutline /> Edit Cover Image
                  </button>

                  {errors.coverImage && (
                    <p className="text-red-500 text-sm">
                      {errors.coverImage.message}
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
                      <Controller
                        name="title"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              notifyParentOfChange();
                            }}
                            placeholder="Enter project title"
                            className={`border focus-visible:ring-0 focus-visible:ring-offset-0 
                              focus-visible:border-1 h-[47px] px-2 py-1 w-full bg-transparent ${
                                errors.title
                                  ? 'border-red-500 focus-visible:border-red-500'
                                  : field.value
                                  ? 'border-[#1A202CE5]'
                                  : 'focus-visible:border-[#E2E4EA]'
                              }`}
                          />
                        )}
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.title.message}
                        </p>
                      )}
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-[#1A202C] mb-2">
                        Tags <span className="text-gray-500">(Max 10)</span>
                      </label>
                      <Controller
                        name="tags"
                        control={control}
                        render={({ field: { value } }) => (
                          <CreatableSelect
                            isMulti
                            options={predefinedTags}
                            value={selectedTags}
                            onChange={handleTagsChange}
                            onCreateOption={handleCreateOption}
                            styles={
                              errors.tags ? customStylesError : customStyles
                            }
                            placeholder="Select or create tags..."
                            isSearchable
                            isClearable
                            noOptionsMessage={() => 'Type to create a new tag'}
                            formatCreateLabel={(inputValue) =>
                              `Create "${inputValue}"`
                            }
                            isValidNewOption={(inputValue) =>
                              inputValue.trim() !== '' &&
                              !value.includes(
                                inputValue.toLowerCase().replace(/\W/g, '-')
                              ) &&
                              value.length < 10
                            }
                            components={{
                              DropdownIndicator: () => null,
                              IndicatorSeparator: () => null,
                            }}
                          />
                        )}
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {watchedValues.tags?.length || 0}/10 tags
                      </div>
                      {errors.tags && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.tags.message}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-[#1A202C] mb-2">
                        Description
                      </label>
                      <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                          <Textarea
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              notifyParentOfChange();
                            }}
                            placeholder="Describe your project..."
                            rows={3}
                            className={`border focus-visible:ring-0 focus-visible:ring-offset-0 
                              focus-visible:border-1 h-[47px] px-2 py-1 w-full bg-transparent ${
                                errors.description
                                  ? 'border-red-500 focus-visible:border-red-500'
                                  : field.value
                                  ? 'border-[#1A202CE5]'
                                  : 'focus-visible:border-[#E2E4EA]'
                              }`}
                          />
                        )}
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.description.message}
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
                              checked={
                                watchedValues.categories?.includes(category) ||
                                false
                              }
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
                          type="button"
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
                          {errors.categories.message}
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
                      <Controller
                        name="needsFeedback"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <Switch
                            checked={value}
                            onCheckedChange={(checked) => {
                              onChange(checked);
                              notifyParentOfChange();
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 p-4 md:p-6 border-t bg-gray-50 mt-auto">
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                className="w-full sm:w-auto px-6 py-3 bg-[#F7F5F4] order-2 sm:order-1"
              >
                Save as draft
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit(onSubmitPublish)}
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
