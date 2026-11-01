import React, { useState } from 'react';
import { 
  Users2, 
  Plus, 
  Search, 
  Lock, 
  Globe2, 
  Check, 
  Sparkles, 
  BookOpen, 
  X,
  Shield,
  Layers
} from 'lucide-react';
import { Circle, Post } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { PostCard } from '../Feed/PostCard';

interface CirclesViewProps {
  circles: Circle[];
  posts: Post[];
  onJoinCircle: (circleId: string) => void;
  onCreateCircle: (circleData: Partial<Circle>) => void;
  onLike: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onOpenReply: (post: Post) => void;
  onOpenRespond: (post: Post) => void;
  onOpenReport: (post: Post) => void;
}

export const CirclesView: React.FC<CirclesViewProps> = ({
  circles,
  posts,
  onJoinCircle,
  onCreateCircle,
  onLike,
  onBookmark,
  onOpenReply,
  onOpenRespond,
  onOpenReport,
}) => {
  const { profile } = useAuth();
  const { t } = useLanguage();

  const [activeCircleId, setActiveCircleId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [joinedSet, setJoinedSet] = useState<Set<string>>(new Set(['circle-silicon-savannah']));

  const [newCircleName, setNewCircleName] = useState('');
  const [newCircleDesc, setNewCircleDesc] = useState('');
  const [newCircleCategory, setNewCircleCategory] = useState('tech');
  const [newCircleRules, setNewCircleRules] = useState('1. Respect and uplift all African innovators\n2. Share practical knowledge\n3. No unsolicited sales');

  const toggleJoin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(joinedSet);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setJoinedSet(next);
    onJoinCircle(id);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCircleName.trim()) return;

    onCreateCircle({
      name: newCircleName.trim(),
      slug: newCircleName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      description: newCircleDesc.trim(),
      category: newCircleCategory,
      isPrivate: false,
      memberCount: 1,
      iconUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
      rules: newCircleRules.split('\n').filter(Boolean),
    });

    setNewCircleName('');
    setNewCircleDesc('');
    setIsCreateModalOpen(false);
  };

  const activeCircle = circles.find(c => c.id === activeCircleId);
  const circlePosts = posts.filter(p => p.circleId === activeCircleId);

  const filteredCircles = circles.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0B1120] via-[#111E38] to-[#0B1120] border border-sky-500/30 shadow-xl flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-sky-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Users2 className="w-4 h-4" />
            <span>Community Circles</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-50 tracking-tight">
            Explore & Join Circles
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-0.5 max-w-lg leading-relaxed">
            Purpose-driven hubs uniting professionals, researchers, creatives, and local chapters across the continent.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-sky-500 text-white hover:brightness-110 shadow-lg shadow-sky-900/30 flex items-center space-x-1.5 flex-shrink-0 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">Start a Circle</span>
        </button>
      </div>

      {/* Circle Detail View if Selected */}
      {activeCircle ? (
        <div className="space-y-5 animate-fadeIn">
          {/* Active Circle Header */}
          <div className="p-5 rounded-2xl bg-[#111A2E] border border-[#1C2C4E] space-y-4 shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center space-x-4">
                <img
                  src={activeCircle.iconUrl}
                  alt={activeCircle.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-sky-500/40 shadow-md"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-100">{activeCircle.name}</h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl">{activeCircle.description}</p>
                  <div className="flex items-center space-x-3 text-xs text-slate-400 mt-2">
                    <span className="font-semibold text-sky-400">
                      {activeCircle.memberCount.toLocaleString()} members
                    </span>
                    <span>·</span>
                    <span className="capitalize">{activeCircle.category} Hub</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={e => toggleJoin(activeCircle.id, e)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    joinedSet.has(activeCircle.id)
                      ? 'bg-sky-500/15 text-sky-300 border border-sky-500/40'
                      : 'bg-gradient-to-r from-sky-400 via-blue-500 to-sky-500 text-white font-bold hover:brightness-110 shadow-md shadow-sky-900/30'
                  }`}
                >
                  {joinedSet.has(activeCircle.id) ? 'Joined' : '+ Join Circle'}
                </button>
                <button
                  onClick={() => setActiveCircleId(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#1A2640] text-xs font-semibold"
                >
                  Back to Directory
                </button>
              </div>
            </div>

            {/* Circle Rules */}
            {activeCircle.rules && (
              <div className="p-3 bg-[#0E1626] rounded-xl border border-[#1E2E50] text-xs space-y-1">
                <p className="font-bold text-slate-200 flex items-center space-x-1.5">
                  <Shield className="w-3.5 h-3.5 text-sky-400" />
                  <span>Circle Rules & Norms</span>
                </p>
                <ul className="list-disc list-inside text-slate-400 space-y-0.5 text-[11px]">
                  {activeCircle.rules.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Posts in Circle */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Discussions & Opportunities in {activeCircle.name}
            </h4>

            {circlePosts.length === 0 ? (
              <div className="p-10 text-center rounded-2xl bg-[#111A2E]/50 border border-dashed border-[#1C2C4E] text-xs text-slate-400">
                No posts in this circle yet. Use the Create button to share the first topic!
              </div>
            ) : (
              circlePosts.map(post => (
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
      ) : (
        /* Circles Directory Grid */
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search circles by name, skill, or theme..."
                className="w-full bg-[#111A2E] border border-[#1C2C4E] rounded-xl pl-9 pr-3.5 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-400 text-xs sm:text-sm"
              />
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {filteredCircles.length} active communities
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCircles.map(circle => {
              const isJoined = joinedSet.has(circle.id);
              return (
                <div
                  key={circle.id}
                  onClick={() => setActiveCircleId(circle.id)}
                  className="p-4 sm:p-5 rounded-2xl bg-[#111A2E] hover:bg-[#142038] border border-[#1C2C4E] hover:border-sky-500/40 transition-all cursor-pointer flex flex-col justify-between space-y-4 shadow-md group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={circle.iconUrl}
                          alt={circle.name}
                          className="w-12 h-12 rounded-xl object-cover border border-[#1C2C4E] group-hover:scale-105 transition-transform"
                        />
                        <div>
                          <h4 className="font-bold text-slate-100 text-sm sm:text-base group-hover:text-sky-300 transition-colors">
                            {circle.name}
                          </h4>
                          <span className="text-[11px] font-mono text-sky-400">
                            {circle.memberCount.toLocaleString()} members
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={e => toggleJoin(circle.id, e)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isJoined
                            ? 'bg-sky-500/15 text-sky-300 border border-sky-500/40'
                            : 'bg-gradient-to-r from-sky-400 via-blue-500 to-sky-500 text-white font-bold hover:brightness-110 shadow-md shadow-sky-900/30'
                        }`}
                      >
                        {isJoined ? 'Joined' : '+ Join'}
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {circle.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-[#1A2640]">
                    <span className="uppercase font-bold tracking-wider text-sky-400">
                      {circle.category}
                    </span>
                    <span className="text-sky-400 group-hover:underline">
                      View discussions →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create Circle Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#0E1626] text-slate-100 border border-[#1E2E50] rounded-2xl shadow-2xl p-5 sm:p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A2640]">
              <h3 className="font-bold text-slate-100 text-base">Launch a New Circle</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Circle Name *</label>
                <input
                  type="text"
                  required
                  value={newCircleName}
                  onChange={e => setNewCircleName(e.target.value)}
                  placeholder="e.g. East Africa Drone Agronomy Network"
                  className="w-full bg-[#0B1120] border border-[#1E2E50] rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-400 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={newCircleCategory}
                  onChange={e => setNewCircleCategory(e.target.value)}
                  className="w-full bg-[#0B1120] border border-[#1E2E50] rounded-xl px-3 py-2 text-slate-100 text-xs"
                >
                  <option value="tech">Technology & AI</option>
                  <option value="agritech">AgTech & Food Security</option>
                  <option value="entrepreneurship">Startups & Ventures</option>
                  <option value="creative">Arts & Design</option>
                  <option value="energy">Clean Tech & Solar</option>
                  <option value="civic">Local Community & Civic</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={newCircleDesc}
                  onChange={e => setNewCircleDesc(e.target.value)}
                  placeholder="What is this community working toward? Who should join?"
                  className="w-full bg-[#0B1120] border border-[#1E2E50] rounded-xl p-3 text-slate-100 text-xs sm:text-sm resize-none focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Community Norms / Rules</label>
                <textarea
                  rows={2}
                  value={newCircleRules}
                  onChange={e => setNewCircleRules(e.target.value)}
                  className="w-full bg-[#0B1120] border border-[#1E2E50] rounded-xl p-3 text-slate-100 text-xs resize-none focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-sky-500 text-white shadow-md hover:brightness-110 transition-all"
                >
                  Create Circle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
