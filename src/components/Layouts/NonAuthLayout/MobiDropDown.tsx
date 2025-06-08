import { navLinks } from "@/components/common/constants";
import React, { useEffect } from "react";

const MobiDropDown = ({ isOpen, setIsOpen }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);
  return (
    <>
      <div>
        {isOpen && (
          <div className="mobi-drop-down hide-logo transition-all duration-300 ease-in-out btn-gradient wrapper overflow-hidden top-[70px] inset-0 absolute z-[100]">
            <ul className="text-center text-white">
              {navLinks.map((link) => {
                return (
                  <li
                    className="leading-[4] first:pt-[3rem] font-bold text-[1rem]"
                    key={link.id}
                  >
                    {link.name}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default MobiDropDown;
