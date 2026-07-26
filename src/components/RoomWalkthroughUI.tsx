import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVisitorStore, Room } from '../lib/engine/store';

const roomWalkthroughs: Partial<Record<Room, { title: string; points: string[] }>> = {
  Study: {
    title: "The Foyer",
    points: [
      "Use WASD to move, mouse to look.",
      "Click the door to explore the house.",
      "Hover over objects to see interactions."
    ]
  },
  Hallway: {
    title: "The Hallway",
    points: [
      "This corridor connects all spaces.",
      "Follow the signs to find new rooms.",
      "Click doors to transition seamlessly."
    ]
  },
  TherapyRoom: {
    title: "The Grounding Station",
    points: [
      "A quiet place to slow down.",
      "Have a seat on the couch.",
      "Click the holographic clipboard to book a session."
    ]
  }
};

export function RoomWalkthroughUI() {
  const currentRoom = useVisitorStore(s => s.currentRoom);
  const [isVisible, setIsVisible] = useState(false);
  const walkthrough = roomWalkthroughs[currentRoom];

  useEffect(() => {
    if (!walkthrough) return;

    // Show the walkthrough when entering a new room
    setIsVisible(true);

    // Auto-hide after 8 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, [currentRoom, walkthrough]);

  return (
    <AnimatePresence>
      {isVisible && walkthrough && (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'absolute',
            top: '5rem',
            left: '2rem',
            background: 'rgba(17, 17, 17, 0.75)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            color: '#f8fafc',
            padding: '1.5rem',
            width: '320px',
            zIndex: 40,
            pointerEvents: 'auto',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
          }}
        >
          <button 
            onClick={() => setIsVisible(false)}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            ×
          </button>
          
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#38bdf8', fontWeight: 'bold' }}>
            {walkthrough.title}
          </h3>
          
          <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6' }}>
            {walkthrough.points.map((point, i) => (
              <li key={i} style={{ marginBottom: '0.5rem' }}>{point}</li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
