import api from "./api";



export const registerUser = async (data) => {
  const formData = new FormData();
  for (let key in data) {
    formData.append(key, data[key]);
  }
  try {
    const { data } = await api.post("/users/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

export const loginUser = async (formData) => {
  try {
    const { data } = await api.post("/users/login", formData );
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

export const logout = async () => {
  try {
    const { data } = await api.post("/users/logout");
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data } = await api.get("/users/current-user");
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};
