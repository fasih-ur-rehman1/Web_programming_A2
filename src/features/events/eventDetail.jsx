import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEventById, clearSelectedEvent } from './eventsSlice';

export default function EventDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedEvent, loading, error } = useSelector((state) => state.events);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchEventById(id));
    return () => {
      dispatch(clearSelectedEvent());
    };
  }, [dispatch, id]);

  if (loading) return <p style={{ padding: '20px' }}>Loading event details...</p>;
  if (error) return <p style={{ padding: '20px', color: 'red' }}>Error: {error}</p>;
  if (!selectedEvent) return null;

  const image = selectedEvent.images?.[0]?.url;
  const venue = selectedEvent._embedded?.venues?.[0];
  const segment = selectedEvent.classifications?.[0]?.segment?.name || 'General';
  const genre = selectedEvent.classifications?.[0]?.genre?.name || '';
  const date = selectedEvent.dates?.start?.localDate || 'TBA';
  const time = selectedEvent.dates?.start?.localTime || 'TBA';
  const priceRange = selectedEvent.priceRanges?.[0]
    ? `${selectedEvent.priceRanges[0].min} - ${selectedEvent.priceRanges[0].max} ${selectedEvent.priceRanges[0].currency}`
    : 'Not Specified';

  return (
    <div style={{ maxWidth: '850px', margin: '30px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <Link to="/events" style={{ textDecoration: 'none', color: '#007bff' }}>← Back to Events</Link>
      
      <h1 style={{ marginTop: '15px' }}>{selectedEvent.name}</h1>
      <p style={{ color: '#666' }}>{segment} {genre && `• ${genre}`}</p>

      {image && (
        <img
          src={image}
          alt={selectedEvent.name}
          style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', borderRadius: '6px', margin: '15px 0' }}
        />
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px', margin: '20px 0' }}>
        <div>
          <h4>Date & Time</h4>
          <p>Date: {date}</p>
          <p>Time: {time}</p>
        </div>
        <div>
          <h4>Venue & Location</h4>
          <p>Venue: {venue?.name || 'TBA'}</p>
          <p>Address: {venue?.address?.line1 || ''}, {venue?.city?.name || ''}</p>
        </div>
        <div>
          <h4>Pricing & Status</h4>
          <p>Price: {priceRange}</p>
          <p>Status: {selectedEvent.dates?.status?.code || 'Active'}</p>
        </div>
      </div>

      {/* Action banner: prompt login or ready to register */}
      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
        {isAuthenticated ? (
          <p style={{ margin: 0, color: '#28a745', fontWeight: 'bold' }}>
            ✓ Ready for registration (we connect the Register action in Step 5).
          </p>
        ) : (
          <p style={{ margin: 0 }}>
            Want to attend? <Link to="/login">Login</Link> or <Link to="/register">Register</Link> to save this event.
          </p>
        )}
      </div>
    </div>
  );
}