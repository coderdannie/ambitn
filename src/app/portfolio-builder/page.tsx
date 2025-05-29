'use client';

import ProjectItems from '@/components/modules/PortfolioBuilder/ProjectItem';
import { Button } from '@/components/ui/button';
import { ProjectContent, ProjectItem } from '@/types/portfolio';
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

const PortfolioBuilder = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [textContent, setTextContent] = useState('');
  const [addingText, setAddingText] = useState(false);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [showRearrangeModal, setShowRearrangeModal] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const [projectTitle, setProjectTitle] = useState('');

  const { isMobile } = useWindowSize();
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);

  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    tags: [],
    categories: [],
    coverImage: '',
    needsFeedback: false,
  });

  // Add overflow hidden to html when modal is open
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
    const coverImage = firstImage ? firstImage.content.data : '';

    setProjectData((prev) => ({
      ...prev,
      title: projectTitle || 'Untitled Project',
      coverImage,
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

  const removeProject = useCallback((id: string) => {
    setProjects((prevProjects) =>
      prevProjects.filter((project) => project.id !== id)
    );
  }, []);

  const addProject = useCallback((content: ProjectContent) => {
    setProjects((prevProjects) => [...prevProjects, { id: uuidv4(), content }]);
  }, []);

  const handleImageSelected = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      addProject({
        type: 'image',
        data: reader.result as string,
        title: file.name.replace(/\.[^/.]+$/, ''),
      });
    };
    reader.readAsDataURL(file);
  };

  const handleVideoSelected = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      addProject({
        type: 'video',
        data: URL.createObjectURL(file),
        title: file.name.replace(/\.[^/.]+$/, ''),
      });
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
        addProject({
          type: 'text',
          data: textContent,
          title: 'Text Block',
        });
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

  const handleInsertText = () => {
    setTextContent('');
    setAddingText(true);
    setEditingTextId(null);
  };

  const projectImages = projects
    .filter((p) => p.content.type === 'image')
    .map((p) => p.content.data);

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
              <div className="space-y-3">
                {projects.map((project, index) => (
                  <ProjectItems
                    key={project.id}
                    id={project.id}
                    index={index}
                    content={project.content}
                    moveProject={moveProject}
                    updateProject={updateProject}
                    removeProject={removeProject}
                    setShowRearrangeModal={setShowRearrangeModal}
                    setTextContent={setTextContent}
                    textContent={textContent}
                    className="relative p-4 bg-white rounded-lg transition-all"
                    onTextClick={() => {
                      if (project.content.type === 'text') {
                        handleEditText(project.id, project.content.data);
                      }
                    }}
                  />
                ))}

                {addingText && (
                  <div
                    ref={editorRef}
                    className="bg-white rounded-lg p-4 border shadow-sm"
                  >
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
                          setAddingText(false);
                          setEditingTextId(null);
                          setTextContent('');
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleEditorSave}
                        disabled={
                          !textContent.trim() || textContent === '<p></p>'
                        }
                      >
                        {editingTextId ? 'Update' : 'Add'} Text
                      </Button>
                    </div>
                  </div>
                )}

                {projects.length > 0 && (
                  <InsertMoreContent
                    onImageSelected={handleImageSelected}
                    onVideoSelected={handleVideoSelected}
                    onTextAdd={handleInsertText}
                  />
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
          }
          setAddingText(adding);
        }}
        handleVideoSelected={handleVideoSelected}
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
        onClose={() => setIsDrawerOpen(false)}
        setAddingText={setAddingText}
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
