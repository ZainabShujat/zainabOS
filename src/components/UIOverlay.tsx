import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimeStore, useSettingsStore } from '../lib/engine/store';

interface UIOverlayProps {
  focusedObject: string | null;
  onClose: () => void;
}

export function UIOverlay({ focusedObject, onClose }: UIOverlayProps) {
  const [graphData, setGraphData] = useState<any>(null);
  const [showSettings, setShowSettings] = useState(false);

  const mouseSensitivity = useSettingsStore(s => s.mouseSensitivity);
  const setMouseSensitivity = useSettingsStore(s => s.setMouseSensitivity);
  const moveSpeed = useSettingsStore(s => s.moveSpeed);
  const setMoveSpeed = useSettingsStore(s => s.setMoveSpeed);

  useEffect(() => {
    // Fetch the compiled graph data from the public folder
    fetch('/graph.json')
      .then(res => res.json())
      .then(data => setGraphData(data))
      .catch(err => console.error("Could not load graph.json", err));
  }, []);

  return (
    <>
    <AnimatePresence>
      {focusedObject && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            position: 'absolute',
            top: '5%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            maxWidth: '800px',
            maxHeight: '90vh',
            background: 'rgba(17, 17, 17, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            color: '#f8fafc',
            padding: '2rem',
            overflowY: 'auto',
            pointerEvents: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}
        >
          <button 
            onClick={onClose}
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
            Esc
          </button>

          {focusedObject === 'laptop' && (
            <div>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#38bdf8' }}>zainabOS terminal</h2>
              <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Welcome to the digital nervous system. Here are the active projects in the Knowledge Graph:</p>
              
              {graphData?.nodes?.filter((n: any) => n.type === 'project').map((project: any) => (
                <div key={project.id} style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  <h3 style={{ fontSize: '1.2rem', color: '#f8fafc' }}>{project.title}</h3>
                  <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginTop: '0.5rem' }}>{project.content}</p>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>Status: Active</div>
                </div>
              ))}
            </div>
          )}

          {focusedObject === 'notebook' && (
            <div>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#fbbf24' }}>Personal Notebook</h2>
              <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Scattered thoughts and articles.</p>
              
              {graphData?.nodes?.filter((n: any) => n.type === 'article').map((article: any) => (
                <div key={article.id} style={{ marginBottom: '1.5rem', padding: '1rem', borderLeft: '2px solid #fbbf24' }}>
                  <h3 style={{ fontSize: '1.2rem', color: '#f8fafc' }}>{article.title}</h3>
                  <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginTop: '0.5rem' }}>{article.content}</p>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>Date: {article.metadata?.date || 'Unknown'}</div>
                </div>
              ))}
            </div>
          )}

        </motion.div>
      )}
    </AnimatePresence>

    {/* Settings Modal */}
    {showSettings && (
      <div style={{
        position: 'absolute', bottom: '5rem', left: '1rem',
        background: 'rgba(17, 17, 17, 0.8)', backdropFilter: 'blur(10px)',
        padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)',
        color: 'white', width: '250px', zIndex: 50
      }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '1rem' }}>Controls</h3>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <label style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Look Sensitivity</label>
            <span style={{ fontSize: '0.75rem' }}>{mouseSensitivity.toFixed(1)}</span>
          </div>
          <input type="range" min="0.1" max="2" step="0.1" value={mouseSensitivity} onChange={e => setMouseSensitivity(parseFloat(e.target.value))} style={{ width: '100%' }} />
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <label style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Move Speed</label>
            <span style={{ fontSize: '0.75rem' }}>{moveSpeed}</span>
          </div>
          <input type="range" min="5" max="30" step="1" value={moveSpeed} onChange={e => setMoveSpeed(parseFloat(e.target.value))} style={{ width: '100%' }} />
        </div>
      </div>
    )}

    {/* Settings Button */}
    <button 
      onClick={() => setShowSettings(!showSettings)} 
      style={{
        position: 'absolute', bottom: '1rem', left: '1rem', padding: '0.75rem',
        background: 'rgba(17, 17, 17, 0.5)', border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '50%', color: 'white', cursor: 'pointer', zIndex: 50
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
    </button>
    </>
  );
}
