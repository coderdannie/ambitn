import ProjectUploadTab from '@/components/modules/Portfolio/ProjectUploadTab';
import { AiOutlinePlusCircle } from 'react-icons/ai';

const page = () => {
  return (
    <div>
      <div className="flex justify-between items-center mt-5">
        <h4 className="font-semibold text-lg md:text-2xl">My Portfolio</h4>
        <button className="secondary-btn !h-[44px] !w-fit px-3 text-sm flex gap-1 items-center">
          <AiOutlinePlusCircle size={20} className="font-bold" /> Share work
        </button>
      </div>
      <ProjectUploadTab />
    </div>
  );
};
export default page;
