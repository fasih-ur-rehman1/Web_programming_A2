import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Read API key safely from Vite environment variables
const API_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY;
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2';

// 1. Async Thunk to fetch events with search and category filters
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async ({ keyword = '', classification = '' } = {}, { rejectWithValue }) => {
    try {
      let url = `${BASE_URL}/events.json?apikey=${API_KEY}&size=20&sort=date,asc`;

      if (keyword.trim()) {
        url += `&keyword=${encodeURIComponent(keyword.trim())}`;
      }
      if (classification.trim()) {
        url += `&classificationName=${encodeURIComponent(classification.trim())}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Ticketmaster API error: ${res.statusText}`);
      }

      const data = await res.json();
      // Ticketmaster puts events in data._embedded.events
      return data._embedded ? data._embedded.events : [];
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch events');
    }
  }
);

// 2. Async Thunk to fetch single event details by ID
export const fetchEventById = createAsyncThunk(
  'events/fetchEventById',
  async (eventId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/events/${eventId}.json?apikey=${API_KEY}`);
      if (!res.ok) {
        throw new Error('Event details could not be found');
      }
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load event details');
    }
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    items: [],
    selectedEvent: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedEvent: (state) => {
      state.selectedEvent = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch multiple events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single event detail
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedEvent } = eventsSlice.actions;
export default eventsSlice.reducer;