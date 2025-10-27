import React, { useState } from "react";
import Image from "next/image";
import { frameCards } from "@/components/common/constants";
import { Key } from "lucide-react";
import { CiSearch } from "react-icons/ci";
import LoginModal from "./LoginModal";

const Frame = ({
  showModal,
  setShowModal,
  showScreenModal,
  setShowScreenModal,
}) => {
  const [onClose, setOnClose] = useState(false);
  const handleClose = () => {
    setOnClose(true);
    setShowScreenModal(false);
  };
  return (
    <>
      <div className="wrapper mt-[6rem] relative">
        <div className="md:flex gap-[10px] items-center justify-between mb-[3rem]">
          <div className="relative flex-1">
            <div className="absolute top-[12px] left-[10px]">
              <CiSearch />
            </div>
            <input
              type="text"
              placeholder="Search the creative world at work"
              className=" flex-1 border-[#D0D5DD] border-[1px] rounded-[.5rem] w-full h-[40px] pl-[1.7rem]"
            />
          </div>

          <div className="mobile-margin-top">
            <div className="rounded-[.2rem] btn-gradient flex mobi-center items-center p-[.5rem]">
              <div>
                <Image src="/assets/filter.svg" alt="" width={15} height={15} />
                <Image src="/assets/filter.svg" alt="" width={15} height={15} />
                <Image src="/assets/filter.svg" alt="" width={15} height={15} />
              </div>

              <span className="text-white  pl-[.3rem]">Filter</span>
            </div>
          </div>
        </div>

        <div className="frames">
          <div className="frameCards">
            {frameCards.map((card) => {
              return (
                <div key={card.id} className="cursor-pointer">
                  <Image src={card.img} alt="" width={400} height={400} />
                  {/* <div>
                    <div>
                      <p>{card.text}</p>
                      <p>{card.name}</p>
                    </div>
                    <div>
                      <div className="like">likes</div>
                      <div className="views">views</div>
                    </div>
                  </div> */}
                </div>
              );
            })}
          </div>
        </div>
        {/* {showScreenModal && <LoginModal handleClose={handleClose} />} */}
        {/* <LoginModal onOpenChange={setShowScreenModal} /> */}
      </div>
    </>
  );
};

export default Frame;
