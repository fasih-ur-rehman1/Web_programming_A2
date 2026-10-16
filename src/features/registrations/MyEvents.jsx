import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { cancelRegistration } from './registrationSlice';

export default function MyEvents() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const { items: allRegistrations, message } = useSelector((state) => state.registrations);

  // Filter registrations for the currently logged-in user
  const userRegistrations = allRegistrations.filter(
    (reg) => reg.userId === currentUser?.id
  );

  // Today's date in YYYY-MM-DD format to compare against event dates
  const today = new Date().toISOString().split('T')[0];

  const upcomingEvents = userRegistrations.filter((reg) => reg.event.date >= today);
  const completedEvents = userRegistrations.filter((reg) => reg.event.date < today);

  const handleCancel = (registrationId) => {
    if (window.confirm('Are you sure you want to cancel this registration?')) {
      dispatch(cancelRegistration({ registrationId }));
    }
  };

  const renderEventCard = (reg, isCompleted) => (
    <div
      key={reg.id}
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '15px',
        display: 'flex',
        gap: '15px',
        alignItems: 'center',
        marginBottom: '12px',
        backgroundColor: isCompleted ? '#f9f9f9' : '#fff',
        opacity: isCompleted ? 0.75 : 1,
      }}
    >
      <img
        src={reg.event.imageUrl}
        alt={reg.event.name}
        style={{ width: '100px', height: '70px', objectFit: 'cover', borderRadius: '4px' }}
      />
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: '0 0 5px 0' }}>{reg.event.name}</h4>
        <p style={{ margin: '0', fontSize: '14px', color: '#555' }}>
          📅 {reg.event.date} {reg.event.time ? `at ${reg.event.time}` : ''}
        </p>
        <p style={{ margin: '0', fontSize: '14px', color: '#555' }}>
          📍 {reg.event.venue}{reg.event.city ? `, ${reg.event.city}` : ''}
        </p>
      </div>
      <div>
        {!isCompleted && (
          <button
            onClick={() => handleCancel(reg.id)}
            style={{
              padding: '8px 12px',
              backgroundColor: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        )}
        {isCompleted && (
          <span style={{ fontSize: '13px', color: '#6c757d', fontWeight: 'bold' }}>
            Completed
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '900px', margin: '30px auto', padding: '20px' }}>
      <h2>My Registered Events</h2>
      <p style={{ color: '#666' }}>Logged in as: <strong>{currentUser?.name}</strong> ({currentUser?.email})</p>

      {message && (
        <div style={{
          padding: '10px 15px',
          marginBottom: '15px',
          borderRadius: '4px',
          backgroundColor: '#cce5ff',
          color: '#004085'
        }}>
          {message.text}
        </div>
      )}

      {userRegistrations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p>You have not registered for any events yet.</p>
          <Link to="/events" style={{ color: '#007bff', fontWeight: 'bold' }}>Browse Events</Link>
        </div>
      ) : (
        <>
          <h3 style={{ marginTop: '25px', color: '#28a745' }}>
            Upcoming Events ({upcomingEvents.length})
          </h3>
          {upcomingEvents.length === 0 ? (
            <p style={{ color: '#777' }}>No upcoming events scheduled.</p>
          ) : (
            upcomingEvents.map((reg) => renderEventCard(reg, false))
          )}

          <h3 style={{ marginTop: '35px', color: '#6c757d' }}>
            Completed Events ({completedEvents.length})
          </h3>
          {completedEvents.length === 0 ? (
            <p style={{ color: '#777' }}>No completed events.</p>
          ) : (
            completedEvents.map((reg) => renderEventCard(reg, true))
          )}
        </>
      )}
    </div>
  );
}