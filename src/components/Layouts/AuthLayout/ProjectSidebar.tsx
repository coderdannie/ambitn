import Image from "next/image";
import React from "react";

interface ProjectSidebarProps {
  children?: React.ReactNode;
}

const ProjectSidebar: React.FC<ProjectSidebarProps> = ({ children }) => {
  return (
    <aside className="h-full relative z-20 hidden md:block flex-shrink-0 overflow-y-auto w-74 ">
      <div className=" py-[14px] px-6">
        <Image
          src="/assets/logo.png"
          alt="ambitn logo"
          className="w-[120px] h-auto"
          width={140}
          height={40}
        />
      </div>
      <div className="pt-7 pb-6 bg-[#FBFDFE] px-6">
        <h2 className="text-[#1A202C] text-xl font-semibold">Add Content </h2>
        <p className="pt-3 font-medium text-sm">
          Build your case study by adding different type of content blocks
        </p>
        {children}
      </div>

      <div className="bg-gradient-to-b from-[#1A202C] to-[#441C31] text-white pt-2 pb-4 px-4 mx-6 mt-4 rounded-lg">
        <h5 className="font-semibold pb-3"> Pro tips</h5>
        <ul className="text-sm font-medium grid gap-1 list-disc">
          <li>Drag blocks to reorder them</li>
          <li>Hover on any block to edit it</li>
          <li>Use our AI to make it faster</li>
        </ul>
      </div>
    </aside>
  );
};

export default ProjectSidebar;
