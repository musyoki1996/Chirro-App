import React, { useState } from 'react';
import { X, Send, MessageSquare, Sparkles, User } from 'lucide-react';
import { Post, Reply } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface PostDetailModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  replies: Reply[];
  onAddReply: (postId: string, content: string) => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post,
  isOpen,
  onClose,
  replies,
  onAddReply,
}) => {
  const { profile, user } = useAuth();
  const { t } = useLanguage();
  const [newReply, setNewReply] = useState('');

  if (!isOpen || !post) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReply.trim()) return;
    onAddReply(post.id, newReply.trim());
    setNewReply('');
  };

  const filteredReplies = replies.filter(r => r.postId === post.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-[#0E1626] text-slate-100 border border-[#1E2E50] rounded-2xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-[#1A2640] flex items-center justify-between bg-[#111A2E]">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-sky-400" />
            <h3 className="font-bold text-white text-sm sm:text-base">
              Thread Discussion
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#15223C] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Thread Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Main Post Summary */}
          <div className="p-4 rounded-xl bg-[#131E35] border border-[#1C2C4E] space-y-2">
            <div className="flex items-center space-x-2.5">
              <img
                src={post.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={post.authorName}
                className="w-9 h-9 rounded-full object-cover ring-1 ring-sky-400/30"
              />
              <div>
                <p className="font-bold text-white text-sm">{post.authorName}</p>
                <p className="text-xs text-slate-400">@{post.authorUsername}</p>
              </div>
            </div>
            {post.opportunityTitle && (
              <p className="font-bold text-sky-300 text-sm">{post.opportunityTitle}</p>
            )}
            <p className="text-slate-200 text-sm leading-relaxed">{post.content}</p>
          </div>

          {/* Replies Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Community Responses ({filteredReplies.length})
            </h4>

            {filteredReplies.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs bg-[#131E35]/50 rounded-xl border border-dashed border-[#1C2C4E]">
                No replies yet. Be the first to share an insight or offer to collaborate!
              </div>
            ) : (
              filteredReplies.map(reply => (
                <div key={reply.id} className="p-3.5 rounded-xl bg-[#131E35] border border-[#1C2C4E] space-y-1.5 text-xs sm:text-sm">
                  <div className="flex items-center space-x-2">
                    <img
                      src={reply.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={reply.authorName}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-sky-400/20"
                    />
                    <span className="font-bold text-white text-xs">{reply.authorName}</span>
                    <span className="text-[11px] text-slate-400">@{reply.authorUsername}</span>
                    <span className="text-slate-600 text-[10px]">·</span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-200 pl-9 text-xs sm:text-sm leading-relaxed">
                    {reply.content}
                  </p>
                </div>
              ))
            )}
          </div>

        </div>

        {/* Compose Reply Bar */}
        <form onSubmit={handleSubmit} className="p-3.5 border-t border-[#1A2640] bg-[#111A2E] flex items-center space-x-2">
          <input
            type="text"
            required
            value={newReply}
            onChange={e => setNewReply(e.target.value)}
            placeholder="Reply with thoughtful advice or questions..."
            className="flex-1 bg-[#0B1120] border border-[#1E2E50] rounded-xl px-3.5 py-2.5 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-sky-400"
          />
          <button
            type="submit"
            disabled={!newReply.trim()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 via-blue-500 to-sky-500 text-white font-bold hover:brightness-110 shadow-sm shadow-sky-500/20 disabled:opacity-40 transition-all flex items-center space-x-1"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>

      </div>
    </div>
  );
};
