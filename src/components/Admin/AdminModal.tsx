import React, { useState } from 'react';
import { ShieldCheck, X, AlertTriangle, CheckCircle, Database, Users, Flag, Activity } from 'lucide-react';
import { ReportItem } from '../../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: ReportItem[];
  totalPostsCount: number;
  totalCirclesCount: number;
  onResolveReport: (reportId: string, action: 'dismissed' | 'actioned') => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  reports,
  totalPostsCount,
  totalCirclesCount,
  onResolveReport,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-[#0E1626] text-slate-100 border border-sky-500/40 rounded-2xl shadow-2xl p-5 sm:p-6 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1A2640]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/50 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Chirro Administrative Console</h3>
              <p className="text-xs text-slate-400">Authenticated Admin: mutisya104@gmail.com</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* System Health Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          <div className="p-3 rounded-xl bg-[#111A2E] border border-[#1C2C4E]">
            <p className="text-[11px] text-slate-400 font-semibold">Active Posts</p>
            <p className="text-xl font-bold text-slate-100 mt-1">{totalPostsCount}</p>
          </div>
          <div className="p-3 rounded-xl bg-[#111A2E] border border-[#1C2C4E]">
            <p className="text-[11px] text-slate-400 font-semibold">Circles Active</p>
            <p className="text-xl font-bold text-sky-400 mt-1">{totalCirclesCount}</p>
          </div>
          <div className="p-3 rounded-xl bg-[#111A2E] border border-[#1C2C4E]">
            <p className="text-[11px] text-slate-400 font-semibold">Open Reports</p>
            <p className="text-xl font-bold text-rose-400 mt-1">
              {reports.filter(r => r.status === 'pending').length}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#111A2E] border border-[#1C2C4E]">
            <p className="text-[11px] text-slate-400 font-semibold">Database Status</p>
            <p className="text-xs font-bold text-emerald-400 mt-2 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Firestore Healthy</span>
            </p>
          </div>
        </div>

        {/* Reports Queue */}
        <div className="flex-1 overflow-y-auto space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
            <Flag className="w-3.5 h-3.5 text-rose-400" />
            <span>Moderation Queue</span>
          </h4>

          {reports.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs bg-[#111A2E]/50 rounded-xl border border-dashed border-[#1C2C4E]">
              No pending reports in queue. The community is safe and respectful!
            </div>
          ) : (
            reports.map(report => (
              <div
                key={report.id}
                className="p-3.5 rounded-xl bg-[#111A2E] border border-[#1C2C4E] space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-400 uppercase tracking-wider text-[10px]">
                    Reason: {report.reason}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Target: {report.targetType} #{report.targetId.slice(0, 8)}
                  </span>
                </div>
                {report.details && (
                  <p className="text-slate-300 italic bg-[#0B1120] p-2 rounded-lg">
                    "{report.details}"
                  </p>
                )}
                <div className="flex items-center justify-between pt-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    report.status === 'pending'
                      ? 'bg-amber-950/80 text-amber-300 border border-amber-600/40'
                      : report.status === 'actioned'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    Status: {report.status}
                  </span>

                  {report.status === 'pending' && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onResolveReport(report.id, 'dismissed')}
                        className="px-2.5 py-1 rounded bg-[#1A2640] hover:bg-[#25365A] text-slate-300 font-semibold transition-colors"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => onResolveReport(report.id, 'actioned')}
                        className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-colors"
                      >
                        Take Down / Action
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
