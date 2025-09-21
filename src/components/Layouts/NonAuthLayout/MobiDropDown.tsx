import { navLinks } from "@/components/common/constants";
import React, { useEffect } from "react";

const MobiDropDown = ({ isOpen, setIsOpen }) => {
  useEffect(() => {
    const handleSize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    if (isOpen && window.innerWidth < 768) {
      document.body.classList.add("overflow-hidden");
      document.body.classList.add("overflow-x-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    window.addEventListener("resize", handleSize);
    return () => {
      window.removeEventListener("resize", handleSize);
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen, setIsOpen]);

  return (
    <>
      <div className="">
        <div
          className={`mobi-drop-down md:hidden transition-transform duration-500 ease-in-out  btn-gradient left-0 wrapper top-[70px] absolute inset-0 z-[100]
            ${isOpen ? "translate-x-0" : "translate-x-[100%]"}`}
        >
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
      </div>
    </>
  );
};

export default MobiDropDown;
