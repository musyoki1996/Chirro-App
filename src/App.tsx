/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  updateDoc 
} from 'firebase/firestore';
import { 
  Sparkles, 
  Layers, 
  Users2, 
  Activity, 
  Bell, 
  Search, 
  CheckCircle2, 
  MessageSquare,
  HelpCircle,
  Briefcase,
  Compass,
  ArrowRight,
  TrendingUp,
  MapPin,
  Check,
  Plus
} from 'lucide-react';

import { db, handleFirestoreError, OperationType } from './lib/firebase';
import { Post, Circle, Reply, OpportunityResponse, ReportItem, PostType } from './types';
import { INITIAL_POSTS, INITIAL_CIRCLES } from './data/seedData';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import { Navbar } from './components/Navigation/Navbar';
import { Sidebar, TabType } from './components/Navigation/Sidebar';
import { MobileNav } from './components/Navigation/MobileNav';
import { PostCard } from './components/Feed/PostCard';
import { InlineComposer } from './components/Feed/InlineComposer';
import { CreatePostModal } from './components/Feed/CreatePostModal';
import { PostDetailModal } from './components/Feed/PostDetailModal';
import { RespondModal } from './components/Feed/RespondModal';
import { OnboardingModal } from './components/Onboarding/OnboardingModal';
import { PulseView } from './components/Pulse/PulseView';
import { CirclesView } from './components/Circles/CirclesView';
import { OpportunitiesView } from './components/Opportunities/OpportunitiesView';
import { ProfileView } from './components/Profile/ProfileView';
import { SearchModal } from './components/Search/SearchModal';
import { ReportModal } from './components/Common/ReportModal';
import { AdminModal } from './components/Admin/AdminModal';

function MainApp() {
  const { profile, user, restartOnboarding, isAdmin } = useAuth();
  const { t } = useLanguage();

  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [feedMode, setFeedMode] = useState<'for_you' | 'following'>('for_you');
  const [activeFilterType, setActiveFilterType] = useState<string>('all');

  // Core Data
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [circles, setCircles] = useState<Circle[]>(INITIAL_CIRCLES);
  const [replies, setReplies] = useState<Reply[]>([
    {
      id: 'rep-1',
      postId: 'post-1-project',
      authorId: 'user-chidi',
      authorName: 'Chidi Okafor',
      authorUsername: 'chidi_fintech',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      content: 'Brilliant initiative Wangari! I can help connect you with our IoT hardware partners in Nairobi for bulk LoRa sensor procurement.',
      createdAt: '2026-10-28T15:30:00Z',
    },
  ]);
  const [reports, setReports] = useState<ReportItem[]>([
    {
      id: 'rep-seed-1',
      reporterId: 'user-flag-1',
      targetType: 'post',
      targetId: 'post-sample-flag',
      reason: 'spam',
      details: 'Unverified loan bot spam attempt.',
      status: 'pending',
      createdAt: '2026-10-29T03:00:00Z',
    }
  ]);

  // Joined Circles Set
  const [joinedCircleIds, setJoinedCircleIds] = useState<Set<string>>(new Set(['circle-silicon-savannah']));

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedThreadPost, setSelectedThreadPost] = useState<Post | null>(null);
  const [selectedRespondPost, setSelectedRespondPost] = useState<Post | null>(null);
  const [selectedReportPost, setSelectedReportPost] = useState<Post | null>(null);

  // Sync / Listen to Firestore Posts
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      const postsCol = collection(db, 'posts');
      unsubscribe = onSnapshot(
        postsCol,
        snapshot => {
          if (!snapshot.empty) {
            const dbPosts: Post[] = [];
            snapshot.forEach(docSnap => {
              dbPosts.push({ id: docSnap.id, ...docSnap.data() } as Post);
            });
            const seedIds = new Set(dbPosts.map(p => p.id));
            const remainingSeeds = INITIAL_POSTS.filter(p => !seedIds.has(p.id));
            setPosts([...dbPosts, ...remainingSeeds]);
          }
        },
        error => {
          console.warn('Realtime listener notice (using seed cache):', error.message);
        }
      );
    } catch (err) {
      console.warn('Firestore subscription catch:', err);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleCreatePost = async (postData: Partial<Post>) => {
    const newPost: Post = {
      id: 'post-' + Date.now(),
      authorId: user?.uid || profile?.userId || 'guest-author',
      authorName: profile?.displayName || 'Amani Mwangi',
      authorUsername: profile?.username || 'amani_builder',
      authorAvatar: profile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      postType: postData.postType || 'discussion',
      content: postData.content || '',
      tags: postData.tags || ['Chirro'],
      circleId: postData.circleId,
      circleName: postData.circleName,
      location: postData.location || `${profile?.city || 'San Francisco'}, ${profile?.country || 'United States'}`,
      mediaUrl: postData.mediaUrl,
      opportunityTitle: postData.opportunityTitle,
      opportunityCategory: postData.opportunityCategory,
      opportunityDeadline: postData.opportunityDeadline,
      opportunityStatus: postData.opportunityStatus || 'open',
      eventDate: postData.eventDate,
      eventLocation: postData.eventLocation,
      pollOptions: postData.pollOptions,
      pollVotes: {},
      likesCount: 0,
      repliesCount: 0,
      repostsCount: 0,
      bookmarksCount: 0,
      createdAt: new Date().toISOString(),
    };

    setPosts(prev => [newPost, ...prev]);

    try {
      await setDoc(doc(db, 'posts', newPost.id), newPost);
    } catch (err) {
      console.warn('Post saved locally (Firestore offline or permission pending):', err);
    }
  };

  const handleVotePoll = async (postId: string, optionId: string) => {
    const currentUserId = user?.uid || profile?.userId || 'guest-voter';
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId || !p.pollOptions) return p;
        const currentVote = p.pollVotes?.[currentUserId];
        if (currentVote === optionId) return p;

        const updatedOptions = p.pollOptions.map(opt => {
          if (opt.id === optionId) return { ...opt, votes: opt.votes + 1 };
          if (opt.id === currentVote) return { ...opt, votes: Math.max(0, opt.votes - 1) };
          return opt;
        });

        const updatedVotes = { ...(p.pollVotes || {}), [currentUserId]: optionId };
        return { ...p, pollOptions: updatedOptions, pollVotes: updatedVotes };
      })
    );
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev =>
      prev.map(p => (p.id === postId ? { ...p, likesCount: p.likesCount + 1 } : p))
    );
  };

  const handleBookmarkPost = (postId: string) => {
    setPosts(prev =>
      prev.map(p => (p.id === postId ? { ...p, bookmarksCount: (p.bookmarksCount || 0) + 1 } : p))
    );
  };

  const handleAddReply = (postId: string, content: string) => {
    const reply: Reply = {
      id: 'rep-' + Date.now(),
      postId,
      authorId: user?.uid || profile?.userId || 'guest-reply',
      authorName: profile?.displayName || 'Explorer',
      authorUsername: profile?.username || 'explorer',
      authorAvatar: profile?.avatarUrl,
      content,
      createdAt: new Date().toISOString(),
    };

    setReplies(prev => [...prev, reply]);
    setPosts(prev =>
      prev.map(p => (p.id === postId ? { ...p, repliesCount: (p.repliesCount || 0) + 1 } : p))
    );
  };

  const handleRespondToOpportunity = (postId: string, message: string, skills: string[]) => {
    const target = posts.find(p => p.id === postId);
    if (!target) return;

    const newResponse: OpportunityResponse = {
      id: 'resp-' + Date.now(),
      opportunityId: postId,
      ownerId: target.authorId,
      respondentId: user?.uid || profile?.userId || 'guest-resp',
      respondentName: profile?.displayName || 'Explorer',
      respondentUsername: profile?.username || 'explorer',
      respondentAvatar: profile?.avatarUrl,
      message,
      skills,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    try {
      setDoc(doc(db, 'opportunityResponses', newResponse.id), newResponse);
    } catch (err) {
      console.warn('Saved opportunity response locally:', err);
    }
  };

  const handleSubmitReport = (targetId: string, reason: string, details: string) => {
    const newReport: ReportItem = {
      id: 'rep-' + Date.now(),
      reporterId: user?.uid || profile?.userId || 'guest-reporter',
      targetType: 'post',
      targetId,
      reason,
      details,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setReports(prev => [newReport, ...prev]);
  };

  const handleResolveReport = (reportId: string, action: 'dismissed' | 'actioned') => {
    setReports(prev =>
      prev.map(r => (r.id === reportId ? { ...r, status: action } : r))
    );
  };

  const handleToggleJoinCircle = (circleId: string) => {
    const next = new Set(joinedCircleIds);
    if (next.has(circleId)) {
      next.delete(circleId);
      setCircles(prev => prev.map(c => c.id === circleId ? { ...c, memberCount: Math.max(1, c.memberCount - 1) } : c));
    } else {
      next.add(circleId);
      setCircles(prev => prev.map(c => c.id === circleId ? { ...c, memberCount: c.memberCount + 1 } : c));
    }
    setJoinedCircleIds(next);
  };

  const handleCreateCircle = (circleData: Partial<Circle>) => {
    const newCircle: Circle = {
      id: 'circle-' + Date.now(),
      name: circleData.name || 'New Circle',
      slug: circleData.slug || 'new-circle',
      description: circleData.description || '',
      category: circleData.category || 'tech',
      isPrivate: false,
      memberCount: 1,
      iconUrl: circleData.iconUrl,
      ownerId: user?.uid || profile?.userId || 'owner',
      rules: circleData.rules,
      createdAt: new Date().toISOString(),
    };
    setCircles(prev => [newCircle, ...prev]);
  };

  const homeFeedPosts = posts.filter(p => {
    if (activeFilterType !== 'all' && p.postType !== activeFilterType) return false;
    if (feedMode === 'following') {
      return p.circleName !== undefined || p.authorId === profile?.userId;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCreate={() => setIsCreateOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Container Layout: Left Rail | Center Timeline | Right Trends */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex justify-center">
        
        {/* Left Navigation Rail (Desktop) */}
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          onOpenCreate={() => setIsCreateOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* Center Main Timeline (Twitter/Facebook width standard ~640px) */}
        <main className="flex-1 min-w-0 max-w-2xl px-3 sm:px-4 py-4 pb-24 lg:pb-12 space-y-4">
          
          {/* TAB 1: HOME FEED */}
          {currentTab === 'home' && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Twitter-style Sticky Header with Discovery / Following Tabs */}
              <div className="sticky top-16 z-30 -mx-3 sm:-mx-4 px-3 sm:px-4 pt-1 pb-0 bg-[#0B1120]/95 backdrop-blur-md border-b border-[#1A2640]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-sm font-bold">
                    <button
                      onClick={() => setFeedMode('for_you')}
                      className={`py-3 relative transition-colors ${
                        feedMode === 'for_you'
                          ? 'text-sky-400 font-extrabold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>{t('feedForYou')}</span>
                      {feedMode === 'for_you' && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-sky-400 rounded-full" />
                      )}
                    </button>

                    <button
                      onClick={() => setFeedMode('following')}
                      className={`py-3 relative transition-colors ${
                        feedMode === 'following'
                          ? 'text-sky-400 font-extrabold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>{t('feedFollowing')}</span>
                      {feedMode === 'following' && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-sky-400 rounded-full" />
                      )}
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                    {homeFeedPosts.length} posts
                  </span>
                </div>
              </div>

              {/* Professional Inline Post Composer (Facebook/Twitter top box) */}
              <InlineComposer onPublish={handleCreatePost} />

              {/* Filter Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
                {[
                  { id: 'all', label: 'All Feed' },
                  { id: 'project', label: '🚀 Projects' },
                  { id: 'opportunity', label: '💼 Gigs & Roles' },
                  { id: 'poll', label: '📊 Polls' },
                  { id: 'event', label: '📅 Events' },
                  { id: 'question', label: '💡 Questions' },
                  { id: 'discussion', label: '💬 Discussions' },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFilterType(f.id)}
                    className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                      activeFilterType === f.id
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold shadow-sm shadow-sky-500/10'
                        : 'text-slate-400 hover:text-slate-200 bg-[#111A2E] border border-[#1C2C4E]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Timeline Stream */}
              <div className="space-y-3.5">
                {homeFeedPosts.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl bg-[#111A2E]/50 border border-dashed border-[#1C2C4E] space-y-2">
                    <Compass className="w-10 h-10 text-slate-500 mx-auto" />
                    <p className="text-slate-200 font-bold text-sm">{t('emptyFeed')}</p>
                  </div>
                ) : (
                  homeFeedPosts.map(post => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onLike={handleLikePost}
                      onBookmark={handleBookmarkPost}
                      onOpenReply={p => setSelectedThreadPost(p)}
                      onOpenRespond={p => setSelectedRespondPost(p)}
                      onOpenReport={p => setSelectedReportPost(p)}
                      onVotePoll={handleVotePoll}
                    />
                  ))
                )}
              </div>

            </div>
          )}

          {/* TAB 2: PULSE */}
          {currentTab === 'pulse' && (
            <PulseView
              posts={posts}
              onLike={handleLikePost}
              onBookmark={handleBookmarkPost}
              onOpenReply={p => setSelectedThreadPost(p)}
              onOpenRespond={p => setSelectedRespondPost(p)}
              onOpenReport={p => setSelectedReportPost(p)}
              onVotePoll={handleVotePoll}
            />
          )}

          {/* TAB 3: CIRCLES */}
          {currentTab === 'circles' && (
            <CirclesView
              circles={circles}
              posts={posts}
              onJoinCircle={handleToggleJoinCircle}
              onCreateCircle={handleCreateCircle}
              onLike={handleLikePost}
              onBookmark={handleBookmarkPost}
              onOpenReply={p => setSelectedThreadPost(p)}
              onOpenRespond={p => setSelectedRespondPost(p)}
              onOpenReport={p => setSelectedReportPost(p)}
            />
          )}

          {/* TAB 4: OPPORTUNITIES / ACTION HUB */}
          {currentTab === 'opportunities' && (
            <OpportunitiesView
              posts={posts}
              onOpenCreate={() => setIsCreateOpen(true)}
              onLike={handleLikePost}
              onBookmark={handleBookmarkPost}
              onOpenReply={p => setSelectedThreadPost(p)}
              onOpenRespond={p => setSelectedRespondPost(p)}
              onOpenReport={p => setSelectedReportPost(p)}
            />
          )}

          {/* TAB 5: NOTIFICATIONS */}
          {currentTab === 'notifications' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-[#111A2E] border border-[#1C2C4E] flex items-center justify-between">
                <h3 className="font-bold text-white text-base flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-sky-400" />
                  <span>Activity & Responses</span>
                </h3>
                <span className="text-xs text-sky-400 font-semibold cursor-pointer hover:underline">
                  Mark all as read
                </span>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    id: 'notif-1',
                    sender: 'Chidi Okafor',
                    action: 'responded to your IoT Clean Water telemetry project',
                    time: '15m ago',
                    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                  },
                  {
                    id: 'notif-2',
                    sender: 'Amina Uwase',
                    action: 'liked your question in Pan-African AgriPreneurs',
                    time: '1h ago',
                    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
                  },
                  {
                    id: 'notif-3',
                    sender: 'Silicon Savannah Developers',
                    action: 'pinned the LoRaWAN telemetry discussion',
                    time: '3h ago',
                    avatar: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&auto=format&fit=crop&q=80',
                  },
                ].map(item => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-[#111A2E] border border-[#1C2C4E] flex items-center space-x-3 text-xs"
                  >
                    <img src={item.avatar} className="w-10 h-10 rounded-full object-cover ring-1 ring-sky-400/25" />
                    <div className="flex-1">
                      <p className="text-slate-200">
                        <strong className="text-white font-semibold">{item.sender}</strong> {item.action}.
                      </p>
                      <span className="text-[10px] text-slate-500">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PROFILE */}
          {currentTab === 'profile' && (
            <ProfileView
              posts={posts}
              onLike={handleLikePost}
              onBookmark={handleBookmarkPost}
              onOpenReply={p => setSelectedThreadPost(p)}
              onOpenRespond={p => setSelectedRespondPost(p)}
              onOpenReport={p => setSelectedReportPost(p)}
            />
          )}

        </main>

        {/* Right Discovery / Contextual Panel (Twitter/X style sidebar) */}
        <aside className="hidden xl:block w-80 2xl:w-88 p-4 border-l border-[#1A2640] sticky top-16 h-[calc(100vh-4rem)] space-y-4 overflow-y-auto">
          
          {/* Quick Search Widget */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              onClick={() => setIsSearchOpen(true)}
              readOnly
              placeholder="Search Chirro..."
              className="w-full bg-[#111A2E] border border-[#1C2C4E] hover:border-sky-500/40 rounded-full pl-10 pr-4 py-2 text-xs text-slate-300 placeholder-slate-500 cursor-pointer shadow-inner"
            />
          </div>

          {/* Twitter/X-style "Trending Worldwide & Breaking" card */}
          <div className="p-4 rounded-2xl bg-[#111A2E] border border-[#1C2C4E] space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center space-x-1.5">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              <span>Trending Worldwide & Breaking</span>
            </h3>

            <div className="space-y-3 text-xs">
              {[
                { category: 'Breaking News · Geneva', tag: '#ClimateTreaty2026', count: '142.8K posts' },
                { category: 'Frontier AI · San Francisco', tag: '#OpenVeracity', count: '89.4K posts' },
                { category: 'Global Finance · London', tag: '#TreasuryTokens', count: '64.1K posts' },
                { category: 'Space Exploration · Live', tag: '#InterstellarComet', count: '52.7K posts' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentTab('pulse')}
                  className="group cursor-pointer hover:bg-[#15233E] -mx-2 p-2 rounded-xl transition-colors"
                >
                  <p className="text-[11px] text-slate-400">{item.category}</p>
                  <p className="font-bold text-slate-100 group-hover:text-sky-300 transition-colors">
                    {item.tag}
                  </p>
                  <p className="text-[11px] text-slate-500">{item.count}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setCurrentTab('pulse')}
              className="text-xs text-sky-400 hover:text-sky-300 hover:underline font-semibold block pt-1"
            >
              Show more world trends →
            </button>
          </div>

          {/* Facebook-style "Suggested Circles to Join" */}
          <div className="p-4 rounded-2xl bg-[#111A2E] border border-[#1C2C4E] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center space-x-1.5">
                <Users2 className="w-4 h-4 text-sky-400" />
                <span>Circles for You</span>
              </h3>
              <button
                onClick={() => setCurrentTab('circles')}
                className="text-[11px] text-sky-400 hover:underline"
              >
                View all
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {circles.slice(0, 3).map(c => {
                const isJoined = joinedCircleIds.has(c.id);
                return (
                  <div
                    key={c.id}
                    className="flex items-center justify-between gap-2.5"
                  >
                    <div
                      onClick={() => setCurrentTab('circles')}
                      className="flex items-center space-x-2.5 min-w-0 cursor-pointer group flex-1"
                    >
                      <img src={c.iconUrl} className="w-9 h-9 rounded-xl object-cover border border-[#1C2C4E] flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-200 group-hover:text-sky-300 transition-colors truncate">
                          {c.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {c.memberCount.toLocaleString()} members
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleJoinCircle(c.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex-shrink-0 ${
                        isJoined
                          ? 'bg-[#182642] text-sky-300 border border-sky-600/40 hover:bg-[#1E3054]'
                          : 'bg-sky-400 text-slate-950 hover:bg-sky-300 shadow-sm'
                      }`}
                    >
                      {isJoined ? 'Joined' : 'Join'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Featured Action Layer Spotlight */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#12203E] to-[#0D1629] border border-sky-500/30 space-y-2">
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Action Spotlight</span>
            </span>
            <h4 className="font-bold text-white text-xs sm:text-sm">
              Solar Telemetry for Community Boreholes
            </h4>
            <p className="text-slate-300 text-xs line-clamp-2 leading-relaxed">
              Deploying LoRaWAN water tank sensors in Kajiado County. Looking for 2 Node/TypeScript engineers!
            </p>
            <button
              onClick={() => {
                const target = posts.find(p => p.id === 'post-1-project');
                if (target) setSelectedRespondPost(target);
              }}
              className="w-full mt-1 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-sky-500 text-white hover:brightness-110 shadow-sm shadow-sky-500/25"
            >
              Collaborate on Project
            </button>
          </div>

          {/* Quiet Footer Links */}
          <div className="px-2 text-[11px] text-slate-500 space-y-1">
            <div className="flex flex-wrap gap-x-2 gap-y-0.5">
              <span className="hover:underline cursor-pointer">Terms of Service</span>
              <span>·</span>
              <span className="hover:underline cursor-pointer">Privacy Policy</span>
              <span>·</span>
              <span className="hover:underline cursor-pointer">Security</span>
              <span>·</span>
              <span className="hover:underline cursor-pointer">Kiswahili</span>
            </div>
            <p>© 2026 Chirro World News Network, Inc.</p>
          </div>

        </aside>

      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenCreate={() => setIsCreateOpen(true)}
      />

      {/* Interactive Modals */}
      <OnboardingModal
        onPublishFirstPost={firstPost => {
          handleCreatePost(firstPost);
          setCurrentTab('home');
        }}
      />

      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onPublish={handleCreatePost}
      />

      <PostDetailModal
        post={selectedThreadPost}
        isOpen={Boolean(selectedThreadPost)}
        onClose={() => setSelectedThreadPost(null)}
        replies={replies}
        onAddReply={handleAddReply}
      />

      <RespondModal
        post={selectedRespondPost}
        isOpen={Boolean(selectedRespondPost)}
        onClose={() => setSelectedRespondPost(null)}
        onSubmitResponse={handleRespondToOpportunity}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        posts={posts}
        circles={circles}
        onSelectPost={post => {
          setSelectedThreadPost(post);
        }}
        onSelectCircle={() => {
          setCurrentTab('circles');
        }}
      />

      <ReportModal
        post={selectedReportPost}
        isOpen={Boolean(selectedReportPost)}
        onClose={() => setSelectedReportPost(null)}
        onSubmitReport={handleSubmitReport}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        reports={reports}
        totalPostsCount={posts.length}
        totalCirclesCount={circles.length}
        onResolveReport={handleResolveReport}
      />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
