import { useState, useRef, useEffect } from 'react';
import { useRealtimeChat } from '../hooks/useRealtimeChat';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { BottomNav } from '../components/BottomNav';
import { Send, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';

export const Chat = () => {
  const { messages } = useRealtimeChat();
  const { profile } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !profile) return;

    await supabase.from('messages').insert({
      sender_id: profile.id,
      message_text: newMessage.trim(),
    });

    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] pb-16">
      <header className="px-4 py-4 border-b border-[var(--theme-border)] flex items-center justify-center sticky top-0 z-40 bg-[var(--theme-bg)]/80 backdrop-blur-xl">
        <h1 className="font-bold text-lg">Bakchodi Chat</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-full text-[var(--theme-text-muted)]">
             <p>No messages yet.</p>
             <p className="text-sm">Someone say something first. 😭</p>
           </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === profile?.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${isMe ? 'bg-[var(--theme-accent)] text-white rounded-br-sm' : 'bg-[var(--theme-card-secondary)] border border-[var(--theme-border)] text-[var(--theme-text)] rounded-bl-sm'}`}>
                  <p className="text-sm">{msg.message_text}</p>
                  <p className={`text-[10px] mt-1 ${isMe ? 'text-zinc-600' : 'text-[var(--theme-text-muted)]'}`}>
                    {format(new Date(msg.created_at), 'h:mm a')}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </main>

      <div className="bg-[var(--theme-bg)] p-3 border-t border-[var(--theme-border)] pb-safe">
        <form onSubmit={handleSend} className="flex items-center gap-2 max-w-md mx-auto relative">
          <button type="button" className="p-2 text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors">
            <ImageIcon size={20} />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Message..."
            className="flex-1 bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-full px-4 py-2.5 text-sm text-[var(--theme-text)] focus:outline-none focus:border-zinc-500"
          />
          <button type="submit" disabled={!newMessage.trim()} className="p-2.5 bg-[var(--theme-accent)] text-white rounded-full disabled:opacity-50 transition-opacity">
            <Send size={18} />
          </button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
};
