import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Compass, 
  Globe2, 
  Users, 
  MessageSquare, 
  Rocket, 
  MapPin, 
  Layers,
  HelpCircle,
  Briefcase,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  AVATAR_PRESETS, 
  INTEREST_CATEGORIES, 
  AFRICAN_COUNTRIES, 
  INITIAL_CIRCLES 
} from '../../data/seedData';
import { Post, PostType } from '../../types';
import { APP_ASSETS } from '../../constants/assets';
import { PhotoUpload } from '../Common/PhotoUpload';

interface OnboardingModalProps {
  onPublishFirstPost?: (post: Partial<Post>) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onPublishFirstPost }) => {
  const { profile, completeOnboarding, isOnboardingOpen, setIsOnboardingOpen } = useAuth();
  const { t } = useLanguage();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [displayName, setDisplayName] = useState(profile?.displayName || 'Elena Rostova');
  const [username, setUsername] = useState(profile?.username || 'elena_frontier');
  const [bio, setBio] = useState(profile?.bio || 'Independent correspondent covering frontier technologies, world markets, and global news.');
  const [country, setCountry] = useState(profile?.country || 'United States');
  const [city, setCity] = useState(profile?.city || 'San Francisco');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || AVATAR_PRESETS[0]);
  
  // Interests state (Step 2)
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    profile?.interests?.length ? profile.interests : ['breaking', 'tech', 'geopolitics']
  );

  // Joined circles state (Step 3)
  const [joinedCircles, setJoinedCircles] = useState<string[]>(['circle-world-wire']);

  // First Post state (Step 4)
  const [firstPostType, setFirstPostType] = useState<PostType>('discussion');
  const [firstPostContent, setFirstPostContent] = useState(
    'Hello world! Excited to join Chirro World News Network. Looking forward to tracking breaking global stories, open research, and connecting with correspondents worldwide.'
  );
  const [opportunityTitle, setOpportunityTitle] = useState('');

  if (!isOnboardingOpen) return null;

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleCircle = (circleId: string) => {
    setJoinedCircles(prev =>
      prev.includes(circleId) ? prev.filter(id => id !== circleId) : [...prev, circleId]
    );
  };

  const handleNext = () => {
    if (step < 5) {
      if (step === 4) {
        // Trigger celebratory warm confetti on stepping into launch!
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#38BDF8', '#0EA5E9', '#2563EB', '#F59E0B', '#FFFFFF']
          });
        } catch {
          // fallback
        }
      }
      setStep((step + 1) as any);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as any);
    }
  };

  const handleFinish = async () => {
    if (firstPostContent.trim() && onPublishFirstPost) {
      onPublishFirstPost({
        content: firstPostContent,
        postType: firstPostType,
        opportunityTitle: opportunityTitle || undefined,
        location: `${city}, ${country}`,
        tags: selectedInterests.slice(0, 3),
      });
    }

    await completeOnboarding({
      displayName,
      username: username.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase() || 'user',
      bio,
      country,
      city,
      avatarUrl,
      interests: selectedInterests,
    });
  };

  const recommendedCircles = INITIAL_CIRCLES.filter(c =>
    selectedInterests.includes(c.category) || selectedInterests.length === 0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#0E1626] text-slate-100 border border-[#1E2E50] rounded-2xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header / Progress Indicator */}
        <div className="p-5 sm:p-6 border-b border-[#1A2640] bg-gradient-to-r from-[#0B1120] via-[#111C33] to-[#0B1120]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 via-blue-500 to-amber-400 p-0.5 flex items-center justify-center shadow-md shadow-sky-950/40 flex-shrink-0">
                <img src={APP_ASSETS.LOGO} alt="Chirp Mascot" className="w-full h-full rounded-[10px] object-cover" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-sky-400">
                  Chirro Onboarding
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {step === 1 && 'Step 1: Your Chirro Correspondent Identity'}
                  {step === 2 && 'Step 2: Choose Your News Beats & Topics'}
                  {step === 3 && 'Step 3: Discover Global News Circles'}
                  {step === 4 && 'Step 4: Publish Your First Chirp'}
                  {step === 5 && 'Step 5: You Are Ready for Chirro!'}
                </h2>
              </div>
            </div>

            <button
              onClick={() => setIsOnboardingOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors px-2.5 py-1 rounded-md hover:bg-[#15223C]"
            >
              {t('skipForNow')}
            </button>
          </div>

          {/* Stepper Dots */}
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  i === step
                    ? 'bg-gradient-to-r from-sky-400 to-blue-500 shadow-sm shadow-sky-500/40'
                    : i < step
                    ? 'bg-sky-600/70'
                    : 'bg-[#1A2640]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 text-slate-200 text-sm">
          
          {/* STEP 1: IDENTITY */}
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h3 className="text-lg font-bold text-slate-100 mb-1">
                  Craft Your Public Profile
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm">
                  Upload your photo and set up your handle for readers, analysts, and fellow correspondents.
                </p>
              </div>

              {/* Photo Upload Interface */}
              <div className="p-4 rounded-2xl bg-[#0B1120] border border-[#1E2E50] space-y-3">
                <PhotoUpload
                  currentPhotoUrl={avatarUrl}
                  onPhotoSelected={(photoData) => setAvatarUrl(photoData)}
                  onRemovePhoto={() => setAvatarUrl(AVATAR_PRESETS[0])}
                  label="Profile Picture (Upload your custom photo)"
                  size="md"
                />

                {/* Optional Quick Starter Presets */}
                <div className="pt-2 border-t border-[#16233B]">
                  <p className="text-[11px] text-slate-400 font-medium mb-1.5">
                    Or select an instant persona image:
                  </p>
                  <div className="flex items-center space-x-2.5 overflow-x-auto pb-1">
                    {AVATAR_PRESETS.map((preset, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setAvatarUrl(preset)}
                        className={`relative rounded-xl overflow-hidden p-0.5 transition-all flex-shrink-0 ${
                          avatarUrl === preset
                            ? 'ring-2 ring-sky-400 scale-105 shadow-md shadow-sky-950/40'
                            : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={preset}
                          alt="Preset avatar"
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    {t('displayNameLabel')}
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="Wangari Ndung’u"
                    className="w-full bg-[#1E1712] border border-[#3A2D23] rounded-xl px-3.5 py-2.5 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    {t('usernameLabel')}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-stone-500 text-sm">@</span>
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                      placeholder="wangari"
                      className="w-full bg-[#1E1712] border border-[#3A2D23] rounded-xl pl-8 pr-3.5 py-2.5 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Country & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    {t('countryLabel')}
                  </label>
                  <select
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className="w-full bg-[#1E1712] border border-[#3A2D23] rounded-xl px-3.5 py-2.5 text-stone-100 focus:outline-none focus:border-amber-400 text-sm"
                  >
                    {AFRICAN_COUNTRIES.map(c => (
                      <option key={c.code} value={c.name} className="bg-[#1A1410] text-stone-100">
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    {t('cityLabel')}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-2.5 w-4 h-4 text-stone-500" />
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="Nairobi, Lagos, Kigali..."
                      className="w-full bg-[#1E1712] border border-[#3A2D23] rounded-xl pl-10 pr-3.5 py-2.5 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  {t('bioLabel')}
                </label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={2}
                  placeholder={t('bioPlaceholder')}
                  className="w-full bg-[#1E1712] border border-[#3A2D23] rounded-xl px-3.5 py-2.5 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 text-sm resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 2: INTERESTS */}
          {step === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h3 className="text-lg font-bold text-amber-50 mb-1">
                  {t('selectInterestsTitle')}
                </h3>
                <p className="text-stone-400 text-xs sm:text-sm">
                  {t('selectInterestsSub')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {INTEREST_CATEGORIES.map(category => {
                  const isSelected = selectedInterests.includes(category.id);
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => toggleInterest(category.id)}
                      className={`text-left p-3.5 rounded-xl border transition-all duration-200 relative ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-400/80 shadow-sm shadow-amber-950/30'
                          : 'bg-[#1E1712] border-[#33261C] hover:border-[#4A382A] hover:bg-[#251D16]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-2xl">{category.icon}</span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="font-semibold text-stone-100 text-xs sm:text-sm">
                        {category.label}
                      </p>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        {category.count}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="p-3 bg-[#1C1612] rounded-xl border border-[#33261C] flex items-center justify-between text-xs text-stone-400">
                <span>Selected: <strong className="text-amber-400">{selectedInterests.length}</strong> focus areas</span>
                {selectedInterests.length < 3 && (
                  <span className="text-orange-400 font-medium">Please select at least 3</span>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: CIRCLES */}
          {step === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h3 className="text-lg font-bold text-amber-50 mb-1">
                  {t('recommendedCirclesTitle')}
                </h3>
                <p className="text-stone-400 text-xs sm:text-sm">
                  {t('recommendedCirclesSub')}
                </p>
              </div>

              <div className="space-y-3">
                {recommendedCircles.map(circle => {
                  const isJoined = joinedCircles.includes(circle.id);
                  return (
                    <div
                      key={circle.id}
                      className="p-3.5 rounded-xl bg-[#1C1612] border border-[#33261C] flex items-center justify-between gap-3 hover:border-[#4A382A] transition-colors"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <img
                          src={circle.iconUrl}
                          alt={circle.name}
                          className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-[#382B21]"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-amber-100 text-sm truncate">
                            {circle.name}
                          </h4>
                          <p className="text-xs text-stone-400 line-clamp-1 mt-0.5">
                            {circle.description}
                          </p>
                          <span className="text-[11px] text-amber-400 font-medium">
                            {circle.memberCount.toLocaleString()} members
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleCircle(circle.id)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 flex-shrink-0 ${
                          isJoined
                            ? 'bg-[#2A1F18] text-amber-300 border border-amber-600/40'
                            : 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold hover:brightness-105 shadow-md shadow-amber-950/30'
                        }`}
                      >
                        {isJoined ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Joined</span>
                          </>
                        ) : (
                          <span>+ Join</span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: FIRST ACTION (POST) */}
          {step === 4 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h3 className="text-lg font-bold text-amber-50 mb-1">
                  {t('firstPostTitle')}
                </h3>
                <p className="text-stone-400 text-xs sm:text-sm">
                  {t('firstPostSub')}
                </p>
              </div>

              {/* Action Layer Post Type Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { type: 'discussion', label: 'Discussion', icon: MessageSquare },
                  { type: 'question', label: 'Question', icon: HelpCircle },
                  { type: 'project', label: 'Project', icon: Layers },
                  { type: 'opportunity', label: 'Opportunity', icon: Briefcase },
                ].map(item => {
                  const Icon = item.icon;
                  const isSelected = firstPostType === item.type;
                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => {
                        setFirstPostType(item.type as PostType);
                        if (item.type === 'question') {
                          setFirstPostContent('Looking for recommendations on low-power solar telemetry hardware available in East Africa. Any team currently testing LoRa vs GSM?');
                        } else if (item.type === 'project') {
                          setOpportunityTitle('Collaborative Open-Source Veracity Gateway');
                          setFirstPostContent('We are starting an open-source verification benchmark project linking real-time wire feeds to multimodal evaluation pipelines. Looking for 2 Python / React contributors!');
                        } else if (item.type === 'opportunity') {
                          setOpportunityTitle('Seeking Tech Lead for Climate Sensor Network');
                          setFirstPostContent('Offering a funded research fellowship for a technical lead to oversee autonomous methane and air telemetry sensors.');
                        } else {
                          setFirstPostContent('Hello! Excited to connect with journalists, researchers, and global correspondents across Chirro World News Network.');
                        }
                      }}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center space-y-1.5 ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-amber-100 shadow-sm shadow-amber-950/40'
                          : 'bg-[#1E1712] border-[#33261C] text-stone-400 hover:text-stone-200 hover:bg-[#251D16]'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-semibold">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Title for Project/Opportunity */}
              {(firstPostType === 'project' || firstPostType === 'opportunity') && (
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    {firstPostType === 'project' ? 'Project Title' : 'Opportunity Headline'}
                  </label>
                  <input
                    type="text"
                    value={opportunityTitle}
                    onChange={e => setOpportunityTitle(e.target.value)}
                    placeholder="e.g. Community Clean Water Telemetry"
                    className="w-full bg-[#1E1712] border border-[#3A2D23] rounded-xl px-3.5 py-2 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 text-sm"
                  />
                </div>
              )}

              {/* Content textarea */}
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Message Content
                </label>
                <textarea
                  value={firstPostContent}
                  onChange={e => setFirstPostContent(e.target.value)}
                  rows={4}
                  placeholder={t('firstPostPlaceholder')}
                  className="w-full bg-[#1E1712] border border-[#3A2D23] rounded-xl p-3.5 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 text-sm resize-none"
                />
              </div>

              <div className="flex items-center text-xs text-stone-400 space-x-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Posting publicly to <strong>{country}</strong> feed & topic circles</span>
              </div>
            </div>
          )}

          {/* STEP 5: LAUNCH CELEBRATION */}
          {step === 5 && (
            <div className="text-center py-4 space-y-6 animate-fadeIn">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-sky-400 via-blue-500 to-amber-400 p-0.5 mx-auto shadow-xl shadow-sky-950/40">
                <div className="w-full h-full bg-[#0E1626] rounded-2xl flex items-center justify-center">
                  <Rocket className="w-10 h-10 text-sky-400 animate-bounce" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  Chirro Identity Activated!
                </h3>
                <p className="text-slate-300 text-sm mt-1 max-w-md mx-auto">
                  Welcome to <strong>Chirro</strong> World News Network, {displayName}. Your handle is live, your selected news circles are connected, and your first Chirp is ready.
                </p>
              </div>

              {/* Preview Identity Card */}
              <div className="p-4 rounded-xl bg-[#111A2E] border border-[#1C2C4E] text-left max-w-md mx-auto shadow-md">
                <div className="flex items-center space-x-3 mb-2.5">
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-sky-400"
                  />
                  <div>
                    <h4 className="font-bold text-white text-sm">{displayName}</h4>
                    <p className="text-xs text-sky-400 font-mono">@{username} • {city}, {country}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 italic mb-3">"{bio}"</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedInterests.map(id => {
                    const match = INTEREST_CATEGORIES.find(c => c.id === id);
                    return (
                      <span key={id} className="text-[11px] px-2 py-0.5 rounded-md bg-[#2A1D14] text-amber-300 border border-amber-800/60">
                        {match?.icon} {match?.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-[#1A2640] bg-[#0E1626]/90 flex items-center justify-between">
          {step > 1 && step < 5 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-400 hover:text-white hover:bg-[#15223C] transition-colors flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('prevStep')}</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={step === 2 && selectedInterests.length < 3}
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-sky-500 text-white hover:brightness-110 shadow-md shadow-sky-500/25 flex items-center space-x-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>{t('nextStep')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-sky-500 text-white hover:brightness-110 shadow-xl shadow-sky-500/35 flex items-center justify-center space-x-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{t('finishOnboarding')}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
