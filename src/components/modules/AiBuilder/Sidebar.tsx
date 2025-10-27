import Image from "next/image";
import React from "react";

const Sidebar = () => {
  return (
    <aside className="h-full relative  border-r border-[#0000001A] z-20 hidden md:block flex-shrink-0 overflow-y-auto w-74 ">
      <div className=" pt-[14px] pb-9 px-6">
        <Image
          src="/assets/logo.png"
          alt="ambitn logo"
          className="w-[120px] h-auto"
          width={140}
          height={40}
        />
      </div>
      <div className="pt-7 pb-6 border-t px-6"></div>
    </aside>
  );
};

export default Sidebar;
