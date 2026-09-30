import { BottomNav } from '../components/BottomNav';
import { motion } from 'framer-motion';
import { useState } from 'react';

export const Streak = () => {
  const [streak] = useState(0);

  // In a full implementation, you'd fetch the friendship_daily_progress or friendships table.
  // Using 0 as requested since there's no real data.
  
  return (
    <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] pb-20">
      <header className="px-4 py-4 border-b border-[var(--theme-border)] sticky top-0 z-40 bg-[var(--theme-bg)]/80 backdrop-blur-xl">
        <h1 className="font-bold text-lg text-center">Friendship Streak</h1>
      </header>

      <main className="p-6 max-w-md mx-auto space-y-8">
        <div className="text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-block bg-[var(--theme-card)] border border-[var(--theme-border)] text-[var(--theme-accent)] rounded-full px-4 py-1 font-bold text-xs tracking-widest mb-4">
            {streak === 0 ? 'CURRENT REWARD: NEW FRIENDS' : 'NEW FRIENDS'}
          </motion.div>
          <h2 className="text-7xl font-black text-[var(--theme-text)] mb-2">
            <span className="text-orange-500">🔥</span> {streak}
          </h2>
          <p className="text-[var(--theme-text-muted)] font-medium">{streak === 0 ? 'Start your first friendship streak today.' : 'Days of being unstoppable together'}</p>
        </div>

        <div className="bg-[var(--theme-card)] rounded-2xl p-5 shadow-sm border border-[var(--theme-border)]">
          <h3 className="font-bold text-[var(--theme-text)] mb-4 text-sm uppercase tracking-wider">Today's Progress</h3>
          <div className="flex justify-between items-center gap-4">
            <div className="flex-1 bg-[var(--theme-card-secondary)] rounded-xl p-4 text-center border border-[var(--theme-border)]">
              <div className="text-2xl mb-1">⏳</div>
              <p className="font-semibold text-xs text-zinc-300">Groot</p>
            </div>
            <div className="flex-1 bg-[var(--theme-card-secondary)] rounded-xl p-4 text-center border border-[var(--theme-border)]">
              <div className="text-2xl mb-1">⏳</div>
              <p className="font-semibold text-xs text-zinc-300">Rocket</p>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};
