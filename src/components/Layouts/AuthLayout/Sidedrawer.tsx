"use client";

import { motion, AnimatePresence } from "framer-motion";
import { sidebarData } from "../../common/constants";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState, useEffect } from "react";
import { X, Menu } from "lucide-react";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar = ({ isOpen, onClose }: MobileSidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [pathname]);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isOpen && target.classList.contains("sidebar-backdrop")) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Lock scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleLogout = () => {
    setIsLoggingOut(true);

    // Simulate async operation with delay
    setTimeout(() => {
      sessionStorage.removeItem("user");
      router.push("/login");
    }, 1000);
  };

  // Sidebar animation variants
  const sidebarVariants = {
    hidden: {
      x: "-100%",
      transition: {
        type: "spring" as const, // Add 'as const' here
        stiffness: 400,
        damping: 40,
      },
    },
    visible: {
      x: 0,
      transition: {
        type: "spring" as const, // Add 'as const' here
        stiffness: 400,
        damping: 40,
      },
    },
  };

  const backdropVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  };

  return (
    <>
      {/* Hamburger button */}
      {/* <button
        onClick={onClose}
        className="lg:hidden fixed top-4 left-4 z-30 bg-white p-2 rounded-md shadow-md"
        aria-label="Toggle mobile menu"
      >
        <Menu size={24} />
      </button> */}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 sidebar-backdrop"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={backdropVariants}
            />

            {/* Sidebar */}
            <motion.div
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-white  z-50  shadow-xl"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={sidebarVariants}
            >
              <div className="h-full flex flex-col justify-between p-4">
                {/* Sidebar Header */}
                <div className="flex items-center justify-between pt-2">
                  <div className="font-bold">Folio</div>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-gray-100"
                    aria-label="Close sidebar"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Sidebar Menu */}
                <nav className="flex-1 mt-8 shadow-[0_2px_7px_rgba(0,0,0,0.1)] rounded-[16px] px-4 pt-4 overflow-y-auto">
                  <div className="flex items-center gap-1 pl-2 pr-[2px] border-[#E5E7EB] border rounded-2xl py-3">
                    <Image
                      className="rounded-full"
                      src="/assets/profilepic.png"
                      alt="profile picture"
                      width={40}
                      height={40}
                    />

                    <div className="">
                      <h4 className="text-sm text-[#14171F]">
                        Independent Workspace
                      </h4>
                      <p className="text-[#677084] text-xs">Kehinde Falodi</p>
                    </div>
                  </div>

                  <ul className="space-y-2 mt-8">
                    {sidebarData.map((item) => {
                      const isActive =
                        pathname === item.path ||
                        (item.path !== "/" && pathname?.startsWith(item.path));

                      return (
                        <motion.li
                          key={item.path}
                          whileHover={{ scale: 1.02 }}
                          className={cn(
                            "overflow-hidden rounded-md relative",
                            isActive ? "bg-[#F7FAFC]" : ""
                          )}
                        >
                          {isActive && (
                            <motion.div
                              className="absolute left-0 top-0 h-full w-[5px] bg-primary rounded-l-full"
                              initial={{ scaleY: 0 }}
                              animate={{ scaleY: 1 }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                              }}
                            />
                          )}

                          <Link
                            href={item.path}
                            className="flex items-center gap-3 p-3 pl-4"
                            onClick={onClose}
                          >
                            <span className="text-xl">
                              {pathname.includes(item.path)
                                ? item.sec
                                : item.icon}
                            </span>

                            <span
                              className={`whitespace-nowrap ${
                                isActive
                                  ? "font-bold text-primary"
                                  : "font-medium text-[#344054]"
                              }`}
                            >
                              {item.title}
                            </span>
                          </Link>
                        </motion.li>
                      );
                    })}

                    {/* Logout Button */}
                    <motion.li
                      whileHover={{ scale: 1.02 }}
                      className={cn("overflow-hidden rounded-md relative mt-8")}
                    >
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center gap-3 p-3 pl-4 w-full"
                      >
                        <span className="text-xl">
                          {isLoggingOut ? (
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{
                                repeat: Infinity,
                                duration: 1,
                                ease: "linear",
                              }}
                              className="inline-block"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                                <path d="M21 3v5h-5" />
                              </svg>
                            </motion.span>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                              <polyline points="16 17 21 12 16 7" />
                              <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                          )}
                        </span>

                        <span
                          className={`whitespace-nowrap font-medium text-[#344054] ${
                            isLoggingOut ? "opacity-70" : ""
                          }`}
                        >
                          {isLoggingOut ? "Logging out..." : "Logout"}
                        </span>
                      </button>
                    </motion.li>
                  </ul>
                </nav>

                {/* Footer */}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileSidebar;
