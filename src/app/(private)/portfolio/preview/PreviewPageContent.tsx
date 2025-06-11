'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PortfolioPreview from '@/components/modules/PortfolioBuilder/PortfolioPreview';
import { ProjectItem } from '@/types/portfolio';
import { ProjectFormData } from '@/utils/validation';

const PreviewPageContent = () => {
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
          // This would be your API call to get published project
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <PortfolioPreview
        projects={projects}
        projectData={projectData}
        projectTitle={projectTitle}
        onBackToEdit={handleBackToEdit}
      />
    </div>
  );
};

export default PreviewPageContent;
