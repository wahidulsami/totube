// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchComments,
//   createComment,
// } from "@/store/comment.reducer";
// import {
//   toggleCommentLike,
//   fetchUserLikedComments,
// } from "@/store/likeReducer";
// import { ThumbsUp, Send } from "lucide-react";

// const CommentList = ({ videoId }) => {
//   const dispatch = useDispatch();
//   const { hasNextPage, comments, loading, page, totalPages } = useSelector((state) => state.comments);
//   const { likedComments } = useSelector((state) => state.like);
//   const { user } = useSelector((state) => state.auth);

//   const [content, setContent] = useState("");
//   const [replyContent, setReplyContent] = useState("");
//   const [replyingTo, setReplyingTo] = useState(null);
//   const [processingLikes, setProcessingLikes] = useState(new Set());

//   useEffect(() => {
//     if (!loading) window.scrollTo({ top: 10, behavior: "smooth" });
//   }, [page]);

//   useEffect(() => {
//     if (videoId) {
//       dispatch(fetchComments({ videoId, page: 1 }));
//       dispatch(fetchUserLikedComments());
//     }
//   }, [videoId]);

//   const handleCommentLike = async (commentId) => {
//     if (!user || processingLikes.has(commentId)) return;

//     setProcessingLikes(prev => new Set(prev).add(commentId));

//     try {
//       await dispatch(toggleCommentLike(commentId)).unwrap();
//       await dispatch(fetchUserLikedComments()).unwrap();
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setProcessingLikes(prev => {
//         const newSet = new Set(prev);
//         newSet.delete(commentId);
//         return newSet;
//       });
//     }
//   };

//   const handleAddComment = (e) => {
//     e.preventDefault();
//     if (!content.trim()) return;
//     dispatch(createComment({ videoId, content }));
//     setContent("");
//   };

//   const handleReply = (e, parentId) => {
//     e.preventDefault();
//     if (!replyContent.trim()) return;
//     dispatch(createComment({ videoId, content: replyContent, parentId }));
//     setReplyContent("");
//     setReplyingTo(null);
//   };

//   const renderComment = (comment) => {
//     const likedComment = likedComments.find(
//       (c) => c.commentId === comment._id
//     );
//     const isLiked = likedComment?.liked;
//     const likesCount = likedComment?.likesCount ?? comment.likesCount ?? 0;
//     const isProcessing = processingLikes.has(comment._id);

//     return (
//       <div key={comment._id} className="mb-4">
//         <div className="flex gap-3 items-start">
//           <img
//             src={comment.owner?.avatar || "/default-avatar.png"}
//             alt={comment.owner?.username || "User"}
//             className="w-10 h-10 rounded-full object-cover"
//           />

//           <div className="flex-1">
//             <p className="text-sm font-semibold text-white">
//               {comment.owner?.username}
//             </p>
//             <p className="text-gray-300 text-sm">{comment.content}</p>

//             <div className="flex items-center gap-2 mt-1">
//               <button
//                 onClick={() => handleCommentLike(comment._id)}
//                 disabled={isProcessing}
//                 className={`flex items-center gap-1.5 text-sm transition-all ${
//                   isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
//                 }`}
//               >
//                 <ThumbsUp
//                   size={18}
//                   className={`transition-colors ${
//                     isLiked
//                       ? "text-blue-500 fill-blue-500"
//                       : "text-gray-400 hover:text-gray-300"
//                   }`}
//                 />
//                 <span className={isLiked ? "text-blue-500 font-medium" : "text-gray-400"}>
//                   {likesCount}
//                 </span>
//               </button>

//               <button
//                 onClick={() => setReplyingTo(comment._id)}
//                 className="text-sm text-gray-400 hover:text-white transition-colors"
//               >
//                 Reply
//               </button>
//             </div>

//             {/* Reply Form */}
//             {replyingTo === comment._id && (
//               <div className="mt-2 ml-4 flex gap-2">
//                 <input
//                   type="text"
//                   value={replyContent}
//                   onChange={(e) => setReplyContent(e.target.value)}
//                   placeholder="Write a reply..."
//                   className="flex-1 bg-white/5 border border-white/20 rounded-full px-3 py-1 text-sm text-gray-200 outline-none focus:border-blue-500 transition-colors"
//                 />
//                 <button
//                   onClick={(e) => handleReply(e, comment._id)}
//                   className="p-2 text-blue-500 hover:text-blue-400 transition-colors"
//                 >
//                   <Send size={16} />
//                 </button>
//               </div>
//             )}

//             {/* Replies */}
//             {comment.replies?.length > 0 && (
//               <div className="ml-6 mt-2 space-y-2">
//                 {comment.replies.map((reply) => renderComment(reply))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-6">
//       <h3 className="text-xl font-semibold text-white">
//         {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
//       </h3>

//       {/* Add Comment Box */}
//       <div className="flex gap-3 items-start">
//         <img
//           src={user?.avatar || "/default-avatar.png"}
//           alt={user?.username || "User"}
//           className="w-10 h-10 rounded-full object-cover"
//         />
//         <div className="flex-1">
//           <textarea
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             placeholder="Add a comment..."
//             rows="1"
//             className="w-full bg-transparent border-b-2 border-gray-700 focus:border-blue-500 outline-none text-gray-200 placeholder-gray-500 resize-none transition-colors"
//           />
//           {content.trim() && (
//             <button
//               onClick={handleAddComment}
//               className="px-3 py-1 mt-1 text-sm bg-blue-600 hover:bg-blue-700 rounded-full text-white flex items-center gap-1 transition-colors"
//             >
//               <Send size={16} /> Comment
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Comment List */}
//       {loading ? (
//         <div className="py-12 text-center text-gray-400">
//           Loading comments...
//         </div>
//       ) : (
//         comments.map((comment) => renderComment(comment))
//       )}

//       {/* Pagination Controls */}
//       {(hasNextPage || page > 1) && (
//         <div className="flex justify-center items-center gap-3 mt-6">
//           <button
//             onClick={() => dispatch(fetchComments({ videoId, page: page - 1 }))}
//             disabled={page <= 1 || loading}
//             className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
//               page <= 1 || loading
//                 ? "bg-gray-800 text-gray-500 cursor-not-allowed"
//                 : "bg-gray-700 text-white hover:bg-gray-600 hover:scale-105"
//             }`}
//           >
//             ← Previous
//           </button>

//           <span className="text-gray-400 text-sm">
//             Page <span className="font-semibold text-white">{page}</span> of{" "}
//             <span className="font-semibold text-white">{totalPages}</span>
//           </span>

//           <button
//             onClick={() => dispatch(fetchComments({ videoId, page: page + 1 }))}
//             disabled={!hasNextPage || loading}
//             className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
//               !hasNextPage || loading
//                 ? "bg-gray-800 text-gray-500 cursor-not-allowed"
//                 : "bg-gray-700 text-white hover:bg-gray-600 hover:scale-105"
//             }`}
//           >
//             Next →
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CommentList;

import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchComments,
  removeComment,
  createComment,
  updateComment,
} from "@/store/comment.reducer";
import { Trash2, Send, Edit2, X, ThumbsUp, MoreVertical } from "lucide-react";
import { toggleCommentLike } from "@/store/likeReducer";
import { fetchUserLikedComments } from "@/store/likeReducer";
import { toast } from "react-toastify";
import { Link } from "react-router";

const CommentList = ({ videoId }) => {
  const dispatch = useDispatch();
const { hasNextPage, comments, loading, page, totalPages, totalDocs , parentCommentId } = useSelector(
  (state) => state.comments
);

  const { likedComments } = useSelector((state) => state.like);
  const { user } = useSelector((state) => state.auth);

  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [showMenu, setShowMenu] = useState(null);
  const [isNextClick, setIsNextClick] = useState(false);
  const sectionRef = useRef(null);
  const menuRef = useRef(null);




  useEffect(() => {
    if (!loading && comments.length > 0 && isNextClick) {
      sectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setIsNextClick(false);
    }
  }, [page, loading]);

  useEffect(() => {
  const handleClickOutside = (e) => {
   
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setShowMenu(null);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  useEffect(() => {
    if (videoId) dispatch(fetchComments({ videoId }));
    dispatch(fetchUserLikedComments());
  }, [videoId, dispatch]);

  const handleAddComment = (e) => {
    try {
      e.preventDefault();
      if (!content.trim()) return;
      dispatch(createComment({ videoId, content }));
      setContent("");
    } catch (error) {
      toast.error(error.message || "Failed to add comment");
    }
  };

  const handleCommentLike = (commentId) => {
    try {
      dispatch(toggleCommentLike(commentId));
    } catch (error) {
      toast.error(error.message || "Failed to like comment");
    }
  };

  const handleUpdate = async (commentId) => {
    try {
      if (!editContent.trim()) return;
      await dispatch(
        updateComment({ commentId, content: editContent })
      ).unwrap();
      toast.success("Comment updated!");
      setEditingId(null);
      setEditContent("");
    } catch (error) {
      toast.error(error.message || "Failed to update comment");
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await dispatch(removeComment(commentId)).unwrap();
      toast.success("Comment deleted!");
      setShowMenu(null);
    } catch (error) {
      toast.error(error.message || "Failed to delete comment");
    }
  };

const handleReply = (e, parentId) => {
  e.preventDefault();
  if (!replyContent.trim()) return;

  dispatch(createComment({ videoId, content: replyContent, parentCommentId: parentId }))
    .unwrap()
    .then(() => {
      setReplyingTo(null);
      setReplyContent("");
    })
    .catch((err) => toast.error(err || "Failed to add reply"));
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
  {totalDocs} {comments.totalDocs === 1 ? "Comment" : "Comments"}
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
              <div className="w-12 h-12 rounded-full    bg-gradient-to-br from-red-500 to-red-600  flex items-center justify-center text-white font-semibold uppercase shadow-sm">
                {user?.username?.[0]?.toUpperCase() || "G"}
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
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment(e);
                }
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

      <div ref={sectionRef} className="space-y-6 comment-section">
        {comments.map((comment) => {
          const commentId = comment._id || comment.id;
          const likedComment = likedComments.find(
            (c) => c.commentId === commentId
          );
          const isLiked = likedComment?.liked;
          const likesCount =
            likedComment?.likesCount ?? comment.likesCount ?? 0;
          const isOwner = user?._id === comment.owner?._id;

          return (
            <div key={commentId} className="group">
              <div className="flex gap-4">
                {/* Avatar */}
                {comment.owner?.avatar ? (
                  <img
                    src={comment.owner.avatar}
                    alt={comment.owner.username || "User"}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full    bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm flex-shrink-0">
                    {comment.owner?.username?.[0]?.toUpperCase() || "U"}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-1">
                    <Link to={`/channel/${comment.owner?.username || "guest"}`}>
                    <span className="text-sm font-semibold text-white">
                      {comment.owner?.username || "Unknown"}
                    </span>

                    </Link>
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(comment.createdAt)}
                    </span>
                  </div>

                  {/* Content or Edit */}
                  {editingId === comment._id ? (
                    <div className="space-y-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10  shadow-inner animate-in fade-in-50">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                        placeholder="Edit your comment..."
                        className="w-full bg-gray-700/30 border border-gray-700 focus:border-red-500 rounded-xl p-3 text-sm text-gray-200 placeholder-gray-500 outline-none resize-none shadow-inner transition-all duration-200"
                        autoFocus
                      />

                      <div className="flex items-center gap-3 justify-end">
                        <button
                          onClick={() => handleUpdate(comment._id)}
                          disabled={!editContent.trim()}
                          className={`px-5 py-2 text-sm font-semibold cursor-pointer  rounded-full transition-all duration-200 shadow-md ${
                            editContent.trim()
                              ? "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105"
                              : "bg-gray-700 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          Save
                        </button>

                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditContent("");
                          }}
                          className="px-5 py-2 text-sm font-semibold text-gray-300 bg-[#0f0f0f] cursor-pointer border border-gray-700 hover:bg-gray-700/70 rounded-full transition-all duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-300 text-sm leading-relaxed mb-3">
                        {comment.content}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center gap-6">
                        <button
                          onClick={() => handleCommentLike(comment._id)}
                          className={`flex items-center gap-1 text-xs transition-all ${
                            likedComment?.isProcessing
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <ThumbsUp
                            size={16}
                            className={`transition-colors  cursor-pointer ${
                              isLiked
                                ? "text-blue-500 fill-blue-500"
                                : "text-gray-400 hover:text-gray-300"
                            }`}
                          />
                          {likesCount > 0 && (
                            <span
                              className={`font-medium ${
                                isLiked ? "text-blue-500" : "text-gray-400"
                              }`}
                            >
                              {likesCount}
                            </span>
                          )}
                        </button>

                        <button
                          onClick={() => setReplyingTo(comment._id)}
                          className="text-xs text-gray-400  hover:text-white transition-colors
                           font-medium cursor-pointer"
                        >
                          Reply
                        </button>

                        {isOwner && (
                          <div className="relative ml-auto">
                            <button
                              onClick={() =>
                                setShowMenu(
                                  showMenu === comment._id ? null : comment._id
                                )
                              }
                              className="p-1 text-gray-400 hover:text-white transition-colors"
                            >
                              <MoreVertical size={16} />
                            </button>

                            {showMenu === comment._id && (
                              <div ref={menuRef} className=" cursor-pointer absolute right-0 top-6 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-10 min-w-[140px] overflow-hidden">
                                <button
                                  onClick={() => {
                                    setEditingId(comment._id);
                                    setEditContent(comment.content);
                                    setShowMenu(null);
                                  }}
                                  className="w-full px-4 py-2 cursor-pointer  text-sm text-left text-gray-300 hover:bg-white/10 flex items-center gap-2 transition"
                                >
                                  <Edit2 size={14} /> Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(comment._id)}
                                  className="w-full px-4 py-2 text-sm cursor-pointer text-left text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition border-t border-gray-700"
                                >
                                  <Trash2 size={14} /> Delete
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Reply Form */}
                  {replyingTo === comment._id && (
                    <div className="mt-4 pt-4 flex gap-3 items-start animate-in fade-in-50 rounded-xl p-2  shadow-inner">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write your reply..."
                        rows={3}
                        className="flex-1 bg-gray-700/30 border border-gray-700 focus:border-red-500 rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 outline-none resize-none shadow-inner transition-all duration-200"
                        autoFocus
                      />

                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={(e) => handleReply(e, comment._id)}
                          disabled={!replyContent.trim()}
                          className={`p-2.5 rounded-full cursor-pointer transition-all duration-200 shadow-md ${
                            replyContent.trim()
                              ? "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105"
                              : "bg-gray-700 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          <Send size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyContent("");
                          }}
                          className="p-2.5 rounded-full text-gray-300 bg-[#0f0f0f] cursor-pointer border border-gray-700 hover:bg-gray-700/70 transition-all duration-200"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="border-b border-gray-800 mt-6"></div>
            </div>
          );
        })}

        {(hasNextPage || page > 1) && (
          <div className="flex justify-center items-center gap-4 mt-8 pt-4">
            <button
              onClick={() =>
                dispatch(fetchComments({ videoId, page: page - 1 }))
              }
              disabled={page <= 1 || loading}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                page <= 1 || loading
                  ? "bg-gray-800/50 text-gray-600 cursor-not-allowed"
                  : "bg-gray-800/70 text-gray-200 hover:bg-gray-700 hover:text-white active:scale-95"
              }`}
            >
              ← Previous
            </button>

            <span className="text-gray-400 text-sm">
              Page <span className="font-semibold text-gray-300">{page}</span>{" "}
              of{" "}
              <span className="font-semibold text-gray-300">{totalPages}</span>
            </span>

            <button
              onClick={() => {
                setIsNextClick(true);
                dispatch(fetchComments({ videoId, page: page + 1 }));
              }}
              disabled={!hasNextPage || loading}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                !hasNextPage || loading
                  ? "bg-gray-800/50 text-gray-600 cursor-not-allowed"
                  : "bg-gray-800/70 text-gray-200 hover:bg-gray-700 hover:text-white active:scale-95"
              }`}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentList;
