import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getVideoComments,
  deleteComment,
  addComment,
  editComment,
} from "@/api/comment.api";


export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async ({ videoId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const res = await getVideoComments(videoId, page, limit);
      return res.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// export const createComment = createAsyncThunk(
//   "comments/createComment",
//   async ({ videoId, content }, { rejectWithValue }) => {
//     try {
//       const res = await addComment(videoId, content);


//       return res.data.data; 
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );


export const createComment = createAsyncThunk(
  "comments/createComment",
  async ({ videoId, content, parentCommentId = null }, { rejectWithValue }) => {
    try {
      const res = await addComment(videoId, content, parentCommentId);
      return res.data; // backend returns { success, data, message }
    } catch (err) {
      return rejectWithValue(err.message || "Failed to add comment");
    }
  }
);

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
  page: 1,
  totalPages: 1,
  hasNextPage: false
}
,
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

  // Always replace comments with new page results
  state.comments = action.payload.docs || [];

  state.page = action.payload.page || 1;
  state.totalPages = action.payload.totalPages || 1;
  state.totalDocs = action.payload.totalDocs || 0;
  state.hasNextPage = action.payload.hasNextPage || false;
  state.hasPrevPage = action.payload.hasPrevPage || false;
})

      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // // Add comment
      .addCase(createComment.fulfilled, (state, action) => {
        state.comments.unshift(action.payload);
      })


    

.addCase(updateComment.fulfilled, (state, action) => {
  const updated = action.payload?.data || action.payload;
  const value = state.comments.findIndex(c => c._id === updated._id);
  if (value !== -1) {
    state.comments[value] = updated;
    state.comments = [...state.comments]; // Force re-render
  }
})

.addCase(removeComment.fulfilled, (state, action) => {
  const deletedId = action.payload?.commentId || action.payload?._id;
  state.comments = state.comments.filter(c => c._id !== deletedId);
  state.comments = [...state.comments];
})

  },
});

export default commentSlice.reducer;




//  import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import {
//   getVideoComments,
//   deleteComment,
//   addComment,
//   editComment,
// } from "@/api/comment.api";


// export const fetchComments = createAsyncThunk(
//   "comments/fetchComments",
//   async ({ videoId, page = 1, limit = 10 }, { rejectWithValue }) => {
//     try {
//       const res = await getVideoComments(videoId, page, limit);
//       return res.data; 
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );


// export const createComment = createAsyncThunk(
//   "comments/createComment",
//   async ({ videoId, content }, { rejectWithValue }) => {
//     try {
//       const res = await addComment(videoId, content);


//       return res.data.data; 
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );


// export const updateComment = createAsyncThunk(
//   "comments/updateComment",
//   async ({ commentId, content }, { rejectWithValue }) => {
//     try {
//       const res = await editComment(commentId, content);
//       return res.data; // ✅
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );


// export const removeComment = createAsyncThunk(
//   "comments/removeComment",
//   async (commentId, { rejectWithValue }) => {
//     try {
//       const res = await deleteComment(commentId);
//       return res.data || { commentId }; // ✅
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// const commentSlice = createSlice({
//   name: "comments",
// initialState: {
//   comments: [],
//   loading: false,
//   error: null,
//   page: 1,
//   totalPages: 1,
//   hasNextPage: false
// }
// ,
//   reducers: {
//     updateCommentLikesCount: (state, action) => {
//   const { commentId, likesCount, liked } = action.payload;
//   const comment = state.comments.find((c) => c._id === commentId);
//   if (comment) {
//     comment.likesCount = likesCount;
//     comment.isLiked = liked;
//   }
// },

//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch comments
//    .addCase(fetchComments.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
// .addCase(fetchComments.fulfilled, (state, action) => {
//   state.loading = false;

//   // Always replace comments with new page results
//   state.comments = action.payload.docs || [];

//   state.page = action.payload.page || 1;
//   state.totalPages = action.payload.totalPages || 1;
//   state.hasNextPage = action.payload.hasNextPage || false;
//   state.hasPrevPage = action.payload.hasPrevPage || false;
// })


//       .addCase(fetchComments.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Add comment
//       .addCase(createComment.fulfilled, (state, action) => {
//         state.comments.unshift(action.payload);
//       })

//       // Update comment
//       .addCase(updateComment.fulfilled, (state, action) => {
//         const idx = state.comments.findIndex(
//           (c) => c._id === action.payload._id
//         );
//         if (idx !== -1) state.comments[idx] = action.payload;
//       })

//       // Delete comment
//       .addCase(removeComment.fulfilled, (state, action) => {
//         state.comments = state.comments.filter(
//           (c) => c._id !== action.payload.commentId
//         );
//       });
//   },
// });
// export const { updateCommentLikesCount } = commentSlice.actions;

// export default commentSlice.reducer;