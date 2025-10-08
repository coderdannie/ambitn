import React from "react";
import Image from "next/image";

const SubscriptionHead = () => {
  return (
    <>
      <div className="flex items-center">
        <div className="border-[#D0D5DD] border-[1px] rounded-[.5rem] p-[.7rem] cursor-pointer">
          <Image
            src="/assets/back-arrow.svg"
            className=""
            alt=""
            width={5}
            height={5}
          />
        </div>
        <div className="ml-[1rem]">
          <h2 className="text-[#000000] font-semibold">Subscription</h2>
        </div>
      </div>
    </>
  );
};

export default SubscriptionHead;
