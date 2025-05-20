import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ThumbnailItemProps, DropItem } from '@/types/portfolio';

const ThumbnailItem: React.FC<ThumbnailItemProps> = ({
  id,
  content,
  index,
  moveThumbnail,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'PROJECT', // This should ideally come from a constants file
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'PROJECT',
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

  const renderThumbnailContent = () => {
    switch (content.type) {
      case 'image':
        return (
          <img
            src={content.data}
            alt="Thumbnail"
            className="w-full h-full object-cover"
          />
        );
      case 'text':
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">T</span>
          </div>
        );
      case 'video':
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">V</span>
          </div>
        );
      default:
        return null;
    }
  };

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
        {renderThumbnailContent()}
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

export default ThumbnailItem;
