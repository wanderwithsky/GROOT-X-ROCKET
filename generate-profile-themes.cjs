const fs = require('fs');
const path = require('path');

const files = {
  'src/contexts/ThemeContext.tsx': `import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export type ThemeName = 'midnight' | 'forest' | 'cosmic' | 'sunset' | 'ocean' | 'aurora' | 'rose' | 'graphite' | 'neon' | 'cherry';

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType>({ theme: 'midnight', setTheme: async () => {} });

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useAuth();
  const [theme, setThemeState] = useState<ThemeName>('midnight');

  useEffect(() => {
    if (profile?.theme_preference) {
      setThemeState(profile.theme_preference as ThemeName);
    }
  }, [profile]);

  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(\`theme-\${theme}\`);
  }, [theme]);

  const setTheme = async (newTheme: ThemeName) => {
    setThemeState(newTheme);
    if (profile) {
      await supabase.from('profiles').update({ theme_preference: newTheme }).eq('id', profile.id);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
`,
  'src/pages/Profile.tsx': `import { useEffect, useState } from 'react';
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
`,
  'src/pages/EditProfile.tsx': `import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Loader2 } from 'lucide-react';

export const EditProfile = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [username, setUsername] = useState(profile?.username || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    
    if (file.size > 10 * 1024 * 1024) {
      setError('Image is too large. Please choose an image under 10 MB.');
      return;
    }

    try {
      setIsSaving(true);
      const fileExt = file.name.split('.').pop();
      const filePath = \`\${profile.id}/\${Math.random()}.\${fileExt}\`;
      
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setAvatarUrl(data.publicUrl);
      
      await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', profile.id);
    } catch (err) {
      setError('Couldn\\'t update your profile photo. Try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    setIsSaving(true);
    setError('');
    try {
      const { error: dbError } = await supabase.from('profiles').update({
        display_name: displayName,
        username,
        bio
      }).eq('id', profile.id);
      
      if (dbError) throw dbError;
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      setError('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)]">
      <header className="px-4 py-4 border-b border-[var(--theme-border)] sticky top-0 z-40 flex items-center gap-4 bg-[var(--theme-bg)]">
        <button onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
        <h1 className="font-bold">Edit Profile</h1>
      </header>

      <main className="p-4 max-w-md mx-auto space-y-6 pb-20">
        <div className="flex flex-col items-center pt-4">
           <div className="relative">
             <div className="w-24 h-24 bg-[var(--theme-card)] rounded-full overflow-hidden border-2 border-[var(--theme-border)]">
                {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[var(--theme-text-muted)] text-sm">No Image</div>}
             </div>
             <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 p-2 bg-[var(--theme-accent)] text-white rounded-full shadow-lg">
               <Camera size={16} />
             </button>
             <input type="file" ref={fileInputRef} className="hidden" accept="image/jpeg, image/png, image/webp" onChange={handleImageUpload} />
           </div>
        </div>

        {error && <div className="p-3 bg-red-900/30 text-red-400 text-sm rounded-xl">{error}</div>}
        {success && <div className="p-3 bg-green-900/30 text-green-400 text-sm rounded-xl">Profile updated ✓</div>}

        <div className="space-y-4">
          <div>
            <label className="text-xs text-[var(--theme-text-muted)] uppercase tracking-wider ml-2">Display Name</label>
            <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full mt-1 p-3 bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-xl focus:outline-none focus:border-[var(--theme-accent)]" />
          </div>
          <div>
            <label className="text-xs text-[var(--theme-text-muted)] uppercase tracking-wider ml-2">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full mt-1 p-3 bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-xl focus:outline-none focus:border-[var(--theme-accent)]" />
          </div>
          <div>
            <label className="text-xs text-[var(--theme-text-muted)] uppercase tracking-wider ml-2 flex justify-between">Bio <span>{bio.length} / 200</span></label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} maxLength={200} className="w-full mt-1 p-3 bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-xl h-24 resize-none focus:outline-none focus:border-[var(--theme-accent)]" />
          </div>
        </div>

        <button onClick={handleSave} disabled={isSaving} className="w-full py-4 bg-[var(--theme-accent)] text-white font-bold rounded-xl flex justify-center items-center gap-2">
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : 'Save Changes'}
        </button>
      </main>
    </div>
  );
};
`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.mkdirSync(path.dirname(path.join(__dirname, filepath)), { recursive: true });
  fs.writeFileSync(path.join(__dirname, filepath), content, 'utf8');
  console.log('Created:', filepath);
}
