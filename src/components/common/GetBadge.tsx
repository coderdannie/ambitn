import React from "react";
import { IoMdArrowForward } from "react-icons/io";

const GetBadge = () => {
  return (
    <div className="bg-gradient-to-r from-[#000000] to-[#441C31] text-white pt-2 mt-12 rounded-lg">
      <h5 className="font-medium pb-3 pt-1 px-4 ">
        {" "}
        Get your portfolio website done in minites
      </h5>
      <div className="flex items-center">
        <img src="/assets/side.webp.png" alt="" />
        <div className="flex items-center justify-center gap-1 text-sm font-semibold">
          Get 25% off first year <IoMdArrowForward />
        </div>
      </div>
    </div>
  );
};

export default GetBadge;
