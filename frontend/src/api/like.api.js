import api from "./api";


export const Likedvideo = async(videoId) => {
  try {
    const res  = await api.post(`/likes/toggle/v/${videoId}`)
    return res;
  } catch (error) {
    throw error.response?.data || { message: "liked video problem" };
  }
}


export const getAllLikesVideo = async() => {
    try {
        const res  = await api.get("/likes/videos")
        return res
    } catch (error) {
    throw error.response?.data || { message: "all liked videos problem" };
    }
}

export const commentLike = async(commentId) => {
    try {
        const res = await api.post(`/likes/toggle/${commentId}`)
        return res
    } catch (error) {
         throw error.response?.data || { message: " comment  liked problem" };
    }
}

export const tweetLike = async(tweetId) => {
    try {
        const res = await api.post(`/likes/toggle/${tweetId}`)
        return res
    } catch (error) {
          throw error.response?.data || { message: " tweet  liked problem" };
    }
}