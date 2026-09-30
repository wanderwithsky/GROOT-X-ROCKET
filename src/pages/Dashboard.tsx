import { useState } from 'react';
import { useRealtimeActivities } from '../hooks/useRealtimeActivities';
import { useAuth } from '../contexts/AuthContext';
import { ActivityCard } from '../components/ActivityCard';
import { BottomNav } from '../components/BottomNav';
import { ActivityComposer, type ActivityType } from '../components/ActivityComposer';
import { QuickActionMenu } from '../components/QuickActionMenu';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export const Dashboard = () => {
  const { activities } = useRealtimeActivities();
  const { profile } = useAuth();
  
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [composerType, setComposerType] = useState<ActivityType>(null);
  
  const streak = 0;

  const topActions: { label: string, type: ActivityType }[] = [
    { label: '📸 Photo', type: 'photo' },
    { label: '✍️ Update', type: 'text' },
    { label: '🍔 Meal', type: 'meal' },
    { label: '🏋️ Gym', type: 'gym' }
  ];

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] pb-24 text-[var(--theme-text)] relative">
      <header className="px-4 py-5 sticky top-0 z-40 border-b border-[var(--theme-border)] backdrop-blur-xl bg-[var(--theme-bg)]/80">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-[var(--theme-text)]">Welcome to Bakchodi.</h1>
            <p className="text-sm font-medium text-[var(--theme-accent)]/90">🔥 {streak} day streak</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden">
             {profile?.avatar_url ? (
               <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-xs text-[var(--theme-text-muted)]">?</div>
             )}
          </div>
        </div>
      </header>

      <main className="p-4 max-w-md mx-auto relative z-10">
        <div className="mb-6">
          <p className="text-sm text-[var(--theme-text-muted)] mb-3">What are you doing?</p>
          <div className="flex flex-wrap gap-2">
            {topActions.map(action => (
              <button 
                key={action.type} 
                onClick={() => setComposerType(action.type)}
                className="px-3 py-1.5 bg-[var(--theme-card)] border border-[var(--theme-border)] text-zinc-300 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        <h3 className="font-semibold text-[var(--theme-text)] mb-4">Today's Updates</h3>

        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center text-[var(--theme-text-muted)] py-12 bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-2xl">
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

      <motion.button 
        type="button"
        aria-label="Create update"
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsActionMenuOpen(true)} 
        className="fixed bottom-[calc(72px+env(safe-area-inset-bottom))] right-4 w-14 h-14 bg-[var(--theme-accent)] text-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(255,255,255,0.15)] z-[45] touch-manipulation focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-[#09090b]"
      >
        <Plus size={28} strokeWidth={2.5} />
      </motion.button>
      
      <BottomNav />

      <QuickActionMenu 
        isOpen={isActionMenuOpen} 
        onClose={() => setIsActionMenuOpen(false)} 
        onSelect={(type) => setComposerType(type)}
      />

      <ActivityComposer 
        type={composerType} 
        onClose={() => setComposerType(null)} 
      />
    </div>
  );
};
