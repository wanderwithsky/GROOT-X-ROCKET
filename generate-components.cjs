const fs = require('fs');
const path = require('path');

const files = {
  'src/components/BottomNav.tsx': `import { Home, MessageSquare, Flame, User, Image } from 'lucide-react';
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
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 pb-safe z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path} className="relative flex flex-col items-center justify-center w-full h-full text-gray-500">
              {isActive && (
                <motion.div layoutId="nav-pill" className="absolute inset-0 bg-gray-100 rounded-lg mx-2 my-1" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
              )}
              <span className="relative z-10 flex flex-col items-center">
                <Icon size={24} className={isActive ? 'text-gray-900' : 'text-gray-400'} />
                <span className={\`text-[10px] mt-1 \${isActive ? 'text-gray-900 font-medium' : 'text-gray-400'}\`}>{item.label}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
`,
  'src/components/ActivityCard.tsx': `import { motion } from 'framer-motion';
import { Heart, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const ActivityCard = ({ activity }: { activity: any }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
      <div className="flex items-center space-x-3 mb-3">
        <img src={activity.profiles?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'} alt="Avatar" className="w-10 h-10 rounded-full bg-gray-200" />
        <div>
          <h4 className="font-semibold text-gray-900 text-sm">{activity.profiles?.display_name}</h4>
          <p className="text-xs text-gray-500">{formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}</p>
        </div>
      </div>
      {activity.title && <h5 className="font-bold text-gray-800 mb-1">{activity.title}</h5>}
      <p className="text-gray-700 text-sm mb-3">{activity.content}</p>
      {activity.image_url && (
        <div className="rounded-xl overflow-hidden mb-3 bg-gray-100">
          <img src={activity.image_url} alt="Activity" className="w-full h-auto object-cover" loading="lazy" />
        </div>
      )}
      <div className="flex items-center space-x-4 border-t border-gray-50 pt-3">
        <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
          <Heart size={18} />
          <span className="text-xs font-medium">Like</span>
        </button>
        <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
          <MessageCircle size={18} />
          <span className="text-xs font-medium">Comment</span>
        </button>
      </div>
    </motion.div>
  );
};
`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(__dirname, filepath), content, 'utf8');
  console.log('Created:', filepath);
}
