const fs = require('fs');
const path = require('path');

const files = {
  'src/pages/Settings.tsx': `import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { ArrowLeft, LogOut, ChevronRight } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const Settings = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { state: pwaState, promptInstall } = usePWAInstall();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)]">
      <header className="px-4 py-4 border-b border-[var(--theme-border)] sticky top-0 z-40 flex items-center gap-4 bg-[var(--theme-bg)]">
        <button onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
        <h1 className="font-bold">Settings</h1>
      </header>

      <main className="p-4 max-w-md mx-auto space-y-6">
        
        <section>
          <h2 className="text-xs font-bold text-[var(--theme-text-muted)] uppercase tracking-wider mb-2 ml-2">Profile</h2>
          <div className="bg-[var(--theme-card)] rounded-xl border border-[var(--theme-border)] overflow-hidden">
            <button onClick={() => navigate('/edit-profile')} className="w-full p-4 flex justify-between items-center hover:bg-[var(--theme-card-secondary)]">
              <span>Edit Profile</span>
              <ChevronRight size={18} className="text-[var(--theme-text-muted)]" />
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-bold text-[var(--theme-text-muted)] uppercase tracking-wider mb-2 ml-2">Appearance</h2>
          <div className="bg-[var(--theme-card)] rounded-xl border border-[var(--theme-border)] overflow-hidden">
            <button onClick={() => navigate('/settings/theme')} className="w-full p-4 flex justify-between items-center hover:bg-[var(--theme-card-secondary)] border-b border-[var(--theme-border)]">
              <span>Theme</span>
              <div className="flex items-center gap-2">
                 <span className="text-xs text-[var(--theme-text-muted)] capitalize">{profile?.theme_preference || 'Midnight'}</span>
                 <ChevronRight size={18} className="text-[var(--theme-text-muted)]" />
              </div>
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-bold text-[var(--theme-text-muted)] uppercase tracking-wider mb-2 ml-2">App</h2>
          <div className="bg-[var(--theme-card)] rounded-xl border border-[var(--theme-border)] overflow-hidden">
             {pwaState.isInstalled ? (
              <div className="p-4 text-sm font-medium text-green-500 flex justify-between">
                <span>Install Bakchodi</span>
                <span>Installed ✓</span>
              </div>
            ) : (
              <button onClick={promptInstall} className="w-full text-left p-4 hover:bg-[var(--theme-card-secondary)] flex justify-between items-center">
                <span>Install Bakchodi</span>
                <span className="text-[var(--theme-text-muted)] text-xs">Add to Home Screen</span>
              </button>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-xs font-bold text-[var(--theme-text-muted)] uppercase tracking-wider mb-2 ml-2">Security</h2>
          <button onClick={handleLogout} className="w-full p-4 bg-[var(--theme-card)] text-red-400 font-bold rounded-xl flex items-center justify-center gap-2 border border-[var(--theme-border)]">
            <LogOut size={18} /> Logout
          </button>
        </section>

      </main>
    </div>
  );
};
`,
  'src/pages/ThemeSelector.tsx': `import { useNavigate } from 'react-router-dom';
import { useTheme, ThemeName } from '../contexts/ThemeContext';
import { ArrowLeft, Check } from 'lucide-react';

export const ThemeSelector = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const themes: { id: ThemeName; name: string; bgClass: string; accentClass: string }[] = [
    { id: 'midnight', name: 'Midnight', bgClass: 'bg-[#09090b]', accentClass: 'bg-blue-500' },
    { id: 'forest', name: 'Forest', bgClass: 'bg-[#05140b]', accentClass: 'bg-emerald-500' },
    { id: 'cosmic', name: 'Cosmic', bgClass: 'bg-[#0b051a]', accentClass: 'bg-purple-500' },
    { id: 'sunset', name: 'Sunset', bgClass: 'bg-[#1a0f0b]', accentClass: 'bg-orange-500' },
    { id: 'ocean', name: 'Ocean', bgClass: 'bg-[#06121c]', accentClass: 'bg-cyan-500' },
    { id: 'aurora', name: 'Aurora', bgClass: 'bg-[#041215]', accentClass: 'bg-teal-500' },
    { id: 'rose', name: 'Rose', bgClass: 'bg-[#1a0a11]', accentClass: 'bg-rose-500' },
    { id: 'graphite', name: 'Graphite', bgClass: 'bg-[#111111]', accentClass: 'bg-gray-400' },
    { id: 'neon', name: 'Neon', bgClass: 'bg-[#050505]', accentClass: 'bg-fuchsia-500' },
    { id: 'cherry', name: 'Cherry', bgClass: 'bg-[#140507]', accentClass: 'bg-rose-600' }
  ];

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] transition-colors duration-300">
      <header className="px-4 py-4 border-b border-[var(--theme-border)] sticky top-0 z-40 flex items-center gap-4 bg-[var(--theme-bg)]">
        <button onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
        <h1 className="font-bold">Choose Theme</h1>
      </header>

      <main className="p-4 max-w-md mx-auto grid gap-3 pb-safe">
        {themes.map(t => (
          <button 
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={\`w-full p-4 rounded-xl border flex items-center justify-between transition-all \${theme === t.id ? 'border-[var(--theme-accent)] bg-[var(--theme-card-secondary)]' : 'border-[var(--theme-border)] bg-[var(--theme-card)]'}\`}
          >
            <div className="flex items-center gap-4">
              <div className={\`w-8 h-8 rounded-full border border-white/10 \${t.bgClass} flex items-center justify-center\`}>
                 <div className={\`w-3 h-3 rounded-full \${t.accentClass}\`}></div>
              </div>
              <span className="font-medium text-lg">{t.name}</span>
            </div>
            {theme === t.id && <Check className="text-[var(--theme-accent)]" size={20} />}
          </button>
        ))}
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
