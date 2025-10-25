import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getVideoComments,
  deleteComment,
  addComment,
  editComment,
} from "@/api/comment.api";


// ✅ Fetch comments
export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async ({ videoId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const res = await getVideoComments(videoId, page, limit);
      return res.data.docs;; // ✅ শুধু data রিটার্ন করো
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


export const createComment = createAsyncThunk(
  "comments/createComment",
  async ({ videoId, content }, { rejectWithValue }) => {
    try {
      const res = await addComment(videoId, content);

      // ✅ Your backend response: { success, message, data: { commentObject } }
      return res.data.data; // this is the actual comment object
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// ✅ Update comment
export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const res = await editComment(commentId, content);
      return res.data; // ✅
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Delete comment
export const removeComment = createAsyncThunk(
  "comments/removeComment",
  async (commentId, { rejectWithValue }) => {
    try {
      const res = await deleteComment(commentId);
      return res.data || { commentId }; // ✅
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch comments
   .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload || [];
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add comment
      .addCase(createComment.fulfilled, (state, action) => {
        state.comments.unshift(action.payload);
      })

      // Update comment
      .addCase(updateComment.fulfilled, (state, action) => {
        const idx = state.comments.findIndex(
          (c) => c._id === action.payload._id
        );
        if (idx !== -1) state.comments[idx] = action.payload;
      })

      // Delete comment
      .addCase(removeComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (c) => c._id !== action.payload.commentId
        );
      });
  },
});

export default commentSlice.reducer;