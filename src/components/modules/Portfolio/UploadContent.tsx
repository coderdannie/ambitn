'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useGetUserAllProjects } from '@/service/query/portfolio.service';
import dynamic from 'next/dynamic';
import LoadingOverlay from '@/components/common/Loaders/LoadingOverlay';

const ProjectCard = dynamic(() => import('./ProjectCard'), {
  ssr: false,
  loading: () => <LoadingOverlay />,
});

const UploadContent = () => {
  const router = useRouter();
  const { data, isPending } = useGetUserAllProjects();

  return (
    <>
      {isPending ? (
        <LoadingOverlay />
      ) : data?.data?.length ? (
        <motion.div
          className="grid [grid-template-columns:repeat(auto-fit,minmax(200px,300px))] gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {data?.data?.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                ease: [0.4, 0.0, 0.2, 1],
              }}
            >
              <Link href={`/portfolio/${item?._id}`}>
                <ProjectCard data={item} />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.button
          className="border-2 border-dashed w-fit mt-14 max-w-[600px]  cursor-pointer mx-auto border-[#718096] rounded-lg p-12 flex flex-col items-center justify-center text-center max-w-[]"
          whileHover={{ scale: 1.01, borderColor: '#441C31' }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => router.push('/portfolio-builder')}
        >
          <motion.div
            className="mb-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 20,
              repeat: Infinity,
              repeatType: 'reverse',
              repeatDelay: 2,
            }}
          >
            <Image
              src="/assets/cloud.png"
              alt="upload icon"
              width={70}
              height={70}
            />
          </motion.div>

          <h3 className="text-lg font-medium mb-2">
            Upload your first project
          </h3>
          <p className="text-gray-500 mb-6">
            Show off your best projects and contribute to a growing community
          </p>
        </motion.button>
      )}
    </>
  );
};

export default UploadContent;
