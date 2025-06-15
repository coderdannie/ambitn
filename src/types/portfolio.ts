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

interface CoverImage {
  url: string;
  alt?: string;
}

interface TextContent {
  body: string;
}

interface ImageContent {
  url: string;
  alt?: string;
  caption?: string;
  tags?: string[];
  height?: number;
  width?: number;
  publicId?: string;
}

interface VideoContent {
  url: string;
  alt?: string;
  caption?: string;
  tags?: string[];
  thumbnail?: string;
  publicId?: string;
}
interface AudioContent {
  url: string;
  alt?: string;
  caption?: string;
  tags?: string[];
  thumbnail?: string;
  publicId?: string;
}

interface EmbedContent {
  embedCode: string;
  service?: string;
  caption?: string;
}

type ContentItem =
  | { type: 'TEXT'; text: TextContent }
  | { type: 'IMAGE'; image: ImageContent }
  | { type: 'VIDEO'; video: VideoContent }
  | { type: 'AUDIO'; audio: AudioContent }
  | { type: 'EMBED'; embed: EmbedContent };

export interface CreateProjectPayload {
  title: string;
  description: string;
  coverImage: CoverImage;
  needFeedBacks: boolean;
  tags: string[];
  categories: string[];
  contents: ContentItem[];
}

interface CoverImg {
  url: string;
  alt: string;
  _id: string;
}

interface Stats {
  views: number;
  likes: number;
  shares: number;
  _id: string;
}

export interface Project {
  _id: string;
  title: string;
  coverImage: CoverImg;
  status: string; // You might want to use a union type like "PUBLISHED" | "DRAFT" etc. if there are specific possible values
  stats: Stats;
  createdAt: string; // or Date if you'll parse it
}

interface Pagination {
  totalItems: number;
  totalPages: number;
  page: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface getUserAllProjectResponse {
  success: boolean;
  message: string;
  data: Project[];
  pagination: Pagination;
}
