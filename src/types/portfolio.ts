// types/portfolio.ts
export type ContentType = 'image' | 'text' | 'video' | 'audio';

export interface ProjectContent {
  type: ContentType;
  data?: string;
  title?: string;
  altText?: string;
  tags?: string[];
  caption?: string;
  publicUrl?: string;
  id?: string;
  isUploading?: boolean;
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
  onTextDoubleClick?: () => void;
  onCancelEditing?: () => void;
  onSaveEditing?: () => void;
  onEditClick?: () => void;
  isEditing?: boolean;
  isUploadingImg?: boolean;
  isUploadingAudio?: boolean;
  uploadImgProgress?: number;
  selectedImg?: string;
  onReplaceImage: (file: File) => void;
  isUploadingVideo?: boolean;
  uploadVideoProgress?: number;
  onReplaceVideo?: (file: File) => void;
  onReplaceAudio?: (file: File) => void;
  isDeleting: boolean;
  getUploadProgress: (value: string) => void;
}

export interface UploadOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  onMutate?: () => void;
  onSettled?: () => void;
}

export interface UploadData {
  file: string | File;
}

export interface UploadBody {
  file: string | File;
}

export type MediaType = 'image' | 'video' | 'audio';

export interface EditMenuAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'danger';
}

interface CoverImage {
  url: string;
  alt?: string; // optional property
}

interface TextContent {
  body: string;
}

interface ImageContent {
  url: string;
  alt?: string; // optional
  caption?: string; // optional
  tags?: string[]; // array of strings
  height?: number; // optional
  width?: number; // optional
  publicId?: string;
}

interface VideoContent {
  url: string;
  alt?: string; // optional
  caption?: string; // optional
  tags?: string[]; // array of strings
  thumbnail?: string; // optional
  publicId?: string;
}

interface EmbedContent {
  embedCode: string;
  service?: string; // optional
  caption?: string; // optional
}

interface ContentItem {
  type: ContentType; // compulsory
  // position?: number; // commented out as per your example
  text?: TextContent;
  image?: ImageContent;
  video?: VideoContent;
  embed?: EmbedContent;
}

export interface CreateProjectPayload {
  title: string;
  description: string;
  coverImage: CoverImage;
  needFeedBacks: boolean;
  tags: string[]; // array of strings
  categories: string[]; // array of strings
  contents: ContentItem[];
}

export interface ProjectData {
  title: string;
  description: string;
  tags: string[];
  categories: string[];
  coverImage: string;
  needsFeedback: boolean;
}

export interface UploadingState {
  uploadingProjects: Set<string>;
  deletingProjects: Set<string>;
}
