import React, { useState } from 'react';
import { 
  Layers, 
  Briefcase, 
  Calendar, 
  HeartHandshake, 
  Filter, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Plus, 
  MapPin, 
  Search 
} from 'lucide-react';
import { OpportunityStatus, Post, PostType } from '../../types';
import { PostCard } from '../Feed/PostCard';
import { useLanguage } from '../../context/LanguageContext';

interface OpportunitiesViewProps {
  posts: Post[];
  onOpenCreate: () => void;
  onLike: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onOpenReply: (post: Post) => void;
  onOpenRespond: (post: Post) => void;
  onOpenReport: (post: Post) => void;
}

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({
  posts,
  onOpenCreate,
  onLike,
  onBookmark,
  onOpenReply,
  onOpenRespond,
  onOpenReport,
}) => {
  const { t } = useLanguage();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const actionPosts = posts.filter(
    p =>
      p.postType === 'project' ||
      p.postType === 'opportunity' ||
      p.postType === 'event' ||
      p.postType === 'community_request'
  );

  const filteredPosts = actionPosts.filter(p => {
    if (selectedType !== 'all' && p.postType !== selectedType) return false;
    if (selectedStatus !== 'all' && p.opportunityStatus !== selectedStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Action Hub Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0B1120] via-[#111E38] to-[#0B1120] border border-sky-500/30 shadow-xl flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-sky-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>The Action Layer</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-50 tracking-tight">
            Collaboration & Opportunity Hub
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-0.5 max-w-lg leading-relaxed">
            Where ideas transform into real-world initiatives. Discover open-source projects, gigs, co-founders, and civic events.
          </p>
        </div>

        <button
          onClick={onOpenCreate}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-sky-500 text-white hover:brightness-110 shadow-lg shadow-sky-900/30 flex items-center space-x-1.5 flex-shrink-0 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span className="hidden sm:inline">Post Opportunity</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Type tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto text-xs pb-1">
          {[
            { id: 'all', label: 'All Opportunities' },
            { id: 'project', label: 'Projects' },
            { id: 'opportunity', label: 'Paid Gigs & Roles' },
            { id: 'event', label: 'Events & Meetups' },
            { id: 'community_request', label: 'Community Requests' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-semibold transition-all ${
                selectedType === tab.id
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                  : 'bg-[#111A2E] text-slate-400 hover:text-white border border-[#1C2C4E]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-1.5 text-xs">
          <span className="text-slate-400 text-[11px] font-semibold">Status:</span>
          {['all', 'open', 'in_progress', 'completed'].map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-2 py-1 rounded-lg text-[11px] font-medium capitalize transition-colors ${
                selectedStatus === status
                  ? 'bg-[#131E35] text-sky-400 font-bold border border-sky-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {status === 'all' ? 'All' : status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#111A2E]/50 border border-dashed border-[#1C2C4E] space-y-2">
            <Layers className="w-10 h-10 text-slate-500 mx-auto" />
            <h4 className="font-bold text-slate-100 text-base">No active items in this category</h4>
            <p className="text-slate-400 text-xs max-w-sm mx-auto">
              Be the first to post a collaboration request, event, or team opening to the network!
            </p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onLike={onLike}
              onBookmark={onBookmark}
              onOpenReply={onOpenReply}
              onOpenRespond={onOpenRespond}
              onOpenReport={onOpenReport}
            />
          ))
        )}
      </div>

    </div>
  );
};
