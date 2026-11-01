import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'sw';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Brand & Vision
    brandTagline: 'World News Network',
    brandSub: 'Chirro: World News Network. Share what matters, track global and regional news, and turn ideas into action.',
    // Navigation
    navHome: 'Home',
    navPulse: 'Pulse',
    navCircles: 'Circles',
    navActionHub: 'Action Hub',
    navNotifications: 'Notifications',
    navProfile: 'Profile',
    navCreate: 'Chirp',
    navSearch: 'Search Chirro...',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    signInWithGoogle: 'Continue with Google',
    guestSignIn: 'Quick Demo Mode',
    // Feed
    feedForYou: 'Discovery',
    feedFollowing: 'Following',
    emptyFeed: 'No posts found yet. Be the first to share breaking news, an idea, or an opportunity!',
    // Action Layer
    actionLayerBadge: 'Action Layer',
    typeDiscussion: 'Discussion',
    typeQuestion: 'Question',
    typePoll: 'Poll',
    typeEvent: 'Event',
    typeProject: 'Project',
    typeOpportunity: 'Opportunity',
    typeCommunityRequest: 'Community Request',
    statusOpen: 'Open',
    statusInProgress: 'In Progress',
    statusCompleted: 'Completed',
    statusClosed: 'Closed',
    collaborateBtn: 'Collaborate / Respond',
    rsvpBtn: 'RSVP Event',
    voteBtn: 'Vote',
    respondTitle: 'Respond to Opportunity',
    respondPlaceholder: 'Describe how you can collaborate or what skills you bring...',
    // Onboarding
    onboardingTitle: 'Welcome to Chirro',
    onboardingSubtitle: 'Set up your correspondent profile to connect with changemakers, analysts, and readers globally.',
    stepIdentity: 'Profile',
    stepInterests: 'Passions',
    stepCircles: 'Circles',
    stepFirstPost: 'First Action',
    stepLaunch: 'Ready',
    displayNameLabel: 'Display Name',
    usernameLabel: 'Username (@handle)',
    bioLabel: 'Bio',
    bioPlaceholder: 'AI researcher, international correspondent, or creative storyteller...',
    countryLabel: 'Country',
    cityLabel: 'City or County',
    selectInterestsTitle: 'Choose at least 3 areas of interest',
    selectInterestsSub: 'This personalizes your Pulse discovery feed and recommends community Circles.',
    recommendedCirclesTitle: 'Join your first Circles',
    recommendedCirclesSub: 'Circles are vibrant hubs for specific crafts, industries, and cities.',
    firstPostTitle: 'Make your first post',
    firstPostSub: 'Ordinary microblog or an Action Layer post? Your voice starts here.',
    firstPostPlaceholder: 'What breaking event, research, or initiative are you following today?',
    finishOnboarding: 'Launch My Chirro Experience',
    skipForNow: 'Skip for now',
    nextStep: 'Continue',
    prevStep: 'Back',
    // Post Composer
    composeTitle: 'New Chirp',
    publishBtn: 'Chirp',
    publishing: 'Chirping...',
    postSuccess: 'Chirp published to Chirro network!',
    // Pulse
    pulseTitle: 'Pulse of Africa',
    pulseSub: 'Real-time discussions, emerging themes, and regional action items.',
    allRegions: 'All Regions',
    kenya: 'Kenya (Nairobi / Mombasa)',
    nigeria: 'Nigeria (Lagos / Abuja)',
    rwanda: 'Rwanda (Kigali)',
    ghana: 'Ghana (Accra)',
    southAfrica: 'South Africa',
    globalDiaspora: 'Pan-African & Global',
    // Actions
    like: 'Like',
    reply: 'Reply',
    repost: 'Rechirp',
    rechirp: 'Rechirp',
    bookmark: 'Bookmark',
    share: 'Share',
    report: 'Report',
    translateToSwahili: 'Tafsiri kwa Kiswahili',
    translateToEnglish: 'Translate to English',
    showOriginal: 'Show Original',
  },
  sw: {
    // Brand & Vision
    brandTagline: 'Mtandao wa Habari Duniani',
    brandSub: 'Chirro: Mtandao wa Habari Duniani. Shiriki mambo muhimu, gundua habari za kimataifa, jamii na fursa halisi.',
    // Navigation
    navHome: 'Mwanzo',
    navPulse: 'Mvumo',
    navCircles: 'Miduara',
    navActionHub: 'Kituo cha Fursa',
    navNotifications: 'Taarifa',
    navProfile: 'Wasifu',
    navCreate: 'Chirp',
    navSearch: 'Tafuta Chirro...',
    signIn: 'Ingia',
    signOut: 'Toka',
    signInWithGoogle: 'Endelea na Google',
    guestSignIn: 'Hali ya Jaribio la Haraka',
    // Feed
    feedForYou: 'Gundua',
    feedFollowing: 'Unaowafuata',
    emptyFeed: 'Hakuna machapisho bado. Kuwa wa kwanza kushiriki habari, wazo au fursa!',
    // Action Layer
    actionLayerBadge: 'Safu ya Vitendo',
    typeDiscussion: 'Mjadala',
    typeQuestion: 'Swali',
    typePoll: 'Kura ya Maoni',
    typeEvent: 'Tukio',
    typeProject: 'Mradi',
    typeOpportunity: 'Fursa',
    typeCommunityRequest: 'Ombi la Jamii',
    statusOpen: 'Wazi',
    statusInProgress: 'Inaendelea',
    statusCompleted: 'Imekamilika',
    statusClosed: 'Imefungwa',
    collaborateBtn: 'Shirikiana / Jibu',
    rsvpBtn: 'Thibitisha Kuhudhuria',
    voteBtn: 'Piga Kura',
    respondTitle: 'Jibu Fursa Hii',
    respondPlaceholder: 'Eleza jinsi unavyoweza kushirikiana au ujuzi unaoleta...',
    // Onboarding
    onboardingTitle: 'Karibu Chirro',
    onboardingSubtitle: 'Weka wasifu wako ili uungane na waandishi, wachambuzi na wasomaji kote duniani.',
    stepIdentity: 'Wasifu',
    stepInterests: 'Mambo Upendayo',
    stepCircles: 'Miduara',
    stepFirstPost: 'Kitendo cha Kwanza',
    stepLaunch: 'Tayari',
    displayNameLabel: 'Jina Lako Kamili',
    usernameLabel: 'Jina la Mtumiaji (@handle)',
    bioLabel: 'Kuhusu Wewe',
    bioPlaceholder: 'Mtafiti wa AI, mwandishi wa habari za kimataifa, au mbunifu wa teknolojia...',
    countryLabel: 'Nchi',
    cityLabel: 'Mji au Kaunti',
    selectInterestsTitle: 'Chagua angalau nyanja 3 unazozipenda',
    selectInterestsSub: 'Hii itaboresha ukurasa wako wa Mvumo na kupendekeza Miduara ya habari inayokufaa.',
    recommendedCirclesTitle: 'Jiunge na Miduara yako ya kwanza',
    recommendedCirclesSub: 'Miduara ni vituo vya jamii vyenye shughuli za fani, tasnia, na habari.',
    firstPostTitle: 'Weka chapisho lako la kwanza',
    firstPostSub: 'Chapisho la kawaida au lenye muundo wa Safu ya Vitendo? Sauti yako inaanza hapa.',
    firstPostPlaceholder: 'Unachambua habari gani, una swali gani, au unataka kujenga nini?',
    finishOnboarding: 'Anza Kutumia Chirro',
    skipForNow: 'Ruka kwa sasa',
    nextStep: 'Endelea',
    prevStep: 'Rudi',
    // Post Composer
    composeTitle: 'Chirp Mpya',
    publishBtn: 'Chirp',
    publishing: 'Inachirp...',
    postSuccess: 'Chirp limetumwa kwenye mtandao wa Chirro!',
    // Pulse
    pulseTitle: 'Mvumo wa Afrika',
    pulseSub: 'Mijadala ya moja kwa moja, mada zinazoibuka na fursa za kikanda.',
    allRegions: 'Kanda Zote',
    kenya: 'Kenya (Nairobi / Mombasa)',
    nigeria: 'Nigeria (Lagos / Abuja)',
    rwanda: 'Rwanda (Kigali)',
    ghana: 'Ghana (Accra)',
    southAfrica: 'Afrika Kusini',
    globalDiaspora: 'Afrika nzima na Ughaibuni',
    // Actions
    like: 'Penda',
    reply: 'Jibu',
    repost: 'Rechirp',
    rechirp: 'Rechirp',
    bookmark: 'Hifadhi',
    share: 'Shiriki',
    report: 'Ripoti',
    translateToSwahili: 'Tafsiri kwa Kiswahili',
    translateToEnglish: 'Translate to English',
    showOriginal: 'Onyesha Halisi',
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('chirro_lang') || localStorage.getItem('kutana_lang');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('chirro_lang', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
