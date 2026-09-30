const fs = require('fs');
const path = require('path');

const files = {
  'src/pages/Chat.tsx': `import { useState, useRef, useEffect } from 'react';
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
    <div className="flex flex-col h-screen bg-gray-50 pb-16">
      <header className="bg-white px-4 py-4 border-b border-gray-100 flex items-center justify-center sticky top-0 z-40">
        <h1 className="font-bold text-lg">Groot × Rocket</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.sender_id === profile?.id;
          return (
            <div key={msg.id} className={\`flex \${isMe ? 'justify-end' : 'justify-start'}\`}>
              <div className={\`max-w-[75%] rounded-2xl px-4 py-2 \${isMe ? 'bg-black text-white rounded-br-sm' : 'bg-white border border-gray-100 text-gray-900 rounded-bl-sm'}\`}>
                <p className="text-sm">{msg.message_text}</p>
                <p className={\`text-[10px] mt-1 \${isMe ? 'text-gray-300' : 'text-gray-500'}\`}>
                  {format(new Date(msg.created_at), 'h:mm a')}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </main>

      <div className="bg-white p-3 border-t border-gray-100">
        <form onSubmit={handleSend} className="flex items-center space-x-2 max-w-md mx-auto relative">
          <button type="button" className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <ImageIcon size={20} />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Message..."
            className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
          <button type="submit" disabled={!newMessage.trim()} className="p-2 bg-black text-white rounded-full disabled:opacity-50 transition-opacity">
            <Send size={18} />
          </button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
};
`,
  'src/pages/Streak.tsx': `import { BottomNav } from '../components/BottomNav';
import { motion } from 'framer-motion';

export const Streak = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white px-4 py-4 border-b border-gray-100 sticky top-0 z-40">
        <h1 className="font-bold text-lg text-center">Friendship Streak</h1>
      </header>

      <main className="p-6 max-w-md mx-auto space-y-8">
        <div className="text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-block bg-orange-100 text-orange-600 rounded-full px-4 py-1 font-medium text-sm mb-4">
            NOOB FRIENDS
          </motion.div>
          <h2 className="text-6xl font-black text-gray-900 mb-2">
            <span className="text-orange-500">🔥</span> 23
          </h2>
          <p className="text-gray-500 font-medium">Days of being unstoppable together</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Today's Progress</h3>
          <div className="flex justify-between items-center space-x-4">
            <div className="flex-1 bg-gray-50 rounded-xl p-4 text-center border border-green-100">
              <div className="text-2xl mb-1">✅</div>
              <p className="font-semibold text-sm">Groot</p>
            </div>
            <div className="flex-1 bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
              <div className="text-2xl mb-1">⏳</div>
              <p className="font-semibold text-sm">Rocket</p>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">Waiting for Rocket to post an update today.</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-2">Next Reward</h3>
          <div className="w-full bg-gray-100 rounded-full h-3 mb-2 overflow-hidden">
            <div className="bg-orange-500 h-full rounded-full" style={{ width: '82%' }}></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 font-medium">
            <span>23 days</span>
            <span>28 days (LEGEND FRIENDS)</span>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};
`,
  'src/pages/Profile.tsx': `import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { BottomNav } from '../components/BottomNav';
import { LogOut, Settings } from 'lucide-react';

export const Profile = () => {
  const { profile } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white px-4 py-4 border-b border-gray-100 sticky top-0 z-40 flex justify-between items-center">
        <h1 className="font-bold text-lg">Profile</h1>
        <button className="text-gray-500 hover:text-gray-900"><Settings size={20} /></button>
      </header>

      <main className="p-4 max-w-md mx-auto space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center relative overflow-hidden">
          <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full mb-4 overflow-hidden border-4 border-white shadow-sm">
            <img src={profile?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Groot'} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{profile?.display_name || 'Loading...'}</h2>
          <p className="text-gray-500 text-sm mb-4">@{profile?.username}</p>
          <p className="text-gray-700 text-sm mb-6 max-w-xs mx-auto">{profile?.bio || 'No bio yet.'}</p>
          
          <div className="flex justify-around border-t border-gray-100 pt-4">
            <div className="text-center">
              <p className="font-bold text-lg text-gray-900">42</p>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Updates</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg text-gray-900">12</p>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Photos</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg text-orange-500">23</p>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Streak</p>
            </div>
          </div>
        </div>

        <button onClick={handleLogout} className="w-full bg-white text-red-500 font-bold rounded-xl px-4 py-4 hover:bg-gray-50 transition-colors border border-gray-100 flex items-center justify-center space-x-2">
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </main>

      <BottomNav />
    </div>
  );
};
`,
  'src/App.tsx': `import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Chat } from './pages/Chat';
import { Streak } from './pages/Streak';
import { Profile } from './pages/Profile';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;
  return session ? <>{children}</> : <Navigate to="/login" />;
};

function AppRoutes() {
  const { session, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;
  return (
    <Router>
      <Routes>
        <Route path="/login" element={!session ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path="/streak" element={<PrivateRoute><Streak /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        {/* Fallbacks */}
        <Route path="/memories" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="*" element={<Navigate to={session ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(__dirname, filepath), content, 'utf8');
  console.log('Created:', filepath);
}
