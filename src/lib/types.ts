export interface SocialLink {
  id: string;
  name: string;
  url: string;
  handle: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  embedId: string;
  publishedAt?: string;
  duration?: string;
  views?: string;
}

export interface TikTokPost {
  id: string;
  title: string;
  url: string;
  views?: string;
  likes?: string;
  tag?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  isFeatured?: boolean;
}

export interface SiteConfig {
  name: string;
  officialEmail: string;
  socials: SocialLink[];
  youtube: {
    channelUrl: string;
    playlistUrl?: string;
    playlistTitle?: string;
    playlistId?: string;
    videos: YouTubeVideo[];
  };
  tiktok: {
    profileUrl: string;
    posts: TikTokPost[];
  };
  projects: ProjectItem[];
}
