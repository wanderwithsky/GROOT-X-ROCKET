import { BottomNav } from '../components/BottomNav';
import { motion } from 'framer-motion';
import { useState } from 'react';

export const Streak = () => {
  const [streak] = useState(0);

  // In a full implementation, you'd fetch the friendship_daily_progress or friendships table.
  // Using 0 as requested since there's no real data.
  
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 pb-20">
      <header className="px-4 py-4 border-b border-zinc-800/50 sticky top-0 z-40 bg-[#09090b]/80 backdrop-blur-xl">
        <h1 className="font-bold text-lg text-center">Friendship Streak</h1>
      </header>

      <main className="p-6 max-w-md mx-auto space-y-8">
        <div className="text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-block bg-[#111113] border border-zinc-800 text-purple-400 rounded-full px-4 py-1 font-bold text-xs tracking-widest mb-4">
            {streak === 0 ? 'CURRENT REWARD: NEW FRIENDS' : 'NEW FRIENDS'}
          </motion.div>
          <h2 className="text-7xl font-black text-zinc-100 mb-2">
            <span className="text-orange-500">🔥</span> {streak}
          </h2>
          <p className="text-zinc-500 font-medium">{streak === 0 ? 'Start your first friendship streak today.' : 'Days of being unstoppable together'}</p>
        </div>

        <div className="bg-[#111113] rounded-2xl p-5 shadow-sm border border-zinc-800/50">
          <h3 className="font-bold text-zinc-100 mb-4 text-sm uppercase tracking-wider">Today's Progress</h3>
          <div className="flex justify-between items-center gap-4">
            <div className="flex-1 bg-[#18181b] rounded-xl p-4 text-center border border-zinc-800">
              <div className="text-2xl mb-1">⏳</div>
              <p className="font-semibold text-xs text-zinc-300">Groot</p>
            </div>
            <div className="flex-1 bg-[#18181b] rounded-xl p-4 text-center border border-zinc-800">
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
