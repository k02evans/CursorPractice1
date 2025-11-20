import { init } from "@instantdb/react";

// Define the schema types
export interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  spotifyUrl?: string;
  instagramUrl?: string;
  soundcloudUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
  twitterUrl?: string;
  bandcampUrl?: string;
  appleMusicUrl?: string;
  createdAt: number;
}

export interface Recommendation {
  id: string;
  userId: string;
  section: string;
  category: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  createdAt: number;
}

export interface Comment {
  id: string;
  recommendationId: string;
  userId: string;
  content: string;
  createdAt: number;
}

export interface Rating {
  id: string;
  recommendationId: string;
  userId: string;
  stars: number;
  createdAt: number;
}

export interface Recommend {
  id: string;
  recommendationId: string;
  userId: string;
  createdAt: number;
}

export interface Share {
  id: string;
  recommendationId: string;
  userId: string;
  createdAt: number;
}

// Schema definition
type Schema = {
  users: User;
  recommendations: Recommendation;
  comments: Comment;
  ratings: Rating;
  recommends: Recommend;
  shares: Share;
};

// Initialize InstantDB
const APP_ID = "56ae1f37-6d1c-422a-a186-666aeae63ef5";

export const db = init<Schema>({ appId: APP_ID });

// Helper to generate IDs
export const id = () => crypto.randomUUID();

// Section and category mappings
export const SECTIONS = {
  "community-management": {
    name: "Community Management",
    categories: [
      { id: "discord-setup", name: "Discord Setup" },
      { id: "bandcamp-groups", name: "Bandcamp Groups" },
      { id: "skool-communities", name: "Skool Communities" },
      { id: "whop-pages", name: "Whop Pages" },
    ],
  },
  "affiliate-marketing": {
    name: "Affiliate Marketing Strategies",
    categories: [
      { id: "viral-content-tips", name: "Viral Content Tips" },
      { id: "affiliate-programs", name: "Affiliate Programs" },
      { id: "example-brands", name: "Example Brands" },
    ],
  },
  "software-hardware": {
    name: "Essential Software & Hardware Links",
    categories: [
      { id: "plugins", name: "Plugins (Waves, Splice)" },
      { id: "daws", name: "DAWs (FL Studio, Ableton, Logic)" },
      { id: "hardware", name: "Hardware (Mics, Speakers, Monitors)" },
    ],
  },
  "learning-resources": {
    name: "Learning Resources",
    categories: [
      { id: "youtube-channels", name: "YouTube Channels" },
      { id: "tiktok-creators", name: "TikTok Creators" },
      { id: "kick-twitch-tips", name: "Kick/Twitch Tips" },
    ],
  },
  "local-performance": {
    name: "Local Performance Finder",
    categories: [
      { id: "find-venues", name: "Find Venues" },
    ],
  },
} as const;

export type SectionKey = keyof typeof SECTIONS;

