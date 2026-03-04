/**
 * Geocode an address/place name to lat/lng using OpenStreetMap Nominatim.
 * Free, no API key required. Rate-limited to 1 req/sec by Nominatim policy.
 */
const geocodeAddress = async (query) => {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'PlacesApp/1.0 (proximity-search)' },
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name,
      };
    }
    return null;
  } catch (err) {
    console.error('Geocoding error:', err.message);
    return null;
  }
};

export default geocodeAddress;
