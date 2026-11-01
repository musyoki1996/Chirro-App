import React, { useState } from 'react';
import { 
  Activity, 
  MapPin, 
  TrendingUp, 
  Sparkles, 
  Filter, 
  Layers, 
  Flame, 
  Globe2, 
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { Post, PostType } from '../../types';
import { PostCard } from '../Feed/PostCard';
import { useLanguage } from '../../context/LanguageContext';

interface PulseViewProps {
  posts: Post[];
  onLike: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onOpenReply: (post: Post) => void;
  onOpenRespond: (post: Post) => void;
  onOpenReport: (post: Post) => void;
  onVotePoll?: (postId: string, optionId: string) => void;
}

export const PulseView: React.FC<PulseViewProps> = ({
  posts,
  onLike,
  onBookmark,
  onOpenReply,
  onOpenRespond,
  onOpenReport,
  onVotePoll,
}) => {
  const { t } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState('all');

  const trendingTopics = [
    { tag: 'SiliconSavannah', count: '1.4k actions', change: '+24%' },
    { tag: 'LoRaWANBorehole', count: '890 actions', change: '+42%' },
    { tag: 'AfCFTA', count: '650 actions', change: '+18%' },
    { tag: 'SolarIrrigation', count: '512 actions', change: '+31%' },
    { tag: 'AfroDesign', count: '480 actions', change: '+12%' },
    { tag: 'MaternalCare', count: '390 actions', change: '+15%' },
  ];

  const regions = [
    { id: 'all', label: 'All Africa & Global' },
    { id: 'kenya', label: 'Kenya (Nairobi / Mombasa / Kajiado)' },
    { id: 'nigeria', label: 'Nigeria (Lagos / Abuja)' },
    { id: 'rwanda', label: 'Rwanda (Kigali)' },
    { id: 'ghana', label: 'Ghana (Accra)' },
    { id: 'south_africa', label: 'South Africa (Cape Town)' },
  ];

  const filteredPosts = posts.filter(post => {
    if (selectedRegion === 'kenya' && !post.location?.toLowerCase().includes('kenya') && !post.location?.toLowerCase().includes('nairobi') && !post.location?.toLowerCase().includes('kajiado')) {
      return false;
    }
    if (selectedRegion === 'nigeria' && !post.location?.toLowerCase().includes('nigeria') && !post.location?.toLowerCase().includes('lagos')) {
      return false;
    }
    if (selectedRegion === 'rwanda' && !post.location?.toLowerCase().includes('rwanda') && !post.location?.toLowerCase().includes('kigali')) {
      return false;
    }
    if (selectedRegion === 'ghana' && !post.location?.toLowerCase().includes('ghana') && !post.location?.toLowerCase().includes('accra')) {
      return false;
    }
    if (selectedRegion === 'south_africa' && !post.location?.toLowerCase().includes('cape town') && !post.location?.toLowerCase().includes('south africa')) {
      return false;
    }

    if (selectedTopic !== 'all') {
      const matchTag = post.tags?.some(tag => tag.toLowerCase() === selectedTopic.toLowerCase());
      if (!matchTag) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Pulse Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0B1120] via-[#111E38] to-[#0B1120] border border-sky-500/30 shadow-xl shadow-black/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-sky-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center space-x-2 text-sky-400 font-bold text-xs uppercase tracking-wider">
            <Activity className="w-4 h-4 text-sky-400" />
            <span>Chirro World News & Discovery Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {t('pulseTitle')}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
            {t('pulseSub')} Explore real-time innovations, civic initiatives, and cross-border collaborations.
          </p>
        </div>
      </div>

      {/* Trending Horizontal Marquee / Cards */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <TrendingUp className="w-4 h-4 text-sky-400" />
          <h3 className="font-bold text-white text-sm">Emerging Regional Themes</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {trendingTopics.map(item => (
            <button
              key={item.tag}
              onClick={() => setSelectedTopic(selectedTopic === item.tag ? 'all' : item.tag)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedTopic === item.tag
                  ? 'bg-sky-500/20 border-sky-400 shadow-md shadow-sky-950/40 text-sky-200'
                  : 'bg-[#111A2E] border-[#1C2C4E] hover:border-sky-500/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-sky-400 font-mono">#{item.tag}</span>
                <span className="text-[10px] text-emerald-400 font-bold">{item.change}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{item.count}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Region Selector Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 flex items-center space-x-1 pl-1">
          <MapPin className="w-3.5 h-3.5 text-sky-400" />
          <span className="font-semibold">Region:</span>
        </span>
        {regions.map(r => (
          <button
            key={r.id}
            onClick={() => setSelectedRegion(r.id)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all ${
              selectedRegion === r.id
                ? 'bg-gradient-to-r from-sky-400 via-blue-500 to-sky-500 text-white font-bold shadow-md shadow-sky-500/25'
                : 'bg-[#111A2E] border border-[#1C2C4E] text-slate-300 hover:text-white hover:border-sky-500/40'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Selected Filter indicator if active */}
      {(selectedTopic !== 'all' || selectedRegion !== 'all') && (
        <div className="flex items-center justify-between p-2.5 bg-[#111A2E] rounded-xl border border-[#1C2C4E] text-xs">
          <span className="text-slate-300">
            Filtering by: {selectedTopic !== 'all' && <strong className="text-sky-400">#{selectedTopic} </strong>}
            {selectedRegion !== 'all' && <span>in <strong className="text-sky-400">{selectedRegion}</strong></span>}
          </span>
          <button
            onClick={() => {
              setSelectedTopic('all');
              setSelectedRegion('all');
            }}
            className="text-sky-400 hover:underline font-semibold"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Feed for Pulse */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#111A2E]/50 border border-dashed border-[#1C2C4E] space-y-2">
            <Compass className="w-10 h-10 text-slate-500 mx-auto" />
            <h4 className="font-bold text-white text-base">No discussions match this filter</h4>
            <p className="text-slate-400 text-xs max-w-sm mx-auto">
              Try switching your region to "All Africa & Global" or selecting a different topic.
            </p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onLike={onLike}
              onBookmark={onBookmark}
              onOpenReply={onOpenReply}
              onOpenRespond={onOpenRespond}
              onOpenReport={onOpenReport}
              onVotePoll={onVotePoll}
            />
          ))
        )}
      </div>

    </div>
  );
};
