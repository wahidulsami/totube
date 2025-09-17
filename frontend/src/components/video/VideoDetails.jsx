import React, { useEffect, useState } from "react"; 
import { useDispatch, useSelector } from "react-redux"; 
import { fetchVideoById, removeVideo } from "../../store/videoReducer"; 
import { useParams, useNavigate } from "react-router-dom"; 
import { ThumbsUp, ThumbsDown, Share2, Download, MoreHorizontal, Edit3, Trash2, Bell } from "lucide-react";
import { Spinner } from "../ui/shadcn-io/spinner";
import { fetchVideos } from "../../store/videoReducer";



export default function VideoDetails() { 
  const { id } = useParams(); 
  const dispatch = useDispatch(); 
  const navigate = useNavigate(); 
  const [showDescription, setShowDescription] = useState(false);
 const [relatedVideos, setRelatedVideos] = useState([]);

   const defaultAvatar = "/default/defaultAvatar.png";
  const { currentVideo, loading, error } = useSelector((state) => state.videos); 
  const { user } = useSelector((state) => state.auth); 
 
  useEffect(() => { 
    dispatch(fetchVideoById(id)); 
  }, [dispatch, id]); 
 
  const handleDelete = async () => { 
    if (window.confirm("Are you sure you want to delete this video?")) {
      const action = await dispatch(removeVideo(id)); 
      if (action.meta.requestStatus === "fulfilled") { 
        navigate("/"); 
      } 
    }
  }; 

  const formatViews = (views) => {
    if (!views) return "0 views";
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`;
    return `${views} views`;
  };

  const formatDate = (dateString) => {
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
  };

useEffect(() => {
  if (!currentVideo) return;

  const fetchRelated = async () => {
    try {
      const action = await dispatch(fetchVideos({
        page: 1,
        limit: 10,
      }));

      if (action.meta.requestStatus === "fulfilled") {
        // Filter out the current video from the related list
        const filtered = action.payload.filter(v => v._id !== currentVideo._id);
        setRelatedVideos(filtered);
      }
    } catch (err) {
      console.error("Failed to fetch related videos", err);
    }
  };

  fetchRelated();
}, [currentVideo, dispatch]);

  const formatDuration = (duration) => {
    if (!duration) return null;
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };




 
  if (loading) {
    return (
      <div className="flex  border border-[#1B1B1B] p-8 
                    bg-[linear-gradient(145deg,_#1B1B1B_0%,_#171717_100%)]
                    shadow-[0_20px_40px_rgba(0,0,0,0.65),_inset_0_1px_0_rgba(255,255,255,0.05)] items-center justify-center h-screen">
      <Spinner variant="default" className="text-white" size={25} />
    </div>
    );
  }

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
 
  if (!currentVideo) {
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



 
  return ( 
    <>

 
    <div className="min-h-screen bg-[#0f0f0f] text-white">
   
<div className="max-w-screen mx-auto sm:px-6 lg:px-12 lg:py-10">
  <div className="flex flex-col xl:flex-row gap-6">
    {/* Main Video Section */}
    <div className="flex-1 w-full max-w-full xl:max-w-[1250px]">
      {/* Video Player */}
   <div className="relative bg-black rounded-none sm:rounded-xl
    overflow-hidden mb-4 group">
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
                {currentVideo.title}
              </h1>

              {/* Channel Info & Actions Row */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Channel Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={currentVideo.owner?.avatar ||  defaultAvatar }
                    alt={currentVideo.owner?.name || "Channel"}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-700"
                    onError={(e) => (e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face")}
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-white hover:text-gray-300 cursor-pointer transition-colors">
                      {currentVideo.owner?.username || "Unknown Creator"}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {currentVideo.owner?.subscribersCount || "0"} subscribers
                    </p>
                  </div>
                  
              
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Like/Dislike */}
                  <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full overflow-hidden border border-white/20">
                    <button className="flex items-center gap-2 px-4 py-2 hover:bg-white/20 transition-all duration-200">
                      <ThumbsUp className="w-5 h-5" />
                      <span className="text-sm font-medium">124</span>
                    </button>
                    <div className="w-px h-6 bg-gray-600"></div>
                    <button className="flex items-center gap-2 px-4 py-2 hover:bg-white/20 transition-all duration-200">
                      <ThumbsDown className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Share */}
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full transition-all duration-200 border border-white/20">
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Share</span>
                  </button>

                  {/* Download */}
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full transition-all duration-200 border border-white/20">
                    <Download className="w-5 h-5" />
                    <span className="text-sm font-medium">Download</span>
                  </button>

                  {/* More */}
                  <button className="p-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full transition-all duration-200 border border-white/20">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Video Stats */}
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span className="font-medium">{formatViews(currentVideo.views)}</span>
                <span>•</span>
                <span>{formatDate(currentVideo.createdAt)}</span>
              </div>

              {/* Description */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                  <span className="font-medium">{formatViews(currentVideo.views)}</span>
                  <span>•</span>
                  <span>{formatDate(currentVideo.createdAt)}</span>
                </div>
                
                <div className={`text-sm leading-relaxed ${!showDescription ? 'line-clamp-3' : ''}`}>
                  {currentVideo.description || "No description available for this video."}
                </div>
                
                {currentVideo.description && currentVideo.description.length > 150 && (
                  <button
                    onClick={() => setShowDescription(!showDescription)}
                    className="text-white/80 hover:text-white font-medium text-sm mt-3 transition-colors"
                  >
                    {showDescription ? "Show less" : "Show more"}
                  </button>
                )}
              </div>

          
            </div>
          </div>

          {/* Sidebar - Related Videos */}
        <div className="xl:w-[400px] xl:min-w-[400px]">
  <div className="space-y-2">
    <h3 className="text-lg font-semibold mb-4 px-1">Related Videos</h3>
    <div className="space-y-2">
      {relatedVideos?.map((video) => (
        <div 
          key={video.id} 
          className="flex gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
            onClick={() => navigate(`/video/${video._id}`)}
    
        >
          <div className="relative flex-shrink-0">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-40 h-24 object-cover rounded-lg group-hover:rounded-md transition-all duration-200"
              onError={(e) => {
                e.target.src = '/placeholder-thumbnail.jpg'; // Fallback image
              }}
            />
            <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
              {video.duration ? formatDuration(video.duration) : '0:00'}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium line-clamp-2 group-hover:text-white transition-colors mb-1">
              {video.title || 'Untitled Video'}
            </h4>
            <p className="text-xs text-gray-400 mb-1">{video.owner?.username  || 'Unknown Channel'}</p>
         <div className="flex items-center gap-1 text-xs text-gray-400">
  <span>{video.views ? formatViews(video.views) : '0'} views</span>
  <span>•</span>
  <span>{video.createdAt ? formatDate(video.createdAt) : 'Recently'}</span>
</div>

          </div>
        </div>
      )) || <div className="text-gray-400 text-sm">No related videos available</div>}
    </div>
  </div>
</div>
        </div>
      </div>
    </div>

</>
  ); 
}