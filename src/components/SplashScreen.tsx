import { motion, AnimatePresence } from 'framer-motion';
import { playUIClick } from '../lib/audio';
import { useVisitorStore, useTimeStore } from '../lib/engine/store';

export function LandingScreen() {
  const arrivalPhase = useVisitorStore(s => s.arrivalPhase);
  const setArrivalPhase = useVisitorStore(s => s.setArrivalPhase);

  const setTimeOfDay = useTimeStore(s => s.setTimeOfDay);

  const handleEnter = () => {
    playUIClick();
    setTimeOfDay('Afternoon'); // Ensure the environment is well-lit for the intro!
    setArrivalPhase('introText');
  };

  if (arrivalPhase !== 'landing') return null;

  return (
    <AnimatePresence>
      <motion.div
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#0a0a0a',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#f8fafc',
          fontFamily: 'monospace'
        }}
      >
        <div style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', maxWidth: '600px', padding: '0 20px' }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 style={{ fontSize: '2.5rem', letterSpacing: '0.2em', marginBottom: '1rem' }}>zainabOS</h1>
            <p style={{ fontSize: '1rem', color: '#94a3b8', maxWidth: '400px', lineHeight: '1.6', margin: '0 auto 2rem auto' }}>
              An interactive 3D portfolio and virtual environment. Step inside to explore my work, thoughts, and digital presence.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{ marginTop: '3rem' }}
        >
          <button
            onClick={handleEnter}
            style={{
              padding: '12px 32px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#94a3b8',
              cursor: 'pointer',
              letterSpacing: '0.1em',
              transition: 'all 0.3s ease',
              borderRadius: '4px',
              fontSize: '1rem',
              fontFamily: 'monospace'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.8)';
              e.currentTarget.style.color = '#f8fafc';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.color = '#94a3b8';
            }}
          >
            ENTER
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
