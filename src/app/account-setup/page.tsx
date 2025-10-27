'use client';

import { topics } from '@/components/common/constants';
import { LoaderButton } from '@/components/common/LoaderButton';
import { useToast } from '@/context/ToastContext';
import { useAddTopics, useGetProfile } from '@/service/query/account.service';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface AccountSetupResponse {
  message: string;
  success: boolean;
}

const TopicSelection = () => {
  const { addToast } = useToast();
  const router = useRouter();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const { data } = useGetProfile();

  console.log(data);

  const { mutate, isPending } = useAddTopics({
    onSuccess: (res: AccountSetupResponse) => {
      addToast(res.message, 'success');
      router.push('/discover');
    },
    onError: (error: {
      response?: { data?: { message?: string } };
      message?: string;
    }) => {
      addToast(
        error?.response?.data?.message || error?.message || 'An Error Occurred',
        'error'
      );
    },
  });

  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleSubmit = () => {
    mutate({ topics: selectedTopics });
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="align-element flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
          <Image
            src="/assets/logo.png"
            alt="ambitn logo"
            className="w-[100px]  sm:w-[140px] h-auto"
            width={140}
            height={40}
          />
          <div className="flex items-center space-x-4">
            <span className=" text-gray-600 font-medium ">
              Welcome, {data?.data?.firstName || 'User'}
            </span>
            <button
              onClick={() => router.push('/profile')}
              className="hover:bg-gray-100 p-2 rounded-full transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <div className="flex flex-col items-center max-w-xl mx-auto px-4 pb-8 pt-14">
        <h1 className="text-2xl font-semibold text-center mb-2">
          Pick one or more topics
        </h1>
        <p className="text-[#000000] text-center mb-8">
          This will help us recommend creative work you`ll love
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => toggleTopic(topic)}
              className={`px-4 py-2 rounded-full border-2 border-black text-sm flex items-center gap-2 transition-colors ${
                selectedTopics.includes(topic)
                  ? 'bg-[#C9D0DC] text-black '
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {topic}
              {selectedTopics.includes(topic) && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>

        <p className="text-sm text-center text-[#000000] mb-2">
          {selectedTopics.length > 0
            ? 'Great work!'
            : 'Follow at least 1 category to continue'}
        </p>
        {selectedTopics.length > 0 ? (
          <div className="w-full max-w-md space-y-3">
            <LoaderButton
              onClick={handleSubmit}
              isLoading={isPending}
              isMobile={window.innerWidth < 768}
              text="Continue"
            />
          </div>
        ) : (
          <div className="w-full max-w-md space-y-3">
            <button
              className={`w-full py-3 bg-gray-100 rounded-lg font-medium transition-colors ${
                selectedTopics.length > 0 ? 'hover:bg-gray-200' : 'opacity-70'
              }`}
              disabled={selectedTopics.length === 0}
            >
              See my feed
            </button>

            <button className="w-full py-3 bg-gray-100 rounded-lg font-medium hover:bg-gray-200">
              Skip
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default TopicSelection;
