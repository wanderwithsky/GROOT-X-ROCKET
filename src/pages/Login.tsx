import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-zinc-100 px-4 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black tracking-tight mb-3">BAKCHODI</h1>
          <p className="text-zinc-400 font-medium tracking-wide">Groot × Rocket</p>
          <div className="mt-4 text-xs text-zinc-500 space-y-1">
            <p>Two lives.</p>
            <p>One timeline.</p>
            <p className="text-purple-400/80">Infinite bakchodi.</p>
          </div>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input type="email" placeholder="Login ID" className="w-full bg-[#111113] border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <input type="password" placeholder="Password" className="w-full bg-[#111113] border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-zinc-100 text-black font-bold rounded-xl px-4 py-3 hover:bg-white transition-colors disabled:opacity-50 mt-4 flex justify-center items-center gap-2">
            {loading ? 'Authenticating...' : 'Enter →'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
