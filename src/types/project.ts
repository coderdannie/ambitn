// For reusable sub-types
interface CoverImage {
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

interface TextContent {
  body: string;
  _id: string;
}

interface ImageContent {
  url: string;
  alt: string;
  tags: string[];
  caption: string;
  _id: string;
}

interface VideoContent {
  url: string;
  alt: string;
  tags: string[];
  caption: string;
  _id: string;
}

interface AudioContent {
  url: string;
  alt: string;
  tags: string[];
  _id: string;
}

// Union for the content types
type ContentItem =
  | {
      type: 'TEXT';
      text: TextContent;
      _id: string;
      createdAt: string;
      updatedAt: string;
    }
  | {
      type: 'IMAGE';
      image: ImageContent;
      _id: string;
      createdAt: string;
      updatedAt: string;
    }
  | {
      type: 'VIDEO';
      video: VideoContent;
      _id: string;
      createdAt: string;
      updatedAt: string;
    }
  | {
      type: 'AUDIO';
      audio: AudioContent;
      _id: string;
      createdAt: string;
      updatedAt: string;
    };

// 🔥 Full response type
export interface ProjectResponse {
  _id: string;
  title: string;
  description: string;
  owner: string;
  coverImage: CoverImage;
  tags: string[];
  needFeedBacks: boolean;
  status: 'PUBLISHED' | 'DRAFT' | string;
  stats: Stats;
  contents: ContentItem[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface EditProject {
  title: string;
  description: string;
  owner: string;
  coverImage: CoverImage;
  tags: string[];
  needFeedBacks: boolean;
  contents: ContentItem[];
}
