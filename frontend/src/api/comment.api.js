import api from "./api";

// Get comments for a video with pagination
export const getVideoComments = async (videoId, page = 1, limit = 10) => {
  try {
    const res = await api.get(`/comment/${videoId}`, {
      params: { page, limit },
    });
    return res;
  } catch (error) {
    throw error.response?.data || { message: "Get video comments problem" };
  }
};

// Add new comment
export const addComment = async (videoId, content) => {
  try {
    const res = await api.post(`/comment/${videoId}`, { content });
    return res;
  } catch (error) {
    throw error.response?.data || { message: "Add comment problem" };
  }
};

// Edit comment
export const editComment = async (commentId, content) => {
  try {
    const res = await api.patch(`/comment/c/${commentId}`, { content });
    return res;
  } catch (error) {
    throw error.response?.data || { message: "Edit comment problem" };
  }
};

// Delete comment
export const deleteComment = async (commentId) => {
  try {
    const res = await api.delete(`/comment/c/${commentId}`);
    return res;
  } catch (error) {
    throw error.response?.data || { message: "Delete comment problem" };
  }
};
