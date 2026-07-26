import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVisitorStore } from '../lib/engine/store';

export function TherapyChatUI() {
  const sessionBooked = useVisitorStore(s => s.sessionBooked);
  const setSessionBooked = useVisitorStore(s => s.setSessionBooked);
  const setSitTarget = useVisitorStore(s => s.setSitTarget);
  
  const [messages, setMessages] = useState<{role: 'user'|'caretaker', text: string}[]>([
    { role: 'caretaker', text: 'Welcome. Take a deep breath. What is on your mind today?' }
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput('');

    // Mock AI response for now
    setTimeout(() => {
      const responses = [
        "That sounds heavy. How long have you been carrying that?",
        "I hear you. Does acknowledging it out loud change how it feels?",
        "It's okay to feel that way here. This space is just for you.",
        "What do you think is the root of that feeling?",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { role: 'caretaker', text: randomResponse }]);
    }, 1500);
  };

  const handleEndSession = () => {
    setSitTarget(null);
    setSessionBooked(false);
  };

  return (
    <AnimatePresence>
      {sessionBooked && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '600px',
            height: '60vh',
            background: 'rgba(17, 24, 39, 0.7)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            zIndex: 100,
            pointerEvents: 'auto'
          }}
        >
          <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, color: '#f8fafc', fontSize: '1.2rem', fontWeight: 500 }}>Therapy Session</h2>
            <button 
              onClick={handleEndSession}
              style={{
                background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '0.4rem 1rem', borderRadius: '1rem', cursor: 'pointer', fontSize: '0.8rem'
              }}
            >
              End Session
            </button>
          </div>

          <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((m, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  background: m.role === 'user' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  color: m.role === 'user' ? '#bae6fd' : '#f8fafc',
                  border: m.role === 'user' ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '1rem 1.5rem',
                  borderRadius: '20px',
                  borderBottomRightRadius: m.role === 'user' ? '4px' : '20px',
                  borderBottomLeftRadius: m.role === 'caretaker' ? '4px' : '20px',
                  maxWidth: '80%',
                  lineHeight: '1.5'
                }}
              >
                {m.text}
              </motion.div>
            ))}
            <div ref={endRef} />
          </div>

          <form onSubmit={handleSubmit} style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <input 
              autoFocus
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your thoughts..."
              style={{
                width: '100%', padding: '1rem 1.5rem', borderRadius: '2rem',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'white', outline: 'none', fontSize: '1rem'
              }}
            />
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
