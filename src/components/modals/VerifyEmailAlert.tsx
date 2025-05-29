"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowSize } from "@/hooks/useWindowSize";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useResendAccountCreationOtp } from "@/service/query/auth.service";
import { useToast } from "@/context/ToastContext";
import { IoIosAlert } from "react-icons/io";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VerifyEmailAlert: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { isMobile } = useWindowSize();
  const router = useRouter();
  const { addToast } = useToast();
  const email =
    typeof window !== "undefined" ? sessionStorage.getItem("email") : null;
  const handleSubmit = () => {
    mutateResend({
      email: email,
    });
    onClose();
  };
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const { mutate: mutateResend, isPending: isResending } =
    useResendAccountCreationOtp({
      onSuccess: (res: RegisterResponse) => {
        addToast(res?.message || "OTP resent successfully!", "success");
        if (res?.message?.includes("sent")) {
          router.push("/verify-email");
        }
      },
      onError: (error: {
        response?: { data?: { message?: string } };
        message?: string;
      }) => {
        addToast(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to resend OTP",
          "error"
        );
      },
    });
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-xl w-[90%] max-w-md p-6 pb-2 relative mx-auto text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-4">
              {/* <Image
                src="/assets/success.gif"
                alt="Animated email verification prompt"
                width={100}
                height={100}
              /> */}
              <IoIosAlert />
            </div>
            <h3 className="md:text-xl font-medium mb-2">Verify Your Email</h3>
            <p className="text-gray-600 text-xs md:text-base mb-6">
              Please click the verification link to complete your registration.
            </p>
            <Button
              type="submit"
              className={`secondary-btn mt-6 ${isMobile ? "mb-2" : "mb-4"}`}
              onClick={() => handleSubmit()}
            >
              Proceed
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VerifyEmailAlert;
