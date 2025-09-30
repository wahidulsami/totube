import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  Likedvideo,
  getAllLikesVideo,
  commentLike,
  tweetLike,
} from "@/api/like.api";

// Toggle Video Like
export const toggleVideoLike = createAsyncThunk(
  "likes/toggleVideoLike",
  async (videoId, { rejectWithValue }) => {
    try {
      const res = await Likedvideo(videoId);
      return res.data; // backend e { success, message, data } ashe
    } catch (error) {
      return rejectWithValue(error.message || "Failed to like/unlike video");
    }
  }
);

// Toggle Comment Like
export const toggleCommentLike = createAsyncThunk(
  "likes/toggleCommentLike",
  async (commentId, { rejectWithValue }) => {
    try {
      const res = await commentLike(commentId);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to like/unlike comment");
    }
  }
);

// Toggle Tweet Like
export const toggleTweetLike = createAsyncThunk(
  "likes/toggleTweetLike",
  async (tweetId, { rejectWithValue }) => {
    try {
      const res = await tweetLike(tweetId);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to like/unlike tweet");
    }
  }
);

// Fetch All Liked Videos
export const fetchLikedVideos = createAsyncThunk(
  "likes/fetchLikedVideos",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllLikesVideo();
      return res.data; // ensure API returns { data: [...] }
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch liked videos");
    }
  }
);

const likeSlice = createSlice({
  name: "likes",
  initialState: {
    likedVideos: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch liked videos
      .addCase(fetchLikedVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLikedVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.likedVideos = action.payload; // should be array of liked videos
      })
      .addCase(fetchLikedVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Toggle video like
      .addCase(toggleVideoLike.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleVideoLike.fulfilled, (state, action) => {
        state.loading = false;
        const { videoId, liked, likesCount } = action.payload.data;

        const existing = state.likedVideos.find((v) => v.videoId === videoId);
        if (existing) {
          existing.liked = liked;
          existing.likesCount = likesCount;
        } else {
          state.likedVideos.push({ videoId, liked, likesCount });
        }
      })

      .addCase(toggleVideoLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default likeSlice.reducer;
