export type PostType =
  | 'discussion'
  | 'question'
  | 'poll'
  | 'event'
  | 'project'
  | 'opportunity'
  | 'community_request';

export type OpportunityStatus = 'open' | 'in_progress' | 'completed' | 'closed';

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface UserProfile {
  userId: string;
  username: string;
  displayName: string;
  bio?: string;
  country?: string;
  city?: string;
  avatarUrl?: string;
  coverUrl?: string;
  interests?: string[];
  skills?: string[];
  isOnboarded: boolean;
  followersCount?: number;
  followingCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar?: string;
  postType: PostType;
  content: string;
  tags?: string[];
  circleId?: string;
  circleName?: string;
  location?: string;
  mediaUrl?: string;
  // Action Layer fields
  opportunityTitle?: string;
  opportunityCategory?: string;
  opportunityDeadline?: string;
  opportunityStatus?: OpportunityStatus;
  eventDate?: string;
  eventLocation?: string;
  pollOptions?: PollOption[];
  pollVotes?: Record<string, string>; // userId -> optionId
  likesCount: number;
  repliesCount: number;
  repostsCount?: number;
  bookmarksCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Reply {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

export interface Circle {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  isPrivate: boolean;
  memberCount: number;
  iconUrl?: string;
  bannerUrl?: string;
  ownerId: string;
  rules?: string[];
  createdAt: string;
}

export interface OpportunityResponse {
  id: string;
  opportunityId: string;
  ownerId: string;
  respondentId: string;
  respondentName: string;
  respondentUsername: string;
  respondentAvatar?: string;
  message: string;
  skills?: string[];
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  recipientId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  type: 'like' | 'reply' | 'follow' | 'opportunity_response' | 'mention';
  targetId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface ReportItem {
  id: string;
  reporterId: string;
  targetType: 'post' | 'profile' | 'circle';
  targetId: string;
  reason: string;
  details?: string;
  status: 'pending' | 'reviewed' | 'dismissed' | 'actioned';
  createdAt: string;
}
