import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if already installed or dismissed
    if (window.matchMedia('(display-mode: standalone)').matches || localStorage.getItem('bakchodi_install_dismissed')) {
      return;
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('bakchodi_install_dismissed', 'true');
    setShowPrompt(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          exit={{ y: 100, opacity: 0 }} 
          className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-8 bg-[#111113] border-t border-zinc-800 rounded-t-3xl shadow-2xl"
        >
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-xl font-bold text-zinc-100 mb-2">🚀 Install Bakchodi</h3>
            <p className="text-sm text-zinc-400 mb-6">Keep Groot × Rocket one tap away. Install the app for the full experience.</p>
            <div className="flex gap-4 justify-center">
              <button onClick={handleDismiss} className="px-6 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-medium hover:bg-zinc-700 transition-colors">
                Not now
              </button>
              <button onClick={handleInstall} className="px-6 py-3 rounded-xl bg-zinc-100 text-black font-bold hover:bg-white transition-colors">
                Install Bakchodi
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
