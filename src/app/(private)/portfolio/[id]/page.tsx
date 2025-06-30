'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useDeleteProject,
  useGetUserProjectDetails,
} from '@/service/query/portfolio.service';
import { useGetProfile } from '@/service/query/account.service';
import { FaUserCircle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import ProjectContent from '@/components/modules/Portfolio/ProjectContent';
import LoadingOverlay from '@/components/common/Loaders/LoadingOverlay';
import { MdArrowBackIos } from 'react-icons/md';
import Image from 'next/image';
import IconToolbar from '@/components/common/IconToolbar';
import DeleteModal from '@/components/modals/CancelModal';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/service/querykey';
import { useToast } from '@/context/ToastContext';

const Page = () => {
  const { addToast } = useToast();
  const { id } = useParams();
  const { data, isPending } = useGetUserProjectDetails(id as string);
  const { data: profile } = useGetProfile();
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleClickBack = () => {
    router.back();
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const queryClient = useQueryClient();
  const { mutate, isPending: isDeleting } = useDeleteProject({
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [QUERY_KEYS.GET_USER_ALL_PROJECTS],
      });
      router.back();
      addToast('Project successfully deleted', 'success');
    },
    onError: (error: {
      response: {
        data: {
          message: string;
        };
      };
    }) => {
      addToast(error.response.data?.message, 'error');
    },
  });

  const handleDelete = () => {
    if (!id) return;
    mutate(id as string);
  };

  const handleEdit = () => {
    router.push(`/portfolio-builder?project_id=${id}`);
  };

  if (isPending) {
    return <LoadingOverlay />;
  }
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 py-3">
          <FaUserCircle className="w-[50px] h-[50px] text-gray-400" />

          <div>
            <h4 className="text-lg font-medium text-[#14171F]">
              {data?.title}
            </h4>
            <p className="text-[#677084] text-sm font-medium">
              {profile?.data?.firstName} {profile?.data?.lastName}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="bg-[#F7F5F4] flex items-center gap-2 px-4 h-[44px]"
          onClick={handleClickBack}
        >
          <MdArrowBackIos /> <span>All Work</span>
        </Button>
      </div>
      <ProjectContent data={data} />
      <IconToolbar onDelete={handleOpenDeleteModal} onEdit={handleEdit} />
      <div className="flex items-center justify-center my-[32px]">
        {/* Left Line */}
        <div className="flex-grow border-t border-gray-200"></div>

        {/* Avatar */}
        <div className="mx-4">
          <div className="w-20 h-20 grid place-items-center rounded-full overflow-hidden border border-gray-300 shadow-md">
            {/* <Image
            src={profile?.data?.}
            alt="Avatar"
            width={80}
            height={80}
            className="object-cover"
            priority
          /> */}
            <FaUserCircle className="w-[80px] h-[80px] text-gray-400" />
          </div>
        </div>

        {/* Right Line */}
        <div className="flex-grow border-t border-gray-200"></div>
      </div>
      <DeleteModal
        title="Delete Project"
        description="Are you sure you want to delete this project?"
        confirmText="Delete"
        cancelText="Close"
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
        isPending={isDeleting}
      />
    </div>
  );
};

export default Page;
