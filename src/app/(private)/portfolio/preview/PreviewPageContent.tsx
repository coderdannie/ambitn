'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PortfolioPreview from '@/components/modules/PortfolioBuilder/PortfolioPreview';
import { ProjectItem } from '@/types/portfolio';
import { ProjectFormData } from '@/utils/validation';
import { useCreateProject } from '@/service/query/portfolio.service';
import { useToast } from '@/context/ToastContext';
import LoadingOverlay from '@/components/common/Loaders/LoadingOverlay';
import { AxiosError } from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/service/querykey';

const PreviewPageContent = () => {
  const { addToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [projectData, setProjectData] = useState<ProjectFormData>({
    title: '',
    description: '',
    tags: [],
    categories: [],
    coverImage: '',
    needsFeedback: false,
  });
  const [projectTitle, setProjectTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useCreateProject({
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [QUERY_KEYS.GET_USER_ALL_PROJECTS],
      });
      // Clear localStorage/sessionStorage on success
      localStorage.removeItem('portfolio_projects');
      localStorage.removeItem('portfolio_project_data');
      localStorage.removeItem('portfolio_project_title');

      // Also clear sessionStorage if you're using it
      sessionStorage.removeItem('portfolio_projects');
      sessionStorage.removeItem('portfolio_project_data');
      sessionStorage.removeItem('portfolio_project_title');

      addToast('Project successfully created', 'success');

      // Close modal after success
      setTimeout(() => {
        setIsModalOpen(false);
        router.push('/portfolio');
      }, 1500);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const err = error?.response?.data?.message || 'Something went wrong';
        addToast(err, 'error');
      }
      // Close modal on error so user can try again
      setTimeout(() => {
        setIsModalOpen(false);
      }, 1000);
    },
  });

  console.log('projects', projects);
  console.log('projectData', projectData);

  const handlePublishClick = () => {
    setIsModalOpen(true);
  };

  const handleModalPublish = () => {
    const contents = projects
      .map((project) => {
        // Validate that required fields exist
        if (!project.content.data || !project.content.title) {
          return null;
        }

        switch (project.content.type) {
          case 'image':
            if (!project.content.publicUrl) return null;
            return {
              type: 'IMAGE' as const,
              image: {
                url: project.content.data,
                alt: project.content.altText || project.content.title,
                publicId: project.content.publicUrl,
                tags: project.content.tags,
                caption: project.content.caption,
              },
            };
          case 'video':
            if (!project.content.publicUrl) return null;
            return {
              type: 'VIDEO' as const,
              video: {
                url: project.content.data,
                alt: project.content.altText || project.content.title,
                publicId: project.content.publicUrl,
                tags: project.content.tags,
                caption: project.content.caption,
              },
            };
          case 'text':
            return {
              type: 'TEXT' as const,
              text: {
                body: project.content.data,
              },
            };
          case 'audio':
            if (!project.content.publicUrl) return null;
            return {
              type: 'AUDIO' as const,
              audio: {
                url: project.content.data,
                publicId: project.content.publicUrl,
                tags: project.content.tags,
                alt: project.content.altText || project.content.title,
                caption: project.content.caption,
              },
            };
          default:
            return null;
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    const payload = {
      title: projectData.title,
      description: projectData.description,
      coverImage: {
        url: projectData.coverImage,
        alt: `${projectData.title} cover image`,
      },
      needFeedBacks: projectData.needsFeedback,
      tags: projectData.tags,
      categories: projectData.categories,
      contents: contents,
    };

    mutate(payload);
  };

  const handleModalClose = () => {
    if (!isPending) {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    // Get data from localStorage or URL params
    const getPreviewData = () => {
      try {
        // First, try to get from localStorage (for in-progress projects)
        const savedProjects = localStorage.getItem('portfolio_projects');
        const savedProjectData = localStorage.getItem('portfolio_project_data');
        const savedProjectTitle = localStorage.getItem(
          'portfolio_project_title'
        );

        if (savedProjects && savedProjectData && savedProjectTitle) {
          setProjects(JSON.parse(savedProjects));
          setProjectData(JSON.parse(savedProjectData));
          setProjectTitle(savedProjectTitle);
          return;
        }

        // If no localStorage data, check URL params (for published projects)
        const projectId = searchParams.get('id');
        if (projectId) {
          // Fetch published project data by ID
          fetchPublishedProject(projectId);
          return;
        }

        // If no data found, redirect back to builder
        router.push('/portfolio');
      } catch (error) {
        console.error('Error loading preview data:', error);
        router.push('/portfolio');
      } finally {
        setLoading(false);
      }
    };

    getPreviewData();
  }, [searchParams, router]);

  const fetchPublishedProject = async (projectId: string) => {
    try {
      // Replace with your actual API call
      // const response = await fetch(`/api/projects/${projectId}`);
      // const data = await response.json();
      // setProjects(data.projects);
      // setProjectData(data.projectData);
      // setProjectTitle(data.title);

      console.log('Fetching published project:', projectId);
    } catch (error) {
      console.error('Error fetching published project:', error);
      router.push('/portfolio');
    }
  };

  const handleBackToEdit = () => {
    router.back();
  };

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="min-h-screen">
      <PortfolioPreview
        projects={projects}
        projectData={projectData}
        projectTitle={projectTitle}
        onBackToEdit={handleBackToEdit}
        handlePublishClick={handlePublishClick}
        handleModalPublish={handleModalPublish}
        handleModalClose={handleModalClose}
        isModalOpen={isModalOpen}
        isPending={isPending}
      />
    </div>
  );
};

export default PreviewPageContent;
