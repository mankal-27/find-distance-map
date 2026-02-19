import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon issue in Leaflet + React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper component to update map view
function MapAutoCenter({ bounds }) {
    const map = useMap();
    useEffect(() => {
        if (bounds && bounds.length > 0) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [bounds, map]);
    return null;
}

export default function MapDisplay({ source, destination, onRouteFound }) {
    const [route, setRoute] = useState(null);
    const [error, setError] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [bounds, setBounds] = useState(null);

    useEffect(() => {
        if (!source || !destination) return;

        const fetchRoute = async () => {
            try {
                setError(null);

                // Geocode source and destination using Nominatim
                const geocode = async (query) => {
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
                    const data = await response.json();
                    if (data && data.length > 0) {
                        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
                    }
                    throw new Error(`Location not found: ${query}`);
                };

                const startCoords = await geocode(source);
                const endCoords = await geocode(destination);

                // Get route from OSRM
                // Note: OSRM uses [lon, lat] format for coordinates in the URL
                const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startCoords[1]},${startCoords[0]};${endCoords[1]},${endCoords[0]}?overview=full&geometries=geojson`;

                const response = await fetch(osrmUrl);
                const data = await response.json();

                if (data.code !== 'Ok') {
                    throw new Error('Routing service unavailable or failed');
                }

                const routeData = data.routes[0];
                const polyline = routeData.geometry.coordinates.map(coord => [coord[1], coord[0]]); // Convert back to [lat, lon]

                setRoute(polyline);
                setMarkers([startCoords, endCoords]);

                // Calculate bounds for fitting
                const latLngs = polyline.map(p => L.latLng(p[0], p[1]));
                setBounds(L.latLngBounds(latLngs));

                if (onRouteFound) {
                    onRouteFound({
                        distance: (routeData.distance / 1609.34).toFixed(1) + ' miles',
                        duration: Math.round(routeData.duration / 60) + ' mins',
                        startAddress: source,
                        endAddress: destination
                    });
                }
            } catch (err) {
                console.error('OSM error:', err);
                setError(err.message);
            }
        };

        fetchRoute();
    }, [source, destination]);

    const mapContainerStyle = {
        width: '100%',
        height: '100%',
        background: '#1a1a2e'
    };

    return (
        <div className="map-container" style={{ position: 'relative', overflow: 'hidden' }}>
            <MapContainer
                center={[37.7749, -122.4194]}
                zoom={13}
                style={mapContainerStyle}
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                {route && <Polyline positions={route} color="#3b82f6" weight={5} opacity={0.7} />}

                {markers.map((pos, idx) => (
                    <Marker key={idx} position={pos} />
                ))}

                <MapAutoCenter bounds={bounds} />
            </MapContainer>

            {error && (
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(251, 113, 133, 0.9)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    zIndex: 1000
                }}>
                    {error}
                </div>
            )}

            {(!source || !destination) && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(26, 26, 46, 0.7)',
                    pointerEvents: 'none',
                    zIndex: 1000
                }}>
                    <p className="text-muted">Enter locations to see the route</p>
                </div>
            )}
        </div>
    );
}

