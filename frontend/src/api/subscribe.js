import api from "./api";

export const userSubscribedChannelsData   = async (channelId) => {
    try {
        const {data} = await api.get(`/subscriptions/u/${channelId}`);
        return data; 
    } catch (error) {
        throw error.response?.data || { message: "Something went wrong" };
    }
}

export const subscribeToChannel= async (channelId) => {
    try {
        const res = await api.post(`/subscriptions/c/${channelId}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Something went wrong" };
    }
}

export const getChannelSubscribersCount = async (channelId) => {
    try {
        const {data} = await api.get(`/subscriptions/subscribers/${channelId}`);
        return data;
    } catch (error) {
        throw error.response?.data || { message: "Something went wrong" };
    }

}

export const getChannelSubscribersData = async (channelId) => {
    try {
        const {data} = await api.get(`/subscriptions/channel/${channelId}/subscribers`);
        return data;
    } catch (error) {
         throw error.response?.data || { message: "Something went wrong" }
    }
}


export const checkSubscriptionStatus = async (channelId) => {
    try {
        const res = await api.get(`/subscriptions/status/${channelId}`);
        return res; // { success, subscribed }
    } catch (error) {
             throw error.response?.data || { message: "Something went wrong" }
    }
}

