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
    <div className="fixed bottom-0 left-0 right-0 bg-[#09090b]/90 backdrop-blur-xl border-t border-zinc-800/80 pb-safe z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path} className="relative flex flex-col items-center justify-center w-full h-full text-zinc-500">
              {isActive && (
                <motion.div layoutId="nav-pill" className="absolute inset-0 bg-[#18181b] rounded-xl mx-2 my-1" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
              )}
              <span className="relative z-10 flex flex-col items-center">
                <Icon size={22} className={isActive ? 'text-zinc-100' : 'text-zinc-500'} />
                <span className={`text-[10px] mt-1 ${isActive ? 'text-zinc-100 font-medium' : 'text-zinc-500'}`}>{item.label}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
