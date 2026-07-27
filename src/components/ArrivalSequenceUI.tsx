import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore, useVisitorStore } from '../lib/engine/store';

/**
 * ACT III: Mode Selection Cards
 * These are the cinematic cards shown after the fly-in sequence.
 */
export function ModeSelectionUI() {
  const arrivalPhase = useVisitorStore(s => s.arrivalPhase);
  const setArrivalPhase = useVisitorStore(s => s.setArrivalPhase);
  const setViewMode = useSettingsStore(s => s.setViewMode);
  
  const [hoveredCard, setHoveredCard] = useState<'immersive' | 'explorer' | null>(null);

  if (arrivalPhase !== 'modeSelect') return null;

  const handleSelect = (mode: 'immersive' | 'explorer') => {
    setViewMode(mode);
    setArrivalPhase('training'); // Move to ACT IV
  };

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(5px)',
      zIndex: 100,
      pointerEvents: 'auto'
    }}>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        style={{ color: 'white', fontWeight: 300, letterSpacing: '1px', marginBottom: '4rem' }}
      >
        Choose how you want to explore
      </motion.h2>

      <div style={{ display: 'flex', gap: '4rem' }}>
        {/* IMMERSIVE CARD */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          onMouseEnter={() => setHoveredCard('immersive')}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => handleSelect('immersive')}
          style={{
            width: '280px',
            height: '420px',
            background: hoveredCard === 'immersive' ? '#f8fafc' : '#e2e8f0',
            borderRadius: '16px',
            padding: '2rem',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: hoveredCard === 'immersive' ? '0 20px 40px rgba(255,255,255,0.2)' : '0 10px 30px rgba(0,0,0,0.5)',
            transform: hoveredCard === 'immersive' ? 'translateY(-10px)' : 'translateY(0)',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          {/* Subtle decorative border (like a tarot card) */}
          <div style={{
            position: 'absolute', top: '10px', left: '10px', right: '10px', bottom: '10px',
            border: '1px solid #cbd5e1', borderRadius: '10px', pointerEvents: 'none'
          }} />
          
          {/* Gamepad Icon (SVG) */}
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
            <line x1="6" y1="12" x2="10" y2="12"></line>
            <line x1="8" y1="10" x2="8" y2="14"></line>
            <line x1="15" y1="13" x2="15.01" y2="13"></line>
            <line x1="18" y1="11" x2="18.01" y2="11"></line>
            <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"></path>
          </svg>

          <h3 style={{ color: '#0f172a', fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Immersive</h3>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'center', color: '#475569', fontSize: '0.95rem', lineHeight: '1.8' }}>
            <li>First Person</li>
            <li>Walk naturally</li>
            <li>Best experience</li>
            <li style={{ fontWeight: 600, color: '#0f172a', marginTop: '0.5rem' }}>Recommended</li>
          </ul>
        </motion.div>

        {/* EXPLORER CARD */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          onMouseEnter={() => setHoveredCard('explorer')}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => handleSelect('explorer')}
          style={{
            width: '280px',
            height: '420px',
            background: hoveredCard === 'explorer' ? '#1e293b' : '#0f172a',
            borderRadius: '16px',
            padding: '2rem',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: hoveredCard === 'explorer' ? '0 20px 40px rgba(0,0,0,0.8)' : '0 10px 30px rgba(0,0,0,0.5)',
            transform: hoveredCard === 'explorer' ? 'translateY(-10px)' : 'translateY(0)',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          {/* Subtle decorative border (like a tarot card) */}
          <div style={{
            position: 'absolute', top: '10px', left: '10px', right: '10px', bottom: '10px',
            border: '1px solid #334155', borderRadius: '10px', pointerEvents: 'none'
          }} />

          {/* Pillar Icon (SVG) */}
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
            <path d="M4 20h16"></path>
            <path d="M4 4h16"></path>
            <path d="M8 4v16"></path>
            <path d="M16 4v16"></path>
            <path d="M12 4v16"></path>
          </svg>

          <h3 style={{ color: '#f8fafc', fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Explorer</h3>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'center', color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.8' }}>
            <li>Architectural View</li>
            <li>Fly around</li>
            <li>Great for quick exploration</li>
            <li style={{ marginTop: '0.5rem' }}>Perfect on mobile</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * ACT V: The House Recommends
 * Appears after training is complete.
 */
export function RecommendationUI() {
  const arrivalPhase = useVisitorStore(s => s.arrivalPhase);
  const setArrivalPhase = useVisitorStore(s => s.setArrivalPhase);
  const [selected, setSelected] = useState(false);

  if (arrivalPhase !== 'recommendation') return null;

  const handleSelect = () => {
    setSelected(true);
    setTimeout(() => {
      setArrivalPhase('complete'); // ACT VI: Doors unlock
    }, 4000);
  };

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(10px)',
      zIndex: 100,
      pointerEvents: selected ? 'none' : 'auto'
    }}>
      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div
            key="options"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <h2 style={{ color: '#f8fafc', fontWeight: 300, letterSpacing: '1px', marginBottom: '3rem', fontSize: '2rem' }}>
              What brings you here today?
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              {[
                { label: 'AI & Engineering', icon: '🤖' },
                { label: 'Writing & Story', icon: '✍️' },
                { label: 'Learning', icon: '📚' },
                { label: 'Self-Reflection', icon: '🌱' },
                { label: 'Just Exploring', icon: '🌌' }
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={handleSelect}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    color: '#e2e8f0',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(-5px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span style={{ fontSize: '2rem' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.h2
            key="final"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{ color: '#f8fafc', fontWeight: 300, letterSpacing: '2px', fontSize: '2rem' }}
          >
            When you're ready, open the door.
          </motion.h2>
        )}
      </AnimatePresence>
    </div>
  );
}
