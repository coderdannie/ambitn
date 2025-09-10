"use client";

import React, { use, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const LoginModal = ({ handleClose }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleLogin = () => {
    setIsLoading(true);
    router.push("/login");
  };
  return (
    <>
      <div className="bg-[#FFFFFF] flex justify-center modal-gradient w-[500px] h-[350px] rounded-[.5rem] border-solid border-[1px] mx-auto">
        <div className="p-[1.2rem]">
          <div className="modal-head flex items-center justify-between">
            <Image
              src="/assets/modal logo.png"
              alt="modal logo"
              width={50}
              height={50}
              className="cursor-pointer"
            />
            <div className="close cursor-pointer" onClick={handleClose}>
              <Image
                src="/assets/close.png"
                alt="close"
                width={20}
                height={20}
              />
            </div>
          </div>

          <div className="pt-[2rem]">
            <div className="modal-text">
              <h2 className="font-bold text-center text-[#1A202C]">
                Join and start sharing
              </h2>
              <p className="text-[12px] text-center my-[1rem]">
                Login or create a free account and publih your your work on
                Ambitn
              </p>
            </div>

            <div className="btns grid place-content-center gap-[10px]">
              <button
                className="p-[.5rem] bg-white text-black flex items-center justify-center w-[300px] border-[#1A202C] border-[1px] border-solid rounded-[.5rem]"
                onClick={handleLogin}
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-black border-t-transparent border-solid rounded-full animate-spin"></span>
                ) : (
                  "Login"
                )}
              </button>
              <button
                className="btn-gradient p-[.5rem] w-[300px] text-white rounded-[.5rem] flex items-center justify-center"
                onClick={handleLogin}
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  "Sign up"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
