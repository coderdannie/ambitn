'use client';

import React from 'react';
import Modal from 'react-modal';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ProjectItem } from '@/types/portfolio';
import ThumbnailItem from '@/components/modules/PortfolioBuilder/ThumbnailItem';

interface ReorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectItem[];
  onSave: (newProjects: ProjectItem[]) => void;
}

const ReorderModal: React.FC<ReorderModalProps> = ({
  isOpen,
  onClose,
  projects,
  onSave,
}) => {
  const [tempProjects, setTempProjects] = React.useState<ProjectItem[]>([]);

  React.useEffect(() => {
    setTempProjects([...projects]);
  }, [projects]);

  const moveThumbnail = (dragIndex: number, hoverIndex: number) => {
    const newProjects = [...tempProjects];
    const [removed] = newProjects.splice(dragIndex, 1);
    newProjects.splice(hoverIndex, 0, removed);
    setTempProjects(newProjects);
  };

  const handleSave = () => {
    onSave(tempProjects);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal"
      overlayClassName="modal-overlay"
      contentLabel="Rearrange Items"
    >
      <div className="bg-white rounded-lg max-w-md mx-auto p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Rearrange Items</h2>
          <button
            onClick={onClose}
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
          <div className="space-y-2 cursor-grab">
            {tempProjects.map((project, index) => (
              <ThumbnailItem
                key={project.id}
                id={project.id}
                index={index}
                content={project.content}
                moveThumbnail={moveThumbnail}
              />
            ))}
          </div>
        </DndProvider>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700"
          >
            Save Order
          </button>
        </div>
      </div>

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
    </Modal>
  );
};

export default ReorderModal;
