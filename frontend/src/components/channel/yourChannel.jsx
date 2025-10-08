import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getChannel } from "@/api/channel.api";
import { Spinner } from "../ui/shadcn-io/spinner";
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
  Edit3,
  Globe,
  Verified,
  TrendingUp,
  ThumbsUp,
  MessageCircle,
  Bookmark,
  Instagram,
  Mail,
} from "lucide-react";
import VideoCard from "./VideoCard";
import SubscribeButton from "../subscriber";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const YourChannel = () => {
  const { username } = useParams();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("videos");
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(window.location.href)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      window.location.href
    )}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      window.location.href
    )}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      window.location.href
    )}`,
    email: `mailto:?subject=Check this out&body=${encodeURIComponent(
      window.location.href
    )}`,
  };

  const icons = {
    whatsapp: <MessageCircle size={18} />,
    facebook: <Facebook size={18} />,
    twitter: <Twitter size={18} />,
    linkedin: <Linkedin size={18} />,
    email: <Mail size={18} />,
  };

  const handleShare = () => {
    if (navigator.share && /Mobi|Android|iPhone/i.test(navigator.userAgent)) {
      navigator
        .share({
          title: channel?.user?.username || "Check this channel",
          url: window.location.href,
        })
        .catch(() => setShowShare(true));
    } else {
      setShowShare(true);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Link copied to clipboard!");
  };

  useEffect(() => {
    const loadChannel = async () => {
      if (!username) {
        setError("Username is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const response = await getChannel(username);

        if (response?.data?.success) {
          setChannel(response.data.data || { user: {}, videos: [] });
        } else {
          setError(response?.data?.message || "Failed to load channel.");
        }
      } catch (err) {
        console.error("Failed to fetch channel:", err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load channel. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadChannel();
  }, [username]);

  const defaultAvatar = "/default/defaultAvatar.png";
  const defaultCover = "/default/defaultCover.jpg";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#1A1A1A] flex justify-center items-center">
        <Spinner variant="default" className="text-white" size={24} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#1A1A1A] flex items-center justify-center p-4">
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 max-w-md">
          <p className="text-red-400 text-center font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#1A1A1A] flex items-center justify-center">
        <p className="text-gray-400 text-center">Channel not found.</p>
      </div>
    );
  }

  const user = channel?.user || {};
  const videos = Array.isArray(channel?.videos) ? channel.videos : [];

  const stats = [
    {
      icon: Users,
      label: "Subscribers",
      value: (user?.subscribersCount || 0).toLocaleString(),
      color: "text-red-500",
    },
    {
      icon: Video,
      label: "Videos",
      value: videos.length.toString(),
      color: "text-blue-500",
    },
    {
      icon: Eye,
      label: "Total Views",
      value: (user?.totalViews || 0).toLocaleString(),
      color: "text-green-500",
    },
    {
      icon: TrendingUp,
      label: "Growth",
      value: user?.growth || "+0%",
      color: "text-purple-500",
    },
  ];

  const socialLinks = [
    { platform: "website", icon: Globe, url: user?.social?.url },
    { platform: "github", icon: User, url: user?.social?.github },
    { platform: "instagram", icon: Instagram, url: user?.social?.instagram },
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

  return (
    <div className=" z-20 min-h-screen bg-gradient-to-br  from-[#0A0A0A] via-[#0F0F0F] to-[#1A1A1A] text-white overflow-hidden">
      {/* Cover & Profile Section */}
      <div className="w-full max-w-6xl mx-auto rounded-2xl overflow-hidden mt-10 p-2">
        <div className="w-full relative h-[160px] sm:h-auto rounded-2xl overflow-hidden">
          <img
            src={user?.coverImage || defaultCover}
            alt="cover"
            className="w-full h-full object-cover object-center transition-all duration-300 rounded-2xl"
          />

          <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">
            {/* Avatar */}
            <div className="relative group -mt-20 sm:-mt-24 flex-shrink-0">
              <img
                src={user?.avatar || defaultAvatar}
                alt="Channel Avatar"
                className="w-28 h-28 lg:w-36 lg:h-36 rounded-full object-cover border-4 border-[#181818] shadow-lg"
                onError={(e) => {
                  e.target.src = defaultAvatar;
                }}
              />
            </div>
            {/* Info */}
            <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left w-full space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl lg:text-4xl font-bold">
                    {user?.fullname || user?.username || "Guest Channel"}
                  </h1>
                  {user?.isVerified && (
                    <Verified
                      className="w-6 h-6 text-blue-500"
                      fill="currentColor"
                    />
                  )}
                </div>
                {user?.username && (
                  <h2 className="text-lg text-gray-400 mb-1">
                    @{user.username}
                  </h2>
                )}
              </div>
              {/* Buttons */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                {/* subscibe btn  */}

                <SubscribeButton channelId={user?._id} />
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer bg-white/10 hover:bg-white/20  transition-colors"
                  aria-label="Share"
                >
                  <Share2 size={20} />
                  <span className="font-medium">Share</span>
                </button>

                {/* share */}

                {showShare && (
                  <AnimatePresence>
                    <motion.div
                      key="overlay"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => setShowShare(false)}
                      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    >
                      <motion.div
                        key="modal"
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#212121] rounded-xl shadow-2xl p-6 max-w-md w-full mx-4"
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-xl font-semibold text-white">
                            Share
                          </h2>
                          <button
                            onClick={() => setShowShare(false)}
                            className="text-gray-400 hover:text-white cursor-pointer  transition-colors"
                          >
                            <X size={20} className="font-bold" />
                          </button>
                        </div>

                        {/* URL Input with Copy */}
                        <div className="flex items-center gap-2 mb-6 bg-[#3d3d3d] rounded-lg p-1">
                          <input
                            type="text"
                            value={window.location.href}
                            readOnly
                            className="flex-1 bg-transparent text-gray-300 px-3 py-2 outline-none text-sm"
                          />
                          <button
                            onClick={handleCopy}
                            className={`px-4 py-2 rounded-lg text-white font-medium text-sm cursor-pointer transition-colors ${
                              copied
                                ? "bg-[#0F0F0F] hover:bg-[#0F0F0F]"
                                : "bg-red-600 hover:bg-red-600/70"
                            }`}
                          >
                            {copied ? "Copied!" : "Copy"}
                          </button>
                        </div>

                        {/* Social Share Options */}
                        <div className="flex flex-wrap gap-3">
                          {Object.keys(shareLinks).map((platform) => (
                            <a
                              key={platform}
                              href={shareLinks[platform]}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <button className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-[#3d3d3d] hover:bg-[#4d4d4d] rounded-lg text-white text-sm transition-colors">
                                {icons[platform]}
                                {platform}
                              </button>
                            </a>
                          ))}
                        </div>
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="relative px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto mt-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                  <div className="text-xs text-gray-400 uppercase">
                    {stat.label}
                  </div>
                </div>
                <div className="text-2xl lg:text-3xl font-bold">
                  {stat.value}
                </div>
              </div>
            );
          })}
        </div>

        {/* About */}
        <div className="bg-white/5 rounded-3xl p-8 mb-8">
          <h3 className="text-2xl font-bold flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-red-500" /> About This Channel
          </h3>
          <h2 className="text-xl font-bold mb-4">
            Welcome to {user?.username || "this"}'s Channel
          </h2>
          <p className="text-gray-300 mb-6">
            {user?.bio || "No description yet."}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              {user?.createdAt && (
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <span>
                    Joined{" "}
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((s) => {
                const Icon = s.icon;
                if (!s.url) return null;
                return (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300"
                  >
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
          <nav className="flex space-x-1 bg-white/5 rounded-2xl p-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-red-600 text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/10"
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
            <h2 className="text-2xl font-bold mb-6">
              Videos ({videos.length})
            </h2>
            {videos.length === 0 ? (
              <div className="py-16 text-center">
                <div className="bg-white/5 rounded-3xl p-12 max-w-2xl mx-auto">
                  <Video className="w-16 h-16 mx-auto mb-6 text-gray-400" />
                  <h3 className="text-2xl font-bold mb-4">No Videos Yet</h3>
                  <p className="text-gray-400 text-lg">
                    This channel hasn't uploaded any videos.
                  </p>
                </div>
              </div>
            ) : (
              <div
                className="
    grid
    gap-6
    sm:grid-cols-2
    md:grid-cols-3
    lg:grid-cols-4
    xl:grid-cols-5
    2xl:grid-cols-4
    px-4
    py-6
  "
              >
                {videos.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="py-16 text-center pb-12">
            <div className="bg-white/5 rounded-3xl p-12 max-w-2xl mx-auto">
              <Video className="w-16 h-16 mx-auto mb-6 text-gray-400" />
              <h3 className="text-2xl font-bold mb-4">Coming Soon</h3>
              <p className="text-gray-400 text-lg">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} content
                will be available soon.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YourChannel;
