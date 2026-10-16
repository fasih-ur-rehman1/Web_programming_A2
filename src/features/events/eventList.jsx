import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchEvents } from './eventsSlice';

export default function EventList() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.events);

  // Local state for search and category filters
  const [keyword, setKeyword] = useState('');
  const [classification, setClassification] = useState('');

  // Fetch initial events on first mount
  useEffect(() => {
    dispatch(fetchEvents({ keyword: '', classification: '' }));
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchEvents({ keyword, classification }));
  };

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setClassification(selected);
    dispatch(fetchEvents({ keyword, classification: selected }));
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      <h1>Explore Events</h1>

      {/* Search and Filter Form */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '25px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search by artist, team, or event name..."
          style={{ flex: '1', minWidth: '220px', padding: '10px' }}
        />

        <select
          value={classification}
          onChange={handleCategoryChange}
          style={{ padding: '10px', minWidth: '160px' }}
        >
          <option value="">All Categories</option>
          <option value="Music">Music</option>
          <option value="Sports">Sports</option>
          <option value="Arts & Theatre">Arts & Theatre</option>
          <option value="Film">Film</option>
          <option value="Miscellaneous">Miscellaneous</option>
        </select>

        <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Search
        </button>
      </form>

      {/* Loading & Error States */}
      {loading && <p>Loading events from Ticketmaster...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {/* Empty State */}
      {!loading && !error && items.length === 0 && (
        <p>No events found. Try adjusting your keyword or category filter.</p>
      )}

      {/* Event Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {items.map((event) => {
          const image = event.images?.[0]?.url || 'https://via.placeholder.com/300x180?text=No+Image';
          const venue = event._embedded?.venues?.[0]?.name || 'Venue TBA';
          const city = event._embedded?.venues?.[0]?.city?.name || '';
          const date = event.dates?.start?.localDate || 'Date TBA';
          const category = event.classifications?.[0]?.segment?.name || 'General';

          return (
            <div
              key={event.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
              }}
            >
              <img
                src={image}
                alt={event.name}
                style={{ width: '100%', height: '170px', objectFit: 'cover' }}
              />
              <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <span style={{ fontSize: '12px', color: '#007bff', fontWeight: 'bold' }}>{category}</span>
                <h3 style={{ margin: '8px 0', fontSize: '18px' }}>{event.name}</h3>
                <p style={{ margin: '4px 0', color: '#555', fontSize: '14px' }}>📅 {date}</p>
                <p style={{ margin: '4px 0', color: '#555', fontSize: '14px' }}>
                  📍 {venue}{city ? `, ${city}` : ''}
                </p>
                <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
                  <Link
                    to={`/events/${event.id}`}
                    style={{
                      display: 'inline-block',
                      padding: '8px 14px',
                      background: '#17a2b8',
                      color: '#fff',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}