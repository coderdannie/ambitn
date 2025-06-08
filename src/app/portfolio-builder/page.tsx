'use client';

import ProjectItems from '@/components/modules/PortfolioBuilder/ProjectItem';
import { Button } from '@/components/ui/button';
import { ProjectContent, ProjectItem, MediaType } from '@/types/portfolio';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ReorderModal from '@/components/modals/ReorderModal';
import RichTextEditor from '@/components/editor/RichTextEditor';
import AddContentPanel from '@/components/modules/PortfolioBuilder/AddContentPanel';
import InsertMoreContent from '@/components/modules/PortfolioBuilder/InsertMoreContent';
import { useWindowSize } from '@/hooks/useWindowSize';
import { CiCircleChevLeft } from 'react-icons/ci';
import { useRouter } from 'next/navigation';
import AddContentDrawer from '@/components/modals/AddContentDrawer';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { PublishProjectModal } from '@/components/modals/PublishProjectModal';
import { CoverPhotoModal } from '@/components/modals/CoverPhotoModal';
import { Plus } from 'lucide-react';
import HoverInsert from '@/components/modules/PortfolioBuilder/HoverInsert';
import { AxiosError } from 'axios';
import { useToast } from '@/context/ToastContext';
import {
  useDeleteUploadedImage,
  useDeleteUploadedVideo,
  useUploadImage,
  useUploadVideo,
} from '@/service/query/portfolio.service';

const PortfolioBuilder = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [textContent, setTextContent] = useState('');
  const [addingText, setAddingText] = useState(false);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [showRearrangeModal, setShowRearrangeModal] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [insertPosition, setInsertPosition] = useState<number | null>(null);

  // Track which projects are currently uploading
  const [uploadingProjects, setUploadingProjects] = useState<Set<string>>(
    new Set()
  );
  const [deletingProjects, setDeletingProjects] = useState<Set<string>>(
    new Set()
  );

  const { isMobile } = useWindowSize();
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const { addToast } = useToast();

  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    tags: [],
    categories: [],
    coverImage: '',
    needsFeedback: false,
  });

  const { mutate: uploadImage, uploadProgress: imageUploadProgress } =
    useUploadImage();
  const { mutate: uploadVideo, uploadProgress: videoUploadProgress } =
    useUploadVideo();
  const { mutate: deleteUploadedImage } = useDeleteUploadedImage();
  const { mutate: deleteUploadedVideo } = useDeleteUploadedVideo();

  useEffect(() => {
    const html = document.documentElement;
    if (open) {
      html.style.overflow = 'hidden';
    } else if (showCoverModal) {
      html.style.overflow = 'hidden';
    } else {
      html.style.overflow = '';
    }

    return () => {
      html.style.overflow = '';
    };
  }, [open, showCoverModal]);

  useEffect(() => {
    const firstImage = projects.find((p) => p.content.type === 'image');
    const coverImage = firstImage?.content.data || '';

    setProjectData((prev) => ({
      ...prev,
      title: projectTitle || 'Untitled Project',
      coverImage, // Now guaranteed to be string
    }));
  }, [projectTitle, projects]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (
        addingText &&
        editorRef.current &&
        !editorRef.current.contains(target) &&
        !target.closest('[data-tippy-root]') &&
        !target.closest('.ProseMirror') &&
        !target.closest('[role="dialog"]') &&
        !target.closest('[role="menu"]') &&
        !target.closest('[role="listbox"]') &&
        !target.closest('.dropdown-menu') &&
        !target.closest('[data-radix-collection-item]') &&
        !target.closest('[data-radix-popper-content-wrapper]') &&
        !target.closest('[data-state="open"]') &&
        !target.closest('button[role="combobox"]') &&
        !target.closest('div[role="combobox"]') &&
        !target.closest('.lucide') &&
        !target.closest('svg') &&
        !target.closest('[data-editor-toolbar]') &&
        !target.hasAttribute('data-state') &&
        !target.parentElement?.hasAttribute('data-state') &&
        !target.closest('[class*="editor"]') &&
        !target.closest('[class*="toolbar"]') &&
        !target.closest('[class*="dropdown"]') &&
        !target.closest('[class*="select"]') &&
        !target.closest('[class*="toggle"]')
      ) {
        handleAddText();
      }
    };

    const handleMouseDown = (event: MouseEvent) => {
      setTimeout(() => {
        handleClickOutside(event);
      }, 150);
    };

    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [addingText, textContent]);

  const handlePublishProject = (data: any) => {
    console.log('Publishing project:', data);
  };

  const handleSaveDraft = (data: any) => {
    console.log('Saving draft:', data);
  };

  const moveProject = useCallback((dragIndex: number, hoverIndex: number) => {
    setProjects((prevProjects) => {
      const newProjects = [...prevProjects];
      const [removed] = newProjects.splice(dragIndex, 1);
      newProjects.splice(hoverIndex, 0, removed);
      return newProjects;
    });
  }, []);

  const updateProject = useCallback(
    (id: string, newContent: ProjectContent) => {
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === id ? { ...project, content: newContent } : project
        )
      );
    },
    []
  );

  const cleanupProjectStates = useCallback((id: string) => {
    setProjects((prevProjects) =>
      prevProjects.filter((project) => project.id !== id)
    );
    setUploadingProjects((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    setDeletingProjects((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  console.log(projects);
  const removeProject = useCallback(
    (id: string) => {
      const projectToRemove = projects.find((project) => project.id === id);

      // Check if it's uploaded media that needs API deletion

      console.log('remove', projectToRemove?.content.publicUrl);
      const needsApiDeletion =
        projectToRemove?.content.publicUrl &&
        (projectToRemove.content.type === 'image' ||
          projectToRemove.content.type === 'video');

      if (needsApiDeletion) {
        setDeletingProjects((prev) => new Set(prev).add(id));

        const publicId = projectToRemove?.content?.publicUrl || '';

        const deleteFunction =
          projectToRemove.content.type === 'image'
            ? deleteUploadedImage
            : deleteUploadedVideo;

        deleteFunction(
          { publicId },
          {
            onSuccess: () => {
              addToast(
                `${projectToRemove.content.type} deleted successfully`,
                'success'
              );
              cleanupProjectStates(id);
            },
            onError: (error) => {
              addToast(
                `Failed to delete ${projectToRemove.content.type}`,
                'error'
              );
              setDeletingProjects((prev) => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
              });
            },
          }
        );
      } else {
        // Direct local deletion for non-uploaded content
        cleanupProjectStates(id);
      }
    },
    [projects, deleteUploadedImage, deleteUploadedVideo, addToast]
  );
  const addProject = useCallback((content: ProjectContent) => {
    setProjects((prevProjects) => [...prevProjects, { id: uuidv4(), content }]);
  }, []);

  const addProjectAtPosition = useCallback(
    (content: ProjectContent, position: number) => {
      setProjects((prevProjects) => {
        const newProjects = [...prevProjects];
        newProjects.splice(position, 0, { id: uuidv4(), content });
        return newProjects;
      });
    },
    []
  );

  // Generic media upload handler that works for both images and videos
  const handleMediaUpload = useCallback(
    (
      file: File,
      mediaType: MediaType,
      projectId?: string,
      position?: number
    ) => {
      // Check file size for videos early (20MB = 20 * 1024 * 1024 bytes)
      const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB in bytes

      if (mediaType === 'video' && file.size > MAX_VIDEO_SIZE) {
        addToast(
          `Video file is too large. Maximum size allowed is 20MB. Your file is ${(
            file.size /
            (1024 * 1024)
          ).toFixed(1)}MB.`,
          'error'
        );
        return;
      }

      const reader = new FileReader();
      const uploadMutation = mediaType === 'image' ? uploadImage : uploadVideo;
      const successMessage =
        mediaType === 'image'
          ? 'Image uploaded successfully'
          : 'Video uploaded successfully';

      reader.onload = () => {
        // Create preview URL based on media type
        const previewUrl =
          mediaType === 'image'
            ? (reader.result as string)
            : URL.createObjectURL(file);

        const tempContent: ProjectContent = {
          type: mediaType,
          data: previewUrl,
          title: file.name.replace(/\.[^/.]+$/, ''),
          isUploading: true,
        };

        let currentProjectId = projectId;

        // If no projectId, create new project
        if (!currentProjectId) {
          currentProjectId = uuidv4();
          const newProject = { id: currentProjectId, content: tempContent };

          if (position !== null && position !== undefined) {
            setProjects((prevProjects) => {
              const newProjects = [...prevProjects];
              newProjects.splice(position, 0, newProject);
              return newProjects;
            });
          } else {
            setProjects((prevProjects) => [...prevProjects, newProject]);
          }
        } else {
          // Update existing project with preview
          updateProject(currentProjectId, tempContent);
        }

        // Add to uploading projects
        setUploadingProjects((prev) => new Set(prev).add(currentProjectId!));

        // Start upload (size check already done above)
        uploadMutation(
          { file },
          {
            onSuccess: (res) => {
              addToast(successMessage, 'success');

              // Update project with actual URL
              const finalContent: ProjectContent = {
                type: mediaType,
                data: res?.data?.url,
                title: file.name.replace(/\.[^/.]+$/, ''),
                publicUrl: res?.data?.publicId,
                isUploading: false,
              };

              updateProject(currentProjectId!, finalContent);

              // Remove from uploading projects
              setUploadingProjects((prev) => {
                const newSet = new Set(prev);
                newSet.delete(currentProjectId!);
                return newSet;
              });

              // Clean up object URL for videos
              if (mediaType === 'video') {
                URL.revokeObjectURL(previewUrl);
              }
            },
            onError: (error) => {
              // Clean up object URL for videos on error
              if (mediaType === 'video') {
                URL.revokeObjectURL(previewUrl);
              }

              // Remove the temporary project on error
              removeProject(currentProjectId!);

              if (error instanceof AxiosError) {
                addToast(
                  error?.response?.data?.message ||
                    error?.message ||
                    'Upload failed',
                  'error'
                );
              } else {
                addToast('Upload failed', 'error');
              }
            },
          }
        );
      };

      reader.readAsDataURL(file);
    },
    [uploadImage, uploadVideo, updateProject, removeProject, addToast]
  );
  // Specific handlers using the generic function
  const handleImageUpload = useCallback(
    (file: File, projectId?: string, position?: number) => {
      handleMediaUpload(file, 'image', projectId, position);
    },
    [handleMediaUpload]
  );

  const handleVideoUpload = useCallback(
    (file: File, projectId?: string, position?: number) => {
      handleMediaUpload(file, 'video', projectId, position);
    },
    [handleMediaUpload]
  );

  // Event handlers for file selection
  const handleImageSelected = (file: File) => {
    handleImageUpload(
      file,
      undefined,
      insertPosition !== null ? insertPosition : undefined
    );
    if (insertPosition !== null) {
      setInsertPosition(null);
    }
  };

  const handleVideoSelected = (file: File) => {
    handleVideoUpload(
      file,
      undefined,
      insertPosition !== null ? insertPosition : undefined
    );
    if (insertPosition !== null) {
      setInsertPosition(null);
    }
  };

  // Replace handlers
  const handleReplaceImage = useCallback(
    (file: File, projectId: string) => {
      handleImageUpload(file, projectId);
    },
    [handleImageUpload]
  );

  const handleReplaceVideo = useCallback(
    (file: File, projectId: string) => {
      handleVideoUpload(file, projectId);
    },
    [handleVideoUpload]
  );

  const handleAudioSelected = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const content: ProjectContent = {
        type: 'audio',
        data: URL.createObjectURL(file),
        title: file.name.replace(/\.[^/.]+$/, ''),
      };

      if (insertPosition !== null) {
        addProjectAtPosition(content, insertPosition);
        setInsertPosition(null);
      } else {
        addProject(content);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddText = () => {
    const cleanContent = textContent.replace(/<p><\/p>/g, '').trim();
    if (cleanContent && cleanContent !== '<p></p>') {
      if (editingTextId) {
        updateProject(editingTextId, {
          type: 'text',
          data: textContent,
          title: 'Text Block',
        });
      } else {
        const content: ProjectContent = {
          type: 'text',
          data: textContent,
          title: 'Text Block',
        };

        if (insertPosition !== null) {
          addProjectAtPosition(content, insertPosition);
          setInsertPosition(null);
        } else {
          addProject(content);
        }
      }
      setTextContent('');
    }

    setAddingText(false);
    setEditingTextId(null);
  };

  const handleEditText = (id: string, content: string) => {
    setTextContent(content);
    setEditingTextId(id);
    setAddingText(true);
  };

  const handleSaveReorder = (newProjects: ProjectItem[]) => {
    setProjects(newProjects);
  };

  const handleEditorSave = () => {
    handleAddText();
  };

  const handleInsertAtPosition = (position: number) => {
    setInsertPosition(position);
    setTextContent('');
  };

  // Helper function to get upload progress based on content type
  const getUploadProgress = (contentType: string) => {
    return contentType === 'image' ? imageUploadProgress : videoUploadProgress;
  };

  // Helper function to render text editor at specific position
  const renderTextEditorAtPosition = (position: number) => {
    if (addingText && insertPosition === position && !editingTextId) {
      return (
        <div
          ref={editorRef}
          className="bg-white rounded-lg p-4 border shadow-sm mb-2"
        >
          <RichTextEditor
            value={textContent}
            onChange={setTextContent}
            placeholder="Write your new content here..."
            autoFocus
            className="max-w-none"
          />
          <div className="flex justify-end mt-4 gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setAddingText(false);
                setTextContent('');
                setInsertPosition(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddText}
              disabled={!textContent.trim() || textContent === '<p></p>'}
            >
              Add Text
            </Button>
          </div>
        </div>
      );
    }
    return null;
  };

  const projectImages = projects
    .filter((p) => p.content.type === 'image' && p.content.data)
    .map((p) => p.content.data as string);

  const handleUploadCover = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        resolve(imageUrl);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <section className="grid mt-7 md:[grid-template-columns:1fr_265px] gap-8 mx-auto px-4">
      <div className="">
        <div className="flex justify-between items-center mb-6 ">
          {isMobile ? (
            <button onClick={() => router.back()}>
              <CiCircleChevLeft size={34} className="text-[#1A202C]" />
            </button>
          ) : (
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="px-4 grid place-items-center !h-[44px]"
            >
              Back
            </Button>
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="bg-[#F7F5F4] px-4 grid place-items-center h-[44px]"
            >
              Cancel
            </Button>
            <Button
              disabled={!projectTitle.trim()}
              className="secondary-btn-gradient px-4 grid place-items-center !h-[44px]"
              onClick={() => setOpen(true)}
            >
              Continue
            </Button>
          </div>
        </div>
        <div>
          <Input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            className="border-0 border-b rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-b-2 focus-visible:border-blue-500 px-0 py-1 w-full bg-transparent placeholder:font-md placeholder:text-xl"
            placeholder="Give me a title"
          />
        </div>

        <div className="md:hidden flex justify-end mb-3 mt-8">
          <button onClick={() => setIsDrawerOpen(true)}>
            <Image
              src="/assets/open.svg"
              alt="open icon"
              width={40}
              height={40}
            />
          </button>
        </div>
        <div className="bg-white px-8 py-6 md:px-14 md:py-9 shadow ">
          <div className="max-w-5xl mx-auto ">
            <DndProvider backend={HTML5Backend}>
              <div className="space-y-2">
                {/* Render text editor at position 0 (before all items) */}
                {renderTextEditorAtPosition(0)}

                {projects.map((project, index) => (
                  <React.Fragment key={project.id}>
                    <HoverInsert
                      onInsertAbove={() => handleInsertAtPosition(index)}
                      onInsertBelow={() => handleInsertAtPosition(index + 1)}
                      onImageSelected={handleImageSelected}
                      onVideoSelected={handleVideoSelected}
                      onAudioSelected={handleAudioSelected}
                      setAddingText={setAddingText}
                      onTextAdd={() => setAddingText(true)}
                    >
                      <ProjectItems
                        id={project.id}
                        index={index}
                        content={project.content}
                        moveProject={moveProject}
                        updateProject={updateProject}
                        removeProject={removeProject}
                        setShowRearrangeModal={setShowRearrangeModal}
                        setTextContent={setTextContent}
                        textContent={textContent}
                        isDeleting={deletingProjects.has(project.id)}
                        isUploadingImg={
                          uploadingProjects.has(project.id) &&
                          project.content.type === 'image'
                        }
                        isUploadingVideo={
                          uploadingProjects.has(project.id) &&
                          project.content.type === 'video'
                        }
                        uploadImgProgress={imageUploadProgress}
                        uploadVideoProgress={videoUploadProgress}
                        className="relative p-4 bg-white rounded-lg transition-all "
                        isEditing={editingTextId === project.id}
                        onTextDoubleClick={() => {
                          if (project.content.type === 'text') {
                            setTextContent(project.content.data || '');
                            setEditingTextId(project.id);
                          }
                        }}
                        onEditClick={() => {
                          if (project.content.type === 'text') {
                            setTextContent(project.content.data || '');
                            setEditingTextId(project.id);
                          }
                        }}
                        onCancelEditing={() => {
                          setEditingTextId(null);
                        }}
                        onSaveEditing={() => {
                          if (textContent.trim() && textContent !== '<p></p>') {
                            updateProject(project.id, {
                              type: 'text',
                              data: textContent,
                              title: 'Text Block',
                            });
                          }
                          setEditingTextId(null);
                        }}
                        onReplaceImage={(file) =>
                          handleReplaceImage(file, project.id)
                        }
                        onReplaceVideo={(file) =>
                          handleReplaceVideo(file, project.id)
                        }
                      />
                    </HoverInsert>

                    {/* Render text editor after each item if needed */}
                    {renderTextEditorAtPosition(index + 1)}
                  </React.Fragment>
                ))}

                {/* Insert zone at the end (only show if no projects exist) */}
                {projects.length === 0 && (
                  <div className="relative h-16 group flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleInsertAtPosition(0)}
                      className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
                      title="Add your first content"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                    <span className="ml-3 text-gray-500">
                      Add your first content
                    </span>
                  </div>
                )}

                {/* Only render the bottom editor for non-positioned additions */}
                {addingText && insertPosition === null && !editingTextId && (
                  <div
                    ref={editorRef}
                    className="bg-white rounded-lg p-4 border shadow-sm"
                  >
                    <RichTextEditor
                      value={textContent}
                      onChange={setTextContent}
                      placeholder="Write your new content here..."
                      autoFocus
                      className="max-w-none"
                    />
                    <div className="flex justify-end mt-4 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setAddingText(false);
                          setTextContent('');
                          setInsertPosition(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddText}
                        disabled={
                          !textContent.trim() || textContent === '<p></p>'
                        }
                      >
                        Add Text
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </DndProvider>
          </div>
        </div>
      </div>

      <AddContentPanel
        handleImageSelected={handleImageSelected}
        setAddingText={(adding) => {
          if (adding) {
            setTextContent('');
            setInsertPosition(null); // Reset insert position when adding normally
          }
          setAddingText(adding);
        }}
        handleVideoSelected={handleVideoSelected}
        handleAudioSelected={handleAudioSelected}
        setTextContent={setTextContent}
      />

      <ReorderModal
        isOpen={showRearrangeModal}
        onClose={() => setShowRearrangeModal(false)}
        projects={projects}
        onSave={handleSaveReorder}
      />
      <AddContentDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setInsertPosition(null); // Reset insert position when drawer closes
        }}
        setAddingText={(adding) => {
          if (adding) {
            setTextContent('');
          }
          setAddingText(adding);
        }}
        handleImageSelected={handleImageSelected}
        handleVideoSelected={handleVideoSelected}
        setTextContent={setTextContent}
        onAudioAdd={() => console.log('Audio clicked')}
        onEmbedAdd={() => console.log('Embed clicked')}
        onSocialLinksAdd={() => console.log('Social links clicked')}
      />
      <PublishProjectModal
        open={open}
        onClose={() => setOpen(false)}
        projectData={projectData}
        onPublish={handlePublishProject}
        onSaveDraft={handleSaveDraft}
        setShowCoverModal={setShowCoverModal}
      />
      <CoverPhotoModal
        open={showCoverModal}
        setOpen={setOpen}
        onClose={() => setShowCoverModal(false)}
        images={projectImages}
        currentCover={projectData.coverImage || ''}
        onSelect={(imageUrl) => {
          setProjectData((prev) => ({ ...prev, coverImage: imageUrl }));
        }}
        onUpload={handleUploadCover}
      />
    </section>
  );
};

export default PortfolioBuilder;
