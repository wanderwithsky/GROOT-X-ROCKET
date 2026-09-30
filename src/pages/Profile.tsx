import { useEffect, useState } from 'react';
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
