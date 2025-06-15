'use client';

import { ProjectResponse } from '@/types/project';
import Image from 'next/image';

interface Props {
  data: ProjectResponse | undefined;
}

const ProjectContent = ({ data }: Props) => {
  return (
    <div>
      <div className="w-full bg-[#F8F7F766] py-[14px] px-6 rounded-[24px]">
        {/* Preview Content - Portfolio items */}
        <div className="space-y-4 mb-8">
          {data?.contents?.map((project) => (
            <div key={project._id} className="w-full">
              {project.type === 'IMAGE' && (
                <div className="overflow-hidden rounded-lg relative group">
                  <Image
                    src={project?.image?.url || ''}
                    alt={project?.image.alt || 'Project image'}
                    className="w-full h-auto max-h-[400px] object-contain"
                    width={800}
                    height={100}
                  />
                </div>
              )}
              {project?.type === 'VIDEO' && (
                <div className="overflow-hidden rounded-lg relative group">
                  <video
                    src={project.video.url}
                    controls
                    className="w-full h-auto max-h-[400px] object-contain"
                  />
                </div>
              )}
              {project.type === 'AUDIO' && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <audio src={project.audio.url} controls className="w-full" />
                </div>
              )}
              {project.type === 'TEXT' && (
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: project.text.body || '',
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* <div className="border-t pt-6">
          {data?.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {data?.description}
              </p>
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
};
export default ProjectContent;
