import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface UIOverlayProps {
  focusedObject: string | null;
  onClose: () => void;
}

export function UIOverlay({ focusedObject, onClose }: UIOverlayProps) {
  const [graphData, setGraphData] = useState<any>(null);

  useEffect(() => {
    // Fetch the compiled graph data from the public folder
    fetch('/graph.json')
      .then(res => res.json())
      .then(data => setGraphData(data))
      .catch(err => console.error("Could not load graph.json", err));
  }, []);

  return (
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
  );
}
