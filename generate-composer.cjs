const fs = require('fs');
const path = require('path');

const files = {
  'src/components/ActivityComposer.tsx': `import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { X, Image as ImageIcon, Loader2 } from 'lucide-react';

export type ActivityType = 'photo' | 'text' | 'meal' | 'gym' | 'custom' | null;

interface Props {
  type: ActivityType;
  onClose: () => void;
}

export const ActivityComposer = ({ type, onClose }: Props) => {
  const { profile } = useAuth();
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const titles: Record<string, string> = {
    photo: 'Post a Photo',
    text: "What's happening?",
    meal: 'What did you eat?',
    gym: 'Gym Time 💪',
    custom: 'Update',
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePost = async () => {
    if (!profile) return;
    if (!content.trim() && !imageFile) {
      setError('Add some text or a photo.');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      let imageUrl = null;
      let imagePath = null;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = \`\${Math.random()}.\${fileExt}\`;
        const filePath = \`\${profile.id}/\${fileName}\`;
        
        const { error: uploadError } = await supabase.storage
          .from('activity-images') // Assuming this bucket exists
          .upload(filePath, imageFile);

        if (uploadError) {
          throw new Error('Photo upload failed. Try again.');
        }

        const { data: { publicUrl } } = supabase.storage
          .from('activity-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
        imagePath = filePath;
      }

      const { error: dbError } = await supabase.from('activities').insert({
        user_id: profile.id,
        type: type || 'custom',
        title: titles[type || 'custom'],
        content: content.trim(),
        image_url: imageUrl,
        image_path: imagePath,
      });

      if (dbError) throw dbError;

      onClose();
    } catch (err: any) {
      setError(err.message || "Couldn't post your update. Try again.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!type) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-[#111113] rounded-t-3xl sm:rounded-3xl flex flex-col max-h-[90vh] overflow-hidden border border-zinc-800"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 border-b border-zinc-800/50">
            <h2 className="text-zinc-100 font-bold">{titles[type]}</h2>
            <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-4 overflow-y-auto flex-1">
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write your update..."
              className="w-full bg-transparent text-zinc-100 placeholder-zinc-500 resize-none min-h-[120px] focus:outline-none"
            />

            {imagePreview && (
              <div className="relative mt-4 rounded-xl overflow-hidden border border-zinc-800">
                <img src={imagePreview} alt="Preview" className="w-full h-auto object-cover max-h-64" />
                <button 
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white backdrop-blur-sm hover:bg-black/70"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {error && <p className="text-red-400 text-sm mt-4 p-3 bg-red-900/20 rounded-xl">{error}</p>}
          </div>

          <div className="p-4 border-t border-zinc-800/50 flex items-center justify-between pb-safe">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageSelect}
            />
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className="p-3 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-full transition-colors"
            >
              <ImageIcon size={22} />
            </button>
            <button 
              onClick={handlePost} 
              disabled={isUploading}
              className="px-6 py-2.5 bg-zinc-100 text-black font-bold rounded-xl hover:bg-white disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {isUploading ? <><Loader2 size={18} className="animate-spin"/> Posting</> : 'Post'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
`,
  'src/components/QuickActionMenu.tsx': `import { motion, AnimatePresence } from 'framer-motion';
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
    { icon: Edit3, label: 'Update', type: 'text', color: 'text-zinc-100' },
    { icon: Utensils, label: 'Meal', type: 'meal', color: 'text-orange-400' },
    { icon: Dumbbell, label: 'Gym', type: 'gym', color: 'text-purple-400' },
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
            className="fixed bottom-0 left-0 right-0 z-[60] bg-[#111113] rounded-t-3xl border-t border-zinc-800 pb-safe"
          >
            <div className="p-4 max-w-md mx-auto">
              <div className="flex justify-between items-center mb-6 px-2">
                <h3 className="font-bold text-zinc-100">Create Update</h3>
                <button onClick={onClose} className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors">
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
                    <div className={\`w-12 h-12 rounded-full bg-[#18181b] border border-zinc-800 flex items-center justify-center \${action.color}\`}>
                      <action.icon size={22} />
                    </div>
                    <span className="text-[10px] font-medium text-zinc-400">{action.label}</span>
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
`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(__dirname, filepath), content, 'utf8');
  console.log('Created:', filepath);
}
