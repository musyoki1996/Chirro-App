import React, { useState } from 'react';
import { Search, X, Users, Layers, MessageSquare, ArrowRight, MapPin } from 'lucide-react';
import { Circle, Post } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: Post[];
  circles: Circle[];
  onSelectPost: (post: Post) => void;
  onSelectCircle?: (circle: Circle) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  posts,
  circles,
  onSelectPost,
  onSelectCircle,
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'posts' | 'opportunities' | 'circles'>('all');

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchedPosts = posts.filter(p =>
    q
      ? p.content.toLowerCase().includes(q) ||
        p.opportunityTitle?.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q)) ||
        p.authorName.toLowerCase().includes(q)
      : false
  );

  const matchedCircles = circles.filter(c =>
    q
      ? c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      : false
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-[#0E1626] text-slate-100 border border-[#1E2E50] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#1A2640] flex items-center space-x-3 bg-[#111A2E]">
          <Search className="w-5 h-5 text-sky-400 flex-shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search African conversations, circles, skills, or projects..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-sm sm:text-base"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#15223C]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 bg-[#0B1120] border-b border-[#1A2640] flex items-center space-x-2 text-xs">
          {[
            { id: 'all', label: 'All Results' },
            { id: 'posts', label: 'Discussions' },
            { id: 'opportunities', label: 'Opportunities' },
            { id: 'circles', label: 'Circles' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id as any)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterType === f.id
                  ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {!q ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              Type keywords such as <span className="text-sky-400">"Solar"</span>, <span className="text-sky-400">"Nairobi"</span>, <span className="text-sky-400">"Agronomy"</span>, or <span className="text-sky-400">"UI/UX"</span>.
            </div>
          ) : matchedPosts.length === 0 && matchedCircles.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No matching results found for "{query}".
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Circles Results */}
              {(filterType === 'all' || filterType === 'circles') && matchedCircles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
                    Circles ({matchedCircles.length})
                  </h4>
                  {matchedCircles.map(c => (
                    <div
                      key={c.id}
                      onClick={() => {
                        if (onSelectCircle) onSelectCircle(c);
                        onClose();
                      }}
                      className="p-3 rounded-xl bg-[#131E35] hover:bg-[#182644] border border-[#1C2C4E] hover:border-sky-500/40 transition-all flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <img src={c.iconUrl} className="w-9 h-9 rounded-lg object-cover border border-[#1C2C4E]" />
                        <div>
                          <p className="font-bold text-white text-xs sm:text-sm">{c.name}</p>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{c.description}</p>
                        </div>
                      </div>
                      <span className="text-xs text-sky-400 font-bold">View →</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Posts / Opportunities Results */}
              {(filterType === 'all' || filterType === 'posts' || filterType === 'opportunities') && matchedPosts.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
                    Posts & Actions ({matchedPosts.length})
                  </h4>
                  {matchedPosts.map(p => (
                    <div
                      key={p.id}
                      onClick={() => {
                        onSelectPost(p);
                        onClose();
                      }}
                      className="p-3.5 rounded-xl bg-[#131E35] hover:bg-[#182644] border border-[#1C2C4E] hover:border-sky-500/40 transition-all cursor-pointer space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{p.authorName}</span>
                        <span className="text-[10px] uppercase font-bold text-sky-400 font-mono">
                          {p.postType}
                        </span>
                      </div>
                      {p.opportunityTitle && (
                        <p className="font-bold text-sky-300 text-xs sm:text-sm">{p.opportunityTitle}</p>
                      )}
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {p.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
