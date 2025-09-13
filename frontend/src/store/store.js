import {configureStore} from "@reduxjs/toolkit"
import authReducer from './authReducer'
import videosReducer from './videoReducer'

const store = configureStore({
  reducer: {
    auth: authReducer,
        videos: videosReducer,
    
  },
});

export default store;