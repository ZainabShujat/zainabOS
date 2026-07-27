import { useState } from 'react';
import { useSettingsStore, useVisitorStore } from '../lib/engine/store';

export function ControlsUI() {
  const arrivalPhase = useVisitorStore(s => s.arrivalPhase);
  const viewMode = useSettingsStore(s => s.viewMode);
  const sitTarget = useVisitorStore(s => s.sitTarget);
  const [isOpen, setIsOpen] = useState(true);

  if (arrivalPhase !== 'training' && arrivalPhase !== 'complete') return null;

  if (!isOpen) {
    return (
      <button 
        style={{
          position: 'absolute', bottom: '20px', left: '20px', zIndex: 1000,
          background: 'rgba(15,23,42,0.6)', color: 'white', border: '1px solid rgba(255,255,255,0.2)',
          padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'monospace',
          backdropFilter: 'blur(4px)'
        }}
        onClick={() => setIsOpen(true)}
      >
        Show Controls
      </button>
    );
  }

  return (
    <div style={{
      position: 'absolute', bottom: '20px', left: '20px', zIndex: 1000,
      background: 'rgba(15,23,42,0.8)', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.2)',
      padding: '20px', borderRadius: '8px', fontFamily: 'monospace',
      backdropFilter: 'blur(8px)', minWidth: '250px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', letterSpacing: '1px' }}>Controls</h3>
        <button 
          onClick={() => setIsOpen(false)}
          style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
        >
          ✕
        </button>
      </div>

      {viewMode === 'immersive' ? (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem', lineHeight: '2' }}>
          {sitTarget ? (
            <>
              <li><strong style={{ color: '#ef4444' }}>E</strong> - Stand Up</li>
              <li><strong style={{ color: '#fbbf24' }}>Mouse</strong> - Look around</li>
            </>
          ) : (
            <>
              <li><strong style={{ color: '#fbbf24' }}>W A S D</strong> - Move around</li>
              <li><strong style={{ color: '#fbbf24' }}>Mouse</strong> - Look around</li>
              <li><strong style={{ color: '#fbbf24' }}>Shift</strong> - Walk faster</li>
            </>
          )}
          <li><strong style={{ color: '#fbbf24' }}>Click</strong> - Interact with objects</li>
          <li><strong style={{ color: '#fbbf24' }}>ESC</strong> - Unlock cursor</li>
        </ul>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem', lineHeight: '2' }}>
          <li><strong style={{ color: '#38bdf8' }}>Left Click + Drag</strong> - Rotate Camera</li>
          <li><strong style={{ color: '#38bdf8' }}>Right Click + Drag</strong> - Pan Camera</li>
          <li><strong style={{ color: '#38bdf8' }}>Scroll Wheel</strong> - Zoom In/Out</li>
          <li><strong style={{ color: '#38bdf8' }}>Click</strong> - Interact with objects</li>
        </ul>
      )}
    </div>
  );
}
