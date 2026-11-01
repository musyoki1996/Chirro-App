import React, { useState } from 'react';
import { X, Flag, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Post } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface ReportModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (targetId: string, reason: string, details: string) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  post,
  isOpen,
  onClose,
  onSubmitReport,
}) => {
  const [reason, setReason] = useState('spam');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !post) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport(post.id, reason, details);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDetails('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#0E1626] text-slate-100 border border-rose-500/30 rounded-2xl shadow-2xl p-5 overflow-hidden">
        
        <div className="flex items-center justify-between pb-3 border-b border-[#1A2640]">
          <div className="flex items-center space-x-2 text-rose-400">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-bold text-slate-100 text-base">Report Content</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="font-bold text-white text-base">Report Submitted</h4>
            <p className="text-xs text-slate-300">
              Our community moderation team has received the report and will review it against platform guidelines.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Reason for reporting
              </label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full bg-[#0B1120] border border-[#1E2E50] rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-rose-400 text-xs sm:text-sm"
              >
                <option value="spam">Unsolicited spam or commercial scam</option>
                <option value="harassment">Harassment, hate speech, or abuse</option>
                <option value="misinformation">Harmful or deceptive misinformation</option>
                <option value="impersonation">Identity theft or impersonation</option>
                <option value="other">Other policy violation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Additional context (Optional)
              </label>
              <textarea
                rows={3}
                value={details}
                onChange={e => setDetails(e.target.value)}
                placeholder="Help moderators understand what rule was broken..."
                className="w-full bg-[#0B1120] border border-[#1E2E50] rounded-xl p-3 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-rose-400 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
