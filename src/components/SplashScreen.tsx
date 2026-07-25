import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onEnter: () => void;
  started: boolean;
}

export function SplashScreen({ onEnter, started }: SplashScreenProps) {
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
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{ fontSize: '2rem', letterSpacing: '0.2em', marginBottom: '2rem' }}
          >
            zainabOS
          </motion.h1>

          <motion.button
            onClick={onEnter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            style={{
              padding: '12px 32px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#94a3b8',
              cursor: 'pointer',
              letterSpacing: '0.1em',
              transition: 'all 0.3s ease',
              borderRadius: '4px'
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
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
