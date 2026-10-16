import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import EventList from './features/events/eventList';
import EventDetail from './features/events/eventDetail';
import Login from './features/auth/login';
import Register from './features/auth/register';
import MyEvents from './features/registrations/MyEvents';
import ProtectedRoute from './ProtectedRoute';

export default function App() {
  return (
    <div>
      <Navbar />
      <main style={{ minHeight: '80vh', padding: '10px' }}>
        <Routes>
          {/* Default redirect to events */}
          <Route path="/" element={<Navigate to="/events" replace />} />
          
          {/* Public Views */}
          <Route path="/events" element={<EventList />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected View */}
          <Route
            path="/my-events"
            element={
              <ProtectedRoute>
                <MyEvents />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/events" replace />} />
        </Routes>
      </main>
    </div>
  );
}