import { createSlice } from '@reduxjs/toolkit';

// Read saved registrations from localStorage so data persists across reloads
const savedRegistrations = JSON.parse(localStorage.getItem('userRegistrations')) || [];

const registrationSlice = createSlice({
  name: 'registrations',
  initialState: {
    items: savedRegistrations,
    message: null,
  },
  reducers: {
    registerForEvent: (state, action) => {
      const { userId, event } = action.payload;

      // Duplicate prevention: check if this user already registered for this event ID
      const alreadyRegistered = state.items.some(
        (reg) => reg.userId === userId && reg.event.id === event.id
      );

      if (alreadyRegistered) {
        state.message = { type: 'error', text: 'You are already registered for this event.' };
        return;
      }

      const newRegistration = {
        id: `${userId}_${event.id}`,
        userId,
        event: {
          id: event.id,
          name: event.name,
          date: event.dates?.start?.localDate || 'TBA',
          time: event.dates?.start?.localTime || '',
          venue: event._embedded?.venues?.[0]?.name || 'TBA',
          city: event._embedded?.venues?.[0]?.city?.name || '',
          imageUrl: event.images?.[0]?.url || 'https://via.placeholder.com/300x180?text=No+Image',
        },
        registeredAt: new Date().toISOString(),
      };

      state.items.push(newRegistration);
      localStorage.setItem('userRegistrations', JSON.stringify(state.items));
      state.message = { type: 'success', text: 'Successfully registered for this event!' };
    },

    cancelRegistration: (state, action) => {
      const { registrationId } = action.payload;
      // Filter out the registration being canceled
      state.items = state.items.filter((reg) => reg.id !== registrationId);
      localStorage.setItem('userRegistrations', JSON.stringify(state.items));
      state.message = { type: 'info', text: 'Registration has been cancelled.' };
    },

    clearRegistrationMessage: (state) => {
      state.message = null;
    },
  },
});

export const { registerForEvent, cancelRegistration, clearRegistrationMessage } = registrationSlice.actions;
export default registrationSlice.reducer;