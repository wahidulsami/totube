import api from "./api";

export const getChannel = (username) => {
    try {
        const res = api.get(`/channel/${username}`);
        return res;
    } catch (error) {
           throw error.response?.data || { message: "get channel problem" };
    }
}