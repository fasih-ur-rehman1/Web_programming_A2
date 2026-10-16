import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import eventsReducer from './features/events/eventsSlice';
import registrationReducer from './features/registrations/registrationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    registrations: registrationReducer
  }
});