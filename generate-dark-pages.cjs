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
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-zinc-100 px-4 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black tracking-tight mb-3">BAKCHODI</h1>
          <p className="text-zinc-400 font-medium tracking-wide">Groot × Rocket</p>
          <div className="mt-4 text-xs text-zinc-500 space-y-1">
            <p>Two lives.</p>
            <p>One timeline.</p>
            <p className="text-purple-400/80">Infinite bakchodi.</p>
          </div>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input type="email" placeholder="Login ID" className="w-full bg-[#111113] border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <input type="password" placeholder="Password" className="w-full bg-[#111113] border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-zinc-100 text-black font-bold rounded-xl px-4 py-3 hover:bg-white transition-colors disabled:opacity-50 mt-4 flex justify-center items-center gap-2">
            {loading ? 'Authenticating...' : 'Enter →'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
`,
  'src/pages/Dashboard.tsx': `import { useRealtimeActivities } from '../hooks/useRealtimeActivities';
import { useAuth } from '../contexts/AuthContext';
import { ActivityCard } from '../components/ActivityCard';
import { BottomNav } from '../components/BottomNav';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export const Dashboard = () => {
  const { activities } = useRealtimeActivities();
  const { profile } = useAuth();
  
  // Example streak logic: retrieve actual streak from db. For now we assume a profile field or separate fetch.
  // Using 0 as per instructions until actual streak is calculated.
  const streak = 0;

  return (
    <div className="min-h-screen bg-[#09090b] pb-24 text-zinc-100">
      <header className="px-4 py-5 sticky top-0 z-40 border-b border-zinc-800/50 backdrop-blur-xl bg-[#09090b]/80">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-zinc-100">Welcome to Bakchodi.</h1>
            <p className="text-sm font-medium text-orange-400/90">🔥 {streak} day streak</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden">
             {profile?.avatar_url ? (
               <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500">?</div>
             )}
          </div>
        </div>
      </header>

      <main className="p-4 max-w-md mx-auto">
        <div className="mb-6">
          <p className="text-sm text-zinc-400 mb-3">What are you doing?</p>
          <div className="flex flex-wrap gap-2">
            {['📸 Photo', '✍️ Update', '🍔 Meal', '🏋️ Gym'].map(action => (
              <button key={action} className="px-3 py-1.5 bg-[#111113] border border-zinc-800 text-zinc-300 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors">
                {action}
              </button>
            ))}
          </div>
        </div>

        <h3 className="font-semibold text-zinc-100 mb-4">Today's Updates</h3>

        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center text-zinc-500 py-12 bg-[#111113] border border-zinc-800/50 rounded-2xl">
              <p className="text-lg mb-1">Nothing here yet 👀</p>
              <p className="text-sm">Start the bakchodi.</p>
            </div>
          ) : (
            activities.map(activity => (
              <ActivityCard key={activity.id} activity={activity} />
            ))
          )}
        </div>
      </main>

      <motion.button whileTap={{ scale: 0.9 }} className="fixed bottom-24 right-4 w-14 h-14 bg-zinc-100 text-black rounded-full flex items-center justify-center shadow-lg shadow-black/50 z-50">
        <Plus size={24} />
      </motion.button>
      
      <BottomNav />
    </div>
  );
};
`,
  'src/pages/Profile.tsx': `import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { BottomNav } from '../components/BottomNav';
import { LogOut, Settings } from 'lucide-react';

export const Profile = () => {
  const { profile, loading } = useAuth();
  const [stats, setStats] = useState({ updates: 0, photos: 0, streak: 0 });

  useEffect(() => {
    if (profile?.id) {
      const fetchStats = async () => {
        const { count: updatesCount } = await supabase.from('activities').select('*', { count: 'exact', head: true }).eq('user_id', profile.id);
        const { count: photosCount } = await supabase.from('activities').select('*', { count: 'exact', head: true }).eq('user_id', profile.id).not('image_url', 'is', null);
        // Using 0 for streak as a placeholder since we don't have streak calculation active yet
        setStats({ updates: updatesCount || 0, photos: photosCount || 0, streak: 0 });
      };
      fetchStats();
    }
  }, [profile]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-zinc-500">Loading Profile...</div>;
  }

  return (
    <div className="min-h-screen bg-[#09090b] pb-24 text-zinc-100">
      <header className="px-4 py-4 border-b border-zinc-800/50 sticky top-0 z-40 flex justify-between items-center bg-[#09090b]/80 backdrop-blur-xl">
        <h1 className="font-bold text-lg">PROFILE</h1>
        <button className="text-zinc-400 hover:text-zinc-100 transition-colors"><Settings size={20} /></button>
      </header>

      <main className="p-4 max-w-md mx-auto space-y-6 mt-4">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 bg-[#111113] rounded-full mb-4 overflow-hidden border-2 border-zinc-700 shadow-[0_0_15px_rgba(255,255,255,0.05)] relative">
            {profile?.avatar_url ? (
               <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
               <div className="w-full h-full flex items-center justify-center text-zinc-600 text-sm">No Image</div>
            )}
          </div>
          <h2 className="text-2xl font-bold text-zinc-100">{profile?.display_name || 'Anonymous'}</h2>
          <p className="text-zinc-400 text-sm mb-2">@{profile?.username || 'unknown'}</p>
          <p className="text-zinc-500 text-sm text-center max-w-xs">{profile?.bio || 'Bio goes here'}</p>
        </div>

        <div className="flex justify-around border-y border-zinc-800/50 py-4 bg-[#111113]/30 rounded-2xl">
          <div className="text-center">
            <p className="font-bold text-xl text-zinc-100">{stats.updates}</p>
            <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest mt-1">Updates</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-xl text-zinc-100">{stats.photos}</p>
            <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest mt-1">Photos</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-xl text-orange-400">🔥 {stats.streak}</p>
            <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest mt-1">Streak</p>
          </div>
        </div>

        <div className="bg-[#111113] border border-zinc-800/50 rounded-2xl p-4 text-center">
           <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">Friendship Rank</p>
           <p className="text-lg font-bold text-purple-400">NEW FRIENDS</p>
        </div>

        <div className="space-y-2 mt-8">
           <button className="w-full text-left px-4 py-3 bg-[#111113] hover:bg-zinc-800 border border-zinc-800/50 rounded-xl text-sm font-medium transition-colors">Edit Profile</button>
           <button className="w-full text-left px-4 py-3 bg-[#111113] hover:bg-zinc-800 border border-zinc-800/50 rounded-xl text-sm font-medium transition-colors">Theme</button>
        </div>

        <button onClick={handleLogout} className="w-full mt-6 bg-[#18181b] text-red-400/90 font-bold rounded-xl px-4 py-4 hover:bg-red-950/20 transition-colors border border-zinc-800/50 flex items-center justify-center gap-2">
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </main>

      <BottomNav />
    </div>
  );
};
`,
  'src/components/ActivityCard.tsx': `import { motion } from 'framer-motion';
import { Heart, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const ActivityCard = ({ activity }: { activity: any }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111113] rounded-2xl p-4 border border-zinc-800/50 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700">
           {activity.profiles?.avatar_url ? (
             <img src={activity.profiles?.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
           ) : null}
        </div>
        <div>
          <h4 className="font-semibold text-zinc-200 text-sm">{activity.profiles?.display_name}</h4>
          <p className="text-[11px] text-zinc-500">{formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}</p>
        </div>
      </div>
      {activity.title && <h5 className="font-bold text-zinc-100 mb-1">{activity.title}</h5>}
      <p className="text-zinc-300 text-sm mb-3 leading-relaxed">{activity.content}</p>
      {activity.image_url && (
        <div className="rounded-xl overflow-hidden mb-3 bg-[#18181b] border border-zinc-800/50">
          <img src={activity.image_url} alt="Activity" className="w-full h-auto object-cover" loading="lazy" />
        </div>
      )}
      <div className="flex items-center gap-4 border-t border-zinc-800/50 pt-3">
        <button className="flex items-center gap-1.5 text-zinc-500 hover:text-red-400 transition-colors">
          <Heart size={16} />
          <span className="text-xs font-medium">Like</span>
        </button>
        <button className="flex items-center gap-1.5 text-zinc-500 hover:text-blue-400 transition-colors">
          <MessageCircle size={16} />
          <span className="text-xs font-medium">Comment</span>
        </button>
      </div>
    </motion.div>
  );
};
`,
  'src/components/BottomNav.tsx': `import { Home, MessageSquare, Flame, User, Image } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export const BottomNav = () => {
  const location = useLocation();
  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: MessageSquare, label: 'Chat', path: '/chat' },
    { icon: Flame, label: 'Streak', path: '/streak' },
    { icon: Image, label: 'Memories', path: '/memories' },
    { icon: User, label: 'Profile', path: '/profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#09090b]/90 backdrop-blur-xl border-t border-zinc-800/80 pb-safe z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path} className="relative flex flex-col items-center justify-center w-full h-full text-zinc-500">
              {isActive && (
                <motion.div layoutId="nav-pill" className="absolute inset-0 bg-[#18181b] rounded-xl mx-2 my-1" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
              )}
              <span className="relative z-10 flex flex-col items-center">
                <Icon size={22} className={isActive ? 'text-zinc-100' : 'text-zinc-500'} />
                <span className={\`text-[10px] mt-1 \${isActive ? 'text-zinc-100 font-medium' : 'text-zinc-500'}\`}>{item.label}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(__dirname, filepath), content, 'utf8');
  console.log('Created:', filepath);
}
