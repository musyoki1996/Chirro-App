import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Calendar, 
  Edit3, 
  Sparkles, 
  Bookmark, 
  Layers, 
  MessageSquare, 
  Check, 
  X,
  Share2,
  Shield,
  Globe2,
  Camera
} from 'lucide-react';
import { Post, UserProfile } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { PostCard } from '../Feed/PostCard';
import { INTEREST_CATEGORIES, AFRICAN_COUNTRIES } from '../../data/seedData';
import { PhotoUpload } from '../Common/PhotoUpload';

interface ProfileViewProps {
  posts: Post[];
  onLike: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onOpenReply: (post: Post) => void;
  onOpenRespond: (post: Post) => void;
  onOpenReport: (post: Post) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  posts,
  onLike,
  onBookmark,
  onOpenReply,
  onOpenRespond,
  onOpenReport,
}) => {
  const { profile, updateProfileData, restartOnboarding, user } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'posts' | 'projects' | 'bookmarks'>('posts');
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [editName, setEditName] = useState(profile?.displayName || '');
  const [editBio, setEditBio] = useState(profile?.bio || '');
  const [editCountry, setEditCountry] = useState(profile?.country || 'United States');
  const [editCity, setEditCity] = useState(profile?.city || 'San Francisco');
  const [editSkills, setEditSkills] = useState(profile?.skills?.join(', ') || '');
  const [editAvatarUrl, setEditAvatarUrl] = useState(profile?.avatarUrl || '');

  const userPosts = posts.filter(p => p.authorId === profile?.userId || p.authorUsername === profile?.username);
  const userProjects = userPosts.filter(p => p.postType === 'project' || p.postType === 'opportunity');
  
  const bookmarkedPosts = posts.slice(0, 2);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const skills = editSkills.split(',').map(s => s.trim()).filter(Boolean);
    await updateProfileData({
      displayName: editName.trim() || profile?.displayName,
      bio: editBio.trim(),
      country: editCountry,
      city: editCity.trim(),
      skills,
      avatarUrl: editAvatarUrl || profile?.avatarUrl,
    });
    setIsEditOpen(false);
  };

  const handleQuickPhotoSelect = async (photoDataUrl: string) => {
    setEditAvatarUrl(photoDataUrl);
    await updateProfileData({
      avatarUrl: photoDataUrl,
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Profile Header Card */}
      <div className="rounded-2xl bg-[#111A2E] border border-[#1C2C4E] overflow-hidden shadow-xl">
        {/* Cover Photo */}
        <div className="h-36 sm:h-48 w-full bg-gradient-to-r from-[#0B1528] via-[#16274B] to-[#0B1528] relative">
          <div className="absolute inset-0 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
        </div>

        {/* Profile Info Row */}
        <div className="px-5 sm:px-6 pb-6 relative pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-14 sm:-mt-16 mb-4 gap-4">
            
            {/* Avatar with Interactive Upload Trigger */}
            <div className="relative group">
              <label className="cursor-pointer block relative">
                <img
                  src={profile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={profile?.displayName || 'Profile'}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-[#0B1120] border-2 border-sky-400 shadow-xl group-hover:brightness-90 transition-all"
                />
                
                {/* Camera upload overlay badge */}
                <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-1">
                  <Camera className="w-6 h-6 text-sky-400 mb-0.5" />
                  <span className="text-[10px] font-bold">Upload Photo</span>
                </div>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const res = ev.target?.result as string;
                        if (res) handleQuickPhotoSelect(res);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-400 ring-2 ring-[#0B1120] pointer-events-none" />
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => {
                  setEditName(profile?.displayName || '');
                  setEditBio(profile?.bio || '');
                  setEditCountry(profile?.country || 'United States');
                  setEditCity(profile?.city || 'San Francisco');
                  setEditSkills(profile?.skills?.join(', ') || '');
                  setEditAvatarUrl(profile?.avatarUrl || '');
                  setIsEditOpen(true);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#131E35] hover:bg-[#182644] text-slate-200 border border-[#1E2E50] transition-colors flex items-center space-x-1.5"
              >
                <Edit3 className="w-3.5 h-3.5 text-sky-400" />
                <span>Edit Profile</span>
              </button>

              <button
                type="button"
                onClick={restartOnboarding}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/40 transition-colors flex items-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Onboarding Flow</span>
              </button>
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
                {profile?.displayName || 'Chirro Correspondent'}
              </h2>
              <p className="text-xs sm:text-sm text-sky-400 font-mono">
                @{profile?.username || 'user'}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {profile?.bio || 'Reporting on world news, emerging technologies, and global insights across Chirro.'}
            </p>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>{profile?.city || 'Nairobi'}, {profile?.country || 'Kenya'}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Joined October 2026</span>
              </span>
              <span className="flex items-center space-x-1 text-slate-300">
                <strong className="text-white font-bold">{profile?.followingCount || 42}</strong> Following
              </span>
              <span className="flex items-center space-x-1 text-slate-300">
                <strong className="text-white font-bold">{profile?.followersCount || 128}</strong> Followers
              </span>
            </div>

            {/* Interest Badges */}
            {profile?.interests && profile.interests.length > 0 && (
              <div className="pt-2 flex flex-wrap gap-1.5">
                {profile.interests.map(id => {
                  const match = INTEREST_CATEGORIES.find(c => c.id === id);
                  return (
                    <span
                      key={id}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-[#131E35] text-sky-300 border border-[#1E2E50] font-medium flex items-center space-x-1"
                    >
                      <span>{match?.icon || '🪐'}</span>
                      <span>{match?.label || id}</span>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="px-5 border-t border-[#1C2C4E] flex items-center space-x-6 text-xs sm:text-sm font-semibold">
          {[
            { id: 'posts', label: `My Posts (${userPosts.length})`, icon: MessageSquare },
            { id: 'projects', label: `Actions & Projects (${userProjects.length})`, icon: Layers },
            { id: 'bookmarks', label: 'Saved Bookmarks', icon: Bookmark },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 border-b-2 transition-all flex items-center space-x-1.5 ${
                activeTab === tab.id
                  ? 'border-sky-400 text-sky-300 font-bold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Feed Content */}
      <div className="space-y-4">
        {activeTab === 'posts' && (
          userPosts.length === 0 ? (
            <div className="p-10 text-center rounded-2xl bg-[#111A2E]/50 border border-dashed border-[#1C2C4E] text-xs text-slate-400">
              You haven't posted yet. Tap "+ New Post" to share your first thought or opportunity!
            </div>
          ) : (
            userPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onLike={onLike}
                onBookmark={onBookmark}
                onOpenReply={onOpenReply}
                onOpenRespond={onOpenRespond}
                onOpenReport={onOpenReport}
              />
            ))
          )
        )}

        {activeTab === 'projects' && (
          userProjects.length === 0 ? (
            <div className="p-10 text-center rounded-2xl bg-[#111A2E]/50 border border-dashed border-[#1C2C4E] text-xs text-slate-400">
              No active projects or collaboration requests yet. Launch a project post to start building a team!
            </div>
          ) : (
            userProjects.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onLike={onLike}
                onBookmark={onBookmark}
                onOpenReply={onOpenReply}
                onOpenRespond={onOpenRespond}
                onOpenReport={onOpenReport}
              />
            ))
          )
        )}

        {activeTab === 'bookmarks' && (
          bookmarkedPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onLike={onLike}
              onBookmark={onBookmark}
              onOpenReply={onOpenReply}
              onOpenRespond={onOpenRespond}
              onOpenReport={onOpenReport}
            />
          ))
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#0E1626] text-slate-100 border border-[#1E2E50] rounded-2xl shadow-2xl p-5 sm:p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A2640]">
              <h3 className="font-bold text-slate-100 text-base">Edit Profile Information</h3>
              <button
                onClick={() => setIsEditOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-4 space-y-4 text-xs sm:text-sm">
              {/* Photo Upload Zone in Edit Modal */}
              <div className="p-3.5 rounded-xl bg-[#0B1120] border border-[#1E2E50]">
                <PhotoUpload
                  currentPhotoUrl={editAvatarUrl || profile?.avatarUrl}
                  onPhotoSelected={(photo) => setEditAvatarUrl(photo)}
                  onRemovePhoto={() => setEditAvatarUrl('')}
                  label="Profile Photo (Upload from device)"
                  size="sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Display Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full bg-[#0B1120] border border-[#1E2E50] rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-400 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Biography</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                  className="w-full bg-[#0B1120] border border-[#1E2E50] rounded-xl p-3 text-slate-100 focus:outline-none focus:border-sky-400 text-xs sm:text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Country</label>
                  <select
                    value={editCountry}
                    onChange={e => setEditCountry(e.target.value)}
                    className="w-full bg-[#0B1120] border border-[#1E2E50] rounded-xl px-3 py-2 text-slate-100 text-xs"
                  >
                    {AFRICAN_COUNTRIES.map(c => (
                      <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">City or County</label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={e => setEditCity(e.target.value)}
                    className="w-full bg-[#0B1120] border border-[#1E2E50] rounded-xl px-3 py-2 text-slate-100 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Skills (Comma separated)</label>
                <input
                  type="text"
                  value={editSkills}
                  onChange={e => setEditSkills(e.target.value)}
                  placeholder="TypeScript, Agronomy, Solar Engineering"
                  className="w-full bg-[#0B1120] border border-[#1E2E50] rounded-xl px-3 py-2 text-slate-100 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-sky-500 text-white hover:brightness-110 shadow-md shadow-sky-900/30 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
