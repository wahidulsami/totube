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
  Pen,
  
} from "lucide-react";
import VideoCard from "./VideoCard";
import SubscribeButton from "../subscriber";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const YourChannel = () => {
  const { username } = useParams();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("videos");
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  const { user: currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();


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
    { id: "tweet", label: "Tweet", icon: MessageCircle },
  
  ];

  return (
    <div className=" z-20 min-h-screen bg-gradient-to-br  from-[#0A0A0A] via-[#0F0F0F] to-[#1A1A1A] text-white overflow-hidden">
      {/* Cover & Profile Section */}
      <div className="w-full max-w-6xl mx-auto rounded-3xl overflow-hidden mt-10 p-2">
        <div className="w-full relative h-[160px] sm:h-auto rounded-3xl overflow-hidden">
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
                  <h1 className="text-3xl lg:text-4xl mx-auto sm:mx-0 font-bold">
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
   <div className="flex flex-col items-center sm:items-start gap-1">
  <h2 className="text-lg text-gray-400 font-medium">@{user.username}</h2>
  <p className="flex items-center text-sm text-gray-300 font-semibold">
    <Users className="w-4 h-4 mr-1" />
    {(user?.subscribersCount || 0).toLocaleString()} subscribers
  </p>
</div>



  

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



              {currentUser?._id === user?._id && (
  <button
    className="flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer bg-white/10 hover:bg-white/20 transition-colors"
    onClick={() => navigate("/dashboard/profile")}
  >
    <Pen size={18} />
    <span className="font-medium">Edit</span>
  </button>
)}


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
       

        {/* About */}
<div className="bg-gradient-to-br from-white/5 to-white/[0.02]
 backdrop-blur-sm rounded-3xl p-6 sm:p-8 mb-8 border border-white/10 shadow-xl">
  {/* Header */}
  <div className="flex items-center gap-3 mb-6">
    <div className="p-2 bg-red-500/10 rounded-xl flex-shrink-0">
      <User className="w-6 h-6 text-red-500" />
    </div>
    <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
      About This Channel
    </h3>
  </div>

  {/* Welcome & Bio */}
  <div className="mb-8">
    <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
      Welcome to {user?.username || "this"}'s Channel
    </h2>
    <p className="text-gray-300 mb-6 leading-relaxed text-sm sm:text-base break-words max-h-40 overflow-auto">
      {user?.bio || "No description yet."}
    </p>
  </div>

  {/* Grid: Channel Info & Social Links */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
    {/* Channel Info */}
    <div className="space-y-4 flex flex-col">
      {user?.createdAt && (
        <div className="flex items-center gap-3 text-gray-300 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-blue-400/30 transition-all duration-300 w-full">
          <div className="p-2 bg-blue-400/10 rounded-lg flex-shrink-0">
            <Calendar className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Member Since</p>
            <span className="text-white font-medium">
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      )}
    </div>

    {/* Social Links */}
    <div className="flex flex-col mt-6 lg:mt-0">
      <p className="text-sm text-gray-400 mb-3 font-medium uppercase tracking-wider">
        Connect
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {socialLinks.map((s) => {
          const Icon = s.icon;
          if (!s.url) return null;
          return (
            <a
              key={s.platform}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              <span className="text-sm capitalize text-gray-300 group-hover:text-white transition-colors">
                {s.platform}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  </div>
</div>



        {/* Tabs */}
{/* Tabs */}
<div className="w-full border-b mb-5 border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02]
 backdrop-blur-sm rounded-t-3xl shadow-inner">
  <div className="flex items-center gap-2 sm:gap-6 px-3 sm:px-8 overflow-x-auto scrollbar-hide">
    {tabs.map(({ id, label, icon: Icon }) => (
      <button
        key={id}
        onClick={() => setActiveTab(id)}
        className={`relative flex items-center gap-2 py-4 px-3
           sm:px-4 text-sm sm:text-base font-medium rounded-xl
            transition-all duration-300 ease-in-out cursor-pointer
          ${
            activeTab === id
              ? "text-white "
              : "text-gray-400 hover:text-white/80"
          }`}
      >
        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>{label}</span>

        {/* Red underline animation */}
        <span
          className={`absolute left-1/2 -translate-x-1/2 bottom-1 h-[2px] rounded-full bg-red-500 transition-all duration-300 ease-in-out
            ${activeTab === id ? "w-3/4 opacity-100" : "w-0 opacity-0"}`}
        ></span>
      </button>
    ))}
  </div>
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
