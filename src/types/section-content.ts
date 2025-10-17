/**
 * Section Content 타입 정의
 */

// Hero Section
export interface HeroContent {
  heading?: string;
  subheading?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  buttons?: Array<{
    text?: string;
    label?: string;
    href?: string;
  }>;
  verse?: string;
  verseReference?: string;
  verseEn?: string;
  verseReferenceEn?: string;
}

// Info Cards Section
export interface InfoCardsContent {
  cards?: Array<{
    title?: string;
    description?: string;
    icon?: string;
    link?: {
      text?: string;
      href?: string;
    };
    sermons?: Array<{
      category: string;
      youtubeUrl: string;
      title?: string;
    }>;
    items?: Array<{
      icon?: string;
      label: string;
      value: string;
    }>;
  }>;
  images?: Array<{
    url: string;
    alt?: string;
  }>;
  autoPlayInterval?: number;
}

// Welcome Section
export interface WelcomeContent {
  heading?: string;
  subheading?: string;
  description?: string;
  items?: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
}

// Pastor Section
export interface PastorContent {
  name?: string;
  title?: string;
  photo?: string;
  bio?: string[];
}

// Location Section
export interface LocationContent {
  address?: string;
  addressDetail?: string;
  phone?: string;
  mapUrl?: string;
  parking?: string;
  transport?: string;
}

// Department Section
export interface DepartmentContent {
  name?: string;
  description?: string;
  age?: string;
  time?: string;
  location?: string;
  teacher?: string;
  activities?: string[];
  programs?: Array<{
    title: string;
    description: string;
  }>;
  photo?: string;
}

// Nurture Section
export interface NurtureContent {
  title?: string;
  description?: string;
  curriculum?: Array<{
    week?: number;
    title: string;
    description: string;
  }>;
}

// Mission Section
export interface MissionContent {
  missionFields?: Array<{
    country: string;
    description: string;
    missionaries?: number;
  }>;
  missionaries?: Array<{
    name: string;
    country: string;
    photo?: string;
    ministry: string;
  }>;
}

// Notices Section
export interface NoticesContent {
  notices?: Array<{
    title: string;
    date: string;
    content: string;
  }>;
}

// Prayer Section
export interface PrayerContent {
  prayers?: Array<{
    title: string;
    content: string;
    date: string;
  }>;
}

// Gallery Section
export interface GalleryContent {
  albums?: Array<{
    category: string;
    title: string;
    photos: Array<{
      url: string;
      alt?: string;
    }>;
  }>;
}

// LifeGroup Section
export interface LifeGroupContent {
  lifegroups?: Array<{
    number: number;
    leader: string;
    members: string[];
    meetingDay?: string;
    location?: string;
  }>;
}

// Cards Section
export interface CardsContent {
  cards?: Array<{
    icon?: string;
    title?: string;
    description?: string;
    link?: {
      text?: string;
      href?: string;
    };
  }>;
}

// Generic Content (fallback)
export type SectionContent = 
  | HeroContent
  | InfoCardsContent
  | WelcomeContent
  | PastorContent
  | LocationContent
  | DepartmentContent
  | NurtureContent
  | MissionContent
  | NoticesContent
  | PrayerContent
  | GalleryContent
  | LifeGroupContent
  | CardsContent
  | Record<string, unknown>;

