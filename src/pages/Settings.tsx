import { useNavigate } from 'react-router-dom';
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
