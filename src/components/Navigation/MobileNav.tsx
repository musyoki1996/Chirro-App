import React from 'react';
import { Home, Activity, Plus, Users2, Layers, User } from 'lucide-react';
import { TabType } from './Sidebar';
import { useLanguage } from '../../context/LanguageContext';
import { APP_ASSETS } from '../../constants/assets';

interface MobileNavProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  onOpenCreate: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, setCurrentTab, onOpenCreate }) => {
  const { t } = useLanguage();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B1120]/95 backdrop-blur-md border-t border-[#1A2640] px-3 py-1.5 flex items-center justify-around shadow-2xl">
      <button
        onClick={() => setCurrentTab('home')}
        className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
          currentTab === 'home' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span>{t('navHome')}</span>
      </button>

      <button
        onClick={() => setCurrentTab('pulse')}
        className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
          currentTab === 'pulse' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Activity className="w-5 h-5 mb-0.5" />
        <span>{t('navPulse')}</span>
      </button>

      {/* Center Chirp Action Button */}
      <button
        onClick={onOpenCreate}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-sky-400 via-blue-500 to-amber-400 text-white font-bold shadow-lg shadow-sky-500/40 -mt-5 ring-4 ring-[#0B1120] active:scale-95 transition-transform"
        aria-label="Chirp"
        title="Chirp"
      >
        <img src={APP_ASSETS.CHIRP_ICON} alt="Chirp" className="w-5 h-5 object-contain brightness-110" />
      </button>

      <button
        onClick={() => setCurrentTab('opportunities')}
        className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
          currentTab === 'opportunities' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Layers className="w-5 h-5 mb-0.5" />
        <span>Action</span>
      </button>

      <button
        onClick={() => setCurrentTab('circles')}
        className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
          currentTab === 'circles' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Users2 className="w-5 h-5 mb-0.5" />
        <span>{t('navCircles')}</span>
      </button>

      <button
        onClick={() => setCurrentTab('profile')}
        className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
          currentTab === 'profile' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <User className="w-5 h-5 mb-0.5" />
        <span>{t('navProfile')}</span>
      </button>
    </nav>
  );
};
