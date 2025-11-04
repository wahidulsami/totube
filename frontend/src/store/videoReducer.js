import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllVideos,
  getVideoById,
  publishAVideo,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
} from "@/api/video.api";

// Async thunks
export const fetchVideos = createAsyncThunk(
  "videos/fetchVideos",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await getAllVideos({ page, limit });
      // response = { statusCode, success, message, data: { docs: [...] } }
      return response.data.docs; 
    } catch (error) {
      return rejectWithValue(error.message || "Failed to load videos");
    }
  }
);

export const fetchVideoById = createAsyncThunk(
  "videos/fetchVideoById",
  async (videoId, { rejectWithValue }) => {
    try {
      const res = await getVideoById(videoId);
      return res.data; 
   
    } catch (error) {
      return rejectWithValue(error.message || "Failed to load video");
    }
  }
);

export const publishAVideosByUser = createAsyncThunk(
  "videos/publishVideo",
  async (videoData, { rejectWithValue }) => {
    try {
      const res = await publishAVideo(videoData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to publish video");
    }
  }
);

export const editVideo = createAsyncThunk(
  "videos/editVideo",
  async ({ videoId, updates }, { rejectWithValue }) => {
    try {
      const res = await updateVideo(videoId, updates);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update video");
    }
  }
);

export const removeVideo = createAsyncThunk(
  "videos/removeVideo",
  async (videoId, { rejectWithValue }) => {
    try {
      await deleteVideo(videoId);
      return videoId;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete video");
    }
  }
);

export const toggleVideoPublish = createAsyncThunk(
  "videos/toggleVideoPublish",
  async (videoId, { rejectWithValue }) => {
    try {
      const res = await togglePublishStatus(videoId);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to toggle publish");
    }
  }
);

const videosSlice = createSlice({
  name: "videos",
  initialState: {
    items: [],
    currentVideo: null,
    loading: false,
    error: null,
  },
  reducers: {
  updateLikesCount: (state, action) => {
      const { videoId, likesCount, liked } = action.payload;
      if (state.currentVideo && state.currentVideo._id === videoId) {
        state.currentVideo.likesCount = likesCount;
        state.currentVideo.liked = liked;
      }
    },

  },
 extraReducers: (builder) => {
    builder
      // Fetch all videos
      .addCase(fetchVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

     
// Fetch video by ID
.addCase(fetchVideoById.pending, (state) => {
  state.loading = true;
  state.error = null;
  // 🚀 don't reset currentVideo here
})
.addCase(fetchVideoById.fulfilled, (state, action) => {
  state.loading = false;
  state.currentVideo = action.payload;
})
.addCase(fetchVideoById.rejected, (state, action) => {
  state.loading = false;
  state.currentVideo = null; // clear only on error
  state.error = action.payload;
})


      // Publish new video
      .addCase(publishAVideosByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(publishAVideosByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(publishAVideosByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Edit video
      .addCase(editVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editVideo.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          (video) => video._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        // Update currentVideo if it's the same video
        if (
          state.currentVideo &&
          state.currentVideo._id === action.payload._id
        ) {
          state.currentVideo = action.payload;
        }
      })
      .addCase(editVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove video
      .addCase(removeVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(
          (video) => video._id !== action.payload
        );
        // Clear currentVideo if it was the deleted video
        if (state.currentVideo && state.currentVideo._id === action.payload) {
          state.currentVideo = null;
        }
      })
      .addCase(removeVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Toggle video publish status
      .addCase(toggleVideoPublish.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleVideoPublish.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          (video) => video._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        // Update currentVideo if it's the same video
        if (
          state.currentVideo &&
          state.currentVideo._id === action.payload._id
        ) {
          state.currentVideo = action.payload;
        }
      })
      .addCase(toggleVideoPublish.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },


});


export const { updateLikesCount } = videosSlice.actions;
export default videosSlice.reducer;