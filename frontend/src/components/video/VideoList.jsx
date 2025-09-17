import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVideos } from "@/store/videoReducer";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

  const defaultAvatar = "/default/defaultAvatar.png";



const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  hover: {
    y: -4, // reduced hover lift
    scale: 1.01, // softer zoom
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

const imageVariants = {
  hover: { scale: 1.05, transition: { duration: 0.3, ease: "easeOut" } },
};

const VideoList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error } = useSelector((state) => state.videos);

  useEffect(() => {
    dispatch(fetchVideos({ page: 1, limit: 12 }));
  }, [dispatch]);


  // Helpers
  const formatDuration = (duration) => {
    if (!duration) return null;
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatViews = (views) => {
    if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
    if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
    return views?.toString() || "0";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diff < 1) return "Today";
    if (diff === 1) return "1 day ago";
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    if (diff < 365) return `${Math.floor(diff / 30)} months ago`;
    return `${Math.floor(diff / 365)} years ago`;
  };

  // Skeleton
  const VideoSkeleton = () => (
    <div className="animate-pulse">
      <div className="relative w-full aspect-video bg-gray-300 dark:bg-gray-700 rounded-xl mb-3"></div>
      <div className="flex gap-3">
        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  );

  // States
  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid gap-4 sm:gap-6 grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <VideoSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <button
          onClick={() => dispatch(fetchVideos({ page: 1, limit: 12 }))}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!items?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-gray-400 text-6xl mb-4">📹</div>
        <h3 className="text-lg font-semibold mb-2">No videos found</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try refreshing the page or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <motion.div
        className="grid gap-4 sm:gap-6 grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {items.map((video) => (
          <motion.div
            key={video._id}
            className="cursor-pointer group"
            onClick={() => navigate(`/video/${video._id}`)}
            variants={cardVariants}
            whileHover="hover"
            layout
          >
            {/* Thumbnail */}
            <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-800 shadow-sm group-hover:shadow-lg transition">
              <motion.img
                src={video.thumbnail || "/default-thumbnail.png"}
                alt={video.title}
                className="w-full h-full object-cover"
                loading="lazy"
                variants={imageVariants}
                onError={(e) => (e.target.src = "/default-thumbnail.png")}
              />

              {/* Duration */}
              {video.duration && (
                <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-2 py-0.5 rounded">
                  {formatDuration(video.duration)}
                </span>
              )}
            </div>

            {/* Info */}
       <div className="flex gap-3 mt-3">
  <motion.img
    src={video.owner?.avatar || defaultAvatar}
    alt={video.owner?.name || "Creator"}
    className="w-9 h-9 rounded-full object-cover flex-shrink-0 cursor-pointer"
    loading="lazy"
    onError={(e) => (e.target.src = "/default-avatar.png")}
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.2 }}
  />
  <div className="flex-1 min-w-0">
    {/* Video Title */}
    <h3 className="font-medium text-white text-sm sm:text-base 
      line-clamp-2 leading-tight mb-1
      group-hover:text-red-500 
      transition-colors duration-200 cursor-pointer">
      {video.title}
    </h3>
    
    {/* Channel Name */}
    <p className="text-gray-400 hover:text-gray-300 text-xs mb-1 
      line-clamp-1 cursor-pointer transition-colors duration-200">
      {video.owner?.username || "Unknown Creator"}
    </p>
    
    {/* Video Stats */}
    <div className="text-gray-400 text-xs flex items-center gap-1 flex-wrap">
      <span>{formatViews(video.views)} views</span>
      <span className="text-gray-500">•</span>
      <span>{formatDate(video.createdAt)}</span>
    </div>
  </div>
</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default VideoList;
