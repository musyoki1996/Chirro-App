import React, { useState } from 'react';
import { 
  Home, 
  Activity, 
  Users2, 
  Layers, 
  Bell, 
  User, 
  PlusCircle, 
  Sparkles,
  Compass,
  LogOut,
  MoreHorizontal,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { APP_ASSETS } from '../../constants/assets';

export type TabType = 'home' | 'pulse' | 'circles' | 'opportunities' | 'notifications' | 'profile';

interface SidebarProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  onOpenCreate: () => void;
  onOpenAdmin?: () => void;
  unreadCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenCreate,
  onOpenAdmin,
  unreadCount = 2,
}) => {
  const { t } = useLanguage();
  const { profile, user, restartOnboarding, signOutUser, isAdmin } = useAuth();
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const navItems = [
    { id: 'home', label: t('navHome'), icon: Home },
    { id: 'pulse', label: t('navPulse'), icon: Activity, badge: 'Hot' },
    { id: 'circles', label: t('navCircles'), icon: Users2 },
    { id: 'opportunities', label: t('navActionHub'), icon: Layers, highlight: true },
    { id: 'notifications', label: t('navNotifications'), icon: Bell, count: unreadCount },
    { id: 'profile', label: t('navProfile'), icon: User },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 p-4 border-r border-[#1A2640] bg-[#0E1626]/80 sticky top-16 h-[calc(100vh-4rem)] justify-between">
      <div className="space-y-2">
        
        {/* Top Chirro Brand Anchor in Sidebar */}
        <div 
          onClick={() => setCurrentTab('home')}
          className="flex items-center space-x-3 px-3 py-2.5 mb-3 rounded-2xl bg-[#111A2E]/60 border border-[#1C2C4E]/70 hover:border-sky-500/40 cursor-pointer transition-all group"
          title="Chirro - World News Network"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-400 via-blue-500 to-amber-400 p-0.5 flex-shrink-0 shadow-md shadow-sky-950/40 group-hover:scale-105 transition-transform">
            <img src={APP_ASSETS.LOGO} alt="Chirro Mascot" className="w-full h-full rounded-[10px] object-cover bg-[#0F172A]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-white text-base tracking-wider group-hover:text-sky-300 transition-colors">
                CHIRRO
              </span>
              <span className="text-[9px] px-1 py-0.5 rounded-full font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30 font-mono">
                WNN
              </span>
            </div>
            <p className="text-[10px] text-sky-400 font-medium tracking-tight truncate">
              World News Network
            </p>
          </div>
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id as TabType)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-[15px] font-semibold transition-all ${
                isActive
                  ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 font-bold shadow-sm shadow-sky-500/10'
                  : 'text-slate-300 hover:text-white hover:bg-[#131E35]'
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <Icon className={`w-5 h-5 ${isActive ? 'text-sky-400 stroke-[2.5]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.count ? (
                <span className="w-5 h-5 rounded-full bg-sky-400 text-slate-950 text-[11px] font-bold flex items-center justify-center">
                  {item.count}
                </span>
              ) : item.badge ? (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30 font-mono">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}

        {/* Twitter/Chirp Large Primary Action Button */}
        <div className="pt-3">
          <button
            type="button"
            onClick={onOpenCreate}
            className="w-full py-3.5 px-5 rounded-full font-extrabold text-sm bg-gradient-to-r from-sky-400 via-blue-500 to-sky-500 text-white hover:brightness-110 shadow-lg shadow-sky-500/25 flex items-center justify-center space-x-2 transition-all active:scale-[0.99] tracking-wide"
          >
            <img src={APP_ASSETS.CHIRP_ICON} alt="" className="w-4 h-4 object-contain brightness-110" />
            <span>Chirp</span>
          </button>
        </div>
      </div>

      {/* Twitter-style Bottom User Profile Card */}
      <div className="relative pt-4 border-t border-[#1A2640]">
        {profile ? (
          <div>
            <button
              type="button"
              onClick={() => setShowAccountMenu(!showAccountMenu)}
              className="w-full flex items-center justify-between p-2 rounded-2xl hover:bg-[#131E35] transition-colors text-left"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <img
                  src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={profile.displayName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-sky-400/30 flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">
                    {profile.displayName}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    @{profile.username}
                  </p>
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-slate-500 flex-shrink-0" />
            </button>

            {showAccountMenu && (
              <div className="absolute bottom-16 left-0 right-0 bg-[#0E1626] border border-[#1E2E50] rounded-2xl shadow-2xl p-2 z-50 text-xs space-y-1 animate-fadeIn">
                <button
                  onClick={() => {
                    setShowAccountMenu(false);
                    restartOnboarding();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-sky-300 hover:bg-[#15233E] flex items-center space-x-2 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  <span>Replay Onboarding Guide</span>
                </button>

                {isAdmin && onOpenAdmin && (
                  <button
                    onClick={() => {
                      setShowAccountMenu(false);
                      onOpenAdmin();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-amber-300 hover:bg-[#15233E] flex items-center space-x-2 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Admin Moderation Console</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setShowAccountMenu(false);
                    signOutUser();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-950/30 flex items-center space-x-2 transition-colors border-t border-[#1A2640] mt-1 pt-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t('signOut')}</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-3 bg-[#111A2E] rounded-2xl border border-[#1C2C4E] text-xs space-y-2">
            <p className="font-bold text-white">Join Chirro World News</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Connect with correspondents and follow global breaking stories.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
