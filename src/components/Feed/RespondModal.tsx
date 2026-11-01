import React, { useState } from 'react';
import { X, Send, Sparkles, Briefcase, CheckCircle2 } from 'lucide-react';
import { Post } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface RespondModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitResponse: (postId: string, message: string, skills: string[]) => void;
}

export const RespondModal: React.FC<RespondModalProps> = ({
  post,
  isOpen,
  onClose,
  onSubmitResponse,
}) => {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const [message, setMessage] = useState('');
  const [skillsInput, setSkillsInput] = useState(profile?.skills?.join(', ') || '');
  const [isSent, setIsSent] = useState(false);

  if (!isOpen || !post) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const skills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
    onSubmitResponse(post.id, message, skills);
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setMessage('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#0E1626] text-slate-100 border border-sky-500/40 rounded-2xl shadow-2xl p-5 sm:p-6 overflow-hidden">
        
        <div className="flex items-center justify-between pb-3 border-b border-[#1A2640]">
          <div className="flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-sky-400" />
            <h3 className="font-bold text-white text-base">
              {t('respondTitle')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#15223C] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSent ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-white">Collaboration Sent!</h4>
            <p className="text-xs text-slate-300">
              The opportunity owner (@{post.authorUsername}) has been notified.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs sm:text-sm">
            {/* Target Opportunity Preview */}
            <div className="p-3 bg-[#131E35] rounded-xl border border-[#1C2C4E]">
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                Responding to {post.opportunityCategory || post.postType}
              </span>
              <p className="font-bold text-white text-sm mt-0.5 line-clamp-1">
                {post.opportunityTitle || post.content.slice(0, 60)}
              </p>
              <p className="text-slate-400 text-xs mt-0.5">
                Created by {post.authorName} (@{post.authorUsername})
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Proposal / Message *
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Share how you can contribute, your past experience, or what you hope to achieve together..."
                className="w-full bg-[#0B1120] border border-[#1E2E50] rounded-xl p-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400 text-xs sm:text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Relevant Skills (Comma separated)
              </label>
              <input
                type="text"
                value={skillsInput}
                onChange={e => setSkillsInput(e.target.value)}
                placeholder="e.g. React, Solar Hardware, Agro-economics, UI/UX"
                className="w-full bg-[#0B1120] border border-[#1E2E50] rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400 text-xs"
              />
            </div>

            <div className="pt-2 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-sky-500 text-white hover:brightness-110 shadow-md shadow-sky-500/25 flex items-center space-x-1.5 transition-all"
              >
                <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Send Response</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
