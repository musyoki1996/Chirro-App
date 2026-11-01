import React, { useState } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Repeat2, 
  Bookmark, 
  Share2, 
  MapPin, 
  Sparkles, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Languages, 
  MoreHorizontal, 
  Flag, 
  Check, 
  Send, 
  BarChart2, 
  Briefcase, 
  Layers, 
  HelpCircle,
  BadgeCheck,
  Link,
  MessageCircle
} from 'lucide-react';
import { Post, PostType } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { APP_ASSETS } from '../../constants/assets';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onOpenReply: (post: Post) => void;
  onOpenRespond: (post: Post) => void;
  onOpenReport: (post: Post) => void;
  onVotePoll?: (postId: string, optionId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onBookmark,
  onOpenReply,
  onOpenRespond,
  onOpenReport,
  onVotePoll,
}) => {
  const { profile, user } = useAuth();
  const { language, t } = useLanguage();

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isReposted, setIsReposted] = useState(false);
  const [repostsCount, setRepostsCount] = useState(post.repostsCount || 0);
  const [isRsvped, setIsRsvped] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const currentUserId = user?.uid || profile?.userId || 'guest';
  const userVotedOption = post.pollVotes?.[currentUserId];

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => (isLiked ? prev - 1 : prev + 1));
    onLike(post.id);
  };

  const handleRepostClick = () => {
    setIsReposted(!isReposted);
    setRepostsCount(prev => (isReposted ? prev - 1 : prev + 1));
  };

  const handleBookmarkClick = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark(post.id);
  };

  const handleShareClick = () => {
    try {
      navigator.clipboard.writeText(window.location.origin + `/#post-${post.id}`);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    } catch {
      // fallback
    }
  };

  const getBadgeForPostType = (type: PostType) => {
    switch (type) {
      case 'project':
        return { label: 'Project', color: 'text-sky-300 bg-sky-950/40 border-sky-700/40', icon: Layers };
      case 'opportunity':
        return { label: 'Opportunity', color: 'text-blue-300 bg-blue-950/40 border-blue-700/40', icon: Briefcase };
      case 'event':
        return { label: 'Event', color: 'text-violet-300 bg-violet-950/40 border-violet-700/40', icon: Calendar };
      case 'poll':
        return { label: 'Community Poll', color: 'text-amber-300 bg-amber-950/40 border-amber-700/40', icon: BarChart2 };
      case 'question':
        return { label: 'Question', color: 'text-cyan-300 bg-cyan-950/40 border-cyan-700/40', icon: HelpCircle };
      case 'community_request':
        return { label: 'Request', color: 'text-rose-300 bg-rose-950/40 border-rose-700/40', icon: Sparkles };
      default:
        return null;
    }
  };

  const badgeInfo = getBadgeForPostType(post.postType);
  const totalVotes = post.pollOptions?.reduce((acc, opt) => acc + opt.votes, 0) || 0;

  const getTranslatedContent = () => {
    if (language === 'en' && !isTranslated) return post.content;
    if (language === 'sw' || isTranslated) {
      if (post.id === 'post-1-project') {
        return 'Tunasambaza sensa za LoRaWAN za sola kwenye visima 12 vya jamii Kaunti ya Kajiado, Kenya. Mfumo unawataarifu wazee wa wafugaji kwa SMS tanki linapopungua chini ya 20%. Tunahitaji wachangiaji 2 wenye uzoefu wa Node/TypeScript na MQTT!';
      }
      if (post.id === 'post-2-poll') {
        return 'Kwa biashara ya mtandaoni ya kuvuka mipaka Afrika (mfano malipo kati ya wafanyabiashara wa Lagos na Nairobi), ni njia ipi inayoleta kasi zaidi na kupunguza msuguano wa sarafu kwa miezi 24 ijayo?';
      }
      if (post.id === 'post-3-opportunity') {
        return 'Ushirika wetu wa afya mjini Kigali unatafuta mbunifu mahiri wa UI/UX kusaidia kutafiti na kutengeneza app ya uzazi kwa lugha mbili (Kinyarwanda na Kiingereza). Mkataba wenye malipo mazuri.';
      }
      return `[Tafsiri ya Kiswahili]: ${post.content}`;
    }
    return post.content;
  };

  // Relative time format
  const getRelativeTime = (isoString: string) => {
    try {
      const now = new Date();
      const past = new Date(isoString);
      const diffSecs = Math.floor((now.getTime() - past.getTime()) / 1000);
      if (diffSecs < 60) return `${diffSecs}s`;
      const diffMins = Math.floor(diffSecs / 60);
      if (diffMins < 60) return `${diffMins}m`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h`;
      return past.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return 'recent';
    }
  };

  return (
    <article className="p-4 sm:p-5 rounded-2xl bg-[#111A2E] hover:bg-[#142038] border border-[#1C2C4E] transition-colors duration-150 relative shadow-sm">
      
      {/* Rechirped indicator */}
      {isReposted && (
        <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-sky-400 mb-2 -mt-1 pl-1">
          <img src={APP_ASSETS.RECHIRP_ICON} alt="" className="w-3.5 h-3.5 object-contain" />
          <span>You rechirped</span>
        </div>
      )}

      {/* Twitter/Facebook Style Author Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3 min-w-0">
          <img
            src={post.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={post.authorName}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-sky-400/20 flex-shrink-0 mt-0.5"
          />

          <div className="min-w-0">
            <div className="flex items-center space-x-1.5 flex-wrap">
              <span className="font-bold text-white text-sm hover:text-sky-300 hover:underline cursor-pointer">
                {post.authorName}
              </span>
              <BadgeCheck className="w-4 h-4 text-sky-400 fill-sky-400/20 flex-shrink-0" />
              <span className="text-xs text-slate-400 truncate">
                @{post.authorUsername}
              </span>
              <span className="text-slate-600 text-xs">·</span>
              <span className="text-xs text-slate-400 hover:underline cursor-pointer">
                {getRelativeTime(post.createdAt)}
              </span>
              {badgeInfo && (
                <>
                  <span className="text-slate-600 text-xs">·</span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${badgeInfo.color}`}>
                    {badgeInfo.label}
                  </span>
                </>
              )}
            </div>

            {/* Context Line: Circle & Location */}
            {(post.circleName || post.location) && (
              <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                {post.circleName && (
                  <span className="text-sky-400/90 font-medium hover:underline cursor-pointer">
                    in {post.circleName}
                  </span>
                )}
                {post.circleName && post.location && <span>·</span>}
                {post.location && (
                  <span className="flex items-center space-x-0.5 text-slate-400">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{post.location}</span>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* More Menu */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-[#15223C] transition-colors"
            aria-label="More options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-[#0E1626] border border-[#1E2E50] rounded-xl shadow-2xl p-1 z-30 text-xs text-slate-200 animate-fadeIn">
              <button
                onClick={() => {
                  setIsTranslated(!isTranslated);
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#15223C] flex items-center space-x-2"
              >
                <Languages className="w-3.5 h-3.5 text-sky-400" />
                <span>{isTranslated ? t('showOriginal') : t('translateToSwahili')}</span>
              </button>
              <button
                onClick={() => {
                  handleShareClick();
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#15223C] flex items-center space-x-2"
              >
                <Link className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy post link</span>
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  onOpenReport(post);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-950/40 flex items-center space-x-2"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{t('report')}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Prose */}
      <div className="mt-2.5">
        <p className="text-slate-100 text-[14.5px] leading-relaxed whitespace-pre-line font-normal">
          {getTranslatedContent()}
        </p>
      </div>

      {/* Action Layer Structured Card (Projects & Opportunities) */}
      {post.opportunityTitle && (
        <div className="mt-3 p-3.5 bg-[#131E35] rounded-xl border border-sky-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
              {post.opportunityCategory || 'Action Initiative'}
            </span>
            <h4 className="font-bold text-white text-sm sm:text-base leading-snug">
              {post.opportunityTitle}
            </h4>
            {post.opportunityDeadline && (
              <p className="text-[11px] text-sky-200 flex items-center space-x-1">
                <Clock className="w-3 h-3 text-sky-400" />
                <span>Target Deadline: {post.opportunityDeadline}</span>
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-sky-950/60 text-sky-300 border border-sky-800/60">
              {post.opportunityStatus === 'open' ? t('statusOpen') : post.opportunityStatus}
            </span>
            <button
              onClick={() => onOpenRespond(post)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-sky-500 text-white hover:brightness-110 shadow-sm shadow-sky-500/20 transition-all"
            >
              Collaborate
            </button>
          </div>
        </div>
      )}

      {/* Event Details Card */}
      {post.postType === 'event' && post.eventDate && (
        <div className="mt-3 p-3.5 rounded-xl bg-[#15233E] border border-sky-800/40 flex items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <p className="font-bold text-sky-300 flex items-center space-x-1.5 text-sm">
              <Calendar className="w-4 h-4 text-sky-400" />
              <span>{post.eventDate}</span>
            </p>
            {post.eventLocation && (
              <p className="text-slate-300 flex items-center space-x-1.5 text-xs">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{post.eventLocation}</span>
              </p>
            )}
          </div>
          <button
            onClick={() => setIsRsvped(!isRsvped)}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all text-xs flex items-center space-x-1 ${
              isRsvped
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                : 'bg-sky-500 text-white hover:bg-sky-600'
            }`}
          >
            {isRsvped ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>RSVP Confirmed</span>
              </>
            ) : (
              <span>{t('rsvpBtn')}</span>
            )}
          </button>
        </div>
      )}

      {/* Poll Voting Section */}
      {post.postType === 'poll' && post.pollOptions && (
        <div className="mt-3 space-y-2">
          {post.pollOptions.map(opt => {
            const hasVoted = Boolean(userVotedOption);
            const isThisOpt = userVotedOption === opt.id;
            const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onVotePoll && onVotePoll(post.id, opt.id)}
                className={`w-full relative overflow-hidden text-left p-3 rounded-xl border text-xs transition-all ${
                  isThisOpt
                    ? 'border-sky-400 bg-sky-950/40 text-white font-bold'
                    : 'border-[#1C2C4E] bg-[#0E1626] text-slate-300 hover:border-sky-700/50'
                }`}
              >
                {hasVoted && (
                  <div
                    className="absolute inset-y-0 left-0 bg-sky-500/25 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                )}
                <div className="relative flex items-center justify-between z-10">
                  <div className="flex items-center space-x-2">
                    {isThisOpt && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />}
                    <span>{opt.text}</span>
                  </div>
                  {hasVoted && (
                    <span className="font-mono text-sky-300 text-xs">
                      {pct}% ({opt.votes})
                    </span>
                  )}
                </div>
              </button>
            );
          })}
          <p className="text-[11px] text-slate-400 pl-1 font-mono">
            {totalVotes} total community votes
          </p>
        </div>
      )}

      {/* Media Attachment */}
      {post.mediaUrl && (
        <div className="mt-3 rounded-xl overflow-hidden border border-[#1C2C4E] max-h-80">
          <img
            src={post.mediaUrl}
            alt="Post attachment"
            className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-200"
          />
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {post.tags.map(tag => (
            <span
              key={tag}
              className="text-[11px] px-2 py-0.5 rounded-md bg-[#131E35] text-sky-300 border border-sky-900/30 font-mono hover:bg-[#1B2A4B] cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Twitter/Facebook Style Engagement Bar */}
      <div className="mt-3 pt-2.5 border-t border-[#1A2640] flex items-center justify-between text-slate-400 text-xs max-w-lg">
        
        {/* Reply */}
        <button
          onClick={() => onOpenReply(post)}
          className="group flex items-center space-x-2 hover:text-sky-400 transition-colors py-1 px-2 rounded-full hover:bg-sky-500/10"
        >
          <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-mono">{post.repliesCount || 0}</span>
        </button>

        {/* Rechirp (replaces Retweet) */}
        <button
          type="button"
          onClick={handleRepostClick}
          className={`group flex items-center space-x-1.5 transition-colors py-1 px-2.5 rounded-full hover:bg-sky-500/10 ${
            isReposted ? 'text-sky-400 font-bold bg-sky-500/10' : 'hover:text-sky-400'
          }`}
          title={isReposted ? 'Undo Rechirp' : 'Rechirp'}
        >
          <img
            src={APP_ASSETS.RECHIRP_ICON}
            alt="Rechirp"
            className={`w-4 h-4 object-contain transition-all group-hover:scale-115 ${
              isReposted 
                ? 'brightness-125 drop-shadow-[0_0_6px_rgba(56,189,248,0.7)]' 
                : 'opacity-70 group-hover:opacity-100 group-hover:brightness-110'
            }`}
          />
          <span className={`text-xs font-mono transition-colors ${isReposted ? 'text-sky-400 font-bold' : ''}`}>
            {repostsCount}
          </span>
        </button>

        {/* Like */}
        <button
          onClick={handleLikeClick}
          className={`group flex items-center space-x-2 transition-colors py-1 px-2 rounded-full hover:bg-rose-500/10 ${
            isLiked ? 'text-rose-500 font-bold' : 'hover:text-rose-500'
          }`}
        >
          <Heart className={`w-4 h-4 group-hover:scale-110 transition-transform ${isLiked ? 'fill-rose-500' : ''}`} />
          <span className="text-xs font-mono">{likesCount}</span>
        </button>

        {/* Bookmark */}
        <button
          onClick={handleBookmarkClick}
          className={`group flex items-center space-x-1.5 transition-colors py-1 px-2 rounded-full hover:bg-amber-500/10 ${
            isBookmarked ? 'text-amber-400' : 'hover:text-amber-300'
          }`}
          title={t('bookmark')}
        >
          <Bookmark className={`w-4 h-4 group-hover:scale-110 transition-transform ${isBookmarked ? 'fill-amber-400' : ''}`} />
        </button>

        {/* Share */}
        <button
          onClick={handleShareClick}
          className="group p-1.5 rounded-full hover:text-white hover:bg-[#15223C] transition-colors relative"
          title={t('share')}
        >
          <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
          {copiedShare && (
            <span className="absolute -top-7 right-0 bg-sky-400 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap animate-fadeIn">
              Link copied!
            </span>
          )}
        </button>

      </div>

    </article>
  );
};
