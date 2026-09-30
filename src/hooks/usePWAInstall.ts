import { useState, useEffect } from 'react';

export type PWAInstallState = {
  canInstall: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  isDismissed: boolean;
  isMobile: boolean;
};

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [state, setState] = useState<PWAInstallState>({
    canInstall: false,
    isInstalled: false,
    isIOS: false,
    isDismissed: false,
    isMobile: false
  });

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const dismissed = localStorage.getItem('bakchodi_install_dismissed') === 'true';

    setState(prev => ({
      ...prev,
      isInstalled: isStandalone,
      isIOS: isIOSDevice,
      isMobile: isMobileDevice,
      isDismissed: dismissed,
      canInstall: isIOSDevice && !isStandalone && isMobileDevice // For iOS we can always show instructions if not installed
    }));

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setState(prev => ({ ...prev, canInstall: true }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return false;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setState(prev => ({ ...prev, canInstall: false, isInstalled: true }));
      return true;
    }
    return false;
  };

  const dismissInstall = () => {
    localStorage.setItem('bakchodi_install_dismissed', 'true');
    setState(prev => ({ ...prev, isDismissed: true }));
  };

  return { state, promptInstall, dismissInstall };
};
