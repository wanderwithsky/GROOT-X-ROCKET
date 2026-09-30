import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { X, Share } from 'lucide-react';

export const InstallPrompt = () => {
  const { state, promptInstall, dismissInstall } = usePWAInstall();
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  // Smart Display Logic
  const shouldShowBanner = state.isMobile && !state.isInstalled && state.canInstall && !state.isDismissed;

  const handleInstallClick = async () => {
    if (state.isIOS) {
      setShowIOSInstructions(true);
    } else {
      await promptInstall();
    }
  };

  return (
    <>
      <AnimatePresence>
        {shouldShowBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="sticky top-0 w-full z-50 pt-[env(safe-area-inset-top)] bg-[var(--theme-card)] border-b border-[var(--theme-border)] shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 max-w-md mx-auto relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--theme-card-secondary)] border border-[var(--theme-border)] rounded-xl flex items-center justify-center overflow-hidden">
                  <img src="/avatars/groot-x-rocket.png" alt="Bakchodi" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--theme-text)] text-sm">Install Bakchodi</h3>
                  <p className="text-xs text-[var(--theme-text-muted)]">Keep Groot × Rocket one tap away.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleInstallClick} 
                  className="px-3 py-1.5 bg-[var(--theme-accent)] text-white text-xs font-bold rounded-lg hover:opacity-80 transition-colors"
                  aria-label="Install Bakchodi"
                >
                  INSTALL
                </button>
                <button 
                  onClick={dismissInstall} 
                  className="p-1.5 text-[var(--theme-text-muted)] hover:text-zinc-300 transition-colors"
                  aria-label="Close install banner"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS Instructions Bottom Sheet */}
      <AnimatePresence>
        {showIOSInstructions && (
          <motion.div 
            initial={{ y: '100%' }} 
            animate={{ y: 0 }} 
            exit={{ y: '100%' }}
            className="fixed bottom-0 left-0 right-0 z-[60] p-6 pb-safe bg-[var(--theme-card)] border-t border-[var(--theme-border)] rounded-t-3xl shadow-2xl"
          >
            <div className="max-w-md mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-[var(--theme-text)]">Install Bakchodi on iPhone</h3>
                <button onClick={() => setShowIOSInstructions(false)} className="p-2 text-[var(--theme-text-muted)] hover:text-zinc-300">
                  <X size={20} />
                </button>
              </div>
              <ol className="space-y-4 text-sm text-zinc-300 mb-6">
                <li className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs">1</span>
                  <span>Tap the <Share size={16} className="inline mx-1 text-blue-400" /> <b>Share</b> button in Safari.</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs">2</span>
                  <span>Scroll down the menu.</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs">3</span>
                  <span>Tap <b>Add to Home Screen</b>.</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs">4</span>
                  <span>Tap <b>Add</b> in the top right.</span>
                </li>
              </ol>
              <button 
                onClick={() => setShowIOSInstructions(false)} 
                className="w-full py-3 bg-zinc-800 text-[var(--theme-text)] font-bold rounded-xl hover:bg-zinc-700 transition-colors"
              >
                Got it
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
