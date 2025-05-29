import React from "react";
import Image from "next/image";
import { frameCards } from "@/components/common/constants";
import { Key } from "lucide-react";

const Frame = () => {
  return (
    <>
      <div className="wrapper mt-[2rem]">
        <div className="flex gap-[10px] items-center justify-between">
          <input
            type="text"
            placeholder="Search the creative world at work"
            className=" flex-1 border-[#D0D5DD] border-[1px] rounded-[.5rem] w-[500px] h-[40px] pl-[1rem]"
          />
          <div>
            <div className="rounded-[.2rem] btn-gradient flex items-center p-[.5rem]">
              {/* <Image src="" alt="" width={20} height={20} /> */}
              <span className="text-white pl-[.3rem]">Filter</span>
            </div>
          </div>
        </div>
        <div className="frames wrapper">
          <div className="frameCards">
            {frameCards.map((card) => {
              return (
                <div key={card.id} className="cursor-pointer">
                  <Image src={card.img} alt="" width={350} height={350} />
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
      </div>
    </>
  );
};

export default Frame;
