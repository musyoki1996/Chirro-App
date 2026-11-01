import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  MessageSquare, 
  HelpCircle, 
  BarChart2, 
  Calendar, 
  Layers, 
  Briefcase, 
  HeartHandshake,
  MapPin,
  Tag,
  Plus,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Post, PostType, PollOption } from '../../types';
import { INITIAL_CIRCLES } from '../../data/seedData';
import { APP_ASSETS } from '../../constants/assets';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (postData: Partial<Post>) => Promise<void> | void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onPublish,
}) => {
  const { profile, user } = useAuth();
  const { t } = useLanguage();

  const [postType, setPostType] = useState<PostType>('discussion');
  const [content, setContent] = useState('');
  const [selectedCircleId, setSelectedCircleId] = useState('');
  const [location, setLocation] = useState(profile?.city ? `${profile.city}, ${profile.country || 'Kenya'}` : 'Nairobi, Kenya');
  const [tagsInput, setTagsInput] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');

  // Structured Action Layer fields
  const [opportunityTitle, setOpportunityTitle] = useState('');
  const [opportunityCategory, setOpportunityCategory] = useState('Tech & Software');
  const [opportunityDeadline, setOpportunityDeadline] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');

  // Poll options
  const [pollOptions, setPollOptions] = useState<string[]>(['Option 1', 'Option 2']);

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddPollOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions([...pollOptions, `Option ${pollOptions.length + 1}`]);
    }
  };

  const handleRemovePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const handlePollChange = (index: number, val: string) => {
    const updated = [...pollOptions];
    updated[index] = val;
    setPollOptions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    const tags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const circle = INITIAL_CIRCLES.find(c => c.id === selectedCircleId);

    const newPostData: Partial<Post> = {
      postType,
      content,
      tags: tags.length ? tags : ['Chirro'],
      circleId: circle?.id,
      circleName: circle?.name,
      location: location.trim() || undefined,
      mediaUrl: mediaUrl.trim() || undefined,
      opportunityTitle: opportunityTitle.trim() || undefined,
      opportunityCategory: postType === 'opportunity' || postType === 'project' ? opportunityCategory : undefined,
      opportunityDeadline: opportunityDeadline || undefined,
      opportunityStatus: 'open',
      eventDate: postType === 'event' ? eventDate : undefined,
      eventLocation: postType === 'event' ? eventLocation : undefined,
      pollOptions:
        postType === 'poll'
          ? pollOptions.map((text, i) => ({
              id: `opt-${i + 1}`,
              text: text.trim() || `Option ${i + 1}`,
              votes: 0,
            }))
          : undefined,
    };

    try {
      await onPublish(newPostData);
      setContent('');
      setTagsInput('');
      setOpportunityTitle('');
      setMediaUrl('');
      onClose();
    } catch (err) {
      console.error('Failed to create post:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const postTypesList: { type: PostType; label: string; icon: any; color: string }[] = [
    { type: 'discussion', label: 'Discussion', icon: MessageSquare, color: 'text-sky-400' },
    { type: 'question', label: 'Question', icon: HelpCircle, color: 'text-cyan-300' },
    { type: 'poll', label: 'Poll', icon: BarChart2, color: 'text-amber-400' },
    { type: 'project', label: 'Project', icon: Layers, color: 'text-sky-400' },
    { type: 'opportunity', label: 'Opportunity', icon: Briefcase, color: 'text-blue-400' },
    { type: 'event', label: 'Event', icon: Calendar, color: 'text-violet-400' },
    { type: 'community_request', label: 'Request', icon: HeartHandshake, color: 'text-rose-400' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-[#0E1626] text-slate-100 border border-[#1E2E50] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#1A2640] flex items-center justify-between bg-[#111A2E]">
          <div className="flex items-center space-x-2.5">
            <img src={APP_ASSETS.CHIRP_ICON} alt="" className="w-5 h-5 object-contain brightness-110" />
            <h3 className="font-bold text-white text-base">
              New Chirp • Action Layer
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#15223C] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Post Type Selector Tabs */}
        <div className="px-4 py-2.5 bg-[#0B1120] border-b border-[#1A2640] flex items-center space-x-1.5 overflow-x-auto text-xs">
          {postTypesList.map(item => {
            const Icon = item.icon;
            const isSelected = postType === item.type;
            return (
              <button
                key={item.type}
                type="button"
                onClick={() => setPostType(item.type)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#15223C]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm">
          
          {/* User Preview */}
          <div className="flex items-center space-x-3 pb-1">
            <img
              src={profile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={profile?.displayName || 'User'}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-sky-400/40"
            />
            <div>
              <p className="font-bold text-white text-sm">{profile?.displayName || 'Explorer'}</p>
              <p className="text-xs text-slate-400">Posting as @{profile?.username || 'user'}</p>
            </div>
          </div>

          {/* Action Layer Specific Fields */}
          {(postType === 'project' || postType === 'opportunity' || postType === 'community_request') && (
            <div className="p-3.5 rounded-xl bg-[#131E35] border border-sky-500/30 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 flex items-center space-x-1">
                <Layers className="w-3.5 h-3.5" />
                <span>Structured Opportunity Fields</span>
              </span>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Title / Headline *
                </label>
                <input
                  type="text"
                  required
                  value={opportunityTitle}
                  onChange={e => setOpportunityTitle(e.target.value)}
                  placeholder="e.g. Kenya Solar Irrigation Telemetry - Hardware Engineers Needed"
                  className="w-full bg-[#0B1120] border border-[#1E2E50] rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400 text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={opportunityCategory}
                    onChange={e => setOpportunityCategory(e.target.value)}
                    className="w-full bg-[#0B1120] border border-[#1E2E50] rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-400 text-xs"
                  >
                    <option value="Tech & Software">Tech & Software</option>
                    <option value="AgTech & Food Systems">AgTech & Food Systems</option>
                    <option value="Creative & Media">Creative & Media</option>
                    <option value="Clean Energy">Clean Energy</option>
                    <option value="Business & Funding">Business & Funding</option>
                    <option value="Civic Action">Civic Action</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Application / Action Deadline
                  </label>
                  <input
                    type="date"
                    value={opportunityDeadline}
                    onChange={e => setOpportunityDeadline(e.target.value)}
                    className="w-full bg-[#0B1120] border border-[#1E2E50] rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-400 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Event Fields */}
          {postType === 'event' && (
            <div className="p-3.5 rounded-xl bg-[#15233E] border border-sky-800/40 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Event Logistics</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Date & Time *</label>
                  <input
                    type="text"
                    required
                    value={eventDate}
                    onChange={e => setEventDate(e.target.value)}
                    placeholder="e.g. Saturday, Nov 21 • 14:00 EAT"
                    className="w-full bg-[#0B1120] border border-[#1E2E50] rounded-lg px-3 py-2 text-slate-100 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Location or Link</label>
                  <input
                    type="text"
                    value={eventLocation}
                    onChange={e => setEventLocation(e.target.value)}
                    placeholder="e.g. Nairobi Garage / Google Meet"
                    className="w-full bg-[#0B1120] border border-[#1E2E50] rounded-lg px-3 py-2 text-slate-100 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Poll Fields */}
          {postType === 'poll' && (
            <div className="p-3.5 rounded-xl bg-[#142036] border border-amber-500/30 space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1">
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Poll Choices</span>
              </span>

              {pollOptions.map((opt, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={opt}
                    onChange={e => handlePollChange(i, e.target.value)}
                    placeholder={`Option ${i + 1}`}
                    className="flex-1 bg-[#0B1120] border border-[#1E2E50] rounded-lg px-3 py-1.5 text-slate-100 text-xs"
                  />
                  {pollOptions.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePollOption(i)}
                      className="text-slate-400 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}

              {pollOptions.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddPollOption}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1 mt-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add another option</span>
                </button>
              )}
            </div>
          )}

          {/* Main Text Content */}
          <div>
            <textarea
              required
              rows={4}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="What are you building, discovering, or organizing? Share context, challenges, and goals..."
              className="w-full bg-[#0B1120] border border-[#1E2E50] rounded-xl p-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400 text-sm resize-none"
            />
          </div>

          {/* Circle Assignment & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Post to Circle (Optional)
              </label>
              <select
                value={selectedCircleId}
                onChange={e => setSelectedCircleId(e.target.value)}
                className="w-full bg-[#0B1120] border border-[#1E2E50] rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-400 text-xs"
              >
                <option value="">Public General Feed</option>
                {INITIAL_CIRCLES.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Location Focus
              </label>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="Nairobi, Lagos, Kigali..."
                  className="w-full bg-[#0B1120] border border-[#1E2E50] rounded-lg pl-8 pr-3 py-2 text-slate-100 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Topic Tags (Comma separated)
            </label>
            <div className="relative">
              <Tag className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="CleanTech, Kenya, Python, Solar"
                className="w-full bg-[#0B1120] border border-[#1E2E50] rounded-lg pl-8 pr-3 py-2 text-slate-100 text-xs"
              />
            </div>
          </div>

          {/* Image URL (Optional) */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Image / Media Link (Optional)
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="url"
                value={mediaUrl}
                onChange={e => setMediaUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-[#0B1120] border border-[#1E2E50] rounded-lg pl-8 pr-3 py-2 text-slate-100 text-xs"
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-[#1A2640] flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Visible on Africa constellation feed
            </span>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-[#15223C] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-sky-500 text-white hover:brightness-110 shadow-md shadow-sky-500/25 disabled:opacity-50 transition-all flex items-center space-x-1.5"
              >
                {isSubmitting ? (
                  <span>Chirping...</span>
                ) : (
                  <>
                    <img src={APP_ASSETS.CHIRP_ICON} alt="" className="w-3.5 h-3.5 object-contain brightness-110" />
                    <span>Chirp</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
