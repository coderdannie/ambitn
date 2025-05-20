'use client';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import dynamic from 'next/dynamic';
import { v4 as uuidv4 } from 'uuid';
import Modal from 'react-modal';

// Types
type ContentType = 'image' | 'text' | 'video';
type ProjectContent = {
  type: ContentType;
  data: string;
  title?: string;
};
type ProjectItem = {
  id: string;
  content: ProjectContent;
};
type DropItem = {
  id: string;
  index: number;
};

// Quill Editor (lazy loaded)
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});
import 'react-quill/dist/quill.snow.css';

const ItemTypes = {
  PROJECT: 'project',
};

// ThumbnailItem for the rearrange modal
const ThumbnailItem: React.FC<{
  id: string;
  content: ProjectContent;
  index: number;
  moveThumbnail: (dragIndex: number, hoverIndex: number) => void;
}> = ({ id, content, index, moveThumbnail }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.PROJECT,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.PROJECT,
    hover(item: DropItem, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveThumbnail(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`flex items-center p-3 mb-2 bg-white rounded-lg shadow-sm border border-gray-200 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className="mr-3 text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded overflow-hidden">
        {content.type === 'image' && (
          <img
            src={content.data}
            alt="Thumbnail"
            className="w-full h-full object-cover"
          />
        )}
        {content.type === 'text' && (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">T</span>
          </div>
        )}
        {content.type === 'video' && (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">V</span>
          </div>
        )}
      </div>
      <div className="ml-3 truncate">
        <p className="text-sm font-medium text-gray-900">
          {content.title || 'Untitled'}
        </p>
        <p className="text-xs text-gray-500 capitalize">{content.type}</p>
      </div>
    </div>
  );
};

// Project Item Component
const ProjectItem: React.FC<{
  id: string;
  content: ProjectContent;
  index: number;
  moveProject: (dragIndex: number, hoverIndex: number) => void;
  updateProject: (id: string, content: ProjectContent) => void;
  removeProject: (id: string) => void;
  setShowRearrangeModal: (show: boolean) => void;
}> = ({
  id,
  content,
  index,
  moveProject,
  updateProject,
  removeProject,
  setShowRearrangeModal,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.PROJECT,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.PROJECT,
    hover(item: DropItem, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveProject(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`relative p-6 mb-4 bg-white rounded-xl shadow-lg transition-all ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
      style={{ minHeight: '200px' }}
    >
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </button>

      {showOptions && (
        <div className="absolute right-0 top-10 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <div className="py-1">
            <button
              onClick={() => {
                setShowRearrangeModal(true);
                setShowOptions(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Rearrange Order
            </button>
            <button
              onClick={() => removeProject(id)}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {content.type === 'image' && (
        <div className="mb-4 overflow-hidden rounded-lg">
          <img
            src={content.data}
            alt={content.title || 'Project image'}
            className="w-full h-auto max-h-96 object-contain"
          />
        </div>
      )}

      {content.type === 'text' && (
        <div
          className="mb-4"
          dangerouslySetInnerHTML={{ __html: content.data }}
        />
      )}

      {content.type === 'video' && (
        <div className="mb-4 relative pt-[56.25%]">
          <iframe
            src={content.data}
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            allowFullScreen
            title={content.title || 'Project video'}
          />
        </div>
      )}

      {isEditingTitle ? (
        <input
          type="text"
          value={content.title || ''}
          onChange={(e) =>
            updateProject(id, { ...content, title: e.target.value })
          }
          onBlur={() => setIsEditingTitle(false)}
          onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
          autoFocus
          className="w-full p-2 border-b border-gray-200 focus:outline-none"
        />
      ) : (
        <h3
          onClick={() => setIsEditingTitle(true)}
          className="text-lg font-semibold cursor-text hover:text-blue-600"
        >
          {content.title || 'Untitled Project'}
        </h3>
      )}
    </div>
  );
};

// File input component
const FileInput: React.FC<{
  accept: string;
  onFileSelected: (file: File) => void;
}> = ({ accept, onFileSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelected(file);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-left flex items-center"
      >
        <span className="mr-3 text-xl">
          {accept.includes('image') ? '🖼️' : '🎬'}
        </span>
        <span>{accept.includes('image') ? 'Add Image' : 'Add Video'}</span>
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept={accept}
        className="hidden"
      />
    </>
  );
};

// Main Portfolio Builder Component
const PortfolioBuilder: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [textContent, setTextContent] = useState('');
  const [addingText, setAddingText] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showRearrangeModal, setShowRearrangeModal] = useState(false);
  const [tempProjects, setTempProjects] = useState<ProjectItem[]>([]);

  React.useEffect(() => {
    setTempProjects([...projects]);
  }, [projects]);

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
      addProject({
        type: 'text',
        data: textContent,
        title: 'Text Block',
      });
      setTextContent('');
    }
    setAddingText(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Main Content Area */}
        <div
          className={`flex-1 p-6 transition-all ${
            sidebarOpen ? 'ml-64' : 'ml-0'
          }`}
        >
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Forlio</h1>
            <p className="text-gray-600">Create your stunning portfolio</p>
          </header>

          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              {sidebarOpen ? 'Hide Panel' : 'Show Panel'}
            </button>
          </div>

          {/* Projects List - Single Column */}
          <DndProvider backend={HTML5Backend}>
            <div className="space-y-6">
              {projects.map((project, index) => (
                <ProjectItem
                  key={project.id}
                  id={project.id}
                  index={index}
                  content={project.content}
                  moveProject={moveProject}
                  updateProject={updateProject}
                  removeProject={removeProject}
                  setShowRearrangeModal={setShowRearrangeModal}
                />
              ))}

              {/* Text Editor (appears below existing content) */}
              {addingText && (
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Add Text</h3>
                    <button
                      onClick={() => setAddingText(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>
                  <ReactQuill
                    theme="snow"
                    value={textContent}
                    onChange={setTextContent}
                    className="mb-4 h-34"
                    placeholder="Write your content here..."
                  />
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setAddingText(false)}
                      className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddText}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add Text
                    </button>
                  </div>
                </div>
              )}
            </div>
          </DndProvider>
        </div>

        {/* Sidebar Panel */}
        {sidebarOpen && (
          <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg p-4 overflow-y-auto">
            <h2 className="text-xl font-bold mb-6 text-gray-800">
              Add Content
            </h2>
            <div className="space-y-3">
              <FileInput
                accept="image/*"
                onFileSelected={handleImageSelected}
              />
              <FileInput
                accept="video/*"
                onFileSelected={handleVideoSelected}
              />
              <button
                onClick={() => setAddingText(true)}
                className="w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-left flex items-center"
              >
                <span className="mr-3 text-xl">✏️</span>
                <span>Add Text</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Rearrange Modal */}
      <Modal
        isOpen={showRearrangeModal}
        onRequestClose={() => setShowRearrangeModal(false)}
        className="modal"
        overlayClassName="modal-overlay"
        contentLabel="Rearrange Items"
      >
        <div className="bg-white rounded-lg max-w-md mx-auto p-6 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Rearrange Items</h2>
            <button
              onClick={() => setShowRearrangeModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <DndProvider backend={HTML5Backend}>
            <div className="space-y-2">
              {tempProjects.map((project, index) => (
                <ThumbnailItem
                  key={project.id}
                  id={project.id}
                  index={index}
                  content={project.content}
                  moveThumbnail={(dragIndex, hoverIndex) => {
                    const newProjects = [...tempProjects];
                    const [removed] = newProjects.splice(dragIndex, 1);
                    newProjects.splice(hoverIndex, 0, removed);
                    setTempProjects(newProjects);
                  }}
                />
              ))}
            </div>
          </DndProvider>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setShowRearrangeModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setProjects([...tempProjects]);
                setShowRearrangeModal(false);
              }}
              className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700"
            >
              Save Order
            </button>
          </div>
        </div>
      </Modal>

      <style jsx global>{`
        .modal {
          position: absolute;
          top: 50%;
          left: 50%;
          right: auto;
          bottom: auto;
          transform: translate(-50%, -50%);
          width: 90%;
          max-width: 500px;
          border: none;
          background: transparent;
          overflow: auto;
          outline: none;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1000;
        }
      `}</style>
    </div>
  );
};

export default PortfolioBuilder;
