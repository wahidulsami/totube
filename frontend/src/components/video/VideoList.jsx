import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVideos } from "@/store/videoReducer";


const VideoList = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.videos);

  useEffect(() => {
    dispatch(fetchVideos({ page: 1, limit: 10 }));
  }, [dispatch]);

  if (loading) return <p className="text-center py-6">Loading...</p>;
  if (error) return <p className="text-center py-6 text-red-500">Error: {error}</p>;
  if (!items || items.length === 0) return <p className="text-center py-6">No videos found</p>;

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
      {items.map((video) => (
        <div
          key={video._id}
          className="bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-lg transition p-2 cursor-pointer"
        >
          <div className="w-full aspect-video overflow-hidden rounded-lg">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          </div>
          <div className="mt-3 px-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm line-clamp-2">
              {video.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-xs mt-1 line-clamp-2">
              {video.description}
            </p>
            <div className="text-gray-500 dark:text-gray-400 text-xs mt-2 flex justify-between">
              <span>{video.views} views</span>
              <span>{new Date(video.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoList;
