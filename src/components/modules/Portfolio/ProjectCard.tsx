import React from "react";
import { Project } from "@/types/portfolio";
import { formatDate } from "@/utils/helper";
import { IoMdGlobe } from "react-icons/io";
import { motion } from "framer-motion";

interface Props {
  data: Project;
}

export default function ProjectCard({ data }: Props) {
  const getStatusBadge = (status) => {
    const statusConfig = {
      published: {
        icon: <IoMdGlobe />,
        bgColor: "bg-[#E2FFF0]",
        text: "Published",
        textColor: "text-[#38A169]",
      },
      draft: {
        icon: (
          <svg
            className="w-3 h-3 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
              clipRule="evenodd"
            />
          </svg>
        ),
        bgColor: "bg-gray-500",
        text: "Draft",
      },
      "in-progress": {
        icon: (
          <svg
            className="w-3 h-3 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
        ),
        bgColor: "bg-yellow-500",
        text: "In Progress",
      },
    };

    return statusConfig[status] || statusConfig.draft;
  };

  const statusBadge = getStatusBadge(data?.status?.toLowerCase());

  return (
    <motion.div
      className="rounded-3xl shadow-sm h-[290px] pb-2 overflow-hidden pt-0 cursor-pointer"
      initial={false} // This prevents initial animation on mount
      whileHover={{
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.98 }}
      suppressHydrationWarning
    >
      <motion.div
        className="relative h-[179px] overflow-hidden bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: `url(${data?.coverImage?.url})` }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        suppressHydrationWarning
      >
        <motion.div
          className="absolute top-6 left-6 z-10"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          suppressHydrationWarning
        >
          <motion.div
            className={`bg-opacity-95 px-4 py-2 rounded-full flex items-center gap-2 font-medium text-sm shadow-lg ${statusBadge.textColor} ${statusBadge.bgColor}`}
            whileHover={{
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
              y: -2,
            }}
            transition={{ duration: 0.2 }}
            suppressHydrationWarning
          >
            <motion.div
              className="text-xl rounded-full flex items-center justify-center"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              suppressHydrationWarning
            >
              {statusBadge.icon}
            </motion.div>
            {statusBadge.text}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Title and Date - These would also be dynamic */}
      <motion.div
        className="pt-3 px-3"
        whileHover={{ x: 4 }}
        transition={{ duration: 0.2 }}
        suppressHydrationWarning
      >
        <motion.h1
          className="font-medium text-xl pb-1"
          whileHover={{ color: "#4A5568" }}
          transition={{ duration: 0.2 }}
          suppressHydrationWarning
        >
          {data?.title}
        </motion.h1>
        <motion.p
          className="text-[#718096] text-lg"
          whileHover={{ color: "#2D3748" }}
          transition={{ duration: 0.2 }}
          suppressHydrationWarning
        >
          {data?.status.toLowerCase() === "published"
            ? "Published on"
            : "Last updated"}{" "}
          {formatDate(data?.createdAt)}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
