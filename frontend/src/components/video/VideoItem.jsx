// src/components/VideoItem.jsx
import React from "react";
import { useDispatch } from "react-redux";
import { removeVideo } from "../../store/videoReducer";
import { Link } from "react-router-dom";

export default function VideoItem({ video }) {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      dispatch(removeVideo(video._id));
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col">
      <Link to={`/videos/${video._id}`}>
        {video.thumbnail && (
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-40 object-cover rounded-lg mb-3"
          />
        )}
        <h2 className="text-lg font-semibold text-white mb-1">{video.title}</h2>
        <p className="text-gray-400 text-sm line-clamp-2">
          {video.description}
        </p>
      </Link>
      <button
        onClick={handleDelete}
        className="mt-3 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm"
      >
        Delete
      </button>

      
    </div>
  );
}
