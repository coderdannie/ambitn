import { useGetProfile } from "@/service/query/account.service";
import { Project } from "@/types/portfolio";
import Image from "next/image";

interface CaseStudyCardProps {
  data: Project;
}

export default function CaseStudyCard({ data }: CaseStudyCardProps) {
  const { data: profile } = useGetProfile();
  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-lg group">
      {/* Main Image */}
      <div className="relative w-full h-[307px]">
        <Image
          src={data?.coverImage?.url}
          alt={data?.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Gradient Overlay + Content */}
      <div className="absolute inset-x-0 h-[200px] bottom-0 p-5 pt-[130px] flex items-center  justify-between bg-gradient-to-t from-black/90 to-transparent text-white">
        <div className="text-white">
          <h2 className="text-shadow-muted-foreground font-semibold">
            {data?.title}
          </h2>
          <p className="text-xs ">
            {profile?.data?.firstName} {profile?.data?.lastName}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-3 text-sm">
          <span className="flex items-center gap-1">👍 15</span>
          <span className="flex items-center gap-1">👁 160</span>
        </div>
      </div>
    </div>
  );
}
