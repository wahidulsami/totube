import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  subscribeToChannel,
  getChannelSubscribersCount,
  userSubscribedChannelsData,
  getChannelSubscribersData,
  checkSubscriptionStatus,
} from "@/api/subscribe";


export const toggleSubscribe = createAsyncThunk(
  "subscribe/toggleSubscribe",
  async (channelId, { rejectWithValue }) => {
    try {
      const res = await subscribeToChannel(channelId);
      return res; 
    } catch (error) {
     
      return rejectWithValue(error.message);
    }
  }
);



export const fetchSubscribersCount = createAsyncThunk(
  "subscribe/fetchSubscribersCount",
  async (channelId, { rejectWithValue }) => {
    try {
      const res = await getChannelSubscribersCount(channelId);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch subscribers count"
      );
    }
  }
);


export const getSubscribedChannelsData = createAsyncThunk(
  "subscribe/getSubscribedChannelsData",
  async (subscriberId, { rejectWithValue }) => {
    try {
      const res = await userSubscribedChannelsData(subscriberId);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch subscribed channels data"
      );
    }
  }
);


export const getChannelSubscribers = createAsyncThunk(
  "subscribe/getChannelSubscribers",
  async (channelId, { rejectWithValue }) => {
    try {
      const res = await getChannelSubscribersData(channelId);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch channel subscribers data"
      );
    }
  }
);


export const checkSubscriptionStatusThunk = createAsyncThunk(
  "subscribe/checkStatus",
  async (channelId, { rejectWithValue }) => {
    try {
      const res = await checkSubscriptionStatus(channelId);
      return res.data; // { success: true, subscribed: true/false }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to check subscription status"
      );
    }
  }
);


const subscribeSlice = createSlice({
  name: "subscribe",
  initialState: {
    subscribersCount: 0,
    subscribed: false,
    subscribedChannels: [],
    channelSubscribers: [],
    loading: false,
    error: null,
  },
  reducers: {
   
    toggleLocalSubscribed(state) {
      state.subscribed = !state.subscribed;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Toggle Subscribe
      .addCase(toggleSubscribe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleSubscribe.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          state.subscribed = action.payload.data.subscribed;
          state.subscribersCount = action.payload.data.subscribersCount ?? 0;
        }
      })
      .addCase(toggleSubscribe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Fetch Subscribers Count
      .addCase(fetchSubscribersCount.fulfilled, (state, action) => {
        state.subscribersCount = action.payload.subscribersCount ?? 0;
      })

      // 🔹 User’s Subscribed Channels
      .addCase(getSubscribedChannelsData.fulfilled, (state, action) => {
        state.subscribedChannels = action.payload.data ?? [];
      })

      // 🔹 Channel Subscribers List
      .addCase(getChannelSubscribers.fulfilled, (state, action) => {
        state.channelSubscribers = action.payload.data ?? [];
      })

      // 🔹 Check Subscription Status
      .addCase(checkSubscriptionStatusThunk.fulfilled, (state, action) => {
        state.subscribed = action.payload?.subscribed ?? false;
      });
  },
});

export const { toggleLocalSubscribed } = subscribeSlice.actions;

export default subscribeSlice.reducer;
