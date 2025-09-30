import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authReducer";
import videosReducer from "./videoReducer";
import likeReducer from "./likeReducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    videos: videosReducer,
    like: likeReducer,
  },
});

export default store;
