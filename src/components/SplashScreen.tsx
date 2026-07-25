import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playUIClick } from '../lib/audio';

interface SplashScreenProps {
  onEnter: () => void;
  started: boolean;
}

export function SplashScreen({ onEnter, started }: SplashScreenProps) {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    playUIClick();
    if (step < 3) {
      setStep(s => s + 1);
    } else {
      onEnter();
    }
  };

  return (
    <AnimatePresence>
      {!started && (
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
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.8 }}
                >
                  <h1 style={{ fontSize: '2rem', letterSpacing: '0.2em', marginBottom: '1.5rem' }}>zainabOS</h1>
                  <p style={{ color: '#94a3b8', fontSize: '1.2rem', lineHeight: '1.6' }}>
                    This is not a portfolio.<br />
                    This is a place.
                  </p>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 style={{ fontSize: '1.5rem', letterSpacing: '0.1em', marginBottom: '2rem', color: '#fbbf24' }}>Controls</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', textAlign: 'left', color: '#cbd5e1' }}>
                    <div>
                      <strong style={{ color: '#f8fafc' }}>Movement</strong><br />
                      W A S D to Walk<br />
                      Mouse to Look
                    </div>
                    <div>
                      <strong style={{ color: '#f8fafc' }}>Interaction</strong><br />
                      Look at objects (Center Dot)<br />
                      Left Click to interact
                    </div>
                    <div>
                      <strong style={{ color: '#f8fafc' }}>Posture</strong><br />
                      Press <kbd style={{ background: '#334155', padding: '2px 6px', borderRadius: '4px' }}>E</kbd> to stand up
                    </div>
                    <div>
                      <strong style={{ color: '#f8fafc' }}>Cursor</strong><br />
                      Press <kbd style={{ background: '#334155', padding: '2px 6px', borderRadius: '4px' }}>ESC</kbd> to unlock mouse
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 style={{ fontSize: '1.5rem', letterSpacing: '0.1em', marginBottom: '2rem', color: '#38bdf8' }}>Suggested Actions</h2>
                  <ul style={{ color: '#cbd5e1', textAlign: 'left', listStyle: 'none', padding: 0, fontSize: '1.1rem', lineHeight: '2' }}>
                    <li><span style={{ color: '#38bdf8' }}>→</span> Read the notebook on the desk.</li>
                    <li><span style={{ color: '#38bdf8' }}>→</span> Walk into the Hallway.</li>
                    <li><span style={{ color: '#38bdf8' }}>→</span> Take a seat in The Grounding Station.</li>
                  </ul>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 style={{ fontSize: '1.5rem', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>Are you ready?</h2>
                  <p style={{ color: '#94a3b8' }}>Please wear headphones for the best experience.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{ marginTop: '3rem' }}
          >
            <button
              onClick={handleNext}
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
              {step === 3 ? 'ENTER' : 'CONTINUE'}
            </button>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
