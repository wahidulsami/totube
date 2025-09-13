import api from "./api";


export const publishAVideo = async (data ) => {
  const formData = new FormData()


  formData.append("title" , data.title)
  formData.append("description" , data.description)
  
formData.append("video", data.video[0]);
formData.append("thumbnail", data.thumbnail[0]);


  try {
const {data:res} = await api.post("/video/upload-video", formData, {

  headers: { "Content-Type": "multipart/form-data" }
});

 

    return res;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};


export const getAllVideos = async ({ page = 1, limit = 10, sortBy, sortType, userId }) => {
  try {
    const { data } = await api.get("/video/getAllVideos", {
      params: { page, limit, sortBy, sortType, userId },
    });
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};


export const getVideoById = async (videoId) => {
  try {
    const { data } = await api.get(`/video/${videoId}`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

export const updateVideo = async (videoId, { title, description, thumbnail }) => {
  try {
    const formData = new FormData();
    if (title) formData.append("title", title);
    if (description) formData.append("description", description);
    if (thumbnail) formData.append("thumbnail", thumbnail);

    const { data } = await api.patch(`/video/update-video/${videoId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};


export const deleteVideo = async (videoId) => {
  try {
    const { data } = await api.delete(`/videos/deleteVideo/${videoId}`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};


export const togglePublishStatus = async (videoId) => {
  try {
    const { data } = await api.patch(`/videos/${videoId}/toggle-publish`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};


