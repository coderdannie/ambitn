import ProjectUploadTab from "@/components/modules/Portfolio/ProjectUploadTab";
import Image from "next/image";
import Link from "next/link";
import { AiOutlinePlusCircle } from "react-icons/ai";

const page = () => {
  return (
    <div>
      {" "}
      <div className="h-[228px] relative">
        <Image
          src="/assets/coverphoto.png"
          width={100}
          height={100}
          alt="cover photo"
          className="w-full h-full object-cover"
        />
        <div className="relative mt-[-4rem] ml-4">
          <div className="w-[130px]  aspect-square bg-gray-200 rounded-full -mt-8 border-4 border-white shadow-sm overflow-hidden">
            <img
              src="/assets/profile-pic.png"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
      </div>
      {/* <div className="flex justify-between items-center">
        <Link
          href="/portfolio-builder"
          className="secondary-btn !h-[44px] !w-fit px-3 text-sm flex gap-1 items-center"
        >
          <AiOutlinePlusCircle size={20} className="font-bold" /> Upload Project
        </Link>
      </div> */}
      <div className="flex justify-between mt-20">
        <div>
          <h3 className="text-[#1A202C] font-medium text-lg md:text-2xl">
            Kehinde Falodi
          </h3>
          <div className="mt-4 grid gap-2">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/briefcase.svg"
                alt="briefcase icon"
                width={18}
                height={18}
              />
              <p className="font-semibold text-sm md:text-base">Ux thrive</p>
            </div>
            <div className="flex items-center gap-2">
              <Image
                src="/assets/location.svg"
                alt="briefcase icon"
                width={18}
                height={18}
              />
              <p className="font-semibold text-sm md:text-base">
                Lagos, Nigeria
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Image
                src="/assets/export.svg"
                alt="briefcase icon"
                width={18}
                height={18}
              />
              <a
                href="/"
                className="font-medium text-sm md:text-base underline"
              >
                kehindefaloadi.framer.website{" "}
              </a>
            </div>
          </div>
        </div>
        <div></div>
      </div>
      <ProjectUploadTab />
    </div>
  );
};
export default page;
