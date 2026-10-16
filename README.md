# Event Management System (EMS)

A web application built with **React**, **Redux Toolkit**, **React Router**, and the **Ticketmaster Discovery API**.

---

## Features

- **User Authentication (Frontend Simulation):**
  - Registration (Name, Email, Password) with duplicate validation.
  - Login/Logout session management.
  - State persistence across page refreshes via `localStorage`.

- **Event Exploration & Discovery:**
  - Live event browsing powered by Ticketmaster Discovery API.
  - Real-time keyword search (artist, team, or venue name).
  - Category filtering (Music, Sports, Arts & Theatre, Film, Miscellaneous).
  - Detailed single-event views showing dates, timings, venues, and pricing.

- **Event Registration & Management:**
  - Authenticated event registration with duplicate prevention.
  - Immediate visual feedback notifications on actions.
  - Dedicated **My Events** section partitioned into:
    - **Upcoming Events** (with cancellation option).
    - **Completed Events** (archived history).

---

## Technologies Used

- **React.js** (Functional Components & Hooks)
- **Redux Toolkit (`@reduxjs/toolkit`)**: Global state slices (`authSlice`, `eventsSlice`, `registrationSlice`).
- **React-Redux**: Store provider and `useSelector` / `useDispatch` bindings.
- **React Router (`react-router-dom`)**: Client-side declarative routing and protected routes.
- **Ticketmaster Discovery API v2**: Real-world external event ingestion.
- **Vite**: Modern tooling and bundling environment.

---
