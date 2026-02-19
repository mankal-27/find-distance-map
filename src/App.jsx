import React, { useState } from 'react';
import PhotoUpload from './components/PhotoUpload';
import TravelForm from './components/TravelForm';
import MapDisplay from './components/MapDisplay';
import TravelDetails from './components/TravelDetails';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass } from 'lucide-react';

function App() {
  const [journeyData, setJourneyData] = useState({
    source: '',
    destination: '',
    photo: null,
    routeInfo: null
  });

  const handleFormSubmit = (data) => {
    setJourneyData(prev => ({ ...prev, ...data }));
  };

  const handleImageSelect = (photo) => {
    setJourneyData(prev => ({ ...prev, photo }));
  };

  const handleRouteFound = (routeInfo) => {
    setJourneyData(prev => ({ ...prev, routeInfo }));
  };

  return (
    <div className="app">
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          style={{ display: 'inline-block' }}
        >
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            margin: '0 auto 1.5rem',
            boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)'
          }}>
            <Compass size={48} />
          </div>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Travel Explorer
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}
        >
          Discover distances, routes, and travel alternatives with style.
        </motion.p>
      </header>

      <main>
        <div className="grid">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <PhotoUpload onImageSelect={handleImageSelect} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <TravelForm onSubmit={handleFormSubmit} />
          </motion.div>
        </div>

        <div className="grid">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            style={{ gridColumn: 'span 1' }}
          >
            <div className="card" style={{ height: 'calc(100% - 4rem)' }}>
              <h3 style={{ marginTop: 0 }}>Live Map View</h3>
              <MapDisplay
                source={journeyData.source}
                destination={journeyData.destination}
                onRouteFound={handleRouteFound}
              />
            </div>
          </motion.div>

          <AnimatePresence>
            {(journeyData.source && journeyData.destination) && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ delay: 0.8 }}
              >
                <TravelDetails
                  routeData={journeyData.routeInfo}
                  source={journeyData.source}
                  destination={journeyData.destination}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer style={{ marginTop: '4rem', textAlign: 'center', paddingBottom: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        &copy; 2026 Travel Explorer. Premium Travel Planning Made Simple.
      </footer>
    </div>
  );
}

export default App;
