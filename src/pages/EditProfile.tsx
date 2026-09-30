import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Loader2 } from 'lucide-react';

export const EditProfile = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [username, setUsername] = useState(profile?.username || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    
    // File validation
    if (!file.type.startsWith('image/')) {
      setError('This file type is not supported. Please select an image.');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5 MB.');
      return;
    }

    try {
      setIsSaving(true);
      setError('');
      
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const filePath = `${profile.id}/avatar-${Date.now()}.${fileExt}`;
      
      console.log('Attempting upload:', {
        bucket: 'avatars',
        filePath,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        userId: profile.id,
      });

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        console.error('Avatar upload failed:', uploadError);
        throw new Error('Photo upload failed. Please try again.');
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', profile.id);
        
      if (profileError) {
        console.error('Profile update failed:', profileError);
        throw new Error('Photo uploaded, but profile update failed.');
      }

      setAvatarUrl(data.publicUrl);
    } catch (err: any) {
      console.error('Upload flow error:', err);
      setError(err.message || 'Couldn\'t update your profile photo. Try again.');
    } finally {
      setIsSaving(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    setIsSaving(true);
    setError('');
    try {
      const { error: dbError } = await supabase.from('profiles').update({
        display_name: displayName,
        username,
        bio
      }).eq('id', profile.id);
      
      if (dbError) throw dbError;
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      setError('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)]">
      <header className="px-4 py-4 border-b border-[var(--theme-border)] sticky top-0 z-40 flex items-center gap-4 bg-[var(--theme-bg)]">
        <button onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
        <h1 className="font-bold">Edit Profile</h1>
      </header>

      <main className="p-4 max-w-md mx-auto space-y-6 pb-20">
        <div className="flex flex-col items-center pt-4">
           <div className="relative">
             <div className="w-24 h-24 bg-[var(--theme-card)] rounded-full overflow-hidden border-2 border-[var(--theme-border)]">
                {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[var(--theme-text-muted)] text-sm">No Image</div>}
             </div>
             <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 p-2 bg-[var(--theme-accent)] text-white rounded-full shadow-lg">
               <Camera size={16} />
             </button>
             <input type="file" ref={fileInputRef} className="hidden" accept="image/jpeg, image/png, image/webp" onChange={handleImageUpload} />
           </div>
        </div>

        {error && <div className="p-3 bg-red-900/30 text-red-400 text-sm rounded-xl">{error}</div>}
        {success && <div className="p-3 bg-green-900/30 text-green-400 text-sm rounded-xl">Profile updated ✓</div>}

        <div className="space-y-4">
          <div>
            <label className="text-xs text-[var(--theme-text-muted)] uppercase tracking-wider ml-2">Display Name</label>
            <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full mt-1 p-3 bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-xl focus:outline-none focus:border-[var(--theme-accent)]" />
          </div>
          <div>
            <label className="text-xs text-[var(--theme-text-muted)] uppercase tracking-wider ml-2">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full mt-1 p-3 bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-xl focus:outline-none focus:border-[var(--theme-accent)]" />
          </div>
          <div>
            <label className="text-xs text-[var(--theme-text-muted)] uppercase tracking-wider ml-2 flex justify-between">Bio <span>{bio.length} / 200</span></label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} maxLength={200} className="w-full mt-1 p-3 bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-xl h-24 resize-none focus:outline-none focus:border-[var(--theme-accent)]" />
          </div>
        </div>

        <button onClick={handleSave} disabled={isSaving} className="w-full py-4 bg-[var(--theme-accent)] text-white font-bold rounded-xl flex justify-center items-center gap-2">
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : 'Save Changes'}
        </button>
      </main>
    </div>
  );
};
