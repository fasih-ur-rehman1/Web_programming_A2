import { createSlice } from '@reduxjs/toolkit';

// Read saved user data on initial boot so state persists across page refreshes
const savedUser = JSON.parse(localStorage.getItem('currentUser')) || null;
const registeredUsers = JSON.parse(localStorage.getItem('usersDB')) || [];

const initialState = {
  currentUser: savedUser,
  isAuthenticated: !!savedUser,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerUser: (state, action) => {
      const { name, email, password } = action.payload;
      const userExists = registeredUsers.some(u => u.email === email);

      if (userExists) {
        state.error = 'Email is already registered.';
        return;
      }

      const newUser = { id: Date.now().toString(), name, email, password };
      registeredUsers.push(newUser);
      localStorage.setItem('usersDB', JSON.stringify(registeredUsers));

      // Auto-login upon registration
      state.currentUser = { id: newUser.id, name: newUser.name, email: newUser.email };
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
    },

    loginUser: (state, action) => {
      const { email, password } = action.payload;
      const allUsers = JSON.parse(localStorage.getItem('usersDB')) || [];
      const user = allUsers.find(u => u.email === email && u.password === password);

      if (!user) {
        state.error = 'Invalid email or password.';
        return;
      }

      state.currentUser = { id: user.id, name: user.name, email: user.email };
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
    },

    logoutUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('currentUser');
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const { registerUser, loginUser, logoutUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;