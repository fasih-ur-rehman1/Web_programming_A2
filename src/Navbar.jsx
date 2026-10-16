import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from './features/auth/authSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 24px',
        backgroundColor: '#1f2937',
        color: '#fff',
      }}
    >
      <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
        <Link to="/events" style={{ color: '#fff', textDecoration: 'none' }}>
          EventHub
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Link to="/events" style={{ color: '#e5e7eb', textDecoration: 'none' }}>
          Explore Events
        </Link>

        {isAuthenticated ? (
          <>
            <Link to="/my-events" style={{ color: '#e5e7eb', textDecoration: 'none' }}>
              My Events
            </Link>
            <span style={{ color: '#9ca3af', fontSize: '14px' }}>
              Hi, {currentUser?.name}
            </span>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: '#dc2626',
                color: '#fff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#e5e7eb', textDecoration: 'none' }}>
              Login
            </Link>
            <Link
              to="/register"
              style={{
                backgroundColor: '#2563eb',
                color: '#fff',
                textDecoration: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
              }}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}