import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { BottomNav } from '../components/BottomNav';
import { Settings as SettingsIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { profile, loading } = useAuth();
  const [stats, setStats] = useState({ updates: 0, photos: 0, streak: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    if (profile?.id) {
      const fetchStats = async () => {
        const { count: updatesCount } = await supabase.from('activities').select('*', { count: 'exact', head: true }).eq('user_id', profile.id);
        const { count: photosCount } = await supabase.from('activities').select('*', { count: 'exact', head: true }).eq('user_id', profile.id).not('image_url', 'is', null);
        setStats({ updates: updatesCount || 0, photos: photosCount || 0, streak: 0 });
      };
      fetchStats();
    }
  }, [profile]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-[var(--theme-bg)] flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-[var(--theme-card)] rounded-full animate-pulse mb-4"></div>
        <div className="h-6 w-32 bg-[var(--theme-card)] rounded animate-pulse mb-2"></div>
        <div className="h-4 w-24 bg-[var(--theme-card)] rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] pb-24 text-[var(--theme-text)]">
      <header className="px-4 py-4 border-b border-[var(--theme-border)] sticky top-0 z-40 flex justify-between items-center bg-[var(--theme-bg)]/80 backdrop-blur-xl">
        <h1 className="font-bold text-lg">PROFILE</h1>
        <button onClick={() => navigate('/settings')} className="text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors"><SettingsIcon size={20} /></button>
      </header>

      <main className="p-4 max-w-md mx-auto space-y-6 mt-4">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 bg-[var(--theme-card)] rounded-full mb-4 overflow-hidden border-2 border-[var(--theme-border)] shadow-[0_0_15px_var(--theme-accent-soft)] relative">
            {profile?.avatar_url ? (
               <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
               <div className="w-full h-full flex items-center justify-center text-[var(--theme-text-muted)] text-sm">No Image</div>
            )}
          </div>
          <h2 className="text-2xl font-bold">{profile?.display_name || 'Anonymous'}</h2>
          <p className="text-[var(--theme-text-muted)] text-sm mb-2">@{profile?.username || 'unknown'}</p>
          <p className="text-[var(--theme-text-muted)] text-sm text-center max-w-xs">{profile?.bio || 'Bio goes here'}</p>
        </div>

        <div className="flex justify-around border-y border-[var(--theme-border)] py-4 bg-[var(--theme-card)]/30 rounded-2xl">
          <div className="text-center">
            <p className="font-bold text-xl">{stats.updates}</p>
            <p className="text-[10px] text-[var(--theme-text-muted)] font-medium uppercase tracking-widest mt-1">Updates</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-xl">{stats.photos}</p>
            <p className="text-[10px] text-[var(--theme-text-muted)] font-medium uppercase tracking-widest mt-1">Photos</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-xl text-[var(--theme-accent)]">🔥 {stats.streak}</p>
            <p className="text-[10px] text-[var(--theme-text-muted)] font-medium uppercase tracking-widest mt-1">Streak</p>
          </div>
        </div>

        <div className="bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-2xl p-4 text-center">
           <p className="text-xs text-[var(--theme-text-muted)] uppercase tracking-widest mb-2">Friendship Rank</p>
           <p className="text-lg font-bold text-[var(--theme-accent)]">NEW FRIENDS</p>
        </div>

        <div className="space-y-2 mt-8">
           <button onClick={() => navigate('/edit-profile')} className="w-full text-left px-4 py-3 bg-[var(--theme-card)] hover:bg-[var(--theme-card-secondary)] border border-[var(--theme-border)] rounded-xl text-sm font-medium transition-colors">Edit Profile</button>
           <button onClick={() => navigate('/settings/theme')} className="w-full text-left px-4 py-3 bg-[var(--theme-card)] hover:bg-[var(--theme-card-secondary)] border border-[var(--theme-border)] rounded-xl text-sm font-medium transition-colors">Theme</button>
        </div>

      </main>

      <BottomNav />
    </div>
  );
};
