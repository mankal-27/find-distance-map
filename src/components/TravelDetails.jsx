import React from 'react';
import { Car, Footprints, Bike, Bus, Clock, Ruler, Plane, Train } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TravelDetails({ routeData, source, destination }) {
    if (!routeData && (!source || !destination)) return null;

    // Use real data if available, else use estimates
    const distance = routeData?.distance || "Calculating...";
    const duration = routeData?.duration || "Calculating...";

    const alternatives = [
        { mode: 'Driving', icon: <Car size={18} />, time: duration, color: '#6366f1' },
        { mode: 'Bus', icon: <Bus size={18} />, time: routeData ? (parseFloat(duration) * 1.5).toFixed(1) + ' hrs' : 'Calculating...', color: '#ec4899' },
        { mode: 'Train', icon: <Train size={18} />, time: routeData ? (parseFloat(duration) * 0.8).toFixed(1) + ' hrs' : 'Check Schedule', color: '#10b981' },
        { mode: 'Flight', icon: <Plane size={18} />, time: routeData ? (parseFloat(distance) > 500 ? (parseFloat(distance) / 800 + 2).toFixed(1) + ' hrs' : 'Too short for flight') : 'Calculating...', color: '#f59e0b' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
            style={{ marginTop: '2rem' }}
        >
            <h3 style={{ marginTop: 0 }}>Journey Overview</h3>
            <div className="stats-grid">
                <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                        <Ruler size={16} className="text-muted" />
                        <span className="stat-label">Total Distance</span>
                    </div>
                    <div className="stat-value">{distance}</div>
                </div>
                <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                        <Clock size={16} className="text-muted" />
                        <span className="stat-label">Estimated Time</span>
                    </div>
                    <div className="stat-value">{duration}</div>
                </div>
            </div>

            <h4 style={{ marginBottom: '1rem', marginTop: '1.5rem' }}>Travel Alternatives</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {alternatives.map((alt, index) => (
                    <motion.div
                        key={alt.mode}
                        whileHover={{ scale: 1.02, x: 5 }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1rem',
                            background: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: '12px',
                            border: '1px solid var(--border-card)',
                            borderLeft: `4px solid ${alt.color}`
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <div style={{ color: alt.color }}>{alt.icon}</div>
                            <span style={{ fontWeight: 600 }}>{alt.mode}</span>
                        </div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{alt.time}</span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
