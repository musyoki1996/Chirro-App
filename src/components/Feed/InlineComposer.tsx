import React, { useState } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  HelpCircle, 
  BarChart2, 
  Calendar, 
  Layers, 
  Briefcase, 
  Image as ImageIcon, 
  MapPin, 
  Tag, 
  Send,
  X,
  Plus,
  Trash2
} from 'lucide-react';
import { Post, PostType } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { INITIAL_CIRCLES } from '../../data/seedData';
import { APP_ASSETS } from '../../constants/assets';

interface InlineComposerProps {
  onPublish: (postData: Partial<Post>) => Promise<void> | void;
}

export const InlineComposer: React.FC<InlineComposerProps> = ({ onPublish }) => {
  const { profile, user } = useAuth();
  const { t } = useLanguage();

  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<PostType>('discussion');
  const [selectedCircleId, setSelectedCircleId] = useState('');
  const [location, setLocation] = useState(profile?.city ? `${profile.city}, ${profile.country || 'Kenya'}` : 'Nairobi, Kenya');
  const [mediaUrl, setMediaUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  // Structured fields
  const [opportunityTitle, setOpportunityTitle] = useState('');
  const [opportunityCategory, setOpportunityCategory] = useState('Tech & Software');
  const [opportunityDeadline, setOpportunityDeadline] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['Option 1', 'Option 2']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMediaInput, setShowMediaInput] = useState(false);
  const [showLocationInput, setShowLocationInput] = useState(false);

  const handleAddPollOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions([...pollOptions, `Option ${pollOptions.length + 1}`]);
    }
  };

  const handleRemovePollOption = (idx: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== idx));
    }
  };

  const handlePollChange = (idx: number, val: string) => {
    const updated = [...pollOptions];
    updated[idx] = val;
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
      setOpportunityTitle('');
      setMediaUrl('');
      setTagsInput('');
      setShowMediaInput(false);
      setShowLocationInput(false);
      setIsExpanded(false);
      setPostType('discussion');
    } catch (err) {
      console.error('Error posting:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const postTypes = [
    { type: 'discussion', label: 'Discussion', icon: MessageSquare },
    { type: 'project', label: 'Project', icon: Layers },
    { type: 'opportunity', label: 'Gig / Role', icon: Briefcase },
    { type: 'poll', label: 'Poll', icon: BarChart2 },
    { type: 'event', label: 'Event', icon: Calendar },
    { type: 'question', label: 'Question', icon: HelpCircle },
  ];

  return (
    <div className="bg-[#111A2E] border border-[#1C2C4E] rounded-2xl shadow-sm p-4 transition-all">
      <div className="flex items-start space-x-3">
        {/* User Avatar */}
        <img
          src={profile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
          alt={profile?.displayName || 'User'}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-sky-400/30 flex-shrink-0 mt-0.5"
        />

        {/* Input & Form Area */}
        <div className="flex-1 min-w-0">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            rows={isExpanded ? 3 : 2}
            placeholder="Chirp an idea, ask a question, or launch an Action initiative..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none resize-none leading-relaxed"
          />

          {/* Expanded Action Layer Details */}
          {isExpanded && (
            <div className="space-y-3 pt-2 mt-2 border-t border-[#1A2640] animate-fadeIn text-xs">
              
              {/* Post Type Selector Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
                {postTypes.map(item => {
                  const Icon = item.icon;
                  const isSelected = postType === item.type;
                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setPostType(item.type as PostType)}
                      className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                        isSelected
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
                          : 'bg-[#15223C] text-slate-400 hover:text-slate-200 border border-transparent'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 text-sky-400" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Structured Action Layer Fields (Project / Opportunity) */}
              {(postType === 'project' || postType === 'opportunity') && (
                <div className="p-3 rounded-xl bg-[#131E35] border border-sky-500/30 space-y-2.5">
                  <div className="flex items-center justify-between text-sky-300 font-semibold text-[11px] uppercase tracking-wider">
                    <span>{postType === 'project' ? 'Project Details' : 'Opportunity Specs'}</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={opportunityTitle}
                    onChange={e => setOpportunityTitle(e.target.value)}
                    placeholder={postType === 'project' ? 'Project Title (e.g. Solar Telemetry Gateway)' : 'Role / Gig Title (e.g. Lead Agronomy App Designer)'}
                    className="w-full bg-[#0E1626] border border-[#1E2E50] rounded-lg px-3 py-1.5 text-slate-100 text-xs focus:outline-none focus:border-sky-400"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={opportunityCategory}
                      onChange={e => setOpportunityCategory(e.target.value)}
                      className="bg-[#0E1626] border border-[#1E2E50] rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none"
                    >
                      <option value="Tech & Software">Tech & Software</option>
                      <option value="AgTech & Food Systems">AgTech & Food Systems</option>
                      <option value="Creative & Media">Creative & Media</option>
                      <option value="Clean Energy">Clean Energy</option>
                      <option value="Business & Funding">Business & Funding</option>
                    </select>
                    <input
                      type="date"
                      value={opportunityDeadline}
                      onChange={e => setOpportunityDeadline(e.target.value)}
                      className="bg-[#0E1626] border border-[#1E2E50] rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Event Fields */}
              {postType === 'event' && (
                <div className="p-3 rounded-xl bg-[#15233E] border border-sky-800/40 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-300">
                    Event Logistics
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Date & Time (e.g. Nov 14 • 14:00 EAT)"
                      value={eventDate}
                      onChange={e => setEventDate(e.target.value)}
                      className="bg-[#0E1626] border border-[#1E2E50] rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Venue or Link (e.g. Nairobi Garage)"
                      value={eventLocation}
                      onChange={e => setEventLocation(e.target.value)}
                      className="bg-[#0E1626] border border-[#1E2E50] rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Poll Fields */}
              {postType === 'poll' && (
                <div className="p-3 rounded-xl bg-[#142036] border border-amber-500/30 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                    Poll Choices
                  </span>
                  {pollOptions.map((opt, i) => (
                    <div key={i} className="flex items-center space-x-1.5">
                      <input
                        type="text"
                        value={opt}
                        onChange={e => handlePollChange(i, e.target.value)}
                        placeholder={`Option ${i + 1}`}
                        className="flex-1 bg-[#0E1626] border border-[#1E2E50] rounded-lg px-2.5 py-1.5 text-slate-100 text-xs"
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
                      className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add option</span>
                    </button>
                  )}
                </div>
              )}

              {/* Media URL Box if toggled */}
              {showMediaInput && (
                <div className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={mediaUrl}
                    onChange={e => setMediaUrl(e.target.value)}
                    placeholder="Enter image link (https://...)"
                    className="flex-1 bg-[#0E1626] border border-[#1E2E50] rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-sky-400"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setMediaUrl('');
                      setShowMediaInput(false);
                    }}
                    className="p-1 text-slate-400 hover:text-slate-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Location Input if toggled */}
              {showLocationInput && (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="City, Country (e.g. Nairobi, Kenya)"
                    className="flex-1 bg-[#0E1626] border border-[#1E2E50] rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-sky-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLocationInput(false)}
                    className="p-1 text-slate-400 hover:text-slate-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Circle & Tags Row */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <select
                  value={selectedCircleId}
                  onChange={e => setSelectedCircleId(e.target.value)}
                  className="bg-[#0E1626] border border-[#1E2E50] rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none"
                >
                  <option value="">Public Feed (All Africa)</option>
                  {INITIAL_CIRCLES.map(c => (
                    <option key={c.id} value={c.id}>
                      Circle: {c.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  placeholder="Tags: AgTech, Solar, Kenya"
                  className="bg-[#0E1626] border border-[#1E2E50] rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none"
                />
              </div>

            </div>
          )}

          {/* Bottom Toolbar & Publish Button */}
          <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#1A2640]/70">
            <div className="flex items-center space-x-1 text-slate-400">
              <button
                type="button"
                onClick={() => setShowMediaInput(!showMediaInput)}
                className={`p-1.5 rounded-lg hover:text-sky-400 hover:bg-[#15223C] transition-colors ${
                  mediaUrl ? 'text-sky-400 bg-sky-500/15' : ''
                }`}
                title="Add Image"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowLocationInput(!showLocationInput)}
                className={`p-1.5 rounded-lg hover:text-sky-400 hover:bg-[#15223C] transition-colors ${
                  showLocationInput ? 'text-sky-400 bg-sky-500/15' : ''
                }`}
                title="Add Location"
              >
                <MapPin className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setPostType('poll')}
                className={`p-1.5 rounded-lg hover:text-sky-400 hover:bg-[#15223C] transition-colors ${
                  postType === 'poll' ? 'text-sky-400 bg-sky-500/15' : ''
                }`}
                title="Create Poll"
              >
                <BarChart2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setPostType('project')}
                className={`p-1.5 rounded-lg hover:text-sky-400 hover:bg-[#15223C] transition-colors ${
                  postType === 'project' ? 'text-sky-400 bg-sky-500/15' : ''
                }`}
                title="Launch Project"
              >
                <Layers className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              {isExpanded && (
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1"
                >
                  Collapse
                </button>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !content.trim()}
                className="px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-sky-500 text-white hover:brightness-110 shadow-sm shadow-sky-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center space-x-1.5"
              >
                <img src={APP_ASSETS.CHIRP_ICON} alt="" className="w-3.5 h-3.5 object-contain brightness-110" />
                <span>{isSubmitting ? 'Chirping...' : 'Chirp'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
