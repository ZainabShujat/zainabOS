import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVisitorStore } from '../lib/engine/store';

export function ArrivalTextOverlay() {
  const arrivalPhase = useVisitorStore(s => s.arrivalPhase);
  const setArrivalPhase = useVisitorStore(s => s.setArrivalPhase);

  useEffect(() => {
    if (arrivalPhase === 'introText') {
      // Just one timeout to move to the next phase after the full sequence finishes
      const t = setTimeout(() => setArrivalPhase('modeSelect'), 8000);
      return () => clearTimeout(t);
    }
  }, [arrivalPhase, setArrivalPhase]);

  return (
    <AnimatePresence>
      {arrivalPhase === 'introText' && (
        <motion.div 
          key="arrival-sequence"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          style={{
            position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
            pointerEvents: 'none', zIndex: 9999,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: 'white', fontSize: '2rem', textShadow: '0 4px 10px rgba(0,0,0,0.8)' }} id="welcome-text-overlay">
            
            {/* ACT I: Welcome */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, delay: 1 }}
              style={{ position: 'relative', marginBottom: '2rem' }}
            >
              <h1 style={{ fontWeight: 300, letterSpacing: '2px' }}>Welcome.</h1>
              <h2 style={{ fontWeight: 300, color: '#94a3b8', fontSize: '1.5rem', marginTop: '1rem' }}>This isn't a portfolio. It's a place.</h2>
            </motion.div>

            {/* ACT II: Context */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, delay: 4 }}
              style={{ position: 'relative' }}
            >
              <h2 style={{ fontWeight: 300, letterSpacing: '1px' }}>Everything here exists for a reason.</h2>
              <h2 style={{ fontWeight: 300, color: '#94a3b8', fontSize: '1.5rem', marginTop: '1rem' }}>Take your time.</h2>
            </motion.div>

          </div>

          {/* SKIP BUTTON */}
          <button 
            style={{ 
              position: 'absolute', bottom: '40px', right: '40px', pointerEvents: 'auto',
              background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.3)',
              padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'monospace'
            }}
            onClick={() => setArrivalPhase('modeSelect')}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            Skip Intro →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
