"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const LoginModal = ({ onOpenChange, open }: any) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Add your login logic here
      // await loginFunction();
      // router.push('/dashboard');
      console.log("Login clicked");
      router.push("/login");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Add your signup logic here
      // await signupFunction();
      // router.push('/dashboard');
      console.log("Sign up clicked");
      router.push("/register-step-1");
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#FFFFFF] modal-gradient w-[500px] h-[350px] rounded-[.5rem] border-solid border-[1px] p-[1.2rem]">
        <DialogHeader>
          <DialogTitle className="modal-head flex items-center justify-between">
            <Image
              src="/assets/modal logo.png"
              alt="modal logo"
              width={50}
              height={50}
              className="cursor-pointer"
            />
            <div className="close cursor-pointer hidden">
              <Image
                src="/assets/close.png"
                alt="close"
                width={20}
                height={20}
              />
            </div>
          </DialogTitle>

          {/* Proper title */}
          <DialogTitle asChild>
            <h2 className="font-bold text-center text-[#1A202C]">
              Join and start sharing
            </h2>
          </DialogTitle>

          {/* Proper description */}
          <DialogDescription className="text-[12px] text-center my-[1rem]">
            Login or create a free account and publish your work on Ambitn
          </DialogDescription>

          {/* Buttons section */}
          <div className="btns grid place-content-center gap-[10px]">
            <button
              className="p-[.5rem] bg-white text-black flex items-center justify-center md:w-[200px] border-[#1A202C] border-[1px] border-solid rounded-[.5rem] hover:bg-gray-50 transition-colors disabled:opacity-50"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {/* <span className="w-5 h-5 border-2 border-black border-t-transparent border-solid rounded-full animate-spin"></span> */}
              Login
            </button>

            <button
              className="btn-gradient p-[.5rem] md:w-[200px] text-white rounded-[.5rem] flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50"
              onClick={handleSignup}
              disabled={isLoading}
            >
              {/* <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> */}
              Sign up
            </button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
