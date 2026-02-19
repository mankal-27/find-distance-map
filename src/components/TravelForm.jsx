import React, { useState } from 'react';
import { MapPin, Navigation, Send } from 'lucide-react';

export default function TravelForm({ onSubmit }) {
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (source && destination) {
            onSubmit({ source, destination });
        }
    };

    return (
        <div className="card">
            <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Navigation size={20} className="text-primary" />
                Plan Your Journey
            </h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <label className="label">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <MapPin size={14} /> Current Location
                        </span>
                    </label>
                    <input
                        type="text"
                        placeholder="E.g., San Francisco, CA"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="label">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Navigation size={14} /> Where do you want to travel?
                        </span>
                    </label>
                    <input
                        type="text"
                        placeholder="E.g., Los Angeles, CA"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" style={{ marginTop: '0.5rem', width: '100%' }}>
                    Explore Routes
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
}
