import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVideoById, removeVideo } from "../../store/videoReducer";
import { useParams, useNavigate } from "react-router-dom";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  MoreHorizontal,
  Check,
  X,
  Edit3,
  Trash2,
  Bell,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
} from "lucide-react";
import { Spinner } from "../ui/shadcn-io/spinner";
import { toggleVideoLike } from "@/store/likeReducer";
import { motion, AnimatePresence } from "framer-motion";
import { fetchVideos } from "../../store/videoReducer";

import RelatedVideoSkeleton from "../ui/shadcn-io/Skeleton/RelatedVideoSkeleton";
import ActionButtonsSkeleton from "../ui/shadcn-io/Skeleton/ActionButtonsSkeleton";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import SubscribeButton from "../subscriber";

import CommentList from "../comment/CommentList";

export default function VideoDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDescription, setShowDescription] = useState(false);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likeAnim, setLikeAnim] = useState(false);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [buttonsLoading, setButtonsLoading] = useState(true);
  const [isLikeProcessing, setIsLikeProcessing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [guestPopup, setGuestPopup] = useState(false);

  const defaultAvatar = "/default/defaultAvatar.png";
  const { currentVideo, loading, error } = useSelector((state) => state.videos);


  // Fetch video data
  useEffect(() => {
    if (!id) return;
    setInitialLoading(true);
    dispatch(fetchVideoById(id)).finally(() => setInitialLoading(false));
  }, [dispatch, id]);

  // Set initial like state and handle buttons loading
  useEffect(() => {
    if (!currentVideo) {
      setButtonsLoading(true);
      return;
    }

    setLiked(currentVideo.liked || false);
    setLikesCount(currentVideo.likesCount || 0);

    // Simulate buttons loading delay
    const timer = setTimeout(() => setButtonsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [currentVideo]);

  // user
  const { user } = useSelector((state) => state.auth);

  // Fetch related videos
  useEffect(() => {
    if (!id) return;
    let timer;
    const fetchRelated = async () => {
      setRelatedLoading(true);
      try {
        const action = await dispatch(fetchVideos({ page: 1, limit: 10 }));
        if (action.meta.requestStatus === "fulfilled" && action.payload) {
          const filtered = action.payload.filter((v) => v._id !== id);
          setRelatedVideos(filtered);
        }
      } catch (err) {
        console.error("Failed to fetch related videos", err);
        setRelatedVideos([]);
      } finally {
        timer = setTimeout(() => setRelatedLoading(false), 1000);
      }
    };

    fetchRelated();
    return () => clearTimeout(timer);
  }, [id, dispatch]);

  const handleLike = async () => {
    if (!currentVideo?._id) return;

    if (!user) {
      setGuestPopup(true);
      return;
    }

    // start animation immediately
    setLikeAnim(true);
    setIsLikeProcessing(true);

    const prevLiked = liked;
    const prevCount = likesCount;

    const newLiked = !liked;
    const newCount = newLiked ? prevCount + 1 : prevCount - 1;

    setLiked(newLiked);
    setLikesCount(newCount);

    try {
      const res = await dispatch(toggleVideoLike(currentVideo._id));

      if (res.payload?.data) {
        const { liked: backendLiked, likesCount: backendCount } =
          res.payload.data;
        setLiked(backendLiked ?? prevLiked);
        setLikesCount(backendCount ?? prevCount);
      } else {
        setLiked(prevLiked);
        setLikesCount(prevCount);
      }
    } catch (err) {
      console.error(err);
      // rollback on error
      setLiked(prevLiked);
      setLikesCount(prevCount);
    } finally {
      setIsLikeProcessing(false);
      // stop animation
      setTimeout(() => setLikeAnim(false), 300);
    }
  };

  const formatViews = (views) => {
    if (!views || views === 0) return "0 views";
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`;
    return `${views} views`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "1 day ago";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
      return `${Math.floor(diffDays / 365)} years ago`;
    } catch (error) {
      return "Recently";
    }
  };

  const formatDuration = (duration) => {
    if (!duration || duration === 0) return "0:00";
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Loading state
  if (initialLoading || loading) {
    return (
      <div className="flex border border-[#1B1B1B] p-8 bg-[linear-gradient(145deg,_#1B1B1B_0%,_#171717_100%)] shadow-[0_20px_40px_rgba(0,0,0,0.65),_inset_0_1px_0_rgba(255,255,255,0.05)] items-center justify-center h-screen">
        <Spinner variant="default" className="text-red-500" size={25} />
      </div>
    );
  }
  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-2">Something went wrong</p>
          <p className="text-gray-400">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  // Video not found
  if (!currentVideo && !loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg">Video not found</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

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
    const title = currentVideo?.title || "Check this video";

    if (navigator.share && /Mobi|Android|iPhone/i.test(navigator.userAgent)) {
      navigator
        .share({
          title,
          url: window.location.href,
        })
        .catch(() => setShowShare(true));
    } else {
      setShowShare(true);
    }
  };

  // Handle Copy
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Link copied to clipboard!");
  };

  // Handle Download
  const handleDownload = (url, title) => {
    if (!url) {
      toast.error("Video file not available for download.");
      return;
    }

    const a = document.createElement("a");
    a.href = url;
    a.download = title || "video.mp4";
    a.click();

    toast.success("Download started!");
  };

  return (
    <>
      {/* guest user like popup */}
      <AnimatePresence>
        {guestPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-xs"
            onClick={() => setGuestPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#0F0F0F] border border-[#303030] rounded-2xl shadow-2xl 
                   max-w-md w-full mx-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-[#272727] p-6 text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ThumbsUp className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Like this video?
                </h2>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <p className="text-gray-300 text-center leading-relaxed">
                  Sign in to make your opinion count and interact with videos
                  you love.
                </p>

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => {
                      setGuestPopup(false);
                      navigate("/login");
                    }}
                    className="w-full py-3 px-4 cursor-pointer bg-red-600 hover:bg-red-600/
                         text-white font-semibold rounded-lg transition-all duration-200"
                  >
                    Sign In
                  </button>

                  <button
                    onClick={() => setGuestPopup(false)}
                    className="w-full py-3 px-4 bg-[#3A3A3A] hover:bg-[#505050] 
                         text-white font-medium rounded-lg transition-all duration-200"
                  >
                    Maybe Later
                  </button>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-400 pt-2">
                  Don't have an account?{" "}
                  <button
                    onClick={() => {
                      setGuestPopup(false);
                      navigate("/register");
                    }}
                    className="text-[#CC0000] hover:text-[#E50914] font-medium underline"
                  >
                    Sign up now
                  </button>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-[#0f0f0f] text-white">
        <div className="max-w-screen mx-auto sm:px-6 lg:px-12 lg:py-10">
          <div className="flex flex-col xl:flex-row gap-6">
            {/* Main Video Section */}
            <div className="flex-1 w-full max-w-full xl:max-w-[1750px]">
              {/* Video Player */}
              <div className="relative bg-black rounded-none sm:rounded-xl overflow-hidden mb-4 group">
                {currentVideo.videoFile ? (
                  <video
                    src={currentVideo.videoFile}
                    controls
                    className="w-full aspect-video object-cover"
                    poster={currentVideo.thumbnail}
                  />
                ) : (
                  <div className="w-full aspect-video flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <p className="text-gray-400 text-lg">Video not available</p>
                  </div>
                )}
              </div>

              {/* Video Info */}
              <div className="space-y-4 p-2">
                {/* Title */}
                <h1 className="text-xl md:text-2xl font-semibold leading-tight text-white">
                  {currentVideo.title || "Untitled Video"}
                </h1>

                {/* Channel Info & Actions Row */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Channel Info */}

                  <div className="flex items-center gap-3">
                    <Link to={`/${currentVideo.owner?.username}`}>
                      <img
                        src={currentVideo.owner?.avatar || defaultAvatar}
                        alt={currentVideo.owner?.name || "Channel"}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-700"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face";
                        }}
                      />
                    </Link>
                    <div className="flex-1">
                      <Link
                        to={`/channel/${currentVideo.owner?.username}`}
                        className="font-medium text-white hover:text-gray-300 cursor-pointer transition-colors"
                      >
                        {currentVideo.owner?.username || "Unknown Creator"}
                      </Link>

                      <p className="text-sm text-gray-400">
                        {currentVideo.owner?.subscribersCount || "0"}{" "}
                        subscribers
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons with Skeleton Loading */}
                  <AnimatePresence mode="wait">
                    {buttonsLoading ? (
                      <motion.div
                        key="skeleton"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ActionButtonsSkeleton />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="buttons"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-2 flex-wrap"
                      >
                        <button
                          onClick={handleLike}
                          disabled={isLikeProcessing}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all duration-200 disabled:opacity-50 ${
                            liked
                              ? "bg-red-600/70 text-white shadow-[0_0_20px_rgba(220,38,38,0.6)]"
                              : "bg-white/10 text-gray-200 hover:bg-white/20"
                          }`}
                        >
                          <motion.div
                            animate={
                              likeAnim ? { scale: [1, 1.5, 1] } : { scale: 1 }
                            }
                            transition={{ duration: 0.3 }}
                            className="flex items-center"
                          >
                            <ThumbsUp
                              className={`w-5 h-5 ${liked ? "fill-white" : ""}`}
                            />
                          </motion.div>
                          <motion.span
                            key={likesCount}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {likesCount}
                          </motion.span>
                        </button>

                        <button
                          onClick={handleShare}
                          className="flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer bg-white/10 hover:bg-white/20  transition-colors"
                          aria-label="Share"
                        >
                          <Share2 size={20} />
                          <span className="font-medium">Share</span>
                        </button>

                        {/* Download button */}
                        <button
                          onClick={() =>
                            handleDownload(
                              currentVideo?.videoFile,
                              currentVideo?.title
                            )
                          }
                          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        >
                          <Download size={20} />
                          Download
                        </button>

                        <SubscribeButton channelId={currentVideo.owner?._id} />

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
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Video Stats */}
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="font-medium">
                    {formatViews(currentVideo.views)}
                  </span>
                  <span>•</span>
                  <span>{formatDate(currentVideo.createdAt)}</span>
                </div>

                {/* Description */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                    <span className="font-medium">
                      {formatViews(currentVideo.views)}
                    </span>
                    <span>•</span>
                    <span>{formatDate(currentVideo.createdAt)}</span>
                  </div>

                  <div
                    className={`text-sm leading-relaxed ${
                      !showDescription ? "line-clamp-3" : ""
                    }`}
                  >
                    {currentVideo.description ||
                      "No description available for this video."}
                  </div>

                  {currentVideo.description &&
                    currentVideo.description.length > 150 && (
                      <button
                        onClick={() => setShowDescription(!showDescription)}
                        className="text-white/80 hover:text-white cursor-pointer font-medium text-sm mt-3 transition-colors"
                      >
                        {showDescription ? "Show less" : "Show more"}
                      </button>
                    )}
                </div>
                
<div className="mt-6">
  <h3 className="text-lg font-semibold text-white mb-4">Comments</h3>

  <CommentList videoId={id}  />
</div>


              </div>
            </div>

            {/* Sidebar - Related Videos with Skeleton Loading */}
            <div className="xl:w-[400px] xl:min-w-[400px]">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold mb-4 px-1">
                  Related Videos
                </h3>

                <AnimatePresence mode="wait">
                  {relatedLoading ? (
                    <motion.div
                      key="skeleton"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      {[...Array(8)].map((_, index) => (
                        <RelatedVideoSkeleton key={index} />
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="videos"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-2"
                    >
                      {relatedVideos && relatedVideos.length > 0 ? (
                        relatedVideos.map((video, index) => (
                          <motion.div
                            key={video._id || index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: index * 0.05,
                            }}
                            className="flex gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
                            onClick={() => navigate(`/video/${video._id}`)}
                          >
                            <div className="relative flex-shrink-0">
                              <img
                                src={
                                  video.thumbnail ||
                                  "/placeholder-thumbnail.jpg"
                                }
                                alt={video.title || "Video thumbnail"}
                                className="w-40 h-24 object-cover rounded-lg group-hover:rounded-md transition-all duration-200"
                                onError={(e) => {
                                  e.target.src = "/placeholder-thumbnail.jpg";
                                }}
                              />
                              <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                                {formatDuration(video.duration)}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium line-clamp-2 group-hover:text-white transition-colors mb-1">
                                {video.title || "Untitled Video"}
                              </h4>
                              <p className="text-xs text-gray-400 mb-1">
                                {video.owner?.username || "Unknown Channel"}
                              </p>
                              <div className="flex items-center gap-1 text-xs text-gray-400">
                                <span>{formatViews(video.views)}</span>
                                <span>•</span>
                                <span>{formatDate(video.createdAt)}</span>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-gray-400 text-sm text-center py-8">
                          No related videos available
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
