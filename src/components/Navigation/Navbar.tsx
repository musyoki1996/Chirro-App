import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Globe, 
  Moon, 
  Sun, 
  LogIn, 
  LogOut, 
  User, 
  Compass, 
  Layers, 
  ShieldCheck, 
  RotateCcw,
  ChevronDown,
  Menu,
  X,
  Home,
  Activity,
  Users2,
  Bell,
  PlusCircle,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { DEMO_PROFILES } from '../../data/seedData';
import { TabType } from './Sidebar';
import { APP_ASSETS } from '../../constants/assets';

interface NavbarProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  onOpenSearch: () => void;
  onOpenCreate: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentTab,
  setCurrentTab,
  onOpenSearch, 
  onOpenCreate, 
  onOpenAdmin 
}) => {
  const { user, profile, signInWithGoogle, signInDemo, signOutUser, restartOnboarding, isAdmin } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isDemoMenuOpen, setIsDemoMenuOpen] = useState(false);

  const handleNavigate = (tab: TabType) => {
    setCurrentTab(tab);
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  const navMenuItems = [
    { id: 'home', label: t('navHome'), icon: Home, desc: 'Latest updates & community posts' },
    { id: 'pulse', label: t('navPulse'), icon: Activity, desc: 'Trending radar across Africa', badge: 'Hot' },
    { id: 'circles', label: t('navCircles'), icon: Users2, desc: 'Communities & special interest hubs' },
    { id: 'opportunities', label: t('navActionHub'), icon: Layers, desc: 'Projects, gigs, requests & collaborations', highlight: true },
    { id: 'notifications', label: t('navNotifications'), icon: Bell, desc: 'Responses & community mentions' },
    { id: 'profile', label: t('navProfile'), icon: User, desc: 'Your posts, projects & credentials' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#1A2640] bg-[#0B1120]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Menu Icon + Brand Logo (Never hidden on any screen) */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 min-w-0">
            
            {/* Top Menu Icon Button */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="p-2 -ml-1 text-slate-300 hover:text-sky-400 rounded-xl hover:bg-[#131D33] active:scale-95 transition-all flex items-center justify-center border border-transparent hover:border-[#1E2E50] flex-shrink-0"
              aria-label="Open Navigation Menu"
              title="Menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </button>

            {/* Brand Wordmark & Abstract Network Symbol - Always visible and perfectly aligned */}
            <div 
              onClick={() => handleNavigate('home')} 
              className="relative group cursor-pointer flex items-center space-x-2.5 sm:space-x-3 select-none flex-shrink-0"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-sky-400 via-blue-500 to-amber-400 p-0.5 shadow-md shadow-sky-950/40 group-hover:scale-105 transition-transform flex-shrink-0">
                <img
                  src={APP_ASSETS.LOGO}
                  alt="Chirro Mascot Logo"
                  className="w-full h-full rounded-[14px] object-cover bg-[#0F172A]"
                />
              </div>
              <div className="flex flex-col flex-shrink-0 justify-center">
                <div className="flex items-center space-x-1.5 leading-none">
                  <span className="text-lg sm:text-xl font-black tracking-wider text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-sky-100 to-sky-300">
                    CHIRRO
                  </span>
                  <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30 font-mono tracking-wide whitespace-nowrap">
                    WNN
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-sky-400 font-semibold tracking-tight whitespace-nowrap mt-0.5">
                  World News Network
                </p>
              </div>
            </div>

          </div>

          {/* Center: Search Bar (Facebook/Twitter style) */}
          <div className="flex-1 max-w-md hidden md:block">
            <button
              type="button"
              onClick={onOpenSearch}
              className="w-full flex items-center justify-between bg-[#111A2E] border border-[#1C2C4E] hover:border-sky-500/50 text-slate-400 hover:text-slate-200 px-3.5 py-2 rounded-xl text-xs sm:text-sm transition-all shadow-inner"
            >
              <div className="flex items-center space-x-2.5">
                <Search className="w-4 h-4 text-sky-400" />
                <span>{t('navSearch')}</span>
              </div>
              <kbd className="hidden lg:inline-block px-2 py-0.5 text-[10px] font-mono bg-[#16223C] text-slate-400 rounded border border-[#223356]">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Controls: Search (mobile), Language, Theme, & Profile Icon */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            
            {/* Mobile search icon */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="md:hidden p-2 text-slate-300 hover:text-sky-400 rounded-xl hover:bg-[#131D33] transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Language Switcher */}
            <div className="hidden xs:flex items-center bg-[#111A2E] border border-[#1C2C4E] rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  language === 'en'
                    ? 'bg-sky-500/20 text-sky-300 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('sw')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  language === 'sw'
                    ? 'bg-sky-500/20 text-sky-300 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                SW
              </button>
            </div>

            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-400 hover:text-sky-300 rounded-xl hover:bg-[#131D33] transition-colors"
              title="Toggle Dark/Light"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
            </button>

            {/* TOP PROFILE ICON (Always visible on mobile & desktop) */}
            <div className="relative pl-1">
              {profile ? (
                /* Authenticated User Profile Button */
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className={`flex items-center space-x-1.5 p-1 rounded-full transition-all border ${
                    currentTab === 'profile' || isProfileMenuOpen
                      ? 'border-sky-400 bg-[#131E35] ring-2 ring-sky-400/30'
                      : 'border-[#1C2C4E] hover:border-sky-400/50 hover:bg-[#131E35]'
                  }`}
                  aria-label="User Profile and Account Menu"
                  title={`${profile.displayName} (@${profile.username})`}
                >
                  <div className="relative">
                    <img
                      src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={profile.displayName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#0B1120]" />
                  </div>
                  <ChevronDown className="hidden sm:inline-block w-3.5 h-3.5 text-slate-400" />
                </button>
              ) : (
                /* Guest / Sign-in Profile Icon Button */
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                    isProfileMenuOpen
                      ? 'bg-sky-500/20 text-sky-300 border-sky-400/50'
                      : 'bg-[#111A2E] text-slate-300 border-[#1C2C4E] hover:border-sky-400/40 hover:text-white'
                  }`}
                  aria-label="Profile and Sign-in options"
                  title="Profile & Sign In"
                >
                  <div className="w-6 h-6 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span className="hidden sm:inline">{t('navProfile')}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
              )}

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#0E1626] border border-[#1E2E50] rounded-2xl shadow-2xl p-2.5 z-50 text-xs text-slate-200 animate-fadeIn">
                  {profile ? (
                    <>
                      {/* User Info Header */}
                      <div className="px-3 py-2 border-b border-[#1A2640] mb-1.5">
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={profile.avatarUrl}
                            alt={profile.displayName}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-sky-400/40"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-white text-sm truncate">{profile.displayName}</p>
                            <p className="text-sky-400 truncate">@{profile.username}</p>
                            <p className="text-[10px] text-slate-400 truncate">{profile.city}, {profile.country}</p>
                          </div>
                        </div>
                      </div>

                      {/* Direct "View My Profile" Action */}
                      <button
                        onClick={() => handleNavigate('profile')}
                        className="w-full text-left px-3 py-2.5 rounded-xl text-sky-200 hover:bg-[#15233E] font-semibold flex items-center justify-between transition-colors mb-1 bg-[#101A2E] border border-sky-900/40"
                      >
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-sky-400" />
                          <span>View My Profile</span>
                        </div>
                        <span className="text-[10px] font-mono text-sky-400/80">→</span>
                      </button>

                      {/* Onboarding replay */}
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          restartOnboarding();
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-sky-300 hover:bg-[#15233E] flex items-center space-x-2 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                        <span>Replay Onboarding Guide</span>
                      </button>

                      {/* Admin console */}
                      {isAdmin && (
                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            onOpenAdmin();
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-amber-300 hover:bg-[#15233E] flex items-center space-x-2 transition-colors"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                          <span>Admin & Moderation Hub</span>
                        </button>
                      )}

                      {/* Switch Persona option */}
                      <div className="pt-1.5 border-t border-[#1A2640] my-1">
                        <p className="px-3 py-1 text-[10px] uppercase tracking-wider font-bold text-slate-500">
                          Switch Builder Profile
                        </p>
                        {DEMO_PROFILES.map((p, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setIsProfileMenuOpen(false);
                              signInDemo(p);
                            }}
                            className="w-full text-left px-3 py-1.5 rounded-lg text-slate-300 hover:bg-[#15233E] flex items-center space-x-2 text-[11px]"
                          >
                            <img src={p.avatarUrl} className="w-5 h-5 rounded-full object-cover" />
                            <span className="truncate">{p.displayName}</span>
                          </button>
                        ))}
                      </div>

                      {/* Sign Out */}
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          signOutUser();
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-950/30 flex items-center space-x-2 transition-colors border-t border-[#1A2640] mt-1"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{t('signOut')}</span>
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Guest Sign-in Options */}
                      <div className="p-2 space-y-2">
                        <p className="font-bold text-white text-sm">Join Chirro World News Network</p>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                          Sign in to follow breaking dispatches, discover world news, join circles, and collaborate on global projects.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            signInWithGoogle();
                          }}
                          className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-sky-500 text-white hover:brightness-105 shadow-md flex items-center justify-center space-x-2 transition-all"
                        >
                          <LogIn className="w-4 h-4 stroke-[2.5]" />
                          <span>{t('signIn')} with Google</span>
                        </button>
                        
                        <div className="pt-2 border-t border-[#1A2640]">
                          <p className="text-[10px] uppercase font-bold text-slate-500 mb-1.5">
                            Or Explore As Verified Correspondent:
                          </p>
                          <div className="space-y-1">
                            <button
                              onClick={() => {
                                setIsProfileMenuOpen(false);
                                signInDemo(DEMO_PROFILES[0]);
                              }}
                              className="w-full text-left p-2 rounded-lg bg-[#111A2E] hover:bg-[#172545] text-slate-200 flex items-center space-x-2 border border-[#1C2C4E]"
                            >
                              <img src={DEMO_PROFILES[0].avatarUrl} className="w-6 h-6 rounded-full object-cover" />
                              <div className="min-w-0">
                                <p className="font-bold text-[11px] text-sky-200 truncate">{DEMO_PROFILES[0].displayName}</p>
                                <p className="text-[10px] text-slate-400">Frontier AI Researcher</p>
                              </div>
                            </button>
                            <button
                              onClick={() => {
                                setIsProfileMenuOpen(false);
                                signInDemo(DEMO_PROFILES[1]);
                              }}
                              className="w-full text-left p-2 rounded-lg bg-[#111A2E] hover:bg-[#172545] text-slate-200 flex items-center space-x-2 border border-[#1C2C4E]"
                            >
                              <img src={DEMO_PROFILES[1].avatarUrl} className="w-6 h-6 rounded-full object-cover" />
                              <div className="min-w-0">
                                <p className="font-bold text-[11px] text-sky-200 truncate">{DEMO_PROFILES[1].displayName}</p>
                                <p className="text-[10px] text-slate-400">Chief Markets Wire</p>
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* TOP MENU SLIDE-OVER DRAWER (Twitter & Facebook style navigation drawer) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fadeIn"
          />

          {/* Drawer Content */}
          <div className="relative w-80 max-w-[85vw] h-full bg-[#0B1120] border-r border-[#1A2640] shadow-2xl flex flex-col z-10 animate-slideRight overflow-y-auto">
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#1A2640] flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-400 via-blue-500 to-amber-400 p-0.5 flex-shrink-0 shadow-sm">
                  <img
                    src={APP_ASSETS.LOGO}
                    alt="Chirro Logo"
                    className="w-full h-full rounded-[10px] object-cover bg-[#0F172A]"
                  />
                </div>
                <div>
                  <h2 className="font-black text-white text-base tracking-wider">CHIRRO</h2>
                  <p className="text-[10px] text-sky-400 font-medium">World News Network</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#131E35] transition-colors"
                aria-label="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Card in Drawer */}
            <div className="p-4 border-b border-[#1A2640] bg-[#0E1626]/80">
              {profile ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={profile.avatarUrl} 
                      alt={profile.displayName} 
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-sky-400/40"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-white text-sm truncate">{profile.displayName}</p>
                      <p className="text-xs text-sky-400 truncate">@{profile.username}</p>
                      <p className="text-[11px] text-slate-400 truncate">{profile.city}, {profile.country}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNavigate('profile')}
                    className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-[#131E35] hover:bg-[#1B2A4B] text-sky-300 border border-sky-800/40 flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Go to My Profile</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="font-bold text-white text-xs">Explore as Guest</p>
                  <p className="text-[11px] text-slate-400">Sign in to unlock full networking and post opportunities.</p>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      signInWithGoogle();
                    }}
                    className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-sky-500 text-white flex items-center justify-center space-x-1.5 shadow-md shadow-sky-500/20"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>{t('signIn')}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Main Navigation Links */}
            <div className="flex-1 p-3 space-y-1">
              <p className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Explore Chirro Wire
              </p>
              {navMenuItems.map(item => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id as TabType)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all ${
                      isActive 
                        ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 font-bold' 
                        : 'text-slate-300 hover:text-white hover:bg-[#131E35]'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className={`p-2 rounded-xl ${isActive ? 'bg-sky-500/20 text-sky-400' : 'bg-[#111A2E] text-slate-400'}`}>
                        <Icon className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold leading-tight">{item.label}</p>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{item.desc}</p>
                      </div>
                    </div>

                    {item.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30 font-mono ml-2">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Create Post Shortcut Button inside Menu */}
              <div className="pt-3 px-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenCreate();
                  }}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-sky-400 via-blue-500 to-sky-500 text-white shadow-md shadow-sky-500/20 flex items-center justify-center space-x-2 active:scale-98 transition-transform"
                >
                  <img src={APP_ASSETS.CHIRP_ICON} alt="" className="w-4 h-4 object-contain brightness-105" />
                  <span>Chirp (Post, Opportunity, Poll)</span>
                </button>
              </div>

              {/* Admin Moderation Option */}
              {isAdmin && (
                <div className="pt-2 px-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenAdmin();
                    }}
                    className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-[#111A2E] text-amber-300 border border-amber-800/50 flex items-center space-x-2 hover:bg-[#172545] transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Admin Moderation Console</span>
                  </button>
                </div>
              )}
            </div>

            {/* Menu Footer Preferences & Info */}
            <div className="p-4 border-t border-[#1A2640] bg-[#0A0F1D] space-y-3 text-xs">
              
              {/* Language and Theme bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 bg-[#111A2E] border border-[#1C2C4E] rounded-lg p-0.5">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-2 py-1 rounded text-[11px] font-bold ${
                      language === 'en' ? 'bg-sky-500/20 text-sky-300' : 'text-slate-400'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage('sw')}
                    className={`px-2 py-1 rounded text-[11px] font-bold ${
                      language === 'sw' ? 'bg-sky-500/20 text-sky-300' : 'text-slate-400'
                    }`}
                  >
                    Kiswahili
                  </button>
                </div>

                <button
                  onClick={toggleTheme}
                  className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-[#111A2E] border border-[#1C2C4E] text-slate-300 hover:text-sky-300"
                >
                  {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
                  <span className="text-[11px]">{theme === 'dark' ? 'Night Sky' : 'Light'}</span>
                </button>
              </div>

              {/* Onboarding trigger */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  restartOnboarding();
                }}
                className="w-full text-left text-sky-400/90 hover:text-sky-300 text-[11px] flex items-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Replay New Member Onboarding</span>
              </button>

              <p className="text-[10px] text-slate-500">
                Chirro World News Network • v1.0.0
              </p>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
