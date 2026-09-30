import { motion } from 'framer-motion';
import { Heart, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const ActivityCard = ({ activity }: { activity: any }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[var(--theme-card)] rounded-2xl p-4 border border-[var(--theme-border)] shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700">
           {activity.profiles?.avatar_url ? (
             <img src={activity.profiles?.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
           ) : null}
        </div>
        <div>
          <h4 className="font-semibold text-zinc-200 text-sm">{activity.profiles?.display_name}</h4>
          <p className="text-[11px] text-[var(--theme-text-muted)]">{formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}</p>
        </div>
      </div>
      {activity.title && <h5 className="font-bold text-[var(--theme-text)] mb-1">{activity.title}</h5>}
      <p className="text-zinc-300 text-sm mb-3 leading-relaxed">{activity.content}</p>
      {activity.image_url && (
        <div className="rounded-xl overflow-hidden mb-3 bg-[var(--theme-card-secondary)] border border-[var(--theme-border)]">
          <img src={activity.image_url} alt="Activity" className="w-full h-auto object-cover" loading="lazy" />
        </div>
      )}
      <div className="flex items-center gap-4 border-t border-[var(--theme-border)] pt-3">
        <button className="flex items-center gap-1.5 text-[var(--theme-text-muted)] hover:text-red-400 transition-colors">
          <Heart size={16} />
          <span className="text-xs font-medium">Like</span>
        </button>
        <button className="flex items-center gap-1.5 text-[var(--theme-text-muted)] hover:text-blue-400 transition-colors">
          <MessageCircle size={16} />
          <span className="text-xs font-medium">Comment</span>
        </button>
      </div>
    </motion.div>
  );
};
