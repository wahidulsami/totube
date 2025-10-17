import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchComments, removeComment, createComment, updateComment } from "@/store/comment.reducer";
import { Trash2, Send, Edit2, X, ThumbsUp, MoreVertical } from "lucide-react";
import { toggleCommentLike } from "@/store/likeReducer";

const CommentList = ({ videoId }) => {
  const dispatch = useDispatch();
  const { comments, loading } = useSelector((state) => state.comments);
  const { likedComments } = useSelector((state) => state.like);
  const { user } = useSelector((state) => state.auth);

  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [showMenu, setShowMenu] = useState(null);

  useEffect(() => {
    if (videoId) dispatch(fetchComments({ videoId }));
  }, [videoId, dispatch]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    dispatch(createComment({ videoId, content }));
    setContent("");
  };

  const handleCommentLike = (commentId) => {
    dispatch(toggleCommentLike(commentId));
  };

  const handleEdit = (comment) => {
    setEditingId(comment._id);
    setEditContent(comment.content);
    setShowMenu(null);
  };

  const handleUpdate = (commentId) => {
    if (!editContent.trim()) return;
    dispatch(updateComment({ commentId, content: editContent }));
    setEditingId(null);
    setEditContent("");
  };

  const handleReply = (e, parentId) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    dispatch(createComment({ videoId, content: replyContent, parentId }));
    setReplyingTo(null);
    setReplyContent("");
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
  };

  return (
    <div className="space-y-6 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">
          {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
        </h3>
      </div>

      {/* Add Comment Input */}
      <div className="group relative">
        <div className="flex gap-3">
          <div className="relative w-12 h-12 flex-shrink-0">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="User avatar"
                className="w-12 h-12 rounded-full object-cover cursor-pointer border border-gray-200 shadow-sm"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center text-white font-semibold uppercase shadow-sm">
                {user?.name ? user.name.charAt(0) : "U"}
              </div>
            )}
          </div>

          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Add a comment..."
              rows="1"
              className="w-full bg-transparent border-b-2 border-gray-700 focus:border-blue-500 outline-none text-gray-200 placeholder-gray-500 resize-none transition-all duration-200 pb-2"
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
            />
            {content.trim() && (
              <div className="flex items-center justify-end gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setContent("")}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white transition rounded-full hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddComment}
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-200 flex items-center gap-2 font-medium shadow-lg shadow-blue-500/30"
                >
                  <Send size={16} /> Comment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comments List */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
        </div>
      )}

      {!loading && comments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            No comments yet. Be the first to comment!
          </p>
        </div>
      )}

      <div className="space-y-4">
        {comments.map((comment) => {
        const commentId = comment._id || comment.id;

  const likedComment = likedComments.find(c => c.commentId === commentId);

          return (
            <div key={commentId} className="group relative">
              <div className="flex gap-3">
                {/* Avatar */}
                <img
                  src={comment.owner?.avatar || "/default-avatar.png"}
                  alt={comment.owner?.username || "User"}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-white/10"
                />

                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-white">
                      {comment.owner?.username || "Unknown"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(comment.createdAt)}
                    </span>
                  </div>

                  {/* Content or Edit */}
                  {editingId === comment._id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-gray-200 outline-none focus:border-blue-500 resize-none"
                        rows="3"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdate(comment._id)}
                          className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-full transition"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => { setEditingId(null); setEditContent(""); }}
                          className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition rounded-full hover:bg-white/5"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-300 text-sm leading-relaxed mb-2">
                        {comment.content}
                      </p>
                      <button
                        onClick={() => handleCommentLike(comment._id)}
                        className="flex items-center gap-1 text-xs transition"
                      >
                        <ThumbsUp
                          size={14}
                          className={`transition-transform ${likedComment?.liked ? "text-blue-500" : "text-gray-400"}`}
                        />
                        <span>{likedComment?.likesCount || comment.likes || 0}</span>
                      </button>
                    </>
                  )}

                  {/* Reply Form */}
                  {replyingTo === comment._id && (
                    <div className="mt-3 ml-4 flex gap-2">
                      <input
                        type="text"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write a reply..."
                        className="flex-1 bg-white/5 border border-white/20 rounded-full px-4 py-2 text-sm text-gray-200 outline-none focus:border-blue-500"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={(e) => handleReply(e, comment._id)}
                        className="p-2 text-blue-500 hover:text-blue-400 transition"
                      >
                        <Send size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => { setReplyingTo(null); setReplyContent(""); }}
                        className="p-2 text-gray-400 hover:text-white transition"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* More Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(showMenu === comment._id ? null : comment._id)}
                    className="p-1 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {showMenu === comment._id && (
                    <div className="absolute right-0 top-8 bg-gray-800 border border-white/10 rounded-lg shadow-xl z-10 min-w-[120px] overflow-hidden">
                      <button
                        onClick={() => handleEdit(comment)}
                        className="w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-white/10 flex items-center gap-2 transition"
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => { dispatch(removeComment(comment._id)); setShowMenu(null); }}
                        className="w-full px-4 py-2 text-sm text-left text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommentList;
