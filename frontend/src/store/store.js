import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authReducer";
import videosReducer from "./videoReducer";
import likeReducer from "./likeReducer";
import subscribeReducer from "./subscribeReducer";
const store = configureStore({
  reducer: {
    auth: authReducer,
    videos: videosReducer,
    like: likeReducer,
    subscribe: subscribeReducer,
  },
});

export default store;
