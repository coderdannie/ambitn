'use client';

import ProjectItems from '@/components/modules/PortfolioBuilder/ProjectItem';
import { Button } from '@/components/ui/button';
import { ProjectContent, ProjectItem } from '@/types/portfolio';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ReorderModal from '@/components/modals/ReorderModal';
import RichTextEditor from '@/components/common/RichTextEditor';
import AddContentPanel from '@/components/modules/PortfolioBuilder/AddContentPanel';

const PortfolioBuilder = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [textContent, setTextContent] = useState('');
  const [addingText, setAddingText] = useState(false);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [showRearrangeModal, setShowRearrangeModal] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  console.log(textContent);
  // Handle clicks outside the editor
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        addingText &&
        editorRef.current &&
        !editorRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('.dropdown-menu-content')
      ) {
        handleAddText();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [addingText, textContent]);

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
    if (textContent.trim()) {
      if (editingTextId) {
        // Update existing text
        updateProject(editingTextId, {
          type: 'text',
          data: textContent,
          title: 'Text Block',
        });
      } else {
        // Add new text
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

  return (
    <section className="grid mt-7 md:[grid-template-columns:1fr_265px] gap-8 mx-auto px-4">
      <div>
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="outline"
            className="px-4 grid place-items-center !h-[44px]"
          >
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="bg-[#F7F5F4] px-4 grid place-items-center h-[44px]"
            >
              Cancel
            </Button>
            <button className="secondary-btn px-4 grid place-items-center !h-[44px]">
              Continue
            </button>
          </div>
        </div>
        <div className="max-w-5xl mx-auto">
          <DndProvider backend={HTML5Backend}>
            <div className="space-y-2">
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

              {/* Text Editor */}
              {addingText && (
                <div ref={editorRef} className="bg-white rounded-lg p-4">
                  <RichTextEditor
                    value={textContent}
                    onChange={setTextContent}
                    placeholder="Write your content here..."
                    autoFocus
                  />
                </div>
              )}
            </div>
          </DndProvider>
        </div>
      </div>

      <AddContentPanel
        handleImageSelected={handleImageSelected}
        setAddingText={setAddingText}
        handleVideoSelected={handleVideoSelected}
      />

      <ReorderModal
        isOpen={showRearrangeModal}
        onClose={() => setShowRearrangeModal(false)}
        projects={projects}
        onSave={handleSaveReorder}
      />
    </section>
  );
};

export default PortfolioBuilder;
