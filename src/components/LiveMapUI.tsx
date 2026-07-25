import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVisitorStore } from '../lib/engine/store';

export function LiveMapUI() {
  const showMap = useVisitorStore(s => s.showMap);
  const setShowMap = useVisitorStore(s => s.setShowMap);
  const currentRoom = useVisitorStore(s => s.currentRoom);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'm' || e.key === 'M') {
        setShowMap(!showMap);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showMap, setShowMap]);

  return (
    <AnimatePresence>
      {showMap && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          style={{
            position: 'absolute', top: '10%', left: '10%', width: '80%', height: '80%',
            background: 'rgba(10, 10, 10, 0.95)', backdropFilter: 'blur(20px)',
            border: '2px solid rgba(255, 255, 255, 0.1)', borderRadius: '24px',
            color: '#f8fafc', padding: '3rem', zIndex: 100, pointerEvents: 'auto',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <button 
            onClick={() => setShowMap(false)}
            style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem' }}
          >
            Esc
          </button>
          
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#38bdf8', letterSpacing: '2px' }}>YOU ARE HERE</h2>
          
          <div style={{ fontFamily: 'monospace', whiteSpace: 'pre', fontSize: '1rem', lineHeight: '1.5rem', color: '#64748b' }}>
{`
                   [Astronomy Corner]       [Math Corner]
                             │                    │
                      ┌──────┴────────────────────┴──────┐
                      │                                  │
 [Chronicles Library] ├──          [The Hallway]         ┤── [AI Laboratory]
                      │                                  │
                      │                                  │
       [Therapy Room] ├──                                ┤── [Freelance Studio]
                      │                                  │
                      └──────────────────┬───────────────┘
                                         │
                                      [Study]
                                      (Foyer)
`}
          </div>

          <div style={{ marginTop: '2rem', color: '#fbbf24', fontSize: '1.2rem', fontWeight: 'bold' }}>
            Current Location: {currentRoom}
          </div>
          <div style={{ marginTop: '1rem', color: '#475569', fontSize: '0.9rem' }}>
            Press 'M' to close map
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
