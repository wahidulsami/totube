// src/api/auth.js
import axios from "axios";

export const registerUser = async (userData) => {
  try {
    const formData = new FormData();
    formData.append("fullname", userData.fullname);
    formData.append("email", userData.email);
    formData.append("username", userData.username);
    formData.append("password", userData.password);
    if (userData.avatar) formData.append("avatar", userData.avatar);
    if (userData.coverImage) formData.append("coverImage", userData.coverImage);

    const res = await axios.post(
      "http://localhost:8000/api/v1/users/register",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
