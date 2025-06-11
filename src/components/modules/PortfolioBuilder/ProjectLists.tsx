'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Plus } from 'lucide-react';
import ProjectItems from '@/components/modules/PortfolioBuilder/ProjectItem';

import TextEditor from './TextEditor';
import { ProjectItem } from '@/types/portfolio';

const HoverInsert = dynamic(
  () => import('@/components/modules/PortfolioBuilder/HoverInsert'),
  { ssr: false }
);

interface ProjectsListProps {
  projects: ProjectItem[];
  moveProject: (dragIndex: number, hoverIndex: number) => void;
  updateProject: (id: string, content: any) => void;
  removeProject: (id: string) => void;
  setShowRearrangeModal: (show: boolean) => void;
  textContent: string;
  setTextContent: (content: string) => void;
  addingText: boolean;
  setAddingText: (adding: boolean) => void;
  editingTextId: string | null;
  setEditingTextId: (id: string | null) => void;
  insertPosition: number | null;
  setInsertPosition: (position: number | null) => void;
  deletingProjects: Set<string>;
  uploadingProjects: Set<string>;
  imageUploadProgress: number;
  videoUploadProgress: number;
  getUploadProgress: (contentType: string) => number;
  onImageSelected: (file: File) => void;
  onVideoSelected: (file: File) => void;
  onAudioSelected: (file: File) => void;
  onReplaceImage: (file: File, projectId: string) => void;
  onReplaceVideo: (file: File, projectId: string) => void;
  onReplaceAudio: (file: File, projectId: string) => void;
  onAddText: () => void;
  editorRef: React.RefObject<HTMLDivElement> | null;
}

const ProjectsList = ({
  projects,
  moveProject,
  updateProject,
  removeProject,
  setShowRearrangeModal,
  textContent,
  setTextContent,
  addingText,
  setAddingText,
  editingTextId,
  setEditingTextId,
  insertPosition,
  setInsertPosition,
  deletingProjects,
  uploadingProjects,
  imageUploadProgress,
  videoUploadProgress,
  getUploadProgress,
  onImageSelected,
  onVideoSelected,
  onAudioSelected,
  onReplaceImage,
  onReplaceVideo,
  onReplaceAudio,
  onAddText,
  editorRef,
}: ProjectsListProps) => {
  const handleInsertAtPosition = (position: number) => {
    setInsertPosition(position);
    setTextContent('');
  };

  const renderTextEditorAtPosition = (position: number) => {
    if (addingText && insertPosition === position && !editingTextId) {
      return (
        <div
          id={`text-editor-${position}`}
          className="text-editor-container"
          data-scroll-target="true"
        >
          <TextEditor
            ref={editorRef}
            textContent={textContent}
            setTextContent={setTextContent}
            onSave={onAddText}
            onCancel={() => {
              setAddingText(false);
              setTextContent('');
              setInsertPosition(null);
            }}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white px-8 py-6 md:px-14 md:py-9 shadow">
      <div className="max-w-5xl mx-auto">
        <DndProvider backend={HTML5Backend}>
          <div className="space-y-2 projects-container">
            {renderTextEditorAtPosition(0)}

            {projects.map((project, index) => (
              <React.Fragment key={project.id}>
                <HoverInsert
                  onInsertAbove={() => handleInsertAtPosition(index)}
                  onInsertBelow={() => handleInsertAtPosition(index + 1)}
                  onImageSelected={onImageSelected}
                  onVideoSelected={onVideoSelected}
                  onAudioSelected={onAudioSelected}
                  setAddingText={setAddingText}
                  onTextAdd={() => setAddingText(true)}
                >
                  <div
                    id={`project-${project.id}`}
                    data-project-index={index}
                    className="project-item-wrapper"
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
                      isUploadingAudio={
                        uploadingProjects.has(project.id) &&
                        project.content.type === 'audio'
                      }
                      uploadImgProgress={imageUploadProgress}
                      uploadVideoProgress={videoUploadProgress}
                      getUploadProgress={getUploadProgress}
                      className="relative p-4 bg-white rounded-lg transition-all"
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
                        onReplaceImage(file, project.id)
                      }
                      onReplaceVideo={(file) =>
                        onReplaceVideo(file, project.id)
                      }
                      onReplaceAudio={(file) =>
                        onReplaceAudio(file, project.id)
                      }
                    />
                  </div>
                </HoverInsert>

                {renderTextEditorAtPosition(index + 1)}
              </React.Fragment>
            ))}

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

            {addingText && insertPosition === null && !editingTextId && (
              <div id="text-editor-end" className="text-editor-container">
                <TextEditor
                  ref={editorRef}
                  textContent={textContent}
                  setTextContent={setTextContent}
                  onSave={onAddText}
                  onCancel={() => {
                    setAddingText(false);
                    setTextContent('');
                    setInsertPosition(null);
                  }}
                />
              </div>
            )}
          </div>
        </DndProvider>
      </div>
    </div>
  );
};

export default ProjectsList;
