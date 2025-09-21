// components/Layouts/AuthLayout/Sidebar.tsx
"use client";

import { motion } from "framer-motion";
import { sidebarData } from "../../common/constants";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { useGetProfile } from "@/service/query/account.service";
import { FaBehanceSquare } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import GetBadge from "@/components/common/GetBadge";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Animation variants
  const menuItemVariants = {
    collapsed: {
      opacity: 1,
      x: 0,
      backgroundColor: "transparent",
    },
    expanded: {
      opacity: 1,
      x: 0,
      backgroundColor: "transparent",
    },
    hover: {
      scale: 1.05,
      backgroundColor: "#F7FAFC",
      transition: { duration: 0.2 },
    },
    active: {
      backgroundColor: "#F7FAFC",
      borderLeft: isCollapsed ? "none" : "4px solid white",
    },
  };

  const textVariants = {
    collapsed: { opacity: 0, width: 0 },
    expanded: { opacity: 1, width: "auto" },
  };

  const toggleButtonVariants = {
    collapsed: { rotate: 180 },
    expanded: { rotate: 0 },
  };

  const handleLogout = () => {
    setIsLoggingOut(true);

    // Simulate async operation with delay
    setTimeout(() => {
      sessionStorage.removeItem("user");
      router.push("/login");
    }, 1000);
  };

  const { data } = useGetProfile();

  return (
    <motion.div
      className="h-full flex flex-col justify-betweens border border-[#E4E4E4E4]"
      initial={false}
      animate={isCollapsed ? "collapsed" : "expanded"}
    >
      {/* Sidebar Header */}
      <div className="flex items-center gap-4 pt-8 px-4 ">
        <motion.div
          className="font-bold"
          variants={{
            collapsed: { opacity: 0, width: 0 },
            expanded: { opacity: 1, width: "auto" },
          }}
          transition={{ duration: 0.2 }}
        >
          <Image
            src="/assets/logo.png"
            alt="ambitn logo"
            className="w-[120px] h-auto"
            width={140}
            height={40}
          />
        </motion.div>

        <motion.button
          onClick={onToggle}
          className={`${isCollapsed ? "unset" : "ml-auto"} cursor-pointer`}
          variants={toggleButtonVariants}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Image
            src="/assets/togglebar.svg"
            width={20}
            height={20}
            className="mx-auto"
            alt="toggle"
          />
        </motion.button>
      </div>

      {/* Sidebar Menu */}
      <nav className={`flex-1  rounded-[16px] px-4 pt-4 `}>
        <ul className="space-y-2 mt-4">
          {sidebarData.map((item) => {
            const isActive =
              pathname === item.path ||
              (item.path !== "/" && pathname?.startsWith(item.path));

            return (
              <motion.li
                key={item.path}
                variants={menuItemVariants}
                initial={{ backgroundColor: "transparent" }}
                whileHover="hover"
                animate={
                  isActive ? "active" : isCollapsed ? "collapsed" : "expanded"
                }
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn("overflow-hidden rounded-md relative")}
              >
                {/* Active indicator - only show when expanded */}
                {isActive && !isCollapsed && (
                  <motion.div
                    className="absolute left-0 top-0 h-full w-[5px] bg-primary rounded-l-full"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}

                {/* Active indicator for collapsed state - use different approach */}
                {isActive && isCollapsed && (
                  <motion.div
                    className="absolute inset-0 bg-primary/10 rounded-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}

                <Link
                  href={item.path}
                  className={`flex items-center ${
                    isCollapsed ? "justify-center p-3" : "gap-3 p-2 pl-4"
                  }`}
                >
                  <motion.span
                    className={`text-xl ${isActive ? "text-primary" : ""}`}
                  >
                    {pathname.includes(item.path) ? item.sec : item.icon}
                  </motion.span>

                  {!isCollapsed && (
                    <motion.span
                      className={`whitespace-nowrap ${
                        isActive
                          ? "font-bold text-primary"
                          : "font-medium text-[#344054]"
                      }`}
                      variants={textVariants}
                      transition={{ duration: 0.2 }}
                    >
                      {item.title}
                    </motion.span>
                  )}
                </Link>
              </motion.li>
            );
          })}
        </ul>

        <div className="grid gap-2 text-sm text-[#344054] font-medium px-3 mt-6">
          <h4 className="font-bold text-[#344054] text-sm">Socials</h4>
          <button className="flex gap-3 py-2 items-center ">
            <FaXTwitter size={24} />
            <span>Twitter (X)</span>
          </button>
          <button className="flex gap-3 py-2 items-center ">
            <FaLinkedin size={24} color="#0A66C2" />
            <span>LinkedIn</span>
          </button>
          <button className="flex gap-3 py-2 items-center ">
            <FaXTwitter size={24} />
            <span>Dribble</span>
          </button>
          <button className="flex gap-3 py-2 items-center ">
            <FaBehanceSquare size={24} color="#005CFF" />
            <span>Behance</span>
          </button>
        </div>
        <GetBadge />
        {/* Logout Button */}
        <motion.li
          variants={menuItemVariants}
          initial={{ backgroundColor: "transparent" }}
          whileHover="hover"
          animate={isCollapsed ? "collapsed" : "expanded"}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={cn(
            "overflow-hidden rounded-md relative mt-6 border-t border-[#E4E4E4] py-2"
          )}
        >
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`flex items-center w-full ${
              isCollapsed ? "justify-center p-3" : "gap-3 p-2 pl-4"
            }`}
          >
            <motion.span className="text-xl">
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
                <IoMdLogOut />
              )}
            </motion.span>

            {!isCollapsed && (
              <motion.span
                className={`whitespace-nowrap font-medium text-[#344054] ${
                  isLoggingOut ? "opacity-70" : ""
                }`}
                variants={textVariants}
                transition={{ duration: 0.2 }}
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </motion.span>
            )}
          </button>
        </motion.li>
      </nav>
    </motion.div>
  );
};

export default Sidebar;
