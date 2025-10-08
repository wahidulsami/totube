import React from "react";
import { useNavigate } from "react-router-dom";

const VideoCard = ({ video }) => {
  const navigate = useNavigate();

  const formatViews = (views) => {
    if (!views) return "0 views";
    if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M views`;
    if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K views`;
    return `${views} views`;
  };

  const formatDuration = (seconds) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatTimeAgo = (date) => {
    if (!date) return "";
    const now = new Date();
    const uploadDate = new Date(date);
    const diffInSeconds = Math.floor((now - uploadDate) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minute ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hour ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} day ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} week ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} month ago`;
    return `${Math.floor(diffInSeconds / 31536000)} year ago`;
  };

  return (
    <div
      className="cursor-pointer group"
      onClick={() => navigate(`/video/${video._id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (["Enter", " "].includes(e.key)) {
          e.preventDefault();
          navigate(`/video/${video._id}`);
        }
      }}
      aria-label={`Watch ${video.title}`}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video bg-zinc-800 rounded-xl overflow-hidden mb-3">
        <img
          src={video.thumbnail || "/placeholder.jpg"}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => (e.target.src = "/placeholder.jpg")}
          loading="lazy"
        />
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black/85 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
            {formatDuration(video.duration)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex gap-3">
        {video.owner?.avatar && (
          <img
            src={video.owner.avatar}
            alt={video.owner.username || "Channel"}
            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
            onError={(e) => (e.target.style.display = "none")}
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-white line-clamp-2 mb-1 leading-snug group-hover:text-gray-200 transition-colors">
            {video.title}
          </h3>
          {video.owner?.username && (
            <p className="text-xs text-gray-400 hover:text-gray-300 mb-0.5">
              {video.owner.username}
            </p>
          )}
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span>{formatViews(video.views)}</span>
            {video.createdAt && (
              <>
                <span>•</span>
                <span>{formatTimeAgo(video.createdAt)}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
