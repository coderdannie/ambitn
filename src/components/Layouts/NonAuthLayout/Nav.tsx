import React from "react";
import { navLinks } from "@/components/common/constants";
import { GiHamburgerMenu } from "react-icons/gi";
import { Import } from "lucide-react";
import Image from "next/image";
import { IoArrowForwardSharp } from "react-icons/io5";
import LoginModal from "./LoginModal";

const Nav = ({
  handleClickOpen,
  handleShowModal,
  showModal,
  setShowModal,
  handleCloseModal,
  handleShowScreenModal,
}) => {
  return (
    <div className="wrapper">
      <div className="flex items-center justify-between">
        <div className="md:hidden cursor-pointer" onClick={handleClickOpen}>
          <GiHamburgerMenu />
        </div>
        <div className="mobi-margin ">
          <div>
            <Image
              src="/assets/new logo.png"
              alt="logo"
              width={100}
              height={100}
              className=""
            />
          </div>
          {/* <div className="font-bold text-[1.5rem]">Forlio</div> */}
        </div>
        <div
          className=""
          onMouseEnter={handleShowModal}
          onMouseLeave={handleCloseModal}
        >
          <ul className="flex relative hide gap-[20px] nav-list">
            {navLinks.map((link) => {
              const { name } = link;
              return (
                <li
                  key={link.id}
                  className="cursor-pointer border-b-2 border-transparent hover:border-[#000000] pb-1 transition-all duration-300"
                >
                  {name}
                </li>
              );
            })}
            {showModal && (
              <div className="sub-nav-link bg-[#FFFFFF] rounded-[.7rem] modal-gradient p-[1.2rem] w-[300px] height-[139px] absolute z-[100] left-[50px] top-[29px]">
                <div
                  className="flex items-center justify-between gap-3 bg-[#FBFDFE] border-solid border-[1px] border-[#E4E4E4] cursor-pointer rounded-[.5rem] p-[.7rem]"
                  onClick={handleShowScreenModal}
                >
                  <div>
                    <Image
                      src="/assets/start-icon.png"
                      alt="start icon"
                      width={50}
                      height={50}
                      className=""
                    />
                  </div>
                  <div>
                    <h2 className="text-[14px] font-bold">
                      Start from scratch
                    </h2>
                    <p className="text-[10px]">Build a complete case study</p>
                  </div>
                  <div className="forward-arrow">
                    <IoArrowForwardSharp />
                  </div>
                </div>

                <div
                  className="flex items-center justify-between gap-3 bg-[#FBFDFE] border-solid border-[1px] border-[#E4E4E4] cursor-pointer rounded-[.5rem] p-[.7rem] mt-[1rem]"
                  onClick={handleShowScreenModal}
                >
                  <div>
                    <Image
                      src="/assets/create-icon.png"
                      alt=""
                      className=""
                      width={50}
                      height={50}
                    />
                  </div>
                  <div>
                    <h2 className="text-[14px] font-bold">
                      Create case study with AI
                    </h2>
                    <p className="text-[10px]">
                      Use our AI assistant to publish your work{" "}
                    </p>
                  </div>
                  <div className="forward-arrow">
                    <IoArrowForwardSharp />
                  </div>
                </div>
              </div>
            )}
          </ul>
        </div>

        <div className="sign-ups hide-desktop">
          <button>Sign Up</button>
          <button className="btn-gradient ml-[.5rem] rounded-[.2rem] text-white p-[.5rem]">
            Sign In
          </button>
        </div>
      </div>
      {/* <LoginModal open={} onOpenChange={} /> */}
    </div>
  );
};

export default Nav;
