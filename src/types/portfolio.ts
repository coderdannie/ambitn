// types/portfolio.ts
export type ContentType = 'image' | 'text' | 'video';

export interface ProjectContent {
  type: ContentType;
  data: string;
  title?: string;
  altText?: string;
  tags?: string[];
  caption?: string;
}

export interface ProjectItem {
  id: string;
  content: ProjectContent;
}

export type DropItem = {
  id: string;
  index: number;
};

export interface ThumbnailItemProps {
  id: string;
  content: ProjectContent;
  index: number;
  moveThumbnail: (dragIndex: number, hoverIndex: number) => void;
}

export interface FileInputProps {
  accept: string;
  onFileSelected: (file: File) => void;
  className?: string;
  buttonClassName?: string;
  inputClassName?: string;
}

// types.ts
export interface ProjectItemProps {
  id: string;
  content: ProjectContent;
  index: number;
  moveProject: (dragIndex: number, hoverIndex: number) => void;
  updateProject: (id: string, content: ProjectContent) => void;
  removeProject: (id: string) => void;
  setShowRearrangeModal: (show: boolean) => void;
  className?: string;
  itemClassName?: string;
  imageClassName?: string;
  textClassName?: string;
  videoWrapperClassName?: string;
  titleClassName?: string;
  editInputClassName?: string;
  onTextClick?: () => void;
  textContent: string;
  setTextContent: (value: string) => void;
}
