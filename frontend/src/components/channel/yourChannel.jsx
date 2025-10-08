import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  User,
  Facebook,
  Twitter,
  Linkedin,
  MapPin,
  Calendar,
  Users,
  Video,
  Eye,
  Play,
  Heart,
  Share2,
  Bell,
  Settings,
  Edit3,
  Globe,
  Verified,
  TrendingUp,
  ThumbsUp,
  MessageCircle,
  Bookmark,
  Instagram,
} from "lucide-react";
import { useParams } from "react-router-dom";
const YourChannel = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("videos");
  const [isSubscribed, setIsSubscribed] = useState(false);


  const { username } = useParams(); 


  const defaultCover =
    "https://static.vecteezy.com/system/resources/thumbnails/011/565/075/small/abstract-golden-circles-glow-lights-bokeh-effect-blurred-white-and-grey-background-luxury-style-christmas-winter-festive-backdrop-vector.jpg";
  const defaultAvatar =
    "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";

  const stats = [
    { icon: Users, label: "Subscribers", value: user?.subscribers || "0", color: "text-red-500" },
    { icon: Video, label: "Videos", value: user?.videos || "0", color: "text-blue-500" },
    { icon: Eye, label: "Total Views", value: user?.views || "0", color: "text-green-500" },
    { icon: TrendingUp, label: "Growth", value: user?.growth || "+0%", color: "text-purple-500" },
  ];

  const socialLinks = [
    { platform: "website", icon: Globe, url: user?.social?.url },
    { platform: "github", icon: User, url: user?.social?.github }, // ✅ fixed
    { platform: "instagram", icon: Instagram, url: user?.social?.instagram }, // ✅ fixed
    { platform: "twitter", icon: Twitter, url: user?.social?.twitter },
    { platform: "linkedin", icon: Linkedin, url: user?.social?.linkedin },
    { platform: "facebook", icon: Facebook, url: user?.social?.facebook },
  ];

  const tabs = [
    { id: "videos", label: "Videos", icon: Video },
    { id: "playlists", label: "Playlists", icon: Bookmark },
    { id: "community", label: "Community", icon: MessageCircle },
    { id: "about", label: "About", icon: User },
  ];

  const VideoCard = ({ video, index }) => (
    <div className={`group cursor-pointer transition-all duration-300 hover:scale-105 ${index === 0 ? "transform hover:scale-110" : ""}`}>
      <div className="relative overflow-hidden rounded-xl bg-[#1A1A1A]">
        <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {video.duration}
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
            <Play className="w-8 h-8 text-white" fill="currentColor" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white group-hover:text-red-400 transition-colors duration-200 line-clamp-2 mb-2">{video.title}</h3>
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>{video.views} views</span>
          <div className="flex items-center gap-2">
            <ThumbsUp className="w-4 h-4" />
            <span>{video.likes || "0"}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#1A1A1A] text-white overflow-hidden">
      {/* Cover & Profile Section */}
      <div className="w-full max-w-6xl mx-auto rounded-2xl overflow-hidden">
        <div className="relative h-48 md:h-56 lg:h-64">
          <img src={user?.coverImage || defaultCover} alt="Channel Cover" className="w-full h-full object-cover" />
        </div>
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">
            {/* Avatar */}
            <div className="relative group -mt-20 sm:-mt-24 flex-shrink-0">
              <img src={user?.avatar || defaultAvatar} alt="Channel Avatar" className="w-28 h-28 lg:w-36 lg:h-36 rounded-full object-cover border-4 border-[#181818] shadow-lg" />
              <button className="absolute bottom-2 right-2 bg-red-600 hover:bg-red-700 p-2 rounded-full transition-all duration-200 transform hover:scale-110">
                <Edit3 className="w-4 h-4 text-white" />
              </button>
            </div>
            {/* Info */}
            <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left w-full space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl lg:text-4xl font-bold">{user?.username || "Guest Channel"}</h1>
                  {user?.isVerified && <Verified className="w-6 h-6 text-blue-500" fill="currentColor" />}
                </div>
                {user?.fullname && <h2 className="text-lg text-gray-200 mb-1">{user.fullname}</h2>}
                <p className="text-gray-400">{user?.email}</p>
              </div>
              {/* Buttons */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                <button
                  onClick={() => setIsSubscribed(!isSubscribed)}
                  className={`px-8 py-3 rounded-full font-semibold flex items-center gap-2 transition-all duration-300 ${
                    isSubscribed ? "bg-gray-600 hover:bg-gray-700" : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  {isSubscribed ? "Subscribed" : "Subscribe"}
                </button>
                <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 px-6 py-3 rounded-full font-semibold flex items-center gap-2">
                  <Heart className="w-5 h-5" /> Join
                </button>
                <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 p-3 rounded-full">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="relative px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                  <div className="text-xs text-gray-400 uppercase">{stat.label}</div>
                </div>
                <div className="text-2xl lg:text-3xl font-bold">{stat.value}</div>
              </div>
            );
          })}
        </div>

        {/* About */}
        <div className="bg-white/5 rounded-3xl p-8 mb-8">
          <h3 className="text-2xl font-bold flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-red-500" /> About This Channel
          </h3>
             <h1 className="text-3xl font-bold">Welcome to {username}’s Channel</h1>
          <p className="text-gray-300 mb-6">{user?.bio || "No description yet."}</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              {user?.joinDate && (
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <span>Joined {user.joinDate}</span>
                </div>
              )}
              {user?.location && (
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="w-5 h-5 text-green-400" />
                  <span>{user.location}</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((s) => {
                const Icon = s.icon;
                if (!s.url) return null;
                return (
                  <a key={s.platform} href={s.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300">
                    <Icon className="w-5 h-5" />
                    <span className="text-sm capitalize">{s.platform}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-white/5 rounded-2xl p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold ${
                    activeTab === tab.id ? "bg-red-600 text-white" : "text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        {activeTab === "videos" ? (
          <div className="pb-12">
            <h2 className="text-2xl font-bold mb-6">Recent Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {user?.recentVideos && user.recentVideos.length > 0 ? (
                user.recentVideos.map((video, i) => <VideoCard key={i} video={video} index={i} />)
              ) : (
                <p>No videos yet.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="bg-white/5 rounded-3xl p-12 max-w-2xl mx-auto">
              <Video className="w-16 h-16 mx-auto mb-6 text-gray-400" />
              <h3 className="text-2xl font-bold mb-4">Coming Soon</h3>
              <p className="text-gray-400 text-lg">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} content will be available soon.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YourChannel;
