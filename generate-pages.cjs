const fs = require('fs');
const path = require('path');

const files = {
  'src/pages/Login.tsx': `import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white px-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black tracking-tight mb-2">GROOT × ROCKET</h1>
          <p className="text-gray-400 text-sm tracking-wide">Two lives. One timeline.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input type="email" placeholder="Login ID" className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <input type="password" placeholder="Password" className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-white text-black font-bold rounded-xl px-4 py-3 hover:bg-gray-200 transition-colors disabled:opacity-50 mt-4">
            {loading ? 'Entering...' : 'Enter'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
`,
  'src/pages/Dashboard.tsx': `import { useRealtimeActivities } from '../hooks/useRealtimeActivities';
import { ActivityCard } from '../components/ActivityCard';
import { BottomNav } from '../components/BottomNav';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export const Dashboard = () => {
  const { activities } = useRealtimeActivities();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white px-4 py-5 sticky top-0 z-40 border-b border-gray-100 backdrop-blur-md bg-white/80">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Good morning 🌱</h1>
            <p className="text-sm font-medium text-orange-500">🔥 23 Day Streak</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Groot" alt="Avatar" />
          </div>
        </div>
      </header>

      <main className="p-4 max-w-md mx-auto">
        <div className="mb-6 overflow-x-auto pb-2 flex space-x-2 scrollbar-hide">
          {['All', 'Photos', 'Meals', 'Gym', 'Today'].map(f => (
            <button key={f} className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-200 transition-colors">
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <p className="text-lg">Nothing here yet 👀</p>
              <p className="text-sm">Someone needs to start the day.</p>
            </div>
          ) : (
            activities.map(activity => (
              <ActivityCard key={activity.id} activity={activity} />
            ))
          )}
        </div>
      </main>

      <motion.button whileTap={{ scale: 0.9 }} className="fixed bottom-20 right-4 w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-lg z-50">
        <Plus size={24} />
      </motion.button>
      
      <BottomNav />
    </div>
  );
};
`,
  'src/App.tsx': `import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';

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
        {/* other routes */}
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
