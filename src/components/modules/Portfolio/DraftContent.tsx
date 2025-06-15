import { motion } from 'framer-motion';
import { Clock, Edit } from 'lucide-react';

const mockDrafts = [
  { id: 1, title: 'Homepage Redesign', lastEdited: '2 days ago', progress: 75 },
  { id: 2, title: 'Mobile App UI Kit', lastEdited: '1 week ago', progress: 40 },
  { id: 3, title: 'Brand Guidelines', lastEdited: '3 days ago', progress: 90 },
  {
    id: 4,
    title: 'Dashboard Components',
    lastEdited: 'Just now',
    progress: 20,
  },
];

// Draft Card Component
// const DraftCard = ({ draft }) => (
//   <motion.div
//     className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow transition-all"
//     whileHover={{ y: -4 }}
//     initial={{ opacity: 0, y: 20 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.3 }}
//   >
//     <div className="flex justify-between items-start mb-3">
//       <h3 className="font-medium text-gray-900">{draft.title}</h3>
//       <button className="text-purple-600 hover:text-purple-800">
//         <Edit size={16} />
//       </button>
//     </div>

//     <div className="mt-4">
//       <div className="flex justify-between text-sm text-gray-500 mb-2">
//         <span>Progress</span>
//         <span>{draft.progress}%</span>
//       </div>
//       <div className="w-full bg-gray-200 rounded-full h-1.5">
//         <div
//           className="bg-purple-600 h-1.5 rounded-full"
//           style={{ width: `${draft.progress}%` }}
//         />
//       </div>
//     </div>

//     <div className="flex items-center mt-4 text-xs text-gray-500">
//       <Clock size={14} className="mr-1" />
//       <span>Last edited {draft.lastEdited}</span>
//     </div>
//   </motion.div>
// );

const DraftContent = () => (
  <motion.div
    className="mt-8"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">Your Drafts</h2>
      <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
        View all
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* {mockDrafts.map((draft) => (
        <DraftCard key={draft.id} draft={draft} />
      ))} */}
    </div>
  </motion.div>
);
export default DraftContent;
