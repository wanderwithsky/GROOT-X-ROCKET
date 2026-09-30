import { Home, MessageSquare, Flame, User, Image } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export const BottomNav = () => {
  const location = useLocation();
  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: MessageSquare, label: 'Chat', path: '/chat' },
    { icon: Flame, label: 'Streak', path: '/streak' },
    { icon: Image, label: 'Memories', path: '/memories' },
    { icon: User, label: 'Profile', path: '/profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[var(--theme-bg)]/90 backdrop-blur-xl border-t border-[var(--theme-border)]/80 pb-safe z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path} className="relative flex flex-col items-center justify-center w-full h-full text-[var(--theme-text-muted)]">
              {isActive && (
                <motion.div layoutId="nav-pill" className="absolute inset-0 bg-[var(--theme-card-secondary)] rounded-xl mx-2 my-1" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
              )}
              <span className="relative z-10 flex flex-col items-center">
                <Icon size={22} className={isActive ? 'text-[var(--theme-text)]' : 'text-[var(--theme-text-muted)]'} />
                <span className={`text-[10px] mt-1 ${isActive ? 'text-[var(--theme-text)] font-medium' : 'text-[var(--theme-text-muted)]'}`}>{item.label}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
