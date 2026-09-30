import { useRealtimeActivities } from '../hooks/useRealtimeActivities';
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
