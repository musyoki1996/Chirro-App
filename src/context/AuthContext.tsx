import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile } from '../types';
import { DEMO_PROFILES } from '../data/seedData';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  signInWithGoogle: () => Promise<void>;
  signInDemo: (profilePreset?: UserProfile) => void;
  signOutUser: () => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: (data: Partial<UserProfile>) => Promise<void>;
  restartOnboarding: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isOnboardingOpen: false,
  setIsOnboardingOpen: () => {},
  signInWithGoogle: async () => {},
  signInDemo: () => {},
  signOutUser: async () => {},
  updateProfileData: async () => {},
  completeOnboarding: async () => {},
  restartOnboarding: () => {},
  isAdmin: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Monitor Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Fetch or listen to user profile in Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        try {
          const snapshot = await getDoc(userDocRef);
          if (snapshot.exists()) {
            const data = snapshot.data() as UserProfile;
            setProfile(data);
            if (!data.isOnboarded) {
              setIsOnboardingOpen(true);
            }
          } else {
            // New user without profile document: create base stub and prompt onboarding
            const baseProfile: UserProfile = {
              userId: firebaseUser.uid,
              username: (firebaseUser.displayName?.toLowerCase().replace(/\s+/g, '_') || 'user') + '_' + firebaseUser.uid.slice(0, 4),
              displayName: firebaseUser.displayName || 'Chirro Correspondent',
              avatarUrl: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              country: 'Kenya',
              city: 'Nairobi',
              interests: [],
              skills: [],
              isOnboarded: false,
              createdAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, baseProfile);
            setProfile(baseProfile);
            setIsOnboardingOpen(true);
          }
        } catch (error) {
          console.warn('Error reading user profile from Firestore:', error);
        }
      } else {
        // Check if a local demo session was active
        const savedDemo = localStorage.getItem('chirro_demo_profile') || localStorage.getItem('kutana_demo_profile');
        if (savedDemo) {
          try {
            const parsed = JSON.parse(savedDemo) as UserProfile;
            setProfile(parsed);
            if (!parsed.isOnboarded) {
              setIsOnboardingOpen(true);
            }
          } catch {
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogleAction = async () => {
    try {
      localStorage.removeItem('chirro_demo_profile');
      localStorage.removeItem('kutana_demo_profile');
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google sign in error:', error);
      // Fallback hint for popup blocks in iframes
      signInDemo();
    }
  };

  const signInDemo = (profilePreset?: UserProfile) => {
    const active = profilePreset || {
      userId: 'user-new-' + Math.random().toString(36).substring(2, 7),
      username: 'chirro_member',
      displayName: 'Chirro Member',
      country: 'United States',
      city: 'San Francisco',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      interests: [],
      skills: [],
      isOnboarded: false,
      createdAt: new Date().toISOString(),
    };
    setProfile(active);
    localStorage.setItem('chirro_demo_profile', JSON.stringify(active));
    if (!active.isOnboarded) {
      setIsOnboardingOpen(true);
    }
  };

  const signOutUserAction = async () => {
    localStorage.removeItem('chirro_demo_profile');
    localStorage.removeItem('kutana_demo_profile');
    setProfile(null);
    setIsOnboardingOpen(false);
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.warn('Signout warning:', err);
    }
  };

  const updateProfileData = async (data: Partial<UserProfile>) => {
    if (!profile) return;
    const updated = { ...profile, ...data, updatedAt: new Date().toISOString() };
    setProfile(updated);
    localStorage.setItem('chirro_demo_profile', JSON.stringify(updated));

    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, updated, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
      }
    }
  };

  const completeOnboarding = async (data: Partial<UserProfile>) => {
    if (!profile) return;
    const finished: UserProfile = {
      ...profile,
      ...data,
      isOnboarded: true,
      updatedAt: new Date().toISOString(),
    };
    setProfile(finished);
    localStorage.setItem('chirro_demo_profile', JSON.stringify(finished));
    setIsOnboardingOpen(false);

    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, finished, { merge: true });
      } catch (err) {
        console.warn('Could not persist completed onboarding to Firestore:', err);
      }
    }
  };

  const restartOnboarding = () => {
    setIsOnboardingOpen(true);
  };

  const isAdmin = user?.email === 'mutisya104@gmail.com' || profile?.username === 'mutisya104';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isOnboardingOpen,
        setIsOnboardingOpen,
        signInWithGoogle: signInWithGoogleAction,
        signInDemo,
        signOutUser: signOutUserAction,
        updateProfileData,
        completeOnboarding,
        restartOnboarding,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
