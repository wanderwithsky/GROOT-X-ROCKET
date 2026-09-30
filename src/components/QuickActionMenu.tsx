import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Edit3, Utensils, Dumbbell, Sparkles, X } from 'lucide-react';
import type { ActivityType } from './ActivityComposer';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: ActivityType) => void;
}

export const QuickActionMenu = ({ isOpen, onClose, onSelect }: Props) => {
  const actions: { icon: any, label: string, type: ActivityType, color: string }[] = [
    { icon: Camera, label: 'Photo', type: 'photo', color: 'text-blue-400' },
    { icon: Edit3, label: 'Update', type: 'text', color: 'text-[var(--theme-text)]' },
    { icon: Utensils, label: 'Meal', type: 'meal', color: 'text-[var(--theme-accent)]' },
    { icon: Dumbbell, label: 'Gym', type: 'gym', color: 'text-[var(--theme-accent)]' },
    { icon: Sparkles, label: 'Custom', type: 'custom', color: 'text-yellow-400' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[60] bg-[var(--theme-card)] rounded-t-3xl border-t border-[var(--theme-border)] pb-safe"
          >
            <div className="p-4 max-w-md mx-auto">
              <div className="flex justify-between items-center mb-6 px-2">
                <h3 className="font-bold text-[var(--theme-text)]">Create Update</h3>
                <button onClick={onClose} className="p-2 text-[var(--theme-text-muted)] hover:text-zinc-300 transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-5 gap-2 mb-4">
                {actions.map(action => (
                  <button 
                    key={action.type}
                    onClick={() => {
                      onClose();
                      onSelect(action.type);
                    }}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-zinc-800/50 transition-colors"
                  >
                    <div className={`w-12 h-12 rounded-full bg-[var(--theme-card-secondary)] border border-[var(--theme-border)] flex items-center justify-center ${action.color}`}>
                      <action.icon size={22} />
                    </div>
                    <span className="text-[10px] font-medium text-[var(--theme-text-muted)]">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
