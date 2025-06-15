import { Edit3, Trash2, Share2, MessageCircle } from 'lucide-react';
import { TiMessages } from 'react-icons/ti';

interface IconToolbarProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  onComment?: () => void;
}

export default function IconToolbar({
  onEdit,
  onDelete,
  onShare,
  onComment,
}: IconToolbarProps) {
  return (
    <div className="flex items-center justify-center gap-4 p-4">
      <button
        onClick={onEdit}
        className="w-[46px] h-[46px] rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center text-gray-700 hover:text-gray-900 shadow-sm"
        title="Edit"
      >
        <Edit3 size={20} strokeWidth={1.5} />
      </button>

      <button
        onClick={onDelete}
        className="w-[46px] h-[46px] rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center text-red-500 hover:text-red-600 shadow-sm"
        title="Delete"
      >
        <Trash2 size={20} strokeWidth={1.5} />
      </button>

      <button
        onClick={onShare}
        className="w-[46px] h-[46px] rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center text-gray-700 hover:text-gray-900 shadow-sm"
        title="Share"
      >
        <Share2 size={20} strokeWidth={1.5} />
      </button>

      <button
        onClick={onComment}
        className="w-[46px] h-[46px] rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center text-gray-700 hover:text-gray-900 shadow-sm"
        title="Comment"
      >
        <TiMessages size={20} strokeWidth={1.5} />
      </button>
    </div>
  );
}
