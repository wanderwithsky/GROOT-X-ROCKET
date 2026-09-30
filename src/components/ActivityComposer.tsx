import { useState, useRef } from 'react';
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
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${profile.id}/${fileName}`;
        
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
          className="w-full max-w-md bg-[var(--theme-card)] rounded-t-3xl sm:rounded-3xl flex flex-col max-h-[90vh] overflow-hidden border border-[var(--theme-border)]"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 border-b border-[var(--theme-border)]">
            <h2 className="text-[var(--theme-text)] font-bold">{titles[type]}</h2>
            <button onClick={onClose} className="p-2 text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-4 overflow-y-auto flex-1">
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write your update..."
              className="w-full bg-transparent text-[var(--theme-text)] placeholder-zinc-500 resize-none min-h-[120px] focus:outline-none"
            />

            {imagePreview && (
              <div className="relative mt-4 rounded-xl overflow-hidden border border-[var(--theme-border)]">
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

          <div className="p-4 border-t border-[var(--theme-border)] flex items-center justify-between pb-safe">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageSelect}
            />
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className="p-3 text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] hover:bg-zinc-800 rounded-full transition-colors"
            >
              <ImageIcon size={22} />
            </button>
            <button 
              onClick={handlePost} 
              disabled={isUploading}
              className="px-6 py-2.5 bg-[var(--theme-accent)] text-white font-bold rounded-xl hover:opacity-80 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {isUploading ? <><Loader2 size={18} className="animate-spin"/> Posting</> : 'Post'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
