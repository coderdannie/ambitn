import React from 'react';
import { Meta, Story } from '@storybook/react';
import ProjectItem from './ProjectItem';
import { ProjectContent } from '@/types/portfolio';
import { ProjectItemProps } from '@/types/portfolio';

export default {
  title: 'Components/ProjectItem',
  component: ProjectItem,
  argTypes: {
    content: { control: { disable: true } },
    moveProject: { action: 'moveProject' },
    updateProject: { action: 'updateProject' },
    removeProject: { action: 'removeProject' },
    setShowRearrangeModal: { action: 'setShowRearrangeModal' },
  },
} as Meta;

const Template: Story<ProjectItemProps> = (args) => <ProjectItem {...args} />;

const sampleImageContent: ProjectContent = {
  type: 'image',
  data: 'https://via.placeholder.com/800x600',
  title: 'Sample Image',
};

const sampleTextContent: ProjectContent = {
  type: 'text',
  data: '<p>This is a <strong>sample text</strong> content with HTML formatting.</p>',
  title: 'Sample Text',
};

const sampleVideoContent: ProjectContent = {
  type: 'video',
  data: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  title: 'Sample Video',
};

export const ImageItem = Template.bind({});
ImageItem.args = {
  id: '1',
  content: sampleImageContent,
  index: 0,
};

export const TextItem = Template.bind({});
TextItem.args = {
  id: '2',
  content: sampleTextContent,
  index: 1,
};

export const VideoItem = Template.bind({});
VideoItem.args = {
  id: '3',
  content: sampleVideoContent,
  index: 2,
};

export const CustomStyled = Template.bind({});
CustomStyled.args = {
  id: '4',
  content: sampleImageContent,
  index: 3,
  className: 'relative p-8 mb-6 bg-gray-50 rounded-lg shadow-md',
  imageClassName: 'w-full h-auto max-h-80 object-cover',
  titleClassName: 'text-xl font-bold cursor-text hover:text-purple-600',
};
